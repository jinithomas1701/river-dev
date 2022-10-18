import React, { Component } from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
//------------------Internal Components--------------------
import { riverToast } from '../../Common/Toast/Toast';
import GroupMeetingsService from '../GroupMeetings.service';
import { Util } from '../../../Util/util';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';
import MeetingDeleteDialog from "./MeetingDeleteDialog";
import ViewMeetingSecondaryContainer from "./ViewMeetingComponents/ViewMeetingSecondaryContainer";
import ViewMeetingMainContainer from "./ViewMeetingComponents/ViewMeetingMainContainer";
//------------------css-------------------------------------
import './ViewMeetingsMaster.scss';

const PRIVILEGE_SHOW_MEETING_DETAILS = "MTN_GET_MEETING";
const PRIVILEGE_EDIT_MEETING_DETAILS = "MTN_UPDATE";
const PRIVILEGE_DELETE_MEETING = "MTN_DELETE";
const PRIVILEGE_START_MEETING = "MTN_START";
const PRIVILEGE_END_MEETING = "MTN_END";
const PRIVILEGE_TAKE_ATTENDANCE = "MTN_SAVE_ATTENDANCE";
const PRIVILEGE_UPDATE_MINUTES = "MTN_SAVE_MINUTES";
const loggedinUserDetail = Util.getLoggedInUserDetails();

class ViewMeetingsMaster extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meetingId: "",
            meetingYear: "",
            meetingDetails: "",
            meetingSuperDetails:"",
            duration: moment.duration(moment()),
            clubMemebersDetails: [],
            minutesOfMeeting: [],
            meetingHistory: [],
            attendeesDialogOpen: false,
            showDuration: false,
            meetingUpdateDialogOpen: false,
            showHistory: false,
            isLoading: false,
            deleteMeetingAlert: false,
            stopMeetingAlert: false
        }
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const state = this.state;
        const meeting = this.state.meetingDetails;
        const showMinutesTitle = meeting.startedAt !== null && meeting.closedAt !== null && state.minutesOfMeeting.length !== 0;
        const showMeetingDetails = Util.hasPrivilage(PRIVILEGE_SHOW_MEETING_DETAILS);
        const canEditMeetingDetails = Util.hasPrivilage(PRIVILEGE_EDIT_MEETING_DETAILS) && meeting.startedAt === null;
        const canDeleteMeeting = Util.hasPrivilage(PRIVILEGE_DELETE_MEETING) && meeting.startedAt === null;
        const canStartMeeting = Util.hasPrivilage(PRIVILEGE_START_MEETING) && meeting.startedAt === null;
        const canEndMeeting = Util.hasPrivilage(PRIVILEGE_END_MEETING) && meeting.startedAt !== null && meeting.closedAt === null;
        const canTakeAttendance = Util.hasPrivilage(PRIVILEGE_TAKE_ATTENDANCE);
        const canUpdateMinutes = Util.hasPrivilage(PRIVILEGE_UPDATE_MINUTES) && meeting.startedAt !== null && meeting.closedAt === null;
        const mainContainerClassName = this.state.showHistory === true ? "col-md-6 main-container" : "col-md-8 main-container";
        return (
            <div className="view-meetings-wrapper">
                <div className="container-fluid">
                    <LoaderOverlay show={state.isLoading} />
                    {
                        showMeetingDetails &&
                        <div className="row">
                            <div className={mainContainerClassName}>
                                {meeting.recurrenceType &&
                                    <ViewMeetingMainContainer
                                        showHistory={this.state.showHistory}
                                        getGroupMeetingsDetails={this.getLatestUpcomingDetail.bind(this, this.state.meetingId)}
                                        meeting={this.state.meetingDetails}
                                        handleMinutesOfMeeting={this.handleMinutesOfMeeting}
                                        canUpdateMinutes={canUpdateMinutes}
                                        showMinutesTitle={showMinutesTitle}
                                        minutesOfMeeting={this.state.minutesOfMeeting}
                                        getRecurringMeetingHistory={this.getRecurringMeetingHistory}
                                    />
                                }
                            </div>
                            <div className="col-md-4 secondary-container">
                                <ViewMeetingSecondaryContainer
                                    canEditMeetingDetails={canEditMeetingDetails}
                                    canStartMeeting={canStartMeeting}
                                    canEndMeeting={canEndMeeting}
                                    startMeetingHandler={this.startMeetingHandler}
                                    getSuperParentDetail={this.getSuperParentDetail}
                                    meeting={this.state.meetingDetails}
                                    meetingSuperDetails={this.state.meetingSuperDetails}
                                    getGroupMeetingsDetails={this.getGroupMeetingsDetails}
                                    handleMeetingEdit={this.state.meetingUpdateDialogOpen}
                                    handleMeetingEditClose={this.handleMeetingEditClose}
                                    handleMeetingEditOpen={this.handleMeetingEditOpen}
                                    canDeleteMeeting={canDeleteMeeting}
                                    attendenceSubmit={this.attendenceSubmit}
                                    clubMemebersDetails={this.state.clubMemebersDetails}
                                    handleAttendeesDialogClose={this.handleAttendeesDialogClose}
                                    attendeesDialogOpen={state.attendeesDialogOpen}
                                    endMeetingHandler={this.endMeetingHandler}
                                    doMeetingDeleteAlert={this.doMeetingDeleteAlert}
                                    doMeetingStopAlert={this.doMeetingStopAlert}
                                    stopMeetingAlertClose={this.stopMeetingAlertClose}
                                    stopMeetingAlert={this.state.stopMeetingAlert}
                                    canTakeAttendance={canTakeAttendance}
                                    getAttendeesList={this.getAttendeesList}
                                />
                            </div>
                            {this.state.showHistory === true &&
                                this.historyList()
                            }
                            <MeetingDeleteDialog
                                open={this.state.deleteMeetingAlert}
                                onClose={this.deleteMeetingAlertClose}
                                onSubmit={this.doMeetingDelete}
                                meeting={meeting}
                                submitButtonText={"DELETE"}
                            />
                        </div>
                    }
                </div>
            </div >
        );
    }

    init() {
        this.setState({ isLoading: true });
        const params = this.props.match.params;
        if (params && params.meetingId) {
            let meetingId = params.meetingId;
            this.setState({ meetingId });
            this.getGroupMeetingsDetails(meetingId).then(() => {
                this.preRequisal();
            });
        }

    }

    preRequisal() {
        let meetingDetails = this.state.meetingDetails
        let minutesOfMeeting = meetingDetails.minutes || [];
        let updatedMeetingMinutes = [];
        minutesOfMeeting.forEach(element => {
            let dateInFormat = moment(element.date).format('LT');
            updatedMeetingMinutes.push({
                title: dateInFormat,
                content: element.content
            })
        });
        this.setState({ minutesOfMeeting: updatedMeetingMinutes });
    }

    getLatestUpcomingDetail = (meetingId) => {
        this.getGroupMeetingsDetails(meetingId);
        this.setState({ showHistory: false });
    }

    getGroupMeetingsDetails = (meetingId) => {
        return GroupMeetingsService.getGroupMeetingsDetails(meetingId)
            .then(meetingDetails => {
                this.setState({ meetingDetails });
                this.setState({ isLoading: false });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to fetch meeting details.");
                this.setState({ isLoading: false });
            });
    }

    startMeetingHandler = (meetingId = this.state.meetingId) => {
        const currentTime = {
            date: moment().format('x')
        }
        GroupMeetingsService.startGroupMeetings(meetingId, currentTime)
            .then(meetingDetails => {
                this.setState({ showDuration: true, showHistory: false });
                this.setState({ meetingDetails });
                riverToast.show("Successfully started meeting .");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to start meeting .");
            });
    }

    endMeetingHandler = (meetingId = this.state.meetingId) => {
        const currentTime = {
            date: moment().format('x')
        }
        GroupMeetingsService.endGroupMeetings(meetingId, currentTime)
            .then(meetingDetails => {
                let minutesOfMeeting = meetingDetails.minutes;
                let updatedMeetingMinutes = [];
                minutesOfMeeting.forEach(element => {
                    let dateInFormat = moment(element.date).format('LT');
                    updatedMeetingMinutes.push({
                        title: dateInFormat,
                        content: element.content
                    })
                });
                this.setState({
                    meetingDetails: meetingDetails,
                    minutesOfMeeting: updatedMeetingMinutes,
                    showHistory: false
                });
                this.stopMeetingAlertClose();
                riverToast.show("Successfully ended meeting .");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to end meeting .");
            });
    }

    doMeetingDelete = (type, request) => {
        const meetingId = this.state.meetingId;
        GroupMeetingsService.doMeetingDelete(meetingId, type, request)
            .then(() => {
                this.props.history.push("/group-meetings/list");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to delete meting.")
            })
    }

    validateForm = () => {
        let isValid = true;
        if (this.state.meetingDetails && this.state.meetingDetails.attendancePercentage === 0) {
            isValid = false;
            riverToast.show("Please enter attendece");
        }
        return isValid;
    }

    getAttendeesList = () => {
        const meetingId = this.state.meetingDetails.referenceCode;
        GroupMeetingsService.getClubMemeberAttendeesList(meetingId)
            .then(clubMemebersDetails => {
                this.setState({
                    clubMemebersDetails,
                    attendeesDialogOpen: true
                });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to load attendees details.");
            })
    }

    handleAttendeesDialogClose = () => {
        this.setState({ attendeesDialogOpen: false });
    }

    stopMeetingAlertClose = () => {
        this.setState({ stopMeetingAlert: false });
    }

    doMeetingStopAlert = () => {
        const isValid = this.validateForm();
        if (!isValid) {
            return;
        }
        this.setState({ stopMeetingAlert: true });
    }

    attendenceSubmit = (targetDetail) => {
        let meetingId = this.state.meetingId;
        GroupMeetingsService.putAttendenceDetail(targetDetail, meetingId)
            .then((meetingDetails) => {
                this.setState({ meetingDetails });
                this.handleAttendeesDialogClose();
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong.");
            })
    }

    handleMinutesOfMeeting = (inputText) => {
        let meetingId = this.state.meetingId;
        let request = {
            content: inputText
        }
        return GroupMeetingsService.postMinutesOfMeeting(request, meetingId)
            .then((meetingDetails) => {
                let minutesOfMeeting = meetingDetails.minutes;
                let updatedMeetingMinutes = [];
                minutesOfMeeting.forEach(element => {
                    let dateInFormat = moment(element.date).format('LT');
                    updatedMeetingMinutes.push({
                        title: dateInFormat,
                        content: element.content
                    })
                });
                this.setState({ minutesOfMeeting: updatedMeetingMinutes });
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while minutes submission");
            })
    }

    deleteMeetingAlertClose = () => {
        this.setState({ deleteMeetingAlert: false });
    }

    doMeetingDeleteAlert = () => {
        this.setState({ deleteMeetingAlert: true });
    }

    getRecurringMeetingHistory = () => {
        let meetingId = this.state.meetingId;
        GroupMeetingsService.getRecurringMeetingHistory(meetingId)
            .then(meetingHistory => {
                this.setState({ showHistory: true, meetingHistory: meetingHistory });
            })
            .catch(error => {
                riverToast.show("Failed to load meeting history.");
            })
    }

    historyList = () => {
        let previourYear = "";
        let previousStatus = "";
        return <div className="col-md-2 history-list-wrap">
            {this.state.meetingHistory.map((eachHistory) => {
                let year = moment(eachHistory.startTime).format('YYYY');
                let statusType = eachHistory.concluded ? "Concluded" : "Upcoming";
                let showYear = false;
                let showStatus = false;
                if (previousStatus === statusType) {
                    showStatus = false;
                    previousStatus = statusType;
                }
                else {
                    showStatus = true;
                    previousStatus = statusType;
                }
                if (previourYear == year) {
                    showYear = false;
                    previourYear = year;
                }
                else {
                    showYear = true;
                    previourYear = year;
                }
                return <div className="each-history">
                    {
                        showStatus &&
                        <p className="status-heading">{statusType}</p>
                    }
                    {showYear === true &&
                        <span className="year-display">{year}</span>
                    }
                    <div className={statusType === "Concluded" ? "concluded-list-time" : "upcoming-list-item"} onClick={statusType === "Concluded" ? this.getGroupMeetingsDetails.bind(this, eachHistory.referenceCode) : ""}> {moment(eachHistory.startTime).format('DD MMM (ddd)')}</div>
                </div>
            })}

        </div>
    }

    getSuperParentDetail = (meetingId) => {
        return GroupMeetingsService.getSuperParentDetail(meetingId)
            .then(meetingSuperDetails => {
                this.setState({ meetingSuperDetails });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to fetch supermeeting details.");
                this.setState({ isLoading: false });
            });
    }

    handleMeetingEditOpen = () => {
        this.setState({ meetingUpdateDialogOpen: true });
    }
    handleMeetingEditClose = () => {
        this.setState({ meetingUpdateDialogOpen: false });
    }
}

export default withRouter(ViewMeetingsMaster);