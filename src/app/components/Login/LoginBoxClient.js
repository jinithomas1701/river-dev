import React from "react";
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
  
import { Toast, riverToast } from '../Common/Toast/Toast';

// page dependency
import { Util } from "../../Util/util";
import { CommonService } from "../Layout/Common.service";
import { LoginService } from "./Login.service";
import {setUsername, setPassword, enterOtp} from "./Login.actions";
// CSS
import "./LoginClient.scss";


const mapStateToProps = (state) => {
    return {
        user: state.LoginReducer
    }
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

class LoginBoxClient extends React.Component {
    state = {
        showPreloader: false,
        otpBox: false,
        username: "",
        password: "",
        otpDialogOpen: false,
        otp: "",
        clientLogin: true
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const userDetails = Util.getLoggedInUserDetails();
        this.props.enterOtp("");
        if (Util.getAuthToken()) {
            if (userDetails && userDetails.privileges) {
                window.location.href = "/#/dashboard";       
            }
        }
    }

    getMessage(msg) {
        const msgParts = msg.split("-");
        return msgParts.join(" ");
    }

    render() {
        
        return (
            <div className="wrapper">
                <Toast />
                <div className="signin-client-box">
                    
                    <div className="signin-logo">
                        <img src="../../../resources/images/litmus-logo.svg" alt="river"/>
                    </div>
                    <h3><span>Welcome to </span><img src="../../../resources/images/ideaLitup.png" alt="river"/></h3>
                    <div>
                                
                                    <div className="signin-form">
                                        <div className="">
                                            <TextField
                                                id="username"
                                                label="Email address"
                                                className="w-full"
                                                value={this.props.user.username}
                                                onChange={(e) => {
                                                    this.props.usernameChange(e.target.value)
                                                    {/* this.setState({username: e.target.value}); */}
                                                }}
                                                margin="normal"
                                            />
                                        </div>
                                        <div className="">
                                            <TextField
                                                id="password"
                                                label="Password"
                                                type="password"
                                                className="w-full"
                                                value={this.props.user.password}
                                                margin="normal"
                                                onChange={(e) => {
                                                    this.props.passwordChange(e.target.value)
                                                    {/* this.setState({password: e.target.value}); */}
                                                }}
                                                onKeyPress={
                                                    this.handleKeyPress.bind(this)
                                                }
                                            />
                                        </div>
                                    </div>
                                                                
                                <div className="signin-btns">
                                    <Button 
                                        disabled={this.state.showPreloader}
                                        className="signin-btn margin-top-medium"
                                        onClick={this.onLoginTap.bind(this)}>
                                        {
                                        this.state.showPreloader
                                            ? <CircularProgress size={32} className="fab-progress"/>
                                            : <Icon>arrow_forward</Icon>
                                        }
                                    </Button>
                                </div>
                                </div>
                       
                {/* {(this.state.clientLogin) ? (
                    <div className="floating-link" onClick={this.onToggleLogin.bind(this, 'user')}>User login</div>
                ):(
                    <div className="floating-link" onClick={this.onToggleLogin.bind(this, 'client')}>Client login</div>
                )} */}
                
                </div>
            </div>
        );
    }

    onToggleLogin(source) {
        this.setState({clientLogin: source === 'client'});
    }

    handleKeyPress(event) {
        if(event.key == 'Enter'){
            this.onLoginTap();
        }
    }

    handleOTPKeyPress(event) {
        if(event.key == 'Enter'){
            this.onOtpVerifyTap();
        }
    }

    goToOtp = () => {
        this.setState({ otpBox: true });
      };

    goToLogin(){
        this.setState({ otpBox: false });
    }

    onLoginTap() {
        this.setState({showPreloader: true});
        const credentials = {
            "username" : this.props.user.username,
            "password" : this.props.user.password
        };
        LoginService.doLoginTask(credentials, this.state.clientLogin)
        .then((data) => {
            if(data.otpRequired){
            this.props.enterOtp("");
            this.setState({showPreloader: false});
            this.goToOtp();
            }else{
                this.onOtpVerifyAuto();
            }
            
            // 
        })
        .catch((error) => {
            this.setState({showPreloader: false});
            riverToast.show(error.status_message);
        });
    }

    onOtpVerifyTap(){
        this.setState({showPreloader: true});        
        const credentials = {
            "username" : this.props.user.username,
            "otp" : this.props.user.otp
        }
        LoginService.verifyOtp(credentials)
        .then((data) => {
            this.props.enterOtp("");
            this.setState({showPreloader: false});
            this.getAuthToken(data.payload.clientId, data.payload.secret);
        })
        .catch((error) => {
            this.setState({showPreloader: false});
            riverToast.show(error.status_message);            
        })
    }

    onOtpVerifyAuto(){
        const credentials = {
            "username" : this.props.user.username,
            "otp" : '00000'
        }
        LoginService.verifyOtp(credentials)
        .then((data) => {
            this.props.enterOtp("");
            this.setState({showPreloader: false});
            this.getAuthToken(data.payload.clientId, data.payload.secret);
        })
        .catch((error) => {
            this.setState({showPreloader: false});
            riverToast.show(error.status_message);            
        })
    }

    getAuthToken(clientId, secret) {
        this.setState({showPreloader: true});        
        
        LoginService.getAuthToken(this.props.user.username, clientId, secret).
        then((data) => {
            this.setState({showPreloader: false});        
            
            if(data != undefined && data.access_token){
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('last_login', new Date().toLocaleString())
                this.userDetailCheck(data);
            }
        }).
        catch((error) => {
            this.setState({showPreloader: false});
            if (error.network_error) {
                riverToast.show(error.status_message);
            } else {
                riverToast.show("Something went wrong");
            }
        });
    }

    userDetailCheck(loginResponse){
        this.setState({showPreloader: true});        
        
        CommonService.getLoggedInUserDetails()
        .then(data => {
            this.setState({showPreloader: false});        
            this.setUserDetails(data);
            this.processLoginResponse(loginResponse);
        })
        .catch(error => {
            riverToast.show("Something went wrong");
        });
    }

    setUserDetails(data){
        Util.setLoggedInUserDetails(data);
    }

    processLoginResponse(loginResponse) {
        this.setState({ showPreloader: false });
        console.log(loginResponse);
        if (loginResponse) {
            let userDetails=Util.getLoggedInUserDetails();
            if(userDetails.type && userDetails.type=='client'){
                if(userDetails.activeTopics && userDetails.activeTopics.length>0){
                    window.location.href = '/#/litup/'+ userDetails.activeTopics[0];
                }else{
                    window.location.href = '/#/litup/' ;
                }

            }else{
                window.location.href = "/#/dashboard";
            }
        } else {
            riverToast.show("Invalid username or password");
        }
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBoxClient);