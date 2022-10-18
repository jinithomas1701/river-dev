import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';

import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {riverToast} from '../../Common/Toast/Toast';
import ClubSelect from '../../Common/ClubSelect/ClubSelect';
import {CommonDashboardService} from '../CommonDashboard.service';

// css
import './CommitmentDock.scss';

class CommitmentDock extends Component {
    state ={
        commitmentStatus: this.props.commitment.currentStatus
    };
    render() {
        return (
            <div className="commitment-view-dock">
                <div className="dock-actions" onClick={this.onCloseDock.bind(this)}><Icon>close</Icon> Close</div>
                <div className="delete-commitment" onClick={this.deleteCommimtment.bind(this)}><Icon>delete</Icon> Delete</div>
                <div className="title">
                    <div className="value">{this.props.commitment.title}</div>
                </div>
                <div className="fy">
                    <span className="label">Created on </span>
                    <span className="value">{moment.unix(this.props.commitment.createdDate / 1000).format("DD.MM.YY HH:mm")}</span>                    
                </div>
                <div className="description">
                    <div className="label">Commitment Description</div>
                    <div className="value">{this.props.commitment.description}</div>
                </div>
                <div className="infos">
                    <div className="item">
                        <div className="label">Current Status</div>
                        <div className="value">
                            <ClubSelect className="commitment-status-select" selected={this.state.commitmentStatus} placeholder="Status" source={this.normalizeStatusForCommitmentStatus()} onSelect={(value) => {
                                this.setState({commitmentStatus: value});
                                this.changeStatus(value);
                            }}/>
                        </div>
                        {/* <div className="value">{this.props.commitment.currentStatusName}</div> */}
                    </div>
                    <div className="item">
                        <div className="label">Club Name</div>
                        <div className="value">{this.props.commitment.club ? this.props.commitment.club.clubName : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Target Date</div>
                        <div className="value">{moment.unix(this.props.commitment.targetDate / 1000).format("DD.MM.YY HH:mm")}</div>
                    </div>
                </div>
            </div>
        );
    }

    normalizeStatusForCommitmentStatus() {
        const { statusList } = this.props;
        const normalizedList = [];
        statusList.forEach(status => {
            normalizedList.push({
                label: status.title,
                value: status.value
            });
        });
        return normalizedList;
    }

    onCloseDock() {
        this.props.closeDock()
    }

    changeStatus(statusValue) {
        const { commitment } = this.props;
        const request = {
            id: commitment.id,
            title: commitment.title,
            description: commitment.description, 
            targetDate: commitment.targetDate, 
            clubId: commitment.club.id,
            currentStatus: statusValue
        };

        CommonDashboardService.updateCommitmentStatus(request)
            .then(data => {
                this.props.onActionCompleted();
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || "Something went wrong while changing status");
            });
    }

    deleteCommimtment() {
        if (confirm('Do you want to delete this commitment?')) {
            const { commitment } = this.props;
            CommonDashboardService.deleteCommitment(commitment.id)
                .then(data => {
                    this.props.closeDock()
                    this.props.onActionCompleted();
                })
                .catch(error => {
                    console.log(error);
                    riverToast.show(error.status_message || "Something went wring while deleting commitment");
                });
        }
    }
}

export default CommitmentDock;