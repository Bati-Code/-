import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'antd';
import axios from 'axios';

import './css/Top_Fin_List_CSS.css'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Page_Search } from '../../redux/action/page_action';

const Top_Fin_list = () => {
    const [get_Best_Finance_List, set_Best_Finance_List] = useState([]);

    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get('http://localhost:5000/finance/best')
            .then((response) => {
                console.log(response.data);
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
    };

    return (
        <>
            <Row gutter={10}>
                {
                    get_Best_Finance_List.map((list, index) => {

                        return (
                            <Col span={12} key={index} onClick={() => { Card_Handler(list.finance_name) }}>
                                <Card title={list.finance_name} bordered={false}>
                                    {list.finance_name}
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
        </>
    )

}


export default Top_Fin_list;
