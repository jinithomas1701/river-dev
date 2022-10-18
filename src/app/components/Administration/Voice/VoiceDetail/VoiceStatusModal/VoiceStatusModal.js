import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import { Toast, riverToast } from '../../../../Common/Toast/Toast';
import {Util} from '../../../../../Util/util';
import {VoiceAdminService} from '../../Voice.service';

import "./VoiceStatusModal.scss";

export default class VoiceStatusModal extends React.Component {
    state = {
        comment: "",
        status: ""
    };
    status = "";
    voiceDetail = {};

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.voiceDetail = this.props.voiceDetails;
            this.setState({status: this.props.status});
        }
    }

    render() {
        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="attendance-mark-dialog-container">
                <DialogTitle>{this.getModalTitle()}</DialogTitle>
                <DialogContent>
                    <div className="content-container add-minutes-container">
                        <div className="minutes-container">
                            <TextField
                                id="multiline-flexible"
                                label="Comment"
                                multiline
                                rows="4"
                                value={this.state.comment}
                                onChange={(e) => {
                                    this.setState({comment:e.target.value});
                                }}
                                className="w-full"
                                margin="normal"
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.onSubmit.bind(this)} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    getModalTitle() {
        let title = "Status";
        if (this.state.status === "ACCEPT") {
            title = "Approve";
        } else if (this.state.status === "REJECT") {
            title = "Reject";
        } else if (this.state.status === "REFINE") {
            title = "Refine";
        } else if (this.state.status === "ACKNOWLEDGE") {
            title = "Acknowledge";
        } else if (this.state.status === "RESOLVE") {
            title = "Resolve";
        }

        return title;
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
    }

    onSubmit() {
        if (this.state.status && this.voiceDetail && this.voiceDetail.voiceId) {
            
            const request = {
                action: this.state.status,
                message: this.state.comment
            };

            VoiceAdminService.changeVoiceStatus(request, this.voiceDetail.voiceId, this.voiceDetail.voiceHash)
                .then(data => {
                    this.props.onRequestClose(false, true);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        }
    }
  }