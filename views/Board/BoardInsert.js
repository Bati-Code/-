import { FormOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './css/BoardInsertCSS.css';

const BoardInsert = () => {

    const [get_BoardData, set_BoardData] = useState('');
    const [get_BoardTitle, set_BoardTitle] = useState('');
    const [get_finance_List, set_finance_List] = useState([{}]);
    const [get_finance_List_Value, set_finance_List_Value] = useState('');
    const history = useHistory();

    useEffect(() => {
        axios.get('http://hitalk-investment.hitalkplus.com:4050/StockCode?ETF=1')
            .then((response) => {

                response.data.datalist.map((list, index) => {
                    delete list.reason;
                    delete list.dtfchk;
                    delete list.reason_no;
                    delete list.type;
                    delete list.etfchk;
                    delete list.use_yn;
                })

                set_finance_List(response.data.datalist);
            })
    }, [])

    const BoardTitle_Handler = (e) => {
        set_BoardTitle(e.target.value);
        console.log(get_BoardTitle);
    }

    const BoardInsert_Handler = () => {

        axios.post('http://localhost:5000/board/insert',
            {
                board_title: get_BoardTitle,
                board_Data: get_BoardData,
                board_item: get_finance_List_Value
            }
        )
            .then((request) => {
                if (request.data.board_insert === 0) {
                    console.log("업로드 실패");
                }
                else if (request.data.board_insert === 1) {
                    console.log("업로드 성공");
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
                        id="highlights-demo"
                        style={{ width: '100%' }}
                        options={get_finance_List}
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
                <div className='board_insert_button_wrap'>
                    <div>
                        <Button type="primary" onClick={BoardInsert_Handler} icon={<FormOutlined />}>
                            글 작성
                        </Button>
                    </div>
                    <div>
                        <Button type="danger" icon={<CloseOutlined />}>
                            취소
                        </Button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default BoardInsert;