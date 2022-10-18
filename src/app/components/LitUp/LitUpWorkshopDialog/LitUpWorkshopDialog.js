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
import './LitUpWorkshopDialog.scss';
import IconButton from "material-ui/IconButton/IconButton";

const PRIVILEGE_ILITUP_ADMIN = "ILITUP_ADMIN";
const PRIVILEGE_ILITUP_VOTER = "ILITUP_VOTER";

export default class LitUpWorkshopDialogDialog extends React.Component {

    state = {
        ideaContent: "",
        verificationCode: ''
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.setState({verificationCode: ''});
            this.setState({litUpTopic: this.props.litUpTopic});
            if (this.props.litUpTopic 
                && this.props.litUpTopic.workshop 
                && this.props.litUpTopic.workshop.verificationCode) {
                    this.setState({verificationCode: this.props.litUpTopic.workshop.verificationCode});
            }
        }
    }

    render() {
        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="litup-suggest-view-dialog-container">
                <DialogTitle>Workshop</DialogTitle>
                <DialogContent>
                    <div className="workshop-dialog-container">
                        <div className="label">Verification Code</div>
                        {this.state.verificationCode ? (
                            <div className="verification-code">{this.state.verificationCode}</div>
                        ):(
                            <div className="action-container">
                                <Button raised color="primary" onClick={this.onGenerateClick.bind(this)}>GENERATE</Button>
                            </div>
                        )}
                        {this.state.verificationCode &&
                            <div className="action-container">
                                <Button raised disabled={this.state.litUpTopic.hasWorkshopStarted} color="primary" onClick={this.onGenerateClick.bind(this)}>REGENERATE</Button>
                            </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleRequestClose.bind(this)}>
                        CLOSE
                    </Button>
                    {this.state.litUpTopic && !this.state.litUpTopic.hasWorkshopCreated && !this.state.litUpTopic.hasWorkshopStarted &&
                        <Button raised color="primary" onClick={this.onStartStopClick.bind(this, 'start')}>
                            START WORKSHOP
                        </Button>
                    }
                    {this.state.litUpTopic && this.state.litUpTopic.hasWorkshopCreated && this.state.litUpTopic.hasWorkshopStarted &&
                        <Button raised color="accent" onClick={this.onStartStopClick.bind(this, 'stop')}>
                            STOP WORKSHOP
                        </Button>
                    }
                    {this.state.litUpTopic && this.state.litUpTopic.hasWorkshopCreated && !this.state.litUpTopic.hasWorkshopStarted &&
                        <Button raised color="primary" onClick={this.onStartStopClick.bind(this, 'resume')}>
                            RESUME WORKSHOP
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestClose();
    }

    onStartStopClick(source) {
        if (this.state.verificationCode) {
            if (source === 'start') {
                if (confirm('People will be able to login with the verification code while workshop is started, Do you want to proceed ?')) {
                    const request = {
                        "topicId": this.state.litUpTopic.id,
                        "workshopName":"",
                        "description" :"",
                        "verificationCode" : this.state.verificationCode
                    };
                    LitUpService.createWorkshop(request)
                        .then(data => {
                            this.setState({litUpTopic: data});
                            // this.props.onRequestClose(true);
                        })
                        .catch(error => {
                            console.log(error);
                            riverToast.show(error.status_message || 'Something went wrong while creating workshop');
                        });
                }
            } else if (source === 'resume') {
                if (confirm('People will be able to login with the verification code while workshop is started, Do you want to proceed ?')) {
                    const request = {
                        "verificationCode" : this.state.verificationCode
                    };
                    LitUpService.resumeWorkshop(this.state.litUpTopic.workshop.workshopId, request)
                        .then(data => {
                            this.setState({litUpTopic: data});
                            // this.props.onRequestClose(true);
                        })
                        .catch(error => {
                            console.log(error);
                            riverToast.show(error.status_message || 'Something went wrong while resuming workshop');
                        });
                }
            } else {
                if (confirm("People won't be able to login with the verification code while workshop is started, Do you want to proceed ?")) {
                    LitUpService.stopWorkshop(this.state.litUpTopic.workshop.workshopId)
                        .then(data => {
                            this.setState({litUpTopic: data});
                            // this.props.onRequestClose(true);
                        })
                        .catch(error => {
                            console.log(error);
                            riverToast.show(error.status_message || 'Something went wrong while stopping workshop');
                        });
                }
            }
        } else {
            riverToast.show('Please generate a verification code');
        }
        
    }

    onGenerateClick() {
        LitUpService.generateVerificationCode()
            .then(code => {
                this.setState({verificationCode: code});
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while generating code');
            });
    }
}