import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';
import Dock from 'react-dock';
import Datetime from 'react-datetime';

import {Util} from "../../../../../Util/util";
import ClubButton from '../../../../Common/ClubButton/ClubButton';
import ClubInput from '../../../../Common/ClubInput/ClubInput';
import {StarRating} from '../../../../Common/StarRating/StarRating';
import AdminAssignedDetailDock from './AdminAssignedDetailDock/AdminAssignedDetailDock';
import AdminCustomizePointsDialog from './AdminCustomizePointsDialog/AdminCustomizePointsDialog';

import AdminActivityTileService from './AdminActivityTile.service';

import './AdminActivityTile.scss';
import index from 'jss';
import { riverToast } from '../../../../Common/Toast/Toast';
import { AdminDashboardService } from '../AdminDashboard.service';
import ClubSelect from '../../../../Common/ClubSelect/ClubSelect';

export default class AdminActivityTile extends Component {
    constructor(props){
        super(props);
        this.state = {
            isApproveClick: false,
            isRejectClick: false,
            isAssignedDockVisible: false,
            comment: '',
            ratingValue: null,
            assignedActivityDetail: {},
            activityDiscussions: [],
            disscussionSubmitProgress: false,
            isCustomizePointDialogOpen : false,
            pointMatrix: {},
            changedPointMatrix: {},
            assigneesList: [],
            claimPeriod: Math.round((new Date()).getTime() / 1000)
        };
        this.shouldUpdate = false;
        this.startDay = moment("20180601T000000");
        this.dateOptions = { 
            placeholder: 'Target Date',
            className:"datetime-input"
        }
    }

    componentDidMount() {
        const {masterActivity, activity} = this.props;
        if (activity) {
            const pointMatrixResponse = {
                clubPoints: [],
                assigneePoints: [],
                justification: ''
            };

            activity.pointMatrix.assignees.forEach(assignee => {
                pointMatrixResponse.assigneePoints.push({
                    id: assignee.id,
                    point: assignee.calculatedPoints
                });
            });
            activity.pointMatrix.clubs.forEach(club => {
                pointMatrixResponse.clubPoints.push({
                    id: club.id,
                    point: club.calculatedPoints
                });
            });
            this.setState({
                ...this.state,
                ratingValue: (activity.currentStarRating && activity.currentStarRating.code) ? Number(activity.currentStarRating.code) : 0,
                selectedCategory: (activity.category && activity.category.code ? activity.category.code: ''),
                changedPointMatrix: pointMatrixResponse
            });
        }
    }

    componentWillReceiveProps(nextProps){
        const pointMatrixResponse = {
            clubPoints: [],
            assigneePoints: [],
            justification: ''
        };

        const data = this.props.activity.pointMatrix;

        data.assignees.forEach(assignee => {
            pointMatrixResponse.assigneePoints.push({
                id: assignee.id,
                point: assignee.calculatedPoints
            });
        });
        data.clubs.forEach(club => {
            pointMatrixResponse.clubPoints.push({
                id: club.id,
                point: club.calculatedPoints
            });
        });
        this.setState({
            changedPointMatrix: pointMatrixResponse,
            pointMatrix: nextProps.activity.pointMatrix
        });

        //update points if filter etc are changed
        if(this.props.activity.id !== nextProps.activity.id){
            const selectedCategory = (nextProps.activity.category && nextProps.activity.category.code ? nextProps.activity.category.code: '');
            this.setState({selectedCategory});
        }

        //date assign
        if(nextProps.activity.submittedClaimPeriod){
            this.setState({
                claimPeriod: nextProps.activity.submittedClaimPeriod / 1000
            });
        }
    }

    /*componentDidUpdate(prevProps, prevState){
        if(this.shouldUpdate){
            this.shouldUpdate = false;
            const pointMatrixResponse = {
                clubPoints: [],
                assigneePoints: [],
                justification: ''
            };

            const data = this.props.activity.pointMatrix;

            data.assignees.forEach(assignee => {
                pointMatrixResponse.assigneePoints.push({
                    id: assignee.id,
                    point: assignee.calculatedPoints
                });
            });
            data.clubs.forEach(club => {
                pointMatrixResponse.clubPoints.push({
                    id: club.id,
                    point: club.calculatedPoints
                });
            });
            this.setState({
                changedPointMatrix: pointMatrixResponse,
            });
        }
    }*/

    getchangedPointMatrix(matrix){
        const assignees = matrix.assigneePoints.map(item => item);
        const clubs = matrix.clubPoints.map(item => item);
    }

    render() {
        const {isApproveClick, isRejectClick, comment, assignedActivityDetail, isCustomizePointDialogOpen} = this.state;
        const {masterActivity, activity} = this.props;
        const adminPrivilige = Util.hasPrivilage('VIEW_ADMIN_DASHBOARD') ? 'VIEW_ADMIN_DASHBOARD' : false;
        //let assigneesList = this.state.assigneesList.length ? this.state.assigneesList : activity.pointMatrix.assignees;
        let assignees;
        let clubs;
        //if (activity && activity.pointMatrix && activity.pointMatrix.assignees && activity.pointMatrix.assignees.length > 0) {
        //    assignees = activity.pointMatrix.assignees.map((assigne, index) => {
        //let assigneesList = (activity.pointMatrix && activity.pointMatrix.assignees.length) ? activity.pointMatrix.assignees : this.state.assigneesList;
        let assigneesList = (this.state.assigneesList && this.state.assigneesList.length) ? this.state.assigneesList : activity.pointMatrix.assignees;
        assignees = assigneesList.map((assigne, index) => {
            return <div className="assignee-chip" key={index}>
                <div className="head">
                    { assigne.status && assigne.status == 'C' ? 
                        <Icon>check</Icon>:
                        <Icon>more_horiz</Icon>
                    }
                </div>
                <div className="body">{assigne.name} (<span>{assigne.calculatedPoints} pts</span>)</div>
            </div>
        });
        //}

        const {pointMatrix} = this.state;
        const isPointCustomizable = this.isCustomizationAvailable();
        const classDockOpen = this.props.selectedTile === activity.id? "open" : "closed";

        return (
            <div className={`assgined-activity-tile admin-activity-tile ${classDockOpen}`}>
                <div className="activity-tile-header">
                    {activity.deletable && adminPrivilige == 'VIEW_ADMIN_DASHBOARD' ?
                        <div className="activity-delete-button" onClick={this.onDeletedActivityClick.bind(this)}>
                            <Icon>cancel</Icon>
                        </div>:''
                    }
                </div>
                <div className="progress-container">
                    <div className="status-progress-wrapper">
                        <div className="status-line"></div>
                        {this.renderAcivityStatus(activity.status)}
                        {/* <div className="status-circle completed">
                            <Icon>check</Icon>
                            <div className="status-text small-text">Assigned</div>
                        </div>
                        <div className="status-circle current">
                            <Icon>more_horiz</Icon>
                            <div className="status-text small-text">Completed</div>
                        </div>
                        <div className="status-circle">
                            <div className="status-text">President Approved</div>
                        </div>
                        <div className="status-circle">
                            <div className="status-text">Panel Approved</div>
                        </div>
                        <div className="status-circle">
                            <div className="status-text">Point Credited</div>
                        </div> */}
                    </div>
                </div>
                <div className="title">{activity.title || ''}</div>
                {activity.description && <div className="desc-container"> 
                    <div className="desc-wrapper">
                        <div className="desc-text">{activity.description ? activity.description.substr(0, 93)+'...' : ''}</div>
                    </div>
                </div>
                }
                <h2 className="ref-title" title="Reference Code">{activity.referenceId}</h2>
                <div className="activity-info-button" >
                    <div title="Details" onClick={this.onAssignedActivityInfoClick.bind(this)} className="label"><Icon>fullscreen</Icon>  More Info</div> <div title="Club Name" className="club-name">{activity.clubName}</div>
                </div>
                {
                    activity.claculatedClaimPeriod && <div className="claimlabel">
                            <b>Claim Period</b><span>{activity.claculatedClaimPeriod}</span>
                        </div>
                }

                <div className="customize-wrapper">
                    {(activity.ratingType == 'S' || activity.ratingType == 'B') && activity.status != 'A' ?
                        <StarRating 
                            isEditable={false} 
                            onChange={this.onRatingChange.bind(this)}
                            className="star-rating" 
                            rating={this.state.ratingValue} 
                            color={"#808080"}
                            size={"1.3rem"}
                            categoriesList={masterActivity.categories}
                            />:''
                    }
                    {(activity.ratingType == 'S' || activity.ratingType == 'B') && activity.status != 'A' ?
                        <div className="info-icon" title={masterActivity.starRatingLabel || ''}>
                            <Icon>help</Icon>
                        </div>:''
                    }
                </div>
                {
                    (activity.ratingType == 'C'|| activity.ratingType == 'B')  &&
                        <div className="title category-text">
                            <span>
                                {masterActivity.categoryLabel || ''}
                            </span>
                        </div>
                } 

                {
                    (activity.ratingType == 'C'|| activity.ratingType == 'B') && <div className="customize-wrapper">
                            <span className="catg-label">{activity.category.label}</span>
                        </div>
                }
                <div className="customize-wrapper">
                    {(activity.status == 'C' && adminPrivilige == 'VIEW_ADMIN_DASHBOARD' && isPointCustomizable) || (activity.status == 'PA' && adminPrivilige == 'ROLE_RIVER_COUNCIL' && isPointCustomizable) ?
                        <div className="link" onClick={this.onCustomizePointDialogClick.bind(this, activity)}>VIEW POINTS
                            {activity.isPointCustomized ?
                                <div className="tag">customized</div>:''
                            }
                        </div>:
                        <div className="link" onClick={this.onCustomizePointDialogClick.bind(this, activity)}>
                        VIEW POINTS 
                        {activity.isPointCustomized ?
                            <div className="tag">customized</div>:''
                        }
                    </div>
                    }
                </div>
                <div className="assignees-wrapper">
                    {assignees}
                </div>
                {/*<div className="action-container">

                    {(isApproveClick || isRejectClick) ?
                        <div className="submit-action-wrapper">
                            {(activity.submittedClaimPeriod && adminPrivilige == 'VIEW_ADMIN_DASHBOARD') && <div className="activity-date">
                                <label><span title="Date/Period on which the activity is actually happened">Claim period</span>
                                    <Datetime
                                        defaultValue={moment()}
                                        isValidDate={this.isDateValid.bind(this)}
                                        dateFormat="YYYY-MM"
                                        timeFormat={false}
                                        inputProps={this.dateOptions}
                                        onChange={this.onClaimPeriodChange.bind(this)}
                                        value={new Date(this.state.claimPeriod * 1000)}
                                        />
                                </label>
                            </div>}
                            <div className="action-wrapper">
                                <ClubInput placeholder="Comment" onChange={(e) => this.handleCommentField(e)} value={comment}/>
                                <IconButton onClick={this.onSubmitComment.bind(this)} color="primary">
                                    <Icon>check</Icon>
                                </IconButton>
                                <IconButton onClick={this.onCancelComment.bind(this)} color="default">
                                    <Icon>clear</Icon>
                                </IconButton>
                            </div>
                        </div>:
                        <div className="action-wrapper">
                        {activity.status == 'C' && adminPrivilige == 'VIEW_ADMIN_DASHBOARD' &&
                            <div className="btn-wrapper">
                                <ClubButton onClick={this.onActionClick.bind(this, 'approve')} className="action-btn" title="APPROVE" color="#22BCAC" textColor="#fff" />
                                <ClubButton onClick={this.onActionClick.bind(this, 'reject')} className="action-btn" title="REJECT" color="#eee" textColor="#666" />
                            </div>
                        }
                        {activity.status == 'PA' && adminPrivilige == 'ROLE_RIVER_COUNCIL' && !activity.approvedByUser &&
                            <div className="btn-wrapper">
                                <ClubButton onClick={this.onActionClick.bind(this, 'approve')} className="action-btn" title="APPROVE" color="#22BCAC" textColor="#fff" />
                                <ClubButton onClick={this.onActionClick.bind(this, 'reject')} className="action-btn" title="REJECT" color="#eee" textColor="#666" />
                            </div>
                        }
                        {activity.forceStoppable &&
                            <ClubButton onClick={this.onForceStopClick.bind(this, 'forceStop')} className="action-btn" title="FORCE STOP" color="#BE942C" textColor="#FFD56B" />
                        }
                    </div>
                    }
                </div>*/}
                <Dock size={0.5} zIndex={200} position='right' isVisible={this.state.isAssignedDockVisible} dimMode="none" defaultSize={.4}>
                    <AdminAssignedDetailDock 
                        onSubmitDiscussionMessage={this.onSubmitDiscussionMessage.bind(this)} 
                        disscussionSubmitProgress={this.state.disscussionSubmitProgress} 
                        discussions={this.state.activityDiscussions} 
                        masterActivity={masterActivity} 
                        activity={assignedActivityDetail}
                        onViewPoints={() => this.onCustomizePointDialogClick(activity)}
                        onCloseDock={() => this.setState({isAssignedDockVisible: false})}/>
                </Dock> 
                <AdminCustomizePointsDialog masterActivity={masterActivity} activity={activity} pointMatrix={pointMatrix} open={isCustomizePointDialogOpen} onRequestClose={this.onCustomizePointDialogClose.bind(this)}/>                       
            </div>
        );
    }

    isDateValid( current ){
        return current.isAfter( this.startDay );
    };

    onClaimPeriodChange(value){
        this.setState({claimPeriod: Math.round((new Date(value)).getTime() / 1000)});
    }

    onCustomizePointDialogClick(assignedActivity) {
        /*if (!this.state.pointMatrix || !this.state.pointMatrix.assignees || this.state.pointMatrix.assignees.length <= 0) {
            this.setState({pointMatrix: assignedActivity.pointMatrix});
        }*/
        //this.setState({pointMatrix: assignedActivity.pointMatrix});
        this.setState({isCustomizePointDialogOpen: true});
    }

    onCategoryChange(category) {
        this.calculatePoints(category, this.state.ratingValue);
    }

    onCustomizePointDialogClose(pointMatrix, viewDetailDock = false) {
        if (pointMatrix) {
            this.setState({changedPointMatrix: pointMatrix});
        }
        if (viewDetailDock) {
            this.onAssignedActivityInfoClick();
        }
        this.setState({isCustomizePointDialogOpen: false});
    }

    normalizeForClubSelect(apiArray = []) {
        const normalizedArray = [];
        if(apiArray==null || apiArray == 'undefined'){
            return [];
        }
        apiArray.forEach((cat, index) => {
            normalizedArray.push({
                label: cat.label,
                value: cat.code
            });
        });

        return normalizedArray;
    }

    onSubmitDiscussionMessage(message) {
        const {assignedActivityDetail} = this.state;
        if (message.trim()) {
            const messageRequest = {
                value: message,
                commentId: assignedActivityDetail.discussionId
            };
            this.setState({ disscussionSubmitProgress: true });
            AdminDashboardService.postDiscussionMessage(messageRequest)
                .then(data => {
                this.setState({ disscussionSubmitProgress: false });
                this.loadDiscussions(assignedActivityDetail.discussionId);
            })
                .catch(error => {
                this.setState({ disscussionSubmitProgress: false });
                riverToast.show(error.status_message);
            });
        }

    }

    loadDiscussions(discussionId) {
        AdminActivityTileService.loadActivityComments(discussionId)
            .then(data => {
            this.setState({activityDiscussions: data});
            this.setState({isAssignedDockVisible: true});
        })
            .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while loading comments');
        });
    }

    onDeletedActivityClick() {
        if (confirm('Do you want to delete this activity ?')) {
            const {masterActivity, activity} = this.props;
            AdminActivityTileService.deleteAssignedActivity(masterActivity.id, activity.id)
                .then(data => {
                console.log(data);
                this.props.onActionCompleted('delete');
                riverToast.show('The activity is deleted successfully.');
            })
                .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while deleting activity');
            });
        }
    }

    onAssignedActivityInfoClick() {
        const {masterActivity, activity} = this.props;
        AdminActivityTileService.getActivityDetail(masterActivity.id, activity.id)
            .then(data => {
            this.props.onChangeSelectedTile(activity.id);
            this.loadDiscussions(data.discussionId);
            this.setState({assignedActivityDetail: data});
        })
            .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while assigning activity');
        });
    }

    getStatusObject(statusCode) {
        let statusObj;
        const statusList = Util.getActivityStatusList();
        statusList.forEach(status => {
            if (status.code == statusCode) {
                statusObj = status
            }
        });

        return statusObj;
    }

    renderAcivityStatus(statusCode) {
        let statusElement;
        let prevOrder = 0;
        let isCurrent = false;
        let isCompleted = false;
        let isRejected = false;
        let isVisualCurrent = false;
        const statusObj = this.getStatusObject(statusCode);
        const statusList = Util.getActivityStatusList();
        statusElement = statusList.map((status, index) => {
            let element;
            let className = 'status-circle ';
            let statusTextClassName = 'status-text';
            if (status.code == 'A' || status.code == 'C') {
                statusTextClassName = 'status-text small-text';
            }
            if (status.code == statusCode) {
                if (statusCode == 'PR' || statusCode == 'LR') {
                    className += 'rejected';
                    isCurrent = false;
                    isCompleted = false;
                    isRejected = true;
                } else {
                    className += 'current';
                    isCurrent = true;
                    isCompleted = false;
                    isRejected = false;
                }
            } else if (status.order < statusObj.order) {
                className += 'completed';
                isCompleted = true;
                isCurrent = false;
                isRejected = false;
            } else {
                isCompleted = false;
                isCurrent = false;
                isRejected = false;
            }

            if (isVisualCurrent) {
                className += 'completed';
            }

            if (prevOrder != status.order) {
                if ((status.code == 'PA' || status.code == 'LA') && (statusCode == 'PR' || statusCode == 'LR')) {
                    element = '';
                } else {
                    prevOrder = status.order;    
                    element = <div className={className}>
                            {(isCompleted || isCurrent) && <Icon>check</Icon>}
                            {isVisualCurrent && <Icon>more_horiz</Icon>}
                            {isRejected && <Icon>clear</Icon>}
                            <div className={statusTextClassName}>{status.label}</div>
                        </div>;
                }
                if (isCurrent == true) {
                    if (statusCode != 'PC') {
                        isVisualCurrent = true;
                    }
                } else {
                    isVisualCurrent = false;
                }
            } else {
                prevOrder = status.order;
                element = '';
            }

            return element;
        });
        return statusElement;
    }

    onRatingChange(value) {
        this.setState({
            ...this.state,
            ratingValue: value
        });
        this.calculatePoints(this.state.selectedCategory, value);
    }

    isCustomizationAvailable(){
        /*const value = this.state.rating.split("/")[0];
    return (value !== "0");*/
        //return (this.state.ratingValue === null)? false : true;
        return true;
    }

    handleCommentField(e) {
        if (e && e.target) {
            this.setState({comment: e.target.value});
        }
    }

    onCancelComment() {
        this.setState({isApproveClick: false});
        this.setState({isRejectClick: false});
        this.setState({comment: ''});
    }

    calculatePoints(selectedCategory, ratingValue) {
        const {masterActivity, activity} = this.props;
        let params;
        if (activity && activity.ratingType == 'S') {
            params = '?ratingCode='+ratingValue;
        } else if (activity && activity.ratingType == 'C') {
            params = '?categoryCode='+selectedCategory;
        } else if (activity && activity.ratingType == 'B') {
            ratingValue = ratingValue == 0 ? "1" : ratingValue;
            params = '?categoryCode='+selectedCategory+'&ratingCode='+ratingValue;
        }

        AdminActivityTileService.calculatePoints(masterActivity.id, activity.id, params)
            .then((data) => {
            const pointMatrixResponse = {
                clubPoints: [],
                assigneePoints: [],
                justification: ''
            };

            data.assignees.forEach(assignee => {
                pointMatrixResponse.assigneePoints.push({
                    id: assignee.id,
                    point: assignee.calculatedPoints
                });
            });
            data.clubs.forEach(club => {
                pointMatrixResponse.clubPoints.push({
                    id: club.id,
                    point: club.calculatedPoints
                });
            });
            //this.setState({assigneesList: data.assignees});
            //this.setState({changedPointMatrix: pointMatrixResponse});
            //this.setState({pointMatrix: data});
            this.setState({
                assigneesList: data.assignees,
                changedPointMatrix: pointMatrixResponse,
                pointMatrix: data
            });
        })
            .catch((err) => {
            console.log(err);
            riverToast.show(err.status_message || 'Something went wrong while calculating points');
        })
    }

    onSubmitComment() {
        let operation = '';
        let updateCount = {};
        const {masterActivity, activity} = this.props;
        if(!moment(this.state.claimPeriod).isValid()){
            riverToast.show('Please select a time period');
            return;
        }
        if (this.state.isApproveClick) {
            operation = 'approve';
        } else if (this.state.isRejectClick) {
            operation = 'reject';
        }
        const newdate = this.state.claimPeriod*1000 + (2*24*60*60*1000);
        const request = {
            "comment": this.state.comment || '',
            "rating": this.state.ratingValue || '',
            "category": this.state.selectedCategory || '',
            "customisedPoints": this.state.changedPointMatrix,
            "claimPeriod":newdate
        };

        if (!this.state.ratingValue && (activity.ratingType == 'S' || activity.ratingType == 'B')) {
            riverToast.show('Please add a rating');
            return;
        }
        if (!this.state.selectedCategory && (activity.ratingType == 'C' || activity.ratingType == 'B')) {
            riverToast.show('Please select a category');
            return;
        }

        if (!request.comment) {
            riverToast.show('Please add a comment');
            return;
        }


        AdminActivityTileService.actionsOnActivity(request, masterActivity.id, activity.id, operation)
            .then(data => {
            this.setState({isApproveClick: false});
            this.setState({isRejectClick: false});
            this.setState({comment: ''});
            this.props.onActionCompleted(operation);
            const context = Util.getActiveRole();

            if (context && context.value == 'VIEW_ADMIN_DASHBOARD') {
                updateCount = {completedActivityCount: Number(masterActivity.completedActivityCount) - 1};
            } else if (context && context.value == 'ROLE_RIVER_COUNCIL') {
                updateCount = {presidentApprovedActivityCount: Number(masterActivity.presidentApprovedActivityCount) - 1};
            }
            riverToast.show(`Activity is ${(operation === "approve")? "approved" : "rejectd"}`);
            this.props.updateCount(updateCount);
        })
            .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
        });
    }

    onForceStopClick() {
        let operation = 'forceStop';
        const {masterActivity, activity} = this.props;
        const request = {
            "comment": this.state.comment || '',
        };
        AdminActivityTileService.actionsOnActivity(request, masterActivity.id, activity.id, operation)
            .then(data => {
            this.shouldUpdate = true;
            this.props.onActionCompleted(operation);
        })
            .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
        });
    }

    onActionClick(action) {
        if (action === 'approve') {
            this.setState({isApproveClick: true});
        } else {
            this.setState({isRejectClick: true});
        }
    }   

}