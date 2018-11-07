

$$(document).on('page:init', '.page[data-name="cafe"]', function (e) {
console.log('hej :)')
  const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];

  $.getJSON(API + '/cafe?start=2018-10-25&end=2018-11-04')
    .done(function(resp) {
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
    // months: [{days: [], monthname: currentMonth}]
    months: [{days: [{shift:[], date: currentDate, day: dayString, id: shift_id}], monthname: monthString}]
   });
  var counter_years = 0;
  var counter_months = 0;
  var counter_days = 0;

//  yearList[counter_years].months[]
  // console.log(yearList);
//  yearList[counter_years].months.push({days:[], monthname: currentMonth});

  shiftdata.forEach(function(element) {
    date = new Date(element.start);
    shift_id = element.id;

    // look over the time string..
    timestring = date.getHours().toString()+':'+date.getMinutes().toString();
    if(element.pass == 1){
      timestring += ' - '+ (date.getHours() + 2).toString() +':'+date.getMinutes().toString();
    }
      if (date.getFullYear() == currentYear) { //if same year as last element put in same year
        if(date.getMonth() == currentMonth){ //if same month as last month, put in same month
          if(date.getDay() == currentDay){ // if same day as last day, put in same day
            // push the shifts into current day
            yearList[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring});
        }else{ // create new day if not same as last
            currentDay = date.getDay();
            currentDate = date.getDate();
            dayString = dayNames[currentDay];
            counter_days++;
            // push day into current month
            yearList[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString, id: shift_id});
            // push the first shift of the day into the day
            yearList[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring});

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
          yearList[counter_years].months[counter_months].days.push({shift: [], date: currentDate, day: dayString, id: shift_id});
          yearList[counter_years].months[counter_months].days[counter_days].shift.push({pass: element.pass, time: timestring});
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
          months: [{days: [{shift:[], date: currentDate, day: dayString, id: shift_id}], monthname: monthString}]
         });
      }

    });

    console.log(yearList);
   var templateHTML = app.templates.cafeTemplate({years: yearList});
    var cafeList = $('#cafe-list');
    cafeList.html(templateHTML);
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
