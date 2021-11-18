import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Button } from 'antd';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import ChatIcon from '@material-ui/icons/Chat';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Page_Search } from '../../redux/action/page_action';

import './css/Top_Fin_List_CSS.css'
import { server_config } from '../../server_config';
import dayjs from 'dayjs';
import CountUp from 'react-countup';
import Modal from 'antd/lib/modal/Modal';
import { ResponsiveContainer } from 'recharts/lib/component/ResponsiveContainer';
import { LineChart } from 'recharts/lib/chart/LineChart';
import { XAxis } from 'recharts/lib/cartesian/XAxis';
import { YAxis } from 'recharts/lib/cartesian/YAxis';
import { Tooltip } from 'recharts/lib/component/Tooltip';
import { Line } from 'recharts/lib/cartesian/Line';

const Top_Fin_list = () => {

    const [get_today_list, set_today_list] = useState([]);
    const [get_Modal_Board_List, set_Modal_Board_List] = useState([]);
    const [get_Modal_Visible, set_Modal_Visible] = useState(false);
    const [get_Post_Author, set_Post_Author] = useState('');
    const [get_chart_data, set_chart_data] = useState('');
    const [get_Chart_Modal_Visible, set_Chart_Modal_Visible] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();
    const { fin_list } = useSelector(state => state.financeList);

    useEffect(() => {
        axios.get(server_config.server_Address + '/board/today')
            .then(async (response) => {
                console.log("DATA : ", response.data);

                const today_List = response.data.today_list;
                await Get_Board_View_Process(today_List);
            })

    }, [])

    const Get_Board_View_Process = async (boardList) => {

        console.log("LIST : ", boardList);
        let array = [];

        if (boardList.length == 0) {
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

                console.log("AAAAA : ", boardList);

            })

        set_today_list(boardList);
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

    const Modal_Visible_Handler = (flag, data, author) => {
        console.log(author);
        set_Post_Author(author);
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

    const Get_Board_Modal_Process = async (boardList) => {

        if (boardList.length == 0) {
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



    return (
        <>
            <div>
                {
                    get_today_list.map((list, index) => {

                        let head = 0;

                        if (list.count?.fin_count == 0) {
                            head = 0;
                        } else {
                            head = list?.count?.fin_count * 100;
                        }
                        let attention_now = Math.round(head / list.count?.total_count);

                        return (
                            // <div className="board_temp_wrap" key={index}>
                            //     <div className="ranking">
                            //         {list.index}
                            //     </div>
                            //     <div className="board_title"
                            //         onClick={() => {
                            //             history.push("/board/view/" + list._id);
                            //         }}>
                            //         <span>
                            //             [{list?.post_fin_list.name}] {list.post_title}
                            //         </span>
                            //         <span className="board_comment_count">
                            //             <ChatIcon style={
                            //                 {
                            //                     fontSize: '1.2rem',
                            //                     marginRight: '3px',
                            //                 }
                            //             } />{list.post_comment.length}
                            //         </span>
                            //     </div>
                            //     <ul className="board_info">
                            //         <li className="post_author">{list.post_author}</li> <li> | </li>
                            //         <li>{DateDisplay(list.post_date)}</li> <li> | </li>
                            //         <li>조회 : {list.post_count}</li> <li> | </li>
                            //         <li>추천 : {list.post_recommend}</li>  <li> | </li>
                            //         {/* <li id={(Math.round(get_attention_count[list.index - 1]?.fin_count /
                            //     get_attention_count[list.index - 1]?.total_count * 100) > 30) ? "red" : ''}

                            //     onClick={() => {
                            //         Modal_Visible_Handler(3, list.post_fin_list.name);
                            //     }}>관심도 : {
                            //         get_attention_count[list.index - 1]?.total_count !== 0 ?
                            //             (Math.round(get_attention_count[list.index - 1]?.fin_count /
                            //                 get_attention_count[list.index - 1]?.total_count * 100))
                            //             : 0
                            //     } %</li> */}
                            //     </ul>
                            // </div>
                            <div className="board_temp_wrap" key={index}>
                                <div className="board_num">
                                    {index + 1}
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
                                                Modal_Visible_Handler(1, list.post_author_ID, list.post_author);
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
            </div>
            <div>
                <Modal title={get_Post_Author + "님의 최근 게시글"} visible={get_Modal_Visible}
                    footer={null} onCancel={() => { Modal_Visible_Handler(0, '') }}>
                    {get_Modal_Board_List.map((list, index) => {

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
                                        <li className="post_author">
                                            {list.post_author}</li> <li> · </li>
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


export default Top_Fin_list;
