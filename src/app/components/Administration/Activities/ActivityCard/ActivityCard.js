import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import AddUser from 'material-ui-icons/PersonAdd';
import moment from 'moment';
import Tooltip from 'material-ui/Tooltip';

// css
import './ActivityCard.scss';
import { ActivitiesService } from "../Activities.service";
import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';
import { Toast, riverToast } from '../../../Common/Toast/Toast';

import {Util} from "../../../../Util/util";

const PRIVILEGE_DELETE_ACTIVITY = "DELETE_ACTIVITY";
export class ActivityCard extends React.Component {
    state ={
        showAssigneePreloader: false,
        assigneeSearchResult: [],
        selectedAssigneesList: [],
        assigneesList: []
    }

    assignees = [];
    componentDidMount() {
        if(this.props.activity && this.props.activity.assignees) {
            this.assignees = this.props.activity.assignees.slice();
            this.setState({ assigneesList: this.props.activity.assignees });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activity != this.props.activity) {
            if(this.props.activity && this.props.activity.assignees) {
                this.assignees = this.props.activity.assignees.slice();
                this.setState({ assigneesList: this.props.activity.assignees });
            }
        }
    }

    assignStatuses = ['ASSIGNED', 'UNASSIGNED']

    render() {
        return(
            <div className="activitycard">
                <div className="infos-wrapper">
                    <div className="infos">
                        <div className="datas">
                            <div className="title" onClick={ this.handleViewActivityClick.bind(this, this.props.activity, this.props.index)}>{this.props.activity.title}</div>
                            <div className="status-points">                                
                                <div className="points">
                                    <div className="club point">
                                        <Icon className="icon">store</Icon> {this.props.activity.clubPoint}
                                    </div>
                                    <div className="member point">
                                    <Icon className="icon">person</Icon> {this.props.activity.memberPoint}
                                    </div>
                                </div>
                                <div className="status">{this.props.activity.status}</div>
                            </div>
                        </div>
                        <div className="assignees-list">
                            {
                                this.state.assigneesList &&
                                    this.state.assigneesList.map((assignee, index) => {
                                        return <div className="assignee" key={index}>
                                                    <span className="assignee-name">{assignee.assignee.fullname}</span>
                                                    {
                                                        (!assignee.userDone && this.props.role == 'ROLE_CLUB_PRESIDENT') ?
                                                            <span className="delete-assignee" onClick={this.onDeleteAlreadyAssignedUser.bind(this, assignee)}><Icon className="icon">close</Icon></span>
                                                        :
                                                            (assignee.userDone && this.assignStatuses.includes(this.props .activity.status)) &&
                                                                <span className="assignee-done"><Icon className="icon">done</Icon></span>                                                            
                                                    }
                                                </div>
                                    })
                            }
                            {
                                this.state.selectedAssigneesList &&
                                    this.state.selectedAssigneesList.map((assignee, index) => {
                                        return <div className="assignee" key={index}>
                                                    <span className="assignee-name">{assignee.assignee.fullname}</span>
                                                    {
                                                        this.props.role == 'ROLE_CLUB_PRESIDENT' &&
                                                            <span className="delete-assignee" onClick={this.onDeleteAssigneeUser.bind(this, assignee)}><Icon className="icon">close</Icon></span>                                                    
                                                    }
                                                </div>
                                    })
                            }
                        </div>
                    </div>
                    {
                        (this.props.role == 'ROLE_CLUB_PRESIDENT') &&
                            <div className="role-actions">
                                {
                                    this.assignStatuses.includes(this.props.activity.status) &&
                                        <div className="select-assignee">
                                            <UserChipMultiSelect
                                                placeholder = "Assignees"
                                                customStyle = {{width : "100%",fontSize:"0.85rem",textAlign:"center",padding:"2pt"}}
                                                searchBoxClass = "activity-item-assignees-multi-select"
                                                showPreloader={this.state.showAssigneePreloader}
                                                onTextChange={this.onAssigneeSearch.bind(this)}
                                                resultChips={this.state.assigneeSearchResult}
                                                selectedChips={this.state.selectedAssigneesList}
                                                onItemSelect={this.onAssigneeItemSelect.bind(this)}
                                                onDeleteChip={this.onDeleteAssigneeUser.bind(this)}
                                                disableShowSelected
                                            />
                                        </div>
                                }
                                {
                                    this.assignStatuses.includes(this.props.activity.status) &&
                                        <div className="action-btns">
                                            
                                            {/* {
                                                (this.props.activity.status == 'ASSIGNED' || this.props.activity.status == 'UNASSIGNED') && */}
                                                    <div className="action-btn" onClick={this.onCancelAssignees.bind(this)}>Cancel</div>
                                            {/* }
                                            {
                                                (this.props.activity.status == 'ASSIGNED' || this.props.activity.status == 'UNASSIGNED') && */}
                                                    <div className="action-btn" onClick={this.onAssignUsers.bind(this)}>Assign</div>   
                                            {/* } */}
                                            {
                                                this.props.activity.status == 'ASSIGNED' &&
                                                    <div className="action-btn reject" onClick={this.onClubReject.bind(this)}>Reject</div>
                                            }
                                            {
                                                this.props.activity.status == 'ASSIGNED' &&
                                                    <div className="action-btn approve" onClick={this.onClubApprove.bind(this)}>Approve</div>
                                            }                         
                                        </div>
                                }
                            </div>
                    }
                    {
                        this.props.role == 'ROLE_RIVER_COUNCIL' &&
                            <div className="role-actions">
                                <div className="action-btns">
                                    {
                                        this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                            <div className="action-btn" onClick={this.onCouncilAcceptActivity.bind(this)}>Accept</div>
                                    }
                                    {
                                        this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                            <div className="action-btn" onClick={this.onCouncilRejectActivity.bind(this)}>Reject</div>
                                    }
                                </div>
                            </div>
                    }
                </div>
                <div className="action-container">
                    {Util.hasPrivilage(PRIVILEGE_DELETE_ACTIVITY) &&
                        <Icon className="gen-icon" title="Delete Activity" onClick={ this.handleDeleteClick.bind(this, this.props.activity)}>delete</Icon>
                    }
                    {/* <Button
                        title="Edit Activity"
                        className="w-full action-btn"
                        onClick={ this.handleEditActivityClick.bind(this, this.props.activity)}
                    >
                        <Icon className="gen-icon">edit</Icon>
                    </Button> */}
                </div>
            </div>
        )
    }

    onCancelAssignees() {
        this.setState({ selectedAssigneesList: [] });
    }

    onAssignUsers() {
        let userList = this.state.selectedAssigneesList.map((assignee) => assignee.assignee.id);

        this.assignActivity(this.props.activity.id, userList);
    }

    onAssigneeItemSelect(item) {
        this.setState({ assigneeSearchResult: []});
        const selectedAssignees = this.state.selectedAssigneesList;
        let isChipExists = false;
        
        selectedAssignees.forEach((element) => {
            if (element.assignee.userId === item.id) {
                isChipExists = true;
            }
        }, this);

        this.state.assigneesList.forEach((element) => {
            if (element.assignee.userId === item.id) {
                isChipExists = true;
            }
        }, this);

        if (!isChipExists) {
            selectedAssignees.push({assignee: {...item, userId: item.id}, userDone: false});
            this.setState({ selectedAssigneesList: selectedAssignees});
        } else {
            riverToast.show("The user has been already assigned")
        }
    }

    onAssigneeSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showAssigneePreloader: true});
            ActivitiesService.searchUser(searchText)
                .then((data) => {
                    if (data) {
                        this.setState({ 
                            ...this.state,
                            assigneeSearchResult: data,
                            showAssigneePreloader: false
                        });
                    } else {
                        this.setState({showAssigneePreloader: false});                        
                    }
                })
                .catch((error) => {
                    this.setState({showAssigneePreloader: false});
                    riverToast.show(error.status_message);
                });
        } else if (searchText.length < 3){
            this.setState({
                ...this.state,
                showAssigneePreloader: false,
                assigneeSearchResult: []
            });            
        }
    }

    onDeleteAssigneeUser(item) {
        const selectedUsers = this.state.selectedAssigneesList;
        let selectedIndex = -1;
        this.state.selectedAssigneesList.forEach(function(element, index) {
            if (element.assignee.userId == item.assignee.userId) {
                selectedIndex = index;
            }
        }, this);
        selectedUsers.splice(selectedIndex, 1);
        this.setState({ selectedAssigneesList: selectedUsers});
    }

    onDeleteAlreadyAssignedUser(item) {
        if(confirm("Are you sure to unassign " + item.assignee.fullname +" from the activity " + this.props.activity.title + "?")) {
            ActivitiesService.unassignUser(this.props.activity.id, {users: [item.assignee.userId]})
            .then((data) => {
                riverToast.show("Unassigned to user successfully");
                this.props.onActivityChanges(data, this.props.index);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while unassigning");
            });
        }
    }

    onClubReject() {
        if(confirm("Are you sure about rejecting activity " + this.props.activity.title + "?")){

            ActivitiesService.clubRejectActivity(this.props.activity.id)
            .then((data) => {
                this.props.onActivityChanges(data, this.props.index);                
                this.setState({
                    ...this.state,
                    assigneeSearchResult: [],
                    selectedAssigneesList: [],
                });
            })
            .catch((error) => {
                this.setState({showAssigneePreloader: false});
                riverToast.show(error.status_message);
            });
        }
    }

    onClubApprove() {
        if(this.state.assigneesList.length > 0){
            if(confirm("Are you sure about approving activity " + this.props.activity.title + "?")){
                let users = [];
                this.state.assigneesList.forEach((user) => {
                    if(user.userDone)
                        users.push(user.assignee.assigneeId);
                });
    
                ActivitiesService.clubApproveActivity(this.props.activity.id, {"message": "", "approved": users})
                .then((data) => {
                    this.props.onActivityChanges(data, this.props.index);                    
                    this.setState({
                        ...this.state,
                        assigneeSearchResult: [],
                        selectedAssigneesList: [],
                    });
                })
                .catch((error) => {
                    this.setState({showAssigneePreloader: false});
                    riverToast.show(error.status_message);
                });
            }
        } else {
            riverToast.show("Sorry, no assignees found");
        }
    }

    onCouncilAcceptActivity() {
        this.props.onCouncilAcceptActivity(this.props.activity, this.props.index);
        // if(confirm("Are you sure about approving activity " + this.props.activity.title + "?")){
        // }
    }

    onCouncilRejectActivity() {
        if(confirm("Are you sure about rejecting activity " + this.props.activity.title + "?")){
            ActivitiesService.councilRejectActivity(this.props.activity.id)
            .then((data) => {
                this.props.onActivityChanges(data, this.props.index);
            })
            .catch((error) => {
                riverToast.show(error.status_message);
            });
        }
    }

    assignActivity(activityId, assignees, year = '2018') {
        let request = {users: assignees, year: year};
        ActivitiesService.assignActivity(activityId, request)
        .then((data) => {
            riverToast.show("Assigned to activity successfully");
            this.props.onActivityChanges(data, this.props.index);
            this.setState({
                ...this.state,
                assigneeSearchResult: [],
                selectedAssigneesList: [],
            });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while finishing club settings");
        });
    }

    handleDeleteClick(activity, event) {
        this.props.deleteCallback(activity);
    }

    handleViewActivityClick(activity, index) {
        this.props.viewCallback(activity, index);
    }   

    handleEditActivityClick(activity, event) {
        this.props.editCallback(activity);
    }
}