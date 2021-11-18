
const BOARD_STORE = 'boardStore/BOARD_STORE';
const BOARD_SCROLL = 'boardStore/BOARD_SCROLL';
const BOARD_INFINITY_PAGE = 'boardStore/BOARD_INFINITY_PAGE';
const BOARD_STORE_RESET = 'boardStore/BOARD_STORE_RESET';
const BOARD_STORE_INIT = 'boardStore/BOARD_STORE_INIT';
const BOARD_STORE_USER = 'boardStore/BOARD_STORE_USER';

export const board_Store = (get_board) => ({ type: BOARD_STORE, payload: get_board });
export const Board_Scroll = (scroll_value) => ({ type: BOARD_SCROLL, payload: scroll_value });
export const Board_Infinity_Page = (page_value) => ({ type: BOARD_INFINITY_PAGE, payload: page_value });
export const Board_Store_Reset = () => ({ type: BOARD_STORE_RESET });
export const Board_Store_Init = () => ({ type: BOARD_STORE_INIT });
export const Board_Store_User = (user_value) => ({ type: BOARD_STORE_USER, payload: user_value });

const initialState = {
    board_list: [],
    scroll: 0,
    infinity_page: 1,
    infinity_init_count: 0,
    user_name: ''
};

const boardStore = (state = initialState, action) => {
    switch (action.type) {
        case BOARD_STORE:
            return {
                ...state,
                board_list: action.payload
            };
        case BOARD_SCROLL:
            return {
                ...state,
                scroll: action.payload
            };
        case BOARD_INFINITY_PAGE:
            return {
                ...state,
                infinity_page: action.payload
            };
        case BOARD_STORE_RESET:
            return {
                ...state,
                board_list: [],
                scroll: 0,
                infinity_page: 1,
            };
        case BOARD_STORE_INIT:
            return {
                ...state,
                infinity_init_count: infinity_init_count + 1
            };
        case BOARD_STORE_USER:
            return {
                ...state,
                user_name: action.payload
            };
        default:
            return { ...state };
    }
}

export default boardStore;