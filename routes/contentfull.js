const Router = require('express').Router();
const axios = require('axios');

const url = 'https://cdn.contentful.com/spaces/p4stxfymwhqd/environments/master/entries'
const token = 'order=sys.createdAt&access_token=okjmWMGmwQYyEQELGVcZ-01PrrVhhN1g4TCprTCUM3I'
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
                    skip: response.data.skip,
                    limit: response.data.limit,
                    head: head
                })

            })
            .catch(function(error) {
                // handle error
                res.status(400).json({
                    message: "Bad Request",
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