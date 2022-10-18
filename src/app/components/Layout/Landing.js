import React from "react";
import {render} from 'react-dom';

import "./Layout.scss";
import LoginBox from "../Login/LoginBox";
import LoginResetPassword from "../Login/LoginResetPassword";
import LoginBoxClient from "../Login/LoginBoxClient";
// import GuestLoginBox from "../GuestLogin/GuestLoginBox";

export class Landing extends React.Component {
    render() {

        let content = "";

        let param=this.props.match.params.message;

        if (param && param == 'guest') {

            content = (
                <div className="base-client-container"><LoginBoxClient msg={this.props.match.params.message}/></div>
            );

        } else if (param && param == 'password') {
            content = (
                <div className="base-container"><LoginResetPassword msg={this.props.match.params.message}/></div>
            );
        } else {
            content = (
                <div className="base-container"><LoginBox msg={this.props.match.params.message}/></div>
            );
        }

        return (
            <div>
                {content}
            </div>

        )
    }
}
