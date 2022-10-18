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

import {ContactList} from "../../../Common/ContactList/ContactList";

import { Toast, riverToast } from '../../../Common/Toast/Toast';
import {Util} from '../../../../Util/util';
import {MeetingService} from '../meetings.service';

import "./MeetingAddMinutesDialog.scss";
import { SelectBox } from "../../../Common/SelectBox/SelectBox";

export default class MeetingAddMinutesDialog extends React.Component {
    state = {
        minutes: "",
        notes: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.setState({
                minutes: this.props.meetingDetails.mom || "",
                notes: this.props.meetingDetails.notes || ""
            });
        }
    }

    commitmentStatusList = [
        {
            title: "ToDo",
            value: 0
        },
        {
            title: "Done",
            value: 1
        },
        {
            title: "Completed",
            value: 2
        }
    ]

    render() {

        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="attendance-mark-dialog-container">
                <DialogTitle>Add Minutes</DialogTitle>
                <DialogContent>
                    <div className="content-container add-minutes-container">
                        <div className="minutes-container">
                            <TextField
                                id="multiline-flexible"
                                label="Minutes"
                                multiline
                                rows="4"
                                value={this.state.minutes}
                                onChange={(e) => {
                                    this.setState({minutes:e.target.value});
                                }}
                                className="w-full"
                                margin="normal"
                            />
                        </div>
                        <div className="minutes-container">
                            <TextField
                                id="multiline-flexible"
                                label="Notes"
                                multiline
                                rows="4"
                                value={this.state.notes}
                                onChange={(e) => {
                                    this.setState({notes:e.target.value});
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

    handleRequestClose() {
        this.props.onRequestClose(false);
    }

    onSubmit() {
        const request = {
            "notes":this.state.notes,
            "mom":this.state.minutes
        };
        MeetingService.addMeetingNoteTask(this.props.meetingDetails.meetingId, request)
            .then(data => {
                riverToast.show("Minutes updated successfully");
                this.props.onRequestClose(false, true);
            })
            .catch(error => {
                riverToast.show(error.status_message);
            });
    }
  }