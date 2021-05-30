const debug = require('debug')('app:controller:uploadImage');
const pool = require('../libs/db');
const uploadImage = require('../controllers/paramUpload.js');



class uploadImageModel{


    async post (req, res) {
        //<role>/<id_user>/<page>/<namafile>-<Date NOW()>
        //merchant/12/informasiusaha/ktp-1512124151.jpg
        //let multiUpload = upload.array('gambar',12);  //untuk upload banyak gambar
        const galleryImgLocationArray = [];
        let multiUpload =  uploadImage.paramS3(req,res);
         multiUpload(req, res, function(err){
            //console.log( 'files', req.files );
            if( err ){
                console.log( 'errors', err );
                res.json( { err: err } );
            } else {
                // If File not found
                if( req.files === undefined ){
                    console.log( 'Error: No File Selected!' );
                    res.json( 'Error: No File Selected' );
                } else {
                    // If Success
                    let fileArray = req.files,
                        fileLocation;
                      
                    for ( let i = 0; i < fileArray.length; i++ ) {
                        fileLocation = fileArray[ i ].location;
                        console.log( 'filenm', fileLocation );
                        galleryImgLocationArray.push( fileLocation )
                    }
                    //let filereq = JSON.parse(JSON.stringify(req.files));
                    //console.log(filereq.metadata);
                    // Save the file name into database
                    let detail = {"originalname":  req.files[0].originalname, "mimetype":  req.files[0].mimetype, "size" :  req.files[0].size, "bucket" :  req.files[0].bucket};
                    let metaData = req.files[0].metadata;
                    return res.status(200).json({
                      pesan: "Gambar Berhasil Diupload",
                      url: galleryImgLocationArray,
                      metaData,
                      detail
                    })
                }
            }
        });
    }

    async update (data, datagambar) {
      var d = new Date(Date.now());
        console.log(datagambar);
        let sets = [data.id, data.name, datagambar.media_family, datagambar.media_identity, data.no_identity, data.birthday, d, data.state_profil_pemilik]
        let res = await pool.query('UPDATE' + dbTable + 'SET (name, media_family, media_identity, no_identity, birthday, updated_at, state_profil_pemilik) = ($2, $3, $4, $5, $6, $7, $8) WHERE id = $1 RETURNING *;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
    }

}

module.exports = new uploadImageModel();