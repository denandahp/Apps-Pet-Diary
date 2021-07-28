exports.createschedule = (data) => {
  var message = {
    data: {
      uid: data.uid,
      note_id : data.id,
      click_notif: 'CREATE_SCHEDULE'
    },
    notification: {
      title: data.notification_title,
      body: data.notification_body,
    },
    android: {
      notification: {
        click_action: 'CREATE_SCHEDULE'}
    },
    token: data.notification_token
  };
      
    return {"payload" : message};
}
