import React, { Component } from 'react';
import moment from 'moment';
import './GroupMeetingsTile.scss';
import { Icon } from 'material-ui';
import { constants } from 'zlib';

class GroupMeetingsTile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: ""
        }
        this.intervalID = 0;
    }

    componentDidMount() {
        this.intervalID = setInterval(() => this.calculateTimeLeft(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render() {
        const state = this.state;
        const props = this.props;
        const location = props.location
        const meeting = { referenceCode: props.referenceCode };
        const className = props.className ? props.className : '';
        let statusTitle, statusIcon;
        let recurrenceType;
        if (props.recurrenceType === "M") {
            recurrenceType = "Monthly";
        }
        else if (props.recurrenceType === "W") {
            recurrenceType = "Weekly";
        }
        else if (props.recurrenceType === "D") {
            recurrenceType = "Daily";
        }
        switch (props.status) {
            case "UPC":
                statusTitle = "Upcoming";
                statusIcon = props.type === "CM" ? "access_time" : "autorenew";
                break;
            case "ONG":
                statusTitle = "Ongoing";
                statusIcon = props.type === "CM" ? "timelapse" : "autorenew";
                break;
            case "CON":
                statusTitle = "Concluded";
                statusIcon = props.type === "CM" ? "timer_off" : "autorenew";
                break;
        }

        return (
            <div className={`group-meetings-tile-wrapper ${className}`} onClick={props.onClick.bind(this, meeting)}>
                <span className="status">{statusTitle}</span>
                <p className="time-left">{state.timeLeft}</p>
                <Icon className="status-icon">{statusIcon}</Icon>
                <div className="details">
                    <p className="date">{moment.unix(props.startTime / 1000).format("DD MMM")}</p>
                    {props.type === "CSM" &&
                        <p className="recurrence-type">{recurrenceType}</p>
                    }
                    <span className="time">{moment.unix(props.startTime / 1000).format("h:mm a")} - {moment.unix(props.endTime / 1000).format("h:mm a")}</span>
                    <span className="day">{moment.unix(props.startTime / 1000).format("ddd")}</span>
                    <p className="room">
                        <Icon className="location-icon">room</Icon>
                        {props.room.roomName},
                    </p>
                    <p className="location">
                        {location.name}
                    </p>
                    <p className="title">{props.title}</p>
                </div>
                <div className="design-div"></div>
            </div >
        );
    }

    calculateTimeLeft = () => {
        this.setState({ timeLeft: moment.unix(this.props.startTime / 1000).fromNow() });
    }
}

export default GroupMeetingsTile;