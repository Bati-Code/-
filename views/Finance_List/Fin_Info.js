import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Page_Reset } from '../../redux/action/page_action';

import Board from '../Board/Board';
import './css/Fin_Info_CSS.css'

const Fin_Info = () => {
    const [get_Finance_Info, set_Finance_Info] = useState('');

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const fin_name = location?.state?.fin_name;

    const Get_Finance_Data = () => {
        axios.post('http://localhost:5000/finance/info',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                console.log(response.data);
                set_Finance_Info(response.data)
            })
    }

    useEffect(() => {
        Get_Finance_Data();
    }, [])

    const Up_Count_Handler = () => {
        axios.post('http://localhost:5000/finance/up',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                console.log(response.data);
                Get_Finance_Data();
            })
    }

    const Down_Count_Handler = () => {
        axios.post('http://localhost:5000/finance/down',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                console.log(response.data);
                Get_Finance_Data();
            })
    }

    const Header_Handler = () => {
        dispatch(Page_Reset());
        history.push('/main');
    }


    return (
        <>
            <div>
                <div className="board_Header" onClick={Header_Handler}>
                    주식토론 게시판
                </div>
                <div>
                    <div className="finance_info_function">
                        <button>추천</button>
                    </div>
                    <div className="finance_info_label">
                        {get_Finance_Info.finance_name}({get_Finance_Info.finance_code})
                    </div>
                    <div className="voteWrap">
                        <div className="label">
                            상승
                        </div>
                        <div className="up_count"
                            onClick={Up_Count_Handler}
                            style={{
                                width: `${get_Finance_Info.finance_Up_Count
                                    / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 80}%`
                            }}>
                            {Math.round(get_Finance_Info.finance_Up_Count
                                / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 100)}%
                            ({get_Finance_Info.finance_Up_Count})
                        </div>
                        <div className="down_count"
                            onClick={Down_Count_Handler}
                            style={{
                                width: `${get_Finance_Info.finance_Down_Count
                                    / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 80}%`
                            }}>
                            {Math.round(get_Finance_Info.finance_Down_Count
                                / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 100)}%
                            ({get_Finance_Info.finance_Down_Count})
                        </div>
                        <div className="label">
                            하락
                        </div>
                    </div>
                </div>
                <div className="info_content">
                    <Board />
                </div>
            </div>

        </>
    )
}

export default Fin_Info;
