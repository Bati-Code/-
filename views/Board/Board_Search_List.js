import axios from 'axios'
import moment from 'moment'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { server_config } from '../../server_config'

import './css/Board_Search_List_CSS.css'

const Board_Search_List = () => {

    const [get_search_log, set_search_log] = useState([]);

    useEffect(() => {

        axios.get(server_config.server_Address + '/search_log/find')
            .then((response) => {

                if (response.data.search_log_find == 0) {
                    console.log("ERROR");
                    return;
                }

                set_search_log(response.data.data);
            })

    }, [])




    return (
        <>
            <div>
                {
                    get_search_log.map((item, index) => {

                        return (
                            <div className="search_log_Wrap flex width100" key={index}>
                                <div className="search_value">
                                    <span>
                                        {item.search_value}
                                    </span>
                                    <span className="search_delete">
                                        X
                                    </span>
                                </div>
                                <div className="search_date">
                                    <span>
                                        {moment(item.search_Date).format('MM-DD')}
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