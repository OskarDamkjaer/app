

//Init cafe
myApp.onPageInit('caferegister', function (page) {

    //Init pickers

    $.getJSON(API + '/groups')
      .then(function(resp) {
        var groups = resp.groups.reverse();
        if(groups.length != 0) {
          var list = [];
          for(i = 0; i < groups.length; i++) {
            list[i] = groups[i].name;
            console.log(list[i]);
          }
        }
        initGroupPicker(list);
        console.log(resp);
    });

    var data = new Object();
    data.start = '2018-02-25';
    data.end = '2018-02-28';

    $.getJSON(API + '/cafes/', data)
    .done(function(resp){
      console.log(resp);
        console.log(resp.cafe_shifts[0].id);
        work(resp.cafe_shifts[0].id);

    })
    .fail(function(resp){
        console.log(resp);
    });


    //Init infinite scroll

    var loading = false;
     
    // Last loaded index
    var lastIndex = $$('.list-block li').length;
     
    // Max items to load
    var maxItems = 60;
     
    // Append items per load
    var itemsPerLoad = 20;
     
    // Attach 'infinite' event handler
    $$('.infinite-scroll').on('infinite', function () {
     
      // Exit, if loading in progress
      if (loading) return;
     
      // Set loading flag
      loading = true;
     
      // Emulate 1s loading
      setTimeout(function () {
        // Reset loading flag
        loading = false;
     
        if (lastIndex >= maxItems) {
          // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
          myApp.detachInfiniteScroll($$('.infinite-scroll'));
          // Remove preloader
          $$('.infinite-scroll-preloader').remove();
          return;
        }
     
        // Generate new items HTML
        var html = '';
        for (var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
          html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
        }
     
        // Append new items
        $$('.list-block ul').append(html);
     
        // Update last loaded index
        lastIndex = $$('.list-block li').length;
      }, 1000);
    }); 

});

function initGroupPicker(groupData) {
    //init variables
    var groupPicker = myApp.picker({
      input: '#group-picker',
      toolbarCloseText: 'Klar',
      cols: [
      {
        textAlign: 'center',
        values: groupData
      }
      ],
        onClose: function(){

      }
    });
}

function initUtskottPicker(utskottData) {
    //init variables
    var groupPicker = myApp.picker({
      input: '#utskott-picker',
      toolbarCloseText: 'Klar',
      cols: [
      {
        textAlign: 'center',
        values: utskottData
      }
      ],
      onClose: function(){

      }
    });

}

function work(id) {
    $.ajax({
      url: API + '/cafes/',
      type: 'POST',
      dataType: 'json',
      data: {
        cafe_shift_id: id
      },
      success: function(resp) {
        myApp.alert('Du är nu anmäld till eventet', 'Anmälan');
        updateSignupContent(eventData);
      },
      fail: function(resp) {
        myApp.alert(resp.data.errors);
      }
    });
}
