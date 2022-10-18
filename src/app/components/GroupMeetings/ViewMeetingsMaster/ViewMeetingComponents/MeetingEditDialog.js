import React, { Component } from "react";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import CreateMeetingsMaster from "../../CreateMeetingsMaster/CreateMeetingsMaster";
import { Util } from "../../../../Util/util";
//css
import "./MeetingEditDialog.scss";
const classes = Util.overrideCommonDialogClasses();
class MeetingEditDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const props = this.props;
        return (
            <Dialog classes={classes} className='meetingEditDialog-wrapper' open={this.props.open} onRequestClose={this.props.onClose}>
                <DialogTitle className='header'>
                    Update Meeting
                </DialogTitle>
                <DialogContent className="content">
                    <CreateMeetingsMaster
                        getGroupMeetingsDetails={props.getGroupMeetingsDetails}
                        open={this.props.open}
                        onClose={this.props.onClose}
                        meeting={props.meeting}
                    />
                </DialogContent>
            </Dialog>
        )
    }
}
export default MeetingEditDialog