import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAlert } from 'react-alert'

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/BoardInsertCSS.css';
import { useSelector } from 'react-redux';

// import Context from '@ckeditor/ckeditor5-core/src/context';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
//import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
// import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
// import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
// import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';



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
                        history.push('/main');
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
                    {/* <CKEditorContext context={Context}>
                        <h2>ㅇㅇ</h2>
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                placeholder: "글 작성",
                                language: 'ko',
                                plugins: [Paragraph, Bold, Italic, Essentials, Alignment,
                                    BlockQuote, UploadAdapter,
                                    Autoformat, AutoImage, ],
                                blockToolbar: ['bold', 'italic', '|', 'alignment', '|', 'blockQuote']
                            }}
                            data="dd"
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
                        />
                    </CKEditorContext> */}
                    <Editor
                        onEditorChange={(newValue, editor) => set_BoardData(newValue)}
                        apiKey="no-api-key"
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
                           
                            file_picker_callback: function (cb, value, meta) {
                                var input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                input.setAttribute('accept', 'image/*');
                               
                                input.onchange = function () {
                                    var file = this.files[0];

                                    var reader = new FileReader();
                                    reader.onload = function () {
                                     
                                        var id = 'blobid' + (new Date()).getTime();
                                        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                        var base64 = reader.result.split(',')[1];
                                        var blobInfo = blobCache.create(id, file, base64);
                                        blobCache.add(blobInfo);

                                        cb(blobInfo.blobUri(), { title: file.name });
                                    };
                                    reader.readAsDataURL(file);
                                };

                                input.click();
                            },

                            plugins: [
                                'advlist autoresize, autolink link image lists charmap print preview hr anchor pagebreak',
                                'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                                'table emoticons template paste imagetools'
                            ],
                            toolbar: 'insertfile undo redo | styleselect | bold italic ' +
                                '| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent' +
                                '| link image | print preview media fullpage | forecolor backcolor emoticons',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
                            image_caption: true,
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