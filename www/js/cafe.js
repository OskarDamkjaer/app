// TODO: inte kunna anmäla sig på pass som är upptagna
// avanmäla sig från pass man är anmäld till
// council_id, hämta API?
// Rutor in line med varandra
// Nu går det inte att anmäla sig till pass längre
// Egen ruta för tiden
// "Ledig" på lediga pass
// pop-up om man försöker anmäla sig till pass som man inte får anmäla sig till
// on page:init hämta pass... ?? vaför uppdateras inte sidan när man anmält sig
// Avanmäla/ändra sina uppgifter knapp i formuläret


$$(document).on('page:init', '.page[data-name="cafe"]', function (e) {

console.log('DEBUG1')
  const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
  $.getJSON(API + '/cafe?start=2018-10-01&end=2018-11-20')
    .done(function(resp) {
      console.log('DEBUG2')
      console.log(resp.cafe_shifts);
      createDates(resp.cafe_shifts);

    })

});

var createDates = (shiftdata) => {

  var date = new Date(shiftdata[0].start);

  var yearList = [];
  var currentYear = date.getFullYear();
  var currentMonth = date.getMonth();
  var currentDay = date.getDay();
  var currentDate = date.getDate();
  var shift_id = shiftdata[0].id;
  console.log(shiftdata[0].id);
 /* getDay - name of day!! */
//  yearList.push({firstYear: currentYear,
  //  firstMonth: currentMonth,
  //  days: []}, );
  monthString = monthNames[currentMonth];
  dayString = dayNames[currentDay];
  yearList.push({firstYear: currentYear,
    months: [{days: [{shift:[], date: currentDate, day: dayString}], monthname: monthString}]
   });
  var counter_years = 0;
  var counter_months = 0;
  var counter_days = 0;
  var is_me = false;
//  yearList[counter_years].months[]
  // console.log(yearList);
//  yearList[counter_years].months.push({days:[], monthname: currentMonth});

  shiftdata.forEach(function(element) {
    date = new Date(element.start);
    shift_id = element.id;
    //user_name = element.user;
    user_name = element.user;
    if(user_name != null){
      user_name = element.user.name;
      if(element.user.id == $.auth.user.id){
        is_me = true;
        console.log('YES');
      }else{
        is_me = false;
        console.log('No');
      }
    }
    // look over the time string..
    timestring = date.getHours().toString()+':'+date.getMinutes().toString();
    if(element.pass == 1){
      timestring += ' - '+ (date.getHours() + 2).toString() +':'+date.getMinutes().toString();
    }
      if (date.getFullYear() == currentYear) { //if same year as last element put in same year
        if(date.getMonth() == currentMonth){ //if same month as last month, put in same month
          if(date.getDay() == currentDay){ // if same day as last day, put in same day
            // push the shifts into current day
              yearList[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id: shift_id, name: user_name, me: is_me});

        }else{ // create new day if not same as last
            currentDay = date.getDay();
            currentDate = date.getDate();
            dayString = dayNames[currentDay];
            counter_days++;
            // push day into current month
            yearList[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString});
            // push the first shift of the day into the day
            yearList[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id: shift_id, name: user_name, me: is_me});

          }
        }else{ // create new month if not same as last
          counter_days = 0;
          currentMonth = date.getMonth();
          currentDay = date.getDay();
          currentDate = date.getDate();
          dayString = dayNames[currentDay];
          counter_months++;
          monthString = monthNames[currentMonth];
          yearList[counter_years].months.push({days:[], monthname: monthString});
          yearList[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString});
          yearList[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id:shift_id, name: user_name, me: is_me});
        }
      } else {// If not same year as last element create new year
        counter_months = 0;
        counter_years++;
        currentYear = date.getYear();
        currentMonth =  date.getMonth();
        currentDate = date.getDate();
        currentDay = date.getDay();
        monthString = monthNames[currentMonth];
        dayString = dayNames[currentDay];
        /*
        yearList.push({firstYear: currentYear,
         months: [{days: []}]
        });
        yearList[counter_years].months.push(currentMonth);
        yearList[counter_years].months[counter_months].days.push({date: currentDate});
        */
        yearList.push({firstYear: currentYear,
          months: [{days: [{shift:[], date: currentDate, day: dayString}], monthname: monthString}]
         });
      }

    });

    console.log(yearList);
    var templateHTML = app.templates.cafeTemplate({years: yearList});
    var cafeList = $('#cafe-list');
    cafeList.html(templateHTML);
  }


  $$(document).on('page:init', '.page[data-name="cafe_shift"]', function (e) {
    var shiftId = e.detail.route.params.shiftId;
    var user = $.auth.user;
    console.log(user);
    initShiftPage(user, shiftId);
  });

  function initShiftPage(user, shiftId ){
    var shift = {
      'id': shiftId,
      'name': user.firstname + ' ' +  user.lastname,
      'committe': "",
      'competition': 'yes'}; //TODO: how to fill in a shift..
    // TODO:
    //      - if admin all names should show.
    //      - make sure one can change toggel.
    //      - Group option should pop-up only if övrig is chosen as utskott
    //      - council_id

    app.form.fillFromData('#shift-form', shift); // fill in name TODO: Make unwritable
    var committePicker = app.picker.create({
      inputEl: '#user-committe-input',
      rotateEffect: true,
      toolbarCloseText: 'Klar',
      cols: [
        {
          textAlign: 'center',
          values: ['Sexet', 'Cafémästeriet', 'Prylmästeriet', 'Övrig'],
        }
      ]
    });


    // TODO: parameter where picked utskott is saved in

    $('.shift-update').on('click', function() {
      updateShift(shift);
    //  updateAllShifts();
    });

}

function updateShift(shift) {
  //Update shift with it's new user
  var shiftData = app.form.convertToData('#shift-form');
  // Check answer to cafe competition
  if(shiftData['switch'].length == 0){
    shift['competition'] = false;
  }else{
    shift['competition'] = true;
  }
 // TODO: Add info to acctual shift
 $.ajax({
   url: API + '/cafe',
    type: 'POST',
   dataType: 'json',
   data: {
     cafe_shift_id: shift['id'],
      cafe_worker: {
        user_id: $.auth.user.id,
        council_ids: [1],
        group: shift['group'],
        competition: shift['competition']
      }
   },
   success: function(){
     console.log(app);
     alternativesView.router.navigate('/cafe/');
     var element, name, arr;
       element = document.getElementById(shift['id']);
       var el = $('#' + shift['id']);
       console.log(el);
       console.log(shift['id']);
        green = "bg-color-green";
        red = "bg-color-red";
        el.addClass(green);
        el.removeClass(red);
        app.dialog.create({
            title: 'Nu är du uppskriven på passet! ',
            text: 'Tack för att du vill jobba i caféet! Kom ihåg att avanmäla dig om du får förhinder.',
            buttons: [
              {
                text: 'Ok',
              }
            ],
            horizontalButtons: true,
          }).open();
      //  el.find(".timeline-item-text").text($.auth.user.name);

      //  console.log(el.find(".timeline-item-text"));
   },
   error: function(){
     alternativesView.router.navigate('/cafe/');
     app.dialog.create({
         title: 'Något gick fel! ',
         text: 'Testa att anmäla dig igen.',
         buttons: [
           {
             text: 'Ok',
           }
         ],
         horizontalButtons: true,
       }).open();

   }
  });
//TODO: update main page





    //arr = el.className.split(" ");
    // if (arr.indexOf(name) == -1) {
    //    el.className += " " + name;
    // }

}




  // console.log(dates[dates.length-1].start.split('-')[0]);
  // start_year = dates[0].start.split('-')[0];
  // end_year = dates[dates.length-1].start.split('-')[0];
  // end_year = 2020
  // for(var i = start_year; i <= end_year; i++){
  //   let node = document.createElement("DIV");
  //   node.className = "timeline-year";
  //   node.id = i;
  //   let node_y = document.createElement("DIV");
  //   node_y.style.color = 'black';
  //   node_y.className = 'timeline-year-title';
  //   node_y.innerHTML =
  //   "<span>"+i+"</span>";
  //   //"<div class='timeline-year-title'style='color: #000'><span>"+i+"</span></div>";
  //     //for each month between start and stop
  //     console.log('hej!!');
  //   let node_m = document.createElement("DIV");
  //   let node_m_c = document.createElement("DIV");
  //
  //   node_m.className = "timeline-month";
  //   //node_m_c.style.color = 'black';
  //   //node_m_c.className = 'timeline-month-title';
  //   node_m.innerHTML =
  //   "<div class='timeline-month-title'style='color:#000'><span>December</span></div>";
  //   document.getElementById("years").appendChild(node);
  //   document.getElementById(i).appendChild(node_y);
  //   document.getElementById(i).appendChild(node_m);
  //   //node_m.appendChild(node_m_c);
  //
  //   let node_i = document.createElement("DIV");
  //   node_i.className = "timeline-item";
