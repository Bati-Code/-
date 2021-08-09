const { default: axios } = require("axios");
const Board = require('../data/board_Schema');
const session = require('express-session');
const moment = require('moment');
const { useState } = require("react");
const jwt = require('jsonwebtoken');
const { Base64 } = require('js-base64');
const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;

module.exports = (app, secret) => {

    let token_check = false;

    app.use('*', (req, res, next) => {
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
    app.post('/login', (req, res) => {

        console.log("init Login");
        const get_user_name = req.body.userName;
        const make_token = jwt.sign({ userName: get_user_name }, secret);

        res.send(make_token);


        // req.session.userInfo = { userToken: get_user_token, userName: get_user_name, session_check: false };
        // req.session.save();
        console.log("Login", make_token);


    })

    //로그아웃
    app.get('/logout', (req, res) => {

        res.json({ logout_result_code: 1 });

        console.log("logout");
    })

    //유저체크
    app.get('/user_check', async (req, res) => {

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

    //게시글 저장
    app.post('/board/insert', async (req, res) => {

        const new_Board = new Board();

        console.log("Insert");

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            if (req.body.board_Data === "") {
                res.json({ board_insert: 0 });
                console.log("게시글 업로드 실패");
                return;
            }

            const query = Board.find();

            await query.count((err, count) => {
                if (err) {
                    res.json({ board_insert: 0 });
                    return;
                }
                else {
                    console.log("count", count)
                    new_Board.post_num = count + 1;
                    new_Board.post_title = req.body.board_title;
                    new_Board.post_author = userName;
                    new_Board.post_date = moment();
                    new_Board.post_count = 0;
                    new_Board.post_recommend = 0;
                    new_Board.post_content = req.body.board_Data;
                    new_Board.post_yn = 'y';
                    new_Board.post_fin_list = req.body.board_item;
                }
            })


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

    //상세페이지 업데이트
    app.get('/board/view/update/:board_id', async (req, res) => {

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            await Board.findOne({ _id: req.params.board_id }, (err, boards) => {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    res.json({ list: boards, userName: userName });
                    return;
                }
            })
        }
    })

    //상세페이지
    app.get('/board/view/:board_id', async (req, res) => {


        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            console.log("view_id", req.params.board_id);

            await Board.updateOne(
                { _id: req.params.board_id },
                { $inc: { 'post_count': + 0.5 } },
                (err, data) => {
                    if (err) {
                        console.log("update Error");
                        return;
                    }
                    else {
                        console.log("update clear");

                        Board.findOne({ _id: req.params.board_id },
                            (err, boards) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                else {
                                    console.log(boards.post_count);
                                    res.json({ list: boards, userName: userName });
                                }
                            })
                    }
                })
        }
        else {
            res.json({ board_view_result: 0 });
            return;
        }




    })

    //댓글입력
    app.post('/board/comment', async (req, res) => {

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;


            if (req.body.comment_content === "") {
                res.json({ comment_check_result: 0 });
                return;
            }

            const newcomment = {
                comment_content: req.body.comment_content,
                comment_author: userName,
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
                        res.json({ comment_check_result: 1, userName: userName });
                        return;
                    }
                }
            )
        }
        else {
            res.json({ comment_check_result: 0 });
        }
    })

    //댓글 추천
    app.post('/board/comment/recommend', (req, res) => {

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Board.findOne(
                {
                    _id: req.body.board_id,
                    'post_comment._id': req.body.comment_id
                },
                {
                    post_comment: { $elemMatch: { '_id': req.body.comment_id } },
                }
                , (err, boards) => {
                    if (err) {
                        console.log("comment recommend error", err);
                        res.json({ 'comment_recommend_result': 0 });
                        return;
                    }
                    else {
                        const recommend_user = boards.post_comment[0].comment_recommend_user;
                        const user_index = recommend_user.findIndex((e) => e.comment_recommend_user === userName);

                        let recommend_count = boards.post_comment[0].comment_recommend;

                        if (recommend_count === undefined)
                            recommend_count = 0;

                        console.log("count", recommend_count);

                        if (user_index !== -1) {

                            console.log(req.body.comment_id);
                            Board.updateOne({ _id: req.body.board_id },
                                {
                                    $inc: { 'post_comment.$[element].comment_recommend': -1 },
                                    $pull: { 'post_comment.$[element].comment_recommend_user': { 'comment_recommend_user': userName } }
                                },
                                {
                                    "arrayFilters": [
                                        {
                                            'element._id': req.body.comment_id,
                                        }
                                    ]

                                }, (err, data) => {
                                    if (err) {
                                        console.log("update error");
                                        res.json({ 'comment_recommend_result': 0, recommend_count: recommend_count });
                                        return;
                                    }
                                    else {
                                        console.log("댓글 추천 update 100", userName);
                                        res.json({
                                            'comment_recommend_result': 100,
                                            recommend_count: recommend_count - 1,
                                        });
                                        return;
                                    }
                                })
                        }
                        else {
                            Board.findOne({ _id: req.body.board_id }, (err, boards) => {

                                if (err) {
                                    console.log(err);
                                    res.json({ 'comment_recommend_result': 0, recommend_count: recommend_count });
                                    return;
                                }
                                else {


                                    const new_recommend_user = { comment_recommend_user: userName };

                                    Board.updateOne({ _id: req.body.board_id },
                                        {
                                            $inc: { 'post_comment.$[element].comment_recommend': 1 },
                                            $push: { 'post_comment.$[element].comment_recommend_user': new_recommend_user }
                                        },
                                        {
                                            "arrayFilters": [
                                                {
                                                    'element._id': req.body.comment_id,
                                                }
                                            ]

                                        }, (err, data) => {
                                            if (err) {
                                                console.log("update error");
                                                res.json({ 'comment_recommend_result': 0, recommend_count: recommend_count });
                                                return;
                                            }
                                            else {
                                                console.log("댓글 추천 update 1");
                                                res.json({
                                                    'comment_recommend_result': 1,
                                                    recommend_count: recommend_count + 1,
                                                });
                                                return;
                                            }
                                        })
                                }
                            })
                        }
                    }
                })


        }

    })

    //답글
    app.post('/board/recomment', (req, res) => {

        console.log(req.body);

        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            if (req.body.recomment_content === "") {
                res.json({ recomment_check_result: 0 });
                return;
            }

            const new_recomment = {
                recomment_content: req.body.recomment_content,
                recomment_author: userName,
                recomment_date: moment().format('MM-DD HH:mm:ss'),
            }

            console.log(req.body.comment_id);
            Board.updateOne({ '_id': req.body.board_id },
                {
                    $push: { 'post_comment.$[element].comment_recomment': new_recomment }

                },
                {
                    "arrayFilters": [
                        {
                            'element._id': req.body.comment_id,
                        }
                    ]

                }, (err, boards) => {
                    if (err) {
                        console.log("recomment insert Error", err);
                        res.json({ recomment_check_result: 0 });
                        return;
                    }
                    else {
                        console.log("답글 INSERT 완료", boards);
                        res.json({ recomment_check_result: 1, userName: userName });
                        return;
                    }
                }
            )
        }
        else {
            res.json({ recomment_check_result: 0 });
        }

    })

    //답글 추천
    app.post('/board/recomment/recommend', async (req, res) => {


        if (token_check) {
            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Board.aggregate([
                {
                    $match: { '_id': new ObjectId(req.body.board_id) }
                },
                {
                    $unwind: '$post_comment'
                },
                {
                    $project: { 'post_comment': 1, _id: 0 }
                },
                {
                    $match: { 'post_comment._id': new ObjectId(req.body.comment_id) }
                },
                {
                    $unwind: '$post_comment.comment_recomment'
                },
                {
                    $match: { 'post_comment.comment_recomment._id': new ObjectId(req.body.recomment_id) }
                },
                // {
                //     $unwind: '$post_comment.comment_recomment.recomment_recommend_user'
                // },
                // {
                //     $match:
                //     {
                //         'post_comment.comment_recomment.recomment_recommend_user.recomment_recommend_user':
                //             userName
                //     }
                // },


            ]).exec().then((boards) => {

                const recommend_user = boards[0].post_comment.comment_recomment.recomment_recommend_user;
                const user_index = recommend_user.findIndex((e) => e.recomment_recommend_user === userName);
                let recommend_count = boards[0].post_comment.comment_recomment.recomment_recommend;

                if (recommend_count === undefined)
                    recommend_count = 0;

                if (user_index !== -1) {

                    const new_recommend_user = { recomment_recommend_user: userName };

                    Board.updateOne({ _id: req.body.board_id },
                        {
                            $inc: { 'post_comment.$[comment].comment_recomment.$[recomment].recomment_recommend': -1 },
                            $pull: { 'post_comment.$[comment].comment_recomment.$[recomment].recomment_recommend_user': new_recommend_user }
                        },
                        {
                            "arrayFilters": [
                                {
                                    'comment._id': req.body.comment_id,
                                },
                                {
                                    'recomment._id': req.body.recomment_id,
                                }
                            ]

                        }, (err, data) => {
                            if (err) {
                                console.log(err);
                                res.json({ 'recomment_recommend_result': 0 });
                                return;
                            }
                            else {
                                console.log("답글 추천 update 100");
                                res.json({
                                    'recomment_recommend_result': 100,
                                    recommend_count: recommend_count - 1,

                                });
                                return;
                            }
                        })

                }
                else {
                    console.log("empty");

                    const new_recommend_user = { recomment_recommend_user: userName };

                    Board.updateOne({ _id: req.body.board_id },
                        {
                            $inc: { 'post_comment.$[comment].comment_recomment.$[recomment].recomment_recommend': 1 },
                            $push: { 'post_comment.$[comment].comment_recomment.$[recomment].recomment_recommend_user': new_recommend_user }
                        },
                        {
                            "arrayFilters": [
                                {
                                    'comment._id': req.body.comment_id,
                                },
                                {
                                    'recomment._id': req.body.recomment_id,
                                }
                            ]

                        }, (err, data) => {
                            if (err) {
                                console.log(err);
                                res.json({ 'recomment_recommend_result': 0 });
                                return;
                            }
                            else {
                                console.log("답글 추천 update 1");
                                res.json({
                                    'recomment_recommend_result': 1,
                                    recommend_count: recommend_count + 1,

                                });
                                return;
                            }
                        })
                }
            })
        }
        else {
            console.log('not token');
            return;
        }

    })

    //추천수 
    app.get('/board/view/recommend/:board_id', async (req, res) => {

        const header = req.header('authorization');
        const array = header.split(".");
        const userName = JSON.parse(Base64.decode(array[1])).userName;

        Board.findOne({ _id: req.params.board_id, 'post_recommend_user.recommend_user': userName }, (err, boards) => {
            if (err) {
                console.log('error');
                //res.json({ recommend_update: 0, recommend_count: boards.post_recommend });
                return;
            }
            else {
                if (boards !== null) {
                    console.log("이미추천"); //이미 추천

                    Board.updateOne({ _id: req.params.board_id },
                        {
                            post_recommend: boards.post_recommend - 1,
                            $pull: { 'post_recommend_user': { 'recommend_user': userName } }
                        },
                        (err, data) => {
                            if (err) {
                                console.log("update Error", err);
                                res.json({ recommend_update: 0, recommend_count: boards.post_recommend });
                                return;
                            }
                            else {
                                console.log("recommend update");
                                res.json({ recommend_update: 100, recommend_count: boards.post_recommend - 1 });
                                return;
                            }
                        })
                }
                else {
                    Board.findOne({ _id: req.params.board_id }, (err, boards) => {
                        if (err) {
                            console.log(err);
                            res.json({ recommend_update: 0, recommend_count: boards.post_recommend });
                            return;
                        }
                        else {
                            const new_recommend_user = { recommend_user: userName }

                            Board.updateOne({ _id: req.params.board_id },
                                {
                                    post_recommend: boards.post_recommend + 1,
                                    $push: { 'post_recommend_user': new_recommend_user }
                                },
                                (err, data) => {
                                    if (err) {
                                        console.log("update Error");
                                        res.json({ recommend_update: 0, recommend_count: boards.post_recommend });
                                        return;
                                    }
                                    else {
                                        console.log("recommend update");
                                        res.json({ recommend_update: 1, recommend_count: boards.post_recommend + 1 });
                                        return;
                                    }
                                })
                        }
                    })
                }
            }
        })
    })

    //게시글 수정
    app.post('/board/update', async (req, res) => {

        if (token_check) {
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

    })

    //게시글 삭제
    app.delete('/board/:board_id', async (req, res) => {

        const header = req.header('authorization');
        const array = header.split(".");
        const userName = JSON.parse(Base64.decode(array[1])).userName;

        if (token_check) {
            await Board.updateOne({ _id: req.params.board_id, post_author: userName }, { post_yn: 'n' }, (err) => {
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
    })

    //댓글삭제
    app.delete('/board/comment/:comment_id', (req, res) => {
        console.log('delete Comment');

        if (token_check) {

            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Board.aggregate([
                {
                    $match: { 'post_comment._id': new ObjectId(req.params.comment_id) }
                },
                {
                    $unwind: '$post_comment'
                },
                {
                    $project: { 'post_comment': 1, _id: 0 }
                },
                {
                    $match: { 'post_comment._id': new ObjectId(req.params.comment_id) }
                },

            ]).exec().then(async (board) => {

                if (board[0].post_comment.comment_author === userName) {

                    await Board.updateOne(
                        {
                            'post_comment._id': req.params.comment_id,
                        },
                        {
                            $pull: { 'post_comment': { '_id': req.params.comment_id } }
                        },
                        (err, data) => {
                            if (err) {
                                console.log("delte Comment error");
                                res.json({ delete_comment_result: 0 });
                                return;
                            }
                            else {
                                console.log(data);
                                res.json({ delete_comment_result: 1 });
                                return;
                            }
                        })
                }
                else {
                    res.json({ delete_comment_result: 0 });
                    return;
                }
            })

        } else {
            res.json({ delete_comment_result: 0 });
            return;
        }
    })

    //답글삭제
    app.delete('/board/recomment/:board_id/:comment_id/:recomment_id', (req, res) => {

        if (token_check) {


            const header = req.header('authorization');
            const array = header.split(".");
            const userName = JSON.parse(Base64.decode(array[1])).userName;

            Board.aggregate([
                {
                    $match: { '_id': new ObjectId(req.params.board_id) }
                },
                {
                    $unwind: '$post_comment'
                },
                {
                    $project: { 'post_comment': 1, _id: 0 }
                },
                {
                    $unwind: '$post_comment.comment_recomment'
                },
                {
                    $match: { 'post_comment.comment_recomment._id': new ObjectId(req.params.recomment_id) }
                },


            ]).exec().then((boards) => {

                if (boards[0].post_comment.comment_recomment.recomment_author === userName) {

                    Board.updateOne({ '_id': req.params.board_id },
                        {
                            $pull: { 'post_comment.$[element].comment_recomment': { '_id': req.params.recomment_id } }

                        },
                        {
                            "arrayFilters": [
                                {
                                    'element._id': req.params.comment_id,
                                }
                            ]

                        }, (err, boards) => {
                            if (err) {
                                console.log("recomment delete Error", err);
                                res.json({ delete_recomment_result: 0 });
                                return;
                            }
                            else {
                                console.log("답글 삭제 완료", boards);
                                res.json({ delete_recomment_result: 1 });
                                return;
                            }
                        }
                    )
                }
            })
        }
        else {
            console.log("token Error", err);
            res.json({ delete_recomment_result: 0 });
            return;
        }


    })





}
