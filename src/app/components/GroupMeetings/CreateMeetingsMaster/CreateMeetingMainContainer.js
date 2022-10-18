import React, { Component } from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Icon from 'material-ui/Icon';
import Datetime from 'react-datetime';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import "./CreateMeetingMainContainer.scss";
class CreateMeetingMainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let props = this.props;

        return (
            <div className="meeting-details-wrap">
                <div className="row meeting-type">
                    <FormControl component="fieldset" className='meeting-type-radio'>

                        <RadioGroup
                            aria-label="Interested"
                            name="value"
                            className='meeting-type-radio-button'
                            value={props.meetingObj.value}
                            onChange={props.handleRadioButtonChange}
                        >
                            <FormControlLabel classes={{ label: "radio-text" }} className='radio-label' value="CM" control={<Radio />} label="Club Meeting" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="title">
                    <TextField
                        label='Title:'
                        name='title'
                        fullWidth
                        multiline
                        className='input-text'
                        margin='normal'
                        value={props.meetingObj.title}
                        onChange={props.handleTextChange}
                    />
                </div>
                <div className="agenda">
                    <TextField
                        label='Agenda:'
                        name='agenda'
                        fullWidth
                        rows={2}
                        multiline={true}
                        className='input-text'
                        margin='normal'
                        value={props.meetingObj.agenda}
                        onChange={props.handleTextChange}
                    />
                </div>
                {props.showRecurrenceButton === true &&
                    <div className="row">
                        <div className="col-md-6 recurring-check">
                            <span className="recurring-title">Recurring:</span>
                            <Checkbox
                                checked={props.checked}
                                onChange={props.handleCheckboxChange('checked')}
                                value="true"
                            />
                        </div>
                    </div>
                }
                {props.checked === true && props.recurrence &&
                    <div className="recurrence-data">
                        <div className="row">
                            <div className="col-md-5 recurr-first">
                                <span className="recurr-title">Repeat:</span>
                                <p className="recurr-body">{props.recurrenceShowType}</p>
                            </div>
                            <div className="col-md-5 ">
                                {props.meetingObj.recurrenceType === "M" &&
                                    <div className="recurr-first">
                                        <span className="recurr-title">On day:</span>
                                        <p className="recurr-body">{props.recurrence.day}</p>
                                    </div>
                                }
                            </div>
                            <div className="col-md-2">
                                <Icon className="button-edit" onClick={props.onEditRecurrenceAction}>edit_icon</Icon>
                            </div>
                        </div>
                        {props.meetingObj.recurrenceType === "W" &&
                            <div className="row">
                                <div className="col-md-12 recurr-first">
                                    <span className="recurr-title">Repeate On:</span>
                                    <p className="recurr-body">{props.recurrence.dayOfWeek}</p>
                                </div>
                            </div>
                        }
                        <div className="row">
                            <div className="col-md-6 recurr-first">
                                <span className="recurr-title">Start Date:</span>
                                <p className="recurr-body">{props.showStartDate}</p>
                            </div>
                            <div className="col-md-6 recurr-first">
                                <span className="recurr-title"> Start Time:</span>
                                <p className="recurr-body">{props.showStartTime}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 recurr-first">
                                <span className="recurr-title">End Date:</span>
                                <p className="recurr-body">{props.showEndDate}</p>
                            </div>
                            <div className="col-md-6 recurr-first">
                                <span className="recurr-title">End Time:</span>
                                <p className="recurr-body">{props.showEndTime}</p>
                            </div>
                        </div>
                    </div>
                }
                {props.meetingObj.value === "CM" && !props.isEditButtonClicked &&
                    <div className="row">
                        <div className="col-md-6 input-container">
                            <div className="datetime-picker-wrapper">
                                <label htmlFor="from-date">From</label>
                                <Datetime
                                    inputProps={{ placeholder: 'From', id: "from-date", className: "datetime-input" }}
                                    isValidDate={props.isDateValid.bind(this)}
                                    className="datetime-picker"
                                    onChange={props.fromDateChange}
                                    onBlur={props.handleLocationSelect}
                                    value={props.meetingObj.startDate}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 input-container">
                            <div className="datetime-picker-wrapper">
                                <label htmlFor="to-date">To</label>
                                <Datetime inputProps={{ placeholder: 'To', id: "to-date", className: "datetime-input" }}
                                    isValidDate={props.isDateValid.bind(this)}
                                    className="datetime-picker"
                                    onChange={props.toDateChange}
                                    onBlur={props.handleLocationSelect}
                                    value={props.meetingObj.endDate}
                                />
                            </div>
                        </div>
                    </div>
                }

                <h1 className="location-heading">Location</h1>
                <div className="row">
                    <div className="col-md-6">
                        <SelectBox
                            label="Select Location:"
                            classes="input-select"
                            fullWidth
                            selectedValue={props.meetingObj.location}
                            selectArray={props.locationList}
                            onSelect={props.handleLocationChange.bind(this, props.locationRoomsList)}
                        />
                    </div>
                    <div className="col-md-6">
                        <SelectBox
                            label="Select Room:"
                            classes="input-select"
                            fullWidth
                            selectedValue={props.room}
                            disabled={props.roomList.length > 0 ? false : true}
                            selectArray={props.roomList.length > 0 ? props.roomList : [{ title: "No Rooms Available", value: "" }]}
                            onSelect={props.handleRoomSelect}
                        />
                    </div>
                </div>
                {props.showOtherRoom &&
                    <div className="other-rooms">
                        <TextField
                            label='Other Room:'
                            name='roomName'
                            fullWidth
                            multiline
                            className='input-text'
                            margin='normal'
                            value={props.roomName}
                            onChange={props.handleOtherRoomChange}
                        />
                    </div>
                }
            </div>
        )
    }
}
export default CreateMeetingMainContainer