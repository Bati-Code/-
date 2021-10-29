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

const Top_Fin_list = () => {
    const [get_today_list, set_today_list] = useState([]);

    const history = useHistory();
    const dispatch = useDispatch();
    const { fin_list } = useSelector(state => state.financeList);

    useEffect(() => {
        axios.get(server_config.server_Address + '/board/today')
            .then((response) => {
                console.log("DATA : ", response.data);

                const today_List = response.data.today_list;
                //Get_Attention(boardList);

                today_List.map((list, index) => {
                    list.index = index + 1;
                    list.key = index + 1;
                });

                set_today_list(today_List);
                console.log(today_List);
            })

    }, [])

    const DateDisplay = (list_date) => {
        let date;
        if (dayjs().format('YYYYMMDD') == dayjs(list_date).format('YYYYMMDD')) {
            date = dayjs(list_date).utc(9).format('HH:mm');
        } else {
            date = dayjs(list_date).utc(9).format('MM-DD HH:mm');
        }

        return (date)
    }

    return (
        <>
            <div>
                {
                    get_today_list.map((list, index) => {
                        return (
                            <div className="board_temp_wrap" key={index}>
                                <div className="ranking">
                                    {list.index}
                                </div>
                                <div className="board_title"
                                    onClick={() => {
                                        history.push("/board/view/" + list._id);
                                    }}>
                                    <span>
                                        [{list?.post_fin_list.name}] {list.post_title}
                                    </span>
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
                                    <li>{DateDisplay(list.post_date)}</li> <li> | </li>
                                    <li>조회 : {list.post_count}</li> <li> | </li>
                                    <li>추천 : {list.post_recommend}</li>  <li> | </li>
                                    {/* <li id={(Math.round(get_attention_count[list.index - 1]?.fin_count /
                                get_attention_count[list.index - 1]?.total_count * 100) > 30) ? "red" : ''}

                                onClick={() => {
                                    Modal_Visible_Handler(3, list.post_fin_list.name);
                                }}>관심도 : {
                                    get_attention_count[list.index - 1]?.total_count !== 0 ?
                                        (Math.round(get_attention_count[list.index - 1]?.fin_count /
                                            get_attention_count[list.index - 1]?.total_count * 100))
                                        : 0
                                } %</li> */}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )

}


export default Top_Fin_list;
