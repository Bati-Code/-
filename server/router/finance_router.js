const jwt = require('jsonwebtoken');
const express = require('express')
const moment = require('moment');
const { Base64 } = require('js-base64');

const Finance = require('../data/finance_Schema');

const Mongoose = require('mongoose');

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

        const header = req.header('authorization');
        const array = header.split(".");
        const userName = JSON.parse(Base64.decode(array[1])).userName;

        Finance.findOne(
            {
                finance_name: req.body.finance_name,
            },
            {
                'finance_Up_Count_User': 1
            },
            (err, boards) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    if (boards) {
                        console.log("UPCOUNT", boards);
                        const user_Array = boards.finance_Up_Count_User;
                        const user_Array_Index = user_Array.findIndex((e) => e === userName);
                        console.log("INDEX", user_Array_Index);

                        if (user_Array_Index === -1) {
                            console.log('empty');
                            Finance.updateOne({ finance_name: req.body.finance_name },
                                {
                                    $inc: { finance_Up_Count: 1 },
                                    $push: { finance_Up_Count_User: userName }
                                },
                                (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({ up_count_result: 0 });
                                        return;
                                    }
                                    else {
                                        res.json({ up_count_result: 1 });
                                    }
                                })

                        }
                        else {
                            Finance.updateOne({ finance_name: req.body.finance_name },
                                {
                                    $inc: { finance_Up_Count: -1 },
                                    $pull: { finance_Up_Count_User: userName }
                                },
                                (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({ up_count_result: 0 });
                                        return;
                                    }
                                    else {
                                        res.json({ up_count_result: 100 });
                                    }
                                })
                        }
                    }
                    else {
                        res.json({ up_count_result: 0 });
                        return;
                    }

                }
            })


    })

    router.post('/down', (req, res) => {

        const header = req.header('authorization');
        const array = header.split(".");
        const userName = JSON.parse(Base64.decode(array[1])).userName;

        Finance.findOne(
            {
                finance_name: req.body.finance_name,
            },
            {
                'finance_Down_Count_User': 1
            },
            (err, boards) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log("DownCOUNT", boards);
                    const user_Array = boards.finance_Down_Count_User;
                    const user_Array_Index = user_Array.findIndex((e) => e === userName);
                    console.log("INDEX", user_Array_Index);

                    if (user_Array_Index === -1) {
                        console.log('empty');
                        Finance.updateOne({ finance_name: req.body.finance_name },
                            {
                                $inc: { finance_Down_Count: 1 },
                                $push: { finance_Down_Count_User: userName }
                            },
                            (err, results) => {
                                if (err) {
                                    console.log(err);
                                    res.json({ down_count_result: 0 });
                                    return;
                                }
                                else {
                                    res.json({ down_count_result: 1 });
                                }
                            })

                    }
                    else {
                        Finance.updateOne({ finance_name: req.body.finance_name },
                            {
                                $inc: { finance_Down_Count: -1 },
                                $pull: { finance_Down_Count_User: userName }
                            },
                            (err, results) => {
                                if (err) {
                                    console.log(err);
                                    res.json({ down_count_result: 0 });
                                    return;
                                }
                                else {
                                    res.json({ down_count_result: 100 });
                                }
                            })
                    }
                }
            })

    })



    return router;
}