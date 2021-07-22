const { default: axios } = require("axios");
const bcrypt = require('bcrypt');
const Member = require('../data/member');

module.exports = (app) => {

    app.post('/test-id', async (req, res) => {
        const get_ID = req.body.get_ID;
        let checked_ID = {};
        console.log("수신");
        console.log(get_ID);

        await Member.findOne({ id: get_ID }, (err, members) => {
            if (err) {
                console.log("error");
                return;
            }
            checked_ID = members;

        })

        console.log(checked_ID)
        if (checked_ID) {
            res.send("true");
        }
        else
            res.send("false");

    })

    app.post('/register-member', (req, res) => {
        console.log('register-member');

        bcrypt.hash(req.body.member_pw, 10, (err, hash) => {
            if (err) {
                console.log("hash error");
                return;
            }
            const new_Member = new Member();

            new_Member.id = req.body.member_id;
            new_Member.password = hash;
            new_Member.name = req.body.member_name;
            new_Member.birth = req.body.member_birth;
            new_Member.email = req.body.member_email;
            new_Member.phone = req.body.member_phone;
            console.log("hash", hash);

            new_Member.save((err) => {
                if (err) {
                    console.log(err);
                    res.json({ result: 0 });
                    return;
                }
                console.log("회원가입");
                res.json({ result: 1 });
            })
        })
    });

}