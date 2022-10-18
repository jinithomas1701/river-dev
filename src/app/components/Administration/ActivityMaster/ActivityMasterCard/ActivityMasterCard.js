import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import AddUser from 'material-ui-icons/PersonAdd';
import Switch from 'material-ui/Switch';
import Popover from 'react-simple-popover';

import {Util} from "../../../../Util/util";
// css
import './ActivityMasterCard.scss';

const PRIVILEGE_DELETE_MASTER_ACTIVITY = "DELETE_MASTER_ACTIVITY";
const PRIVILEGE_UPDATE_MASTER_ACTIVITY = "UPDATE_MASTER_ACTIVITY";
const PRIVILEGE_VIEW_MASTER_ACTIVITY_STATUS = "VIEW_MASTER_ACTIVITY_STATUS";

export class ActivityMasterCard extends React.Component {
    state = {
        isActive: false
    };

    componentDidMount() {
        this.setState({isActive: this.props.master.status});
    }

    render() {
        return(
            <div className="activityMasterCard">
                {/* <div className="right-top-control">
                {Util.hasPrivilage(PRIVILEGE_DELETE_MASTER_ACTIVITY) &&
                    <Switch title="Activate/Deactivate this master, Only active ones will be available for activity creation"
                        checked={this.state.isActive}
                        onChange={this.handleSwitchClick.bind(this)}
                        aria-label="isActive"
                    />
                }
                </div> */}
                <div className="title-container">
                    <div className="title" title="Title">
                        {this.props.master.title}
                    </div>
                    {
                        this.props.master.year &&
                            <div className="date-container">
                                For financial year {this.props.master.year}
                            </div>
                    }
                </div>
                {/* <div className="base-text">
                    {
                        this.props.master.isSelfAssign ? 
                            "Self Assignable" :
                            "Not Self Assignable"
                    }
                </div> */}
                <div className="infos">
                    <div className="action-container">
                        
                            <Button
                                title="Infos"
                                className="action-btn"
                                onClick={() => {this.setState({ infoPopOver: true })}}
                                ref="infos"
                            >
                                <Icon className="gen-icon">info</Icon>
                            </Button>
                            <Popover
                                placement='bottom'
                                containerStyle = {{"zIndex":"1101"}}
                                // style={this.notificationStyle}
                                target={this.refs.infos}
                                show={this.state.infoPopOver}
                                onHide={() => { this.setState({ infoPopOver: false }) }}
                            >
                                <div className="activity-infos">
                                    <div className="label">
                                        <div className="title">Focus Area</div>
                                        <div className="value">{this.props.master.focusArea.title}</div>
                                    </div>
                                    <div className="label">
                                        <div className="title">Description</div>
                                        <div className="value">{this.props.master.description}</div>
                                    </div>
                                    <div className="label">
                                        <div className="title">Panel</div>
                                        <div className="value">{this.props.master.council.name}</div>
                                    </div>
                                    <div className="label">
                                        <div className="title">Member Point</div>
                                        <div className="value">{this.props.master.memberPoint}</div>
                                    </div>
                                    <div className="label">
                                        <div className="title">Club Point</div>
                                        <div className="value">{this.props.master.clubPoint}</div>
                                    </div>
                                    <div className="label">
                                        <div className="title">Difficulty</div>
                                        <div className="value">{this.props.master.difficulty}</div>
                                    </div>
                                </div>
                            </Popover>
                        
                        {
                            Util.hasPrivilage(PRIVILEGE_VIEW_MASTER_ACTIVITY_STATUS) &&
                                <Button title="Show statistics of Activities created from this master "
                                    className="action-btn"
                                    onClick = {this.handleViewStatClick.bind(this, this.props.master)}    
                                >
                                    <Icon  className="gen-icon">show_chart</Icon>
                                </Button>
                        }
                        {(Util.hasPrivilage(PRIVILEGE_DELETE_MASTER_ACTIVITY) && this.props.master.removable) &&
                            <Button title="Delete this master"
                                className="action-btn"
                                onClick = {this.handleDeleteClick.bind(this, this.props.master)}
                            >
                                <Icon className="gen-icon">delete</Icon>
                            </Button>
                        }
                        {Util.hasPrivilage(PRIVILEGE_UPDATE_MASTER_ACTIVITY) &&
                            <Button title="Edit this Master"
                                className="action-btn"
                                onClick = {this.handleUpdateClick.bind(this, this.props.master)}    
                            >
                                <Icon className="gen-icon">edit</Icon>
                            </Button>
                        }
                    </div>
                </div>
            </div>
        )
    }

    handleSwitchClick() {
        this.setState({isActive: !this.state.isActive});
        this.props.onSwitchChange(this.props.master, !this.state.isActive);
    }

    handleDeleteClick(activityMaster, event) {
        this.props.deleteCallBack(activityMaster);
    }

    handleUpdateClick(activityMaster) {
        this.props.updateCallBack(activityMaster);        
    }

    handleViewStatClick(activityMaster) {
        this.props.viewStatCallback(activityMaster);
    }
}