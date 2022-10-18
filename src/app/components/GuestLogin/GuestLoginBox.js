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
import { GuestLoginService } from "./GuestLogin.service";
import {setUsername, setPassword, enterOtp} from "./GuestLogin.actions";
// CSS
import "./GuestLogin.scss";


const mapStateToProps = (state) => {
    return {
        user: state.GuestLoginReducer
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

class GuestLoginBox extends React.Component {
    state = {
        showPreloader: false,
        otpBox: false,
        username: "",
        password: "",
        otpDialogOpen: false,
        otp: ""
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
                <div className="signin-box">
                    <div className="signin-logo">
                        <img src="/resources/images/logo_club_1.png" alt="river"/>
                    </div>
                    {(this.props.msg && !this.state.otpBox) &&
                        <div className="msg">{this.getMessage(this.props.msg)}</div>
                    }
                    {
                        (!this.state.otpBox) ? (
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
                        ) : (
                            <div>
                                <div className="otp-box">
                                    <h4>Please enter the OTP recieved in your e-mail.</h4>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="otp"
                                        label="OTP"
                                        type="text"
                                        fullWidth
                                        value={this.props.user.otp}
                                        onChange={(e) => {
                                            this.props.enterOtp(e.target.value)
                                            {/* this.setState({otp: e.target.value}); */}
                                        }}
                                        onKeyPress={
                                            this.handleOTPKeyPress.bind(this)
                                        }
                                        />
                                        <Button onClick={this.goToGuestLogin.bind(this)} color="primary">
                                        Guest Login With Other
                                        </Button>
                                </div>
                                <div className="signin-btns">
                                    <Button 
                                        disabled={this.state.showPreloader}
                                        className="signin-btn margin-top-medium"
                                        onClick={this.onOtpVerifyTap.bind(this)}>
                                        {
                                        this.state.showPreloader
                                            ? <CircularProgress size={32} className="fab-progress"/>
                                            : <Icon>arrow_forward</Icon>
                                        }
                                    </Button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

    handleKeyPress(event) {
        if(event.key == 'Enter'){
            this.onGuestLoginTap();
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

    goToGuestLogin(){
        this.setState({ otpBox: false });
    }

    onGuestLoginTap() {
        this.setState({showPreloader: true});
        const credentials = {
            "username" : this.props.user.username,
            "password" : this.props.user.password
        };
        GuestLoginService.doGuestLoginTask(credentials)
        .then((data) => {
            this.props.enterOtp("");
            this.setState({showPreloader: false});
            this.goToOtp();
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

    getAuthToken(clientId, secret) {
        this.setState({showPreloader: true});        
        
        GuestLoginService.getAuthToken(this.props.user.username, clientId, secret).
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
            this.processGuestLoginResponse(loginResponse);
        })
        .catch(error => {
            riverToast.show("Something went wrong");
        });
    }

    setUserDetails(data){
        Util.setLoggedInUserDetails(data);
    }

    processGuestLoginResponse(loginResponse) {
        this.setState({ showPreloader: false });
        if (loginResponse) {
            window.location.href = "/#/dashboard";
        } else {
            riverToast.show("Invalid username or password");
        }
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuestLoginBox);