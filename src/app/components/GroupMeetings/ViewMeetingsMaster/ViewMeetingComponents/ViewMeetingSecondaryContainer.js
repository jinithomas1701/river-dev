import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'material-ui';
import Icon from "material-ui/Icon";
import { Doughnut } from 'react-chartjs-2';
import Timer from "../../CommonUtils/Timer/Timer";
import AttendenceDialog from "../AttendenceDialog";
import MeetingEditDialog from "./MeetingEditDialog";
import MeetingAlertDialog from "../MeetingAlertDialog";
import RecurringMeetingUpdateDialog from "./RecurringMeetingUpdateDialog";
import "./ViewMeetingSecondaryContainer.scss";
const NORMAL ="N";
class ViewMeetingSecondaryContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendenceChartData: "empty",
            recurringMeetingUpdate: false
        }
    }
    render() {
        const props = this.props;
        const meeting = props.meeting;
        let attendenceChartData;
        const canDeleteMeeting = props.canDeleteMeeting;
        const showAttendenceButton = meeting.startedAt !== null;
        const canTakeAttendance = props.canTakeAttendance;
        if (meeting.attendancePercentage !== 0) {
            attendenceChartData = {
                labels: ["Present", "Absent With Reason", "Absent"],
                text: meeting.attendancePercentage,
                datasets: [
                    {
                        data: [
                            meeting.presentCount,
                            meeting.absenteesWithReasonCount,
                            meeting.absenteesCount
                        ],
                        backgroundColor: ['#22bca8', '#1c9fb0', '#d35353'],
                        hoverBackgroundColor: ['#1C998C', '#157885', '#bc3e3e']
                    }
                ]
            }
        }
        return (
            <div className="secondary-container-wrapper">
                <div className="meeting-action-wrapper">
                    {
                        props.canStartMeeting &&
                        <Button className="btn-primary" onClick={props.startMeetingHandler.bind(this, props.meeting.referenceCode)}>Start </Button>
                    }
                    {
                        props.canEndMeeting &&
                        < Button className="btn-complimentary" onClick={props.doMeetingStopAlert}>Stop </Button>
                    }
                    {
                        canDeleteMeeting &&
                        <Button className="btn-complimentary delete-button" onClick={props.doMeetingDeleteAlert}>Delete </Button>
                    }
                    {props.canEditMeetingDetails &&
                        <Icon className="edit-icon"
                            onClick={meeting.recurrenceType === NORMAL ? props.handleMeetingEditOpen : this.openRecurringMeetingUpdate}
                        >edit_icon</Icon>
                    }
                </div>
                <div className="meeting-details-wrap">
                    {
                        this.getMeetingDetails(meeting)
                    }
                </div>

                {showAttendenceButton &&
                    <div className="attendees-button">
                        {meeting.status !== "CON" && canTakeAttendance &&
                            <Button className="btn-default attendees" onClick={props.getAttendeesList}>
                                {meeting.attendancePercentage === 0 ?
                                    <span>Attendance</span> :
                                    <span>Update Attendance</span>
                                }

                            </Button>
                        }
                        {meeting.status === "CON" &&
                            < Button className="btn-default attendees" onClick={props.getAttendeesList}>
                                View Attendence
                                        </Button>
                        }
                    </div>
                }
                <div>
                    {meeting.attendancePercentage !== 0 &&
                        this.getAttendenceGraph(attendenceChartData, meeting)
                    }
                </div>
                <MeetingAlertDialog
                    open={props.stopMeetingAlert}
                    inputText={"Are you sure you have to stop the meeting?"}
                    onClose={props.stopMeetingAlertClose}
                    onSubmit={props.endMeetingHandler.bind(this, props.meeting.referenceCode)}
                    submitButtonText={"STOP MEETING"}
                />
                {this.props.clubMemebersDetails &&
                    <AttendenceDialog
                        open={props.attendeesDialogOpen}
                        onClose={props.handleAttendeesDialogClose}
                        clubMemebersDetails={props.clubMemebersDetails}
                        attendenceSubmit={props.attendenceSubmit}
                        meeting={meeting}
                        hasPrivilageToTakeAttendance={canTakeAttendance}
                    />
                }
                {meeting &&
                    <MeetingEditDialog
                        getGroupMeetingsDetails={props.getGroupMeetingsDetails}
                        meeting={meeting}
                        open={props.handleMeetingEdit}
                        onClose={props.handleMeetingEditClose}
                    />
                }
                {this.props.meetingSuperDetails && meeting && this.state.recurringMeetingUpdate === true &&
                    <RecurringMeetingUpdateDialog
                        meeting={meeting}
                        meetingSuperDetails={this.props.meetingSuperDetails}
                        startTime={this.props.meetingSuperDetails.startTime}
                        endTime={this.props.meetingSuperDetails.endTime}
                        getGroupMeetingsDetails={props.getGroupMeetingsDetails}
                        open={this.state.recurringMeetingUpdate}
                        onClose={this.closeRecurringMeetingUpdate}
                    />
                }
            </div>
        )
    }

    getMeetingDetails = (meeting) => {
        return <table className="table-meeting">

            {meeting.startedAt === null ?
                <tr>
                    <th className="text-head">Start Time:</th>
                    <td className="text-body">{moment(meeting.startTime).format('LLL').toString()}</td>
                </tr> :
                <tr>
                    <th className="text-head">Started At:</th>
                    <td className="text-body">{moment(meeting.startedAt).format('LLL').toString()}</td>
                </tr>
            }
            {meeting.closedAt === null ?
                <tr>
                    <th className="text-head">End Time:</th>
                    <td className="text-body">{moment(meeting.endTime).format('LLL').toString()}</td>
                </tr> :
                <tr>
                    <th className="text-head">Ended At:</th>
                    <td className="text-body">{moment(meeting.closedAt).format('LLL').toString()}</td>
                </tr>
            }
            {meeting.room &&

                <tr>
                    <th className="text-head">Location:</th>
                    <td className="text-body">
                        {`${meeting.room.roomName}, ${meeting.location.name}`}
                    </td>
                </tr>
            }
            {meeting !== "" && meeting.startedAt !== null &&
                <tr>
                    <th className="text-head">Duration:</th>
                    <td className="text-body">
                        <Timer
                            startTime={meeting.startedAt}
                            stopTimer={meeting.closedAt}
                        />
                    </td>
                </tr>
            }
        </table>
    }

    getAttendenceGraph = (attendenceChartData, meeting) => {
        return <div className="attendence-graph-wrap">
            <h6 className="attendence-heading">ATTENDANCE</h6>
            <div className="attendence-graph">
                <Doughnut
                    data={attendenceChartData}
                    width={180}
                    height={180}
                    options={
                        {
                            cutoutPercentage: 55,
                            maintainAspectRatio: false,
                            legend: { display: false }
                        }}
                />
            </div>
            <table className="table-meta">
                <tbody>
                    <tr>
                        <td>{meeting.presentCount}</td>
                        <th>Attended</th>
                    </tr>
                    <tr>
                        <td>{meeting.absenteesCount}</td>
                        <th>Leave</th>
                    </tr>
                    <tr>
                        <td>{meeting.absenteesWithReasonCount}</td>
                        <th>Absent With Reason</th>
                    </tr>
                </tbody>
            </table>
        </div>
    }
    openRecurringMeetingUpdate = () => {
        this.props.getSuperParentDetail(this.props.meeting.referenceCode);
        this.setState({ recurringMeetingUpdate: true });
    }
    closeRecurringMeetingUpdate = () => {
        this.setState({ recurringMeetingUpdate: false });
    }



}
export default ViewMeetingSecondaryContainer