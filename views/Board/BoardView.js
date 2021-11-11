import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Modal, Button, Input, Drawer } from 'antd'
import {
    LikeOutlined, TableOutlined, EditOutlined, DeleteOutlined,
    PlusOutlined, RightOutlined, AlertOutlined, LeftOutlined,
    CloseOutlined
} from '@ant-design/icons';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import ReactTooltip from 'react-tooltip';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useAlert } from 'react-alert'
import { server_config } from '../../server_config';
import { Base64 } from 'js-base64';
import { Board_Store_Reset } from '../../redux/action/board_list_action';

import Logo from '../../public/images/hitalk_logo.png';
import './css/Board_View_CSS.css';

const BoardView = (res) => {
    const [get_board_data, set_board_data] = useState({});
    const [get_Comment_List, set_Comment_List] = useState([]);
    const [get_board_recommend, set_board_recommend] = useState('');
    const [get_user_check, set_user_check] = useState(false);
    const [get_fin_List_name, set_fin_List_name] = useState('');
    const [get_recommend_check, set_recommend_check] = useState(false);
    const [get_userName, set_userName] = useState('');
    const [get_report_status, set_report_status] = useState(false);

    const [get_comment_content, set_comment_content] = useState('');
    const [get_recomment_content, set_recomment_content] = useState('');

    const [get_recomment_open, set_recomment_open] = useState(false);
    const [get_Comment_Drawer_Visible, set_Comment_Drawer_Visible] = useState(false);

    const [get_comment_id, set_comment_id] = useState('');
    const [get_recomment_for_comment_id, set_recomment_for_comment_id] = useState('');
    const [get_recomment_id, set_recomment_id] = useState('');

    const [get_Finance_Info, set_Finance_Info] = useState('');

    //모달
    const [visible, setVisible] = useState(false);
    const [comment_visible, set_comment_Visible] = useState(false);
    const [recomment_visible, set_recomment_Visible] = useState(false);
    const [get_report_modal_visible, set_report_modal_visible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [get_loading, set_loading] = useState(true);

    const [get_report_form_data, set_report_form_data] = useState({
        selected_value: '',
        content: ''
    });

    const { TextArea } = Input;

    const history = useHistory();
    const alert = useAlert();
    const board_id = res.match.params.id;
    const fin_name = window.sessionStorage.getItem('fin_name');

    const dispatch = useDispatch();
    const { radio } = useSelector(state => state.pageStore);

    useEffect(() => {

        Get_Finance_Data(fin_name);

        axios.get(server_config.server_Address + "/board/view/" + board_id)
            .then((response) => {
                //console.log("view data", response.data.userName);
                //console.log(response.data.list.post_recommend_user);
                set_board_data(response.data.list);
                set_Comment_List(response.data.list.post_comment);
                set_fin_List_name(response.data.list.post_fin_list.name);
                const recommend_user_list = response.data.list.post_recommend_user;

                const index = recommend_user_list.findIndex((list) => list.recommend_user === response.data.userName);
                //console.log("index", index);

                if (index !== -1) {
                    //console.log("이미 추천");
                    set_recommend_check(true);
                }
                else {
                    set_recommend_check(false);
                }

                if (response.data.list.post_author !== response.data.userName) {
                    axios.post(server_config.server_Address + '/report/search',
                        {
                            report_user: response.data.userName,
                            board_id: board_id
                        })
                        .then((response) => {
                            console.log(response.data);
                            if (response.data.report_search === 1)
                                set_report_status(true);
                            else
                                set_report_status(false);
                        })
                }

            })

        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        document.getElementById('board_info_recommend').innerText = get_board_recommend;
    }, [get_board_recommend])

    const recommend_Handler = () => {
        axios.get(server_config.server_Address + "/board/view/recommend/" + board_id)
            .then((request) => {
                //console.log(request.data);
                set_board_recommend(request.data.recommend_count);
                if (request.data.recommend_update === 1) {
                    set_recommend_check(true);
                }
                else if (request.data.recommend_update === 100) {
                    set_recommend_check(false);
                }
            })
    }

    useEffect(() => {
        axios.get(server_config.server_Address + "/user_check")
            .then((response) => {
                if (response.data.userName === get_board_data.post_author
                    && response.data.user_result === 1) {
                    //console.log("board view success");
                    set_user_check(true);
                }
                set_userName(response.data.userName);
            })
    }, [get_board_data])

    const updateBoard = () => {
        history.push('/board/update/' + board_id);
    }

    //게시글 모달
    const showModal = () => {
        setVisible(true);
    };

    const handle_DeleteBoard_Ok = () => {
        setConfirmLoading(true);
        axios.delete(server_config.server_Address + "/board/" + board_id,
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                //console.log(response);
                if (response.data.delete_board_result === 0) {
                    //console.log("삭제 오류");
                    history.push('/main');
                }
                if (response.data.delete_board_result === 1) {
                    //console.log("삭제 성공");
                    history.push('/main');
                }
            })

        dispatch(Board_Store_Reset());
    };

    const handle_DeleteBoard_Cancel = () => {
        setVisible(false);
    };

    //댓글 모달
    const showCommentModal = (comment_id) => {
        set_comment_Visible(true);
        set_comment_id(comment_id);
    };

    const handle_DeleteComment_Ok = () => {
        setConfirmLoading(true);
        axios.delete(server_config.server_Address + "/board/comment/" + get_comment_id)
            .then((response) => {
                //console.log(response.data);
                if (response.data.delete_comment_result === 0) {
                    //console.log("삭제 오류");
                    setConfirmLoading(false);
                }
                if (response.data.delete_comment_result === 1) {
                    //console.log("삭제 성공");
                    setConfirmLoading(false);
                    set_comment_Visible(false);

                    axios.get(server_config.server_Address + "/board/view/update/" + board_id)
                        .then((response) => {
                            //console.log(response.data.list.post_comment);
                            set_Comment_List(response.data.list.post_comment);
                        })
                }
            })
    };

    const handle_DeleteComment_Cancel = () => {
        set_comment_Visible(false);
    };

    //답글 모달
    const showReCommentModal = (comment_id, recomment_id) => {
        set_recomment_Visible(true);
        set_recomment_for_comment_id(comment_id);
        set_recomment_id(recomment_id);
    };

    const handle_Delete_ReComment_Ok = () => {
        setConfirmLoading(true);
        axios.delete(server_config.server_Address + "/board/recomment/" +
            get_board_data._id + '/' + get_recomment_for_comment_id + '/' + get_recomment_id)
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

                    axios.get(server_config.server_Address + "/board/view/update/" + board_id)
                        .then((response) => {
                            //console.log(response.data.list.post_comment);
                            set_Comment_List(response.data.list.post_comment);
                        })
                }
            })
    };

    const handle_Delete_ReComment_Cancel = () => {
        set_recomment_Visible(false);
    };

    const Comment_Change_Handler = (e) => {
        console.log(e.target.value);
        set_comment_content(e.target.value);
    }

    const ReComment_Change_Handler = (e) => {
        set_recomment_content(e.target.value);
    }

    //댓글
    const Comment_Insert_Handler = () => {

        axios.post(server_config.server_Address + '/board/comment',
            {
                board_id: board_id,
                comment_content: get_comment_content,
            },
            {
                headers: { 'authorization': sessionStorage.getItem('user_Token') }
            })
            .then((response) => {
                //console.log("comment_result", response.data);
                set_comment_content('');
                if (response.data.comment_check_result === 0) {
                    alert.show("댓글 등록에 실패하였습니다.");
                    return;
                }
                Comment_Drawer_Close_Handler();
                axios.get(server_config.server_Address + "/board/view/update/" + board_id)
                    .then((response) => {
                        set_Comment_List(response.data.list.post_comment);
                    })
                window.scrollTo(0, document.body.scrollHeight);
            })
    }

    const Comment_Drawer_Open_Handler = () => {
        set_Comment_Drawer_Visible(true);
    }
    const Comment_Drawer_Close_Handler = () => {
        set_Comment_Drawer_Visible(false);
    }


    //댓글 추천
    const comment_recommend_Handler = (comment_id) => {
        axios.post(server_config.server_Address + '/board/comment/recommend',
            {
                board_id: board_id,
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

    //답글
    const ReComment_Handler = (id) => {
        set_recomment_open(!get_recomment_open);
        set_comment_id(id);
        //console.log("e", id);
    }

    const ReComment_Insert_Handler = (comment_id) => {

        axios.post(server_config.server_Address + '/board/recomment',
            {
                board_id: board_id,
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

                axios.get(server_config.server_Address + "/board/view/update/" + board_id)
                    .then((response) => {
                        //console.log(response.data.list.post_comment);
                        set_Comment_List(response.data.list.post_comment);
                    })

            })


    }

    //답글 추천
    const ReComment_recommend_Handler = (comment_id, recomment_id) => {
        //console.log(comment_id, recomment_id);
        axios.post(server_config.server_Address + '/board/recomment/recommend',
            {
                board_id: board_id,
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

    const textArea_Change_Handler = (e) => {
        console.log(e.target.value);
        console.log(e.target.name);

        set_report_form_data({
            ...get_report_form_data,
            [e.target.name]: e.target.value
        });
    }

    const report_Confirm_Handler = () => {
        console.log(get_report_form_data);
        axios.post(server_config.server_Address + '/report/report',
            {
                report_form_data: get_report_form_data,
                report_user: get_userName,
                board_id: board_id,
                bad_user: get_board_data.post_author
            })
            .then((response) => {
                console.log(response.data);
                set_report_status(true);
            })
        set_report_modal_visible(false);
    }

    const DateDisplay = (list_date) => {
        let date;
        if (dayjs().format('YYYYMMDD') == dayjs(list_date).format('YYYYMMDD')) {
            date = dayjs(list_date).utc(9).format('HH:mm');
        } else {
            date = dayjs(list_date).utc(9).format('MM-DD HH:mm');
        }

        return (date)
    }

    //투표
    const Up_Count_Handler = () => {
        axios.post(server_config.server_Address + '/finance/up',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log(response.data);
                Get_Finance_Data();
            })
    }

    const Down_Count_Handler = () => {
        axios.post(server_config.server_Address + '/finance/down',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                //console.log(response.data);
                Get_Finance_Data();
            })
    }

    const Get_Finance_Data = () => {
        axios.post(server_config.server_Address + '/finance/info',
            {
                finance_name: fin_name,
            })
            .then((response) => {
                set_Finance_Info(response.data);

                const header = window.sessionStorage.getItem('user_Token');
                const array = header.split(".");
                const userName = JSON.parse(Base64.decode(array[1])).userName;

                const up_Count_User_Array = response.data.finance_Up_Count_User;
                const down_Count_User_Array = response.data.finance_Down_Count_User;

                const up_user_Index = up_Count_User_Array.findIndex((e) => e === userName);
                const down_user_Index = down_Count_User_Array.findIndex((e) => e === userName);

                //console.log(up_user_Index);

                if (up_user_Index !== -1) {
                    document.getElementById('up_count').style.border = "5px double #b95312";
                }
                else {
                    document.getElementById('up_count').style.border = "4px solid #b95312";
                }

                if (down_user_Index !== -1) {
                    document.getElementById('down_count').style.border = "5px double #303b55";
                }
                else {
                    document.getElementById('down_count').style.border = "5px solid #303b55";
                }

            })
    }

    return (
        <>
            <div className="board_view_wrap">
                <div className="board_view_Header" onClick={() => history.push('/main')}>
                    <img src={Logo} />
                </div>
                <div className="board_view_container">
                    <section className="board_content">
                        <nav>
                        </nav>

                        <main>
                            <div id="board_info_wrap">
                                <div className="back_button" onClick={() => { history.push('/main'); }}>
                                    <LeftOutlined />
                                </div>
                                <div>
                                    <div id="board_info_title">
                                        {get_board_data.post_title}
                                    </div>
                                </div>
                                <div className="board_info_line flex">
                                    <ul id="board_info">
                                        <li id="board_info_data">
                                            {get_board_data.post_author}
                                        </li>
                                        <li>  · </li>
                                        <li id="board_info_data">
                                            {DateDisplay(get_board_data.post_date)}
                                        </li>
                                        <li>  ·  </li>
                                        <li id="board_info_data">
                                            조회수 {get_board_data.post_count}
                                        </li>
                                        {/* <li id="board_info_recommend">
                                        추천 : {get_board_data.post_recommend}
                                    </li> */}
                                    </ul>
                                    {
                                        get_board_data?.post_comment?.length != 0 &&
                                        <div className="tooltip">
                                            {get_board_data?.post_comment?.length}
                                        </div>
                                    }
                                </div>
                                <div className="vote_title">
                                    종목명 : {get_fin_List_name}({get_board_data?.post_fin_list?.code})
                                </div>

                                <div className="voteWrap">
                                    <div className="label">
                                        <br />
                                    </div>
                                    <ReactTooltip
                                        className="up_tooltip"
                                        id="up_tooltip"
                                        getContent={dataTip => dataTip + " : " + get_Finance_Info.finance_Up_Count} />
                                    <ReactTooltip
                                        className="down_tooltip"
                                        id="down_tooltip"
                                        getContent={dataTip => dataTip + " : " + get_Finance_Info.finance_Down_Count} />
                                    <div className="up_count" id='up_count'
                                        onClick={Up_Count_Handler}
                                        data-for="up_tooltip"
                                        data-tip="상승"
                                        style={{
                                            width: `${get_Finance_Info.finance_Up_Count
                                                / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 80}%`
                                        }}>
                                        {Math.round(get_Finance_Info.finance_Up_Count
                                            / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 100)}%

                                    </div>
                                    <div className="down_count" id='down_count'
                                        data-for="down_tooltip"
                                        data-tip="하강"
                                        onClick={Down_Count_Handler}
                                        style={{
                                            width: `${get_Finance_Info.finance_Down_Count
                                                / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 80}%`
                                        }}>
                                        {100 - Math.round(get_Finance_Info.finance_Up_Count
                                            / (get_Finance_Info.finance_Up_Count + get_Finance_Info.finance_Down_Count) * 100)}%

                                    </div>
                                    <div className="label">
                                        <br />
                                    </div>
                                </div>

                            </div>
                            <div id="board_content">
                                <div dangerouslySetInnerHTML={{ __html: get_board_data.post_content }}></div>
                            </div>
                            <div className="board_function flex width100">
                                <div className="flex">
                                    <span className="like_function" onClick={recommend_Handler}>
                                        {get_recommend_check
                                            ? <FavoriteIcon />
                                            : <FavoriteBorderIcon />}
                                    </span>
                                    <span className="like_text" id="board_info_recommend">{get_board_data.post_recommend}</span>
                                </div>
                                <div className="del_rep_button flex">
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
                                    {get_user_check ?
                                        ''
                                        :
                                        <div>
                                            <Button type="danger" icon={<AlertOutlined />}
                                                onClick={() => {
                                                    get_report_status
                                                        ? set_report_modal_visible(false)
                                                        : set_report_modal_visible(true)
                                                }}
                                            >
                                                {get_report_status ? '신고 완료' : '신고'}
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </main>
                        <aside>
                        </aside>
                    </section>
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
                    <Modal
                        title="답글 삭제"
                        visible={recomment_visible}
                        onOk={handle_Delete_ReComment_Ok}
                        confirmLoading={confirmLoading}
                        onCancel={handle_Delete_ReComment_Cancel}
                        okText="삭제"
                        cancelText="취소"
                    >
                        <p>정말 삭제하시겠습니까?</p>
                    </Modal>
                    <Modal
                        title="게시글 신고"
                        visible={get_report_modal_visible}
                        onCancel={() => { set_report_modal_visible(false) }}
                        okText="신고"
                        onOk={report_Confirm_Handler}
                        cancelText="취소"
                    >
                        <div id="report_wrap">
                            <div id="report_div">
                                <span id="label">제목 : </span>
                                <span>{get_board_data.post_title}</span>
                            </div>
                            <div id="report_div">
                                <span id="label">작성자 : </span>
                                <span>{get_userName}</span>
                            </div>
                            <div id="report_div">
                                <span id="label">신고사항 : </span>
                                <span id="item">
                                    <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
                                        <InputLabel id="select_label">신고 사항</InputLabel>
                                        <Select
                                            labelId="select_label"
                                            name='selected_value'
                                            id='report'
                                            value={get_report_form_data.selected_value}
                                            label='신고 사항'
                                            onChange={textArea_Change_Handler}>
                                            <MenuItem value={'AA'}>AA</MenuItem>
                                            <MenuItem value={'BB'}>BB</MenuItem>
                                        </Select>
                                    </FormControl>
                                </span>
                            </div>
                        </div>
                        <div>
                            <textarea id="content" name="content"
                                value={get_report_form_data.content} onChange={textArea_Change_Handler} />
                        </div>

                    </Modal>

                </div>
                <div className="board_comment_wrap">
                    {/* textarea 댓글 */}
                    {/* <div>
                        <TextArea rows={4} onChange={Comment_Change_Handler} value={get_comment_content} />
                    </div> */}
                    <div className="board_comment_button">
                        <Button type="primary" icon={<PlusOutlined />} onClick={Comment_Drawer_Open_Handler}>
                            댓글 등록
                        </Button>
                    </div>
                    <Drawer
                        placement='bottom'
                        closable={false}
                        onClose={Comment_Drawer_Close_Handler}
                        visible={get_Comment_Drawer_Visible}
                        key='comment'
                        height="29%"
                    >
                        <div className="comment_form_title flex">
                            <div>
                                댓글쓰기
                            </div>
                            <div onClick={Comment_Drawer_Close_Handler}><CloseOutlined /></div>
                        </div>
                        <div>
                            <TextArea rows={4} onChange={Comment_Change_Handler} value={get_comment_content}
                                autoSize={{ minRows: 4, maxRows: 4 }} />
                        </div>
                        <div className="comment_form_submit_button" onClick={Comment_Insert_Handler}>
                            등록
                        </div>
                    </Drawer>
                    <div>
                        <span className="comment_color">{get_board_data?.post_comment?.length}</span>
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
                                                    : null}
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
                                                                        : null}
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

                </div>
            </div>
        </>
    )
}

export default BoardView;