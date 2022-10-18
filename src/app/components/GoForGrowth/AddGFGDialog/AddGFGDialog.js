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
import Datetime from 'react-datetime';

// css
import "./AddGFGDialog.scss"
import { riverToast } from '../../Common/Toast/Toast';

// service
import { GoForGrowthService } from '../GoForGrowth.service';

class AddGFGDialog extends Component {

    state = {
        accountsList: [],
        gfg: {
            account:'',
            opportunity: '',
            primaryTechnology: '',
            secondaryTechnology: '',
            experienceLevel: '',
            successFactors: '',
            referenceProfile: '',
            dateFlashes: '',
            closureDate: ''
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.getAccounts();
            if(this.props.gfg) {
                let gfgObj = {
                    account:(this.props.gfg.account ? this.props.gfg.account.id : ''),
                    opportunity: this.props.gfg.opportunity,
                    primaryTechnology: this.props.gfg.primaryTechnology,
                    secondaryTechnology: this.props.gfg.secondaryTechnology,
                    experienceLevel: this.props.gfg.experienceLevel,
                    successFactors: this.props.gfg.successFactors,
                    referenceProfile: this.props.gfg.referenceProfile,
                    dateFlashes: this.props.gfg.dateFlashes,
                    closureDate: this.props.gfg.closureDate
                }
                this.setState({ gfg: gfgObj });
            } else {
                this.changeFieldValue("dateFlashes", '');
                this.changeFieldValue("closureDate", '');
            }
        }
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="add-gfg-dialog-container"
            >
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>Add An Entry</DialogTitle>
                <DialogContent>
                    <div className="add-gfg-dialog">
                        <div className="input-field">
                            <TextField
                                id="opportunity"
                                label="Opportunity Description"
                                required
                                margin="normal"
                                multiLine
                                value={this.state.gfg.opportunity}
                                onChange={this.handleChange('opportunity')}
                                className="edit-target-field full-width"
                            />
                        </div>
                        <div className="field-container">
                            <div className="input-field select">
                                <SelectBox 
                                    id="account" 
                                    label="Account"
                                    selectedValue = {this.state.gfg.account}
                                    selectArray={this.state.accountsList || []}
                                    onSelect={this.handleSelect('account')}/>
                            </div>
                            <div className="input-field">
                                <TextField
                                    id="ref_prof"
                                    label="Reference Profile"
                                    margin="normal"
                                    value={this.state.gfg.referenceProfile}
                                    onChange={this.handleChange('referenceProfile')}
                                    className="edit-target-field"
                                />
                            </div>
                        </div>
                        <div className="field-container">
                            <div className="input-field">
                                <TextField
                                    id="pri_tech"
                                    label="Primary Technology"
                                    margin="normal"
                                    value={this.state.gfg.primaryTechnology}
                                    onChange={this.handleChange('primaryTechnology')}
                                    className="edit-target-field"
                                />
                            </div>
                            <div className="input-field">
                                <TextField
                                    id="sec_tech"
                                    label="Secondary Technology"
                                    margin="normal"
                                    value={this.state.gfg.secondaryTechnology}
                                    onChange={this.handleChange('secondaryTechnology')}
                                    className="edit-target-field"
                                />
                            </div>
                        </div>
                        <div className="field-container">
                            <div className="input-field">
                                <TextField
                                    id="experience"
                                    label="Experience Level"
                                    margin="normal"
                                    value={this.state.gfg.experienceLevel}
                                    onChange={this.handleChange('experienceLevel')}
                                    className="edit-target-field"
                                />
                            </div>
                            <div className="input-field">
                                <TextField
                                    id="success_facts"
                                    label="Success Factors"
                                    margin="normal"
                                    value={this.state.gfg.successFactors}
                                    onChange={this.handleChange('successFactors')}
                                    className="edit-target-field"
                                />
                            </div>
                        </div>
                        <div className="field-container">
                            <div className="input-field">
                                <div className="datetime-picker-wrapper">
                                    <label
                                        htmlFor="flash_date"
                                    >
                                        Date Flashes
                                    </label>
                                    <Datetime
                                        inputProps={
                                                { 
                                                    placeholder: 'Date Flashes',
                                                    id:"flash_date",
                                                    className:"datetime-input"
                                                }
                                            }
                                        timeFormat={false}
                                        className="datetime-picker"
                                        onChange={(value)=>{
                                            this.changeFieldValue("dateFlashes", Math.round((new Date(value)).getTime()));
                                        }}
                                        value={this.state.gfg.dateFlashes ? new Date(this.state.gfg.dateFlashes) : ''}
                                    />
                                </div>
                            </div>
                            <div className="input-field">
                                <div className="datetime-picker-wrapper">
                                    <label
                                        htmlFor="closure_date"
                                    >
                                        Closure Date
                                    </label>
                                    <Datetime
                                        inputProps={
                                                { 
                                                    placeholder: 'Closure Date',
                                                    id:"closure_date",
                                                    className:"datetime-input"
                                                }
                                            }
                                        timeFormat={false}
                                        className="datetime-picker"
                                        onChange={(value)=>{
                                            this.changeFieldValue("closureDate", Math.round((new Date(value)).getTime()));
                                        }}
                                        value={this.state.gfg.closureDate ? new Date(this.state.gfg.closureDate) : ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    {
                        this.props.gfg ?
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
        let gfgObj = this.state.gfg;
        gfgObj[name] = event.target.value;

        this.setState({ gfg : gfgObj });
    };

    handleSelect = name => value => {
        let gfgObj = this.state.gfg;
        gfgObj[name] = value;

        this.setState({ gfg : gfgObj });
    }

    changeFieldValue(field, value) {
        let gfgObj = this.state.gfg;
        gfgObj[field] = value;

        this.setState({ gfg : gfgObj });
    }

    handleRequestClose() {
        this.setState({
            ...this.state,
            accountsList: [],
            gfg: {
                account:'',
                opportunity: '',
                primaryTechnology: '',
                secondaryTechnology: '',
                experienceLevel: '',
                successFactors: '',
                referenceProfile: '',
                dateFlashes: '',
                closureDate: ''
            }
        });    
        this.props.onRequestClose(false);
    }

    getAccounts() {
        GoForGrowthService.getAccounts()
        .then((data) => {
            this.setState({ accountsList: data });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching accounts");
        })
    }

    onSuccess(gfg, reload, index) {
        this.setState({
            ...this.state,
            accountsList: [],
            gfg: {
                account:'',
                opportunity: '',
                primaryTechnology: '',
                secondaryTechnology: '',
                experienceLevel: '',
                successFactors: '',
                referenceProfile: '',
                dateFlashes: '',
                closureDate: ''
            }
        });
        this.props.onSuccess(gfg, reload, index);
    }

    isFormValid() {
        const gfgFields = this.state.gfg;
        if(
            !gfgFields.opportunity 
        ) {
            riverToast.show("Please check all the fields");
            return false;
        } else {
            return true;
        }
    }

    onSubmit() {
        if(this.isFormValid()){
            let gfgObj = this.state.gfg;
            GoForGrowthService.createGfg(gfgObj)
            .then((data) => {
                this.onSuccess(data);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating opportunity");
            });
        }
    }

    onUpdate() {
        if(this.isFormValid()){
            let gfgObj = this.state.gfg;
            GoForGrowthService.updateGfg(this.props.gfg.id, gfgObj)
            .then((data) => {
                this.onSuccess(data, true, this.props.index);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating opportunity");
            });
        }
    }
}

export default AddGFGDialog;