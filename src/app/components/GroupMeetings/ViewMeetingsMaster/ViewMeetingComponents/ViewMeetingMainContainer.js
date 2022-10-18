import React, { Component } from 'react';
import InputBox from "../../CommonUtils/InputBox/InputBox";
import Timeline from "../../CommonUtils/Timeline/Timeline";
import "./ViewMeetingMainContainer.scss";
const MONTHLY ="M";
const WEEKLY ="W";
const DAILY = "D";
const CLUBMEETING ="CM";
const RECCURINGMEETING = "CSM";
class ViewMeetingMainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const props = this.props
        const meeting = props.meeting;
        const meetingType = meeting.type === CLUBMEETING || RECCURINGMEETING ? "CLUB MEETING" : "OTHER MEETING";
        let recurrenceType;
        if (meeting.recurrenceType === MONTHLY) {
            recurrenceType = "Monthly";
        }
        else if (meeting.recurrenceType === WEEKLY) {
            recurrenceType = "Weekly";
        }
        else if (meeting.recurrenceType === DAILY) {
            recurrenceType = "Daily";
        }
        return (
            <div className="main-container-wrapper  ">
                <div className="row">
                    <div className="col-md-8 type-title">
                        <p className="meeting-type-title">{meetingType}</p>
                        {meeting && meeting.recurrenceType !== "N" &&
                            <span className="recurrent-period">(Recurring: {recurrenceType})</span>
                        }
                    </div>
                    {meeting && meeting.recurrenceType !== "N" &&
                        <div className="history-button">
                            {props.showHistory === false ?
                                <span className="show-history-button" onClick={props.getRecurringMeetingHistory}>Show All Meetings</span> :
                                <span className="show-history-button" onClick = {props.getGroupMeetingsDetails}>Show Latest Meeting</span>
                            }
                        </div>
                    }
                </div>
                <p className="meeting-title">{meeting.title}</p>
                <label className="meeting-description">{meeting.description}</label>
                {
                    props.showMinutesTitle &&
                    <h1 className="minutes-title">MINUTES:</h1>
                }

                {
                    props.canUpdateMinutes &&
                    <InputBox
                        title="MINUTES:"
                        placeholder="Enter minutes here"
                        className="row"
                        actionClass="btn-complimentary"
                        actionTitle="SAVE"
                        onSubmit={props.handleMinutesOfMeeting}
                    />
                }

                <Timeline
                    type="minimal"
                    theme="default"
                    data={props.minutesOfMeeting}
                />
            </div>
        )
    }
}
export default ViewMeetingMainContainer