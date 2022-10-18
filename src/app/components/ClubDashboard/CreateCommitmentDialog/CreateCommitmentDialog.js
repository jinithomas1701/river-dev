import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Checkbox from 'material-ui/Checkbox';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Datetime from 'react-datetime';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from '../../../Util/util';
import {ClubDashboardService} from '../ClubDashboard.service';
import {fieldChange,
        clearCommitmentsFields} from '../ClubDashboard.actions';
import {SelectBox} from '../../Common/SelectBox/SelectBox';

import "./CreateCommitmentDialog.scss";

const mapStateToProps = (state) => {
    return {
        clubDash: state.ClubDashboardReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fieldChange: (field, value) => {
            dispatch(fieldChange(field, value))
        },
        clearCommitmentsFields: () => {
            dispatch(clearCommitmentsFields())
        }
    }
};

class CreateCommitmentDialog extends React.Component {
    state = {
        showProgress: false
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.props.fieldChange("targetDate", Math.round((new Date()).getTime() / 1000));            
        }
    }


    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="create-commitment-dialog-container"
            >
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>Create New Commitment</DialogTitle>
                <DialogContent>
                    <div className="create-commitment-dialog-content">
                        <div className="input-container">
                            <TextField
                                id="title"
                                label="Title"
                                required
                                value = {this.props.clubDash.commitmentFields.title}
                                className="input-field w-full"
                                margin="normal"
                                onChange = {this.handleChange('title')}
                            />
                        </div>
                        <div className="input-container">
                            <TextField
                                id="description"
                                label="Description"
                                required
                                value = {this.props.clubDash.commitmentFields.description}
                                className="input-field w-full"
                                margin="normal"
                                onChange = {this.handleChange('description')}
                            />
                        </div>
                        <div className="input-container">
                            <div className="datetime-picker-wrapper">
                                <label
                                    htmlFor="target-date"
                                >
                                    Target Date
                                </label>
                                <Datetime
                                    inputProps={
                                            { 
                                                placeholder: 'Target Date',
                                                id:"target-date",
                                                className:"datetime-input"
                                            }
                                        }
                                    className="datetime-picker"
                                    onChange={(value)=>{
                                        this.props.fieldChange("targetDate", Math.round((new Date(value)).getTime() / 1000));
                                    }}
                                    value={new Date(this.props.clubDash.commitmentFields.targetDate * 1000)}
                                />
                            </div>
                        </div>
                        <div className="input-container">
                            <div className="input-field selectBox">
                                <SelectBox 
                                    id="status" 
                                    required
                                    label="Status"
                                    selectedValue = {this.props.clubDash.commitmentFields.currentStatus}
                                    selectArray={this.props.clubDash.statusList || []}
                                    onSelect={this.handleSelect('currentStatus')}/>
                            </div>  
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.onSubmit.bind(this)} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleChange = name => event => {
        this.props.fieldChange(name, event.target.value);
    };

    handleSelect = name => value => {
        this.props.fieldChange(name, value);
    };

    handleRequestClose() {
        this.props.clearCommitmentsFields();
        this.props.onRequestClose(false);
    }

    processCommitmentRequest() {
        const request = this.props.clubDash.commitmentFields;
        request.targetDate = this.props.clubDash.commitmentFields.targetDate * 1000;

        return request;
    }

    onSubmit() {
        this.setState({showProgress: true});
        ClubDashboardService.createCommitment(this.processCommitmentRequest())
        .then(data => {
            this.setState({showProgress: false});
            riverToast.show("Commitment added successfully");
            this.props.afterSuccess();
            this.handleRequestClose();
        })
        .catch(error => {
            this.setState({showProgress: false});
            riverToast.show(error.status_message);
        });
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(CreateCommitmentDialog);