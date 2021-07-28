import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./custom_Router/PrivateRouter";


import MainPage from './views/Board/MainPage'
import LoginPage from './views/member/LoginPage'
import BoardViewPage from './views/Board/BoardView'
import BoardInsert from "./views/Board/BoardInsert";
import BoardUpdate from "./views/Board/BoardUpdate";
import test_AutoComplete from "./views/test/test_AutoComplete";
axios.defaults.withCredentials = true;

const Board = () => {

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/login" render={() =>  <LoginPage />} ></Route>

				<Route path="/main" component={MainPage}></Route>
				<Route path="/board/insert" component={BoardInsert}></Route>
				<Route path="/board/view/:id" component={BoardViewPage} ></Route>
				<Route path="/board/update/:id" component={BoardUpdate} ></Route>
			</Switch>
		</BrowserRouter>

	)
}

export default Board;
