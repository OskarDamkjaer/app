function setupPush() {
  var push = PushNotification.init({
    "android": {
      "senderID": "509736475453",
      "icon": "f",
      "iconColor": "#EB7125"
    },
    "ios": {
      "sound": true,
      "alert": true,
      "badge": true
    }
  });

  // Create or update the registration id on the server
  push.on('registration', function(data) {
    var oldId = localStorage.getItem('registrationId');

    if (oldId !== data.registrationId) {
      localStorage.setItem('registrationId', data.registrationId);
      updatePushDevice(oldId, data.registrationId);
    }
  });

  push.on('error', function(e) {
    console.log("push error = " + e.message);
  });

  push.on('notification', function(data) {
    /*navigator.notification.alert(
      data.message,         // message
      null,                 // callback
      data.title,           // title
      'OK'                  // buttonName
    );*/
    getNotifications(false);
  });
}

function updatePushDevice(oldId, newId) {
  createPushDevice(newId);

  if (oldId !== null)
    deletePushDevice(oldId);
}

// Create a new push device for this user
function createPushDevice(registrationId) {
  $.ajax({
    url: API + '/push_devices',
    type: 'POST',
    dataType: 'json',
    data: {push_device: {token: registrationId, system: cordova.platformId}},
    error: function(resp) {
      alert("Failed to create push device id!");
    }
  });
}

// Delete a push device belonging to this user
function deletePushDevice(registrationId) {
  $.ajax({
    url: API + '/push_devices',
    type: 'DELETE',
    dataType: 'json',
    data: {token: registrationId},
    error: function(resp) {
      alert("Failed to delete push device id!");
    }
  });
}
