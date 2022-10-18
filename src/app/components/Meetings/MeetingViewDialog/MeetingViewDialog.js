import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import moment from "moment";
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import {StarRating} from "../../Common/StarRating/StarRating";
import {CommentItem} from '../../Common/CommentItem/CommentItem';
import Tooltip from 'material-ui/Tooltip';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import {ContactList} from "../../Common/ContactList/ContactList";

import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from '../../../Util/util';
import {MeetingService} from '../meetings.service';

import "./MeetingViewDialog.scss";

export default class MeetingViewDialog extends React.Component {
    state = {
        meetingDetail: {
            guestDetail: [],
            inviteesList: [],
        },
        commentsList: [],
        commentValue: "",
        commentPreloader: false,
        fullCommentLoaded: false
    };
    commentSkipCount = 0;
    commentSize = 5;
    
    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.setState({
                ...this.state,
                meetingDetail: this.props.meetingDetail,
                commentsList: this.props.meetingDetail.comments || []
            });
        }
    }

    render() {
        let guestList = this.state.meetingDetail.guestDetail.map((guest, index) => {
            return <Tooltip id="tooltip-icon" title={guest.details} placement="bottom">
                        <Chip
                            key={index}
                            className="chip-item"
                            avatar={<Avatar>{guest.name.charAt(0).toUpperCase()}</Avatar>}
                            label={guest.name}
                        />
                    </Tooltip>
        });

        let inviteesList = this.state.meetingDetail.inviteesList.map((invitee, index) => {
            return <Chip
                key={index}
                className="chip-item"
                avatar={<Avatar>{invitee.fullname.charAt(0).toUpperCase()}</Avatar>}
                label={invitee.fullname}
            />
        });

        const comments = this.state.commentsList.map((comment, index) => {
            return <CommentItem key={index} commentItem={comment}/>
        });

        return (
            <Dialog open={this.props.open} className="view-meeting-dialog-container" onRequestClose={this.handleRequestClose.bind(this)}>
                <DialogTitle>{this.state.meetingDetail.title}</DialogTitle>
                <DialogContent>
                    <div className="content-container view-meeting-container">
                        <div className="content-container">
                            <div className="sub-container">
                                {this.state.meetingDetail.type ? (this.state.meetingDetail.type.type == 'CLUB' ? (this.state.meetingDetail.type.type + " : " +  this.state.meetingDetail.clubName) : this.state.meetingDetail.type.type): ""}
                            </div>
                            <div className="time-container">
                                {this.getFormattedMeetingTiming(this.state.meetingDetail.fromDate, this.state.meetingDetail.toDate)}
                            </div>
                            <div className="time-container">
                                at <span>{this.state.meetingDetail.location}</span>
                            </div>
                            <div className="section-container">
                                <p>{this.state.meetingDetail.description ? this.state.meetingDetail.description : ""}</p>
                            </div>
                            <div className="section-title-container">Agenda</div>
                            <div className="section-container">
                                <p>{this.state.meetingDetail.agenda ? this.state.meetingDetail.agenda : ""}</p>
                            </div>
                            <div className="meeting-action-section-container">
                                <div className="action-section">
                                    <div className="action-comment-box">
                                        <input type="text" placeholder="Comment"
                                            value={this.state.commentValue}
                                            onChange={(e) => {
                                                this.setState({
                                                    ...this.state,
                                                    commentValue: e.target.value
                                                });
                                            }}
                                            onKeyPress={this.handleOnComment.bind(this)}
                                            className="comment-text"/>
                                    </div>
                                </div>
                                {(comments && comments.length > 0) && 
                                    <div>
                                        <div className="meeting-comment-list-container">
                                            {comments}
                                        </div>
                                        {(this.state.meetingDetail.commentsCount > 2 && !this.state.fullCommentLoaded) && 
                                            <div className="comment-action-container">
                                                {this.state.commentPreloader && 
                                                    <CircularProgress size={18}/>
                                                }
                                                <a onClick={this.loadMoreComments.bind(this)}>Load more comments</a>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="invitees-container">
                            {this.state.meetingDetail.ended && 
                                <div className="user-meeting-rating-container">
                                    <div className="section-title">Rating</div>
                                    <div className="rating-container">
                                        <StarRating 
                                            isEditable={false} 
                                            className="star-rating" 
                                            rating={this.state.meetingDetail.overAllRating} 
                                            size={"2rem"}/>
                                    </div>
                                </div>    
                            }
                            
                            <div className="section-title">Guests</div>
                            <div className="chip-container">
                                {guestList}
                            </div>
                            <div className="section-title">Invitees</div>
                            <div className="chip-container">
                                {inviteesList}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
    
    getFormattedMeetingTiming(from, to) {
        // 27 Oct 2018 8.00AM to 9.15AM
        const fromString = moment.unix(from/1000).format("DD MMM YYYY hh:mm A");
        const toTime = moment.unix(to/1000).format("DD MMM YYYY hh:mm A");
        return <div>from <span>{fromString}</span> to <span>{toTime}</span></div>;
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
    }

    toggleLoadCommentLoader(value) {
        this.setState({
            ...this.state,
            commentPreloader: value
        });
    }

    loadMoreComments() {
        if (this.state.meetingDetail && this.state.meetingDetail.commentId) {
            this.toggleLoadCommentLoader(true);
            this.commentSkipCount = this.state.commentsList.length;
            MeetingService.loadMoreComments(this.state.meetingDetail.commentId, this.commentSkipCount, this.commentSize)
                .then(comments => {
                    this.toggleLoadCommentLoader(false);
                    this.pushMoreComments(comments);
                })
                .catch(error => {
                    this.toggleLoadCommentLoader(false);
                    riverToast.show(error.status_message);
                });

        }
    }

    pushMoreComments(comments) {
        const fullComment = this.state.commentsList.concat(comments[0]);
        let fullCommentLoaded = false;
        if (fullComment.length === this.state.meetingDetail.commentsCount) {
            fullCommentLoaded = true;
        }
        this.setState({
            ...this.state,
            commentsList: fullComment,
            fullCommentLoaded: fullCommentLoaded
        });
    }

    processOnCommentResponse(commentValue, meetingId) {
        const userDetails = Util.getLoggedInUserDetails();
        const comment = [{
            value: commentValue,
            postedBy: {
                avatar: userDetails.avatar,
                name: userDetails.fullName,
                username: userDetails.username,
                userId: userDetails.userId
            },
            postedOn: Math.round((new Date()).getTime()),
        }];
        this.pushMoreComments(comment);
        this.props.pushCommentCallBack(comment, meetingId);
    }

    postCommentTask(commentValue, meetingDetail) {
        if (commentValue.trim()) {
            const commentRequest = {
                value: commentValue,
                commentId: meetingDetail.commentId
            };
            MeetingService.postComment(commentRequest)
                .then(data => {
                    this.processOnCommentResponse(commentValue, meetingDetail.meetingId);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        }
        this.setState({
            ...this.state,
            commentValue: ""
        });
    }

    handleOnComment(event) {
        if(event.key == 'Enter'){
            this.postCommentTask(this.state.commentValue, this.state.meetingDetail);
        }
    }
  }

//   export default connect(mapStateToProps, mapDispatchToProps)(ActivityMasterDetailDialog);