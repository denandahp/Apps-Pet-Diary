const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
 

const s3 = new aws.S3({

        accessKeyId: 'AKIAIDNMQXLE7HX2SERQ',
        secretAccessKey: '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',
        region: 'us-east-2'
    
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'jatstorage',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA'});
    },
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now().toString() + '_'+ file.originalname)
    }
  })
})

module.exports = upload;