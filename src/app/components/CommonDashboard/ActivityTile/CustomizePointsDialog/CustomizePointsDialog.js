import React from "react";
import Button from 'material-ui/Button';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import ClubInput from '../../../Common/ClubInput/ClubInput';
import ActivityTileService from '../ActivityTile.service';

import './CustomizePointsDialog.scss';
import { Util } from "../../../../Util/util";
import { Avatar, Icon } from "material-ui";
import { Toast, riverToast } from '../../../Common/Toast/Toast';

export default class CustomizePointsDialog extends React.Component {

    state = {
        assignees: [],
        clubs: [],
        pointHistory: [],
        isChangeHistoryVisible: false,
        justification: ''
    };

constructor(props) {
    super(props);
}

componentDidUpdate(prevProps, prevState) {
    if (!prevProps.open && this.props.open) {

        const {pointMatrix} = this.props;
        this.setState({assignees: pointMatrix.assignees});
        this.setState({clubs: pointMatrix.clubs});
    }
}

render() {
    let assigneesList;
    let clubList;
    let pointRows;
    const {assignees, clubs, pointHistory} = this.state;
    const { activity } = this.props;
    const currentRole = Util.getActiveRole().value;
    const enableEditing = (activity.status == 'C' && currentRole == 'ROLE_CLUB_PRESIDENT') || (activity.status == 'PA' && currentRole == 'ROLE_RIVER_COUNCIL');

    if (assignees && assignees.length > 0) {
        assigneesList = assignees.map((assignee, index) => {
            return <div className="list-item" key={index}>
                <div className="head-container">
                    <div className="thumbnail">
                        { assignee.avatar ?
                            <img src={Util.getFullImageUrl(assignee.avatar)} className="usercard-img"/>:
                            <Avatar>{assignee.name.charAt(0)}</Avatar>
                        }
                    </div>
                    <div className="info">
                        <div className="name">{assignee.name}</div>
                        <div className="email">{assignee.email}</div>
                    </div>
                </div>
                <div className="tail-container">
                    <ClubInput className="point-value" placeholder="Point" onChange={(e) => this.handlePointValue('assignees', assignee, "id",e.target.value)} value={assignee.calculatedPoints} disabled={!enableEditing} />
                    { assignee.calculatedPoints != assignee.defaultPoints ?
                        <div className="old-point">{assignee.defaultPoints}</div>: ''
                    }
                </div>
            </div>
        });
    }
    if (clubs && clubs.length > 0) {
        clubList = clubs.map((club, index) => {
            return <div className="list-item" key={index}>
                <div className="head-container">
                    <div className="thumbnail">
                        { club.avatar ?
                            <img src={Util.getFullImageUrl(club.avatar)} className="usercard-img"/>:
                            <Avatar>{club.name.charAt(0)}</Avatar>
                        }
                    </div>
                    <div className="info">
                        <div className="name">{club.name}</div>
                        <div className="email">CLUB</div>
                    </div>
                </div>
                <div className="tail-container">
                    <ClubInput className="point-value" placeholder="Point" onChange={(e) => this.handlePointValue('clubs', club, "id", e.target.value)} value={club.calculatedPoints} disabled={!enableEditing} />
                    { club.calculatedPoints != club.defaultPoints ?
                        <div className="old-point">{club.defaultPoints}</div>: ''
                    }
                </div>
            </div>
        });
    }

    if (pointHistory && pointHistory.length > 0) {
        pointRows = pointHistory.map((history, historyIndex) => {
            let rows = history.rows.map((row, index) => {
                return <div className="row" key={index}>
                    <div className="title">
                        <div className="type">{row.type == 'C' ? 'club':'member'}</div>
                        <div className="name">{row.title}</div>
                    </div>
                    <div className="value">
                        <div className="new">{row.newValue}</div>
                        <div className="old">{row.oldValue}</div>
                    </div>
                </div>
            });

            return <div className="point-card" key={historyIndex}>
                <div className="head">
                    <div className="small-title">Changed by : {history.changedBy}</div>
                    <div className="small-title">On : {Util.getDateStringFromTimestamp(history.changedOn)}</div>
                </div>
                <div className="change-history">
                    {rows}
                </div>
                {history.justification ?
                    <div className="justification-wrapper">
                        <div className="title">Justification</div>
                        <div className="justification">
                            {history.justification}
                        </div>
                    </div>:''
                }
            </div>
        });
    } else {
        pointRows = <div className="empty-history">No history found</div>
    }

    return ( 
        <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="customize-points-dialog-container">
            {this.state.isChangeHistoryVisible ?
                <div className="overlay"></div>:''
            }
            {this.state.isChangeHistoryVisible ?
                <div className="dialog-side-dock">
                    <div className="head">
                        <div className="title">POINT HISTORY</div>
                        <div className="action">
                            <Icon onClick={this.closeHistory.bind(this)}>clear</Icon>
                        </div>
                    </div>
                    <div className="content">
                        {pointRows}
                    </div>
                </div>:''
            }
            <DialogContent>
                <div className="customize-points-header-container">
                    <div>CUSTOMIZE POINTS</div>
                    <div className="link" onClick={this.viewActivityDetail.bind(this)}>View activity detail</div>
                    <div className="link" onClick={this.viewActivityPointHistory.bind(this)}>View point history</div>
                </div>
                <div className="customize-points-body-container">
                    {/* <div className="small-desc">Please use t</div> */}
                    <div className="list-container">
                        {assigneesList}
                        {clubList}
                    </div>
                </div>
                {(activity.status == 'C' && currentRole == 'ROLE_CLUB_PRESIDENT') || (activity.status == 'PA' && currentRole == 'ROLE_RIVER_COUNCIL') ?
                    <div className="justification-wrapper">
                        <textarea placeholder="Justification" className="desc-field" value={this.state.justification} onChange={(e) => {this.setState({'justification': e.target.value})}}></textarea>
                    </div>:''
                }
            </DialogContent>
            {(activity.status == 'C' && currentRole == 'ROLE_CLUB_PRESIDENT') || (activity.status == 'PA' && currentRole == 'ROLE_RIVER_COUNCIL') ?
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="primary">
                        CANCEL
                    </Button>
                    <Button raised onClick={this.onOK.bind(this)} color="primary">
                        SAVE
                    </Button>
                </DialogActions>:
                <DialogActions>
                <Button onClick={this.handleRequestClose.bind(this)} color="primary">
                    CLOSE
                </Button>
            </DialogActions>
            }
        </Dialog>
    );
}

handlePointValue(label, assignee, uniqueId, point) {
    const list = this.state[label];
    list.forEach((item, index) => {
        if (item[uniqueId] == assignee[uniqueId]) {
            item.calculatedPoints = point;
        }
    });
    if (label == 'clubs') {
        this.setState({clubs: list});
    } else {
        this.setState({assignees: list});
    }
}

handleRequestClose(event, list = false, viewDetail = false) {
    this.props.onRequestClose(list, viewDetail);
}

ValidateCustomizationForm(){
    let isValid = true;
    if(!this.state.justification){
        isValid = false;
        riverToast.show("Please provide a justification text.");
    }
    return isValid;
}

onOK(){
    const isValid = this.ValidateCustomizationForm();
    if(!isValid){
        return;
    }
    const pointMatrixResponse = {
        clubPoints: [],
        assigneePoints: [],
        justification: this.state.justification || ''
    };

    this.state.assignees.forEach(assignee => {
        pointMatrixResponse.assigneePoints.push({
            id: assignee.id,
            point: assignee.calculatedPoints
        });
    });
    this.state.clubs.forEach(club => {
        pointMatrixResponse.clubPoints.push({
            id: club.id,
            point: club.calculatedPoints
        });
    });

    this.handleRequestClose(null, pointMatrixResponse); 
}

closeHistory() {
    this.setState({isChangeHistoryVisible: false});
}

viewActivityDetail() {
    this.handleRequestClose(null, false, true);
}

viewActivityPointHistory() {
    const { masterActivity, activity } = this.props;
    ActivityTileService.viewActivityPointHistory(masterActivity.id, activity.id)
        .then((data) => {
        this.setState({pointHistory: data});
        this.setState({isChangeHistoryVisible: true});
    })
        .catch((err) => {
        console.log(err);
        riverToast.show(err.status_message || 'Something went wrong while getting activity history');
    })
}
}