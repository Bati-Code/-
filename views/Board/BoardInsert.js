import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Skeleton } from '@material-ui/lab';

import { useAlert } from 'react-alert'

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/BoardInsertCSS.css';
import { useSelector } from 'react-redux';

import { Editor } from '@tinymce/tinymce-react';
import { server_config } from '../../server_config';

const BoardInsert = () => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_finance_List, set_finance_List] = useState([{}]);
    const [get_finance_List_Value, set_finance_List_Value] = useState('');

    const history = useHistory();
    const alert = useAlert();

    const editorRef = useRef(null);

    const log = () => {
        if (editorRef.current) {
            //console.log(editorRef.current.getContent());
        }
    };
    const { fin_list } = useSelector(state => state.financeList);

    let localstream;

    useEffect(() => {

    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        //console.log(get_BoardTitle);
    }

    const onChange_Handler = (e) => {
        console.log(e);

        var file = e.target.files[0];
        const bodyFormData = new FormData();
        
        bodyFormData.append("imgs", file);
        bodyFormData.append("path", "community/board");

        
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {

            axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/image_upload',
                bodyFormData)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.code == 200) {
                        tinymce.execCommand('mceInsertContent', false,
                            "<img src='" + response.data.images[0].imgurl +
                            "' data-mce-src='" + response.data.images[0].imgurl +
                            "' data-originalFileName='" + response.data.images[0].imgurl + 
                            "' width=100%>");
                    }
                })
                .catch((error) => {
                    tinymce.execCommand('mceInsertContent', false,
                        error + "");
                })

        };
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
                <div id='editor'>
                    <Editor
                        onEditorChange={(newValue, editor) => set_BoardData(newValue)}
                        init={{
                            placeholder: '글 작성',
                            min_height: 500,
                            max_height: 500,
                            max_width: '100%',
                            language: 'ko_KR',
                            menubar: false,
                            remove_script_host: false,
                            relative_urls: false,
                            convert_urls: true,
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: 'image',
                            branding: false,
                            imagetools_cors_hosts: ['103.57.61.87',
                                'hitalk-msg.s3.ap-northeast-2.amazonaws.com'],

                            file_picker_callback: function (cb, value, meta) {

                                editorRef.current.click();

                                //     input.click();

                                //     input.onchange = function () {
                                //         const file = this.files[0];
                                //         const bodyFormData = new FormData();

                                //         bodyFormData.append("imgs", file);

                                //         bodyFormData.append("path", "community/board");
                                //         var reader = new FileReader();
                                //         reader.readAsDataURL(file);

                                //         reader.onload = () => {
                                //             axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/image_upload',
                                //                 bodyFormData)
                                //                 .then((response) => {
                                //                     console.log(response.data);
                                //                     if (response.data.code == 200) {
                                //                         cb(response.data.images[0].imgurl, { title: file.name });
                                //                     }
                                //                 })
                                //         };

                                //     };
                                // },

                            },

                            plugins: [
                                'advlist autoresize, autolink image lists charmap print preview hr anchor pagebreak',
                                'searchreplace visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                                'table emoticons template paste'
                            ],
                            toolbar: 'insertfile undo redo | styleselect | bold italic ' +
                                '| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' +
                                '| custom preview media fullpage | forecolor backcolor emoticons',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            image_caption: true,
                            setup: (editor) => {

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
                <div>
                    <input type="file" accept="image/*" onChange={onChange_Handler} 
                    style={{display: 'none'}} ref={editorRef}></input>
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