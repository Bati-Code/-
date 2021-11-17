import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { server_config } from "../../server_config";
import "./css/LoginCSS.css";


const LoginPage = ({ match }) => {

    const history = useHistory();

    // const user_id = match.params.id;
    // const user_nickname = match.params.nickname;
    // console.log(user_id, ' : ', user_nickname);

    useEffect(() => {
        console.log(window.location.pathname);
        //암호화된 PW를 받아서 DB와 비교 후 처리

        // axios.post(server_config.server_Address + '/login',  //192.168.0.45
        //     {
        //         userID: user_id,
        //         userName: user_nickname
        //     },
        // )
        //     .then((response) => {
        //         console.log("login_Post", response.data);
        //         let user_Storage = window.sessionStorage;
        //         user_Storage.setItem('user_Token', response.data);

        //         history.push('/main');
        //     })

    }, [])

    const loginHandler = () => {
        const id = document.getElementById("inputBox_ID").value;
        const pw = document.getElementById("inputBox_PW").value;

        axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/msg/login',
            {
                request: {
                    mb_id: id,
                    mb_password: pw
                }

            })
            .then((response) => {
                if (response.data.code === 999) {
                    alert("로그인 실패");
                    //console.log(document.getElementById('inputBox_ID'));
                    window.location.reload();
                }
                if (response.data.code === 200) {
                    //console.log("login");
                    console.log(response.data.result);
                    axios.post(server_config.server_Address + '/login',  //192.168.0.45
                        {
                            userName: response.data.result.data.me.username,
                            userID : response.data.result.data.me._id
                        }
                    )
                        .then((response) => {
                            console.log("login_Post", response.data);
                            let user_Storage = window.sessionStorage;
                            user_Storage.setItem('user_Token', response.data);

                            history.push('/main');
                        })
                }
            })
    }

    console.log(window.location.pathname);

    const EnterHandler = (e) => {
        if (e.key === "Enter") {
            loginHandler();
        }
    }


    return (
        <div className="login_wrap">
            <div className="loginHeader">
                로그인
            </div>
            <div className="container">
                <section className="content">
                    <nav>
                    </nav>
                    <main>
                        <div>
                            <div className="loginArea_ID">
                                <div className="inputArea_ID">
                                    <input className="inputID" id="inputBox_ID"
                                        type="text" placeholder="아이디" onKeyPress={EnterHandler} autoFocus></input>
                                </div>
                            </div>
                            <div className="loginArea_PW">
                                <div className="inputArea_PW">
                                    <input className="inputPW" id="inputBox_PW"
                                        type="password" placeholder="패스워드" onKeyPress={EnterHandler}></input>
                                </div>
                            </div>
                            <button className="loginButton" onClick={loginHandler}>로그인</button>
                        </div>
                    </main>
                    <aside>
                    </aside>
                </section>
            </div>
            <div className="footer">
            </div>
        </div >
    )
}

export default LoginPage;