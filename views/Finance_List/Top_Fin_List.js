import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Button } from 'antd';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Page_Search } from '../../redux/action/page_action';

import './css/Top_Fin_List_CSS.css'
import { server_config } from '../../server_config';

const Top_Fin_list = () => {
    const [get_Best_Finance_List, set_Best_Finance_List] = useState([]);
    const [get_finance_List_Value, set_finance_List_Value] = useState({});

    const history = useHistory();
    const dispatch = useDispatch();
    const { fin_list } = useSelector(state => state.financeList);

    useEffect(() => {
        axios.get(server_config.server_Address + '/finance/best')
            .then((response) => {
                //console.log(response.data);
                set_Best_Finance_List(response.data);
            })

    }, [])

    const Card_Handler = (fin_name) => {
        dispatch(Page_Search('종목명', fin_name));
        history.push(
            {
                pathname: '/fin_info',
                state: { fin_name: fin_name }
            })

            window.sessionStorage.setItem('fin_name', fin_name);
    };

    //관심종목 autocomplete
    const AutoComplete_Change_Handler = (event, newValue) => {
        set_finance_List_Value(newValue);
        //console.log(newValue);
    }

    return (
        <>
            <div className ="Fin_searchwrap">
                <div className="Fin_List">
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
                <div className="Fin_List_Search_Button">
                    <Button onClick={() => Card_Handler(get_finance_List_Value.name)}>종목 검색</Button>
                </div>

            </div>
            <div>
                <Row gutter={10}>
                    {
                        get_Best_Finance_List.map((list, index) => {

                            return (
                                <Col span={12} key={index} onClick={() => { Card_Handler(list.finance_name) }}>
                                    <Card title={list.finance_name} bordered={false}>
                                        {list.finance_name} 가격
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        </>
    )

}


export default Top_Fin_list;
