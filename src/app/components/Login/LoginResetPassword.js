import React from "react";
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {CircularProgress} from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

import {Toast, riverToast} from '../Common/Toast/Toast';

// page dependency
import {Util} from "../../Util/util";
import {CommonService} from "../Layout/Common.service";
import {LoginService} from "./Login.service";
import {setUsername, setPassword, enterOtp} from "./Login.actions";
// CSS
import "./LoginResetPassword.scss";

const mapStateToProps = (state) => {
    return {user: state.LoginReducer}
};

const mapDispatchToProps = (dispatch) => {
    return {
        usernameChange: (username) => {
            dispatch(setUsername(username));
        },
        passwordChange: (password) => {
            dispatch(setPassword(password));
        },
        enterOtp: (otp) => {
            dispatch(enterOtp(otp));
        }
    }
};

class LoginResetPassword extends React.Component {
    state = {
        showPreloader: false,
        username: "",
        captcha: "",
        code:"",
        hasCaptcha:false

    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {

        return (
            <div className="wrapper">
                <Toast/>
                <div className="signin-box">

                    <div className="signin-logo">
                        <img src="/resources/images/logo_club_2.png" alt="river"/>
                    </div>

                    <div className="signin-wrap">
                        <div className="signin-form">
                        <h6>Reset Password</h6>
                            <div className="">
                                <TextField
                                    id="username"
                                    label="Email address"
                                    className="w-full"
                                    value={this.state.username}
                                    onChange={(e) => {
                                    this.setState({username: e.target.value})
                                }}
                                    margin="normal"/>
                            </div>
                            {this.state.hasCaptcha && <div>                                
                                     <img height={60} src={'data:image/jpeg;base64,' + this.state.captcha}/>
                               
                            </div>}
                            {this.state.hasCaptcha && <div>                                
                                <TextField
                                    id="captcha"
                                    label="Enter Code"
                                    className="w-full"
                                    value={this.state.code}
                                    onChange={(e) => {
                                    this.setState({code: e.target.value})
                                }}
                                    margin="normal"/>
                               
                            </div>}
                            <div className="signin-footer">
                                <div className="floating-link" onClick={()=>{window.location.href="/#/login";}}>Back to Login</div>
                            </div>
                        </div>
                    </div>

                    <div className="signin-btns">
                        <Button
                            disabled={this.state.showPreloader}
                            className="signin-btn margin-top-medium"
                            onClick={this
                            .clickSubmit
                            .bind(this)}>
                            {this.state.showPreloader
                                ? <CircularProgress size={32} className="fab-progress"/>
                                : <Icon>arrow_forward</Icon>
}
                        </Button>
                    </div>

                </div>
            </div>
        );
    }

    clickSubmit() {
        this.setState({showPreloader:true});
        if(!this.state.captcha){
            this.onUsernameEnter(this.state.username);
        }else{
            this.onCaptchaSubmit(this.state.username,this.state.code)
        }
    }

    onCaptchaSubmit(username,captcha){
        LoginService
            .doPasswordResetSubmit(username,captcha)
            .then((data) => {   
                    this.setState({captcha: "",hasCaptcha:false,showPreloader:false,username:""});                    
                    riverToast.show(data.status_message);
                    window.location.href="/#/login/Password_reset_successfull";
            })
            .catch((error) => {
                this.setState({showPreloader: false});
                riverToast.show(error.status_message);
            });
    }

    //forgot_password_submit
    onUsernameEnter(username) {

        LoginService
            .doPasswordReset(username)
            .then((data) => {
                
                if (data.payload) {
                    this.setState({captcha: data.payload.captcha,hasCaptcha:true,showPreloader:false});
                } else {
                    riverToast.show("Invalid user email");
                    this.setState({showPreloader:false}); 
                }
            })
            .catch((error) => {
                this.setState({showPreloader: false});
                riverToast.show(error.status_message);
            });
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(LoginResetPassword);