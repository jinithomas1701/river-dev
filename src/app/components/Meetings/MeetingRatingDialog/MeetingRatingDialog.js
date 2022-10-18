import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import Checkbox from 'material-ui/Checkbox';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import {StarRating} from "../../Common/StarRating/StarRating";

import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from '../../../Util/util';
import {MeetingService} from "../meetings.service";

import "./MeetingRatingDialog.scss";

export default class MeetingRatingDialog extends React.Component {
    state = {
        rating: 0,
        value: 0,
        comment: "",
        meetingDetail: {},
        showProgress: false
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.setState({
                    rating: 0,
                    value: 0,
                    comment: "",
                    meetingDetail: this.props.meetingDetail,
                    showProgress: false
                });
        }
    }

    render() {
        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="attendance-mark-dialog-container">
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>{this.state.meetingDetail.title}</DialogTitle>
                <DialogContent>
                    <div className="content-container rate-meeting-container">
                        <div className="sub-title">
                            Your meeting is over, please rate meeting below.
                        </div>
                        <div className="rating-container">
                            <StarRating 
                                isEditable={true} 
                                onChange={this.onRatingChnage.bind(this)}
                                className="star-rating" 
                                rating={this.state.rating} 
                                size={"2rem"}/>
                        </div>
                        <div className="comments-container">
                            <TextField
                                id="multiline-flexible"
                                label="Comments"
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
                        Later
                    </Button>
                    <Button onClick={this.onSubmit.bind(this)} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    onRatingChnage(value) {
        this.setState({
            ...this.state,
            rating: value,
            value: value
        });
    }

    handleRequestClose() {
        this.props.onRequestClose(false, true);
    }

    getRatingRequest() {
        return {
            rate: this.state.value,
            comment: this.state.comment
        };
    }

    onSubmit() {
        const rateRequest = this.getRatingRequest();
        this.setState({showProgress: true});
        MeetingService.rateMeetingTask(this.state.meetingDetail.meetingId, rateRequest)
        .then(data => {
            this.setState({showProgress: false});
            riverToast.show("Your rating has been added");
            this.props.onRequestClose(false, true);
        })
        .catch(error => {
            this.setState({showProgress: false});
            riverToast.show(error.status_message);
        });
    }
  }