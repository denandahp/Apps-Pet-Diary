exports.createschedule = (data) => {
  var message = {
    data: {
      uid: data.uid,
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


exports.postcontentful = (data, tokens) => {
  var message = {
    data: {
      type: data.sys.type,
      click_notif: 'POST_CONTENTFUL'
    },
    notification: {
      title: 'Hi, we have the hot news today',
      body: data.notification_body,
    },
    token: tokens
  }

  return {"payload" : message}
}