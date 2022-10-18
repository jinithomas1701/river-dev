import React, { Component } from 'react';
import PropTypes from "prop-types";
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import LoadedButton from '../../../../Common/LoadedButton/LoadedButton';
import TextField from 'material-ui/TextField';
import './DialogEditAllowanceDetails.scss';
import { riverToast } from '../../../../Common/Toast/Toast';

class DialogEditAllowanceDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            meetingAllowance: "",
            eventAllowance: "",
            amountType: ""
        }
    }

    render() {
        const state = this.state;
        const props = this.props;
        return (
            <Dialog className="edit-allowance-details-dialog-wrapper" open={props.isDialogOpen} fullWidth={true} size="md" onRequestClose={this.closeDialogHandler}>
                <DialogTitle className="header">{props.title}</DialogTitle>
                {
                    (props.locationDetails || props.clubDetails) &&
                    <DialogContent className="content">
                        <div className="row">
                            <div className="col-md-12">
                                {props.children}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <TextField
                                    label="Meeting Allowance*"
                                    name="meetingAllowance"
                                    className="input-text"
                                    type="number"
                                    value={this.state.meetingAllowance}
                                    onChange={this.textChangeHandler}
                                    autoFocus={true}
                                />
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    label="Event Allowance*"
                                    name="eventAllowance"
                                    className="input-text"
                                    type="number"
                                    value={this.state.eventAllowance}
                                    onChange={this.textChangeHandler}
                                />
                            </div>
                        </div>
                    </DialogContent>
                }
                <DialogActions className="submit-wrapper">
                    <LoadedButton
                        disabled={props.isLoading}
                        className="btn-default btn-cancel"
                        type={"button"}
                        children="Cancel"
                        onClick={this.closeDialogHandler}
                    />
                    <LoadedButton
                        disabled={props.isLoading}
                        loading={props.isLoading}
                        className="btn-primary"
                        type={"button"}
                        children="Submit"
                        onClick={this.editDetailsSubmitHandler}
                    />
                </DialogActions>
            </Dialog>
        );
    }

    resetForm = () => {
        this.setState({
            meetingAllowance: "",
            eventAllowance: "",
            amountType: ""
        });
    }

    validateForm = (request) => {
        let isValid = true;

        if(request.meetingLimit === 0 && !this.state.meetingAllowance){
            isValid = false;
            riverToast.show("Please enter a valid amount for meeting allowance");
        }
        else if(!Number.isInteger(request.meetingLimit)){
            isValid = false;
            riverToast.show("Please do not use a decimal digit for meeting allowance.");   
        }
        else if(request.eventLimit === 0 && !this.state.eventAllowance){
            isValid = false;
            riverToast.show("Please enter a valid amount for event allowance");
        }
        else if(!Number.isInteger(request.eventLimit)){
            isValid = false;
            riverToast.show("Please do not use a decimal digit for event allowance.");   
        }

        return isValid;
    }

    closeDialogHandler = () => {
        this.resetForm();
        this.props.handleClose();
    }

    editDetailsSubmitHandler = () => {
        const amountType = this.props.locationDetails?this.props.locationDetails.location.amountType:
                            this.props.clubDetails?this.props.clubDetails.amountType: null;
        let request = {
            meetingLimit: Number(this.state.meetingAllowance),
            eventLimit: Number(this.state.eventAllowance),
            amountType: amountType
        };

        const isValid = this.validateForm(request);
        if(!isValid){
            return;
        }

        this.props.handleSubmit(request)
        .then(() => {
            this.closeDialogHandler();
        })
        .catch(error =>{})
    }

    textChangeHandler = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        if ((!Number.isNaN(value)) && Number(value) >= 0) {
            this.setState({ [field]: value });
        }
    }

}

DialogEditAllowanceDetails.defaultProps = {
    title: "New Title",
    locationDetails: null,
    clubDetails: null
};

DialogEditAllowanceDetails.propTypes = {
    title: PropTypes.string,
    isDialogOpen: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    locationDetails: PropTypes.object,
    clubDetails: PropTypes.object
};

export default DialogEditAllowanceDetails;