import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/BoardInsertCSS.css';

const BoardInsert = () => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const history = useHistory();


    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        console.log(get_BoardTitle);
    }

    const BoardInsert_Handler = () => {

        axios.post('http://localhost:5000/board/insert',
            {
                board_title: get_BoardTitle,
                board_Data: get_BoardData
            }
        )
            .then((request) => {
                if (request.data.board_insert === 0) {
                    console.log("업로드 실패");
                }
                else if(request.data.board_insert === 1){
                    console.log("업로드 성공");
                    history.push('/main');
                }

            })

    }

    return (
        <>
            <div id='title'>
                <input name="tite" id="title_input"
                    type="text" placeholder="제목을 입력해주세요." onChange={BoardTitle_Handler}></input>
            </div>
            <div>
                <CKEditor
                    editor={ClassicEditor}
                    config={{ placeholder: "글 작성" }}
                    onReady={editor => {
                        console.log(editor)
                    }}
                    onChange={(event, editor) => {
                        set_BoardData(editor.getData());
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {

                        console.log('Focus.', editor);
                    }}
                />
            </div>
            <div>
                <button onClick={BoardInsert_Handler}>글쓰기</button>
            </div>
        </>

    );
}

export default BoardInsert;