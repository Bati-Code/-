import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./custom_Router/PrivateRouter";


import MainPage from './views/Board/MainPage'
import LoginPage from './views/member/LoginPage'
import BoardViewPage from './views/Board/BoardView'
import BoardInsert from "./views/Board/BoardInsert";
import BoardUpdate from "./views/Board/BoardUpdate";

axios.defaults.withCredentials = true;

const Board = () => {

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/login" render={() => <LoginPage />} />

				<PrivateRoute path="/main" component={MainPage} />
				<PrivateRoute path="/board/insert" component={BoardInsert} />
				<PrivateRoute path="/board/view/:id" component={BoardViewPage} />
				<PrivateRoute path="/board/update/:id" component={BoardUpdate} /> 
			</Switch>
		</BrowserRouter>

	)
}

export default Board;
