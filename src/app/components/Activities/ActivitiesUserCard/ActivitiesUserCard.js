import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import AddUser from 'material-ui-icons/PersonAdd';
import moment from 'moment';
import Tooltip from 'material-ui/Tooltip';
import {Util} from "../../../Util/util";

// css
import './ActivitiesUserCard.scss';

export class ActivitiesUserCard extends React.Component {
    render() {
        return (
            <div className="activityUserCard">
                <div className="activity-icon">
                    <Icon>directions_run</Icon>
                </div>
                <div className="title-container" onClick={this.handleClick.bind(this)}>
                    <div className="title" title="Activity Title">
                        {this.props.activity.title}
                    </div>
                    {
                        this.props.activity.year ?
                            <div className="date-container">
                                For financial year {this.props.activity.year}
                            </div>
                        : 
                            <div className="date-container">
                                Assigned on {Util.getDateStringFromTimestamp(this.props.activity.assignedOn)}
                            </div>
                    }
                </div>

                <div className="activities-infos">
                    {
                        this.props.activity.focusArea &&
                            <Tooltip title={"Focus Area: " + this.props.activity.focusArea.title}>
                                <Icon className="info-icon">directions_walk</Icon>
                            </Tooltip>
                    }
                    {
                        this.props.activity.description &&
                            <Tooltip title={"Description: " + this.props.activity.description}>
                                <Icon className="info-icon">description</Icon>
                            </Tooltip>
                    }
                    {
                        (this.props.activity.memberPoint || this.props.activity.memberPoint == 0) &&
                            <Tooltip title={"User Points: " + this.props.activity.memberPoint}>
                                <Icon className="info-icon">person</Icon>
                            </Tooltip>
                    }
                    {
                        (this.props.activity.clubPoint || this.props.activity.clubPoint == 0) &&
                            <Tooltip title={"Club Points: " + this.props.activity.clubPoint}>
                                <Icon className="info-icon">store</Icon>
                            </Tooltip>
                    }
                    {
                        this.props.activity.difficulty &&
                            <Tooltip title={"Difficulty: " + this.props.activity.difficulty}>
                                <Icon className="info-icon">beenhere</Icon>
                            </Tooltip>
                    }
                    <div className="action-container">
                        {
                            (this.props.activity.status && this.props.activity.status == 'UNASSIGNED') &&
                                <Tooltip title="Self assign this activity.">
                                    <Button
                                        className="w-full action-btn"
                                        onClick={ this.onSelfAssign.bind(this)}
                                    >
                                        Assign
                                    </Button>
                                </Tooltip>
                        }                        
                    </div>
                </div>
                {/* <div className="action-container">
                    <Button className="w-full"
                        onClick={ this.handleDeleteClick.bind(this, this.props.activity)}
                    >
                        <Icon className="gen-icon">delete</Icon>
                    </Button>
                    <Button className="w-full"
                        onClick={ this.handleEditActivityClick.bind(this, this.props.activity)}
                    >
                        <Icon className="gen-icon">edit</Icon>
                    </Button>
                </div> */}
            </div>
        )
    }

    handleClick() {
        this.props.onClick(this.props.activity);
    }

    handleAddUserClick(activity, event) {
        this.props.addUserCallback(activity);
    }

    handleEditActivityClick(activity, event) {
        this.props.editCallback(activity);
    }

    onSelfAssign(event) {
        this.props.onSelfAssign(this.props.activity.id);
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();
    }
}