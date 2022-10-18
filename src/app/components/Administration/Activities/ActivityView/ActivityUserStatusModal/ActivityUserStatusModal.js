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
import {ActivityViewServices} from '../ActivityView.service';

import "./ActivityUserStatusModal.scss";

export default class ActivityUserStatusModal extends React.Component {
    state = {
        comment: "",
        status: ""
    };
    status = "";
    activityDetails = {};
    index = -1;
    user = {};
    approveRequest = {};

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            if (!this.props.isCouncilApprove) {
                this.activityDetails = this.props.activityDetails;
                this.user = this.props.user;
                this.index = this.props.index;
            }
        } else {
            this.activityDetails = this.props.activityDetails;
            this.approveRequest = this.props.approveRequest;
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
        let title = "";
        if (this.props.isCouncilApprove) {
            title = "Reject";
        } else {
            title = "Remove";
        }
        return title;
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
    }

    onSubmit() {
        if (!this.props.isCouncilApprove) {
            const request = {
                userId: [this.props.user.userId.id]
            };
    
            ActivityViewServices.removeAssignees(this.props.activityDetails.id, request)
                .then(data => {
                    riverToast.show("User has been removed successfully");
                    this.props.onRequestClose(false, true);
                })
                .catch(data => {
                    riverToast.show(error.status_message || "Something went wrong while removing user");
                });
        } else {
            this.approveRequest.comment = this.state.comment;
            ActivityViewServices.approveCouncil(this.props.activityDetails.id, this.approveRequest)
                .then(data => {
                    riverToast.show("Activity has been rejected successfully");
                    this.props.onRequestClose(false, true);
                })
                .catch(data => {
                    riverToast.show(error.status_message || "Something went wrong while rejecting activity");
                });
        }
    }
  }