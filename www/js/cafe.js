

//Init cafe
myApp.onPageInit('caferegister', function (page) {

    var data = new Object();
    data.start = '2018-02-18';
    data.end = '2018-02-20';

    $.getJSON(API + '/cafe/index/', data)
    .done(function(resp){
        console.log('worked');
    })
    .fail(function(resp){
        console.log('didnt');
    });

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

    var groups = getGroups();
 //   var templateHTML = myApp.templates.groupTemplate(groups);
    var groupContent = $('.groupselect');
    groupContent.html(groups);

});
