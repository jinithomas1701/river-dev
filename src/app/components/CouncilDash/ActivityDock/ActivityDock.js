import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {riverToast} from '../../Common/Toast/Toast';

// css
import './ActivityDock.scss';

import { CommonDashboardService } from '../CommonDashboard.service';

class ActivityDock extends Component {
    state = {
        showAssigneePreloader: false,
        assigneeSearchResult: [],
        assigneeChipSearchResult: [],
        selectedAssigneeChips: [],
        assigneesList: [],
        selectedAssigneesList: []
    }

    addAssigneePermissions = ['UNASSIGNED', 'ASSIGNED'];

    componentDidMount() {
        if (this.props.activity && this.props.activity.assignees) {
            let list = this.props.activity.assignees.slice();
            this.setState({ assigneesList: list })
        }
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
                assigneesList: list
            });
        }
    }

    render() {

        const assigneesList = this.state.assigneesList.map((assignee, index) => {
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
                </div>
                {
                    (this.props.activity.assignees.length > 0 || this.addAssigneePermissions.includes(this.props.activity.status)) &&
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
                                                    <Button raised color="primary">Assign</Button>
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
                                        {assigneesList}
                                    </div>
                            }
                        </div>
                }
            </div>
        );
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

    onCloseDock() {
        this.props.closeDock()
    }
}

export default ActivityDock;
