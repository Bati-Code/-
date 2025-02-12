import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useAlert } from 'react-alert'

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/BoardInsertCSS.css';
import { useDispatch, useSelector } from 'react-redux';

import { Board_Store_Reset, board_Store_Reset } from '../../redux/action/board_list_action';
import { Editor } from '@tinymce/tinymce-react';
import { server_config } from '../../server_config';
import ReactTooltip from 'react-tooltip';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { Page_Tab } from '../../redux/action/page_action';

const BoardInsert = () => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_intetest_finance_List, set_intetest_finance_List] = useState([]);
    const [get_finance_List_Value, set_finance_List_Value] = useState('');
    const [get_fin_vote, set_fin_vote] = useState([]);
    const [get_loading, set_loading] = useState(false);
    const [get_checked, set_checked] = useState(false);

    const history = useHistory();
    const alert = useAlert();

    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const { fin_list } = useSelector(state => state.financeList);


    useEffect(() => {
        axios.get(server_config.server_Address + '/fin_interest/view')
            .then((response) => {
                //console.log(response.data);
                set_intetest_finance_List(response.data);
            })
    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
    }

    const onChange_Handler = (e) => {

        const bodyFormData = new FormData();

        for (let i = 0; i < e.target.files.length; i++) {
            bodyFormData.append("imgs", e.target.files[i]);
            //console.log(i);
        }
        bodyFormData.append("path", "community/board");

        set_loading(true);
        axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/image_upload',
            bodyFormData)
            .then((response) => {
                //console.log(response.data);
                if (response.data.code == 200) {
                    set_loading(false);
                    for (let i = 0; i < response.data.images.length; i++) {
                        tinymce.execCommand('mceInsertContent', false,
                            "<img src='" + response.data.images[i].imgurl +
                            "' data-mce-src='" + response.data.images[i].imgurl +
                            "' data-originalFileName='" + response.data.images[i].imgurl +
                            "' style = '" + "max-width: 100%;" + "'>");
                    }
                } else {
                    set_loading(false);
                    alert.show("이미지 파일 업로드 실패");

                }
            })
            .catch((error) => {
                //console.log(error);
                set_loading(false);
                alert.show("이미지 파일 업로드 실패");
            })

        e.target.value = "";

    }

    const BoardInsert_Handler = async () => {

        if (get_BoardData && get_BoardTitle && get_finance_List_Value) {

            await axios.post(server_config.server_Address + '/board/insert',
                {
                    board_title: get_BoardTitle,
                    board_Data: get_BoardData,
                    board_item: get_finance_List_Value
                },
                {
                    headers: { 'authorization': sessionStorage.getItem('user_Token') },
                }
            )
                .then((request) => {
                    if (request.data.board_insert === 0) {
                        //console.log("업로드 실패");
                        history.push('/main');
                    }
                    else if (request.data.board_insert === 100) {
                        //console.log("세션 체크 실패");
                        history.push('/login');
                    }
                    else if (request.data.board_insert === 1) {
                        //console.log("업로드 성공");
                        dispatch(Board_Store_Reset());
                        history.push('/main');
                    }

                })

            if (get_checked) {
                await axios.post(server_config.server_Address + '/fin_interest/insert',
                    {
                        fin_interest_data: get_finance_List_Value,
                    },
                )
                    .then((response) => {
                        //console.log("관심종목 등록 성공", response.data);
                        dispatch(Page_Tab(2));
                    })
            }
        }
        else {
            alert.show("정보를 모두 입력하시기 바랍니다.");
        }
    }


    const AutoComplete_Change_Handler = async (event, newValue) => {
        set_finance_List_Value(newValue);
        const interest_index = get_intetest_finance_List.fin_interest_data.findIndex((e) => e.code == newValue.code);
        if (interest_index >= 0) {
            set_checked(true);
        }
        else{
            set_checked(false);
        }
        Get_Vote_View(newValue);
    }

    const Get_Vote_View = async (value) => {
        await axios.post(server_config.server_Address + '/finance/info',
            {
                finance_name: value.name,
            })
            .then((response) => {
                //console.log("DATA : ", response.data);
                set_fin_vote(response.data);
            })
    }

    //투표
    const Up_Count_Handler = (fin_name) => {
        axios.post(server_config.server_Address + '/finance/up',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log(response.data);
                Get_Vote_View(get_finance_List_Value);
            })
    }

    const Down_Count_Handler = (fin_name) => {
        axios.post(server_config.server_Address + '/finance/down',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                Get_Vote_View(get_finance_List_Value);
                //console.log(response.data);
            })
    }

    const Interest_Fin_Handler = (e) => {
        //console.log(e.target.checked);
        set_checked(e.target.checked);
    }

    return (
        <>
            <div className='board_insert_wrap'>
                <div className='board_insert_button_wrap'>
                    <div style={{ fontSize: '17px' }} onClick={() => { history.push('/main') }}>
                        <CloseOutlined />
                    </div>
                    <div>
                        <Button className="insert_button" onClick={BoardInsert_Handler} icon={<FormOutlined />}>
                            글 작성
                        </Button>
                    </div>
                </div>
                <div id='title'>
                    <input name="tite" id="title_input"
                        type="text" placeholder="제목을 입력해주세요." onChange={BoardTitle_Handler}></input>
                </div>
                <div className='board_insert_finance_list flex aligncenter'>
                    <div className="width65">
                        <Autocomplete
                            id="highlights-demo"
                            disableListWrap
                            style={{ width: '100%' }}
                            options={fin_list}
                            onChange={AutoComplete_Change_Handler}
                            getOptionLabel={(option) => option.name + "(" + option.code + ")"}
                            renderInput={(params) => (
                                <TextField {...params} label="종목" variant="standard" margin="normal" />
                            )} />
                    </div>
                    <div className="width45">
                        <FormGroup>
                            <FormControlLabel style={{ marginRight: '0px' }} labelPlacement="start"
                                control={<Checkbox
                                    checked={get_checked}
                                    onChange={Interest_Fin_Handler} />} label="관심종목등록" />
                        </FormGroup>
                    </div>
                </div>
                <div>
                    {get_fin_vote.length != 0 &&
                        <div className="voteWrap_insert">
                            <ReactTooltip
                                className="up_tooltip"
                                id="up_tooltip"
                                getContent={dataTip => dataTip + " : " + get_fin_vote.finance_Up_Count} />
                            <ReactTooltip
                                className="down_tooltip"
                                id="down_tooltip"
                                getContent={dataTip => dataTip + " : " + get_fin_vote.finance_Down_Count} />
                            <div className="up_count_insert" id='up_count'
                                onClick={() => Up_Count_Handler(get_fin_vote.finance_name)}
                                data-for="up_tooltip"
                                data-tip="상승"
                                style={{
                                    width: `${get_fin_vote?.finance_Up_Count
                                        / (get_fin_vote?.finance_Up_Count + get_fin_vote?.finance_Down_Count) * 100}%`
                                }}>
                                {Math.round(get_fin_vote?.finance_Up_Count
                                    / (get_fin_vote?.finance_Up_Count + get_fin_vote?.finance_Down_Count) * 100)}%

                            </div>
                            <div className="down_count_insert" id='down_count'
                                data-for="down_tooltip"
                                data-tip="하강"
                                onClick={() => Down_Count_Handler(get_fin_vote.finance_name)}
                                style={{
                                    width: `${get_fin_vote?.finance_Down_Count
                                        / (get_fin_vote?.finance_Up_Count + get_fin_vote?.finance_Down_Count) * 100}%`
                                }}>
                                {100 - Math.round(get_fin_vote?.finance_Up_Count
                                    / (get_fin_vote?.finance_Up_Count + get_fin_vote?.finance_Down_Count) * 100)}%

                            </div>
                            <div className="label">
                                <br />
                            </div>
                        </div>
                    }
                </div>
                <Spin spinning={get_loading}>
                    <div id='editor'>
                        <Editor
                            onEditorChange={(newValue, editor) => set_BoardData(newValue)}
                            init={{
                                id: 'editor',
                                placeholder: '글 작성',
                                min_height: 500,
                                max_height: 500,
                                max_width: '100%',
                                language: 'ko_KR',
                                menubar: false,
                                //remove_script_host: false,
                                relative_urls: false,
                                convert_urls: true,
                                image_title: true,
                                automatic_uploads: true,
                                file_picker_types: 'image',
                                branding: false,

                                file_picker_callback: function (cb, value, meta) {
                                    editorRef.current.click();
                                },

                                plugins: [
                                    'advlist autoresize autolink image lists charmap print preview hr anchor pagebreak',
                                    'searchreplace visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                                    'table emoticons template paste, link'
                                ],
                                toolbar: 'insertfile undo redo | styleselect | bold italic ' +
                                    '| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' +
                                    '| custom preview media | forecolor backcolor emoticons',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px}',
                                content_style: 'p { margin: 3px; }',
                                content_style: 'img { max-width: 100%; }',
                                image_caption: true,
                                setup: (editor) => {
                                    //tinymce.editor[0].dom.setStyle(tinymce.activeEditor.dom.select('p'), 'background-color', 'red');
                                    editor.ui.registry.addButton('custom', {
                                        icon: 'image',
                                        onAction: () => {
                                            editorRef.current.click();
                                        },
                                    })
                                }
                            }}
                        />
                    </div>
                </Spin>
                <div>
                    <input type="file" accept="image/*" onChange={onChange_Handler}
                        style={{ display: 'none' }} ref={editorRef} multiple></input>
                </div>
            </div>
        </>

    );
}

export default BoardInsert;