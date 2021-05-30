const jwt = require('jsonwebtoken');
const config = require('../configs.json');

const auth = async (req, res, next) => {

    try {
        let token = req.headers['authorization'];
        if (!token) return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });

        jwt.verify(token, config.secret, async function (err, decoded) {
            if (err) return res.status(401).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
            if (decoded.data.is_verified == '3' || '2' || '1') {
                req.user = decoded;
                next();
            } else {
                res.status(200).send({
                    status: res.statusCode,
                    message: "account not verified",
                })
            }
        });
    } catch (error) {
        res.status(401).send({
            status: res.statusCode,
            message: "has no authority",
        })
    }
};

module.exports = auth;