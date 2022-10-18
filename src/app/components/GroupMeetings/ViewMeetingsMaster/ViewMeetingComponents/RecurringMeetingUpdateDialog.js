import React, { Component } from "react";
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { SelectBox } from "../../../Common/SelectBox/SelectBox";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { Util } from "../../../../Util/util";
import { riverToast } from "../../../Common/Toast/Toast";
import GroupMeetingsService from "../../GroupMeetings.service";
import AvatarButton from "../../../Common/AvatarButton/AvatarButton";
import PreviewDetailDialog from "../../CommonUtils/PreviewDetailDialog/PreviewDetailDialog";
//css
import "./RecurringMeetingUpdateDialog.scss";
import moment from "moment";
const classes = Util.overrideCommonDialogClasses();
const NORMAL = "NOR";
const RECCURING = "REC";
const MONTHLY = "M";
const WEEKLY = "W";
const CLUBMEETING = "CM";
const RECCURRING_MEETING = "CSM";
class RecurringMeetingUpdateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "",
            room: "",
            endTime: this.props.meetingSuperDetails.endTime,
            startTime: this.props.meetingSuperDetails.startTime,
            meetingPreview: "",
            day: "",
            dayOfWeek: [],
            type: NORMAL,
            roomName: "",
            meetingSuperDetails: "",
            showOtherRoom: false,
            showPreviewDialog: false,
            locationList: [],
            roomList: [],
            roomListExisting: [],
            locationRoomsList: [],
            input: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
        }
        this.periodList = this.getPeriodList();
    }
    componentDidMount() {
        let dayOfWeek = this.setWeekDays(this.props.meetingSuperDetails.dayOfWeek);
        this.setState({ dayOfWeek });
        if (this.props.meetingSuperDetails.room.roomId === 0) {
            this.setState({
                room: this.props.meetingSuperDetails.room.roomId,
                showOtherRoom: true,
                roomName: this.props.meetingSuperDetails.room.roomName
            });
        }
        else {
            let roomList = [];
            roomList.push({
                available: true,
                title: this.props.meetingSuperDetails.room.roomName,
                value: this.props.meetingSuperDetails.room.roomId,
                code: this.props.meetingSuperDetails.room.code
            })
            this.setState({
                roomListExisting: [...roomList],
                room: this.props.meetingSuperDetails.room.roomId
            })
        }
        this.loadRoomDetails(this.props.startTime, this.props.endTime);
        this.setState({
            meetingSuperDetails: this.props.meetingSuperDetails,
            location: this.props.meetingSuperDetails.location.id,
        });
    }
    render() {
        let startDate = moment(this.props.meetingSuperDetails.startTime).format('YYYY-MM-DD');
        let endDate = moment(this.props.meetingSuperDetails.endTime).format('YYYY-MM-DD');
        let meetingSuperDetails = this.props.meetingSuperDetails;
        return (
            <Dialog classes={classes} className='recurringUpdateDialog-wrapper' open={this.props.open} onRequestClose={this.props.onClose}>
                <DialogTitle className='header'>
                    Update Meeting
                </DialogTitle>
                <DialogContent className="content">
                    <div className="row">
                        <div className="col-md-12 repeat-period-select">
                            <span className="repeat-title">Repeat </span>
                            <SelectBox
                                classes="input-select"
                                selectedValue={meetingSuperDetails.recurrenceType}
                                selectArray={this.periodList}
                                isDisabled={true}
                            />
                            {meetingSuperDetails.recurrenceType === MONTHLY &&
                                <div className=" monthly-wrap">
                                    <span className=" repeat-title "> On Day</span>
                                    <TextField
                                        id="number"
                                        defaultValue={meetingSuperDetails.day}
                                        type="number"
                                        disabled={true}
                                        className="repeat-number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="none"
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    {meetingSuperDetails.recurrenceType === WEEKLY &&
                        <div className="week-days-picker">
                            <span className="week-picker-title">Repeat On</span>

                            <AvatarButton
                                disabled={true}
                                inputArray={this.state.input}
                                selectedInput={this.state.dayOfWeek}
                            />

                        </div>
                    }

                    <div className="row time-picker ">
                        <div className="col-md-6">
                            <TextField
                                id="time"
                                label="Start Time"
                                type="time"
                                name="startTime"
                                value={moment(this.state.startTime).format('kk:mm')}
                                fullWidth
                                onChange={this.onTimeChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300,
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                id="time"
                                label="End Time"
                                type="time"
                                name="endTime"
                                value={moment(this.state.endTime).format('kk:mm')}
                                fullWidth
                                onChange={this.onTimeChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300,
                                }}
                            />
                        </div>
                    </div>
                    <table className="end-date-wrap">
                        <tbody>
                            <tr>
                                <td className="ends-title">Period</td>
                            </tr>

                            <tr className="time-row">

                                <td className="end-title">
                                    From
                                </td>
                                <td>
                                    <TextField
                                        id="date"
                                        type="date"
                                        name="startDate"
                                        disabled={true}
                                        defaultValue={startDate}
                                        className="ends-dates"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr className="time-row">

                                <td className="end-title">
                                    To
                                </td>
                                <td>
                                    <TextField
                                        id="date"
                                        type="date"
                                        name="endDate"
                                        disabled={true}
                                        defaultValue={endDate}
                                        className="ends-dates"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <div className="check-switch">
                        <span className="switch-message">Permanently edit this meeting</span>
                        <Checkbox
                            checked={this.state.checked}
                            onChange={this.handleCheckboxChange('checked')}
                            value="true"
                        />
                    </div>
                    <h1 className="location-heading">Location</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <SelectBox
                                label="Select Location:"
                                classes="input-select"
                                fullWidth
                                selectedValue={this.state.location}
                                selectArray={this.state.locationList}
                                onSelect={this.handleLocationSelectChange.bind(this, this.state.locationRoomsList)}
                            />
                        </div>
                        <div className="col-md-6">
                            <SelectBox
                                label="Select Room:"
                                classes="input-select"
                                fullWidth
                                selectedValue={this.state.room}
                                disabled={this.state.roomList.length > 0 ? false : true}
                                selectArray={this.state.roomList.length > 0 ? this.state.roomList : [{ title: "No Rooms Available", value: "" }]}
                                onSelect={this.handleRoomSelect}
                            />
                        </div>
                    </div>
                    {this.state.showOtherRoom === true &&
                        <div className="other-rooms">
                            <TextField
                                label='Other Room:'
                                name='roomName'
                                fullWidth
                                multiline
                                className='input-text'
                                margin='normal'
                                value={this.state.roomName}
                                onChange={this.handleTextChange}
                            />
                        </div>
                    }
                    {this.state.showPreviewDialog && this.state.meetingPreview &&
                        <PreviewDetailDialog
                            meetingPreview={this.state.meetingPreview}
                            open={this.state.showPreviewDialog}
                            onClose={this.closeShowPreviewDialog}
                        />
                    }
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton className=" btn-cancel" onClick={this.props.onClose}>Cancel</LoadedButton>
                    <LoadedButton className=" btn-submit" onClick={this.handleUpdateMeeting}> Done</LoadedButton>
                </DialogActions>
            </Dialog>
        )
    }

    setWeekDays = (input) => {
        return input.map(i => {
            return this.state.input[i - 1];
        });

    }

    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    onTimeChange = (event) => {
        const field = event.target.name;
        let time = event.target.value;
        let hour = Number(time.split(":")[0]);
        let min = Number(time.split(":")[1]);
        let timeMilliSeconds = new Date().setHours(hour, min, 0);
        this.setState({ [field]: timeMilliSeconds });
    }
    getPeriodList = () => {
        return [
            { title: "Daily", value: "D" },
            { title: "Weekly", value: "W" },
            { title: "Monthly", value: "M" }
        ];
    }


    handleLocationChange = async (locationDetails, location) => {
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
                if (this.props.meetingSuperDetails.location.id === locationObject.id) {
                    this.setState({ roomList: [...this.state.roomListExisting, ...roomList, { available: true, title: "Other", value: 0, code: "OTH" }] });
                }
                else {
                    this.setState({ roomList: [...roomList, { available: true, title: "Other", value: 0, code: "OTH" }] });
                }
            }
        })
    }

    handleLocationSelectChange = async (locationDetails, location) => {
        this.setState({ location });
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
                if (this.props.meetingSuperDetails.location.id === locationObject.id) {
                    this.setState({ roomList: [...this.state.roomListExisting, ...roomList, { available: true, title: "Other", value: 0, code: "OTH" }], showOtherRoom: false, room: "" });
                }
                else {
                    this.setState({ roomList: [...roomList, { available: true, title: "Other", value: 0, code: "OTH" }], showOtherRoom: false, room: "" });
                }
            }
        })
    }

    handleRoomSelect = (room) => {
        if (room === 0) {
            this.setState({ room: room, showOtherRoom: true })
        }
        else {
            this.setState({ room: room, showOtherRoom: false });
            this.putMeetingLocationPreview(room);
        }

    }
    putMeetingLocationPreview = (room) => {
        let day = this.props.meetingSuperDetails.day.toString();
        let meetingId = this.props.meetingSuperDetails.referenceCode;
        let request = {
            roomId: room,
            roomName: this.state.roomName,
            meetingsId: meetingId,
            update: true,
            startDate: this.props.meetingSuperDetails.startTime,
            endDate: this.props.meetingSuperDetails.endTime,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            recurrenceType: this.props.meetingSuperDetails.recurrenceType,
            dayOfWeek: this.props.meetingSuperDetails.dayOfWeek,
            day: day
        }
        GroupMeetingsService.putMeetingLocationPreview(request)
            .then(meetingPreview => {
                this.setState({ meetingPreview });
                {
                    this.state.type === RECCURING &&
                    this.openShowPreviewDialog();
                }
            })
            .catch(error => {
                riverToast.show("Failed to load meeting Preview.");
            })
    }
    openShowPreviewDialog = () => {
        this.setState({ showPreviewDialog: true });
    }

    closeShowPreviewDialog = () => {
        this.setState({ showPreviewDialog: false });
    }

    loadRoomDetails = (startDate, endDate) => {
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
                this.handleLocationChange(locationDetails, this.state.location);
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while loading meeting rooms.")
            })
    };

    handleCheckboxChange = (name) => event => {
        this.setState({ [name]: event.target.checked });
        if (event.target.checked === true) {
            this.setState({ type: "REC", room: "" });
        }
        else {
            this.setState({ type: "NOR", room: "" })
        }
    };

    handleUpdateMeeting = () => {
        const meetingId = this.props.meeting.referenceCode;
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
            type: RECCURRING_MEETING,
            title: "",
            description: "",
            invitees: [],
            guests: [],
            location: this.state.location,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            room: selectedRoom,
            update: this.state.type
        }

        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        GroupMeetingsService.putUpdatedMeeting(meetingId, request)
            .then(meetingDetails => {
                this.resetForm();
                this.props.onClose();
                this.props.getGroupMeetingsDetails(meetingId);

                riverToast.show("Meeting Updated Successfully.");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to start meeting .");
            });
    }

    resetForm() {
        this.setState({
            location: "",
            room: "",
            endTime: "",
            startTime: "",
            type: NORMAL,
            roomName: "",
            meetingSuperDetails: "",
            showOtherRoom: false,
            showPreviewDialog: false,
            locationList: [],
            roomList: [],
            roomListExisting: [],
            locationRoomsList: [],
        });
    }

    validateForm(request) {
        let isValid = true;
        let startTime = request.startTime;
        let timeBoolean = moment(request.endTime).isSameOrBefore(startTime);
        if (request.type === CLUBMEETING && !request.startTime) {
            isValid = false;
            riverToast.show("Please enter a start date for the meeting");
        }
        else if (request.type === CLUBMEETING && !request.endTime) {
            isValid = false;
            riverToast.show("Please enter an end date for the meeting");
        }
        else if (!request.location) {
            isValid = false;
            riverToast.show("Please enter a location");
        }
        else if (!request.room) {
            isValid = false;
            riverToast.show("Please enter a room");
        }
        else if (timeBoolean === true) {
            isValid = false;
            riverToast.show("Please enter a valid start and end time");
        }
        return isValid;
    }

}
export default RecurringMeetingUpdateDialog