import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';

import { riverToast } from '../../../Common/Toast/Toast';

import './AssignedDetailDock.scss';
import { Util } from '../../../../Util/util';
import { CommonService } from '../../../Layout/Common.service';
import { Discussion } from '../../../Common/Discussion/Discussion';
import { CommonDashboardService } from '../../CommonDashboard.service';
import ActivityTileService from '../ActivityTile.service';

export default class AssignedDetailDock extends Component {
    state = {
        disscussionSubmitProgress: false,
        activityDiscussions: []
    };

render () {
    const { activity } = this.props;
    let assignees;
    let approvers;
    if (activity && activity.assignees && activity.assignees.length > 0) {
        assignees = activity.assignees.map((assigne, index) => {
            let attachments;
            if (assigne && assigne.attachments && assigne.attachments.length > 0) {
                attachments = assigne.attachments.map((attachment, index) => {
                    return <div className="attachment" onClick={() => this.downloadFile(attachment.name, attachment.path, attachment.mimeType)}>
                        <Icon>attach_file</Icon>
                        <div className="text">{attachment.name}</div>
                    </div>
                });
            }
            return <div className="assginee-card">
                <div className="header">
                    <div className="user-details">
                        <Icon>person</Icon>
                        <div className="name">{assigne.name} {assigne.clubName ? '('+assigne.clubName+')': ''}</div>
                    </div>
                    <div className="status">
                        <div className="label">Status : </div>
                        <div className="value">{this.getAssigneeActivityStatus(assigne.status)}</div>
                    </div>
                </div>
                <div className="secondary-header">
                    <div className="point-wrapper">
                        <Icon>person</Icon>
                        <div className="value">{assigne.pointsObtained}</div>
                    </div>
                </div>
                <div className="attachment-container">
                    {attachments}
                </div>
                {assigne.justification &&
                    <div title="Justification by User" className="user-comment-container">{assigne.justification}</div>
                }

            </div>;
        });
    }
    if (activity && activity.approveInfo && activity.approveInfo.length > 0) {
        approvers = activity.approveInfo.map((approver, index) => {
            let headClassName='';
            if (approver.approved) {
                headClassName = 'approved';
            } else if (approver.rejected) {
                headClassName = 'rejected';
            } else {
                headClassName = 'idle';
            }
            return <div className="chip-item">
                <div className={"head "+headClassName}>
                    {approver.approved &&
                        <Icon>check</Icon>
                    }
                    {approver.rejected &&
                        <Icon>clear</Icon>
                    }
                    {!approver.rejected && !approver.approved &&
                        <Icon>more_horiz</Icon>
                    }
                </div>
                <div className="tail">{approver.name}</div>
            </div>
        });
    }

    if(!activity){
        return (<div>loading...</div>);
    }

    return (
        <div className="dashboard-assigned-detail-dock-container">
            <div className="close-container" onClick={() => this.props.onCloseDock()}>
                <Icon>clear</Icon>
                <div className="close-text">Close</div>
            </div>
            <div className="progress-container-dock">
                <div className="status-progress-wrapper">
                    <div className="status-line"></div>
                    {this.renderAcivityStatus(activity.status)}
                </div>
            </div>
            <div className="activity-primary-details">
                <div className="main-head">{activity.title || ''}</div>
            </div>
            <div className="activity-primary-details">
                {activity.description &&
                    <div className="description">
                        {activity.description}
                    </div>
                }
                {activity.category &&
                    <div className="category">
                        <div className="label">Category</div>
                        <div className="value">{activity.category.label}</div>
                    </div>
                }
                {activity.referenceId &&
                    <div className="category">
                        <div className="label">Reference Id</div>
                        <div className="value">{activity.referenceId}</div>
                    </div>
                }
            </div>
            {approvers &&
                <div className="activity-primary-details">
                    <div className="mini-title">Approvers (Panel)</div>
                    <div className="chip-container">
                        {approvers}
                    </div>
                </div>
            }
            <div className="activity-primary-details">
                {assignees}
            </div>
            <div className="activity-discussion">
                <Discussion 
                    submitInprogress={this.props.disscussionSubmitProgress}
                    height="45rem"
                    discussions={this.props.discussions}
                    onSubmitMessage={this.onSubmitMessage.bind(this)}
                    />
            </div>
            <a style={{"display":"none"}} id="download-anchor" ></a>
        </div>
    );
}

onSubmitMessage(message) {
    this.props.onSubmitDiscussionMessage(message);
}

downloadFile(name = '', path = '', mimeType = '') {
    CommonService.downloadFromUrl(path)
        .then(blob => {
        const dlnk = document.getElementById('download-anchor');
        const objectUrl = window.URL.createObjectURL(blob);
        dlnk.href = objectUrl;
        dlnk.target = '_blank';
        dlnk.download = name;
        dlnk.click();
        window.URL.revokeObjectURL(objectUrl);
    })
        .catch(error => {
        console.log(error);
        riverToast.show(error.status_message || 'Something went wrong while downloading file.');
    });
}

getAssigneeActivityStatus(statusCode) {
    let statusText = '';
    if (statusCode == 'D') {
        statusText = 'Deleted';
    } else if (statusCode == 'A') {
        statusText = 'Assigned';
    } else if (statusCode == 'C') {
        statusText = 'Completed';
    }

    return statusText;
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
    if (statusCode) {
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
                    if (isCurrent == true) {
                        if (statusCode != 'PC') {
                            isVisualCurrent = true;
                        }
                    } else {
                        isVisualCurrent = false;
                    }
                }
            } else {
                prevOrder = status.order;
                element = '';
            }

            return element;
        });
    }

    return statusElement;
}
}