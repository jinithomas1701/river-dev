import React, { Component } from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {SelectBox} from '../../Common/SelectBox/SelectBox';
import Datetime from 'react-datetime';
import {Root} from "../../Layout/Root";
import {MainContainer} from "../../Common/MainContainer/MainContainer";
import {PageTitle} from '../../Common/PageTitle/PageTitle';
import {Util} from '../../../Util/util';
// css
import "./GoForGrowthDetails.scss";
import { riverToast } from '../../Common/Toast/Toast';

// service
import { GoForGrowthService } from '../GoForGrowth.service';
import { Checkbox } from 'material-ui';

class GoForGrowthDetails extends Component {

    state = {
        accountsList: [],
        prioritiesList: [],
        gfg: {
            account:'',
            opportunity: '',
            primaryTechnology: '',
            secondaryTechnology: '',
            experienceLevel: '',
            successFactors: '',
            referenceProfile: '',
            dateFlashes: '',
            closureDate: '',
            priority: 'SST',
            flashedToOtherVendors: false,
            jobDescription: ''
        }
    }

    componentDidMount() {
        this.getAccounts();
        this.getPriorities();
        if(this.props.match.params.gfgId) {
            this.getGfg(this.props.match.params.gfgId);
        } else {
            this.changeFieldValue("dateFlashes", '');
            this.changeFieldValue("closureDate", Math.round((new Date(new Date().getTime()+(15*24*60*60*1000))).getTime()));
        }
    }
    
    render() {
        return (
            <Root role="user">
				<MainContainer>
                    <PageTitle title="Go For Growth Details" />
                    <div className="row gfg-details">
                        <div className="col-md-12">
                            <div className="gfg-details-page">
                                <div className="input-field">
                                    <TextField
                                        id="opportunity"
                                        label="Opportunity Description"
                                        required
                                        margin="normal"
                                        multiline={true}
                                        rows={3}
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
                                            required
                                            selectedValue = {this.state.gfg.account}
                                            selectArray={this.state.accountsList || []}
                                            onSelect={this.handleSelect('account')}/>
                                    </div>
                                    <div className="input-field">
                                        <TextField
                                            id="ref_prof"
                                            label="Reference Profile"
                                            placeholder="ex. Venu Gopalakrishnan"
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
                                            placeholder="ex. 4-6 Years"
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
                                            {
                                                this.state.gfg.dateFlashes &&
                                                    <label
                                                        className="datetime-picker-label"
                                                        htmlFor="flash_date"
                                                    >
                                                        Date Open
                                                    </label>
                                            }
                                            <Datetime
                                                inputProps={
                                                        { 
                                                            placeholder: 'Date Open',
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
                                            {
                                                this.state.gfg.closureDate &&
                                                    <label
                                                        className="datetime-picker-label"
                                                        htmlFor="closure_date"
                                                    >
                                                        Closure Date
                                                    </label>
                                            }
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
                                    <div className="input-field select">
                                        <SelectBox 
                                            id="priority" 
                                            label="Priority"
                                            selectedValue = {this.state.gfg.priority}
                                            selectArray={this.state.prioritiesList || []}
                                            onSelect={this.handleSelect('priority')}/>
                                    </div>
                                </div>
                                <div className="field-container">
                                    <div className="input-field">
                                        <TextField
                                            id="jobDescription"
                                            label="Job Description"
                                            margin="normal"
                                            value={this.state.gfg.jobDescription}
                                            onChange={this.handleChange('jobDescription')}
                                            className="edit-target-field"
                                        />
                                    </div>
                                </div>
                                <div className="field-container">
                                    <div className="input-field checkbox">
                                        <Checkbox id="flash_bool" checked={this.state.gfg.flashedToOtherVendors} onChange={this.onCheckBoxToggle('flashedToOtherVendors')}/>
                                        <label htmlFor="flash_tool" className="checkbox-label" onClick={this.toggleFlashToVendorsCheck.bind(this)}>Flashed to other vendors</label>
                                    </div>
                                </div>
                            </div>
                            <div className="floating-bottom-control">
                                <div>
                                    <Button
                                        onClick = {() => {this.props.history.push('/goforgrowth')}}
                                    >
                                        Cancel
                                    </Button>
                                    {
                                        this.props.match.params.gfgId ? (
                                            <Button 
                                                color="primary"
                                                onClick = {this.onUpdate.bind(this)}
                                            >
                                                Update
                                            </Button>
                                        ) : (
                                            <Button 
                                                color="primary"
                                                onClick = {this.onSubmit.bind(this)}
                                            >
                                                Submit
                                            </Button>                                            
                                        )

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    onCheckBoxToggle = name => event => {
        let gfgObj = this.state.gfg;
        gfgObj[name] = event.target.checked;

        this.setState({ gfg : gfgObj });
    }

    toggleFlashToVendorsCheck() {
        let gfgObj = this.state.gfg;
        gfgObj[name] = !this.state.gfg.flashedToOtherVendors;

        this.setState({ gfg : gfgObj });
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

    getAccounts() {
        GoForGrowthService.getAccounts()
        .then((data) => {
            this.setState({ accountsList: data });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching accounts");
        })
    }

    isFormValid() {
        const gfgFields = this.state.gfg;
        if(
            !gfgFields.opportunity 
        ) {
            riverToast.show("Please enter opportunity description");
            return false;
        } else if(!gfgFields.account){
            riverToast.show("Please select an account");
            return false;
        } else if(!gfgFields.closureDate){
            riverToast.show("Please select a closure date");
            return false;
        } else if(!gfgFields.priority){
            riverToast.show("Please select a priority");
            return false;
        } else {
            return true;
        }
    }

    prioritySelectMeta(list) {
        return list.map(item => { return {title: item.priority, value: item.code }})
    }

    getPriorities() {
        GoForGrowthService.getPriorities()
        .then((data) => {
            this.setState({ prioritiesList: this.prioritySelectMeta(data) });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching priority list");
        })
    }

    onSubmit() {
        if(this.isFormValid()){
            let gfgObj = this.state.gfg;
            GoForGrowthService.createGfg(gfgObj)
            .then((data) => {
                this.props.history.push("/goforgrowth");
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating opportunity");
            });
        }
    }

    onUpdate() {
        if(this.isFormValid()){
            let gfgObj = this.state.gfg;
            GoForGrowthService.updateGfg(this.props.match.params.gfgId, gfgObj)
            .then((data) => {
                this.props.history.push("/goforgrowth");
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating opportunity");
            });
        }
    }

    getGfgMeta(gfg) {
        return {
            ...gfg,
            account: gfg.account ? gfg.account.id : '',
            priority: gfg.priority ? gfg.priority.code : 'SST'
        }
    }

    getGfg(gfgId) {
        GoForGrowthService.getGfgItem(gfgId)
        .then((data) => {
            this.setState({ gfg: this.getGfgMeta(data) })
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while creating opportunity");
        });
    }
}

export default GoForGrowthDetails;