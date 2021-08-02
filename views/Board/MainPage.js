import { FormOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios'
import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';


import { Finance_List_Store } from '../../redux/action/finance_list_action';
import Board from './Board'
import './css/BoardCSS.css'

const MainPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        // const meta = document.createElement('meta');
        // meta.name = "viewport";
        // meta.content = "width=device-width, initial-scale=0.9, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        // document.getElementsByTagName('head')[0].appendChild(meta);

        axios.get('http://hitalk-investment.hitalkplus.com:4050/StockCode?ETF=1')
            .then((response) => {

                response.data.datalist.map((list, index) => {
                    delete list.reason;
                    delete list.dtfchk;
                    delete list.reason_no;
                    delete list.type;
                    delete list.etfchk;
                    delete list.use_yn;
                })

                dispatch(Finance_List_Store(response.data.datalist));
            })

    }, [])

    const Insert_Session_Handler = () => {

        history.push('/board/insert');
    }

    const logout_Handler = () => {

        axios.get('http://localhost:5000/logout')
            .then((response) => {
                console.log(response.data);
                if (response.data.logout_result_code === 1) {
                    sessionStorage.clear();
                    history.push('/login');
                }
            })
    }

    return (
        <>
            <div className="board_wrap">
                <div className="board_Header">
                    <a href="/main">
                        주식토론 게시판
                    </a>
                </div>
                <div className="container">
                    <section className="board_content">
                        <nav>
                        </nav>
                        <main>
                            <Board></Board>
                        </main>
                        <aside>
                        </aside>
                    </section>
                </div>
                <div className="Board_footer">
                    <div>
                        <Button onClick={Insert_Session_Handler} icon={<FormOutlined />}>
                            글 작성
                        </Button>
                    </div>
                    <div>
                        <Button onClick={logout_Handler} icon={<UserOutlined />}>
                            로그아웃
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )

}
export default MainPage;