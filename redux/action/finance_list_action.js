
const FINANCE_LIST_STORE = 'financeList/FiNANCE_LIST_STORE';

export const Finance_List_Store = (get_list) => ({ type: FINANCE_LIST_STORE, payload: get_list });

const initialState = {
    fin_list: [],
};

const financeList = (state = initialState, action) => {
    switch (action.type) {
        case FINANCE_LIST_STORE:
            return {
                ...state,
                fin_list: action.payload
            };
        default:
            return { ...state };
    }
}

export default financeList;