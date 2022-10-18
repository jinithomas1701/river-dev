import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import AddIcon from 'material-ui-icons/Add';
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import moment from 'moment';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Slider from 'react-rangeslider'
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
  } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';

//root component
import { Root } from "../../../Layout/Root";

// custom component
import {CommentItem} from '../../../Common/CommentItem/CommentItem';
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { SelectBox } from "../../../Common/SelectBox/SelectBox";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {Util} from "../../../../Util/util";
import ActivityUserStatusModal from './ActivityUserStatusModal/ActivityUserStatusModal';
import ActivityUserDetailDialog from "./ActivityUserDetailDialog/ActivityUserDetailDialog";

import { fieldChange, setActivityDetail, loadActivityMasterList, setAssigneeUserSelected, setReviewerUserSearchResult, setReviewerUserSelected, changeSelectedActivity, setAssigneeUserSearchResult, clearFormFields } from "./ActivityView.action";
import { ActivityViewServices } from "./ActivityView.service";
import './ActivityView.scss';

const mapStateToProps = (state) => {
    return {
        activityDetail: state.ActivityViewReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setActivityDetail: (activity) => {
            dispatch(setActivityDetail(activity));
        },  
        changeSelectedActivity: (activity) => {
            dispatch(changeSelectedActivity(activity));
        },
        clearFormFields: () => {
            dispatch(clearFormFields());
        },
        setAssigneeUserSearchResult: (result) => {
            dispatch(setAssigneeUserSearchResult(result));
        },
        setAssigneeUserSelected: (user) => {
            dispatch(setAssigneeUserSelected(user));
        },
        setReviewerUserSearchResult: (result) => {
            dispatch(setReviewerUserSearchResult(result));
        },
        setReviewerUserSelected: (user) => {
            dispatch(setReviewerUserSelected(user));
        },
    }
}

const MEMBER_LEVEL = "CLUB_MEMBER_ACTIVITY_LEVEL";
const PRESIDENT_LEVEL = "CLUB_PRESIDENT_ACTIVITY_LEVEL";
const COUNCIL_LEVEL = "COUNCIL_ACTIVITY_LEVEL";
const USER_PRESIDENT = "CLUB_PRESIDENT";
const USER_COUNCIL_MEMBER = "COUNCIL_MEMBER";
const WORKFLOW_COMPLETED = "completed";
const WORKFLOW_LIVE = "live";

const PRIVILEGE_FINISH_ACTIVITY = "FINISH_ACTIVITY_BY_CLUB_PRESIDENT";
const PRIVILEGE_REJECT_ACTIVITY = "PRIVILEGE_REJECT_ACTIVITY_BY_CLUB_PRESIDENT";

class ActivityView extends React.Component {

    state = {
        pointPercentageValues: [],
        statusModal: false,
        isCouncilApprove: false,
        approveRequest: {},
        selectedIndex: -1,
        selectedUser: {},
        circularPreLoadeder: false,
        meetingInviteesPreloader: false,
        meetingAttendeesPreloader: false,
        showAssigneeSearchPreloader: false,
        showReviewerSearchPreloader: false,
        commentsList: [],
        commentValue: "",
        commentPreloader: false,
        fullCommentLoaded: false,
        detailDialog: false,
        activityUserDetail: ""
    };
    commentSkipCount = 0;
    commentSize = 5;
    currentUser = Util.getLoggedInUserDetails();
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.match.params.activityId) {
            this.activityId = this.props.match.params.activityId;
            this.loadActivityMasterDetails(this.activityId);
        }
    }

    
    getMemberListView() {
        let members;
        const activityLevel = this.props.activityDetail.activityDetail.activityLevel;
        const why = this.props.activityDetail.activityDetail.why;
        const workflowStatus = this.props.activityDetail.activityDetail.workflowStatus;
        
        if (this.props.activityDetail.activityDetail.activityAssignees) {
            members = this.props.activityDetail.activityDetail.activityAssignees.map((user, index) => {
                let memberCollectionObj;
                
                if (workflowStatus == WORKFLOW_LIVE) {
                    if (activityLevel == PRESIDENT_LEVEL && why == USER_PRESIDENT) {
                        memberCollectionObj = <div key={index} className="assignee-tile">
                            <div className="image-container">
                                {user.userId.avatar ?
                                    (
                                        <img src={Util.getFullImageUrl(user.userId.avatar)} />
                                    ):(
                                        <img src="../../../../../resources/images/img/user-avatar.png" />
                                    )
                                }
                            </div>
                            <div className="assignee-content-container">
                                <div className="name">
                                    {user.userId.fullname}
                                </div>
                                <div className="email">
                                    {user.userId.username}
                                </div>
                                <div className="completion-status">
                                    {user.activityLevel == MEMBER_LEVEL ? "WAITING TO GET COMPLETED" : "COMPLETED" }
                                </div>
                                {
                                    ((user.images && user.images.length > 0) || user.userComment) &&
                                    <div className="proof-show-btn-container">
                                            <Button
                                                className="proof-show-btn"
                                                raised
                                                color = "primary"
                                                onClick={this.showDetailsDialog.bind(this, user)}
                                            >
                                                Show Details
                                            </Button>
                                        </div>
                                }
                            </div>
                            <div className="tile-action-container">
                                <Icon onClick={this.onRemovingActivityUser.bind(this, user, index)}>clear</Icon>
                            </div>
                        </div>
                    } else if ((activityLevel == COUNCIL_LEVEL && why == USER_PRESIDENT) || activityLevel == MEMBER_LEVEL) {
                        memberCollectionObj = <div key={index} className="assignee-tile">
                            <div className="image-container">
                                {user.userId.avatar ?
                                    (
                                        <img src={Util.getFullImageUrl(user.userId.avatar)} />
                                    ):(
                                        <img src="../../../../../resources/images/img/user-avatar.png" />
                                    )
                                }
                            </div>
                            <div className="assignee-content-container">
                                <div className="name">
                                    {user.userId.fullname}
                                </div>
                                <div className="email">
                                    {user.userId.username}
                                </div>
                                <div className="completion-status">
                                    {user.activityLevel == MEMBER_LEVEL ? "WAITING TO GET COMPLETED" : "COMPLETED" }
                                </div>
                                {
                                    ((user.images && user.images.length > 0) || user.userComment) &&
                                    <div className="proof-show-btn-container">
                                            <Button
                                                className="proof-show-btn"
                                                raised
                                                color = "primary"
                                                onClick={this.showDetailsDialog.bind(this, user)}
                                                >
                                                Show Details
                                            </Button>
                                        </div>
                                }
                            </div>
                        </div>
                    } else if (activityLevel == COUNCIL_LEVEL && why == USER_COUNCIL_MEMBER ) {
                        memberCollectionObj = <div key={index} className="assignee-points-detail-tile">
                            <div className="point-display">{typeof this.state.pointPercentageValues[index] != "undefined" ? this.state.pointPercentageValues[index] : 100}%</div>
                            <div className="image-container">
                                {user.userId.avatar ?
                                    (
                                        <img src={Util.getFullImageUrl(user.userId.avatar)} />
                                    ):(
                                        <img src="../../../../../resources/images/img/user-avatar.png" />
                                    )
                                }
                            </div>
                            <div className="point-content-container">
                                <div className="assignee-content-container">
                                <div className="name">
                                    {user.userId.fullname}
                                </div>
                                <div className="email">
                                    {user.userId.username}
                                </div>
                                <div className="completion-status">
                                    {user.activityLevel == MEMBER_LEVEL ? "WAITING TO GET COMPLETED" : "COMPLETED" }
                                </div>
                                {
                                    ((user.images && user.images.length > 0) || user.userComment) &&
                                        <div className="proof-show-btn-container">
                                            <Button
                                                className="proof-show-btn"
                                                raised
                                                color = "primary"
                                                onClick={this.showDetailsDialog.bind(this, user)}
                                            >
                                                Show Details
                                            </Button>
                                        </div>
                                }
                                </div>
                                <div className="point-slider-title">
                                    Select Point Range
                                </div>
                                <div className="points-container">
                                    <div className="limit left">0%</div>
                                    <Slider
                                        min={0}
                                        max={100}
                                        value={typeof this.state.pointPercentageValues[index] != "undefined" ? this.state.pointPercentageValues[index] : 100}
                                        orientation='horizontal'
                                        onChange={this.handleChange.bind(this, index)}
                                        />
                                    <div className="limit right">100%</div>
                                </div>
                            </div>
                        </div>
                    }
                } else if (workflowStatus == WORKFLOW_COMPLETED) {
                    memberCollectionObj = <div key={index} className="assignee-points-detail-tile">
                        <div className="image-container">
                            {user.userId.avatar ?
                                (
                                    <img src={Util.getFullImageUrl(user.userId.avatar)} />
                                ):(
                                    <img src="../../../../../resources/images/img/user-avatar.png" />
                                )
                            }
                        </div>
                        <div className="point-content-container">
                            <div className="assignee-content-container">
                                <div className="name">
                                    {user.userId.fullname}
                                </div>
                                <div className="email">
                                    {user.userId.username}
                                </div>
                                <div className="completion-status">
                                    {user.activityLevel == MEMBER_LEVEL ? "WAITING TO GET COMPLETED" : "COMPLETED" }
                                </div>
                                
                            </div>
                            <div className="point-display-container">
                                <div className="point-wrapper">
                                    <span className="title">Member Point : </span>
                                    <span className="value">{user.memberPoints}</span>
                                </div>
                                <div className="point-wrapper">
                                    <span className="title">Club Point : </span>
                                    <span className="value">{user.clubPoints}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                

                return memberCollectionObj;
                
            });
        }
        return members;
    }
    
    activityLevels = {
        "COUNCIL_ACTIVITY_LEVEL": "Currently under Council review",
        "CLUB_MEMBER_ACTIVITY_LEVEL": "In Progress",
        "CLUB_PRESIDENT_ACTIVITY_LEVEL": "Currently under Club President review"
    }

    handleChange = (index, value) => {
        const pointRange = this.state.pointPercentageValues;
        pointRange[index] = value;
        this.setState({
            ...this.state,
            pointPercentageValues: pointRange
        })
      }

    render() {
        let assignedUsers = this.getMemberListView();
        const comments = this.state.commentsList.map((comment, index) => {
            return <CommentItem key={index} commentItem={comment}/>
        });

        const assigneesChips = (this.props.activityDetail.activityDetail.activityAssignees) ? this.props.activityDetail.activityDetail.activityAssignees.map((assignee, index) => {
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
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Activity" />
                    <div className="row activity-view">
                        <div className="col-md-12">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-4 header-action-container">
                                                    <div className="behaviour-section">
                                                        <div className="behaviour">
                                                            <Icon>redeem</Icon>
                                                            {
                                                                (this.props.activityDetail.activityDetail.activityMaster && this.props.activityDetail.activityDetail.activityMaster.isRewards) ? (
                                                                    <div className="behaviour-text">This Is A Reward Type</div>
                                                                ) : (
                                                                    <div className="behaviour-text">Not A Reward Type</div>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="behaviour">
                                                            <Icon>streetview</Icon>
                                                            {
                                                                (this.props.activityDetail.activityDetail.activityMaster && this.props.activityDetail.activityDetail.activityMaster.isSelfAssign) ? (
                                                                    <div className="behaviour-text">This Is Self Assignable</div>
                                                                ) : (
                                                                    <div className="behaviour-text">Not Self Assignable</div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-md-4">
                                                    <div className="large-icon-container">
                                                        <Icon className="large-icon">directions_walk</Icon>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="point-container">
                                                        <div className="point-wrap club">
                                                            <span className="point-wrap-title">Club Points:</span><span className="point">{this.props.activityDetail.activityDetail.clubPoints}</span>
                                                        </div>
                                                        <div className="point-wrap member">
                                                            <span className="point-wrap-title">Member Points:</span><span className="point">{this.props.activityDetail.activityDetail.memberPoints}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="page-divider"></div>
                                <div className="page-status-section">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="status-content">
                                                <div className="status-title">ACTIVITY TYPE</div>
                                                <div className="status-value">{this.props.activityDetail.activityDetail.activityMaster ? this.props.activityDetail.activityDetail.activityMaster.category.title:""}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 justify-content-center text-center">
                                            {
                                                (this.props.activityDetail.activityDetail.council) &&
                                                    <div>
                                                        <div className="status-title">PANEL</div>
                                                        <div className="status-value">
                                                            {this.props.activityDetail.activityDetail.council.name}
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                        <div className="col-md-4 text-md-right">
                                            {
                                                (this.props.activityDetail.activityDetail.actionStatus) &&
                                                    <div>
                                                        <div className="status-title">STATUS</div>
                                                        <div className="status-value">
                                                            {this.props.activityDetail.activityDetail.actionStatus.toUpperCase()}
                                                            {
                                                                (this.props.activityDetail.activityDetail.activityLevel) &&
                                                                    <div className="status-value-sub">
                                                                        ({this.activityLevels[this.props.activityDetail.activityDetail.activityLevel] || "Under Process"})
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="page-divider"></div>                                
                                <div className="page-content-section">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="section-content">
                                                <div className="sub-title activity-title">{this.props.activityDetail.activityDetail.title}</div>
                                                <div className="section-value time-period">From {this.getTimeString(this.props.activityDetail.activityDetail.fromDate, this.props.activityDetail.activityDetail.toDate)}</div>
                                                <div className="section-value description">{this.props.activityDetail.activityDetail.description}</div>
                                            </div>
                                            {
                                                ((this.props.activityDetail.activityDetail.activityLevel == PRESIDENT_LEVEL && this.props.activityDetail.activityDetail.why == USER_PRESIDENT) ||
                                                    (this.props.activityDetail.activityDetail.activityLevel == COUNCIL_LEVEL && this.props.activityDetail.activityDetail.why == USER_COUNCIL_MEMBER && this.props.activityDetail.activityDetail.workflowStatus == WORKFLOW_LIVE) || 
                                                        (Util.hasPrivilage(PRIVILEGE_FINISH_ACTIVITY) && this.props.activityDetail.activityDetail.activityLevel == MEMBER_LEVEL)) &&
                                                            <div className="section-title">Actions</div>
                                            }
                                            <div className="assignee-approve-container">
                                                {(this.props.activityDetail.activityDetail.activityLevel == PRESIDENT_LEVEL && this.props.activityDetail.activityDetail.why == USER_PRESIDENT) &&
                                                    <div>
                                                        <Button raised color="primary" className="council-action-btn" onClick={this.onApprove.bind(this)}>APPROVE</Button>
                                                        {
                                                            (Util.hasPrivilage(PRIVILEGE_REJECT_ACTIVITY)) &&
                                                                <Button raised color="primary" className="council-action-btn" onClick={this.onReject.bind(this)}>REJECT</Button>
                                                        }
                                                    </div>
                                                }
                                                {(this.props.activityDetail.activityDetail.activityLevel == COUNCIL_LEVEL &&
                                                    this.props.activityDetail.activityDetail.why == USER_COUNCIL_MEMBER &&
                                                        this.props.activityDetail.activityDetail.workflowStatus == WORKFLOW_LIVE) &&
                                                    <div>
                                                        <Button raised color="primary" className="council-action-btn" onClick={this.onApproveCouncil.bind(this)}>APPROVE</Button>
                                                        <Button raised color="accent" className="council-action-btn" onClick={this.onRejectCouncil.bind(this)}>REJECT</Button>
                                                    </div>
                                                }
                                                {Util.hasPrivilage(PRIVILEGE_FINISH_ACTIVITY) &&
                                                    this.props.activityDetail.activityDetail.activityLevel == MEMBER_LEVEL &&
                                                        <Button raised color="primary" onClick={this.onFinishingActivity.bind(this)}>FINISH ACTIVITY</Button>
                                                }
                                            </div>
                                            <div className="section-action-container">
                                                {assignedUsers}
                                            </div>

                                        </div>
                                        <div className="col-md-4">
                                            <div className="activity-extra-info-wrapper">
                                                {
                                                    (this.props.activityDetail.activityDetail.activityAssignees &&
                                                        this.props.activityDetail.activityDetail.activityAssignees.length > 0) &&
                                                        <div>
                                                            <div className="section-title">Assignee(s)</div>
                                                            <div className="activity-extra-info chips-container custom-scroll">
                                                                {assigneesChips}
                                                            </div>
                                                        </div>
                                                }
                                                {
                                                    (this.props.activityDetail.activityDetail.createdBy) &&
                                                    <div>
                                                        <div className="section-title">Assigned By</div>
                                                        <div className="created-by-wrapper">
                                                            <Chip 
                                                                className="created-by-chip"
                                                                avatar={<Avatar src={Util.getFullImageUrl(this.props.activityDetail.activityDetail.createdBy.avatar)}></Avatar>}
                                                                label= {this.props.activityDetail.activityDetail.createdBy.fullname}
                                                                title={this.props.activityDetail.activityDetail.createdBy.username}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
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
                                            {(this.props.activityDetail.activityDetail.commentsCount > 2 && !this.state.fullCommentLoaded) && 
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
                        </div>
                    </div>
                </MainContainer>
                <ActivityUserStatusModal 
                    open={this.state.statusModal}
                    user={this.state.selectedUser}
                    index={this.state.selectedIndex}
                    isCouncilApprove={this.state.isCouncilApprove}
                    approveRequest={this.state.approveRequest}
                    activityDetails={this.props.activityDetail.activityDetail} 
                    onRequestClose={this.statusDialogVisibility.bind(this)}/>
                <ActivityUserDetailDialog
                    open={this.state.detailDialog}
                    activityUserDetail={this.state.activityUserDetail}
                    onRequestCloseDetailDialog={this.handleCloseDetailDialog.bind(this)}/>
			</Root>
        );
    }

    pushMoreComments(comments) {
        if (comments && comments.length > 0) {
            const fullComment = this.state.commentsList.concat(comments);
            let fullCommentLoaded = false;
            if (fullComment.length >= this.props.activityDetail.activityDetail.commentsCount) {
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
            ActivityViewServices.postComment(commentRequest)
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
            this.postCommentTask(this.state.commentValue, this.props.activityDetail.activityDetail);
        }
    }

    toggleLoadCommentLoader(value) {
        this.setState({
            ...this.state,
            commentPreloader: value
        });
    }

    loadMoreComments() {
        if (this.props.activityDetail.activityDetail && this.props.activityDetail.activityDetail.commentId) {
            this.toggleLoadCommentLoader(true);
            this.commentSkipCount = this.state.commentsList.length;
            ActivityViewServices.loadMoreComments(this.props.activityDetail.activityDetail.commentId, this.commentSkipCount, this.commentSize)
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

    onRemovingActivityUser(userObj, index) {
        this.setState({
            ...this.state,
            selectedUser: userObj, 
            selectedIndex: index,
            isCouncilApprove: false
        });
        this.setState({statusModal: true});
    }

    statusDialogVisibility(visibility, reloadFlag) {
        this.setState({statusModal: visibility});
        if (reloadFlag) {
            this.loadActivityMasterDetails(this.activityId);
        }
    }

    showDetailsDialog(user) {
        this.setState({
                detailDialog: true,
                activityUserDetail: user
            });
    }

    handleCloseDetailDialog() {
        this.setState({
            detailDialog: false,
            activityUserDetail: ""
        });
    }

    getTimeString(fromDate, toDate) {
        return moment.unix(fromDate/1000).format("DD MMM YYYY") + " to " + moment.unix(toDate/1000).format("DD MMM YYYY");
    }

    getAssignedUsers(assignees) {
        const assignedUsers = [];
        assignees.forEach(function(assignee, index) {
            assignedUsers.push(assignee.userId);
        }, this);

        return assignedUsers;
    }

    processLoadedActivity(activity) {
        const assignedUsers = this.getAssignedUsers(activity.activityAssignees);
        this.props.setAssigneeUserSelected(assignedUsers);
        this.props.setActivityDetail(activity);
        let fullCommentLoaded = false;
        if (activity.comments.length >= activity.commentsCount) {
            fullCommentLoaded = true;
        }
        
        this.setState({
            ...this.state,
            fullCommentLoaded: fullCommentLoaded,
            commentsList: activity.comments || []
        });
    }

    loadActivityMasterDetails(activityId) {
        ActivityViewServices.getActivity(activityId)
        .then((data) => {
            this.processLoadedActivity(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong");
        })
    }

    onFinishingActivity() {
        const activityId = this.activityId;
        ActivityViewServices.finishActivity(activityId)
            .then(data => {
                this.loadActivityMasterDetails(this.activityId);
                riverToast.show("Activity successfully finished");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while finishing activity");
            });
    }

    getApproveRequest() {
        const request = {
            userId: []
        };

        this.props.activityDetail.activityDetail.activityAssignees.forEach((assignee, index) => {
            if (assignee.activityLevel == PRESIDENT_LEVEL) {
                request.userId.push(assignee.userId.id);
            }
        }, this);

        return request;
    }

    hasIncompleteActivity() {
        let hasIncomplete = false;
        this.props.activityDetail.activityDetail.activityAssignees.forEach((assignee, index) => {
            if (assignee.activityLevel == MEMBER_LEVEL) {
                hasIncomplete = true;
            }
        }, this);

        return hasIncomplete;
    }

    getUserObject() {
        const userObjList = [];
        this.props.activityDetail.activityDetail.activityAssignees.forEach((assignee, index) => {
            userObjList.push({
                userId: assignee.userId.id,
                percentage: typeof this.state.pointPercentageValues[index] != "undefined" ? this.state.pointPercentageValues[index] : 100
            });
        }, this);

        return userObjList;
    }

    getApproveRejectCouncil(isApprove) {
        return {
            "approve":isApprove,
            "comment":"",
            "userObject": this.getUserObject()
        };
    }

    onApproveCouncil() {
        if (confirm("Do you want to approve these memebers ?")) {
            const approveRequest = this.getApproveRejectCouncil(true);
            ActivityViewServices.approveCouncil(this.activityId, approveRequest)
                .then(data => {
                    this.loadActivityMasterDetails(this.activityId);
                    riverToast.show("Activity has approved");
                })
                .catch(error => {
                    riverToast.show(error.status_message || "Spmething went worng while approving activity");
                });
        }
    }

    onRejectCouncil() {
        if (confirm("Do you want to reject these memebers ?")) {
            this.setState({
                ...this.state,
                isCouncilApprove: true,
                approveRequest: this.getApproveRejectCouncil(false)
            });
            this.setState({statusModal: true});
        }
    }

    onReject() {
        if (confirm("Do you want to reject this activity")) {
            let comment = prompt("Comment the reason for rejection");

            ActivityViewServices.rejectActivity(this.activityId, comment)
                    .then(data => {
                        riverToast.show("Activity has been rejected successfully.");
                        this.loadActivityMasterDetails(this.activityId);
                    })
                    .catch(data => {
                        riverToast.show(error.status_message || "Something went wrong while rejecting activity");
                    });
        }
    }

    onApprove() {
        if (confirm("Do you want to approve this activity")) {
            if (!this.hasIncompleteActivity()) {
                const request = this.getApproveRequest();
                ActivityViewServices.approveAssignees(this.activityId, request)
                    .then(data => {
                        riverToast.show("Activity has been forwarded to council");
                        this.loadActivityMasterDetails(this.activityId);
                    })
                    .catch(data => {
                        riverToast.show(error.status_message || "Something went wrong while approving activity");
                    });
            } else {
                riverToast.show("Incomplete activities cannot approve");
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityView)