var base64ToImage = require('base64-to-image');
var fs = require('fs');
var path = require('path');



const convertdata = (username ,base64raw, dataname, namedir) => {
    
        let ipserver = 'http://3.17.236.174:3000';
        let direction =  path.resolve("./") + '/uploads/'+ namedir +'/' + username +'/';    
        let base64Str = base64raw;
        let optionalObj = {'fileName': username + '_' + Date.now(),'type':'jpg'};
        base64ToImage(base64Str,direction,optionalObj);
        var imageInfo = base64ToImage(base64Str, direction, optionalObj);
        return ipserver + '/' + namedir + '/' + username + '/' + imageInfo.fileName;
    
}
exports.base64toimage = (userData) => {
    let namedir = 'driver';
    const dir = './uploads/' + namedir +'/'+ userData.user_id + '/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }

    let data = [userData.photo, userData.tampak_depan, userData.tampak_samping, userData.tampak_belakang, userData.foto_identitas, userData.foto_stnk ];
    let dataname = ['photo', 'tampak_depan', 'tampak_samping', 'tampak_belakang', 'foto_identitas', 'foto_stnk']
    let urlpath = [];

    for (var i = 0; i < data.length; i++) {
        
        if (data[i].length < 30){
            urlpath[i] = 'kosong';
            continue;
         }else{
            let result = convertdata(userData.username, data[i], dataname[i],namedir);
            urlpath[i] = result;
        }
      }
    const body={
        photo : urlpath[0], tampak_depan : urlpath[1], tampak_samping : urlpath[2],
        tampak_belakang : urlpath[3], foto_identitas : urlpath[4], foto_stnk : urlpath[5],
    }
      
    return body;
}

exports.convImagemerchantpemilik = (userData) => {
    let namedir = 'merchant';
    const dir = './uploads/' + namedir +'/' + userData.username + '/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }

    let data = [userData.media_family, userData.media_identity ];
    let dataname = ['foto_kk', 'foto_ktp']
    let urlpath = [];

    for (var i = 0; i < data.length; i++) {
        
        if (data[i].length < 30){
            urlpath[i] = 'kosong';
            continue;
         }else{
            let result = convertdata(userData.username, data[i], dataname[i],namedir);
            urlpath[i] = result;
        }
      }
    const body={
        media_family : urlpath[0], media_identity : urlpath[1]
    }
      
    return body;
}

exports.convImagemerchantproduk = (userData) => {
    let namedir = 'merchant';
    const dir = './uploads/' + namedir +'/' + userData.restaurant_id + '/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    let data = [userData.media_photo];
    let dataname = [userData.name]
    let urlpath = [];

    for (var i = 0; i < data.length; i++) {
        
        if (data[i].length < 30){
            urlpath[i] = 'kosong';
            continue;
         }else{
            let result = convertdata(userData.restaurant_id, data[i], dataname[i],namedir);
            urlpath[i] = result;
        }
      }
    const body={
        media_photo : urlpath[0]
    }
      
    return body;
}

exports.convImagemerchantrestoran = (userData) => {
    let namedir = 'merchant';
    const dir = './uploads/' + namedir +'/' + userData.user_id + '/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    let data = [userData.media_logo, userData.media_banner ];
    let dataname = ['logo restoran', 'banner restoran']
    let urlpath = [];

    for (var i = 0; i < data.length; i++) {
        
        if (data[i].length < 30){
            urlpath[i] = 'kosong';
            continue;
         }else{
            let result = convertdata(userData.user_id, data[i], dataname[i],namedir);
            urlpath[i] = result;
        }
      }
    const body={
        media_logo : urlpath[0], media_banner : urlpath[1]
    }
      
    return body;
}