const admin = require("../config/firebase_config.js");
const axios = require('axios');
const notifbody = require('../models/notificationBody.js');
const pool = require('../libs/db');
const Router = require('express').Router();


const schema = '"users"';
const dbViewprofile = schema + '.' + '"profile_user"';


//Pak mahmudi
const url = 'https://cdn.contentful.com/spaces/p4stxfymwhqd/environments/master/entries'
const token = 'order=sys.createdAt&access_token=okjmWMGmwQYyEQELGVcZ-01PrrVhhN1g4TCprTCUM3I'

//Nusantera
//const url = 'https://cdn.contentful.com/spaces/qtkmssz6omcr/environments/master/entries'
//const token = 'order=sys.createdAt&access_token=iA7Az6-D9yOxIxh1q5e9-ya7U2YT6_pBOKnyEydE7Wc'

Router.post('/new/content',
    async function(req, res, next) {
        let data = req.body
//	res.send(data)
//          console.log(req.body)
            //console.log(req.headers)
            //virtual response
        let valueForNotif = {
                id: data.id,
                type: data.type,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt

            }
            //res.status(200).send("OKAY")
        const tokens = [];
        let querys = await pool.query('SELECT * from ' + dbViewprofile + ' ORDER BY user_id ASC')
        querys.rows.forEach((item) => {
            if (item.token_firebase) {
                tokens.push(item.token_firebase);
            }
        })
        let body = notifbody.postcontentful(data, tokens);
//        res.status(200).send(tokens)
//	console.log(body.payload)
        admin.messaging().sendMulticast(body.payload)
            .then((response) => {
                let message = response.successCount + ' messages were sent successfully'
                 console.log(response.successCount + ' messages were sent successfully');
                res.status(200).json({
                    pesan: message,
                    result: response,
                })
            })
    }
);


Router.get('/head/:skip?',
    function(req, res, next) {
        var url_combine = url + '?' + token

        if (req.params.skip != undefined) {
            url_combine = url + '?skip=' + req.params.skip + '&' + token
        }

        axios.get(url_combine)
            .then(function(response) {
                // handle success

                var images = response.data.includes.Asset.map(data => {
                    return {
                        id: data.sys.id,
                        image_url: data.fields.file.url.replace("//", ""),
                        image_size: data.fields.file.details.image
                    }
                })

                var head = response.data.items.map(data => {
                    // console.log(data.fields.images)
                    return {
                        id: data.sys.id,
                        createdAt: data.sys.createdAt,
                        updatedAt: data.sys.updatedAt,
                        title: data.fields.title,
                        images: data.fields.images.map(data2 => {

                            return images.find(item => {
                                return item.id == data2.sys.id
                            })
                        })

                    }
                })


                res.status(200).json({
                    message: "Success",
                    total: response.data.total,
                    skip: req.params.skip,
                    limit: response.data.limit,
                    head: head
                })

            })
            .catch(function(error) {
                // handle error
                res.status(200).json({
                    message: "News empty",
                    total: 0,
                    skip: req.params.skip,
                    limit: 0,
                    head: []
                })
            })
            .then(function() {
                // always executed
            });
    }
);

Router.get('/featured',
    function(req, res, next) {
        var url_combine = url + '?skip=0&limit=2&' + token



        axios.get(url_combine)
            .then(function(response) {
                // handle success

                var images = response.data.includes.Asset.map(data => {
                    return {
                        id: data.sys.id,
                        image_url: data.fields.file.url.replace("//", ""),
                        image_size: data.fields.file.details.image
                    }
                })

                var head = response.data.items.map(data => {
                    // console.log(data.fields.images)
                    return {
                        id: data.sys.id,
                        createdAt: data.sys.createdAt,
                        updatedAt: data.sys.updatedAt,
                        title: data.fields.title,
                        images: data.fields.images.map(data2 => {

                            return images.find(item => {
                                return item.id == data2.sys.id
                            })
                        })

                    }
                })


                res.status(200).json({
                    message: "Success",
                    total: response.data.total,
                    skip: req.params.skip,
                    limit: response.data.limit,
                    head: head
                })

            })
            .catch(function(error) {
                // handle error
                res.status(200).json({
                    message: "News empty",
                    total: 0,
                    skip: req.params.skip,
                    limit: 0,
                    head: []
                })
            })
            .then(function() {
                // always executed
            });
    }
);


Router.get('/content/:id',
    function(req, res, next) {
        var content_id = req.params.id
        axios.get(url + '/' + content_id + '?' + token)
            .then(function(response) {
                // handle success


                var contents = response.data.fields.content.content.map(data => {
                    var content = '';
                    data.content.forEach(data2 => {
                        if (data2.data.uri == undefined) {
                            content = content + data2.value
                        } else {
                            data2.content.forEach(data3 => {
                                content = content + data3.value
                            })
                        }

                    })
                    return {

                        type: data.nodeType,
                        content
                    }
                })
                res.status(200).json({
                    message: "Success",
                    title: response.data.fields.title,
                    createdAt: response.data.sys.createdAt,
                    updatedAt: response.data.sys.updatedAt,
                    contents
                })



            })
            .catch(function(error) {
                // handle error
                res.status(400).json({
                    message: "Bad Request"
                })
            })
            .then(function() {
                // always executed
            });
    }
);

module.exports = Router;
