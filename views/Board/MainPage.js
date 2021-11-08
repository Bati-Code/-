import { DownOutlined, FormOutlined, UserOutlined, FilterTwoTone, SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import { Button, Dropdown, Input, Menu, Radio, Drawer, Space } from 'antd';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import SearchIcon from '@mui/icons-material/Search';

import { useAlert } from 'react-alert'
import { Finance_List_Store } from '../../redux/action/finance_list_action';
import { Page_Search, Page_Reset, Page_Radio, Page_Store } from '../../redux/action/page_action';
import { Board_Infinity_Page, Board_Scroll, Board_Store_Reset } from '../../redux/action/board_list_action';

import expand_icon from '../../public/images/expand_icon.png'

import Board from './Board'
import Top_Fin_list from '../Finance_List/Top_Fin_List';
import Top_Fin_list2 from '../Finance_List/Top_Fin_List2';
import Fin_Interest from '../member_info/Fin_Interest'
import './css/BoardCSS.css'
import { server_config } from '../../server_config';
import Board_Infinity from './Board_Infinity';
import { Tab, Tabs, Paper } from '@material-ui/core';

const { Search } = Input;

const MainPage = () => {
    const [get_Menu_Text, set_Menu_Text] = useState('제목');
    const [get_Search_Value, set_Search_Value] = useState('');
    const [get_Tab, set_Tab] = useState(2);
    const [get_Menu_Drawer_Visible, set_Menu_Drawer_Visible] = useState(false);
    const [get_Select_Drawer_Visible, set_Select_Drawer_Visible] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { radio, search } = useSelector(state => state.pageStore);
    const { scroll } = useSelector(state => state.boardStore);

    useEffect(() => {
        // const meta = document.createElement('meta');
        // meta.name = "viewport";
        // meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
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


        axios.get(server_config.server_Address + '/board/desc/attention')
        .then((response) => {
            console.log("Attention : ", response.data);
        })

    }, [])

    const Menu_Handler = (e) => {
        //console.log(e);
        set_Menu_Text(e.key);
        set_Search_Value('');
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

        axios.get(server_config.server_Address + '/logout')
            .then((response) => {
                //console.log(response.data);
                if (response.data.logout_result_code === 1) {
                    sessionStorage.clear();
                    history.push('/login');
                }
            })
    }

    const onSearch = (value) => {
        //console.log(get_Menu_Text, value);
        if (!value) {
            alert.show('검색할 내용을 입력하세요.');
            return;
        }
        else {
            dispatch(Page_Search(get_Menu_Text, value));
            dispatch(Board_Store_Reset());
            dispatch(Board_Infinity_Page(1));
            //dispatch(Page_Radio('a'));
        }

    };


    const main_Header_Handler = () => {
        if (scroll == 0 && radio == 'e' && search == false) {
            return;
        }
        set_Search_Value('');
        dispatch(Page_Reset());
        dispatch(Board_Store_Reset());
    }

    const Radio_Handler = (e) => {
        //dispatch(Page_Store(1));
        console.log("AAA : ", e.target);
        dispatch(Board_Store_Reset());
        dispatch(Page_Radio(e.target.value));
        Select_Drawer_Close_Handler();
    }


    const Menu_Drawer_Open_Handler = (e) => {
        console.log(e);
        set_Menu_Drawer_Visible(true);
    }

    const Menu_Drawer_Close_Handler = () => {
        set_Menu_Drawer_Visible(false);
    }

    const Select_Drawer_Open_Handler = (e) => {
        console.log(e);
        set_Select_Drawer_Visible(true);
    }

    const Select_Drawer_Close_Handler = () => {
        set_Select_Drawer_Visible(false);
    }

    const Search_Input_Handler = (e) => {
        set_Search_Value(e.target.value);
    }

    const Board_Scroll_Handler = (e) => {
        if (radio === 'e')
            dispatch(Board_Scroll(e.target.scrollTop));
    }

    const Change_Tab_Handler = (event, newValue) => {
        set_Tab(newValue);
        console.log(newValue);
    }

    return (
        <>
            <div className="board_wrap">
                <div className="board_Header">
                    <div>
                        <div>
                            <Drawer
                                title="메뉴"
                                placement='left'
                                closable={false}
                                onClose={Menu_Drawer_Close_Handler}
                                visible={get_Menu_Drawer_Visible}
                                key='menu'
                            >
                                <p onClick={() => history.push('/fin_interest')}>관심 종목</p>
                            </Drawer>
                            <Drawer
                                placement='bottom'
                                closable={false}
                                onClose={Select_Drawer_Close_Handler}
                                visible={get_Select_Drawer_Visible}
                                key='select'
                            >
                                <Radio.Group defaultValue="최신순" style={{ width: '100%' }} onChange={Radio_Handler}
                                    value={radio}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Radio.Button value="최신순" >최신순</Radio.Button>
                                        <Radio.Button value="종목관심도순">종목관심도순</Radio.Button>
                                        <Radio.Button value="인기순">인기순</Radio.Button>
                                        <Radio.Button value="조회순">조회순</Radio.Button>
                                        <Radio.Button value="e">Infinity Scroll</Radio.Button>
                                    </Space>
                                </Radio.Group>
                            </Drawer>
                        </div>
                        <div className="MainMenu">
                            <MenuIcon onClick={Menu_Drawer_Open_Handler} />
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
                            <div className="tabBar">
                                <Paper square style={{ width: '100%' }}>
                                    <Tabs
                                        value={get_Tab}
                                        TabIndicatorProps={{ style: { background: 'black' } }}
                                        onChange={Change_Tab_Handler}
                                        aria-label="disabled tabs example"
                                        variant="fullWidth"
                                    >
                                        <Tab label="오늘 인기 종목" />
                                        <Tab label="나의 관심 종목" />
                                        <Tab label="전체글 보기" />
                                    </Tabs>
                                </Paper>
                            </div>
                            <div className="board_function_wrap">
                                <div className="item1">
                                    <Button onClick={Insert_Session_Handler}>
                                        글쓰기
                                    </Button>
                                </div>
                                <div className="item2" onClick={Select_Drawer_Open_Handler}>
                                    {radio}
                                    <span className="item_icon">
                                        <img src={expand_icon} />
                                    </span>
                                </div>
                                <div className="item3">
                                    <SearchIcon />
                                    {/* <img src={search_icon} /> */}
                                </div>
                                {/* <div>
                                    <div className="board_search_wrap">
                                        <Dropdown overlay={menu} trigger='click'>
                                            <Button>
                                                {get_Menu_Text} <DownOutlined />
                                            </Button>
                                        </Dropdown>
                                        <Search placeholder="검색할 내용을 입력하세요."
                                            onSearch={onSearch} onChange={Search_Input_Handler}
                                            value={get_Search_Value} enterButton />
                                    </div>
                                </div> */}
                                {/* <div className="top_Nav_Wrap">
                                    <Radio.Group defaultValue="a" style={{ width: '100%' }} onChange={Radio_Handler}
                                        value={radio} >
                                        <Radio.Button value="a" >전체글</Radio.Button>
                                        <Radio.Button value="b">인기글</Radio.Button>
                                        <Radio.Button value="c">인기 종목</Radio.Button>
                                        <Radio.Button value="d">인기 종목2</Radio.Button>
                                        <Radio.Button value="e">Infinity Scroll</Radio.Button>
                                    </Radio.Group>
                                </div> */}
                            </div>
                            <div id="board_list"
                                onScroll={Board_Scroll_Handler}>
                                {
                                    get_Tab === 0 ? <Top_Fin_list2 />
                                        : get_Tab === 1 ? <Fin_Interest />
                                            : get_Tab === 2 && radio === '최신순' ? <Board_Infinity />
                                                : get_Tab === 2 && radio === '종목관심도순' ? <Board_Infinity />
                                                    : get_Tab === 2 && radio === '인기순' ? <Top_Fin_list />
                                                        : get_Tab === 2 && radio === '조회순' ? <Top_Fin_list2 />
                                                            : get_Tab === 2 && radio === 'e' ? <Board_Infinity />
                                                                : null}
                            </div>
                        </main>
                        <aside>
                        </aside>
                    </section>
                </div>
                {radio === 'c' ? null
                    :
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
                }
            </div>
        </>
    )

}
export default MainPage;