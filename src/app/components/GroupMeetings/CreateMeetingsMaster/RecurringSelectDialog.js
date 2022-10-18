//---------------------------External Component-------------------------------
import React, { Component } from "react";
import moment from "moment";
import TextField from 'material-ui/TextField';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
//---------------------------Internal Component--------------------------------
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import LoadedButton from "../../Common/LoadedButton/LoadedButton";
import AvatarButton from "../../Common/AvatarButton/AvatarButton";
import { Util } from "../../../Util/util";
import { riverToast } from "../../Common/Toast/Toast";
//------------------------------CSS-------------------------------------------------
import "./RecurringSelectDialog.scss";

const classes = Util.overrideCommonDialogClasses();
const DAILY = "D";
const MONTHLY = "M";
const WEEKLY = "W";
class RecurringSelectDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: "",
            recurrenceType: DAILY,
            endTime: this.props.endTime ? this.props.endTime : moment().toDate().getTime(),
            startTime: this.props.startTime ? this.props.startTime : moment().toDate().getTime(),
            startDate: this.props.startDate ? moment(this.props.startDate) : moment(),
            endDate: this.props.endDate ? this.props.endDate : moment(),
            dayOfWeek: [],
            input: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
        }
        this.periodList = this.getPeriodList();
    }

    componentDidMount() {
        if (this.props.isEditButtonClicked) {
            this.setState({
                recurrenceType: this.props.recurrenceType,
                dayOfWeek: this.props.dayOfWeek,
                day: this.props.day
            });
        }
    }

    render() {
        return (
            <Dialog classes={classes} className='recurrence-dialog-wrap' open={this.props.open} onRequestClose={this.props.onClose}>
                <DialogTitle className='header'>
                    Custom Recurrence
                </DialogTitle>
                <DialogContent className="content">
                    <div className="row">
                        <div className="col-md-12 repeat-period-select">
                            <span className="repeat-title">Repeat </span>

                            <SelectBox
                                classes="input-select"
                                selectedValue={this.state.recurrenceType}
                                selectArray={this.periodList}
                                onSelect={this.handlePeriodChange}
                            />
                            {this.state.recurrenceType === MONTHLY &&
                                <div className=" monthly-wrap">
                                    <span className=" repeat-title "> On Day</span>
                                    <TextField
                                        id="number"
                                        value={this.state.day}
                                        onChange={this.handleNumberChange('day')}
                                        type="number"
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

                    {this.state.recurrenceType === WEEKLY &&
                        <div className="week-days-picker">
                            <span className="week-picker-title">Repeat On</span>
                            <AvatarButton
                                // disabled={false}
                                inputArray={this.state.input}
                                selectedInput={this.state.dayOfWeek}
                                onClick={this.onAvatarButtonClick}
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
                                        value={moment(this.state.startDate).format('YYYY-MM-DD')}
                                        className="ends-dates"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={this.handleNumberChange('startDate')}
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
                                        value={moment(this.state.endDate).format('YYYY-MM-DD')}
                                        className="ends-dates"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={this.handleNumberChange('endDate')}
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton className=" btn-cancel" onClick={this.props.onClose}>Cancel</LoadedButton>
                    <LoadedButton className=" btn-submit" onClick={this.handleRecurrenceSubmit}> Done</LoadedButton>
                </DialogActions>
            </Dialog>
        )
    }
    getPeriodList = () => {
        return [
            { title: "Daily", value: "D" },
            { title: "Weekly", value: "W" },
            { title: "Monthly", value: "M" }
        ];
    }
    handleNumberChange = name => (event) => {
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    handlePeriodChange = (recurrenceType) => {
        this.setState({ recurrenceType });
    }
    onAvatarButtonClick = (dayOfWeek) => {
        this.setState({ dayOfWeek });
    }
    onTimeChange = (event) => {
        const field = event.target.name;
        let time = event.target.value;
        let hour = Number(time.split(":")[0]);
        let min = Number(time.split(":")[1]);
        let timeMilliSeconds = new Date().setHours(hour, min, 0);
        this.setState({ [field]: timeMilliSeconds });
    }

    handleRecurrenceSubmit = () => {
        let startDate = moment(this.state.startDate, "YYYY-MM-DD");
        startDate = startDate.valueOf();
        let endDate = moment(this.state.endDate, "YYYY-MM-DD");
        endDate = endDate.valueOf();
        let recurrence = {
            recurrenceType: this.state.recurrenceType,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            startDate: startDate,
            endDate: endDate,
            dayOfWeek: this.state.dayOfWeek,
            day: this.state.day

        };
        const isValid = this.validateForm(recurrence, startDate, endDate);
        if (!isValid) {
            return;
        }
        this.props.onSubmit(recurrence);
    }
    validateForm = (recurrence, startDate, endDate) => {
        let isValid = true;
        let startTime = this.state.startTime;
        let dateBoolean = moment(endDate).isSameOrBefore(startDate);
        let timeBoolean = moment(this.state.endTime).isSameOrBefore(startTime);
        if (!recurrence.startTime) {
            isValid = false;
            riverToast.show("Enter a valid from time");
        }
        else if (!recurrence.endTime) {
            isValid = false;
            riverToast.show("Enter a valid to time");
        }
        else if (!recurrence.startDate) {
            isValid = false;
            riverToast.show("Enter a valid from date");
        }
        if (dateBoolean === true) {
            isValid = false;
            riverToast.show("Please enter a valid start and end dates");
        }
        else if (timeBoolean === true) {
            isValid = false;
            riverToast.show("Please enter a valid start and end time");
        }
        else if (!recurrence.endDate) {
            isValid = false;
            riverToast.show("Enter a valid to date");
        }
        else if (recurrence.recurrenceType === WEEKLY) {
            if (recurrence.dayOfWeek === []) {
                isValid = false;
                riverToast.show("Enter days of the week");
            }
        }
        else if (recurrence.recurrenceType === MONTHLY) {
            if (recurrence.dayOfMonth === "") {
                isValid = false;
                riverToast.show("Enter day of the month");
            }
        }
        return isValid;
    }

}
export default RecurringSelectDialog