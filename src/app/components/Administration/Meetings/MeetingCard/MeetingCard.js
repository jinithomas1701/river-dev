import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Tooltip from 'material-ui/Tooltip';
import moment from 'moment';
import {Util} from "../../../../Util/util";
import {StarRating} from '../../../Common/StarRating/StarRating';

// css
import './MeetingCard.scss';
const PRIVILEGE_MARK_ATTENDANCE = "MARK_MEETING_ATTENDANCE";
const PRIVILEGE_DELETE_MEETING = "DELETE_MEETING";
const PRIVILEGE_UPDATE_MEETING = "UPDATE_MEETING";

const meetingCardActionSources = {
    MARK_ATTENDACE: "__Mark_Attendance",
    ADD_NOTES: "__Add_Notes",
    MEETING_DELETE: "__Meeting_Delete",
    MEETING_UPDATE: "__Meeting_Update",
    VIEW_MEETING: "__View_Meeting",
    MEETING_START_STOP: "__Meeting_Start/Stop",
};
export const MeetingActionSources = meetingCardActionSources;
export class MeetingCard extends React.Component {

    state = {
        menuOpen: false,
        anchorEl: null
    };

    render() {
        return(
            <div className="admin-meetingCard">
                <div className="menu-container">
                    <IconButton
                        title="Menu"
                        aria-owns={this.state.open ? 'simple-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleMenuClick}
                        >
                        <Icon>more_vert</Icon>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        open={this.state.menuOpen}
                        onRequestClose={this.handleRequestClose}
                        >
                        {Util.hasPrivilage(PRIVILEGE_UPDATE_MEETING) &&
                            <MenuItem onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.MEETING_UPDATE)}>Update</MenuItem>
                        }
                        {Util.hasPrivilage(PRIVILEGE_DELETE_MEETING) &&
                            <MenuItem onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.MEETING_DELETE)}>Delete</MenuItem>
                        }
                        {!Util.hasPrivilage(PRIVILEGE_UPDATE_MEETING) &&
                            <MenuItem onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.MEETING_UPDATE)}>View</MenuItem>
                        }
                        
                    </Menu>
                </div>
                <div className="title-container">
                    <div className="title" onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.VIEW_MEETING)}>
                        {this.props.meeting.title}
                    </div>
                    <div className="time-container">
                        {this.getFormattedMeetingTiming(this.props.meeting.fromDate, this.props.meeting.toDate)}
                    </div>
                </div>
                <div className="meeting-infos">
                    {
                        this.props.meeting.clubName &&
                            <Tooltip title={"Club: " + this.props.meeting.clubName}>
                                <Icon className="info-icon">store</Icon>
                            </Tooltip>
                    }
                    {
                        this.props.meeting.location &&
                            <Tooltip title={"Location: " + this.props.meeting.location}>
                                <Icon className="info-icon">room</Icon>
                            </Tooltip>
                    }
                </div>
                <div className="action-container">
                    {(this.props.meeting.started && this.props.meeting.ended && Util.hasPrivilage(PRIVILEGE_MARK_ATTENDANCE)) &&
                        <div className="w-full">
                            {this.getMarkAttendanceButton()}
                        </div>
                    }
                    
                    {(!this.props.meeting.started || !this.props.meeting.ended) &&
                        <Tooltip id="tooltip-icon2" className="w-full" title="Start/Stop Meeting" placement="bottom">
                            <Button className="action-btn" onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.MEETING_START_STOP)}>
                                {
                                    this.props.meeting.started ?
                                    (
                                        !this.props.meeting.ended ?
                                            (<Icon className="gen-icon">timer_off</Icon>)
                                        :
                                            (<Icon className="gen-icon">timer</Icon>)
                                    )
                                    :
                                        !this.props.meeting.ended &&
                                            <Icon className="gen-icon">timer</Icon>
                                }
                                
                            </Button>
                        </Tooltip>
                    }
                    
                    {(this.props.meeting.started && this.props.meeting.ended) &&
                        <Tooltip id="tooltip-icon2" className="w-full" title="Add minutes" placement="bottom">
                            <Button className="action-btn" onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.ADD_NOTES)}>
                                <Icon className="gen-icon">note_add</Icon>
                            </Button>
                        </Tooltip>
                    }
                </div>
            </div>
        )
    }

    getMarkAttendanceButton() {
        let markAttendanceElement;
        if (Util.hasPrivilage(PRIVILEGE_MARK_ATTENDANCE)) {
            markAttendanceElement = <Tooltip id="tooltip-icon1" className="w-full" title="Mark attendance" placement="bottom">
                <Button className="action-btn" onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.MARK_ATTENDACE)}>
                    <Icon className="gen-icon">supervisor_account</Icon>
                </Button>
            </Tooltip>;
        }

        return markAttendanceElement;
    }

    getFormattedMeetingTiming(from, to) {
        // 27 Oct 2018 8.00AM to 9.15AM
        const fromString = moment.unix(from/1000).format("DD MMM YYYY hh:mm A");
        const toTime = moment.unix(to/1000).format("DD MMM YYYY hh:mm A");
        return fromString+" to "+toTime;
    }

    onMeetingCardAction(source) {
        this.props.actionCallback(source, this.props.meeting);
        this.handleRequestClose();
    }

    handleMenuClick = event => {
        this.setState({ menuOpen: true, anchorEl: event.currentTarget });
      };
    
    handleRequestClose = () => {
        this.setState({ menuOpen: false });
    };
    
    handleDeleteClick(club, event) {
        this.props.deleteCallback(club);
    }
}