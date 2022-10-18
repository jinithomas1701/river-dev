import React from "react";
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { connect } from "react-redux";
import { GoogleLogin } from 'react-google-login';

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
import { setUsername, setPassword, enterOtp } from "./Login.actions";
// CSS
import "./Login.scss";


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

class LoginBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showPreloader: false,
        }
    }

    render() {

        const isLoggInDisabled = this.state.showPreloader;
        const loginIcon = this.state.showPreloader ? <CircularProgress size={18} /> : (<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fillRule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg>);

        return (
            <div className="wrapper">
                <Toast />
                <div className="google-signin-wrapper">
                    <img src="/resources/images/logo_club_2.png" width="80" height="80" alt="Club" />
                    <h1 className="title">Litmus7 Club</h1>
                    {/*clientId="345675505787-pvp9dsl1qsiklekks9fehqmmicbjidsr.apps.googleusercontent.com"*/}
                    <GoogleLogin
                        clientId="426169661964-vr7pea86l9eg52jpgon35g7u80cdlcr9.apps.googleusercontent.com"
                        buttonText="Google Login"
                        prompt="select_account"
                        onSuccess={this.responseGoogle.bind(this)}
                        onFailure={this.responseGoogle.bind(this)}
                        render={renderProps => (
                            <Button onClick={renderProps.onClick} className="btn-google-signin" disabled={isLoggInDisabled}>
                                <span className="icon-wrapper">{loginIcon}</span>
                                Login
                            </Button>
                        )}
                    />
                </div>
            </div>
        );
    }

    loginByGoogle(googleResponse) {
        this.setState({ showPreloader: false });

        if (googleResponse.access_token) {
            localStorage.setItem('accessToken', googleResponse.access_token);
            localStorage.setItem('last_login', new Date().toLocaleString());
            this.userDetailCheck(googleResponse);
        }
        else {
            riverToast.show("Google login failed.");
        }
    }

    userDetailCheck(loginResponse) {
        this.setState({ showPreloader: true });

        CommonService.getLoggedInUserDetails()
            .then(data => {
                this.setState({ showPreloader: false });
                this.setUserDetails(data);
                this.processLoginResponse(loginResponse);
            })
            .catch(error => {
                riverToast.show("Something went wrong");
            });
    }

    setUserDetails(data) {
        Util.setLoggedInUserDetails(data);
    }

    processLoginResponse(loginResponse) {
        this.setState({ showPreloader: false });
        //console.log(loginResponse);
        if (loginResponse) {
            let userDetails = Util.getLoggedInUserDetails();
            if (userDetails.type && userDetails.type == 'client') {
                if (userDetails.activeTopics && userDetails.activeTopics.length > 0) {
                    window.location.href = '/#/litup/' + userDetails.activeTopics[0];
                } else {
                    window.location.href = '/#/litup/';
                }

            } else {
                //user will be redirected to welcome screen lander page
                //window.location.href = Util.getRedirectPath(userDetails.activeRole.value);
                
                const linkPage = Util.getActivityLinkDetails();
                if (linkPage) {
                    const now = new Date().getTime();
                    //60000 ms = 1min ; 300000 = 5min
                    try {
                        if (now - linkPage.timestamp < 300000) {
                            let path = linkPage.path;
                            const params = linkPage.params;
                            for (let key in params) {
                                let rgx = new RegExp(`:${key}\\??`, "g");
                                let val = params[key];
                                path = path.replace(rgx, val);
                            }
                            window.location.href = `/#${path}`;
                            return;
                        }

                    } catch (error) {
                        //console.log(error);
                    }
                }

                window.location.href = '/#/welcome/';
            }
        } else {
            riverToast.show("Invalid username or password");
        }

    }

    responseGoogle(response) {
        //console.log(response);
        if (response.accessToken) {
            this.setState({ showPreloader: true });
            const credentials = {
                "idtoken": response.tokenId
            };
            LoginService.doGoogleLogin(credentials)
                .then((data) => {
                    this.loginByGoogle(data);
                })
                .catch((error) => {
                    this.setState({ showPreloader: false });
                    riverToast.show(error.status_message);
                });
        }
        else {
            riverToast.show("Google signin failed");
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBox);