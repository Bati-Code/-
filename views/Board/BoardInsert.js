import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
    const [get_url, set_url] = useState('');
    const [get_change, set_change] = useState('');
    const [get_loading, set_loading] = useState(false);

    const history = useHistory();
    const alert = useAlert();

    const editorRef = useRef(null);

    const { fin_list } = useSelector(state => state.financeList);


    useEffect(() => {

    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        //console.log(get_BoardTitle);
        console.log("AA");
        tinymce.DOM.loadCSS('./css/BoardInsertCSS.css');

    }

    const temp = () => {
        tinymce.activeEditor.dom.remove(tinymce.activeEditor.dom.select('p'));
        //console.log(get_BoardTitle);
        console.log("BB");
    }

    const onChange_Handler = (e) => {

        var file = e.target.files[0];
        const bodyFormData = new FormData();
        const file_name = file.name;
        bodyFormData.append("imgs", file);
        bodyFormData.append("path", "community/board");
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // var image = new Image();
            // image.src = this.result;
            // image.addEventListener('load', function () {
            //     console.log(`height: ${this.height}, width: ${this.width}`);
            //     tinymce.execCommand('mceReplaceContent', false,
            //         `<img width=${this.width} height=${this.height} id="blank"></img>`);
            // tinymce.activeEditor.dom.add(tinymce.activeEditor.getBody(), 'img',
            //     { width: this.width, height: this.height, id: 'blank' });
            // });

            if (get_url.file_name == file_name) {
                tinymce.execCommand('mceInsertContent', false,
                    "<img src='" + get_url.url +
                    "' data-mce-src='" + get_url.url +
                    "' data-originalFileName='" + get_url.url +
                    "' style = '" + "max-width: 100%;" + "'>");
            }
            else {
                set_loading(true);
                axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/image_upload',
                    bodyFormData)
                    .then((response) => {
                        console.log(response.data);
                        if (response.data.code == 200) {
                            set_loading(false);
                            tinymce.execCommand('mceInsertContent', false,
                                "<img src='" + response.data.images[0].imgurl +
                                "' data-mce-src='" + response.data.images[0].imgurl +
                                "' data-originalFileName='" + response.data.images[0].imgurl +
                                "' style = '" + "max-width: 100%;" + "'>");

                            set_url({ "file_name": file_name, "url": response.data.images[0].imgurl });
                        }
                    })
                    .catch((error) => {
                        tinymce.execCommand('mceInsertContent', false,
                            error + "");
                    })
            }
        };

        // set_change(file);
        e.target.value = "";

    }


    // useEffect(() => {
    //     console.log("A");
    //     const bodyFormData = new FormData();
    //     const file = get_change;
    //     const file_name = file.file_name;
    //     bodyFormData.append("imgs", file);
    //     bodyFormData.append("path", "community/board");

    //     axios.post('http://103.57.61.87:8889/hitalk_msg_test/api/v1/image_upload',
    //         bodyFormData)
    //         .then((response) => {
    //             console.log(response.data);
    //             if (response.data.code == 200) {
    //                 tinymce.execCommand('mceReplaceContent', false,
    //                     "<img src='" + response.data.images[0].imgurl +
    //                     "' data-mce-src='" + response.data.images[0].imgurl +
    //                     "' data-originalFileName='" + response.data.images[0].imgurl +
    //                     "' max-width=100%>");

    //                 set_url({ "file_name": file_name, "url": response.data.images[0].imgurl });
    //                 //tinyMCE.execCommand('mceReplaceContent',false,`<b>aa</b>`);
    //             }
    //         })
    //         .catch((error) => {
    //             tinymce.execCommand('mceInsertContent', false,
    //                 error + "");
    //         })

    // }, [get_change])


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
                                },

                                plugins: [
                                    'advlist autoresize, autolink image lists charmap print preview hr anchor pagebreak',
                                    'searchreplace visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                                    'table emoticons template paste, link, imagetool'
                                ],
                                toolbar: 'insertfile undo redo | styleselect | bold italic ' +
                                    '| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' +
                                    '| custom preview media link | forecolor backcolor emoticons',
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
                </Spin>
                <div>
                    <input type="file" accept="image/*" onChange={onChange_Handler}
                        style={{ display: 'none' }} ref={editorRef}></input>
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