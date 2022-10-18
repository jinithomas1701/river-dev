import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import moment from 'moment';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import {CommentItem} from '../../Common/CommentItem/CommentItem';
import {Util} from "../../../Util/util";

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import {ActivitiesUserService} from "../ActivitiesUser.service";

import './ActivityDetailDialog.scss';

const MEMBER_LEVEL = "CLUB_MEMBER_ACTIVITY_LEVEL";
const PRESIDENT_LEVEL = "CLUB_PRESIDENT_ACTIVITY_LEVEL";
const COUNCIL_LEVEL = "COUNCIL_ACTIVITY_LEVEL";

export class ActivityDetailDialog extends React.Component {

    state = {
        comment: "",
        proofContainer: false,
        imageList: [],
        isCompleted: false,
        commentsList: [],
        commentValue: "",
        commentPreloader: false,
        fullCommentLoaded: false,
        doneBtn: true
    };
    commentSkipCount = 0;
    commentSize = 5;
    currentUser = Util.getLoggedInUserDetails();
    imageBase64ArrayList = [];
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            let fullCommentLoaded = false;
            if (this.props.activityDetails.comments.length >= this.props.activityDetails.commentsCount) {
                fullCommentLoaded = true;
            }

            this.setState({
                isCompleted: this.isActivityCompleted(), 
                fullCommentLoaded: fullCommentLoaded,
                commentsList: this.props.activityDetails.comments || []
            });
        }
    }

    isActivityCompleted() {
        let isComplted = false;
        const userId = this.currentUser.userId;
        this.props.activityDetails.assignees ? this.props.activityDetails.assignees.forEach((assigneeActivity, index) => {
            if (assigneeActivity.userId && assigneeActivity.userId.id == userId) {
                if (assigneeActivity.activityLevel != MEMBER_LEVEL) {
                    isComplted = true;
                }
            }
        }, this) : false;
        return isComplted;
    }

    activityLevels = {
        "COUNCIL_ACTIVITY_LEVEL": "Currently under Panel review",
        "CLUB_MEMBER_ACTIVITY_LEVEL": "In Progress",
        "CLUB_PRESIDENT_ACTIVITY_LEVEL": "Currently under Club President review"
    }

    render() {

        const attachFiles = this.state.imageList.map((attachment, index) => {
            if (attachment.type.split("/")[0] == "image") {
                const imgId = "img-"+index;
                Util.displayImageFromFile(attachment, imgId);
                return <div key={index} className="image-container">
                            <Icon className="image-close" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>cancel</Icon>
                            <img id={imgId} src=""/>
                        </div>
            } else {
                return <div key={index} className="image-container other-files">
                            <Icon className="image-close" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>cancel</Icon>
                            <Icon>insert_drive_file</Icon>
                        </div>
            }
        });

        const comments = this.state.commentsList.map((comment, index) => {
            return <CommentItem key={index} commentItem={comment}/>
        });

        const assigneesChips = (this.props.activityDetails.activityAssignees) ? this.props.activityDetails.activityAssignees.map((assignee, index) => {
            const imgUrl = (assignee.userId.avatar) ? Util.getFullImageUrl(assignee.userId.avatar) : "../../../../../resources/images/img/user-avatar.png"
            return <Chip
                        key={index}
                        className="chip-item"
                        avatar={<Avatar src={imgUrl}></Avatar>}
                        label={assignee.userId.fullname}
                        title={assignee.userId.username}
                    />
        }) : false;
        
        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="activity-user-dialog-container">
                <DialogContent>
                    <div className="activity-user-header-container">
                        <div className="row">
                            <div className="col-md-4 activity-user-header-section">
                                <div className="section-heading">
                                    FOCUS AREA
                                </div>
                                <div className="section-content">
                                    {this.props.activityDetails.focusArea ? this.props.activityDetails.focusArea.title : ""}
                                </div>
                            </div>
                            <div className="col-md-4 activity-user-header-section text-md-center">
                                <div className="section-heading">
                                    DIFFICULTY
                                </div>
                                <div className="section-content">
                                    {this.props.activityDetails.difficulty}
                                </div>
                            </div>
                            <div className="col-md-4 activity-user-header-section text-md-right">
                                <div className="section-heading">
                                    ACTIVITY STATUS
                                </div>
                                <div className="section-content">
                                    {this.props.activityDetails.status || "In Progress"}
                                    {/* <div className="section-content-sub">({this.activityLevels[this.props.activityDetails.activityLevel] || "Under Process"})</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dialog-divider-horizontal"></div>
                    <div className="content-container">
                        <div className="activity-user-detail-container row">
                            <div className="activity-content-wrapper col-md-9">
                                <div className="row">
                                    <div className="col-md-12 activity-user-main-data">
                                        <div className="section-heading activity-user-title">
                                            {this.props.activityDetails.title}
                                        </div>
                                        {
                                            this.props.activityDetails.year ?
                                                <div className="section-content activity-user-date">
                                                    Financial year {this.props.activityDetails.year}
                                                </div>
                                            : 
                                                <div className="section-content activity-user-date">
                                                    Assigned on {Util.getDateStringFromTimestamp(this.props.activityDetails.assignedOn)}
                                                </div>
                                        }
                                        <div className="section-content activity-user-description">
                                            {this.props.activityDetails.description}
                                        </div>
                                    </div>
                                </div>
                                {this.getActionContainer()}
                                {this.state.proofContainer &&
                                    <div className="proof-container">
                                        <div className="row flex-2">
                                            <div className="col-md-12 ">
                                                <TextField
                                                    id="comment" 
                                                    label="Comment" 
                                                    margin="normal"
                                                    className="input-field"
                                                    value= {this.state.comment}
                                                    onChange = {(e) => {
                                                        this.setState({comment: e.target.value});
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row flex-1">
                                            <div className="col-md-12 ">
                                                <input id="file-image" multiple type="file" onChange={(e) => {
                                                        this.onAttachmentFileChange(e);
                                                }}/>
                                                <label htmlFor="file-image">
                                                    <div className="select-file-tile">
                                                        <Icon>attach_file</Icon>
                                                    </div>
                                                </label>
                                                
                                            </div>
                                        </div>
                                        <div className="row flex-2">
                                            <div className="col-md-12  image-list-wrapper">
                                                {attachFiles}
                                            </div>
                                        </div>
                                        <div className="row flex-1">
                                            <div className="col-md-12  action-container">
                                                <Button raised color="primary" onClick={this.onSubmitActivity.bind(this)}>SUBMIT</Button>
                                            </div>
                                        </div>
                                    </div>
                                }
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
                                            {(this.props.activityDetails.commentsCount > 2 && !this.state.fullCommentLoaded) && 
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
                            <div className="activity-extra-details-wrapper col-md-3">
                                <div className="points-wrapper activity-detail">
                                    <div className="points-container" title="Member Points">
                                        <Icon className="points-icon">person</Icon>
                                        <div className="points-value">
                                            {this.props.activityDetails.memberPoint}
                                        </div>
                                    </div>
                                    <div className="points-container activity-detail" title="Club Points">
                                        <Icon className="points-icon">store</Icon>
                                        <div className="points-value">
                                            {this.props.activityDetails.clubPoint}
                                        </div>
                                    </div>
                                </div>
                                {
                                    (this.props.activityDetails.activityAssignees &&
                                            this.props.activityDetails.activityAssignees.length > 0) &&
                                            <div className="assignees-list activity-detail">
                                                <div className="section-title">Assignee(s)</div>
                                                <div className="chips-container custom-scroll">
                                                    {assigneesChips}
                                                </div>
                                            </div>
                                }
                                <div className="activity-detail behaviour-container">
                                    {
                                        (this.props.activityDetails.isReward === true || this.props.activityDetails.isReward === false) &&
                                            <div className="behaviour">
                                                <Icon>redeem</Icon>
                                                {
                                                    (this.props.activityDetails.isReward) ? (
                                                        <div className="behaviour-text">This Is A Reward Type</div>
                                                    ) : (
                                                        <div className="behaviour-text">Not A Reward Type</div>
                                                    )
                                                }
                                            </div>
                                    }
                                    {
                                        (this.props.activityDetails.selfAssignable === true || this.props.activityDetails.selfAssignable === false) &&
                                            <div className="behaviour">
                                                <Icon>streetview</Icon>
                                                {
                                                    (this.props.activityDetails.selfAssignable) ? (
                                                        <div className="behaviour-text">This Is Self Assignable</div>
                                                    ) : (
                                                        <div className="behaviour-text">Not Self Assignable</div>
                                                    )
                                                }
                                            </div>
                                    }
                                </div>
                                {
                                    (this.props.activityDetails.createdBy) &&
                                    <div className="activity-detail created-container">
                                        <div className="section-title">Assigned By</div>
                                        <div className="created-by-wrapper">
                                            <Chip 
                                                className="created-by-chip"
                                                avatar={<Avatar src={Util.getFullImageUrl(this.props.activityDetails.createdBy.avatar)}></Avatar>}
                                                label= {this.props.activityDetails.createdBy.fullname}
                                                title={this.props.activityDetails.createdBy.username}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onOK.bind(this)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    pushMoreComments(comments) {
        if (comments && comments.length > 0) {
            const fullComment = this.state.commentsList.concat(comments);
            let fullCommentLoaded = false;
            if (fullComment.length >= this.props.activityDetails.commentsCount) {
                fullCommentLoaded = true;
            }
            this.setState({
                ...this.state,
                commentsList: fullComment,
                fullCommentLoaded: fullCommentLoaded
            });
        }
    }

    processOnCommentResponse(commentValue, id) {
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
    }

    postCommentTask(commentValue, activityDetails) {
        if (commentValue.trim()) {
            const commentRequest = {
                value: commentValue,
                commentId: activityDetails.commentId
            };
            ActivitiesUserService.postComment(commentRequest)
                .then(data => {
                    this.processOnCommentResponse(commentValue, activityDetails.id);
                })
                .catch(error => {
                    riverToast.show(error.status_message || "Something went wrong while posting comment");
                })
        }
        this.setState({
            ...this.state,
            commentValue: ""
        });
    }

    handleOnComment(event) {
        if(event.key == 'Enter'){
            this.postCommentTask(this.state.commentValue, this.props.activityDetails);
        }
    }

    toggleLoadCommentLoader(value) {
        this.setState({
            ...this.state,
            commentPreloader: value
        });
    }

    loadMoreComments() {
        if (this.props.activityDetails && this.props.activityDetails.commentId) {
            this.toggleLoadCommentLoader(true);
            this.commentSkipCount = this.state.commentsList.length;
            ActivitiesUserService.loadMoreComments(this.props.activityDetails.commentId, this.commentSkipCount, this.commentSize)
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

    getTimeString(fromDate, toDate) {
        return moment.unix(fromDate/1000).format("DD MMM YYYY") + " to " + moment.unix(toDate/1000).format("DD MMM YYYY");
    }

    getActionContainer() {
        let actionContainer;
        // if (this.state.isCompleted && this.props.activityDetails.workflowStatus == "live") {
        //     actionContainer = <div className="row">
        //         <div className="col-md-12 ">
        //             <div className="activity-status-container">
        //                 <div className="status-text-title">Activity submitted!</div>
        //                 <div className="status-text-desc">Activity is currently under <b>{this.getActivityLevel()}</b></div>
        //             </div>
        //         </div>
        //     </div>;
        // } else if (this.state.isCompleted && this.props.activityDetails.workflowStatus == "completed") {
        //     actionContainer = <div className="row">
        //         <div className="col-md-12 ">
        //             <div className="activity-status-container">
        //                 <div className="status-text-title">Points Awarded</div>
        //                 <div className="points-awarded-wrapper">
        //                     <div className="title">Club Points</div>
        //                     <div className="value">{this.props.activityDetails.activityAssignees[0].clubPoints}</div>
        //                 </div>
        //                 <div className="points-awarded-wrapper">
        //                     <div className="title">Member Points</div>
        //                     <div className="value">{this.props.activityDetails.activityAssignees[0].memberPoints}</div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>;
        // } else {
            if (!this.props.activityDetails.userDone && this.state.doneBtn){
                actionContainer = <div className="row">
                    <div className="col-md-12 ">
                        <Button raised color="primary" onClick={this.onDoneClick.bind(this)}>I have done it</Button>
                    </div>
                </div>;
            } else if (this.props.activityDetails.userDone && this.props.activityDetails.status == 'ASSIGNED'){
                actionContainer =   <div className="row">
                                        <div className="col-md-12 ">
                                            <div className="activity-status-container">
                                                <div className="status-text-title">Activity submitted!</div>
                                                <div className="status-text-desc">Activity is currently under <b>Club President</b></div>
                                            </div>
                                        </div>
                                    </div>
            } else if(this.props.activityDetails.userDone && this.props.activityDetails.status == 'COUNCIL_ACCEPTED') {
                actionContainer =   <div className="row">
                                        <div className="col-md-12 ">
                                            <div className="activity-status-container">
                                                <div className="status-text-title">Panel accepted activity</div>
                                                <div className="status-text-title">Points Awarded</div>
                                                {
                                                    this.props.activityDetails.earnedClubPoint &&
                                                        <div className="points-awarded-wrapper">
                                                            <div className="title">Club Points</div>
                                                            <div className="value">{this.props.activityDetails.earnedClubPoint}</div>
                                                        </div>
                                                }
                                                <div className="points-awarded-wrapper">
                                                    <div className="title">Member Points</div>
                                                    <div className="value">{this.props.activityDetails.earnedMemberPoint}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>;
            } else if(this.props.activityDetails.userDone && this.props.activityDetails.status == 'COUNCIL_REJECTED') {
                actionContainer =   <div className="row">
                                        <div className="col-md-12 ">
                                            <div className="activity-status-container">
                                                <div className="status-text-title">Panel rejected activity</div>
                                            </div>
                                        </div>
                                    </div>;
            } else {
                actionContainer = false;
            }
        // }

        return actionContainer;
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
        this.setState({ doneBtn: true });
    }

    onOK(){
        this.handleRequestClose(); 
    }

    onDoneClick() {
        this.setState({proofContainer: true,
                        doneBtn: false});
    }


    setBase64ImageArray(imageArray) {
        const imageStringArray = [];
        this.imageBase64ArrayList = [];
        imageArray.forEach((image, index) => {
            Util.base64ImageFromFile(image)
            .then(result => {
                this.imageBase64ArrayList.push({type: image.type, name: image.name, content:result});
            });
        }, this);
    }

    onAttachmentFileChange(event) {
        const attachmentFiles = Array.from(event.target.files);
        let selectedImageFiles = this.state.imageList;
        selectedImageFiles = selectedImageFiles.concat(attachmentFiles);
        this.setBase64ImageArray(selectedImageFiles);
        this.setState({imageList: selectedImageFiles});
    }

    onRemoveAttachment(attachment, index) {
        let imageFiles = this.state.imageList;
        imageFiles.splice(index, 1);
        this.imageBase64ArrayList.splice(index, 1);
        this.setState({imageFiles: imageFiles});
    }

    getActivitySubmitRequest() {
        const request = {
            comment: this.state.comment,
            images: this.imageBase64ArrayList
        };

        return request;
    }

    onSubmitActivity() {
        const request = this.getActivitySubmitRequest();
        ActivitiesUserService.completeActivity(this.props.activityDetails.activityId, this.props.activityDetails.assigneeId, request)
            .then(data => {
                riverToast.show("Activity has been completed");
                this.props.onRequestClose(false, true);
                this.setState({ proofContainer: false });
            })
            .catch(error => {
                riverToast.show(error.status_messgae || "Something went wrong while completing activity");
            })
    }
}