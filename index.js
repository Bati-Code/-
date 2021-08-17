import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore } from 'redux';
import { Provider } from 'react-redux'

import Reducer from "./redux/store/combine_reducer";

import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import './public/css/alertCSS.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const devTools =
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({trace: true, traceLimit: 25});
const store = createStore(Reducer, devTools);
console.log(store.getState());

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 2500,
    offset: '30px',
    transition: transitions.SCALE,
}

const AlertTemplate = ({ message }) => (
    <div className="alert_template">
        <ExclamationCircleOutlined /> {message}
    </div>
);

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
            <App />
        </AlertProvider>
    </Provider>
    , rootElement);

