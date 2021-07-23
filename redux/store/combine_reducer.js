import { combineReducers } from 'redux';
import pageStore from '../action/page_action';
import sessionStore from '../action/session_action';


export default combineReducers({
    pageStore, sessionStore
});