import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';



const PrivateRoute = ({ component: Component, ...rest }) => {

    const [get_session, set_session] = useState(false);
    console.log("PrivateRouter");

    useEffect(() => {
        const loginSession = sessionStorage.getItem('user_ID');

        axios.get('http://localhost:5000/session_check/' + loginSession)
            .then((response) => {
                console.log(response.data);
                if (response.data.session_check_result === 0)
                    set_session(false);
                else if (response.data.session_check_result === 1)
                    set_session(true);
            })

    }, [])





    console.log("APP", get_session);


    return (
        <Route {...rest} render={(props) => (
            get_session  ? <Component {...props} />
                : <>{alert("로그인이 필요한 페이지입니다.")}{<Redirect to="/login" />}</>
        )}
        />
    )
}

export default PrivateRoute;