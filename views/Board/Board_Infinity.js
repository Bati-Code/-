import { LineChart, Line, Tooltip, YAxis } from 'recharts';
import { Modal } from 'antd';
import "antd/dist/antd.css";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import ChatIcon from '@material-ui/icons/Chat';
import "./css/BoardSearchCSS.css";
import { server_config } from '../../server_config';
import utc from 'dayjs/plugin/utc';
import { XAxis } from 'recharts/lib/cartesian/XAxis';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Skeleton } from '@mui/material';
import { Board_Infinity_Page, board_Store, Board_Store_Reset } from '../../redux/action/board_list_action';
import CountUp from 'react-countup';

dayjs.extend(utc);

const Board_Infinity = (props) => {

    const [get_Modal_Visible, set_Modal_Visible] = useState(false);
    const [get_Chart_Modal_Visible, set_Chart_Modal_Visible] = useState(false);
    const [get_Modal_Board_List, set_Modal_Board_List] = useState([]);
    const [get_attention_count, set_attention_count] = useState([]);
    const [get_Post_Author, set_Post_Author] = useState('');
    const [get_chart_data, set_chart_data] = useState('');


    const [get_more_list, set_more_list] = useState(true);
    const [get_page, set_page] = useState(1);

    const history = useHistory();
    const dispatch = useDispatch();

    const { count, page, search, menu_select, search_value, radio, date } = useSelector(state => state.pageStore);
    const { board_list, scroll, infinity_page } = useSelector(state => state.boardStore);

    let flag = 0;

    useEffect(() => {
        console.log("NORMAL EFFECT ===");
        flag = 1;

        if (board_list.length !== 0) {
            console.log("Get_Board_View Effect B");
            document.getElementById('board_list').scrollTo(0, scroll);
        }
        else {
            console.log("BB");
            set_more_list(true);
            Get_Board_View();
        }
    }, [radio])

    useEffect(() => {
        if (flag == 1)
            return;
        console.log("Search");
        Get_Board_View();

    }, [search, search_value])

    useEffect(() => {
    }, [radio])

    const Get_Board_View = () => {
        console.log(radio, " : ", scroll, " : ", infinity_page);
        if (radio === 'e') {
            console.log("AAAA");
            document.getElementById('board_list').scrollTo(0, scroll);
        }
        if (search) {

            switch (radio) {
                case '최신순':
                    console.log("AAAAAAAAAA");
                    axios.get(server_config.server_Address + '/board/search/' + menu_select + '/' + search_value +
                        '/' + date[0] + '/' + date[1] + '/' + infinity_page)
                        .then(async (response) => {
                            console.log(board_list);
                            console.log(search_value, " : ", search, " : ", infinity_page);
                            let boardList = response.data.docs;

                            await Get_Board_View_Process(boardList);
                        })
                    break;
                case '종목관심도순':
                    axios.get(server_config.server_Address + '/board/desc/attention/search/' + menu_select +
                        '/' + search_value + '/' + infinity_page)
                        .then(async (response) => {

                            let boardList = response.data.boards.docs;
                            let board_Array = [];

                            for (let i = 0; i < boardList.length; i++) {
                                board_Array.push(boardList[i].boards_object);
                            }

                            await Get_Board_View_Process(board_Array);
                        })
                    break;
                case '인기순':
                    axios.get(server_config.server_Address + '/board/desc/like/search/' + menu_select + '/' + search_value +
                        '/' + date[0] + '/' + date[1] + '/' + infinity_page)
                        .then(async (response) => {
                            console.log(board_list);
                            console.log(search_value, " : ", search, " : ", infinity_page);
                            let boardList = response.data.docs;

                            await Get_Board_View_Process(boardList);
                        })
                    break;
                case '조회순':
                    axios.get(server_config.server_Address + '/board/desc/view/search/' + menu_select + '/' + search_value +
                        '/' + date[0] + '/' + date[1] + '/' + infinity_page)
                        .then(async (response) => {
                            console.log(board_list);
                            console.log(search_value, " : ", search, " : ", infinity_page);
                            let boardList = response.data.docs;

                            await Get_Board_View_Process(boardList);
                        })
                    break;

                default:
                    console.log("default");
                    break;
            }
            console.log(date);

        }
        else {

            console.log("Radio : ", radio);
            if (radio == "최신순") {
                axios.get(server_config.server_Address + '/board/list/' + infinity_page)
                    .then(async (response) => {
                        let boardList = response.data.docs;
                        console.log("LLLLLLLLLLLLLLLL : ", boardList);

                        await Get_Board_View_Process(boardList);
                    })

            } else if (radio == "종목관심도순") {
                axios.get(server_config.server_Address + '/board/desc/attention/' + infinity_page)
                    .then(async (response) => {
                        console.log(response.data);
                        let boardList = response.data.boards.docs;
                        let board_Array = [];

                        for (let i = 0; i < boardList.length; i++) {
                            board_Array.push(boardList[i].boards_object);
                        }

                        await Get_Board_View_Process(board_Array);
                    })
            } else if (radio == "인기순") {
                axios.get(server_config.server_Address + '/board/desc/like/' + infinity_page)
                    .then(async (response) => {
                        console.log(response.data);
                        let boardList = response.data.docs;

                        await Get_Board_View_Process(boardList);
                    })
            } else if (radio == "조회순") {
                axios.get(server_config.server_Address + '/board/desc/view/' + infinity_page)
                    .then(async (response) => {
                        console.log(response.data);
                        let boardList = response.data.docs;

                        await Get_Board_View_Process(boardList);
                    })
            }

        }
    }

    const Get_Board_View_Process = async (boardList) => {

        if (boardList.length == 0) {
            set_more_list(false);
            console.log("Finish");
            return;
        }

        let fin_code_List = [];
        for (let i = 0; i < boardList.length; i++) {
            fin_code_List.push(boardList[i].post_fin_list.code);
        }

        await axios.post(server_config.server_Address + '/board/countBoard',
            {
                'fin_code_list': fin_code_List,
            })
            .then((response) => {
                console.log("COUNT : ", response.data.countBoard);
                boardList.map((list, index) => {
                    list.count = response.data.countBoard[index];
                    list.index = index + 1;
                    list.key = index + 1;
                });

                boardList = board_list.concat(boardList);
            })


        console.log("BoardList : Search", boardList);

        dispatch(board_Store(boardList));
        dispatch(Board_Infinity_Page(infinity_page + 1));
    }

    const Get_Board_Modal_Process = async (boardList) => {

        if (boardList.length == 0) {
            set_more_list(false);
            console.log("Finish");
            return;
        }

        let fin_code_List = [];
        for (let i = 0; i < boardList.length; i++) {
            fin_code_List.push(boardList[i].post_fin_list.code);
        }

        await axios.post(server_config.server_Address + '/board/countBoard',
            {
                'fin_code_list': fin_code_List,
            })
            .then((response) => {
                console.log("COUNT : ", response.data.countBoard);
                boardList.map((list, index) => {
                    list.count = response.data.countBoard[index];
                    list.index = index + 1;
                    list.key = index + 1;
                });
            })

            set_Modal_Board_List(boardList);
    }


    const DateDisplay = (list_date) => {
        let date;
        if (dayjs().format('YYYYMMDD') == dayjs(list_date).format('YYYYMMDD')) {
            date = dayjs(list_date).utc(9).format('HH:mm');
        } else {
            date = dayjs(list_date).utc(9).format('MM-DD HH:mm');
        }

        return (date)
    }

    const Modal_Visible_Handler = (flag, data) => {
        set_Post_Author(data);
        if (flag == 1) {
            set_Modal_Visible(true);
            axios.get(server_config.server_Address + '/board/search/author/' + data)
                .then((response) => {
                    console.log(response.data);
                    Get_Board_Modal_Process(response.data);
                });
        }
        else if (flag == 0) {
            set_Modal_Visible(false);
        }
        else if (flag == 3) {
            set_Chart_Modal_Visible(true);

            axios.post(server_config.server_Address + '/board/chart',
                {
                    fin_name: data,
                })
                .then((response) => {
                    console.log(response.data);
                    set_chart_data(response.data);
                })
        }
        else if (flag == 4) {
            set_Chart_Modal_Visible(false);
        }
    }

    const next = () => {

        console.log("next");
        Get_Board_View();
    }

    return (
        <>
            <div>
                <InfiniteScroll
                    dataLength={board_list.length}
                    next={next}
                    hasMore={get_more_list}
                    loader={
                        <div className="board_temp_wrap">
                            <Skeleton animation="wave"
                                style={{
                                    marginLeft: "10px",
                                    width: '50%',
                                }} />
                            <Skeleton animation="wave"
                                style={{
                                    marginLeft: "10px",
                                    width: '90%',
                                }} />
                        </div>
                    }
                    scrollableTarget="board_list"
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>You have seen it all {board_list.length}</b>
                        </p>
                    }
                >

                    {
                        board_list.map((list, index) => {

                            let head = 0;

                            if (list.count?.fin_count == 0) {
                                head = 0;
                            } else {
                                head = list?.count?.fin_count * 100;
                            }
                            let attention_now = Math.round(head / list.count?.total_count);

                            return (
                                <div className="board_temp_wrap" key={index}>
                                    <div className="board_num">
                                        {list.post_num}
                                    </div>
                                    <div className="board_main">
                                        <div className="board_fin_name">
                                            {list?.post_fin_list.name}
                                        </div>
                                        <div className="board_title"
                                            onClick={() => {
                                                history.push("/board/view/" + list._id);
                                                window.sessionStorage.setItem('fin_name', list?.post_fin_list.name);
                                            }}>
                                            <span>{list.post_title}</span>
                                            {
                                                list.post_comment.length != 0 &&
                                                <div className="tooltip">
                                                    {list.post_comment.length}
                                                </div>
                                            }
                                        </div>
                                        <ul className="board_info">
                                            <li className="post_author"
                                                onClick={() => {
                                                    Modal_Visible_Handler(1, list.post_author);
                                                }}>{list.post_author}</li> <li> · </li>
                                            <li>{DateDisplay(list.post_date)}</li> <li> · </li>
                                            <li>조회수 {list.post_count}</li>
                                        </ul>
                                    </div>
                                    <div className="board_like">
                                        <div id={attention_now > 30 ? "red" : ''}
                                            onClick={() => {
                                                Modal_Visible_Handler(3, list.post_fin_list.name);
                                            }}>
                                            관심도 <CountUp
                                                start={0}
                                                end={attention_now}
                                                duration={2} /> %
                                        </div>
                                        <div>
                                            좋아요 {list.post_recommend}
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    }



                </InfiniteScroll>
            </div>
            <div>
                <Modal title={get_Post_Author + "님의 최근 게시글"} visible={get_Modal_Visible}
                    footer={null} onCancel={() => { Modal_Visible_Handler(0, '') }}>
                    {get_Modal_Board_List.map((list, index) => {

                        console.log(list);

                        let head = 0;

                        if (list.count?.fin_count == 0) {
                            head = 0;
                        } else {
                            head = list?.count?.fin_count * 100;
                        }
                        let attention_now = Math.round(head / list.count?.total_count);

                        return (
                            <div className="board_temp_wrap" key={index}>
                                <div className="board_num">
                                    {list.post_num}
                                </div>
                                <div className="board_main">
                                    <div className="board_fin_name">
                                        {list?.post_fin_list.name}
                                    </div>
                                    <div className="board_title"
                                        onClick={() => {
                                            history.push("/board/view/" + list._id);
                                            window.sessionStorage.setItem('fin_name', list?.post_fin_list.name);
                                        }}>
                                        <span>{list.post_title}</span>
                                        {
                                            list.post_comment.length != 0 &&
                                            <div className="tooltip">
                                                {list.post_comment.length}
                                            </div>
                                        }
                                    </div>
                                    <ul className="board_info">
                                        <li className="post_author"
                                            onClick={() => {
                                                Modal_Visible_Handler(1, list.post_author);
                                            }}>{list.post_author}</li> <li> · </li>
                                        <li>{DateDisplay(list.post_date)}</li> <li> · </li>
                                        <li>조회수 {list.post_count}</li>
                                    </ul>
                                </div>
                                <div className="board_like">
                                    <div id={attention_now > 30 ? "red" : ''}
                                        onClick={() => {
                                            Modal_Visible_Handler(3, list.post_fin_list.name);
                                        }}>
                                        관심도 <CountUp
                                            start={0}
                                            end={attention_now}
                                            duration={2} /> %
                                    </div>
                                    <div>
                                        좋아요 {list.post_recommend}
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </Modal>
                <Modal title={get_chart_data.fin_name} visible={get_Chart_Modal_Visible}
                    footer={null} onCancel={() => { Modal_Visible_Handler(4, '') }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={get_chart_data.chart_data}>
                            <XAxis dataKey="name" stroke="#8884d8" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip
                                tickFormatter={(timeStr) => dayjs(timeStr).format("MM/DD")}
                                labelFormatter={(value) => `날짜: ${value}`}
                                formatter={(value) => [value + "%", "관심도"]}
                            />
                            <Line type="monotone" dataKey="data" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Modal>
            </div>
        </>
    )

}



export default Board_Infinity;


