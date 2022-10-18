import React, { Component } from 'react';
import Icon from 'material-ui/Icon';

import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import { CommonDashboardService } from '../CommonDashboard.service';
import {riverToast} from '../../Common/Toast/Toast';

// css
import './ActivityItem.scss';

class ActivityItem extends Component {
    state = {
        showAssigneePreloader: false,
        assigneeSearchResult: [],
        selectedAssigneesList: [],
        assigneesList: []
    };
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

    render() {
        return (
            <div className="activity-item">
                <div className="activity-details">
                    <div className="infos">
                        <div className="datas">
                            <div
                                className="title"
                                onClick={this.onActivityClick.bind(this, this.props.activity, this.props.index)}
                            >
                                {this.props.activity.title}
                            </div>
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
                                                        !assignee.userDone ?
                                                            this.props.role == 'ROLE_CLUB_PRESIDENT' &&
                                                                <span className="delete-assignee" onClick={this.onDeleteAlreadyAssignedUser.bind(this, assignee)}><Icon className="icon">close</Icon></span>
                                                        :
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
                                                    <span className="delete-assignee" onClick={this.onDeleteAssigneeUser.bind(this, assignee)}><Icon className="icon">close</Icon></span>
                                                </div>
                                    })
                            }
                        </div>
                    </div>
                    {
                        this.props.role == 'ROLE_CLUB_PRESIDENT' &&
                            <div className="assign-user">
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
                            </div>
                    }
                    {
                        this.props.role == 'ROLE_RIVER_COUNCIL' &&
                            <div className="action-btns">
                                {
                                    this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                    <div className="action-btn approve" onClick={this.onCouncilAcceptActivity.bind(this)}>Approve</div>
                                }                         
                                {
                                    this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                        <div className="action-btn reject" onClick={this.onCouncilRejectActivity.bind(this)}>Reject</div>
                                }
                        </div>
                    }
                </div>
                
            </div>
        );
    }

    onCancelAssignees() {
        this.setState({ selectedAssigneesList: [] });
    }

    onAssignUsers() {
        let userList = this.state.selectedAssigneesList.map((assignee) => assignee.assignee.id);

        this.assignActivity(this.props.activity.id, userList);
    }

    assignActivity(activityId, assignees, year = '2018') {
        let request = {users: assignees, year: year};
        CommonDashboardService.assignActivity(activityId, request)
        .then((data) => {
            riverToast.show("Assigned to activity successfully");
            this.props.onAssignUsers(data, this.props.index);
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

    onAssigneeSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showAssigneePreloader: true});
            CommonDashboardService.searchUser(searchText)
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
        } else if (searchText.length <= 0){
            this.setState({
                ...this.state,
                showAssigneePreloader: false,
                assigneeSearchResult: []
            });            
        }
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
            CommonDashboardService.unassignUser(this.props.activity.id, {users: [item.assignee.userId]})
            .then((data) => {
                riverToast.show("Unassigned to user successfully");
                this.props.onAssignUsers(data, this.props.index);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while unassigning");
            });
        }
    }

    onClubReject() {
        if(confirm("Are you sure about rejecting activity " + this.props.activity.title + "?")){

            CommonDashboardService.rejectActivity(this.props.activity.id)
            .then((data) => {
                this.props.onAssignUsers(data, this.props.index);                
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
                        users.push(user.assignee.userId);
                });
    
                CommonDashboardService.approveActivity(this.props.activity.id, {"message": "", "approved": users})
                .then((data) => {
                    this.props.onAssignUsers(data, this.props.index);                    
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
    }

    onCouncilRejectActivity() {
        if(confirm("Are you sure about rejecting activity " + this.props.activity.title + "?")){
            CommonDashboardService.councilRejectActivity(this.props.activity.id)
            .then((data) => {
                this.props.onAssignUsers(data, this.props.index);
            })
            .catch((error) => {
                riverToast.show(error.status_message);
            });
        }
    }

    onActivityClick(item, index) {
        this.props.onActivityItemClick(item, index);
    }
}

export default ActivityItem;