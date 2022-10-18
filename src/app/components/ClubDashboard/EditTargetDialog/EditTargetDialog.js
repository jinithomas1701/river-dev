import React, { Component } from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {SelectBox} from '../../Common/SelectBox/SelectBox';

import { ClubDashboardService } from '../ClubDashboard.service';

// css
import "./EditTargetDialog.scss"
import { riverToast } from '../../Common/Toast/Toast';

class EditTargetDialog extends Component {
    state = {
        value: "",
        fyList: [],
        selectedYear: ""
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            if(this.props.target) {
                this.setState({ value: this.props.target.target });
            } else {
                this.getYearList();
            }
        }
    }
    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="edit-target-dialog-container"
            >
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>Create New Commitment</DialogTitle>
                <DialogContent>
                    <div className="edit-target-dialog">
                        {
                            !this.props.target &&
                                <SelectBox 
                                    id="target-fy" 
                                    label="Financial Year"
                                    selectedValue = {this.state.selectedYear}
                                    selectArray={this.state.fyList || []}
                                    onSelect={this.handleSelect('selectedYear')}/>
                        }
                        <TextField
                            id="target_value"
                            label="Target"
                            required
                            margin="normal"
                            value={this.state.value}
                            onChange={this.handleChange('value')}
                            className="edit-target-field"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    {
                        this.props.target ?
                            <Button onClick={this.onUpdate.bind(this)} color="primary">
                                Update
                            </Button>
                        :
                            <Button onClick={this.onSubmit.bind(this)} color="primary">
                                Submit
                            </Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }

    handleChange = name => event => {
        this.setState({ [name] : event.target.value});
    };

    handleSelect = name => value => {
        this.setState({ [name]: value });
    }

    handleRequestClose() {
        this.setState({
            ...this.state,
            value : "",
            selectedYear: "",
            fyList: []
        });    
        this.props.onRequestClose(false);
    }

    onSuccess() {
        this.setState({
            ...this.state,
            value : "",
            selectedYear: "",
            fyList: []
        });
        this.props.onSuccess();
    }

    onUpdate() {
        if(this.props.target) {
            const targetObj = {
                target: this.state.value,
                financialYear: this.props.target.financialYear.substr(0,4),
                type:"CT",
                id: this.props.target.id
            }
            ClubDashboardService.updateClubTarget(targetObj)
            .then((data) => {
                riverToast.show("Successfully Updated");
                this.onSuccess();
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating club target");
            })
        } else {
            this.handleRequestClose();
        }
    }

    onSubmit() {
        if(!this.props.target && this.state.selectedYear && this.state.value) {
            const targetObj = {
                target: this.state.value,
                financialYear: this.state.selectedYear.substr(0,4),
                type:"CT"
            }
            ClubDashboardService.createClubTarget(targetObj)
            .then((data) => {
                riverToast.show("Successfully Created");
                this.onSuccess();
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating club target");
            })
        } else {
            riverToast.show("Please check all fields");
        }
    }

    getFyList(list) {
        return list.map((item) => ({"title":item,"value":item}));
    }

    getYearList() {
        ClubDashboardService.getYearsList()
        .then((data) => {
            this.setState({ fyList: this.getFyList(data) });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching years list");
        })
    }
}

export default EditTargetDialog;