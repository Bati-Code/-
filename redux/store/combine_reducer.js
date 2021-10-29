import { combineReducers } from 'redux';
import boardStore from '../action/board_list_action';
import financeList from '../action/finance_list_action';
import pageStore from '../action/page_action';
import sessionStore from '../action/session_action';


export default combineReducers({
    pageStore, sessionStore, financeList, boardStore
});