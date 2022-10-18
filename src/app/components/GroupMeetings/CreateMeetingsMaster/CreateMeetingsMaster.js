//---------------------------External components-------------------
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Datetime from 'react-datetime';
import moment from 'moment';
//---------------------------Internal Components----------------------
import GroupMeetingsService from "../GroupMeetings.service";
import RecurringSelectDialog from "./RecurringSelectDialog";
import { riverToast } from '../../Common/Toast/Toast';
import CreateMeetingMainContainer from "./CreateMeetingMainContainer";
import PreviewDetailDialog from "../CommonUtils/PreviewDetailDialog/PreviewDetailDialog";
import CreateMeetingSecondaryContainer from "./CreateMeetingSecondaryContainer";
//-----------------------------css----------------------------------
import './CreateMeetingsMaster.scss';
const CLUBMEETING = "CM";
const RECCURINGMEETING = "CS";
const RECCURTYPE = "N";
const DAILY = "D";
const MONTHLY = "M";
const WEEKLY = "W";
class CreateMeetingsMaster extends Component {

    constructor(props) {
        super(props);
        this.state = {
            room: "",
            meeting: "",
            checked: false,
            invitees: "",
            meetingPreview: "",
            roomName: "",
            recurrence: "",
            showStartDate: "",
            recurrenceShowType: "",
            showEndTime: "",
            startTime: "",
            showEndDate: "",
            page: 0,
            selectedInviteesList: [],
            inviteesArrayList: [],
            locationList: [],
            roomList: [],
            roomListExisting: [],
            locationRoomsList: [],
            isEditButtonClicked: false,
            disableYearSelection: false,
            showPreviewDialog: false,
            addGuestDialog: false,
            showOtherRoom: false,
            openRecurrenceAction: false,
            showRecurrenceButton: true,
            selectedDate: moment(),
            meetingObj: {
                value: CLUBMEETING,
                title: "",
                agenda: "",
                location: "",
                endTime: "",
                startTime: "",
                dayOfMonth: "",
                recurrenceType: RECCURTYPE,
                guest: [],
                dayOfWeek: [],
                startDate: moment().toDate().getTime(),
                endDate: moment().toDate().getTime(),
            }

        };
    }
    componentDidMount() {

        this.handleInviteesListSelect(this.state.page);
        if (this.props.meeting) {
            const meeting = this.props.meeting;
            this.handleMeetingUpdateDetail();
            this.loadRoomDetails(meeting.startTime, meeting.endTime, meeting);
        }
        else {
            this.handleLocationSelect();
        }
    }

    yesterday = Datetime.moment().subtract(1, 'day');

    render() {
        return (
            <div className="create-meetings-wrapper">
                <div className="row">
                    <div className="col-md-6 meeting-details">
                        <CreateMeetingMainContainer
                            meetingObj={this.state.meetingObj}
                            room={this.state.room}
                            roomList={this.state.roomList}
                            roomName={this.state.roomName}
                            checked={this.state.checked}
                            showOtherRoom={this.state.showOtherRoom}
                            locationList={this.state.locationList}
                            showStartDate={this.state.showStartDate}
                            showStartTime={this.state.showStartTime}
                            showEndDate={this.state.showEndDate}
                            showEndTime={this.state.showEndTime}
                            recurrence={this.state.recurrence}
                            locationRoomsList={this.state.locationRoomsList}
                            isEditButtonClicked={this.state.isEditButtonClicked}
                            recurrenceShowType={this.state.recurrenceShowType}
                            showRecurrenceButton={this.state.showRecurrenceButton}
                            handleTextChange={this.handleTextChange}
                            handleOtherRoomChange={this.handleOtherRoomChange}
                            isDateValid={this.isDateValid}
                            fromDateChange={this.fromDateChange}
                            toDateChange={this.toDateChange}
                            handleLocationSelect={this.handleLocationSelect}
                            handleRoomSelect={this.handleRoomSelect}
                            handleLocationChange={this.handleLocationChange}
                            onEditRecurrenceAction={this.onEditRecurrenceAction}
                            handleCheckboxChange={this.handleCheckboxChange}
                            handleRadioButtonChange={this.handleRadioButtonChange}
                        />
                    </div>
                    <div className="col-md-6 invities-details">
                        <CreateMeetingSecondaryContainer
                            guest={this.state.meetingObj.guest}
                            meeting={this.props.meeting}
                            addGuestDialog={this.state.addGuestDialog}
                            inviteesArrayList={this.state.inviteesArrayList}
                            selectedInviteesList={this.state.selectedInviteesList}
                            handleDeleteGuest={this.handleDeleteGuest}
                            handleAddGuest={this.handleAddGuest}
                            handleAddGuestDialogClose={this.handleAddGuestDialogClose}
                            handleGuestDialogOpen={this.handleGuestDialogOpen}
                            handleMeetingCreate={this.handleMeetingCreate}
                            handleMeetingUpdate={this.handleMeetingUpdate}
                            handleCreateMeetingClose={this.handleCreateMeetingClose}
                            handleInviteesRemove={this.handleInviteesRemove}
                            handleInviteesSelect={this.handleInviteesSelect}
                            handleInviteesSearch={this.handleInviteesSearch}
                        />
                    </div>
                </div>
                {this.state.openRecurrenceAction &&
                    <RecurringSelectDialog
                        recurrenceType={this.state.meetingObj.recurrenceType}
                        isEditButtonClicked={this.state.isEditButtonClicked}
                        startTime={this.state.meetingObj.startDate}
                        endTime={this.state.meetingObj.endDate}
                        startDate={this.state.meetingObj.startTime}
                        endDate={this.state.meetingObj.endTime}
                        dayOfWeek={this.state.meetingObj.dayOfWeek}
                        day={this.state.meetingObj.dayOfMonth}
                        open={this.state.openRecurrenceAction}
                        onClose={this.closeRecurrenceAction}
                        onSubmit={this.submitRecurrenceData}
                    />
                }
                {this.state.showPreviewDialog && this.state.meetingPreview &&
                    <PreviewDetailDialog
                        meetingPreview={this.state.meetingPreview}
                        open={this.state.showPreviewDialog}
                        onClose={this.closeShowPreviewDialog}
                    />
                }
            </div>
        );
    }

    handleInviteesSearch = (searchText) => {
        if (searchText.length >= 3) {
            this.handleInviteesListSelect(this.state.page, searchText);
        }
        else if (searchText.length === 0) {
            this.handleInviteesListSelect(this.state.page);
        }
    }

    handleInviteesListSelect = (page, search) => {
        GroupMeetingsService.getInviteesList(search, page)
            .then(inviteesList => {
                let inviteesArrayList = [];
                inviteesList.map((invitees) => {
                    inviteesArrayList.push({
                        title: invitees.name,
                        label: invitees.name,
                        avatar: invitees.avatar,
                        subText: invitees.clubName,
                        id: invitees.userId
                    });
                });
                this.setState({ inviteesArrayList });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something is wrong ")
            })
    }

    loadRoomDetails = (startDate, endDate, meeting) => {

        const request = { startDate, endDate };
        GroupMeetingsService.getMeetingLocation(request)
            .then(locationDetails => {
                this.setState({ locationRoomsList: locationDetails });
                let locationList = [];
                locationDetails.map((locationobj) => {
                    locationList.push({
                        title: locationobj.location,
                        value: locationobj.id
                    })
                })
                this.setState({ locationList });
                this.handleLocationSelectChange(locationDetails, this.state.meetingObj.location);
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while loading meeting rooms.")
            })
    };

    handleLocationSelect = (startDate = this.state.meetingObj.startDate, endDate = this.state.meetingObj.endDate) => {
        const request = {
            startDate: startDate,
            endDate: endDate
        }
        GroupMeetingsService.getMeetingLocation(request)
            .then(locationListobject => {
                this.setState({ locationRoomsList: locationListobject });
                let locationList = [];
                locationListobject.map((locationobj) => {
                    locationList.push({
                        title: locationobj.location,
                        value: locationobj.id
                    })
                })
                this.setState({ locationList, showOtherRoom: false, roomName: "", room: "" });

            })
            .catch(error => {
                riverToast.show(error.status_message || "Something is wrong ")
            })
    }
    handleMeetingUpdateDetail = () => {
        let meetingObj = {
            ...this.state.meetingObj,
            value: this.props.meeting.type,
            title: this.props.meeting.title,
            agenda: this.props.meeting.description,
            startDate: this.props.meeting.startTime,
            endDate: this.props.meeting.endTime,
            guest: this.props.meeting.guests,
            location: this.props.meeting.location.id
        }
        this.setState({
            meeting: this.props.meeting,
            meetingObj,
            showRecurrenceButton: false
        });
        if (this.props.meeting.invitees !== []) {
            let selectedInviteesList = [];
            this.props.meeting.invitees.map((invitees) => {
                selectedInviteesList.push({
                    title: invitees.name,
                    label: invitees.name,
                    avatar: invitees.avatar,
                    subText: invitees.clubName,
                    id: invitees.userId
                });
            });
            this.setState({ selectedInviteesList });
        }

        if (this.props.meeting.room.roomId === 0) {
            this.setState({
                room: this.props.meeting.room.roomId,
                showOtherRoom: true,
                roomName: this.props.meeting.room.roomName
            });
        }
        else {
            let roomList = [];
            roomList.push({
                available: true,
                title: this.props.meeting.room.roomName,
                value: this.props.meeting.room.roomId,
                code: this.props.meeting.room.code
            })
            this.setState({
                roomListExisting: [...roomList],
                room: this.props.meeting.room.roomId
            });
        }
    }

    fromDateChange = (date) => {
        date = moment(date);
        if (!date.isValid()) {
            return
        }
        let fromDate = date.toDate().getTime();
        let meetingObj = {
            ...this.state.meetingObj,
            startDate: fromDate
        }
        this.setState({ meetingObj });
        // this.handleLocationSelect(fromDate, this.state.meetingObj.endDate);
    }

    toDateChange = (date) => {
        date = moment(date);
        if (!date.isValid()) {
            return
        }
        let toDate = date.toDate().getTime();
        let meetingObj = {
            ...this.state.meetingObj,
            endDate: toDate
        }
        this.setState({ meetingObj });
        // this.handleLocationSelect(this.state.meetingObj.endDate, toDate);
    }
    closeShowPreviewDialog = () => {
        this.setState({ showPreviewDialog: false });
    }

    handleInviteesRemove = (inviteesId) => {
        let selectedInviteesList = [...this.state.selectedInviteesList];
        const index = selectedInviteesList.findIndex(invitees => invitees.id === inviteesId);
        if (index > -1) {
            selectedInviteesList.splice(index, 1);
            this.setState({ selectedInviteesList });
        }
    }

    handleInviteesSelect = (invitees) => {
        let selectedInviteesList = [...this.state.selectedInviteesList];
        const index = selectedInviteesList.findIndex(item => item.id === invitees.id);
        if (index < 0) {
            selectedInviteesList.push({ ...invitees });
            this.setState({ selectedInviteesList });
        }
    }

    isDateValid = function (current) {
        return current.isAfter(this.yesterday);
    };

    handleAddGuestDialogClose = () => {
        this.setState({ addGuestDialog: false });
    }

    handleGuestDialogOpen = () => {
        this.setState({ addGuestDialog: true });
    }

    handleTextChange = (event) => {
        let meeting = this.state.meetingObj;
        const field = event.target.name;
        const value = event.target.value;
        let meetingObj = {
            ...meeting,
            [field]: value
        }
        this.setState({ meetingObj });
    }

    handleOtherRoomChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    handleRadioButtonChange = (event) => {
        let meeting = this.state.meetingObj;
        let meetingObj = {
            ...meeting,
            value: event.target.value
        }
        this.setState({ meetingObj });
    }

    handleLocationChange = (locationDetails, location) => {
        let meeting = this.state.meetingObj;
        let meetingObj = {
            ...meeting,
            location: location
        }
        this.setState({ meetingObj }, () => {
            locationDetails.forEach(locationObject => {
                if (locationObject.id === location) {
                    let roomList = [];
                    locationObject.rooms.forEach(rooms => {
                        if (meeting.value === CLUBMEETING) {
                            if (rooms.available) {
                                roomList.push({
                                    available: rooms.available,
                                    title: rooms.roomName,
                                    value: rooms.roomId,
                                    code: rooms.code
                                })
                            }
                        }
                        else if (meeting.value === RECCURINGMEETING) {
                            roomList.push({
                                available: rooms.available,
                                title: rooms.roomName,
                                value: rooms.roomId,
                                code: rooms.code
                            })
                        }
                    })
                    if (this.props.meeting && this.props.meeting.location.id === locationObject.id) {
                        this.setState({ roomList: [...this.state.roomListExisting, ...roomList, { available: true, title: "Other", value: 0, code: "OTH" }], showOtherRoom: false, room: "" });

                    }
                    else {
                        this.setState({ roomList: [...roomList, { available: true, title: "Other", value: 0, code: "OTH" }], showOtherRoom: false, room: "" });
                    }
                }
            })
        });


    }
    handleLocationSelectChange = async (locationDetails, location) => {
        await locationDetails.forEach(locationObject => {
            if (locationObject.id === location) {
                let roomList = [];
                locationObject.rooms.forEach(rooms => {
                    if (rooms.available) {
                        roomList.push({
                            available: rooms.available,
                            title: rooms.roomName,
                            value: rooms.roomId,
                            code: rooms.code
                        })
                    }
                })
                if (this.props.meeting && this.props.meeting.location.id === locationObject.id) {
                    this.setState({ roomList: [...this.state.roomListExisting, ...roomList, { available: true, title: "Other", value: 0, code: "OTH" }] });
                   
                }
                else {
                    this.setState({ roomList: [...roomList, { available: true, title: "Other", value: 0, code: "OTH" }] });
                   
                }
            }
        })
    }

    handleRoomSelect = (room, meetingObj = this.state.meetingObj) => {
        if (room === 0) {
            this.setState({ room: room, showOtherRoom: true })
        }
        else {
            this.setState({ room: room, showOtherRoom: false });
            if (meetingObj.value === RECCURINGMEETING) {
                this.putMeetingLocationPreview(room);
            }
        }
    }

    putMeetingLocationPreview = (room) => {
        let request = {
            roomId: room,
            roomName: this.state.roomName,
            update: false,
            startDate: this.state.meetingObj.startTime,
            endDate: this.state.meetingObj.endTime,
            startTime: this.state.meetingObj.startDate,
            endTime: this.state.meetingObj.endDate,
            recurrenceType: this.state.meetingObj.recurrenceType,
            dayOfWeek: this.state.meetingObj.dayOfWeek,
            day: this.state.meetingObj.dayOfMonth
        }
        GroupMeetingsService.putMeetingLocationPreview(request)
            .then(meetingPreview => {
                this.setState({ meetingPreview });
                this.openShowPreviewDialog();
            })
            .catch(error => {
                riverToast.show("Failed to load meeting Preview.");
            })
    }

    openShowPreviewDialog = () => {
        this.setState({ showPreviewDialog: true });
    }

    handleAddGuest = (file, meeting = this.state.meetingObj) => {
        let guestList = [...meeting.guest];
        guestList.push(file);
        let meetingObj = {
            ...meeting,
            guest: guestList
        }

        this.setState({ meetingObj });
        this.handleAddGuestDialogClose();
    }

    handleDeleteGuest = (file, meeting = this.state.meetingObj) => {
        let guestList = [...meeting.guest];
        const index = guestList.findIndex(guest => (guest.name === file.name));
        if (index > -1) {
            guestList.splice(index, 1);
        }
        let meetingObj = {
            ...meeting,
            guest: guestList
        }
        this.setState({ meetingObj });
    }

    handleCreateMeetingClose = () => {
        this.props.history.push("/group-meetings/list");
    }

    handleMeetingCreate = () => {
        const inviteesId = this.state.selectedInviteesList.map(invitees => invitees.id)
        let selectedRoom = {};
        if (this.state.room === 0) {
            selectedRoom = {
                roomId: this.state.room,
                roomName: this.state.roomName
            }
        }
        else {
            selectedRoom = {
                roomId: this.state.room
            }
        }
        let request = {
            type: this.state.meetingObj.value,
            title: this.state.meetingObj.title,
            description: this.state.meetingObj.agenda,
            startTime: this.state.meetingObj.startDate,
            endTime: this.state.meetingObj.endDate,
            invitees: inviteesId,
            guests: this.state.meetingObj.guest,
            location: this.state.meetingObj.location,
            room: selectedRoom,
            startDate: this.state.meetingObj.startTime,
            endDate: this.state.meetingObj.endTime,
            recurrenceType: this.state.meetingObj.recurrenceType,
            dayOfWeek: this.state.meetingObj.dayOfWeek,
            day: this.state.meetingObj.dayOfMonth
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.handleMeetingCreateCall(request)
            .then(() => {
                this.resetForm();
                this.handleCreateMeetingClose();
            })
            .catch(() => {
            });
    }

    handleMeetingCreateCall = (request) => {
        return GroupMeetingsService.handleMeetingCreate(request)
            .then(() => {

                riverToast.show("New meeting is been created");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating meeting.");
                throw "Meeting create error"
            });
    }

    validateForm(request, meetingObj = this.state.meetingObj) {
        let isValid = true;
        let startDate = meetingObj.startDate;
        let timeBoolean = moment(meetingObj.endDate).isSameOrBefore(startDate);
        if (!request.type.length) {
            isValid = false;
            riverToast.show("Please Enter the meeting type");
        }
        else if (!request.title) {
            isValid = false;
            riverToast.show("Please enter a title for the meeting");
        }
        else if (!request.description) {
            isValid = false;
            riverToast.show("Please enter a description for the meeting");
        }
        else if (request.type === CLUBMEETING && !request.startTime) {
            isValid = false;
            riverToast.show("Please enter a start date for the meeting");
        }
        else if (request.type === CLUBMEETING && !request.endTime) {
            isValid = false;
            riverToast.show("Please enter an end date for the meeting");
        }
        else if (timeBoolean === true) {
            isValid = false;
            riverToast.show("Please enter a valid start and end dates");
        }
        else if (request.location === "") {
            isValid = false;
            riverToast.show("Please enter a meeting location");
        }
        else if (request.room.roomId === "") {
            isValid = false;
            riverToast.show("Please enter a meeting room for the selected location");
        }
        else if (request.room.roomId === 0 && request.room.roomName === "") {
            isValid = false;
            riverToast.show("Please enter room name");
        }
        return isValid;
    }

    resetForm() {
        this.setState({
            room: "",
            invitees: "",
            page: 0,
            selectedInviteesList: [],
            inviteesArrayList: [],
            locationList: [],
            roomList: [],
            locationRoomsList: [],
            disableYearSelection: false,
            addGuestDialog: false,
            selectedDate: moment(),
            meetingObj: {
                value: CLUBMEETING,
                title: "",
                agenda: "",
                location: "",
                endTime: "",
                startTime: "",
                dayOfMonth: "",
                recurrenceType: RECCURTYPE,
                guest: [],
                dayOfWeek: [],
                startDate: moment().toDate().getTime(),
                endDate: moment().toDate().getTime(),
            }
        });
    }
    openRecurrenceAction = () => {
        this.setState({ openRecurrenceAction: true })
    }

    onEditRecurrenceAction = () => {
        this.setState({ openRecurrenceAction: true, isEditButtonClicked: true })
    }

    handleCheckboxChange = name => (event) => {
        let meeting = this.state.meetingObj;
        let checked = event.target.checked;
        if (checked === true) {
            this.openRecurrenceAction();
            let meetingObj = {
                ...meeting,
                value: RECCURINGMEETING,
                endTime: "",
                startTime: "",
                dayOfMonth: "",
                recurrenceType: RECCURTYPE,
                dayOfWeek: [],
                startDate: moment().toDate().getTime(),
                endDate: moment().toDate().getTime()
            }
            this.setState({ [name]: checked, meetingObj });
        }
        else {
            let meetingObj = {
                ...meeting,
                value: CLUBMEETING,
                endTime: "",
                startTime: "",
                dayOfMonth: "",
                recurrenceType: RECCURTYPE,
                dayOfWeek: [],
                startDate: moment().toDate().getTime(),
                endDate: moment().toDate().getTime()
            }
            this.setState({
                [name]: checked,
                meetingObj,
                isEditButtonClicked: false,
                recurrence: ""
            });
        }
    }

    submitRecurrenceData = (recurrence) => {
        let meeting = this.state.meetingObj;
        this.closeRecurrenceAction(meeting);
        this.setState({ checked: true })
        let recurrenceShowType;
        if (recurrence.recurrenceType === MONTHLY) {
            recurrenceShowType = "Monthly";
        }
        else if (recurrence.recurrenceType === WEEKLY) {
            recurrenceShowType = "Weekly";
        }
        else if (recurrence.recurrenceType === DAILY) {
            recurrenceShowType = "Daily";
        }
        let meetingObj = {
            ...meeting,
            value: RECCURINGMEETING,
            startTime: recurrence.startDate,
            endTime: recurrence.endDate,
            startDate: recurrence.startTime,
            endDate: recurrence.endTime,
            recurrenceType: recurrence.recurrenceType,
            dayOfWeek: recurrence.dayOfWeek,
            dayOfMonth: recurrence.day,
        }
        let startTime = moment(recurrence.startTime).format('hh:mm A');
        let endTime = moment(recurrence.endTime).format('hh:mm A');
        let startDate = moment(recurrence.startDate).format('DD-MM-YYYY');
        let endDate = moment(recurrence.endDate).format('DD-MM-YYYY');
        this.setState({
            recurrence,
            meetingObj,
            checked: true,
            recurrenceShowType: recurrenceShowType,
            showStartTime: startTime,
            showEndTime: endTime,
            showStartDate: startDate,
            showEndDate: endDate
        });
        if (this.state.room !== "") {
            this.putMeetingLocationPreview(this.state.room);
        }
    }


    closeRecurrenceAction = () => {
        let meeting = this.state.meetingObj;
        let isEditButtonClicked = this.state.isEditButtonClicked;
        if (isEditButtonClicked) {
            let meetingObj = {
                ...meeting,
                value: RECCURINGMEETING
            }
            this.setState({
                openRecurrenceAction: false,
                meetingObj
            });
        }
        else {
            let meetingObj = {
                ...meeting,
                value: CLUBMEETING,
            }
            this.setState({
                openRecurrenceAction: false,
                meetingObj,
                checked: false,
                recurrence: ""
            });
        }
    }

    handleMeetingUpdate = () => {
        const meetingId = this.props.meeting.referenceCode;
        const inviteesId = this.state.selectedInviteesList.map(invitees => invitees.id)
        let selectedRoom;
        if (this.state.room === 0) {
            selectedRoom = {
                roomId: this.state.room,
                roomName: this.state.roomName
            }
        }
        else {
            selectedRoom = {
                roomId: this.state.room
            }
        }
        let request = {
            type: RECCURINGMEETING,
            title: this.state.meetingObj.title,
            description: this.state.meetingObj.agenda,
            invitees: inviteesId,
            guests: this.state.meetingObj.guest,
            location: this.state.meetingObj.location,
            startTime: this.state.meetingObj.startDate,
            endTime: this.state.meetingObj.endDate,
            room: selectedRoom,
            update: "NOR"
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        GroupMeetingsService.putUpdatedMeeting(meetingId, request)
            .then(meetingDetails => {
                this.props.onClose();
                this.props.getGroupMeetingsDetails(meetingId);
                riverToast.show("Meeting Updated Successfully.");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to start meeting .");
            });
    }
}

export default withRouter(CreateMeetingsMaster);