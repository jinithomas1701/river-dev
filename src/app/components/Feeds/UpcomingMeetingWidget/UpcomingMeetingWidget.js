import React, { Component } from 'react';
import moment from 'moment';
import Icon from "material-ui/Icon";

// css
import './UpcmngMtngWidgt.scss';

class UpcomingMeetingWidget extends Component {
    render() {
        return (
            <div className="upcoming-meeting-widget" onClick={this.gotoMeeting.bind(this)}>
                <div className="meeting-icon"><Icon>date_range</Icon></div>
                <div className="meeting-datas">
                    <div className="meeting-title text-ellipsis" title={this.props.meeting.title}>{this.props.meeting.title}</div>
                    <div className="meeting-date">
                        {moment.unix(this.props.meeting.fromDate / 1000).format("DD MM YYYY, hh:mm A")}
                        {
                            (this.props.meeting.type.type && this.props.meeting.type.type == "CLUB") &&
                            <div className="meeting-type-club-name text-ellipsis" title={this.props.meeting.clubName || ""}>&middot; {this.props.meeting.clubName || ""}</div>
                        }
                    </div>
                </div>

            </div>
        );
    }

    gotoMeeting() {
        window.location.href = "/#/meetings";
    }
}

export default UpcomingMeetingWidget;