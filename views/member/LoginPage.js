import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./css/LoginCSS.css";

//admin3 1q2w3e4r$R$

const LoginPage = (props) => {

    const history = useHistory();

    const loginHandler = () =>  {
        const id = document.getElementById("inputBox_ID").value;
        const pw = document.getElementById("inputBox_PW").value;

        axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/msg/login',
            {
                request: {
                    mb_id: id,
                    mb_password: pw
                }

            })
            .then((request) => {
                if (request.data.code === 999) {
                    alert("로그인 실패");
                    console.log(document.getElementById('inputBox_ID'));
                    window.location.reload();
                }
                if (request.data.code === 200) {
                    console.log("login");
                    props.set_session_Props(true);
                    axios.post('http://localhost:5000/login', 
                    {
                        userID: request.data.result.data.userId
                    })
                    .then((request) => {
                        console.log("login_Post", request.data);
                        let user_Storage = window.sessionStorage;
                        user_Storage.setItem('user_ID', request.data.userID);
                        history.push('/main');
                    })

                    
                }
            })
    }

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
                아이디 찾기|비밀번호 찾기|회원가입
            </div>
        </div >
    )
}

export default LoginPage;