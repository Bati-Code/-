
const PAGE_STORE = 'pageStore/PAGE_STORE';
const PAGE_SEARCH = 'pageStore/PAGE_SEARCH';
const PAGE_SEARCH_UI = 'pageStore/PAGE_SEARCH_UI';
const PAGE_SEARCH_DATE = 'pageStore/PAGE_SEARCH_DATE';
const PAGE_RESET = 'pageStore/PAGE_RESET';
const PAGE_RADIO = 'pageStore/PAGE_RADIO';
const PAGE_TAB = 'pageStore/PAGE_TAB';


export const Page_Store = (page_value) => ({ type: PAGE_STORE, payload: page_value });
export const Page_Search = (menu_value, search_value) =>
    ({ type: PAGE_SEARCH, payload: { menu: menu_value, search: search_value } });
export const Page_Search_UI = (ui_value) => ({ type: PAGE_SEARCH_UI, payload: ui_value });
export const Page_Search_Date = (date_value) => ({ type: PAGE_SEARCH_DATE, payload: date_value });
export const Page_Reset = () => ({ type: PAGE_RESET });
export const Page_Radio = (radio_value) => ({ type: PAGE_RADIO, payload: radio_value });
export const Page_Tab = (tab_value) => ({ type: PAGE_TAB, payload: tab_value });

const initialState = {
    page: 1,
    menu_select: '제목',
    search: false,
    search_ui: false,
    search_value: '',
    count: 0,
    radio: '최신순',
    date: [0, 0],
    tab: 2
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
                search_value: action.payload.search,
                page: 1
            };
        case PAGE_SEARCH_UI:
            return {
                ...state,
                search_ui: action.payload
            }
        case PAGE_SEARCH_DATE:
            return {
                ...state,
                date: action.payload
            }
        case PAGE_RESET:
            return {
                ...initialState,
                count: state.count + 1
            }
        case PAGE_RADIO:
            return {
                ...state,
                radio: action.payload
            }
        case PAGE_TAB:
            return {
                ...state,
                tab: action.payload
            }
        default:
            return { ...state };
    }
}

export default pageStore;