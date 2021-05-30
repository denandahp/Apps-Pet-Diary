//------------------------------------------------------------------------------------
//                                JFOOD
//-------------------------------------------------------------------------------------

exports.orderfoodtodriver = (data, result) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      click_notif: 'ORDER_IN'
    },
    notification: {
      title: 'Orderan Masuk',
      body: 'Pesanan JFOOD dibuat atas nama ' + data.name,
    },
    android: {
      notification: {
        click_action: 'ORDER_IN'      }
    },
    token: result.rows[0].token_notification
  };
      
    return {"payload" : message};
}

exports.orderfood_customertomerchant = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      click_notif: 'JFOOD_ORDER_IN_MERCHANT'
    },
    notification: {
      title: 'Pesanan Masuk',
      body: 'Pesanan JFOOD dibuat atas nama ' + data.name,
    },
    android: {
      notification: {
        click_action: 'JFOOD_ORDER_IN_MERCHANT'      }
    },
    token: data.token_merchant
  };
      
    return {"payload" : message};
}

exports.rejectedfood_customertomerchant = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      reason : data.reason_customer_rejected,
      click_notif: 'JFOOD_REJECT_FROM_CUSTOMER'
    },
    notification: {
      title: 'Pesanan Dibatalkan',
      body: 'Pesanan JFOOD dibatalkan oleh ' + data.name ,
    },
    android: {
      notification: {
        click_action: 'JFOOD_REJECT_FROM_CUSTOMER'      }
    },
    token: data.token_merchant
  };
      
    return {"payload" : message};
}

exports.rejectedfood_merchanttocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id : data.restaurant_id,
      reason : data.reason_merchant_rejected,
      click_notif: 'JFOOD_REJECT_MERCHANT'
    },
    notification: {
      title: 'Pesanan Ditolak ',
      body: 'Pesanan JFOOD ditolak oleh restaurant ',
    },
    android: {
      notification: {
        click_action: 'JFOOD_REJECT_MERCHANT'}
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.orderfood_merchanttodriver = (data, result) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id: String(result.rows[0].id),
      click_notif: 'JFOOD_ORDER_DRIVER'
    },
    notification: {
      title: 'Orderan JFOOD Masuk',
      body: 'Pesanan JFOOD dibuat atas nama ' + data.name,
    },
    android: {
      notification: {
        click_action: 'JFOOD_ORDER_DRIVER'      }
    },
    token: result.rows[0].token_notification
  };
      
    return {"payload" : message};
}

exports.orderfood_drivertomerchant = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_DRIVER_TO_MERCHANT'
    },
    notification: {
      title: 'JFOOD',
      body: 'Driver sedang menuju ke resto, atas nama ' + data.name + ' no pesanan ' + data.kode,
    },
    android: {
      notification: {
        click_action: 'JFOOD_DRIVER_TO_MERCHANT'      }
    },
    token: data.token_merchant
  };
      
    return {"payload" : message};
}

exports.orderfood_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_DRIVER_TO_RESTO'
    },
    notification: {
      title: 'JFOOD',
      body: 'Driver sedang menuju ke resto untuk memesan makanan'
    },
    android: {
      notification: {
        click_action: 'JFOOD_DRIVER_TO_RESTO'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.processfood_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_ORDER_IN_PROCESS'
    },
    notification: {
      title: 'Driver sudah di resto',
      body: 'Pesanan sedang dibuat oleh resto'
    },
    android: {
      notification: {
        click_action: 'JFOOD_ORDER_IN_PROCESS'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.processfood_merchanttodriver = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_ORDER_READY'
    },
    notification: {
      title: 'Pesanan Selesai',
      body: 'Driver bisa mengambil pesanannya'
    },
    android: {
      notification: {
        click_action: 'JFOOD_ORDER_READY'      }
    },
    token: data.token_driver
  };
      
    return {"payload" : message};
}

exports.deliverfood_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_DRIVER_DELIVERED'  
    },
    notification: {
      title: 'Pesanan Selesai diBuat',
      body: 'Driver sedang menuju ke lokasi anda'
    },
    android: {
      notification: {
        click_action: 'JFOOD_DRIVER_DELIVERED'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.arrivedfood_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_DRIVER_IN_LOCATION'
    },
    notification: {
      title: 'Orderan Sampai',
      body: 'Driver sudah sampai dilokasi anda'
    },
    android: {
      notification: {
        click_action: 'JFOOD_DRIVER_IN_LOCATION'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.finishedfood_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_ORDER_FINISHED'
    },
    notification: {
      title: 'Orderan Selesai',
      body: 'Selamat menikmati makannnya'
    },
    android: {
      notification: {
        click_action: 'JFOOD_ORDER_FINISHED'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.finishedfood_drivertomerchant = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      driver_id : data.driver_id,
      click_notif: 'JFOOD_ORDER_MERCHANT_FINISHED'
    },
    notification: {
      title: 'Orderan telah selesai',
      body: 'Driver sudah mengambil pesanannya',
    },
    android: {
      notification: {
        click_action: 'JFOOD_ORDER_MERCHANT_FINISHED'      }
    },
    token: data.token_merchant
  };
      
    return {"payload" : message};
}

//------------------------------------------------------------------------------------
//                                JRIDE
//-------------------------------------------------------------------------------------

exports.orderjride_customertodriver = (data, result) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      driver_id: String(result.rows[0].id),
      click_notif: 'JRIDE_ORDER_DRIVER'
    },
    notification: {
      title: 'Orderan JRIDE Masuk',
      body: 'Pesanan JRIDE dibuat atas nama ' + data.name,
    },
    android: {
      notification: {
        click_action: 'JRIDE_ORDER_DRIVER'      }
    },
    token: result.rows[0].token_notification
  };
      
    return {"payload" : message};
}

exports.acceptjride_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      driver_id : data.driver_id,
      click_notif: 'JRIDE_ACCEPT_ORDER'
    },
    notification: {
      title: 'JRIDE',
      body: 'Driver sedang menuju ke lokasi anda ',
    },
    android: {
      notification: {
        click_action: 'JRIDE_ACCEPT_ORDER'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.deliverjride_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      driver_id : data.driver_id,
      click_notif: 'JRIDE_DELIVER_ORDER'
    },
    notification: {
      title: 'JRIDE',
      body: 'Driver mengantar ke tujuan anda ',
    },
    android: {
      notification: {
        click_action: 'JRIDE_DELIVER_ORDER'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}

exports.finishedjride_drivertocustomer = (data) => {
  
  var message = {
    data: {
      kodePemesanan: data.kode,
      user_id: data.user_id,
      driver_id : data.driver_id,
      click_notif: 'JRIDE_FINISHED_ORDER'
    },
    notification: {
      title: 'JRIDE',
      body: 'Sudah sampai ditujuan anda ',
    },
    android: {
      notification: {
        click_action: 'JRIDE_FINISHED_ORDER'      }
    },
    token: data.token_customer
  };
      
    return {"payload" : message};
}
