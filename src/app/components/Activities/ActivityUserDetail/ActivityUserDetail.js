import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import moment from 'moment';
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
  } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Datetime from 'react-datetime';

import InfoIcon from "../../Common/InfoIcon";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { PageTitle } from '../../Common/PageTitle/PageTitle';

import { fieldChange, loadActivityMasterList, setAssigneeUserSelected, setReviewerUserSearchResult, setReviewerUserSelected, changeSelectedActivity, setAssigneeUserSearchResult, clearFormFields } from "./ActivityUserDetail.action";
import { ActivityUserDetailServices } from "./ActivityUserDetail.service";
import {Util} from "../../../Util/util";
import './ActivityUserDetail.scss';

const mapStateToProps = (state) => {
    return {
        activityUserDetail: state.ActivityUserDetailReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadActivityMasterList: (list) => {
            dispatch(loadActivityMasterList(list));
        },
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
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

const PRIVILEGE_UPDATE_ACTIVITY = "UPDATE_ACTIVITY";

class ActivityUserDetail extends React.Component {

    state = {
        circularPreLoadeder: false,
        meetingInviteesPreloader: false,
        meetingAttendeesPreloader: false,
        showAssigneeSearchPreloader: false,
        showReviewerSearchPreloader: false,
    };

    constructor(props) {
        super(props);
        this.getActivityMasterList();
    }

    componentDidMount() {
        if (this.props.match.params.activityId) {
            this.activityId = this.props.match.params.activityId;
            this.loadActivityMasterDetails(this.activityId);
        } else {
            this.props.clearFormFields();
            this.props.fieldChange("fromDate", Math.round((new Date()).getTime() / 1000));
            this.props.fieldChange("toDate", Math.round((new Date()).getTime() / 1000));            
        }
     }
    isFeedArray = [
        {
            title: "True",
            value: true
        },
        {
            title: "False",
            value: false
        }
    ];

    isReviewMode = [
        {
            title: "True",
            value: true
        },
        {
            title: "False",
            value: false
        }
    ];

    yesterday = Datetime.moment().subtract(1, 'day');

    render() {
        return ( 
			<Root role="user">
				<MainContainer>
                    <PageTitle title="Activity" />
                    <div className="row activity-details">
                        <div className="col-md-12">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <h5>Create New</h5>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-4"></div>
                                                <div className="col-md-4">
                                                    <div className="large-icon-container">
                                                        <Icon className="large-icon">timelapse</Icon>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    
                                                        {
                                                            (this.props.activityUserDetail.selectedActivity) ?
                                                                <div className="point-container">
                                                                    <div className="point-wrap club">
                                                                        <span className="point-wrap-title">Club Points:</span><span className="point">{this.props.activityUserDetail.selectedActivity.clubPoints}</span>
                                                                    </div>
                                                                    <div className="point-wrap member">
                                                                        <span className="point-wrap-title">Member Points:</span><span className="point">{this.props.activityUserDetail.selectedActivity.memberPoints}</span>
                                                                    </div>
                                                                </div>
                                                            :
                                                            <div className="point-container"></div> 
                                                        }
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="page-content-section">
                                    <div className="section-title">Activity Details</div>
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <div className="input-field selectBox">
                                                <SelectBox 
                                                    id="activity-cat-select" 
                                                    label="Activity Master"
                                                    selectedValue = {this.props.activityUserDetail.ActivityDetailFields.activityMaster}
                                                    selectArray={this.props.activityUserDetail.activityMasterList}
                                                    valueDescription = {true}
                                                    onSelect={this.handleActivityMasterSelect.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <TextField
                                                id="title"
                                                label="Title"
                                                className="input-field"
                                                margin="normal"
                                                inputProps={{
                                                    maxLength: 80,
                                                  }}
                                                value = {this.props.activityUserDetail.ActivityDetailFields.title}
                                                onChange = {this.handleChange('title')}
                                            />
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <TextField
                                                id="description"
                                                label="Description"
                                                className="input-field"
                                                margin="normal"
                                                value={this.props.activityUserDetail.ActivityDetailFields.description}
                                                onChange = {this.handleChange('description')}
                                                multiline={true}
                                                rows={2}
                                            />
                                        </div>
                                        
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <div className="datetime-picker-wrapper">
                                                <label
                                                    htmlFor="from-date"
                                                >
                                                    From
                                                </label>
                                                <Datetime
                                                    inputProps={
                                                            { 
                                                                placeholder: 'From',
                                                                id:"from-date",
                                                                className:"datetime-input"
                                                            }
                                                        }
                                                    isValidDate={ this.isDateValid.bind(this) }
                                                    className="datetime-picker"
                                                    value= {new Date(this.props.activityUserDetail.ActivityDetailFields.fromDate * 1000)}
                                                    onChange={(value)=>{
                                                        this.props.fieldChange("fromDate", Math.round((new Date(value)).getTime() / 1000));
                                                    }}
                                                    timeFormat={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <div className="datetime-picker-wrapper">
                                                <label
                                                    htmlFor="to-date"
                                                >
                                                    To
                                                </label>
                                                <Datetime
                                                    inputProps={
                                                            { 
                                                                placeholder: 'To',
                                                                id:"to-date",
                                                                className:"datetime-input"
                                                            }
                                                        }
                                                    isValidDate={ this.isDateValid.bind(this) && this.isAfterFromDate.bind(this) }
                                                    className="datetime-picker"
                                                    value= {new Date(this.props.activityUserDetail.ActivityDetailFields.toDate * 1000)}
                                                    onChange={(value)=>{
                                                        this.props.fieldChange("toDate", Math.round((new Date(value)).getTime() / 1000));
                                                    }}
                                                    timeFormat={false}
                                                />
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    <div className="row">
                                        {/* <div className="col-md-4 input-container">
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                    <Checkbox
                                                        checked={this.props.activityUserDetail.ActivityDetailFields.isFeed}
                                                        onChange={this.handleSelect('isFeed')}
                                                        value="true"
                                                    />
                                                    }
                                                    label="isFeed"
                                                />
                                                <InfoIcon tooltip="act_isfeed"/>
                                            </FormGroup>
                                        </div> */}
                                        <div className="col-md-4 input-container">
                                            <FormGroup style={{position:"relative"}}>
                                                <FormControlLabel
                                                    control={
                                                       
                                                    <Checkbox
                                                        checked={this.props.activityUserDetail.ActivityDetailFields.isDone}
                                                        onChange={this.handleSelect('isDone')}
                                                        value="true"
                                                    />
                                                    }
                                                    label="Already Completed"
                                                />
                                                <InfoIcon tooltip="act_isdone"/>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="floating-bottom-control">
                                        {Util.hasPrivilage(PRIVILEGE_UPDATE_ACTIVITY) &&
                                            <div>
                                                <Button
                                                    onClick={this.onCancel.bind(this)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button color="primary"
                                                        onClick={this.onSubmit.bind(this)}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        }
                                        {!Util.hasPrivilage(PRIVILEGE_UPDATE_ACTIVITY) &&
                                                <Button
                                                    onClick={this.onCancel.bind(this)}
                                                >
                                                    OK
                                                </Button>
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    handleChange = name => event => {
        this.props.fieldChange(name, event.target.value);
    };

    handleSelect = name => value => {
        this.props.fieldChange(name, !this.props.activityUserDetail.ActivityDetailFields[name]);
    }

    handleActivityMasterSelect(value) {
        this.props.fieldChange("activityMaster", value);
        this.props.changeSelectedActivity(this.getActivityObject(value)[0]);
    }

    isDateValid = function( current ){
        return current.isAfter( this.yesterday );
    };

    isAfterFromDate = function(current) {
        const date =  new Date(this.props.activityUserDetail.ActivityDetailFields.fromDate * 1000);
        return current.isAfter( date );
    };

    onCancel(){
        this.props.history.push("/activities");
    }

    getActivityObject(value) {
        return this.props.activityUserDetail.activityMasterList.filter( activityObj => {
            if(activityObj.value == value) {
                return activityObj;
            }
        })
    }

    getActivityMasterList(){
        ActivityUserDetailServices.getActivityMasters()
        .then((data) => {
            const masterList = this.generateActivityMasterList(data);            
            this.props.loadActivityMasterList(masterList);
        })
    }

    generateActivityMasterList(list){
        return list.map(item => {
            return {
                title: item.title,
                value: item.id,
                description: item.description,
                clubPoints: item.clubPoints,
                memberPoints: item.memberPoints
            };
        });
    }

    processLoadedActivity(activity) {
        this.props.fieldChange("title", activity.title);
        this.props.fieldChange("title", activity.title);
        this.props.fieldChange("description", activity.description);
        this.props.fieldChange("clubPoints", activity.clubPoints);
        this.props.fieldChange("reviewerId", activity.reviewerId);
        this.props.fieldChange("memberPoints", activity.memberPoints);
        this.props.fieldChange("fromDate", (activity.fromDate / 1000));
        this.props.fieldChange("toDate",  (activity.toDate / 1000));
        this.props.fieldChange("isFeed", activity.isFeed);
        this.props.fieldChange("isDone", activity.isDone);
        const assignedUsers = this.getAssignedUsers(activity.activityAssignees);
        this.props.setAssigneeUserSelected(assignedUsers);
        this.updateAssigneesId(assignedUsers); 
        this.handleActivityMasterSelect(activity.activityMaster.id);
    }

    getAssignedUsers(assignees) {
        const assignedUsers = [];
        assignees.forEach(function(assignee, index) {
            assignedUsers.push(assignee.userId);
        }, this);

        return assignedUsers;
    }

    getUserChipElement(item){
        const firstName = item.firstName || "";
        const middleName = item.middleName || "";
        const lastName = item.lastName || "";
        return {
            type: "USER",
            fullname: firstName + " " + middleName + " " + lastName,
            username: item.email,
            avatar: item.avatar || "resources/images/img/user-avatar.png",
            id: item.id
        };
    }

    loadActivityMasterDetails(activityId) {
        ActivityUserDetailServices.getActivity(activityId)
        .then((data) => {
            this.processLoadedActivity(data);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong");
        })
    }

    onReviewerSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showReviewerSearchPreloader: true});
            ActivityUserDetailServices.searchUser(searchText)
                .then((data) => {
                    this.setState({showReviewerSearchPreloader: false});
                    if (data) {
                        this.props.setReviewerUserSearchResult(data);
                    }
                })
                .catch((error) => {
                    this.setState({showReviewerSearchPreloader: false});
                    riverToast.show(error.status_message);
                });
        } else if (searchText.length <= 0) {
            this.setState({showReviewerSearchPreloader: false});            
            this.props.setReviewerUserSearchResult([]);
        }
    }

    updateAssigneesId(selectedUsers){
        const selectedAssigneesId = selectedUsers.map((user) =>  user.id);
        this.props.fieldChange("assigneId", selectedAssigneesId);
    }

    onReviewerItemSelect(item) {
        this.props.setReviewerUserSearchResult([]);
        this.props.setReviewerUserSelected([item]);
        this.props.fieldChange("reviewerId", item.id);
    }

    onDeleteReviewerUser(item) {
        this.props.setReviewerUserSelected([]);
        this.props.fieldChange("reviewerId", "");
    }

    isFormValid() {
        const activity = this.props.activityUserDetail.ActivityDetailFields;
        if(
            !activity.activityMaster ||
            !activity.title
        ) {
            riverToast.show("Please fill all field");
            return false;
        } else {
            if(activity.isReviewMode && !activity.reviewerId) {
                riverToast.show("Assign reviewer");
                return false;
            }
            if(this.props.activityUserDetail.ActivityDetailFields.fromDate > this.props.activityUserDetail.ActivityDetailFields.toDate){
                riverToast.show("Please check the dates");
                return false;
            }
            return true;
        }
    }

    getAssignees() {
        const assignees = [];
        this.props.activityUserDetail.selectedAssigneeChip.forEach(function(element) {
            assignees.push(element.id);
        }, this);
        return assignees;
    }

    generateActivityObject() {
        return {
            title: this.props.activityUserDetail.ActivityDetailFields.title,
            activityMaster: this.props.activityUserDetail.ActivityDetailFields.activityMaster,
            description: this.props.activityUserDetail.ActivityDetailFields.description,
            fromDate: this.props.activityUserDetail.ActivityDetailFields.fromDate * 1000,
            toDate: this.props.activityUserDetail.ActivityDetailFields.toDate * 1000,
            isFeed: true,
            isDone: this.props.activityUserDetail.ActivityDetailFields.isDone || false,
            activityAssignees: this.getAssignees()
        }
    }

    onSubmit(){
        if (this.isFormValid()){
            if(this.props.match.params.activityId){
                const activityObject = this.generateActivityObject();
                ActivityUserDetailServices.updateActivity(activityObject, this.props.match.params.activityId)
                .then((data) => {
                    riverToast.show("Updated successfully");
                    this.props.history.push("/activities");
                })
                .catch((error) => {
                    riverToast.show(error.status_message || "Something went wrong");
                });
            } else {
                const activityObject = this.generateActivityObject();
                ActivityUserDetailServices.assignActivity(activityObject)
                .then((data) => {
                    riverToast.show("Assigned successfully");
                    this.props.history.push("/activities");
                })
                .catch((error) => {
                    riverToast.show(error.status_message || "Something went wrong");
                });
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityUserDetail)