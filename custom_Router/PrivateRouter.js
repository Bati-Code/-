import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';



const PrivateRoute = ({ component: Component, ...rest }) => {

    const [get_session, set_session] = useState('default');
    console.log("PrivateRouter");




    axios.get('http://localhost:5000/user_check',
        {
            headers: { 'authorization': sessionStorage.getItem('user_Token') }
        })
        .then((response) => {
            console.log("PrivateRouter", response.data);
            if (response.data.user_result === 0)
                set_session(false);
            else if (response.data.user_result === 1)
                set_session(true);
        })


    console.log("APP", get_session);


    return (
        <Route {...rest} render={(props) => (
            get_session === 'default' ? null
                : (get_session ? <Component {...props} />
                    : <>{alert("로그인이 필요한 페이지입니다.")}{<Redirect to="/login" />}</>)
        )}
        />
    )
}

export default PrivateRoute;