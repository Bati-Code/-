import { DownOutlined, FormOutlined, UserOutlined, FilterTwoTone } from '@ant-design/icons';
import axios from 'axios'
import { Button, Dropdown, Input, Menu, Radio } from 'antd';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import { slide as TOP_Menu } from 'react-burger-menu'
import { Finance_List_Store } from '../../redux/action/finance_list_action';
import { Page_Search, Page_Reset } from '../../redux/action/page_action';
import Board from './Board'
import Top_Fin_list from '../Finance_List/Top_Fin_List';
import './css/BoardCSS.css'
import "./css/Board_Menu_CSS.css";

const { Search } = Input;

const MainPage = () => {
    const [get_Menu_Text, set_Menu_Text] = useState('제목');
    const [get_Radio_Option, set_Radio_Option] = useState('a');

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

    const Menu_Handler = (e) => {
        console.log(e);
        set_Menu_Text(e.key);
    }

    const menu = (
        <Menu onClick={Menu_Handler}>
            <Menu.Item key="제목" icon={<FilterTwoTone />}>
                제목
            </Menu.Item>
            <Menu.Item key="작성자" icon={<FilterTwoTone />}>
                작성자
            </Menu.Item>
            <Menu.Item key="내용" icon={<FilterTwoTone />}>
                내용
            </Menu.Item>
            <Menu.Item key="종목명" icon={<FilterTwoTone />}>
                종목명
            </Menu.Item>
            <Menu.Item key="종목코드" icon={<FilterTwoTone />}>
                종목코드
            </Menu.Item>
        </Menu>
    );

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

    const onSearch = (value) => {
        console.log(get_Menu_Text, value);
        dispatch(Page_Search(get_Menu_Text, value));
        set_Radio_Option('a');
    };


    const main_Header_Handler = () => {
        dispatch(Page_Reset());
    }

    const Radio_Handler = (e) => {
        console.log(e.target.value);
        set_Radio_Option(e.target.value);
    }

    return (
        <>
            <div className="board_wrap">
                <div className="board_Header">
                    <div>
                        <div>
                            <TOP_Menu
                                width={300}>
                                <p onClick={() => { history.push('/fin_interest') }}>관심 종목</p>
                                <p>Home</p>
                                <p>Home</p>
                            </TOP_Menu>
                        </div>
                        <div onClick={main_Header_Handler}>
                            주식토론 게시판
                        </div>
                    </div>
                </div>
                <div className="container">
                    <section className="board_content">
                        <nav>
                        </nav>
                        <main>
                            <div>
                                <div className="board_search_wrap">
                                    <Dropdown overlay={menu} trigger='click'>
                                        <Button>
                                            {get_Menu_Text} <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                    <Search placeholder="검색할 내용을 입력하세요."
                                        onSearch={onSearch} enterButton />
                                </div>
                            </div>
                            <div className="top_Nav_Wrap">
                                <Radio.Group defaultValue="a" style={{ width: '100%' }} onChange={Radio_Handler}
                                    value={get_Radio_Option}>
                                    <Radio.Button value="a">전체글</Radio.Button>
                                    <Radio.Button value="b">종목별 게시판</Radio.Button>
                                </Radio.Group>
                            </div>
                            {get_Radio_Option === 'a' ? <Board />
                                : get_Radio_Option === 'b' ? <Top_Fin_list />
                                    : null}
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