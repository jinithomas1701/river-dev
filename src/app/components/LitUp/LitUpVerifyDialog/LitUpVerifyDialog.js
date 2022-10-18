import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import moment from 'moment';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

// custom component
import { LitUpService } from "../LitUp.service";
import {Util} from "../../../Util/util";
import './LitUpVerifyDialog.scss';
import IconButton from "material-ui/IconButton/IconButton";

const PRIVILEGE_ILITUP_ADMIN = "ILITUP_ADMIN";
const PRIVILEGE_ILITUP_VOTER = "ILITUP_VOTER";

export default class LitUpVerifyDialog extends React.Component {

    state = {
        verificationCode: "",
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.setState({verificationCode: ''});
            console.log(this.props.suggestion);
            
        }
    }

    render() {
        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="litup-suggest-view-dialog-container">
                <DialogTitle>Verification Code</DialogTitle>
                <DialogContent>
                    <div className="workshop-dialog-container">
                        <TextField type="password" onChange={(e) => {
                            this.setState({verificationCode: e.target.value});
                        }}/>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleRequestClose.bind(this)}>
                        CLOSE
                    </Button>
                    <Button raised color="primary" onClick={this.onVerifyClick.bind(this)}>
                        VERIFY
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
    }
    
    onVerifyClick() {
        if (this.state.verificationCode) {
            const request = {
                verificationCode: this.state.verificationCode
            };
            LitUpService.verifyLitupUser(this.props.suggestion.id, request)
                .then(isVerified => {
                    
                    if (isVerified) {
                        this.props.onRequestClose(true);
                    } else {
                        this.setState({verificationCode: ''});
                        riverToast.show('Incorrect code or user not permitted');
                    }
                })
                .catch(error => {
                    console.log(error);
                    riverToast.show(error.status_message || 'Something went wrong while generating code');
                });
        } else {
            riverToast.show('Please enter verification code');
        }
        
    }
}