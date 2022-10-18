import React from "react";
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";

import Header from "../Layout/Header";

// CSS
import "./AccessDenied.scss";

export default class AccessDenied extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="permission-denied-container">
                <div className="w-full header-container">
                    <Header />
                </div>
                <div className="access-denied-content">
                    <Icon className="icon">warning</Icon>
                    <div className="text-head">Access Denied</div>
                    <div className="text">You don't have permission to access this url!</div>
                    <Button className="action" color="primary" onClick={this.onGotoClick.bind(this)}>GOTO DASHBOARD</Button>
                </div>
            </div>
        );
    }

    onGotoClick() {
        window.location.href = "/#/dashboard";
    }
}