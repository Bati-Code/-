const { default: axios } = require("axios");
const Board = require('../data/board_Schema');
const session = require('express-session');
const moment = require('moment');
const { useState } = require("react");


module.exports = (app) => {

    app.use('*', (req, res, next) => {
        console.log(req.originalUrl);
        if (req.originalUrl == '/login') {
            console.log("pass");
            return next();
        }
        else {
            // console.log("interceptor", req.baseUrl);
            if (req.session.userInfo) {
                console.log("interceptor_session_Token", req.session.userInfo.userToken);
                let token = req.header('authorization');
                console.log("get_Token", token);
                if (token) {
                    if (token === req.session.userInfo.userToken) {
                        console.log("check");
                        req.session.userInfo.session_check = true;

                        return next();
                    }
                    else {
                        console.log("session unmatched");
                        req.session.userInfo.session_check = false;
                        return next();
                    }
                }
                else {
                    console.log("token does not exist");
                    req.session.userInfo.session_check = false;
                    return next();
                }
            }
            else {
                console.log('session expired');
                next();
            }

        }
    })

    let session = [];

    // let session;

    //로그인
    // app.post('/login', (req, res) => {
    //     const get_data1 = req.body;

    //     session = req.session;
    //     session.userID = get_data1;
    //     console.log("loginSession", session);
    //     res.send(session.userID);
    // })

    //로그인
    app.post('/login', (req, res) => {
        const get_user_token = req.body.userToken;
        const get_user_name = req.body.userName;
        console.log("init Login");
        res.send(get_user_token)
        req.session.userInfo = { userToken: get_user_token, userName: get_user_name, session_check: false };
        req.session.save();
        // session = [...session, req.session];

        console.log("Login", req.session);


    })

    //로그아웃
    app.get('/logout', (req, res) => {

        req.session.destroy();
        res.json({ logout_result_code: 1 });

        console.log(req.session);
    })

    //유저체크
    app.get('/user_check', (req, res) => {

        if (req.session.userInfo) {
            if (req.session.userInfo.session_check == true) {
                res.json({ user_result: 1, userName: req.session.userInfo.userName });
            }
            else {
                res.json({ user_result: 0 });
            }
        }
        else {
            res.json({ user_result: 0 });
        }

    })

    //게시글 저장
    app.post('/board/insert', async (req, res) => {

        const get_data = req.body;
        const get_user_Token = req.params.user_Token;
        const new_Board = new Board();
        console.log("insert", req.session);

        // const findSession = session.find((element) => {
        //     console.log("element", element.userInfo);
        //     if (element.userInfo.userToken === get_user_Token) {
        //         console.log("good");
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // })

        // if (findSession) {
        //     new_Board.post_title = req.body.board_title;
        //     new_Board.post_author = findSession.userInfo.userName;
        //     new_Board.post_date = moment().format('MM-DD');
        //     new_Board.post_count = 0;
        //     new_Board.post_recommend = 0;
        //     new_Board.post_content = req.body.board_Data;
        //     new_Board.post_yn = 'y';
        //     new_Board.post_fin_list = req.body.board_item;
        // }
        // else {
        //     res.json({ board_insert: 0 });
        //     return false;
        // }

        if (req.session.userInfo) {
            if (req.session.userInfo.session_check == true) {
                new_Board.post_title = req.body.board_title;
                new_Board.post_author = req.session.userInfo.userName;
                new_Board.post_date = moment().format('MM-DD');
                new_Board.post_count = 0;
                new_Board.post_recommend = 0;
                new_Board.post_content = req.body.board_Data;
                new_Board.post_yn = 'y';
                new_Board.post_fin_list = req.body.board_item;

                await new_Board.save((err) => {
                    if (err) {
                        console.log(err);
                        res.json({ board_insert: 0 });
                        console.log("게시글 업로드 실패");
                        return;
                    }
                    else {
                        console.log("게시글 업로드");
                        res.json({ board_insert: 1 });
                    }
                })
            }
            else {
                res.json({ board_insert: 100 });
            }
        }
        else {
            res.json({ board_insert: 100 });
        }



    })

    //페이지이동 
    app.get('/board/list/:page', async (req, res) => {

        let page = parseInt(req.params.page);
        console.log("page", page)

        if (!page)
            page = 1;

        console.log(page);

        const query = Board.find({ post_yn: 'y' });

        const options = {
            sort: { _id: -1 },
            lean: true,
            limit: 10,
            page: page
        };

        await Board.paginate(query, options)
            .then((result) => {
                res.json(result);
            })

    })

    //검색
    app.get('/board/search/:menuItem/:value/:page', async (req, res) => {
        let page = parseInt(req.params.page);
        const menuItem = req.params.menuItem;
        let value = req.params.value;
        let searchType;

        if (!page)
            page = 1;

        if (menuItem === '제목')
            searchType = 'post_title';
        else if (menuItem === '작성자')
            searchType = "post_author";
        else if (menuItem === "내용")
            searchType = "post_content";
        else if (menuItem === "종목명") {
            searchType = "post_fin_list.name";
        }
        else if (menuItem === "종목코드")
            searchType = "post_fin_list.code";

        console.log(menuItem, value, searchType);

        const query = Board.find(
            { [searchType]: { $regex: '.*' + value + '.*', $options: 'i' }, post_yn: 'y' }
        );

        const options = {
            sort: { _id: -1 },
            lean: true,
            limit: 10,
            page: page
        };

        await Board.paginate(query, options)
            .then((result) => {
                res.json(result);
            })

    })

    //상세페이지
    app.get('/board/view/:board_id', async (req, res) => {

        let board_count;
        console.log("view_id", req.params.board_id);
        await Board.findOne({ _id: req.params.board_id }, (err, boards) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                boards.post_count += 1;
                board_count = boards.post_count;
                res.json(boards);
            }
        })

        await Board.updateOne({ _id: req.params.board_id }, { post_count: board_count }, (err, data) => {
            if (err) {
                console.log("update Error");
                return;
            }
            else {
                console.log("update clear");
            }
        })

    })

    //댓글입력
    app.post('/board/comment', async (req, res) => {

        if (req.session.userInfo) {
            if (req.session.userInfo.session_check == true) {

                const newcomment = {
                    comment_content: req.body.comment_content,
                    comment_author: req.session.userInfo.userName,
                    comment_date: moment().format('MM-DD HH:mm:ss'),
                }

                Board.updateOne({ _id: req.body.board_id },
                    {
                        $push: { post_comment: newcomment }

                    }, (err) => {
                        if (err) {
                            console.log("comment insert Error");
                            res.json({ comment_check_result: 0 });
                            return;
                        }
                        else {
                            console.log("댓글 INSERT 완료");
                            res.json({ comment_check_result: 1, userName: req.session.userInfo.userName });
                            return;
                        }
                    }
                )
            }
            else {
                res.json({ comment_check_result: 0 });
            }
        }
        else {
            res.json({ comment_check_result: 0 });
        }
    })

    //답글
    app.post('/board/recomment', (req, res) => {

        if (req.session.userInfo) {
            if (req.session.userInfo.session_check == true) {
                const new_recomment = {
                    recomment_content: req.body.recomment_content,
                    recomment_author: req.session.userInfo.userName,
                    recomment_date: moment().format('MM-DD HH:mm:ss'),
                }

                console.log(req.body.comment_id);
                Board.findOneAndUpdate({ 'post_comment._id': req.body.comment_id },
                    {
                        $push: { 'post_comment.comment_recomment': new_recomment }

                    }, (err, boards) => {
                        if (err) {
                            console.log("recomment insert Error", boards);
                            res.json({ recomment_check_result: 0 });
                            return;
                        }
                        else {
                            console.log("답글 INSERT 완료", boards);
                            res.json({ recomment_check_result: 1, userName: req.session.userInfo.userName });
                            return;
                        }
                    }
                )
            }
            else {
                res.json({ recomment_check_result: 0 });
            }
        }
        else {
            res.json({ recomment_check_result: 0 });
        }

    })

    //추천수 
    app.get('/board/view/recommend/:board_id', async (req, res) => {

        let board_recommend_count;

        await Board.findOne({ _id: req.params.board_id }, (err, boards) => {
            if (err) {
                console.log(err);
                return;
            }
            else {
                boards.post_recommend += 1;
                board_recommend_count = boards.post_recommend;
                res.json(board_recommend_count);
            }
        })

        await Board.updateOne({ _id: req.params.board_id }, { post_recommend: board_recommend_count }, (err, data) => {
            if (err) {
                console.log("update Error");
                return;
            }
            else {
                console.log("recommend update");
            }
        })

    })

    //게시글 수정
    app.post('/board/update', async (req, res) => {

        if (req.session.userInfo) {
            if (req.session.userInfo.session_check == true) {
                await Board.updateOne({ _id: req.body.board_id },
                    {
                        post_title: req.body.board_title,
                        post_content: req.body.board_content,
                        post_fin_list: req.body.board_item,

                    }, (err) => {
                        if (err) {
                            console.log("update Error");
                            res.json({ update_board_result: 0 });
                            return;
                        }
                        else {
                            console.log("글 수정 완료");
                            res.json({ update_board_result: 1 });
                        }
                    }
                )
            }
            else {
                res.json({ update_board_result: 0 });
            }
        }
        else {
            res.json({ update_board_result: 0 });
        }

    })

    //게시글 삭제
    app.delete('/board/:board_id', async (req, res) => {

        if (req.session.userInfo) {
            if (req.session.userInfo.session_check == true) {
                await Board.updateOne({ _id: req.params.board_id }, { post_yn: 'n' }, (err) => {
                    if (err) {
                        console.log("Delte Error");
                        res.json({ delete_board_result: 0 });
                        return;
                    }
                    else {
                        console.log("delte success");
                        res.json({ delete_board_result: 1 });
                    }
                })
            }
            else {
                res.json({ delete_board_result: 0 });
            }
        }
        else {
            res.json({ delete_board_result: 0 });
        }



    })






}
