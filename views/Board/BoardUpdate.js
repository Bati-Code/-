import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './css/BoardInsertCSS.css';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Editor } from '@tinymce/tinymce-react';
import { server_config } from '../../server_config';


const BoardUpdate = (res) => {
    
    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_BoardContent, set_BoardContent] = useState('');
    const [get_finance_List_Value, set_finance_List_Value] = useState({});
    const [get_url, set_url] = useState('');
    const [get_loading, set_loading] = useState(false);
    
    const history = useHistory();
    const editorRef = useRef(null);
    
    const board_id = res.match.params.id;
    const { fin_list } = useSelector(state => state.financeList);

    useEffect(() => {
        axios.get(server_config.server_Address + '/board/view/' + board_id)
            .then((request) => {
                set_BoardData(request.data);
                set_BoardTitle(request.data.list.post_title);
                set_BoardContent(request.data.list.post_content);
                set_finance_List_Value(request.data.list.post_fin_list);


                //console.log(request.data.list);
            })
    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        //console.log(get_BoardTitle);
    }

    const BoardUpdate_Handler = () => {

        axios.post(server_config.server_Address + '/board/update',
            {
                board_title: get_BoardTitle,
                board_content: get_BoardContent,
                board_id: board_id,
                board_item: get_finance_List_Value
            },
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            }
        )
            .then((request) => {
                if (request.data.update_board_result === 0) {
                    //console.log("업데이트 실패");
                }
                else if (request.data.update_board_result === 1) {
                    //console.log("업데이트 성공");
                    history.push('/board/view/' + board_id);
                }

            })

    }

    const AutoComplete_Change_Handler = (event, newValue) => {
        set_BoardContent(newValue);
        set_finance_List_Value(newValue);
        //console.log(get_finance_List_Value, '|', newValue);
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

        e.target.value = "";

    }




    return (
        <>
            <div className='board_insert_wrap'>
                <div className='board_insert_finance_list'>
                    <Autocomplete
                        id="fin_list"
                        style={{ width: '100%' }}
                        value={get_finance_List_Value}
                        options={fin_list}
                        onChange={AutoComplete_Change_Handler}
                        getOptionLabel={(option) => option.name + "  |  " + option.code}
                        renderInput={(params) => (
                            <TextField {...params} label="종목" variant="outlined" margin="normal" />
                        )} />
                </div>
                <div id='title'>
                    <input name="tite" id="title_input"
                        type="text" placeholder="제목을 입력해주세요."
                        value={get_BoardTitle} onChange={BoardTitle_Handler}></input>
                </div>
                <Spin spinning={get_loading}>
                    <div id='editor'>
                        <Editor
                            onEditorChange={(newValue, editor) => set_BoardContent(newValue)}
                            value={get_BoardContent}
                            init={{
                                placeholder: '글 작성',
                                height: 500,
                                language: 'ko_KR',
                                menubar: false,
                                relative_urls: false,
                                remove_script_host: false,
                                convert_urls: true,
                                image_title: true,
                                automatic_uploads: true,
                                file_picker_types: 'image',

                                file_picker_callback: function (cb, value, meta) {
                                    editorRef.current.click();
                                },

                                plugins: [
                                    'advlist autolink link image lists charmap print preview hr anchor pagebreak',
                                    'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                                    'table emoticons template paste'
                                ],
                                toolbar: 'insertfile undo redo | styleselect | bold italic ' +
                                    '| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' +
                                    '| link  | custom preview media fullpage | forecolor backcolor emoticons',
                                menubar: 'insert',
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
                        <Button type="primary" onClick={BoardUpdate_Handler} icon={<FormOutlined />}>
                            글 수정
                        </Button>
                    </div>
                    <div>
                        <Button type="danger" onClick={() => { history.push('/board/view/' + board_id) }} icon={<CloseOutlined />}>
                            취소
                        </Button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default BoardUpdate;