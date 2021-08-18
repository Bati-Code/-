
const PAGE_STORE = 'pageStore/PAGE_STORE';
const PAGE_SEARCH = 'pageStore/PAGE_SEARCH';
const PAGE_RESET = 'pageStore/PAGE_RESET';
const PAGE_RADIO = 'pageStore/PAGE_RADIO';

export const Page_Store = (page_value) => ({ type: PAGE_STORE, payload: page_value });
export const Page_Search = (menu_value, search_value) =>
    ({ type: PAGE_SEARCH, payload: { menu: menu_value, search: search_value } });
export const Page_Reset = () => ({ type: PAGE_RESET });
export const Page_Radio = (radio_value) => ({ type: PAGE_RADIO, payload: radio_value });

const initialState = {
    page: 1,
    menu_select: '제목',
    search: false,
    search_value: '',
    count: 0,
    radio: 'a'

};

const pageStore = (state = initialState, action) => {
    switch (action.type) {
        case PAGE_STORE:
            return {
                ...state,
                page: action.payload
            };
        case PAGE_SEARCH:
            return {
                ...state,
                search: true,
                menu_select: action.payload.menu,
                search_value: action.payload.search
            };
        case PAGE_RESET:
            return {
                ...state,
                page: 1,
                menu_select: '제목',
                search: false,
                search_value: '',
                count: state.count + 1
            }
        case PAGE_RADIO:
            return {
                ...state,
                radio: action.payload
            }

        default:
            return { ...state };
    }
}

export default pageStore;