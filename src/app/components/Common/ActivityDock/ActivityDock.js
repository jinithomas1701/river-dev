import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Slider from 'react-rangeslider'
import { CircularProgress } from 'material-ui/Progress';

import {CommentItem} from '../../Common/CommentItem/CommentItem';
import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {riverToast} from '../../Common/Toast/Toast';

// css
import './ActivityDock.scss';

import { ActivityDockService } from './ActivityDock.service';
import {Util} from "../../../Util/util";

class ActivityDock extends Component {
    state = {
        showAssigneePreloader: false,
        assigneeSearchResult: [],
        assigneeChipSearchResult: [],
        selectedAssigneeChips: [],
        assigneesList: [],
        selectedAssigneesList: [],
        memberPointPercentageValues: [],
        activityComment: '',
        isCouncilApprove: false,
        commentValue: '',
        commentsList: [],
        clubPointPercentage: undefined
    }
    commentSkipCount = 0;
    commentSize = 5;
    currentUser = Util.getLoggedInUserDetails();
    imageBase64ArrayList = [];

    addAssigneePermissions = ['UNASSIGNED', 'ASSIGNED'];

    componentDidMount() {
        if (this.props.activity && this.props.activity.assignees) {
            let list = this.props.activity.assignees.slice();
            this.setState({ assigneesList: list }, () => {this.initActivity()})
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
                isCouncilApprove: this.props.isCouncilApprove,
                commentValue: '',
                commentsList: []
            }, () => {this.initActivity()});
            this.state.commentsList = [];
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
                            (assignee.documents && assignee.documents.length > 0) &&
                                <div className="activity-docs">
                                    {
                                        assignee.documents.map((item, index) => {
                                            return  <div key={index} className="doc-item" onClick={this.downloadFile.bind(this, item.name, item.type, item.content)}>
                                                        {
                                                            (item.type && item.type.startsWith('image')) ?
                                                                <img key={index} className="doc-img" style={{"width":"2rem","height":"2rem"}} src={("data:image/jpeg;base64,") + (item.content)}/>
                                                            :
                                                                <Icon className="doc-icon">insert_drive_file</Icon>
                                                        }
                                                    </div>
                                        })
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
            return  assignee.userDone ?
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
                                                value={typeof this.state.memberPointPercentageValues[index] != "undefined" ? this.state.memberPointPercentageValues[index] : 100}
                                                orientation='horizontal'
                                                onChange={this.handleMemberPointChange.bind(this, index)}
                                                />
                                            <div className="limit right">100%</div>
                                        </div>
                                    </div>
                            }
                            {
                                (assignee.documents && assignee.documents.length > 0) &&
                                    <div className="activity-docs">
                                        {
                                            assignee.documents.map((item, index) => {
                                                return  <div key={index} className="doc-item" onClick={this.downloadFile.bind(this, item.name, item.type, item.content)}>
                                                            {
                                                                (item.type && item.type.startsWith('image')) ?
                                                                    <img key={index} className="doc-img" style={{"width":"2rem","height":"2rem"}} src={("data:image/jpeg;base64,") + (item.content)}/>
                                                                :
                                                                    <Icon className="doc-icon">insert_drive_file</Icon>
                                                            }
                                                        </div>
                                            })
                                        }
                                    </div>
                            }
                        </div>
                    :
                        false;
        });

        const comments = this.state.commentsList.map((comment, index) => {
            return <CommentItem key={index} commentItem={comment}/>
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
                    this.state.isCouncilApprove &&
                        <div className="club-point-slider">
                            <div className="title">Select club point range:</div>
                            <div className="points-container">
                                <div className="limit left">0%</div>
                                <Slider
                                    className="slider"
                                    min={0}
                                    max={100}
                                    value={this.state.clubPointPercentage}
                                    orientation='horizontal'
                                    onChange={this.handleClubPointChange.bind(this)}
                                />
                                <div className="limit right">100%</div>
                            </div>
                        </div>
                }
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
                                                    <Button raised color="primary" onClick={this.handleAssignUsers.bind(this)}>Assign</Button>
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
                    this.props.role == 'ROLE_RIVER_COUNCIL' && 
                        (
                            this.state.isCouncilApprove ?
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
                        )
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
                {
                    <div className="activity-action-section-container">
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
                                <div className="activity-comment-list-container">
                                    {comments}
                                </div>
                                {(this.props.activity.commentsCount > 2 && !this.state.fullCommentLoaded) && 
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
                }
                <a style={{"display":"none"}} id="download-anchor"/>
            </div>
        );
    }

    handleChange = (name) => (event) => {
        this.setState({ [name] : event.target.value });
    }


    handleMemberPointChange = (index, value) => {
        const pointRange = this.state.memberPointPercentageValues;
        pointRange[index] = value;
        this.setState({
            ...this.state,
            memberPointPercentageValues: pointRange
        })
    }

    handleClubPointChange = (value) => {
        const pointRange = this.state.clubPointPercentage;
        this.setState({
            ...this.state,
            clubPointPercentage: value
        })
    }

    handleCouncilAcceptActivity() {
        this.setState({
            ...this.state,
            isCouncilApprove: true,
            activityComment: ''
        })
    }

    handleOnComment(event) {
        if(event.key == 'Enter'){
            this.postCommentTask(this.state.commentValue, this.props.activity);
        }
    }

    downloadFile(name, type, base64) {
        let file = "data:" + (type || 'file/text') + ";base64," + base64;

        var dlnk = document.getElementById('download-anchor');
        dlnk.download = name;
        dlnk.href = file;

        dlnk.click();
    }

    postCommentTask(commentValue, activity) {
        if (commentValue.trim()) {
            const commentRequest = {
                value: commentValue,
                commentId: activity.commentId
            };
            ActivityDockService.postComment(commentRequest)
                .then(data => {
                    this.processOnCommentResponse(commentValue, activity.id);
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

    pushMoreComments(comments, firstSet) {
        if (comments && comments.length > 0) {
            const fullComment = this.state.commentsList.concat(comments);
            let fullCommentLoaded = false;
            if (fullComment.length >= this.props.activity.commentsCount) {
                fullCommentLoaded = true;
            }
            this.setState({
                ...this.state,
                commentsList: fullComment,
                fullCommentLoaded: fullCommentLoaded
            });
        } else if (comments && comments.length == 0 && firstSet) {
            this.setState({
                ...this.state,
                commentsList: fullComment,
                fullCommentLoaded: true
            });
        }
    }

    toggleLoadCommentLoader(value) {
        this.setState({
            ...this.state,
            commentPreloader: value
        });
    }

    loadMoreComments() {
        if (this.props.activity && this.props.activity.commentId) {
            this.toggleLoadCommentLoader(true);
            this.commentSkipCount = this.state.commentsList.length;
            ActivityDockService.loadMoreComments(this.props.activity.commentId, this.commentSkipCount, this.commentSize)
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

    initActivity() {
        // this.initDocs();
        this.initComments();
    }

    initDocs() {
        
    }

    initComments() {
        this.setState({
            ...this.state,
            commentsList: [],
            commentValue: ''
        });
        this.commentSkipCount = 0;
        this.commentSize = 5;
        this.currentUser = Util.getLoggedInUserDetails();
        this.imageBase64ArrayList = [];
        this.loadMoreComments();
    }

    handleAssignUsers() {
        let userList = this.state.selectedAssigneesList.map((assignee) => assignee.assignee.id);

        this.assignActivity(this.props.activity.id, userList);
    }

    assignActivity(activityId, assignees) {
        let request = {users: assignees, year: Util.getCurrentFinancialYear()};
        ActivityDockService.assignActivity(activityId, request)
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
            riverToast.show(error.status_message || "Something went wrong while assigning users");
        });
    }

    onAssigneeSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showAssigneePreloader: true});
            ActivityDockService.searchUser(searchText)
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
            ActivityDockService.unassignUser(this.props.activity.id, {users: [item.assignee.userId]})
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
    
                ActivityDockService.approveActivity(this.props.activity.id, {"message": "", "approved": users})
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

            ActivityDockService.rejectActivity(this.props.activity.id)
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
                percentage: typeof this.state.memberPointPercentageValues[index] != "undefined" ? this.state.memberPointPercentageValues[index] : 100
            });
        }, this);

        return userObjList;
    }

    setBase64ImageArray(imageArray) {
        const imageStringArray = [];
        this.imageBase64ArrayList = [];
        imageArray.forEach((image, index) => {
            Util.base64ImageFromFile(image)
            .then(result => {
                this.imageBase64ArrayList.push(result);
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

    getApproveCouncilObject() {
        return {
            "message":this.state.activityComment,
            "assigneePoints": this.getUserObject(),
            "clubPointPercentage": this.state.clubPointPercentage
        };
    }

    onCouncilAcceptActivity() {
        if (confirm("Do you want to approve these memebers ?")) {
            const approveRequest = this.getApproveCouncilObject();
            ActivityDockService.councilApproveActivity(this.props.activity.id, approveRequest)
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
            ActivityDockService.councilRejectActivity(this.props.activity.id)
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
            showAssigneePreloader: false,
            assigneeSearchResult: [],
            assigneeChipSearchResult: [],
            selectedAssigneeChips: [],
            assigneesList: [],
            selectedAssigneesList: [],
            memberPointPercentageValues: [],
            activityComment: '',
            isCouncilApprove: false,
            commentsList: [],
            commentValue: ''
        })
        this.props.closeDock()
    }
}

export default ActivityDock;
