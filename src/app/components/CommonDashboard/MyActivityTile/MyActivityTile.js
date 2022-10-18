import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';
import Dock from 'react-dock';
import Datetime from 'react-datetime';

import {Util} from "../../../Util/util";
import ClubButton from '../../Common/ClubButton/ClubButton';
import ClubInput from '../../Common/ClubInput/ClubInput';
import ClubSelect from '../../Common/ClubSelect/ClubSelect';
import {StarRating} from '../../Common/StarRating/StarRating';
import AssignedDetailDock from './MyAssignedDetailDock/MyAssignedDetailDock';

import ActivityTileService from './MyActivityTile.service';

import './MyActivityTile.scss';
import index from 'jss';
import { riverToast } from '../../Common/Toast/Toast';
import { CommonDashboardService } from '../CommonDashboard.service';
import { SelectBox } from '../../Common/SelectBox/SelectBox';

export default class MyActivityTile extends Component {
    constructor(props){
        super(props);
        this.state = {
            isApproveClick: false,
            isRejectClick: false,
            isDraftClick: false,
            isAssignedDockVisible: false,
            comment: '',
            rating: '0/'+this.numOfStars,
            ratingValue: 0,
            assignedActivityDetail: {},
            attachmentFiles: [],
            activityDiscussions: [],
            disscussionSubmitProgress: false,
            assigneesList: [],
            submitWithoutComment: false,
            claimPeriod: Math.round((new Date()).getTime() / 1000),
            multiplier: 1
        };
        this.numOfStars = 5;
        this.unique = moment().format("x");
        this.dateOptions = {
            id: `date${this.unique}`,
            placeholder: 'Target Date',
            className:"datetime-input"
        }
        this.startDay = moment("20181001T000000");
    }

    componentDidMount(){
        const {masterActivity, activity} = this.props;
        const claimPeriod = this.props.activity.submittedClaimPeriod;
        let selectedCategory;

        if(activity.ratingType === 'S'){
            selectedCategory = activity.currentStarRating;
        }
        else if(activity.ratingType == 'C'|| activity.ratingType == 'B'){
            selectedCategory = activity.category.code;
        }
        this.setState({
            multiplier: this.props.activity.multiplier,
            claimPeriod: new Date(claimPeriod / 1000),
            selectedCategory: selectedCategory
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.activity.multiplier !== this.state.multiplier){
            this.setState({multiplier: nextProps.activity.multiplier});
        }
    }

    render() {
        const {isApproveClick, isRejectClick, comment, assignedActivityDetail, isDraftClick} = this.state;
        const {masterActivity, activity} = this.props;
        const currentRole = Util.getActiveRole().value;
        let assignees;
        let attachedFiles;
        //if (activity && activity.pointMatrix && activity.pointMatrix.assignees && activity.pointMatrix.assignees.length > 0) {
        //    assignees = activity.pointMatrix.assignees.map((assigne, index) => {
        let assigneesList = this.state.assigneesList.length ? this.state.assigneesList : activity.pointMatrix.assignees;
        assignees = assigneesList.map((assigne, index) => {
            return <div className="assignee-chip" key={index}>
                <div className="head">
                    {assigne.status && assigne.status == 'C' ? 
                        <Icon>check</Icon>:
                        <Icon>more_horiz</Icon>
                    }
                </div>
                <div className="body">{assigne.name} (<span>{assigne.calculatedPoints} pts</span>)</div>
            </div>
        });
        //}

        if (this.state.attachmentFiles && this.state.attachmentFiles.length > 0) {
            attachedFiles = this.state.attachmentFiles.map((file, index) => {
                return <div className="upload-file-info-container" key={index}>
                    <div className="upload-file-info">
                        <small>{file.name || ''}</small><div className="file-delete"><Icon onClick={() => this.onDeleteFile(index)}>close</Icon></div>
                    </div>
                </div>
            });
        }

        const maxNum = this.props.masterActivity.maximumNumberOfAssignees === -1? 100 : this.props.masterActivity.maximumNumberOfAssignees;
        const classDockOpen = this.props.selectedTile === activity.id? "open" : "closed";

        return (
            <div className="my-activity-tile-container">
                <div className={`activity-tile ${classDockOpen}`}>
                    <div className="activity-tile-header">
                        { activity.deletable && <div className="activity-button-actions">
                            <div className="activity-close-button" onClick={this.onAssignActivitySelfDelete.bind(this)}>
                                <Icon>cancel</Icon>
                            </div>
                        </div>
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
                    <div className="main-title">{activity.title || ''}</div>
                    <div className="desc-container">
                        {activity.description &&
                            <div className="desc-wrapper">
                                <div className="desc-text">{activity.description.substr(0, 93)+'...' || ''}</div>
                            </div>
                        }
                    </div>
                    <h2 className="ref-title" title="Reference Code">{activity.referenceId}</h2>
                    <div className="activity-info-button" onClick={this.onAssignedActivityInfoClick.bind(this)}>
                        <Icon>fullscreen</Icon><span className="label">More Info</span>
                    </div>
                    {(activity.claculatedClaimPeriod) &&
                        <div className="claimlabel">
                            <b>Claim Period</b><span>{activity.claculatedClaimPeriod}</span>
                        </div>
                    }
                    <div className="title category-text" style={{fontSize: "12px" , margin: "5% 2%" ,fontWeight: "bold"}}>
                        {(masterActivity.categories && masterActivity.categories.length && masterActivity.categories.length > 1) &&
                            <span>
                                {masterActivity.categoryLabel || ''}
                            </span>
                        }
                    </div>

                    {/* {activity.category &&
                        <div className="rateing-dropdown">
                            <SelectBox
                                id="ratingType-value" 
                                selectArray={masterActivity.categories}
                                onSelect={this.handleChange.bind(this)}
                                />
                        </div>
                    } */}
                    {/* <div>Test{activity.category}</div> */}
                    <div className="myactivity-customize-wrapper" style={{width:"100%"}}>
                        {this.isCurrentUserStatusActivityAssigned() && ((activity.ratingType == 'C'|| activity.ratingType == 'B') && (masterActivity.categories !== null && masterActivity.categories.length >= 1)) ?
                            <ClubSelect
                                className="activity-tile-select"
                                placeholder="Select category"
                                source={this.normalizeForClubSelect(masterActivity.categories)}
                                onSelect={(value) => {
                                    this.setState({selectedCategory: value});
                                    this.onCategoryChange(value);
                                }}
                                selected={this.state.selectedCategory || activity.category.code}
                                />:''
                        }

                        {(activity.ratingType == 'C'|| activity.ratingType == 'B') && (!this.isCurrentUserStatusActivityAssigned()) &&
                            <span className="catg-label">{ activity.category && activity.category.label }</span>
                        }
                    </div>
                    {
                        (masterActivity.hasMultiplier && activity.status === 'A') && <div className="multiplier-control-wrapper">
                                <label className="label" htmlFor={`activity${activity.id}`}>Multipler</label>
                                <div className="control">
                                    <Button className="btn" onClick={this.changeMultiplier.bind(this, "subtract")} disabled={this.state.multiplier <= 1} raised><Icon>remove</Icon></Button>
                                    <input id={`activity${activity.id}`} className="textbox" name="multiplier" value={this.state.multiplier} onChange={this.handleMultiplierChange.bind(this)} pattern="[0-9]+" />
                                    <Button className="btn" onClick={this.changeMultiplier.bind(this, "add")} raised><Icon>add</Icon></Button>
                                </div>
                            </div>
                    }
                    {
                        (masterActivity.hasMultiplier && activity.status !== 'A') && <div className="multiplier-control-wrapper">
                                <div className="multiplier-display">
                                    <b>Multiplier: </b> <span>{this.state.multiplier}</span>
                                </div>
                            </div>
                    }
                    <div className="assignees-wrapper">
                        {assignees}
                    </div>
                    {this.isCurrentUserStatusActivityAssigned() ?
                        <div className="assigned-activity-upload">
                            <div className="assignee-input" style={{display: "none"}}>
                                <div className="upload-btn-wrapper">
                                    <button className="btn">Attachments<Icon>attach_file</Icon></button>
                                    <input id={activity.id || ''} onChange={this.onImageChange} type="file"/>
                                </div>
                            </div>
                            <div className="attached-files-container">
                                {attachedFiles}
                            </div>
                        </div>:''
                    }

                    <div className="action-container">

                        {((isApproveClick && this.isCurrentUserStatusActivityAssigned()) || isRejectClick || isDraftClick) ? 
                            <div className="submit-action-wrapper">
                                <div className="activity-date" title="Date/Period on which the activity is actually happened">
                                    <div className="label">Claim period</div>
                                    <Datetime
                                        defaultValue={moment()}
                                        isValidDate={this.isDateValid.bind(this)}
                                        dateFormat="YYYY-MM"
                                        timeFormat={false}
                                        inputProps={this.dateOptions}
                                        onChange={this.onClaimPeriodChange.bind(this)}
                                        value={new Date(this.state.claimPeriod * 1000)}
                                        />
                                    <label className="datelable" htmlFor={`date${this.unique}`}><Icon>calendar_today</Icon></label>
                                </div>
                                <div className="action-wrapper">
                                    {/* {activity.status == 'PA' && currentRole == 'ROLE_RIVER_COUNCIL' && isApproveClick &&
                                    <div className="rating-container">
                                        <StarRating 
                                            isEditable={true} 
                                            onChange={this.onRatingChnage.bind(this)}
                                            className="star-rating" 
                                            rating={this.state.rating} 
                                            color={"#808080"}
                                            size={"1.3rem"}/>
                                    </div>
                                } */}
                                    <label className="markascomplete-attachment-upload" htmlFor={activity.id || ''}><Icon>attach_file</Icon></label>
                                    {!isDraftClick && <ClubInput placeholder="Comment" onChange={(e) => this.handleCommentField(e)} value={comment}/>}
                                    {!isDraftClick && <IconButton onClick={this.onMarkAsComplete.bind(this)} color="primary">
                                        <Icon>check</Icon>
                                    </IconButton>}
                                    {isDraftClick && <IconButton onClick={this.onDraft.bind(this)} color="primary">
                                        <Icon>check</Icon>
                                    </IconButton>}
                                    <IconButton onClick={this.onCancelComment.bind(this)} color="default">
                                        <Icon>clear</Icon>
                                    </IconButton>
                                </div>
                            </div>:
                            <div className="action-wrapper">

                            {
                                this.isCurrentUserStatusActivityAssigned() ?
                                    <div className="btn-wrapper">
                                        <ClubButton className="action-btn" onClick={this.onActionClick.bind(this, 'approve')} title="Complete" color="#22BCAC" textColor="#fff" />
                                        <Button className="btn-draft" onClick={this.onActionClick.bind(this, 'draft')} title="Save data for further modification in the future. This will not submit activity to the President.">Save as Draft</Button>
                                    </div>:''
                            }
                        </div>
                        }
                    </div>
                    <Dock zIndex={200} size={0.5} position='right' isVisible={this.state.isAssignedDockVisible} dimMode="none" defaultSize={.4}>
                        <AssignedDetailDock 
                            onSubmitDiscussionMessage={this.onSubmitDiscussionMessage.bind(this)} 
                            disscussionSubmitProgress={this.state.disscussionSubmitProgress} 
                            discussions={this.state.activityDiscussions} 
                            masterActivity={masterActivity} 
                            activity={assignedActivityDetail} 
                            onCloseDock={() => this.setState({isAssignedDockVisible: false})}/>
                    </Dock>                        
                </div>
            </div>
        );
    }

    isDateValid( current ){
        const nextMonth = moment().add(1, "month").startOf("month");
        return (current.isAfter(this.startDay) && current.isBefore(nextMonth));
    };

    onClaimPeriodChange(value){
        this.setState({claimPeriod: Math.round((new Date(value)).getTime() / 1000)});
    }

    onSubmitDiscussionMessage(message) {
        const {assignedActivityDetail} = this.state;
        if (message.trim()) {
            const messageRequest = {
                value: message,
                commentId: assignedActivityDetail.discussionId
            };
            this.setState({ disscussionSubmitProgress: true });
            CommonDashboardService.postDiscussionMessage(messageRequest)
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
        ActivityTileService.loadActivityComments(discussionId)
            .then(data => {
            this.setState({activityDiscussions: data});
            this.setState({isAssignedDockVisible: true});        
        })
            .catch(error => {
            //console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while loading comments');
        });
    }

    onCategoryChange(category) {
        this.calculatePoints(category, this.state.ratingValue);
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
        const multiplier = masterActivity.hasMultiplier? this.state.multiplier : 1;
        params += `&multiplier=${multiplier}`;

        ActivityTileService.calculatePoints(masterActivity.id, activity.id, params)
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
            //console.log(err);
            riverToast.show(err.status_message || 'Something went wrong while calculating points');
        })
    }

    static loadActivityComments(commentId) {
        let url = ApiUrlConstant.getApiUrl("loadCommentsFull");
        url = Util.beautifyUrl(url, [commentId]);
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    onAssignedActivityInfoClick() {
        const {masterActivity, activity} = this.props;
        ActivityTileService.getActivityDetail(masterActivity.id, activity.id, "common")
            .then(data => {
            this.props.onChangeSelectedTile(activity.id);
            this.loadDiscussions(data.discussionId);
            this.setState({assignedActivityDetail: data});
            this.setState({isAssignedDockVisible: true});        
        })
            .catch(error => {
            //console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while assigning activity');
        });
    }

    isCurrentUserStatusActivityAssigned(){
        const {masterActivity, activity} = this.props;
        const userDetails = Util.getLoggedInUserDetails();
        let isAssigned = false;
        activity.assignees.forEach((assignee, index) => {
            if (assignee.email == userDetails.email) {
                if (assignee.status == 'A') {
                    isAssigned = true;
                }
            }
        });

        return isAssigned;
    }

    onDraft(){
        const {masterActivity, activity} = this.props;
        const newdate = (moment(this.state.claimPeriod*1000).startOf("month").add(2, "days"));

        const request = {
            title: activity.title,
            description: activity.description,
            claimPeriod: newdate,
            attachments: [...this.state.attachmentFiles]
        };
        if(activity.ratingType === 'C' || activity.ratingType === 'B'){
            request.categoryCode = this.state.selectedCategory;
        }
        if(masterActivity.hasMultiplier && activity.status === 'A'){
            request.multiplier = this.state.multiplier;
        }

        ActivityTileService.draftActivity(masterActivity.id, activity.id, request)
            .then(data => {
            this.props.onActionCompleted(masterActivity,'draft')
                .then(data => {
                this.setState({
                    attachmentFiles: [],
                    isDraftClick: false,
                    submitWithoutComment: false
                });

            })
                .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
            });
        })
            .catch(error => {
            riverToast.show(error.status_message || 'Something went wrong while saving a draft of the activity.');
        });
    }

    onMarkAsComplete(){
        const {masterActivity, activity} = this.props;
        if(!moment(this.state.claimPeriod).isValid()){
            riverToast.show('Please select a time period');
            return;
        }
        //const newdate = this.state.claimPeriod*1000 + (2*24*60*60*1000);
        const newdate = (moment(this.state.claimPeriod*1000).startOf("month").add(2, "days"));

        const request = {
            attachments: [...this.state.attachmentFiles],
            "comment": this.state.comment || '' ,
            "categoryCode":this.state.selectedCategory,
            "claimPeriod": newdate

        };
        if(masterActivity.hasMultiplier && activity.status === 'A'){
            request.multiplier = this.state.multiplier;
        }
        if (Util.getActiveRole().value == 'ROLE_RIVER_COUNCIL') {
            request.rating = this.state.ratingValue || 0;
            if (!request.comment) {
                riverToast.show('Please add comment and rating to perform this action');
                return;
            }
        } else {
            if (!request.comment) {
                riverToast.show('Please add comment to perform this action');
                return;
            }
        }
        if(this.state.attachmentFiles && this.state.attachmentFiles.length === 0 && !this.state.submitWithoutComment){
            const action = window.confirm("Submit the activity without attachment?");
            if(action){
                this.setState({submitWithoutComment: true});
            }
            else{
                return;
            }
        }
        ActivityTileService.assignActivityMarkComplete(masterActivity.id,activity.id,"complete", request)
            .then(response=>{
            //console.log(response);
            this.props.onActionCompleted(masterActivity,'completed activity')
                .then(data => {
                this.setState({
                    attachmentFiles: [],
                    comment: "",
                    isApproveClick: false,
                    submitWithoutComment: false
                });

            })
                .catch(error => {
                //console.log(error); 
                riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
            });
        })
            .catch(error => {
            //console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while deleting activity');
        });
    }

    // onAssignActivitySelfDelete() {
    //     const {masterActivity, activity} = this.props;
    //     ActivityTileService.assignedActivitySelfDelete(masterActivity.id,activity.id)
    //     .then(response=>{
    //         console.log(response);
    //         this.props.onActionCompleted(masterActivity,'Activity Deleted');
    //     })
    //     .catch()
    // }
    onAssignActivitySelfDelete() {
        if (confirm('Do you want to delete this activity ?')) {
            const {masterActivity, activity} = this.props;
            ActivityTileService.assignedActivitySelfDelete(masterActivity.id, activity.id)
                .then(data => {
                //console.log(data);
                this.props.onActionCompleted('delete')
                    .then(data => {
                    this.setState({
                        attachmentFiles: [],
                        comment: "",
                        isApproveClick: false,
                        submitWithoutComment: false
                    });
                })
                    .catch(error => {
                    //console.log(error);
                    riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
                });
            })
                .catch(error => {
                //console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while deleting activity');
            });
        }
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
    normalizeForClubSelect(apiArray=[]) {
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

    onDeleteFile(index) {
        const attachedFiles = this.state.attachmentFiles;
        attachedFiles.splice(index, 1);
        this.setState({attachmentFiles: attachedFiles});
    }

    onFileUpload(attachment){
        const attachedFiles = this.state.attachmentFiles;
        Util.base64ImageFromFile(attachment).
        then( result => {
            //console.log(result);
            attachedFiles.push({
                name: attachment.name,
                content: result
            });
            this.setState({attachmentFiles: attachedFiles});
        })
        // .catch(error => {
        //     riverToast.show("Something went wrong while changing club logo");                        
        // });
    }

    onImageChange = (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.onFileUpload(file);
        }

        reader.readAsDataURL(file);
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
                    element = <div className={className} key={index}>
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

onRatingChnage(value) {
    this.setState({
        ...this.state,
        rating: value+"/"+this.numOfStars,
        ratingValue: value
    });
}

handleCommentField(e) {
    if (e && e.target) {
        this.setState({comment: e.target.value});
    }
}

onCancelComment() {
    this.setState({isApproveClick: false});
    this.setState({isRejectClick: false});
    this.setState({isDraftClick: false});
    this.setState({comment: ''});
}

onSubmitComment() {
    let operation = '';
    const {masterActivity, activity} = this.props;
    if (this.state.isApproveClick) {
        operation = 'approve';
    } else if (this.state.isRejectClick) {
        operation = 'reject';
    }
    const request = {
        "comment": this.state.comment || '',
    };
    if (Util.getActiveRole().value == 'ROLE_RIVER_COUNCIL') {
        request.rating = this.state.ratingValue || 0;
        if (!request.comment) {
            riverToast.show('Please add comment and rating to perform this action');
            return;
        }
    } else {
        if (!request.comment) {
            riverToast.show('Please add comment to perform this action');
            return;
        }
    }
    ActivityTileService.actionsOnActivity(request, masterActivity.id, activity.id, operation)
        .then(data => {
        this.setState({isApproveClick: false});
        this.setState({isRejectClick: false});
        this.setState({isDraftClick: false});
        this.props.onActionCompleted(operation)
            .then(data => {
            this.setState({
                attachmentFiles: [],
                comment: "",
                isApproveClick: false,
                submitWithoutComment: false
            });
        })
            .catch(error => {
            //console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
        });
    })
        .catch(error => {
        //console.log(error);
        riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
    });
}

onForceStopClick() {
    let operation = 'forceStop';
    const {masterActivity, activity} = this.props;
    const request = {
        "comment": this.state.comment || '',
    };
    ActivityTileService.actionsOnActivity(request, masterActivity.id, activity.id, operation)
        .then(data => {
        this.props.onActionCompleted(operation)
            .then(data => {
            this.setState({
                attachmentFiles: [],
                comment: "",
                isApproveClick: false,
                submitWithoutComment: false
            });
        })
            .catch(error => {
            //console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
        });
    })
        .catch(error => {
        //console.log(error);
        riverToast.show(error.status_message || 'Something went wrong while performing action on activity');
    });
}

onActionClick(action) {
    if (action === 'approve') {
        // if(this.state.selectedCategory){
        //     this.setState({isApproveClick: true});
        // }
        // else{
        //     riverToast.show('please select a category to perform this action');
        // }
        this.setState({isApproveClick: true});
    } else if(action === 'reject'){
        this.setState({isRejectClick: true});
    }
    else if(action === 'draft'){
        this.setState({isDraftClick: true});
    }
}

handleMultiplierChange(event){
    let multiplier = isNaN(parseInt(event.target.value))? 1 : parseInt(event.target.value);
    multiplier = multiplier || 1;
    const name = event.target.name;
    this.setState({multiplier}, function (state) {
        this.calculatePoints(this.state.selectedCategory, this.state.ratingValue);
    });
}

changeMultiplier(operation){
    let multiplier = parseInt(this.state.multiplier, 10);
    (operation === "add")? multiplier++ : multiplier--;
    this.setState({multiplier}, function (state) {
        this.calculatePoints(this.state.selectedCategory, this.state.ratingValue);
    });
}

}