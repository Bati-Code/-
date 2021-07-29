import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './css/BoardInsertCSS.css';

const BoardUpdate = (res) => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_BoardContent, set_BoardContent] = useState('');
    const [get_finance_List_Value, set_finance_List_Value] = useState({});

    const history = useHistory();

    const board_id = res.match.params.id;
    const { fin_list } = useSelector(state => state.financeList);

    useEffect(() => {
        axios.get('http://localhost:5000/board/view/' + board_id)
            .then((request) => {
                set_BoardData(request.data);
                set_BoardTitle(request.data.post_title);
                set_BoardContent(request.data.post_content);
                set_finance_List_Value(request.data.post_fin_list);
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
                board_id: board_id,
                board_item: get_finance_List_Value
            },
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
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

    const AutoComplete_Change_Handler = (event, newValue) => {
        set_finance_List_Value(newValue);
        console.log(newValue);
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
                <div className='board_insert_button_wrap'>
                    <div>
                        <Button type="primary" onClick={BoardUpdate_Handler} icon={<FormOutlined />}>
                            글 수정
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

export default BoardUpdate;