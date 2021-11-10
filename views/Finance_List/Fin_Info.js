import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Page_Radio, Page_Reset, Page_Search } from '../../redux/action/page_action';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Base64 } from 'js-base64';

import Board from '../Board/Board';
import './css/Fin_Info_CSS.css'
import { server_config } from '../../server_config';

const Fin_Info = () => {
    const [get_Finance_Info, set_Finance_Info] = useState('');
    const [get_Fin_Interest_Match, set_Fin_Interest_Match] = useState(false);

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const fin_name = location?.state?.fin_name;
    const session_fin_name = window.sessionStorage.getItem('fin_name');

    const Get_Finance_Data = () => {
        axios.post(server_config.server_Address + '/finance/info',
            {
                finance_name: session_fin_name,
            })
            .then((response) => {
                set_Finance_Info(response.data);

                const header = window.sessionStorage.getItem('user_Token');
                const array = header.split(".");
                const userName = JSON.parse(Base64.decode(array[1])).userName;

                const up_Count_User_Array = response.data.finance_Up_Count_User;
                const down_Count_User_Array = response.data.finance_Down_Count_User;

                const up_user_Index = up_Count_User_Array.findIndex((e) => e === userName);
                const down_user_Index = down_Count_User_Array.findIndex((e) => e === userName);

                //console.log(up_user_Index);

                if (up_user_Index !== -1) {
                    document.getElementById('up_count').style.border = "5px double #C42F72";
                }
                else {
                    document.getElementById('up_count').style.border = "4px solid #F53B8E";
                }

                if (down_user_Index !== -1) {
                    document.getElementById('down_count').style.border = "5px double #1AA2BA";
                }
                else {
                    document.getElementById('down_count').style.border = "5px solid #1FBFDB";
                }

            })
    }

    const Get_Fin_Interest_List = () => {
        axios.get(server_config.server_Address + '/fin_interest/view')
            .then((response) => {
                const fin_interest_array = response.data.fin_interest_data;
                const find_array_index = fin_interest_array.findIndex((element) => element.name === session_fin_name);
                if (find_array_index === -1)
                    set_Fin_Interest_Match(false);
                else
                    set_Fin_Interest_Match(true);
            })
    }

    useEffect(() => {
        dispatch(Page_Search('종목명', session_fin_name));
        //console.log("effect");
        //console.log(session_fin_name)
        Get_Finance_Data(session_fin_name);
        Get_Fin_Interest_List(session_fin_name);

    }, [])

    const Up_Count_Handler = () => {
        axios.post(server_config.server_Address + '/finance/up',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log(response.data);
                Get_Finance_Data();
            })
    }

    const Down_Count_Handler = () => {
        axios.post(server_config.server_Address + '/finance/down',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log(response.data);
                Get_Finance_Data();
            })
    }

    const Header_Handler = () => {
        dispatch(Page_Reset());
        history.push('/main');
    }

    //관심종목삭제
    const Delete_Interest_Handler = () => {
        axios.post(server_config.server_Address + '/fin_interest/delete',
            {
                fin_interest_code: get_Finance_Info.finance_code
            })
            .then((response) => {
                //console.log("삭제", response.data);
                Get_Fin_Interest_List();
            })

    }

    //관심종목추가
    const Insert_Interest_Handler = () => {
        axios.post(server_config.server_Address + '/fin_interest/insert',
            {
                fin_interest_data: get_Finance_Info.finance_data,
            },
        )
            .then((response) => {
                //console.log("추가", response.data);
                Get_Fin_Interest_List();
            })
    }

    const Back_Arrow_Handler = () => {
        dispatch(Page_Reset());
        dispatch(Page_Radio('c'));
        history.push('/main');
    }

    return (
        <>
            <div>
                <div className="board_Header" onClick={Header_Handler}>
                    주식토론 게시판
                </div>
                {get_Finance_Info
                    ? <div>
                        <div>
                            <div className="finance_info_function">
                                <div className="finance_back">
                                    <KeyboardBackspaceIcon onClick={Back_Arrow_Handler} />
                                </div>
                                <div className="finance_interest">
                                    {get_Fin_Interest_Match
                                        ? <FavoriteIcon onClick={Delete_Interest_Handler} />
                                        : <FavoriteBorderIcon onClick={Insert_Interest_Handler} />}
                                </div>
                            </div>
                            <div className="finance_info_label">
                                {get_Finance_Info.finance_name}({get_Finance_Info.finance_code})
                            </div>
                            <div className="voteWrap">
                                <div className="label">
                                    상승
                                    <br />
                                    ({get_Finance_Info.finance_Up_Count})
                                </div>
                                <div className="up_count" id='up_count'
                                    onClick={Up_Count_Handler}
                                    style={{
                                        width: `${get_Finance_Info.finance_Up_Count
                                            / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 80}%`
                                    }}>
                                    {Math.round(get_Finance_Info.finance_Up_Count
                                        / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 100)}%

                                </div>
                                <div className="down_count" id='down_count'
                                    onClick={Down_Count_Handler}
                                    style={{
                                        width: `${get_Finance_Info.finance_Down_Count
                                            / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 80}%`
                                    }}>
                                    {100 - Math.round(get_Finance_Info.finance_Up_Count
                                        / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 100)}%

                                </div>
                                <div className="label">
                                    하락
                                    <br />
                                    ({get_Finance_Info.finance_Down_Count})
                                </div>
                            </div>
                        </div>
                        <div className="info_content">
                            <Board />
                        </div>
                    </div>
                    : <span>데이터가 존재하지 않습니다.</span>}

            </div>

        </>
    )
}

export default Fin_Info;
