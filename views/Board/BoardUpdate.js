import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/BoardInsertCSS.css';

const BoardUpdate = (res) => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_BoardContent, set_BoardContent] = useState('');
    const history = useHistory();

    const board_id = res.match.params.id;

    useEffect(() => {
        axios.get('http://localhost:5000/board/view/' + board_id)
            .then((request) => {
                set_BoardData(request.data);
                set_BoardTitle(request.data.post_title);
                set_BoardContent(request.data.post_content);
            })
    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        console.log(get_BoardTitle);
    }

    const BoardUpdate_Handler = () => {

        axios.post('http://localhost:5000/board/update',
            {
                board_title: get_BoardTitle,
                board_content: get_BoardContent,
                board_id: board_id
            }
        )
            .then((request) => {
                if (request.data.update_board_result === 0) {
                    console.log("업데이트 실패");
                }
                else if (request.data.update_board_result === 1) {
                    console.log("업데이트 성공");
                    history.push('/main');
                }

            })

    }

    return (
        <>
            <div id='title'>
                <input name="tite" id="title_input"
                    type="text" placeholder="제목을 입력해주세요."
                    value={get_BoardTitle} onChange={BoardTitle_Handler}></input>
            </div>
            <div>
                <CKEditor
                    editor={ClassicEditor}
                    config={{ placeholder: "글 작성" }}
                    data={get_BoardContent}
                    onReady={editor => {
                        console.log(editor)
                    }}
                    onChange={(event, editor) => {
                        set_BoardContent(editor.getData());
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
                <button onClick={BoardUpdate_Handler}>글 수정하기</button>
            </div>
        </>

    );
}

export default BoardUpdate;