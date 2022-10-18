import React, { Component } from 'react';
import Icon from 'material-ui/Icon';

import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import { CommonDashboardService } from '../CommonDashboard.service';
import {riverToast} from '../../Common/Toast/Toast';

// css
import './ActivityItem.scss';

class ActivityItem extends Component {
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
                            <div className="points">
                                <div className="club point">
                                    Club Points: {this.props.activity.clubPoint}
                                </div>
                                <div className="member point">
                                    Member Points: {this.props.activity.memberPoint}
                                </div>
                            </div>
                        </div>
                        <div className="assignees-list">
                            {
                                this.state.assigneesList &&
                                    this.state.assigneesList.map((assignee, index) => {
                                        return <div className="assignee" key={index}>
                                                    <span className="assignee-name">{assignee.assignee.fullname}</span>
                                                    <span className="delete-assignee" onClick={this.onDeleteAlreadyAssignedUser.bind(this, assignee)}><Icon className="icon">delete</Icon></span>
                                                </div>
                                    })
                            }
                            {
                                this.state.selectedAssigneesList &&
                                    this.state.selectedAssigneesList.map((assignee, index) => {
                                        return <div className="assignee" key={index}>
                                                    <span className="assignee-name">{assignee.assignee.fullname}</span>
                                                    <span className="delete-assignee" onClick={this.onDeleteAssigneeUser.bind(this, assignee)}><Icon className="icon">delete</Icon></span>
                                                </div>
                                    })
                            }
                        </div>
                    </div>
                    <div className="assign-user">
                        <div className="select-assignee">
                            <UserChipMultiSelect
                                placeholder = "Assignees"
                                customStyle = {{width : "100%",fontSize:"0.75rem",textAlign:"center",padding:"0"}}
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
                        <div className="assignee-btns">
                            {
                                this.props.activity.status == 'ASSIGNED' &&
                                    <div className="assignee-btn reject">Reject</div>
                            }
                            {
                                this.props.activity.status == 'ASSIGNED' &&
                                    <div className="assignee-btn approve">Approve</div>
                            }
                            <div className="assignee-btn" onClick={this.onCancelAssignees.bind(this)}>Cancel</div>
                            <div className="assignee-btn" onClick={this.onAssignUsers.bind(this)}>Assign</div>                            
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }

    onCancelAssignees() {
        this.setState({ selectedAssigneesList: [] });
    }

    onAssignUsers() {
        let userList = this.state.selectedAssigneesList.map((assignee) => assignee.assignee.id);

        this.props.onAssignUsers(this.props.activity.id, userList)
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
        const selectedUsers = this.state.assigneesList;
        let selectedIndex = -1;
        this.state.assigneesList.forEach(function(element, index) {
            if (element.assignee.userId == item.assignee.userId) {
                selectedIndex = index;
            }
        }, this);
        selectedUsers.splice(selectedIndex, 1);
        this.setState({ assigneesList: selectedUsers});
    }

    onActivityClick(item, index) {
        this.props.onActivityItemClick(item, index);
    }
}

export default ActivityItem;