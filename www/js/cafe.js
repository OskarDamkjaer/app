// TODO:
// council_id - change name from committe to council.. OK
// pop-up om man försöker anmäla sig till pass som man inte får anmäla sig till OK
// Ändra sina uppgifter knapp i formuläret
// pop-up om man kickar på någon annans pass (?)
// Bläddra mellan veckorna??
// Vilken text ska det stå i popup rutorna
//    //todo is there any longer shifts? for now only two or three hours :)

// TODO:
//      - if admin all names should show - search for all names
//      - Group option should pop-up only if övrig is chosen as utskott
//      - if already signed up on shift autofill..
$$(document).on('page:init', '.page[data-name="cafe"]', function (e) {
  // Want to collect existing shifts between today and end
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd = '0'+dd
  }
  if(mm<10) {
      mm = '0'+mm
  }
  today = yyyy + '-' + mm + '-' + dd;
  // Set end date 7 weeks from now
  var end = new Date();
  end.setDate(end.getDate()+7*7);
  var dd = end.getDate();
  var mm = end.getMonth()+1; //January is 0!
  var yyyy = end.getFullYear();
  // Change format of string
  if(dd<10) {
      dd = '0'+dd
  }
  if(mm<10) {
      mm = '0'+mm
  }
  end = yyyy + '-' + mm + '-' + dd;
  // Collect all sifts between the two dates
  // NOTE: It is important that the shifts are ordered chronological
  $.getJSON(API + '/cafe?start='+today+'&end='+end)
    .done(function(resp) {
      createDates(resp.cafe_shifts);
    })
});

var shiftDict = []; // Global so can reach from initSignUpPage

function createDates(shiftdata){
  shiftDict = [];

  // Save info about first shift so we have something to compare with
  var date = new Date(shiftdata[0].start);
  var currentYear = date.getFullYear();
  var currentMonth = date.getMonth();
  var currentDay = date.getDay();
  var currentDate = date.getDate();
  var shift_id = shiftdata[0].id;

  // Save the first date in the dict
  monthString = monthNames[currentMonth];
  dayString = dayNames[currentDay];
  // Here you see the structure of the dict
  shiftDict.push({years: currentYear,
    months: [{days: [{shift:[], date: currentDate, day: dayString}], monthname: monthString}]
   });

  // Initialize some counter variables
  var counter_years = 0;
  var counter_months = 0;
  var counter_days = 0;
  var is_me = false; // Use when coloring the shift-boxes
  var last_timestring = 0;
  var timestring = 0;
//TODO: one could probably just update the date object instead of having all strings..
  shiftdata.forEach(function(element){
    date = new Date(element.start);
    shift_id = element.id;

    // Get name of user on shift and if it is me
    user_name = element.user;
    if(user_name != null){
      user_name = element.user.name;
      if(element.user.id == $.auth.user.id){
        is_me = true;
      }else{
        is_me = false;
      }
    }else{
      is_me = false;
    }

    var minutes = date.getMinutes().toString();
    if(minutes<10){
      minutes = '0' + minutes;
    }
    timestring = date.getHours().toString()+':'+minutes;
    timestring = format_timestring(timestring, element, date);

      if (date.getFullYear() == currentYear) { //if same year as last element put in same year
        if(date.getMonth() == currentMonth){ //if same month as last month, put in same month
          if(date.getDay() == currentDay){ // if same day as last day, put in same day
            if(timestring == last_timestring){
              timestring = []; // Don't want to show time for all shifts - only first
            }else{
              last_timestring = timestring;
            }
            // push the shifts into current day
            shiftDict[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id: shift_id, name: user_name, me: is_me});
        }else{ // create new day if not same as last
          while(date.getDate()-currentDate>1){
            currentDate = currentDate + 1;
            if(currentDay<7){
              currentDay++;
            }else{
              currentDay = 1; // if we would have a shift on a monday...
            }
            if(currentDay<6){//Don't show weekends if no shift..
            counter_days++;
              dayString = dayNames[currentDay];
              shiftDict[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString});
            }else{
              // TODO: maybe add something to distinguish weeks
            }
          }
            currentDay = date.getDay();
            currentDate = date.getDate();
            dayString = dayNames[currentDay];
            counter_days++;
            // push day into current month
            shiftDict[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString});
            // push the first shift of the day into the day
            shiftDict[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id: shift_id, name: user_name, me: is_me});
            last_timestring = timestring;
          }
        }else{ // create new month if not same as last
          counter_days = 0;
          currentMonth = date.getMonth();
          currentDay = date.getDay();
          currentDate = date.getDate();
          dayString = dayNames[currentDay];
          counter_months++;
          monthString = monthNames[currentMonth];
          shiftDict[counter_years].months.push({days:[], monthname: monthString});
          shiftDict[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString});
          shiftDict[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id:shift_id, name: user_name, me: is_me});
          last_timestring = timestring;

        }
      } else {// If not same year as last element create new year
        counter_months = 0;
        counter_days = 0;

        counter_years++;
        currentYear = date.getFullYear();
        console.log(currentYear);
        currentMonth =  date.getMonth();
        currentDate = date.getDate();
        currentDay = date.getDay();
        monthString = monthNames[currentMonth];
        dayString = dayNames[currentDay];

         shiftDict.push({years: currentYear,
           months: [{days: [{shift:[], date: currentDate, day: dayString}], monthname: monthString}]
         });
         shiftDict[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring, id: shift_id, name: user_name, me: is_me});
         last_timestring = timestring;
      }

    });

    // Send the dict to html
    var templateHTML = app.templates.cafeTemplate({years: shiftDict});
    var cafeList = $('#cafe-list');
    cafeList.html(templateHTML);
  }

function format_timestring(timestring, element, date){
  // Help function to format the timestring correct
    if(element.pass == 1){
      var minutes = date.getMinutes().toString();
      if(minutes <10){
        minutes = '0' + minutes;
      }
      timestring += ' - '+ (date.getHours() + 2).toString() +':'+minutes;
    }else if(element.pass == 2){
      var minutes = date.getMinutes().toString();
      if(minutes < 10){
        minutes = '0' + minutes;
      }
      timestring += ' - '+ (date.getHours() + 3).toString() +':'+minutes;
    }
    return timestring;
  }

  $$(document).on('page:init', '.page[data-name="cafe_shift"]', function (e) {
    // Initialize the sign up page
    var shiftId = e.detail.route.params.shiftId;
    var isMe = e.detail.route.params.isMe;
    var user = $.auth.user;
    initSignUpPage(user, shiftId, isMe);
  });

  function initSignUpPage(user, shiftId, isMe){
    // Get information about shift - use to write text in signup page
    var my_user = $.auth.user;
    var isMe = false;
    for(var year in shiftDict){
      for( var month in shiftDict[year].months){
        for( var day in shiftDict[year].months[month].days){
          for( var shift in shiftDict[year].months[month].days[day].shift){
            id = shiftDict[year].months[month].days[day].shift[shift].id;
            if(id == shiftId){ // Now get info about shift
              isMe = shiftDict[year].months[month].days[day].shift[shift].me;
              shift_user = shiftDict[year].months[month].days[day].shift[shift].name;
              year_ = shiftDict[year];
              month_ = shiftDict[year].months[month];
              day_ = shiftDict[year].months[month].days[day];
              shift_ = shiftDict[year].months[month].days[day].shift[shift];
            }
          }
        }
      }
    }
    $('#header_text').html('Anmälan till pass kl ' + shift_.time +  '<br/>' + day_.day +' den ' + day_.date + ' ' + month_.monthname + ' ' + year_.years);

    var shift = {
      'id': shiftId,
      'name': user.firstname + ' ' +  user.lastname,
      'committe': "",
      'competition': 'yes'};

    app.form.fillFromData('#shift-form', shift);

    // get all possible councils
    var councils_name = [];
    var councils_all = {}; // connect id with council name
    $.getJSON(API + '/councils')
      .done(function(resp) {
        for (var c in resp.councils) {
          councils_name.push(resp.councils[c].title);
          councils_all[resp.councils[c].title] = resp.councils[c].id;
        }

      });
    // initialize scroll council picker
    var committePicker = app.picker.create({
      inputEl: '#user-committe-input',
      rotateEffect: true,
      toolbarCloseText: 'Klar',
      cols: [
        {
          textAlign: 'center',
          values: councils_name,
        }
      ]
    });
    $('.shift-update').on('click', function() {
      updateShift(shift, councils_all);
    });
    $('.shift-unsign').on('click', function() {
      unsignShift(shift, councils_all);//TODO
    });
    // is this the best way to do it..?
     if(isMe==false){
       // hide unsign button if not signed up yet
      $('.shift-unsign').hide();
  }else{
      // Here one could add the feature to update info on shif
      // but then one need to be able to edit a shift using ajax (TODO)
      $('.shift-update').hide();
  }

}

function updateShift(shift, councils_all) {
  //Update shift with it's new user
  var shiftData = app.form.convertToData('#shift-form');
  // Check answer to cafe competition
  if(shiftData['switch'].length == 0){
    shift['competition'] = false;
  }else{
    shift['competition'] = true;
  }
  shift['committe'] = shiftData['committe'];

 // Send info to server and finn in acctual shift
 $.ajax({
   url: API + '/cafe',
    type: 'POST',
   dataType: 'json',
   data: {
     cafe_shift_id: shift['id'],
      cafe_worker: {
        user_id: $.auth.user.id,
        council_ids: councils_all[shift['committe']],
        group: shift['group'],
        competition: shift['competition']
      }
   },
   success: function(){
     alternativesView.router.back('/cafe/',{force: true}); // force: reload page
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
   },
   error: function(){
     // Fail if already signed up on shift at the same time
     alternativesView.router.back('/cafe/',{force: true});

     app.dialog.create({
         title: 'Något gick fel! ',
         text: 'Du kanske redan är anmäld på ett pass vid samma tid?',
         buttons: [
           {
             text: 'Ok',
           }
         ],
         horizontalButtons: true,
       }).open();
   }
  });
}

function unsignShift(shift){
  $.ajax({
    url: API + '/cafe/'+shift['id'],
     type: 'DELETE',
    dataType: 'json',
    success: function(){
      alternativesView.router.back('/cafe/',{force: true});

         app.dialog.create({
             title: 'Nu är du nu avanmäld från passet! ',
             text: 'Tipsa en kompis om att anmäla sig på passet istället!',
             buttons: [
               {
                 text: 'Ok',
               }
             ],
             horizontalButtons: true,
           }).open();
    },
    error: function(){
      alternativesView.router.back('/cafe/',{force: true});

      app.dialog.create({
          title: 'Något gick fel! ',
          text: 'Det gick inte att avanmäla dig från passet.',
          buttons: [
            {
              text: 'Ok',
            }
          ],
          horizontalButtons: true,
        }).open();

    }
   });
}

function admin_init(){
// TODO: Implement so admin can make changes
}
