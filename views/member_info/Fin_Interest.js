import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Page_Reset, Page_Search, Page_Store } from '../../redux/action/page_action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './css/Fin_InterestCSS.css'
import { useHistory } from 'react-router-dom';
import { server_config } from '../../server_config';

const Fin_Interest = () => {
    const [get_finance_List_Value, set_finance_List_Value] = useState({});
    const [get_fin_interest_List, set_fin_interest_List] = useState([]);

    const { fin_list } = useSelector(state => state.financeList);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        Fin_Interest_View_Handler();
    }, [])

    const AutoComplete_Change_Handler = (event, newValue) => {
        set_finance_List_Value(newValue);
        console.log(newValue);
    }

    //관심종목 뷰
    const Fin_Interest_View_Handler = () => {
        axios.get(server_config.server_Address + '/fin_interest/view')
            .then((response) => {
                console.log(response.data.fin_interest_data);
                set_fin_interest_List(response.data.fin_interest_data);
            })
    }

    //관심종목 추가
    const Fin_Interest_Add_Handler = () => {
        console.log(get_finance_List_Value);
        axios.post(server_config.server_Address + '/fin_interest/insert',
            {
                fin_interest_data: get_finance_List_Value,
            },
        )
            .then((response) => {
                console.log(response.data);
                Fin_Interest_View_Handler();
            })
    }

    //관심종목 삭제
    const Fin_Interest_Delete_Handler = (list_code) => {
        console.log(list_code);
        axios.post(server_config.server_Address + '/fin_interest/delete',
            {
                fin_interest_code: list_code
            })
            .then((response) => {
                console.log(response.data);
                Fin_Interest_View_Handler();
            })
    }

    //관심종목 게시글
    const Fin_Interest_Board_Handler = (list_code) => {
        console.log(list_code);
        dispatch(Page_Search("종목코드", list_code));
        dispatch(Page_Store(1));
        history.push("/main");
    }

    const Header_Handler = () => {
        dispatch(Page_Reset());
        history.push('/main');
    }

    return (
        <>
            <div className="board_wrap">
                <div className="board_Header">
                    <div>
                        <div onClick={Header_Handler}>
                                주식토론 게시판
                        </div>
                    </div>
                </div>
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

                                        return (
                                            <div key={index} className="interest_List_Item">
                                                <div onClick={() => Fin_Interest_Board_Handler(list.code)}>
                                                    {list?.name} | {list?.code}
                                                </div>
                                                <div>
                                                    <DeleteOutlined onClick={() => Fin_Interest_Delete_Handler(list.code)} />
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