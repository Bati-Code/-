import { AlertOutlined } from '@ant-design/icons';
import Select from '@mui/material/Select';
import { Button } from 'antd';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { server_config } from '../../../server_config';

const Board_Report = (props) => {

    const [get_userName, set_userName] = useState('');
    const [get_report_form_data, set_report_form_data] = useState({
        selected_value: '',
        content: ''
    });

    const get_board_data = props.data;
    const flag = props.flag;
    const status = props.get_status;

    useEffect(() => {
        axios.get(server_config.server_Address + "/user_check")
            .then((response) => {
                if (response.data.userName === get_board_data.post_author
                    && response.data.user_result === 1) {
                }
                set_userName(response.data.userName);
            })
    }, [])

    const textArea_Change_Handler = (e) => {
        console.log(e.target.value);
        console.log(e.target.name);

        set_report_form_data({
            ...get_report_form_data,
            [e.target.name]: e.target.value
        });
    }

    const a = () => {
        axios.post(server_config.server_Address + "/report/status",
            {
                board_id: props.board_id,
            })
            .then((response) => {

                console.log("DATAa : ", response.data);
                console.log("DATAb : ", props.get_status);
                console.log("DATAc : ", status);

                if (props?.get_status?.length != 0) {
                    props.get_status.map((list, index) => {
                        list.report_status = response.data.data[index];
                    })
                    let arr = props.get_status.slice();
                    props.set_status(arr);
                }
            })
    }

    const report_Confirm_Handler = () => {
        console.log(get_report_form_data);
        console.log("AAAAAAAAAAA ", get_board_data);
        if (get_report_form_data.selected_value != '' && get_report_form_data.content != '') {
            let bad_user_data = '';

            switch (flag) {
                case 'board':
                    bad_user_data = get_board_data.post_author;
                    break;
                case 'comment':
                    bad_user_data = get_board_data.comment_author;
                    break;
                case 'recomment':
                    bad_user_data = get_board_data.recomment_author;
                    break;
                default:
                    break;
            }
            axios.post(server_config.server_Address + '/report/report',
                {
                    report_form_data: get_report_form_data,
                    report_user: get_userName,
                    board_id: get_board_data._id,
                    bad_user: bad_user_data
                })
                .then((response) => {
                    console.log(response.data);

                    switch (flag) {
                        case 'board':
                            props.set_report_status(true);
                            break;
                        case 'comment':
                            a();
                            break;
                        case 'recomment':
                            a();
                            break;
                        default:
                            break;
                    }
                })

            set_report_form_data({
                selected_value: '',
                content: ''
            });
            props.set_visible(false);

        }
        else {
            window.alert("신고 내용을 입력하시기 바랍니다.");
        }
    }

    return (
        <Modal
            wrapClassName="reportModal"
            title={flag == "board" ? "게시글 신고하기" : flag == "comment" ? "댓글 신고하기" : "답글 신고하기"}
            visible={props.get_visible}
            onCancel={() => { props.set_visible(false) }}
            okText="신고"
            onOk={report_Confirm_Handler}
            cancelText="취소"

            bodyStyle={{ backgroundColor: '#f6f6f6', paddingTop: '0px', paddingBottom: '0px' }}
            footer={[
                <Button key='report' icon={<AlertOutlined />} onClick={report_Confirm_Handler}>신고하기</Button>
            ]}
        >
            <div id="report_wrap">
                <div id="report_div">
                    <span id="label">제목 : </span>
                    <span>{flag == "board" ? get_board_data.post_title :
                        flag == "comment" ? get_board_data.comment_content :
                            flag == 'recomment' ? get_board_data.recomment_content : null}</span>
                </div>
                <div id="report_div">
                    <span id="label">작성자 : </span>
                    <span>{get_userName}</span>
                </div>
                <div id="report_div">
                    <span id="item">
                        <FormControl sx={{ m: 1, minWidth: 120, width: '100%', backgroundColor: 'white' }}>
                            <InputLabel id="select_label">신고 항목</InputLabel>
                            <Select
                                labelId="select_label"
                                name='selected_value'
                                id='report'
                                value={get_report_form_data.selected_value}
                                label='신고 항목 선택'
                                onChange={textArea_Change_Handler}>
                                <MenuItem value={'광고'}>광고</MenuItem>
                                <MenuItem value={'욕설'}>욕설</MenuItem>
                                <MenuItem value={'허위루머'}>허위루머</MenuItem>
                                <MenuItem value={'타종목추천'}>타종목추천</MenuItem>
                                <MenuItem value={'도배'}>도배</MenuItem>
                                <MenuItem value={'명예훼손'}>명예훼손</MenuItem>
                                <MenuItem value={'주제무관'}>주제무관</MenuItem>
                            </Select>
                        </FormControl>
                    </span>
                </div>
            </div>
            <div>
                <textarea id="content" name="content"
                    value={get_report_form_data.content} onChange={textArea_Change_Handler} />
            </div>
            <div>
                신고된 내용은 확인후 처리하겠습니다. 소중한 신고 감사합니다.
            </div>
        </Modal>
    )
}

export default Board_Report;
