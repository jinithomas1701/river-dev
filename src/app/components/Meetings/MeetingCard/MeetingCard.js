import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Tooltip from 'material-ui/Tooltip';
import moment from "moment";

import {StarRating} from '../../Common/StarRating/StarRating';

// css
import './MeetingCard.scss';
const meetingCardActionSources = {
    RATE_MEETING: "__Rate_Meeting",
    VIEW_MEETING: "__View_Meeting",
};
export const MeetingActionSources = meetingCardActionSources;
export class MeetingCard extends React.Component {

    state = {
        menuOpen: false,
        anchorEl: null
    };

    render() {
        return(
            <div className="meetingCard">
                <div className="meeting-icon">
                    <Icon>date_range</Icon>
                </div>
                <div className="title-container">
                    <div className="title" onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.VIEW_MEETING)}>
                        {this.props.meeting.title}
                    </div>
                    <div className="time-container">
                        {moment.unix(this.props.meeting.fromDate/1000).format("DD MMM YYYY hh:mm A")}
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
                            <Tooltip title={"Location: "  + this.props.meeting.location}>
                                <Icon className="info-icon">room</Icon>
                            </Tooltip>
                    }
                </div>
                <div className="action-container">
                    {(this.props.meeting.ended && !this.props.meeting.rated) && 
                        <Tooltip id="tooltip-icon2" title="Rating" placement="bottom">
                            <Button className="meeting-action-btn" onClick={this.onMeetingCardAction.bind(this, MeetingActionSources.RATE_MEETING)}>
                                <Icon className="gen-icon">star_half</Icon> Rate
                            </Button>
                        </Tooltip>
                    }
                </div>
            </div>
        )
    }

    getFormattedMeetingTiming(from, to) {
        // 27 Oct 2018 8.00AM to 9.15AM
        const fromString = moment.unix(from/1000).format("DD MMM YYYY hh:mm A");
        const toTime = moment.unix(from/1000).format("DD MMM YYYY hh:mm A");
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