import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Users from './users';

class UsersPage extends Component {

    componentDidMount = () => {
        if (this.props.match.params.login_or_register === "logout") {
            this.loggedInToLogout();
        }
    }

    loggedInToLogout = () => {
        //Reset user state
        this.props.changeLoginState({
            login: false,
            id: 0,
            first_name: "",
            last_name: "",
            email: ""
        })

        return <Redirect to="/" />
    }

    notLoggedInToLogout = () => {
        return <Redirect to="/users/login" />
    }

    render() {
        const { login_or_register } = this.props.match.params;
        const { changeLoginState } = this.props;

        return (
            (login_or_register === undefined) ?
                <Users {...this.props} />
                :
                (login_or_register === "login") ?
                    <Login {...this.props} changeLoginState={changeLoginState} />
                    :
                    (login_or_register === "register") ?
                        <Register />
                        : (login_or_register === "logout") ?
                            (!!this.props.user.isLoggedIn ? this.loggedInToLogout() : this.notLoggedInToLogout())
                            : <Redirect to="/" />
        )
    }
}

export default UsersPage;