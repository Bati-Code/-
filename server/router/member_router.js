const jwt = require('jsonwebtoken');
const express = require('express')
const moment = require('moment');
const { Base64 } = require('js-base64');

const Member = require('../data/member_Schema');
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

    //로그인
    router.post('/login', (req, res) => {

        console.log("init Login");
        const get_user_name = req.body.userName;
        const make_token = jwt.sign({ userName: get_user_name }, secret);

        res.send(make_token);

        console.log("Login", make_token);
    })

    //로그아웃
    router.get('/logout', (req, res) => {

        res.json({ logout_result_code: 1 });

        console.log("logout");
    })

    //유저체크
    router.get('/user_check', async (req, res) => {
        console.log('user_check', token_check);

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            await res.json({ user_result: 1, userName: userName });
        }
        else {
            res.json({ user_result: 0 });
        }
    })

    //관심종목 리스트
    router.get('/fin_interest/view', (req, res) => {

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Member.findOne({ member_name: userName },
                (err, boards) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    else {
                        if (boards === null) {
                            const new_Member = new Member();
                            new_Member.member_name = userName;
                            new_Member.member_Fin_Interest = req.body.fin_interest_data;

                            new_Member.save((err) => {
                                if (err) {
                                    console.log("save err");
                                    res.json({ fin_interest_insert_result: 0 });
                                    return;
                                }
                                else {
                                    console.log("업로드 성공");
                                    res.json({ fin_interest_insert_result: 1 });
                                    return;
                                }
                            })
                        }
                        else {
                            res.json({ fin_interest_data: boards.member_Fin_Interest });
                        }
                    }
                })
        }
        else {

        }

    })

    //관심종목 카운트 function
    const finance_interest_inc = (res, fin_name, fin_code, num, fin_data) => {

        Finance.findOne({ finance_code: fin_code },
            (err, boards) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    if (boards === null) {
                        const new_Finance = new Finance();
                        new_Finance.finance_name = fin_name;
                        new_Finance.finance_code = fin_code;
                        new_Finance.finance_data = fin_data;


                        new_Finance.save((err) => {
                            if (err) {
                                console.log("finance save err");
                                res.json({ fin_interest_insert_result: 0 });
                                return;
                            }
                            else {
                                console.log("업로드 성공");

                                Finance.updateOne(
                                    {
                                        finance_code: fin_code
                                    },
                                    {
                                        $inc: { finance_Interest_Count: num }
                                    },
                                    (err, results) => {
                                        if (err) {
                                            console.log(err);
                                            res.json({ fin_interest_insert_result: 0 });
                                            return;
                                        }
                                        else {
                                            res.json({ fin_interest_insert_result: 1 });
                                            return;
                                        }
                                    })
                            }
                        })
                    }
                    else {
                        Finance.updateOne(
                            {
                                finance_code: fin_code
                            },
                            {
                                $inc: { finance_Interest_Count: num }
                            },
                            (err, results) => {
                                if (err) {
                                    console.log(err);
                                    res.json({ fin_interest_insert_result: 0 });
                                    return;
                                }
                                else {
                                    res.json({ fin_interest_insert_result: 1 });
                                    return;
                                }
                            })
                    }
                }
            })

    }

    //관심종목 추가
    router.post('/fin_interest/insert', (req, res) => {

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Member.findOne({ member_name: userName }, (err, boards) => {
                if (err) {
                    console.log(err);
                    res.json({ fin_interest_insert_result: 0 });
                    return;
                }
                else {
                    //DB에 없음
                    if (boards === null) {
                        if (Object.keys(req.body.fin_interest_data).length !== 0) {
                            const new_Member = new Member();
                            new_Member.member_name = userName;
                            new_Member.member_Fin_Interest = req.body.fin_interest_data;

                            new_Member.save((err) => {
                                if (err) {
                                    console.log("save err");
                                    res.json({ fin_interest_insert_result: 0 });
                                    return;
                                }
                                else {
                                    finance_interest_inc(res, req.body.fin_interest_data.name,
                                        req.body.fin_interet_data.code, 1, req.body.fin_interest_data);
                                }
                            })
                        }
                        else {
                            console.log("null data");
                            res.json({ fin_interest_insert_result: 0 });
                            return;
                        }

                    }
                    //DB에 존재
                    else {
                        Member.findOne(
                            {
                                member_name: userName,
                            },
                            {
                                'member_Fin_Interest': { $elemMatch: { 'code': req.body.fin_interest_data.code } }
                            }, (err, boards) => {
                                if (err) {
                                    res.json({ fin_interest_insert_result: 0 });
                                    return;
                                }
                                else {
                                    if (Object.keys(req.body.fin_interest_data).length !== 0) {
                                        if (boards.member_Fin_Interest.length === 0) {
                                            Member.updateOne({ member_name: userName },
                                                {
                                                    $push: { member_Fin_Interest: req.body.fin_interest_data }
                                                },
                                                (err, result) => {
                                                    if (err) {
                                                        console.log("update err");
                                                        res.json({ fin_interest_insert_result: 0 });
                                                        return;
                                                    }
                                                    else {
                                                        console.log("관심종목 추가");
                                                        finance_interest_inc(res, req.body.fin_interest_data.name,
                                                            req.body.fin_interest_data.code, 1, req.body.fin_interest_data);
                                                        return;
                                                    }
                                                })
                                            return;
                                        }
                                        else {
                                            res.json({ fin_interest_insert_result: 0 });
                                            return;
                                        }
                                    }
                                    else {
                                        console.log("null data");
                                        res.json({ fin_interest_insert_result: 0 });
                                        return;
                                    }
                                }
                            })
                    }
                }
            })
        }
        else {
            res.json({ fin_interest_insert_result: 0 });
            return;
        }

    })

    //관심종목 삭제
    router.post('/fin_interest/delete', (req, res) => {
        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Member.findOne(
                {
                    member_name: userName,
                },
                {
                    'member_Fin_Interest': { $elemMatch: { 'code': req.body.fin_interest_code } },

                }, (err, boards) => {
                    if (err) {
                        console.log(err);
                        res.json({ fin_interest_delete_result: 0 });
                        return;
                    }
                    else {
                        Member.updateOne(
                            {
                                'member_name': userName
                            },
                            {
                                $pull: { 'member_Fin_Interest': { 'code': req.body.fin_interest_code } }
                            },
                            (err, results) => {
                                if (err) {
                                    console.log("delete err");
                                    res.json({ fin_interest_delete_result: 0 });
                                    return;
                                }
                                else {
                                    console.log("관심종목 삭제");
                                    finance_interest_inc(res, 0, req.body.fin_interest_code, -1, 0);
                                    return;
                                }
                            }
                        )
                    }
                })
        }
        else {
            console.log("not token");
            res.json({ fin_interest_delete_result: 0 });
            return;
        }
    })

    return router;
}