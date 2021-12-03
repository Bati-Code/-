import axios from 'axios'
import moment from 'moment'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { server_config } from '../../server_config'

import { CloseOutlined } from '@ant-design/icons';
import './css/Board_Search_List_CSS.css'
import { Page_Search, Page_Search_UI } from '../../redux/action/page_action'
import { Board_Infinity_Page, Board_Store_Reset } from '../../redux/action/board_list_action'

const Board_Search_List = () => {

    const [get_search_log, set_search_log] = useState([]);

    const dispatch = useDispatch();
    const { radio, search, menu_select, search_value, search_ui } = useSelector(state => state.pageStore);

    useEffect(() => {
        View_Search_Log();
    }, [])

    const View_Search_Log = () => {
        axios.get(server_config.server_Address + '/search_log/find')
            .then((response) => {

                if (response.data.search_log_find == 0) {
                    //console.log("ERROR");
                    return;
                }

                set_search_log(response.data.data);
            })

    }

    const Search_Log = (get_Menu_Text, value) => {
        //console.log("CLICK");
        dispatch(Page_Search(get_Menu_Text, value));
        dispatch(Board_Store_Reset());
        dispatch(Board_Infinity_Page(1));
        dispatch(Page_Search_UI(false));
    }

    const Delete_Log = (id) => {
        //console.log(id);

        axios.post(server_config.server_Address + '/search_log/delete',
            {
                search_log_id: id,
            })
            .then((response) => {
                //console.log(response.data);
                View_Search_Log();
            })
    }


    return (
        <>
            <div>
                {
                    get_search_log.map((item, index) => {

                        return (
                            <div className="search_log_Wrap flex width100" key={index}>
                                <div className="search_value">
                                    <span
                                        onClick={() => Search_Log(item.member_Search_List.search_type,
                                            item.member_Search_List.search_value)}>
                                        {item.member_Search_List.search_value}
                                    </span>
                                    <span className="search_delete" onClick={() => Delete_Log(item.member_Search_List._id)}>
                                        <CloseOutlined />
                                    </span>
                                </div>
                                <div className="search_date">
                                    <span>
                                        {moment(item.member_Search_List.search_Date).format('MM-DD')}
                                    </span>

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )


}

export default Board_Search_List;