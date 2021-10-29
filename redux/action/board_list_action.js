
const BOARD_STORE = 'boardStore/BOARD_STORE';
const BOARD_SCROLL = 'boardStore/BOARD_SCROLL';

export const board_Store = (get_board) => ({ type: BOARD_STORE, payload: get_board });
export const Board_Scroll = (scroll_value) => ({ type: BOARD_SCROLL, payload: scroll_value });

const initialState = {
    board_list: [],
    scroll: 0
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
        default:
            return { ...state };
    }
}

export default boardStore;