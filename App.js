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


const Board = () => {
	// const [get_session, set_session] = useState(false);

	// useEffect(async () => {
	// 	const loginSession = sessionStorage.getItem('user_ID');

	// 	const { data } = await axios.get('http://localhost:5000/session_check/' + loginSession)

	// 	if (data.session_check_result === 0)
	// 		set_session(false);
	// 	else if (data.session_check_result === 1)
	// 		set_session(true);
	// }, [])

	// console.log("APP", get_session);

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/test" component={test_AutoComplete}></Route>
				{/* <Route path="/login" render={() => <LoginPage set_session_Props={set_session} />} ></Route> */}
				<Route path="/login" render={() => <LoginPage />} ></Route>
				{/* <PrivateRoute path="/main" component={MainPage} logined={get_session}></PrivateRoute> */}
				{/* <PrivateRoute path="/board/insert" component={BoardInsert} logined={get_session}></PrivateRoute> */}
				<Route path="/board/insert" component={BoardInsert}></Route>
				{/* <PrivateRoute path="/board/view/:id" component={BoardViewPage} logined={get_session}></PrivateRoute>
				<PrivateRoute path="/board/update/:id" component={BoardUpdate} logined={get_session}></PrivateRoute> */}


				<PrivateRoute path="/main" component={MainPage}></PrivateRoute>
				<PrivateRoute path="/board/view/:id" component={BoardViewPage} ></PrivateRoute>
				<PrivateRoute path="/board/update/:id" component={BoardUpdate} ></PrivateRoute>
			</Switch>
		</BrowserRouter>

	)
}

export default Board;
