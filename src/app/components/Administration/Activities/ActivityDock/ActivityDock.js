import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Slider from 'react-rangeslider'

import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {riverToast} from '../../../Common/Toast/Toast';

// css
import './ActivityDock.scss';

import { ActivitiesService } from "../Activities.service";

class ActivityDock extends Component {
    state = {
        isCouncilApprove: false,
        showAssigneePreloader: false,
        assigneeSearchResult: [],
        assigneeChipSearchResult: [],
        selectedAssigneeChips: [],
        assigneesList: [],
        selectedAssigneesList: [],
        activityComment: '',
        pointPercentageValues: []
    }

    addAssigneePermissions = ['UNASSIGNED', 'ASSIGNED'];
    
    componentDidMount() {
        if (this.props.activity && this.props.activity.assignees) {
            let list = this.props.activity.assignees.slice();
            this.setState({ assigneesList: list })
        }
        this.setState({ isCouncilApprove: this.props.isCouncilApprove });
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activity != this.props.activity) {
            let list = this.props.activity.assignees.slice();
            this.setState({ 
                ...this.state,
                showAssigneePreloader: false,
                assigneeSearchResult: [],
                assigneeChipSearchResult: [],
                selectedAssigneeChips: [],
                assigneesList: [],
                selectedAssigneesList: [],
                assigneesList: list,
                isCouncilApprove: this.props.isCouncilApprove
            });
        }
    }

    render() {
        const assigneesListClub = this.state.assigneesList.map((assignee, index) => {
            return  <div className="assignee" key={index}>
                        <div className="assignee-status">
                            {
                                assignee.userDone ?
                                    <Icon className="user-done">done</Icon>
                                :
                                    <Icon className="delete-user" onClick={this.onDeleteAlreadyAssignedUser.bind(this, assignee)}>delete</Icon>
                            }
                        </div>
                        <div className="name">{assignee.assignee.fullname}</div>
                        {
                            assignee.memberPoint &&
                                <div className="points">
                                    {
                                        assignee.memberPoint &&
                                            <div className="point member">
                                                <Icon className="point-icon">person</Icon>
                                                <div className="value">{assignee.memberPoint}</div>
                                            </div>
                                    }
                                    {
                                        assignee.clubPoint &&
                                            <div className="point club">
                                                <Icon className="point-icon">store</Icon>
                                                <div className="value">{assignee.clubPoint}</div>
                                            </div>
                                    }
                                </div>
                        }
                    </div>
        });

        const selectedAssigneesList = this.state.selectedAssigneesList.map((assignee, index) => {
            return  <div className="assignee" key={index}>
                        <div className="assignee-status">
                            {
                                assignee.userDone ?
                                    <Icon className="user-done">done</Icon>
                                :
                                    <Icon className="delete-user" onClick={this.onDeleteAssigneeUser.bind(this, assignee)}>delete</Icon>
                            }
                        </div>
                        <div className="name">{assignee.assignee.fullname}</div>
                    </div>
        });

        const assigneesListCouncil = this.state.assigneesList.map((assignee, index) => {
            return assignee.userDone ?
                        <div className="assignee" key={index}>
                            <div className="assignee-status">
                                {
                                    assignee.userDone &&
                                        <Icon className="user-done">done</Icon>
                                }
                            </div>
                            <div className="name">{assignee.assignee.fullname}</div>
                            {
                                assignee.memberPoint &&
                                    <div className="points">
                                        {
                                            assignee.memberPoint &&
                                                <div className="point member">
                                                    <Icon className="point-icon">person</Icon>
                                                    <div className="value">{assignee.memberPoint}</div>
                                                </div>
                                        }
                                        {
                                            assignee.clubPoint &&
                                                <div className="point club">
                                                    <Icon className="point-icon">store</Icon>
                                                    <div className="value">{assignee.clubPoint}</div>
                                                </div>
                                        }
                                    </div>
                            }
                            {
                                this.state.isCouncilApprove &&
                                    <div className="point-slider">
                                        <div className="point-slider-title">
                                            Select Point Range
                                        </div>
                                        <div className="points-container">
                                            <div className="limit left">0%</div>
                                            <Slider
                                                className="slider"
                                                min={0}
                                                max={100}
                                                value={typeof this.state.pointPercentageValues[index] != "undefined" ? this.state.pointPercentageValues[index] : 100}
                                                orientation='horizontal'
                                                onChange={this.handlePointChange.bind(this, index)}
                                                />
                                            <div className="limit right">100%</div>
                                        </div>
                                    </div>
                            }
                        </div>
                    :
                        false;
        });

        return (
            <div className="activity-view-dock">
                <div className="dock-actions" onClick={this.onCloseDock.bind(this)}><Icon>close</Icon> Close</div>
                <div className="title">
                    <div className="value">{this.props.activity.title}</div>
                </div>
                <div className="fy">
                    <span className="label">Effective on </span>
                    <span className="value">{this.props.activity.year} - {this.props.activity.year + 1}</span>                    
                </div>
                <div className="description">
                    <div className="label">Activity Description</div>
                    <div className="value">{this.props.activity.description}</div>
                </div>
                <div className="infos">
                    <div className="item">
                        <div className="label">Self Assignable</div>
                        <div className="value">{this.props.activity.selfAssignable ? "True" : "False"}</div>
                    </div>
                    <div className="item">
                        <div className="label">Focus Area</div>
                        <div className="value">{this.props.activity.focusArea ? this.props.activity.focusArea.title : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Club Points</div>
                        <div className="value">{this.props.activity.clubPoint}</div>
                    </div>
                    <div className="item">
                        <div className="label">Member Points</div>
                        <div className="value">{this.props.activity.memberPoint}</div>
                    </div>
                    <div className="item">
                        <div className="label">Status</div>
                        <div className="value">{this.props.activity.status}</div>
                    </div>
                </div>
                
                {
                    ((this.props.activity.assignees.length > 0 || this.addAssigneePermissions.includes(this.props.activity.status)) && this.props.role == 'ROLE_CLUB_PRESIDENT') &&
                        <div className="assignees-box">
                            <div className="title">Assignees</div>
                            {
                                this.addAssigneePermissions.includes(this.props.activity.status) &&
                                    <div className="assign-users-comps">
                                        <div className="comp">
                                            <UserChipMultiSelect 
                                                placeholder = "Assign to a member"
                                                customStyle = {{width : "100%"}}
                                                searchBoxClass = "assignees-multi-select"
                                                showPreloader={this.state.showAssigneePreloader}
                                                onTextChange={this.onAssigneeSearch.bind(this)}
                                                resultChips={this.state.assigneeSearchResult}
                                                selectedChips={this.state.selectedAssigneesList}
                                                onItemSelect={this.onAssigneeItemSelect.bind(this)}
                                                onDeleteChip={this.onDeleteAssigneeUser.bind(this)}
                                                disableShowSelected
                                            />
                                        </div>
                                        {
                                            this.state.selectedAssigneesList.length > 0 &&
                                                <div className="comp assign-btn">
                                                    <Button raised color="primary" onClick={this.onAssignUsers.bind(this)}>Assign</Button>
                                                </div>
                                        }
                                    </div>
                            }
                            {
                                this.state.selectedAssigneesList.length > 0 &&
                                    <div className="assignees">
                                        {selectedAssigneesList}
                                    </div>
                            }
                            {
                                this.state.assigneesList.length > 0 &&
                                    <div className="assignees">
                                        {assigneesListClub}
                                    </div>
                            }
                        </div>
                }
                {
                    (this.props.activity.assignees.length > 0  && this.props.role == 'ROLE_RIVER_COUNCIL') &&
                        <div className="assignees-box">
                            <div className="title">Assignees</div>
                            {
                                this.state.assigneesList.length > 0 &&
                                    <div className="assignees">
                                        {assigneesListCouncil}
                                    </div>
                            }
                        </div>
                }
                {
                    this.state.isCouncilApprove &&
                        <div className="comments">
                            <TextField
                                value={this.state.activityComment}
                                onChange={this.handleChange('activityComment')}
                                className="comment-field"
                                label="Comments"
                                placeholder="Comments"
                                margin="normal"
                                multiline
                            />
                        </div>
                }
                {
                    (this.props.role == 'ROLE_RIVER_COUNCIL' && this.state.isCouncilApprove && this.props.activity.status == 'PRESIDENT_ACCEPTED') ?
                        <div className="activity-actions">
                            {
                                this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                    <div className="action-btn" onClick={this.onCouncilAcceptActivity.bind(this)}>Accept</div>
                            }
                            {
                                this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                    <div className="action-btn" onClick={this.onCouncilRejectActivity.bind(this)}>Reject</div>
                            }
                        </div>
                    :
                        <div className="activity-actions">
                            {
                                this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                    <div className="action-btn" onClick={this.handleCouncilAcceptActivity.bind(this)}>Accept</div>
                            }
                            {
                                this.props.activity.status == 'PRESIDENT_ACCEPTED' &&
                                    <div className="action-btn" onClick={this.onCouncilRejectActivity.bind(this)}>Reject</div>
                            }
                        </div>
                }
                {
                    this.props.role == 'ROLE_CLUB_PRESIDENT' &&
                        <div className="activity-actions">
                                {
                                    this.props.activity.status == 'ASSIGNED' &&
                                        <div className="action-btn" onClick={this.onClubApproveActivity.bind(this)}>Accept</div>
                                }
                                {
                                    this.props.activity.status == 'ASSIGNED' &&
                                        <div className="action-btn" onClick={this.onClubRejectActivity.bind(this)}>Reject</div>
                                }
                        </div>
                }
            </div>
        );
    }

    handleChange = (name) => (event) => {
        this.setState({ [name] : event.target.value });
    }

    handlePointChange = (index, value) => {
        const pointRange = this.state.pointPercentageValues;
        pointRange[index] = value;
        this.setState({
            ...this.state,
            pointPercentageValues: pointRange
        })
    }

    handleCouncilAcceptActivity() {
        this.setState({
            ...this.state,
            isCouncilApprove: true,
            activityComment: ''
        })
    }

    onAssignUsers() {
        let userList = this.state.selectedAssigneesList.map((assignee) => assignee.assignee.id);

        this.assignActivity(this.props.activity.id, userList);
    }

    assignActivity(activityId, assignees, year = '2018') {
        let request = {users: assignees, year: year};
        ActivitiesService.assignActivity(activityId, request)
        .then((data) => {
            riverToast.show("Assigned to activity successfully");
            this.props.onActivityChanges(data, this.props.index, "dock");
            this.setState({
                ...this.state,
                assigneeSearchResult: [],
                selectedAssigneesList: [],
            });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while assigning activities");
        });
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
            ActivitiesService.unassignUser(this.props.activity.id, {users: [item.assignee.userId]})
            .then((data) => {
                riverToast.show("Unassigned to user successfully");
                this.props.onActivityChanges(data, this.props.index, "dock");
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while unassigning");
            });
        }
    }

    onClubApproveActivity() {
        if(this.state.assigneesList.length > 0){
            if(confirm("Are you sure about approving activity " + this.props.activity.title + "?")){
                let users = [];
                this.state.assigneesList.forEach((user) => {
                    if(user.userDone)
                        users.push(user.assignee.userId);
                });
    
                ActivitiesService.clubApproveActivity(this.props.activity.id, {"message": "", "approved": users})
                .then((data) => {
                    this.props.onActivityChanges(data, this.props.index, "dock");                    
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

    onClubRejectActivity() {
        if(confirm("Are you sure about rejecting activity " + this.props.activity.title + "?")){

            ActivitiesService.clubRejectActivity(this.props.activity.id)
            .then((data) => {
                this.props.onActivityChanges(data, this.props.index, "dock");                
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

    getUserObject() {
        const userObjList = [];
        this.state.assigneesList.forEach((assignee, index) => {
            if(assignee.userDone)
            userObjList.push({
                assigneeId: assignee.assignee.assigneeId,
                percentage: typeof this.state.pointPercentageValues[index] != "undefined" ? this.state.pointPercentageValues[index] : 100
            });
        }, this);

        return userObjList;
    }

    getApproveCouncilObject() {
        return {
            "message":this.state.activityComment,
            "assigneePoints": this.getUserObject()
        };
    }

    onCouncilAcceptActivity() {
        if (confirm("Do you want to approve these memebers ?")) {
            const approveRequest = this.getApproveCouncilObject(true);
            ActivitiesService.councilApproveActivity(this.props.activity.id, approveRequest)
                .then((data) => {
                    this.props.onActivityChanges(data, this.props.index, "dock");
                    this.setState({
                        isCouncilApprove: false
                    })
                })
                .catch((error) => {
                    riverToast.show(error.status_message);
                });
        }
    }

    onCouncilRejectActivity() {
        if(confirm("Are you sure about rejecting activity " + this.props.activity.title + "?")){
            ActivitiesService.councilRejectActivity(this.props.activity.id)
            .then((data) => {
                this.props.onActivityChanges(data, this.props.index, "dock");
            })
            .catch((error) => {
                riverToast.show(error.status_message);
            });
        }
    }

    onCloseDock() {
        this.setState({
            ...this.state,
            isCouncilApprove: false,
            showAssigneePreloader: false,
            assigneeSearchResult: [],
            assigneeChipSearchResult: [],
            selectedAssigneeChips: [],
            assigneesList: [],
            selectedAssigneesList: [],
            activityComment: '',
            pointPercentageValues: []
        })
        this.props.closeDock()
    }
}

export default ActivityDock;