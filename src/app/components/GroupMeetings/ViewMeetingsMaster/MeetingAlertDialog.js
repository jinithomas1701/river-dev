import React, { Component } from "react";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import LoadedButton from "../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../Util/util";
//css
import "./MeetingAlertDialog.scss";
const classes = Util.overrideCommonDialogClasses();
class MeetingAlertDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const props = this.props;
        return (
            <Dialog classes={classes} className='meeting-alert-dialog-wrap' open={props.open} onRequestClose={props.onClose}>
                <DialogTitle className='header'>
                    ALERT
            </DialogTitle>
                <DialogContent className='content'>
                    <div className='message'>
                        <p>{this.props.inputText}</p>
                    </div>
                    <DialogActions className="submit-wrapper">
                        <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={props.onClose}>Cancel</LoadedButton>
                        <LoadedButton loading={this.props.loading} className=" btn-delete" onClick={this.props.onSubmit}>{this.props.submitButtonText}</LoadedButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
}
export default MeetingAlertDialog