import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./custom_Router/PrivateRouter";


import MainPage from './views/Board/MainPage'
import LoginPage from './views/member/LoginPage'
import BoardViewPage from './views/Board/BoardView'
import BoardInsert from "./views/Board/BoardInsert";
import BoardUpdate from "./views/Board/BoardUpdate";

import Fin_Interest from './views/member_info/Fin_Interest'
import Fin_Info from "./views/Finance_List/Fin_Info";



axios.interceptors.request.use(
	(config) => {
		config.headers.authorization = sessionStorage.getItem('user_Token');

		return config;
	},
	function (error) {
		console.log("axios interceptor error");
		return Promise.reject(error);
	});


const Board = () => {

	return (
		<BrowserRouter>
			<Route exact path="/" component={LoginPage} />
			<Switch>
				<Route path="/login" render={() => <LoginPage />} />

				<PrivateRoute path="/main" component={MainPage} />
				<PrivateRoute path="/board/insert" component={BoardInsert} />
				<PrivateRoute path="/board/view/:id" component={BoardViewPage} />
				<PrivateRoute path="/board/update/:id" component={BoardUpdate} />



				<PrivateRoute path="/fin_interest" component={Fin_Interest} />
				<PrivateRoute path="/fin_info" component={Fin_Info} />
			</Switch>
		</BrowserRouter>

	)
}

export default Board;
