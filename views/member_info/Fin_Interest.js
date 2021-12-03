import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Page_Reset, Page_Search, Page_Store, Page_Tab } from '../../redux/action/page_action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './css/Fin_InterestCSS.css'
import { useHistory } from 'react-router-dom';
import { server_config } from '../../server_config';
import { Board_Store_Reset } from '../../redux/action/board_list_action';
import CountUp from 'react-countup';
import ReactTooltip from 'react-tooltip';
import { Base64 } from 'js-base64';

const Fin_Interest = () => {
    const [get_finance_List_Value, set_finance_List_Value] = useState({});
    const [get_fin_interest_List, set_fin_interest_List] = useState([]);
    const [get_Finance_Info, set_Finance_Info] = useState('');

    const { fin_list } = useSelector(state => state.financeList);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        Fin_Interest_View_Handler();
    }, [])

    const AutoComplete_Change_Handler = (event, newValue) => {
        set_finance_List_Value(newValue);
        //console.log(newValue);
    }

    //관심종목 뷰
    const Fin_Interest_View_Handler = () => {
        axios.get(server_config.server_Address + '/fin_interest/view')
            .then((response) => {
                //console.log(response.data.fin_interest_data);
                Get_Fin_Interest_Process(response.data.fin_interest_data);
            })
    }

    //관심종목 추가
    const Fin_Interest_Add_Handler = () => {
        //console.log(get_finance_List_Value);
        axios.post(server_config.server_Address + '/fin_interest/insert',
            {
                fin_interest_data: get_finance_List_Value,
            },
        )
            .then((response) => {
                //console.log(response.data);
                Fin_Interest_View_Handler();
            })
    }

    //관심종목 삭제
    const Fin_Interest_Delete_Handler = (list_code) => {
        //console.log(list_code);
        axios.post(server_config.server_Address + '/fin_interest/delete',
            {
                fin_interest_code: list_code
            })
            .then((response) => {
                //console.log(response.data);
                Fin_Interest_View_Handler();
            })
    }

    //관심종목 게시글
    const Fin_Interest_Board_Handler = (list_code) => {
        //console.log(list_code);
        dispatch(Page_Search("종목코드", list_code));
        dispatch(Page_Store(1));
        dispatch(Board_Store_Reset());
        dispatch(Page_Tab(2));
        history.push("/main");
    }

    const Header_Handler = () => {
        dispatch(Page_Reset());
        history.push('/main');
    }

    const Get_Fin_Interest_Process = async (boardList) => {

        if (boardList.length == 0) {
            //console.log("Finish");
            set_fin_interest_List(boardList);
            return;
        }

        //console.log("AA : ", boardList);

        let fin_code_List = [];
        let vote_data_List = [];

        for (let i = 0; i < boardList.length; i++) {
            fin_code_List.push(boardList[i].code);
        }

        for (let i = 0; i < boardList.length; i++) {
            await axios.post(server_config.server_Address + '/finance/info',
                {
                    finance_name: boardList[i].name,
                })
                .then((response) => {
                    //console.log("DATA : ", response.data);
                    vote_data_List.push(response.data);
                })
        }
        //console.log(vote_data_List);

        await axios.post(server_config.server_Address + '/board/countBoard',
            {
                'fin_code_list': fin_code_List,
            })
            .then((response) => {
                //console.log("COUNT : ", response.data.countBoard);

                boardList.map((list, index) => {
                    list.vote = vote_data_List[index];
                    list.count = response.data.countBoard[index];
                    list.index = index + 1;
                    list.key = index + 1;
                });
            })

        //console.log("LIST : ", boardList);

        set_fin_interest_List(boardList);
    }

    //투표
    const Up_Count_Handler = (fin_name) => {
        //console.log("NAME : ", fin_name);
        axios.post(server_config.server_Address + '/finance/up',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log(response.data);
                Fin_Interest_View_Handler();
            })
    }

    const Down_Count_Handler = (fin_name) => {
        axios.post(server_config.server_Address + '/finance/down',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                Fin_Interest_View_Handler();
                //console.log(response.data);
            })
    }
    const Get_Finance_Data = async (fin_name) => {

        //console.log(fin_name);
        await axios.post(server_config.server_Address + '/finance/info',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log("DATA : ", response.data);
                return response.data;
                //set_Finance_Info(response.data);

                //     const header = window.sessionStorage.getItem('user_Token');
                //     const array = header.split(".");
                //     const userName = JSON.parse(Base64.decode(array[1])).userName;

                //     const up_Count_User_Array = response.data.finance_Up_Count_User;
                //     const down_Count_User_Array = response.data.finance_Down_Count_User;

                //     const up_user_Index = up_Count_User_Array.findIndex((e) => e === userName);
                //     const down_user_Index = down_Count_User_Array.findIndex((e) => e === userName);

                //     //console.log(up_user_Index);

                //     if (up_user_Index !== -1) {
                //         document.getElementById('up_count').style.border = "5px double #b95312";
                //     }
                //     else {
                //         document.getElementById('up_count').style.border = "4px solid #b95312";
                //     }

                //     if (down_user_Index !== -1) {
                //         document.getElementById('down_count').style.border = "5px double #303b55";
                //     }
                //     else {
                //         document.getElementById('down_count').style.border = "5px solid #303b55";
                //     }

            })
    }

    return (
        <>
            <div className="board_wrap">
                <div className="container">
                    <section className="board_content">
                        <nav>
                        </nav>
                        <main>
                            <div className="interestWrap">
                                <div>
                                    <Autocomplete
                                        id="highlights-demo"
                                        style={{ width: '100%' }}
                                        options={fin_list}
                                        onChange={AutoComplete_Change_Handler}
                                        getOptionLabel={(option) => option.name + "  |  " + option.code}
                                        renderInput={(params) => (
                                            <TextField {...params} label="종목" variant="outlined" margin="normal" />
                                        )} />
                                </div>
                                <div>
                                    <Button onClick={Fin_Interest_Add_Handler}>
                                        추가
                                    </Button>
                                </div>
                                <div className="interest_List">
                                    {get_fin_interest_List?.map((list, index) => {
                                        //console.log("Interest : ", list);

                                        let head = 0;

                                        if (list.count?.fin_count == 0) {
                                            head = 0;
                                        } else {
                                            head = list?.count?.fin_count * 100;
                                        }
                                        let attention_now = Math.round(head / list?.count?.total_count);

                                        return (
                                            <div key={index} className="interest_List_Item flex column">
                                                <div className="interest_List_info flex width100">
                                                    <div className="fin_interest_title"
                                                        onClick={() => Fin_Interest_Board_Handler(list.code)}>
                                                        {list?.name} ({list?.code})
                                                    </div>
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
                                                        <DeleteOutlined onClick={() => Fin_Interest_Delete_Handler(list.code)} />
                                                    </div>
                                                </div>
                                                <div className="width100">
                                                    <div className="voteWrap">
                                                        <ReactTooltip
                                                            className="up_tooltip"
                                                            id="up_tooltip"
                                                            getContent={dataTip => dataTip} />
                                                        <ReactTooltip
                                                            className="down_tooltip"
                                                            id="down_tooltip"
                                                            getContent={dataTip => dataTip} />
                                                        <div className="up_count" id='up_count'
                                                            onClick={() => Up_Count_Handler(list.name)}
                                                            data-for="up_tooltip"
                                                            data-tip="상승"
                                                            style={{
                                                                width: `${list?.vote?.finance_Up_Count
                                                                    / (list?.vote?.finance_Up_Count + list?.vote?.finance_Down_Count) * 100}%`
                                                            }}>
                                                            {Math.round(list?.vote?.finance_Up_Count
                                                                / (list?.vote?.finance_Up_Count + list?.vote?.finance_Down_Count) * 100)}%

                                                        </div>
                                                        <div className="down_count" id='down_count'
                                                            data-for="down_tooltip"
                                                            data-tip="하강"
                                                            onClick={() => Down_Count_Handler(list.name)}
                                                            style={{
                                                                width: `${list?.vote?.finance_Down_Count
                                                                    / (list?.vote?.finance_Up_Count + list?.vote?.finance_Down_Count) * 100}%`
                                                            }}>
                                                            {100 - Math.round(list?.vote?.finance_Up_Count
                                                                / (list?.vote?.finance_Up_Count + list?.vote?.finance_Down_Count) * 100)}%

                                                        </div>
                                                        <div className="label">
                                                            <br />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) ?? ""}
                                </div>
                            </div>
                        </main>
                        <aside>
                        </aside>
                    </section>
                </div>
                <div className="Board_footer">
                </div>
            </div>
        </>
    )
}

export default Fin_Interest;