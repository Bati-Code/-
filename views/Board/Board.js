import { DownOutlined, FilterTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Pagination, Radio } from 'antd';
import "antd/dist/antd.css";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { Page_Search, Page_Store, Page_Reset } from '../../redux/action/page_action';
import moment from 'moment';
import ChatIcon from '@material-ui/icons/Chat';
import "./css/BoardSearchCSS.css";

const { Search } = Input;

const Board = () => {

    const [get_BoardList, set_BoardList] = useState([]);
    const [get_Board_Total, set_Board_Total] = useState(0);

    const history = useHistory();
    const dispatch = useDispatch();

    const { count, page, search, menu_select, search_value, radio } = useSelector(state => state.pageStore);


    const Get_Board_View = () => {
        if (search) {
            axios.get('http://localhost:5000/board/search/' + menu_select + '/' + search_value + '/' + page)
                .then((response) => {

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
                    const boardList = response.data.docs;
                    set_Board_Total(response.data.totalDocs);

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);
                })
        }
    }

    const Get_Best_Board_view = () => {
        axios.get('http://localhost:5000/board/list/best/' + page)
            .then((response) => {
                const boardList = response.data.docs;
                set_Board_Total(response.data.totalDocs);

                boardList.map((list, index) => {
                    list.index = index + 1;
                    list.key = index + 1;
                });
                set_BoardList(boardList);
            })
    }


    useEffect(() => {
        if (radio !== 'b')
            Get_Board_View();
        else {
            Get_Best_Board_view();
        }
    }, [])

    useEffect(() => {
        if (radio !== 'b') {
            Get_Board_View();
        }
        else {
            Get_Best_Board_view();
        }

    }, [radio, page])

    useEffect(() => {
        axios.get('http://localhost:5000/board/list/' + page)
            .then((response) => {
                const boardList = response.data.docs;
                set_Board_Total(response.data.totalDocs);

                boardList.map((list, index) => {
                    list.index = index + 1;
                    list.key = index + 1;
                });

                set_BoardList(boardList);
            })
    }, [count])

    useEffect(() => {

        if (search_value) {
            axios.get('http://localhost:5000/board/search/' + menu_select + '/' + search_value + '/1')
                .then((response) => {
                    const boardList = response.data.docs;
                    console.log(boardList);

                    set_Board_Total(response.data.totalDocs);

                    boardList.map((list, index) => {
                        list.index = index + 1;
                        list.key = index + 1;
                    });

                    set_BoardList(boardList);

                })
        }

    }, [search_value, search])

    // const onSearch = (value) => {

    //     if (value) {
    //         console.log("search Value", value);
    //         axios.get('http://localhost:5000/board/search/' + get_Menu_Text + '/' + value + '/1')
    //             .then((response) => {

    //                 const boardList = response.data.docs;
    //                 console.log(boardList);

    //                 set_Board_Total(response.data.totalDocs);

    //                 dispatch(Page_Search(get_Menu_Text, value));

    //                 boardList.map((list, index) => {
    //                     list.index = index + 1;
    //                     list.key = index + 1;
    //                 });

    //                 set_BoardList(boardList);

    //             })
    //     }
    //     else {
    //         alert("검색할 내용을 입력하세요.");
    //     }

    // }

    const PageNation_Handler = (page_value) => {
        console.log("page", page_value);
        dispatch(Page_Store(page_value));

        // if (search) {
        //     axios.get('http://localhost:5000/board/search/' + menu_select + '/' + search_value + '/' + page_value)
        //         .then((response) => {
        //             console.log(response.data);

        //             const boardList = response.data.docs;

        //             boardList.map((list, index) => {
        //                 list.index = index + 1;
        //                 list.key = index + 1;
        //             });

        //             set_BoardList(boardList);
        //         })
        // }
        // else {
        //     axios.get('http://localhost:5000/board/list/' + page_value)
        //         .then((response) => {
        //             console.log(response.data);
        //             const boardList = response.data.docs;

        //             boardList.map((list, index) => {
        //                 list.index = index + 1;
        //                 list.key = index + 1;
        //             });

        //             set_BoardList(boardList);
        //         })
        // }
    }


    return (
        <>
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
                                    [{list.post_fin_list.name}]{list.post_title}
                                    <span className="board_comment_count">
                                        <ChatIcon style={
                                            {
                                                fontSize: '1.2rem',
                                                marginRight: '3px',
                                            }
                                        } />{list.post_comment.length}
                                    </span>
                                </div>
                                <ul className="board_info">
                                    <li className="post_author">{list.post_author}</li> <li> | </li>
                                    <li>{moment(list.post_date).format('MM-DD HH:mm')}</li> <li> | </li>
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


