import React, { Component } from "react";
import moment from 'moment';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import LoadedButton from "../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../Util/util";
//css
import "./MeetingDeleteDialog.scss";
const classes = Util.overrideCommonDialogClasses();
class MeetingDeleteDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            type: "NOR",
            checked: false
        };
    }
    render() {
        const props = this.props;
        const meeting = this.props.meeting;
        return (
            <Dialog classes={classes} className='meeting-delete-dialog-wrap' open={props.open} onRequestClose={props.onClose}>
                <DialogTitle className='header'>
                    Cancel Meeting
            </DialogTitle>
                <DialogContent className='content'>

                    <p className="meeting-message">Are you sure to cancel the next meeting on {moment(meeting.startTime).format('DD MMMM YYYY')} ? </p>
                    <div className="comment-box">
                        <TextField
                            label='Comment:'
                            name='comment'
                            fullWidth
                            rows={4}
                            multiline
                            className='input-text'
                            margin='normal'
                            value={this.state.comment}
                            onChange={this.handleTextChange}
                        />
                    </div>
                    {meeting.type === "CSM" &&
                        <div className="check-switch">
                            <span className="switch-message">Permanently delete this meeting</span>
                            <Checkbox
                                checked={this.state.checked}
                                onChange={this.handleCheckboxChange('checked')}
                                value="true"
                            />
                        </div>
                    }
                    <DialogActions className="submit-wrapper">
                        <LoadedButton loading={props.loading} className="btn-default btn-cancel" onClick={this.props.onClose}>Cancel</LoadedButton>
                        <LoadedButton loading={props.loading} className="btn-complimentary btn-cancel" onClick={this.onMeetingDelete}>{props.submitButtonText}</LoadedButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    onMeetingDelete = () => {
        let request = {
            comment : this.state.comment
        }
        this.props.onSubmit(this.state.type,request);
    }

    handleCheckboxChange = (name) => event => {
        this.setState({ [name]: event.target.checked });
        if (event.target.checked === true) {
            this.setState({ type: "REC" });
        }
        else {
            this.setState({ type: "NOR" })
        }
    };
}
export default MeetingDeleteDialog