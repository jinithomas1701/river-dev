import React, { Component } from "react";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import LoadedButton from "../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../Util/util";
import "./AddGuestDialog.scss";
import { riverToast } from "../../Common/Toast/Toast";
const classes = Util.overrideCommonDialogClasses();
const EMAILFORMAT = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class AddGuestDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            designation: ""
        }
    }
    render() {
        const props = this.props;
        return (
            <Dialog classes={classes} className='addGuest-dialog-wrap' open={props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    Add Guest
            </DialogTitle>
                <DialogContent className="content">
                    <div className="name">
                        <TextField
                            label='Guest Name:'
                            name='name'
                            fullWidth
                            className='input-text'
                            value={this.state.name}
                            onChange={this.handleTextChange}
                        />
                    </div>
                    <div className="email">
                        <TextField
                            label='Email:'
                            name='email'
                            fullWidth
                            type="email"
                            className='input-text'
                            value={this.state.email}
                            onChange={this.handleTextChange}
                        />
                    </div>
                    <div className="designation">
                        <TextField
                            label='Designation:'
                            name='designation'
                            fullWidth
                            className='input-text'
                            value={this.state.designation}
                            onChange={this.handleTextChange}
                        />
                    </div>
                    <DialogActions className="submit-wrapper">
                        <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.onGuestDetailSubmission}>Add Guest</LoadedButton>
                        <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
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
    handleClose = () => {
        this.props.onClose();
    }
    onGuestDetailSubmission = () => {
        let request = {
            name: this.state.name,
            email: this.state.email,
            designation: this.state.designation
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.resetForm();
        this.props.onGuestSubmit(request);
    }
    resetForm() {
        this.setState({
            name: "",
            email: "",
            designation: ""
        });
    }
    validateForm(request) {
        let isValid = true;
        var filter = EMAILFORMAT;
        if (!filter.test(request.email)) {
            riverToast.show('Please provide a valid email address');
            isValid = false;
        }
        else if (!request.name) {
            isValid = false;
            riverToast.show("please provide name of the guest");
        }
        else if (!request.designation) {
            isValid = false;
            riverToast.show("please providde proper designation of the guest");
        }
        return isValid;
    }
}
export default AddGuestDialog