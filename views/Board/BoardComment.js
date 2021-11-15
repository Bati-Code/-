import { CloseOutlined, PlusOutlined, AlertOutlined, LikeOutlined, RightOutlined, DeleteOutlined  } from '@ant-design/icons';
import { Button, Input, Drawer } from 'antd'
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { board_Store } from '../../redux/action/board_list_action';
import { server_config } from '../../server_config';

const BoardComment = (props) => {

    const [get_recomment_open, set_recomment_open] = useState(false);
    const [get_comment_id, set_comment_id] = useState('');

    const [get_recomment_content, set_recomment_content] = useState('');

    const [comment_visible, set_comment_Visible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { TextArea } = Input;

    const get_Comment_List = props.get_data;
    const get_userName = props.user_name;

    const dispatch = useDispatch();
    const { board_list } = useSelector(state => state.boardStore);

    const showCommentModal = (comment_id) => {
        set_comment_Visible(true);
        set_comment_id(comment_id);
    };

    const handle_DeleteComment_Ok = () => {
        setConfirmLoading(true);
        console.log("ID : ", props.board_id);
        axios.delete(server_config.server_Address + "/board/comment/" + get_comment_id)
            .then((response) => {
                //console.log(response.data);
                if (response.data.delete_comment_result === 0) {
                    console.log("삭제 오류");
                    setConfirmLoading(false);
                }
                if (response.data.delete_comment_result === 1) {
                    console.log("삭제 성공");
                    setConfirmLoading(false);
                    set_comment_Visible(false);

                    axios.get(server_config.server_Address + "/board/view/update/" + props.board_id)
                        .then((response) => {
                            //console.log(response.data.list.post_comment);
                            props.set_data(response.data.list.post_comment);
                            const board = board_list[board_list.findIndex((e) => e._id == props.board_id)];
                            console.log("BOard", board);
                            board.post_comment.pop();
                            dispatch(board_Store(board_list));
                        })
                }
            })
    };

    const handle_DeleteComment_Cancel = () => {
        set_comment_Visible(false);
    };


    const ReComment_Handler = (id) => {
        set_recomment_open(!get_recomment_open);
        set_comment_id(id);
        //console.log("e", id);
    }

    const ReComment_Change_Handler = (e) => {
        set_recomment_content(e.target.value);
    }

    const ReComment_Insert_Handler = (comment_id) => {

        axios.post(server_config.server_Address + '/board/recomment',
            {
                board_id: props.board_id,
                comment_id: comment_id,
                recomment_content: get_recomment_content,
            },
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                //console.log(response.data);
                set_recomment_content('');
                set_recomment_open(false);
                if (response.data.recomment_check_result === 0) {
                    alert.show("답글 등록에 실패하였습니다.");
                }

                axios.get(server_config.server_Address + "/board/view/update/" + props.board_id)
                    .then((response) => {
                        //console.log(response.data.list.post_comment);
                        props.set_data(response.data.list.post_comment);
                    })

            })


    }

    return (
        <div className="board_comment_wrap">
            {/* textarea 댓글 */}
            {/* <div>
                        <TextArea rows={4} onChange={Comment_Change_Handler} value={get_comment_content} />
                    </div> */}
            <div>
                <span className="comment_color">{get_Comment_List?.length}</span>
                <span>개의 댓글</span>

            </div>
            <div>
                {get_Comment_List.map((list, index) => {

                    let comment_user_check = false;

                    if (list.comment_author === get_userName) {
                        comment_user_check = true;
                    }
                    else {
                        comment_user_check = false;
                    }
                    return (
                        <div className="comment_wrap" key={index}>
                            <div className="comment_top">
                                <div className="comment_author">
                                    <span className="darkGray">{list.comment_author} </span>
                                    <span className="lightGray">
                                        {dayjs(list.comment_date).format('MM-DD HH:mm')}
                                    </span>

                                </div>
                                <div>
                                    <span id='delete_button'>
                                        {comment_user_check
                                            ? <span><DeleteOutlined onClick={() => showCommentModal(list._id)} /></span>
                                            : <span><AlertOutlined onClick={() => report_Comment_Modal_Handler(list)} /></span>}
                                    </span>

                                </div>
                            </div>
                            <div className="comment_content">
                                {list.comment_content}
                            </div>
                            <div className="comment_function_wrap">
                                <div>
                                    <Button type="primary" onClick={() => ReComment_Handler(list._id)}>
                                        답글
                                    </Button>
                                </div>
                                <div className='comment_function_list'>
                                    <Button
                                        id={list._id + "button"}
                                        onClick={() => comment_recommend_Handler(list._id)}
                                        style={list.comment_recommend_user.findIndex((e) =>
                                            e.comment_recommend_user === get_userName) !== -1
                                            ? {
                                                backgroundColor: '#439926',
                                                padding: '0 15px',
                                                color: 'white',
                                                BorderColor: '#439926'
                                            }
                                            : {
                                                backgroundColor: 'white',
                                                padding: '0 15px',
                                                color: 'black',
                                                BorderColor: '#b3b3b3'
                                            }}>
                                        <LikeOutlined />
                                        <span id={list._id}>
                                            {list.comment_recommend}
                                        </span>
                                    </Button>
                                </div>

                            </div>
                            <div>
                                {
                                    get_recomment_open ?
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
                                        : null
                                }
                            </div>
                            <div>
                                {list.comment_recomment.map((recomment, index) => {

                                    let recomment_user_check = false;

                                    if (recomment.recomment_author === get_userName) {
                                        recomment_user_check = true;
                                    }
                                    else {
                                        recomment_user_check = false;
                                    }

                                    return (
                                        <div key={index}>
                                            <div className='recomment_wrap'>
                                                <div className='recomment_top'>
                                                    <div className="recomment_author">
                                                        <RightOutlined />
                                                        {recomment.recomment_author}
                                                    </div>
                                                    <div>
                                                        {recomment.recomment_date}
                                                        <span>
                                                            {recomment_user_check
                                                                ? <span id='delete_button'>
                                                                    <DeleteOutlined onClick={
                                                                        () => showReCommentModal(list._id, recomment._id)} />
                                                                </span>
                                                                : <span id='delete_button'>
                                                                    <AlertOutlined onClick={
                                                                        () => report_Comment_Modal_Handler(recomment)} />
                                                                </span>}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='recomment_info'>
                                                    {recomment.recomment_content}
                                                </div>
                                                <div className='recomment_function'>

                                                    <Button
                                                        id={recomment._id + "button"}
                                                        onClick={() => ReComment_recommend_Handler(list._id, recomment._id)}
                                                        style={recomment.recomment_recommend_user.findIndex((e) =>
                                                            e.recomment_recommend_user === get_userName) !== -1
                                                            ? {
                                                                backgroundColor: '#439926',
                                                                padding: '0 15px',
                                                                color: 'white',
                                                                BorderColor: '#439926'
                                                            }
                                                            : {
                                                                backgroundColor: 'white',
                                                                padding: '0 15px',
                                                                color: 'black',
                                                                BorderColor: '#b3b3b3'
                                                            }}>
                                                        <LikeOutlined />
                                                        <span id={recomment._id}>
                                                            {recomment.recomment_recommend}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    )
                }
                )}
            </div>
            <div>
                <Modal
                    title="댓글 삭제"
                    visible={comment_visible}
                    onOk={handle_DeleteComment_Ok}
                    confirmLoading={confirmLoading}
                    onCancel={handle_DeleteComment_Cancel}
                    okText="삭제"
                    cancelText="취소"
                >
                    <p>정말 삭제하시겠습니까?</p>
                </Modal>
            </div>

        </div>
    )
}

export default BoardComment;