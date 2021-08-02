import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAlert } from 'react-alert'

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/BoardInsertCSS.css';
import { useSelector } from 'react-redux';

import '@ckeditor/ckeditor5-build-classic/build/translations/ko';



import { Editor } from '@tinymce/tinymce-react';


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
            console.log(editorRef.current.getContent());
        }
    };



    const { fin_list } = useSelector(state => state.financeList);

    useEffect(() => {

    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        console.log(get_BoardTitle);
    }

    const BoardInsert_Handler = () => {

        if (get_BoardData && get_BoardTitle && get_finance_List_Value) {

            axios.post('http://localhost:5000/board/insert',
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
                        console.log("업로드 실패");
                    }
                    else if (request.data.board_insert === 100) {
                        console.log("세션 체크 실패");
                        history.push('/login');
                    }
                    else if (request.data.board_insert === 1) {
                        console.log("업로드 성공");
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
        console.log(newValue);
    }

    console.log(get_BoardData);

    return (
        <>
            <div className='board_insert_wrap'>
                <div className='board_insert_finance_list'>
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
                <div id='title'>
                    <input name="tite" id="title_input"
                        type="text" placeholder="제목을 입력해주세요." onChange={BoardTitle_Handler}></input>
                </div>
                <div id='editor'>
                    {/* <CKEditor
                        editor={ClassicEditor}
                        config={{
                            placeholder: "글 작성",
                            language: 'ko',
                        }}
                        onReady={editor => {
                            console.log(editor)
                        }}
                        onChange={(event, editor) => {
                            console.log(editor.getData());
                            set_BoardData(editor.getData());
                        }}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {

                            console.log('Focus.', editor);
                        }}
                    /> */}
                    <Editor
                        onEditorChange={(newValue, editor) => set_BoardData(newValue)}
                        init={{
                            selector: 'textarea#basic-example',
                            placeholder: '글 작성',
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen media',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor media | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help | custom',
                            menubar: 'insert',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            setup: (editor) => {
                                editor.ui.registry.addButton('custom', {
                                    text: 'custom',
                                    onAction: () => {
                                        console.log(editor);
                                    }
                                })
                            }
                        }}
                    />

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