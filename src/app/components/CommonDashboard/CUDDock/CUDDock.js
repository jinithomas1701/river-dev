import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';

import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {riverToast} from '../../Common/Toast/Toast';

// css
import './CUDDock.scss';

class CUDDock extends Component {
    render() {
        return (
            <div className="cud-view-dock">
                <div className="dock-actions" onClick={this.onCloseDock.bind(this)}><Icon>close</Icon> Close</div>
                <div className="title">
                    <div className="value">{this.props.cud.title}</div>
                </div>
                <div className="fy">
                    <span className="label">Created on </span>
                    <span className="value">{moment.unix(this.props.cud.createdDate / 1000).format("DD.MMM.YY HH:mm")}</span>                    
                </div>
                <div className="description">
                    <div className="label">CUD Description</div>
                    <div className="value">{this.props.cud.description}</div>
                </div>
                <div className="infos">
                    <div className="item">
                        <div className="label">Current Status</div>
                        <div className="value">{this.props.cud.councilActionStatus}</div>
                    </div>
                    <div className="item">
                        <div className="label">Club Name</div>
                        <div className="value">{this.props.cud.club ? this.props.cud.club.clubName : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Bucket Type</div>
                        <div className="value">{this.props.cud.bucket_type ? this.props.cud.bucket_type.title : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Panel Name</div>
                        <div className="value">{this.props.cud.council ? this.props.cud.council.name : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Panel Action Taken Date</div>
                        <div className="value">{moment.unix(this.props.cud.council_action_taken_date / 1000).format("DD.MMM.YY")}</div>
                    </div>
                    <div className="item">
                        <div className="label">Panel Action Taken By</div>
                        <div className="value">{this.props.cud.council_action_taken_member ? this.props.cud.council_action_taken_member.fullname : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Member Point</div>
                        <div className="value">{this.props.cud.memberPoint}</div>
                    </div>
                    <div className="item">
                        <div className="label">Club Point</div>
                        <div className="value">{this.props.cud.clubPoint}</div>
                    </div>
                    <div className="item">
                        <div className="label">Achievement Date</div>
                        <div className="value">{moment.unix(this.props.cud.achievementDate / 1000).format("DD.MMM.YY HH:mm")}</div>
                    </div>
                </div>
            </div>
        );
    }

    onCloseDock() {
        this.props.closeDock()
    }
}

export default CUDDock;