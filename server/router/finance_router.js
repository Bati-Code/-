const jwt = require('jsonwebtoken');
const express = require('express')
const moment = require('moment');
const { Base64 } = require('js-base64');

const Finance = require('../data/finance_Schema');

const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;

const router = express.Router();

module.exports = (secret) => {

    let token_check = false;

    router.use('*', (req, res, next) => {
        console.log(req.originalUrl);

        if (req.originalUrl == '/login') {
            console.log("pass");
            return next();
        }
        else {
            let token = req.header('authorization');
            if (token) {
                try {

                    jwt.verify(token, secret, (err, decoded) => {
                        if (err) {
                            console.log("token verify error");
                            token_check = false;
                            next();
                        }
                        else {
                            console.log(moment(), "token checked");
                            //console.log(decoded);
                            token_check = true;
                            next();
                        }
                    });
                } catch (error) {
                    console.log("catch token error", error);
                    token_check = false;
                    return;
                }

            } else {
                console.log("token is not exist")
                token_check = false;
                return;
            }
        }
    })

    router.get('/best', (req, res) => {

        Finance.find(
            {},
            {},
            {
                sort: { finance_Interest_Count: -1 },
                limit: 10,

            }, (err, boards) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    res.send(boards);
                }
            })
    })

    router.post('/info', (req, res) => {
        Finance.findOne({ finance_name: req.body.finance_name }
            , (err, boards) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    res.send(boards);
                }
            })
    })

    router.post('/up', (req, res) => {
        Finance.updateOne({ finance_name: req.body.finance_name },
            {
                $inc: { finance_Up_Count: 1 }
            },
            (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({up_count_result: 0});
                    return;
                }
                else{
                    res.json({up_count_result: 1});
                }
            })
    })

    router.post('/down', (req, res) => {
        Finance.updateOne({ finance_name: req.body.finance_name },
            {
                $inc: { finance_Down_Count: 1 }
            },
            (err, results) => {
                if (err) {
                    console.log(err);
                    res.json({down_count_result: 0});
                    return;
                }
                else{
                    res.json({down_count_result: 1});
                }
            })
    })



    return router;
}