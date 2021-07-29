import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Modal, Button, Input } from 'antd'
import { LikeOutlined, TableOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './css/Board_View_CSS.css'
import { useSelector } from 'react-redux';

const BoardView = (res) => {
    const [get_board_data, set_board_data] = useState({});
    const [get_Comment_List, set_Comment_List] = useState([]);
    const [get_board_recommend, set_board_recommend] = useState('');
    const [get_user_check, set_user_check] = useState(false);
    const [get_fin_List_name, set_fin_List_name] = useState('');


    const [get_comment_content, set_comment_content] = useState('');
    const [get_recomment_content, set_recomment_content] = useState('');


    const [get_recomment_open, set_recomment_open] = useState(false);
    const [get_comment_id, set_comment_id] = useState('');

    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const { TextArea } = Input;

    const history = useHistory();
    const board_id = res.match.params.id;

    useEffect(() => {
        // const meta = document.createElement('meta');
        // meta.name = "viewport";
        // meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        // document.getElementsByTagName('head')[0].appendChild(meta);

        axios.get("http://localhost:5000/board/view/" + board_id)
            .then((response) => {
                console.log("view data", response.data.post_comment);
                console.log(response.data.post_comment);
                set_board_data(response.data);
                set_Comment_List(response.data.post_comment);
                set_fin_List_name(response.data.post_fin_list.name);
            })

        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        document.getElementById('board_info_recommend').innerText = "추천 : " + get_board_recommend;
    }, [get_board_recommend])

    const recommend_Handler = () => {
        axios.get("http://localhost:5000/board/view/recommend/" + board_id)
            .then((request) => {
                console.log(request.data);
                set_board_recommend(request.data);
            })
    }

    useEffect(() => {
        axios.get("http://localhost:5000/user_check",
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                if (response.data.userName === get_board_data.post_author
                    && response.data.user_result === 1) {
                    console.log("board view success");
                    set_user_check(true);
                }
            })
    }, [get_board_data])

    const updateBoard = () => {
        history.push('/board/update/' + board_id);
    }

    const showModal = () => {
        setVisible(true);
    };

    const handle_DeleteBoard_Ok = () => {
        setConfirmLoading(true);
        axios.delete("http://localhost:5000/board/" + board_id,
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                console.log(response);
                if (response.data.delete_board_result === 0) {
                    console.log("삭제 오류");
                    history.push('/main');
                }
                if (response.data.delete_board_result === 1) {
                    console.log("삭제 성공");
                    history.push('/main');
                }
            })
    };

    const handle_DeleteBoard_Cancel = () => {
        setVisible(false);
    };

    const Comment_Change_Handler = (e) => {
        set_comment_content(e.target.value);
    }

    const ReComment_Change_Handler = (e) => {
        set_recomment_content(e.target.value);
    }

    const Comment_Insert_Handler = () => {

        axios.post('http://localhost:5000/board/comment',
            {
                board_id: board_id,
                comment_content: get_comment_content,
            },
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                console.log("comment_result", response.data);
                set_comment_content('');
            })

        axios.get("http://localhost:5000/board/view/" + board_id)
            .then((response) => {
                console.log(response.data.post_comment);
                set_Comment_List(response.data.post_comment);
            })
    }

    const ReComment_Handler = (id) => {
        set_recomment_open(!get_recomment_open);
        set_comment_id(id);
        console.log("e", id);
    }

    const ReComment_Insert_Handler = (comment_id) => {

        axios.post('http://localhost:5000/board/recomment',
            { 
                board_id : board_id,
                comment_id: comment_id,
                recomment_content: get_recomment_content,
            },
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                console.log(response.data); 
            })
    }

    return (
        <>
            <div className="board_view_wrap">
                <div className="board_view_Header">
                    주식토론 게시판
                </div>
                <div className="board_view_container">
                    <section className="board_content">
                        <nav>
                        </nav>
                        <main>
                            <div id="board_info_wrap">
                                <div> 
                                    <div id="board_info_title">
                                        [{get_fin_List_name}]{get_board_data.post_title}
                                    </div>
                                </div>
                                <ul id="board_info">
                                    <li id="board_info_data">
                                        {get_board_data.post_author}
                                    </li>
                                    <li>  |  </li>
                                    <li id="board_info_data">
                                        {get_board_data.post_date}
                                    </li>
                                    <li>  |  </li>
                                    <li id="board_info_data">
                                        조회 : {get_board_data.post_count}
                                    </li>
                                    <li>  |  </li>
                                    <li id="board_info_recommend">
                                        추천 : {get_board_data.post_recommend}
                                    </li>

                                </ul>
                            </div>
                            <div id="board_content">
                                <div dangerouslySetInnerHTML={{ __html: get_board_data.post_content }}></div>
                            </div>
                        </main>
                        <aside>
                        </aside>
                    </section>
                </div>
                <div className="BoardView_footer">
                    <div>
                        <Button type="primary" icon={<TableOutlined />}
                            onClick={() => history.push('/main')}>
                            목록
                        </Button>
                    </div>
                    <div>
                        <Button type="primary" icon={<LikeOutlined />} onClick={recommend_Handler}>
                            추천
                        </Button>
                    </div>
                    {get_user_check ?
                        <div>
                            <Button type="primary" icon={<EditOutlined />} onClick={updateBoard}>
                                수정
                            </Button>
                        </div>
                        : ''}
                    {get_user_check ?
                        <div>
                            <Button type="danger" icon={<DeleteOutlined />} onClick={showModal}>
                                삭제
                            </Button>
                        </div>
                        : ''}
                </div>
                <div>
                    <Modal
                        title="게시글 삭제"
                        visible={visible}
                        onOk={handle_DeleteBoard_Ok}
                        confirmLoading={confirmLoading}
                        onCancel={handle_DeleteBoard_Cancel}
                        okText="삭제"
                        cancelText="취소"
                    >
                        <p>정말 삭제하시겠습니까?</p>
                    </Modal>
                </div>
                <div className="board_comment_wrap">
                    <div>
                        <TextArea rows={4} onChange={Comment_Change_Handler} value={get_comment_content} />
                    </div>
                    <div>
                        <Button type="primary" icon={<PlusOutlined />} onClick={Comment_Insert_Handler}>
                            댓글 등록
                        </Button>
                    </div>
                    <div>
                        {get_Comment_List.map((list, index) => {

                            return (
                                <div className="comment_wrap" key={index}>
                                    <div className="comment_top">
                                        <div className="comment_author">
                                            {list.comment_author}
                                        </div>
                                        <div>
                                            {list.comment_date}
                                        </div>
                                    </div>
                                    <div className="comment_content">
                                        {list.comment_content}
                                    </div>
                                    <div>
                                        <div>
                                            <button onClick={() => ReComment_Handler(list._id)}>답글</button>
                                        </div>
                                        <div>
                                            <span>추천</span>
                                            <span>비추천</span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            get_comment_id === list._id ?
                                                <div>
                                                    <div>
                                                        <TextArea rows={3} value={get_recomment_content}
                                                            onChange={ReComment_Change_Handler} />
                                                    </div>
                                                    <div>
                                                        <Button type="primary" icon={<PlusOutlined />}
                                                            onClick={() => ReComment_Insert_Handler(list._id)}>
                                                            답글 등록
                                                        </Button>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </div>

                                </div>
                            )
                        }
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default BoardView;