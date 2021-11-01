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

const BoardInsert = () => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_finance_List, set_finance_List] = useState([{}]);
    const [get_finance_List_Value, set_finance_List_Value] = useState('');
    const [get_loading, set_loading] = useState(false);

    const history = useHistory();
    const alert = useAlert();

    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const { fin_list } = useSelector(state => state.financeList);


    useEffect(() => {
    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
    }

    const onChange_Handler = (e) => {

        const bodyFormData = new FormData();

        for (let i = 0; i < e.target.files.length; i++) {
            bodyFormData.append("imgs", e.target.files[i]);
            console.log(i);
        }
        bodyFormData.append("path", "community/board");

        set_loading(true);
        axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/image_upload',
            bodyFormData)
            .then((response) => {
                console.log(response.data);
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
                console.log(error);
                set_loading(false);
                alert.show("이미지 파일 업로드 실패");
            })

        e.target.value = "";

    }

    const BoardInsert_Handler = () => {

        if (get_BoardData && get_BoardTitle && get_finance_List_Value) {

            axios.post(server_config.server_Address + '/board/insert',
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
        }
        else {
            alert.show("정보를 모두 입력하시기 바랍니다.");
        }
    }


    const AutoComplete_Change_Handler = (event, newValue) => {
        set_finance_List_Value(newValue);
        //console.log(newValue);
    }

    return (
        <>
            <div className='board_insert_wrap'>
                <div className='board_insert_finance_list'>
                    <Autocomplete
                        id="highlights-demo"
                        disableListWrap
                        style={{ width: '100%' }}
                        options={fin_list}
                        onChange={AutoComplete_Change_Handler}
                        getOptionLabel={(option) => option.name + "  |  " + option.code}
                        renderInput={(params) => (
                            <TextField {...params} label="종목" variant="outlined" margin="normal" />
                        )} />
                </div>
                <div id='title'>
                    <input name="tite" id="title_input"
                        type="text" placeholder="제목을 입력해주세요." onChange={BoardTitle_Handler}></input>
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
                <div className='board_insert_button_wrap'>
                    <div>
                        <Button type="primary" onClick={BoardInsert_Handler} icon={<FormOutlined />}>
                            글 작성
                        </Button>
                    </div>
                    <div>
                        <Button type="danger" onClick={() => { history.push('/main') }} icon={<CloseOutlined />}>
                            취소
                        </Button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default BoardInsert;