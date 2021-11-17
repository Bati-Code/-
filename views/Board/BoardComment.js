import { CloseOutlined, PlusOutlined, AlertOutlined, LikeOutlined, RightOutlined, DeleteOutlined, AlertFilled } from '@ant-design/icons';
import { Button, Input, Drawer } from 'antd'
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { board_Store } from '../../redux/action/board_list_action';
import { server_config } from '../../server_config';
import Board_Report from './Report/Board_Report';

const BoardComment = (props) => {

    const [get_recomment_open, set_recomment_open] = useState(false);
    const [get_comment_id, set_comment_id] = useState('');
    const [get_recomment_for_comment_id, set_recomment_for_comment_id] = useState('');
    const [get_recomment_id, set_recomment_id] = useState('');

    const [get_report_status, set_report_status] = useState([]);

    const [get_recomment_content, set_recomment_content] = useState('');

    const [comment_visible, set_comment_Visible] = useState(false);
    const [recomment_visible, set_recomment_Visible] = useState(false);
    const [get_comment_report_modal_visible, set_comment_report_modal_visible] = useState(false);
    const [get_recomment_report_modal_visible, set_recomment_report_modal_visible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [get_comment_data, set_comment_data] = useState({});

    const { TextArea } = Input;

    const get_userName = props.user_name;

    const dispatch = useDispatch();
    const { board_list } = useSelector(state => state.boardStore);


    useEffect(() => {

        // let array = [];

        // if (props.get_data.length != 0) {
        //     for (let i = 0; i < props.get_data.length; i++) {
        //         array.push(props.get_data[i]._id);
        //     }

        //     axios.post(server_config.server_Address + "/report/searchArray",
        //         {
        //             data: array
        //         })
        //         .then((response) => {
        //             console.log(response.data);
        //             props.get_data.map((list, index) => {
        //                 list.report_data = response.data.data[index];
        //             })
        //         })
        // }

        // axios.get(server_config.server_Address + "/user_check")
        //     .then((response) => {


        //     })

        axios.post(server_config.server_Address + "/report/status",
            {
                board_id: props.board_id,
            })
            .then((response) => {

                console.log("DATA : ", response.data);
                //set_report_status(response.data);

                if (props.get_data.length != 0) {
                    props.get_data.map((list, index) => {
                        list.report_status = response.data.data[index];
                    })
                    set_report_status(props.get_data);
                }
            })

        console.log("EEFFF");

    }, [props.get_data])

    console.log("A A A  : ", props.get_data);


    useEffect(() => {
        axios.post(server_config.server_Address + "/report/status",
            {
                board_id: props.board_id,
            })
            .then((response) => {
                console.log("DATA : ", response.data);
                //set_report_status(response.data);
                props.get_data.map((list, index) => {
                    list.report_status = response.data.data[index];
                })
            })

    }, [get_comment_report_modal_visible, get_recomment_report_modal_visible])

    const showCommentModal = (comment_id) => {
        set_comment_Visible(true);
        set_comment_id(comment_id);
    };

    const showReCommentModal = (comment_id, recomment_id) => {
        set_recomment_Visible(true);
        set_recomment_for_comment_id(comment_id);
        set_recomment_id(recomment_id);
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
                            board?.post_comment.pop();
                            dispatch(board_Store(board_list));
                        })
                }
            })
    };

    const handle_DeleteComment_Cancel = () => {
        set_comment_Visible(false);
    };

    const comment_recommend_Handler = (comment_id) => {
        axios.post(server_config.server_Address + '/board/comment/recommend',
            {
                board_id: props.board_id,
                comment_id: comment_id
            })
            .then((response) => {
                //console.log(response.data);
                document.getElementById(comment_id).innerText = response.data.recommend_count;

                if (response.data.comment_recommend_result === 1) {
                    document.getElementById(comment_id + 'button').style.backgroundColor = '#439926';
                    document.getElementById(comment_id + 'button').style.borderColor = '#439926';
                    document.getElementById(comment_id + 'button').style.color = 'white';
                } else {
                    document.getElementById(comment_id + 'button').style.backgroundColor = 'white';
                    document.getElementById(comment_id + 'button').style.borderColor = '#b3b3b3';
                    document.getElementById(comment_id + 'button').style.color = 'black';
                }
            })
    }

    const report_Comment_Modal_Handler = (list) => {
        if (list.comment_content) {
            set_comment_report_modal_visible(true);
            console.log(list);
        }
        else {
            set_recomment_report_modal_visible(true);
        }

        set_comment_data(list);
    }


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

    const ReComment_recommend_Handler = (comment_id, recomment_id) => {
        //console.log(comment_id, recomment_id);
        axios.post(server_config.server_Address + '/board/recomment/recommend',
            {
                board_id: props.board_id,
                comment_id: comment_id,
                recomment_id: recomment_id,
            })
            .then((response) => {
                //console.log(response.data);
                document.getElementById(recomment_id).innerText = response.data.recommend_count;


                if (response.data.recomment_recommend_result === 1) {
                    document.getElementById(recomment_id + 'button').style.backgroundColor = '#439926';
                    document.getElementById(recomment_id + 'button').style.borderColor = '#439926';
                    document.getElementById(recomment_id + 'button').style.color = 'white';
                } else {
                    document.getElementById(recomment_id + 'button').style.backgroundColor = 'white';
                    document.getElementById(recomment_id + 'button').style.borderColor = '#b3b3b3';
                    document.getElementById(recomment_id + 'button').style.color = 'black';
                }
            })
    }

    const handle_Delete_ReComment_Ok = () => {
        setConfirmLoading(true);
        axios.delete(server_config.server_Address + "/board/recomment/" +
            props.board_id + '/' + get_recomment_for_comment_id + '/' + get_recomment_id)
            .then((response) => {
                //console.log(response.data);
                if (response.data.delete_recomment_result === 0) {
                    //console.log("삭제 오류");
                    setConfirmLoading(false);
                }
                if (response.data.delete_recomment_result === 1) {
                    //console.log("삭제 성공");
                    setConfirmLoading(false);
                    set_recomment_Visible(false);

                    axios.get(server_config.server_Address + "/board/view/update/" + props.board_id)
                        .then((response) => {
                            //console.log(response.data.list.post_comment);
                            props.set_data(response.data.list.post_comment);
                        })
                }
            })
    };

    const handle_Delete_ReComment_Cancel = () => {
        set_recomment_Visible(false);
    };



    const MakeModal = (props) => {

        return (
            <div>
                <Modal
                    title={props.title}
                    visible={props.visible}
                    onOk={props.onOk}
                    confirmLoading={confirmLoading}
                    onCancel={props.cancel}
                    okText="삭제"
                    cancelText="취소"
                >
                    <p>정말 삭제하시겠습니까?</p>
                </Modal>
            </div>
        )
    }

    return (
        <div className="board_comment_wrap">
            {/* textarea 댓글 */}
            {/* <div>
                        <TextArea rows={4} onChange={Comment_Change_Handler} value={get_comment_content} />
                    </div> */}
            <div>
                <span className="comment_color">{props.get_data?.length}</span>
                <span>개의 댓글</span>

            </div>
            <div>
                {get_report_status.map((list, index1) => {

                    console.log("LIST : ", list);

                    let comment_user_check = false;

                    if (list.comment_author === get_userName) {
                        comment_user_check = true;
                    }
                    else {
                        comment_user_check = false;
                    }
                    return (
                        <div className="comment_wrap" key={index1}>
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
                                            : list?.report_status?._id.comment_object.length == 0 ?
                                                <span><AlertOutlined onClick={() => report_Comment_Modal_Handler(list)} /></span>
                                                : <AlertFilled />}
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
                                {list.comment_recomment.map((recomment, index2) => {

                                    console.log("Re : ", recomment, list);
                                    let recomment_user_check = false;

                                    if (recomment.recomment_author === get_userName) {
                                        recomment_user_check = true;
                                    }
                                    else {
                                        recomment_user_check = false;
                                    }

                                    return (
                                        <div key={index2}>
                                            <div className='recomment_wrap'>
                                                <div className='recomment_top'>
                                                    <div className="recomment_author">
                                                        <RightOutlined />
                                                        {recomment.recomment_author}
                                                    </div>
                                                    <div>
                                                        {recomment.recomment_date}
                                                        <span>
                                                            {/* {props.get_data.report_data._id.comment_object.length} */}
                                                            {recomment_user_check
                                                                ? <span id='delete_button'>
                                                                    <DeleteOutlined onClick={
                                                                        () => showReCommentModal(list._id, recomment._id)} />
                                                                </span>
                                                                : list.report_status.recomment_object[index2].data.length == 0 ?
                                                                    <span id='delete_button'>
                                                                        <AlertOutlined onClick={
                                                                            () => report_Comment_Modal_Handler(recomment)} />
                                                                    </span> : <span id='delete_button'><AlertFilled /></span>}
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
                )
                }
            </div>
            <div>
                <MakeModal
                    title="댓글 삭제"
                    visible={comment_visible}
                    onOk={handle_DeleteComment_Ok}
                    cancel={handle_DeleteComment_Cancel}
                />
                <MakeModal
                    title="답글 삭제"
                    visible={recomment_visible}
                    onOk={handle_Delete_ReComment_Ok}
                    cancel={handle_Delete_ReComment_Cancel}
                />
                <Board_Report
                    flag='comment'
                    get_visible={get_comment_report_modal_visible}
                    set_visible={set_comment_report_modal_visible}
                    data={get_comment_data}
                    get_status={props.get_data}
                    set_status={props.set_data}
                    board_id={props.board_id} />
                <Board_Report
                    flag='recomment'
                    get_visible={get_recomment_report_modal_visible}
                    set_visible={set_recomment_report_modal_visible}
                    data={get_comment_data}
                    get_status={props.get_data}
                    set_status={props.set_data}
                    board_id={props.board_id} />
            </div>

        </div>
    )
}

export default BoardComment;