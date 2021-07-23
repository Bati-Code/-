import { DownOutlined, FilterTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Pagination } from 'antd';
import "antd/dist/antd.css";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Page_Search, Page_Store } from '../../redux/action/page_action';
import "./css/BoardSearchCSS.css";


const { Search } = Input;

const Board = () => {

    const [get_BoardList, set_BoardList] = useState([]);
    const [get_Board_Total, set_Board_Total] = useState(0);
    const [get_Menu_Text, set_Menu_Text] = useState('제목');

    const history = useHistory();
    const dispatch = useDispatch();

    const { page, search, menu_select, search_value } = useSelector(state => state.pageStore);

    useEffect(() => {
        // const meta = document.createElement('meta');
        // meta.name = "viewport";
        // meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        // document.getElementsByTagName('head')[0].appendChild(meta);

        if (search) {
            axios.get('http://localhost:5000/board/search/' + menu_select + '/' + search_value + '/' + page)
                .then((response) => {
                    console.log(response.data);

                    const boardList = response.data.docs;
                    set_Board_Total(response.data.totalDocs);

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);
                })
        }
        else {
            axios.get('http://localhost:5000/board/list/' + page)
                .then((response) => {
                    console.log(response.data);
                    const boardList = response.data.docs;
                    set_Board_Total(response.data.totalDocs);

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);
                })
        }


    }, [])

    const onSearch = (value) => {

        if (value) {
            axios.get('http://localhost:5000/board/search/' + get_Menu_Text + '/' + value + '/1')
                .then((response) => {

                    const boardList = response.data.docs;
                    console.log(boardList);

                    set_Board_Total(response.data.totalDocs);

                    dispatch(Page_Search(get_Menu_Text, value));

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);

                })
        }
        else {
            alert("검색할 내용을 입력하세요.");
        }

    }


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

    const PageNation_Handler = (page_value) => {
        dispatch(Page_Store(page_value));

        if (search) {
            axios.get('http://localhost:5000/board/search/' + menu_select + '/' + search_value + '/' + page_value)
                .then((response) => {
                    console.log(response.data);

                    const boardList = response.data.docs;

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);
                })
        }
        else {
            axios.get('http://localhost:5000/board/list/' + page_value)
                .then((response) => {
                    console.log(response.data);
                    const boardList = response.data.docs;

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);
                })
        }
    }

    console.log(get_BoardList);
    console.log(search, menu_select, search_value);

    return (
        <>
            <div className="board_search_wrap">
                <Dropdown overlay={menu}>
                    <Button>
                        {get_Menu_Text} <DownOutlined />
                    </Button>
                </Dropdown>
                <Search placeholder="검색할 내용을 입력하세요."
                    onSearch={onSearch} enterButton />
            </div>
            <div>
                {
                    get_BoardList.map((list, index) => {
                        return (
                            <div className="board_temp_wrap" key={index}
                                onClick={() => {
                                    console.log(list._id);
                                    history.push("/board/view/" + list._id);
                                }}>
                                <div className="board_title">
                                    [{list.post_item_name}]{list.post_title}
                                </div>
                                <ul className="board_info">
                                    <li className="post_author">{list.post_author}</li> <li> | </li>
                                    <li>{list.post_date}</li> <li> | </li>
                                    <li>조회 : {list.post_count}</li> <li> | </li>
                                    <li>추천 : {list.post_recommend}</li>
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <Pagination current={page} onChange={PageNation_Handler} total={get_Board_Total} />
            </div>
        </>
    )

}



export default Board;


