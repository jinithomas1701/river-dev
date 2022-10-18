import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import moment from 'moment';

import {Util} from "../../../Util/util";
import { riverToast } from '../../Common/Toast/Toast';
import LoadedButton from '../../Common/LoadedButton/LoadedButton';

import "./ClubSettingsStage2.scss";

const STAGE_ACTIVITIES = 2;

class ClubSettingsStage2 extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedActivities: [],
            selectAll: false
        };

        this.isActivitiesPopulated = false;
    }

    componentDidUpdate = (prevProps) => {
        const currProps = this.props;
        if(currProps.masterActivities.length && !this.isActivitiesPopulated){
            const selectedActivities = currProps.masterActivities.filter(activity => activity.isShortListed).map(activity => `${activity.id}`);
            this.setState({selectedActivities});
            this.isActivitiesPopulated = true;
        }
    }

    render = () => {
        const props = this.props;
        const state = this.state;

        return (
            <div className="settings-stage2-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <ul className="activities-list-wrapper">
                            <FormControlLabel
                                title="Select All"
                                label="Select All"
                                control={
                                    <Checkbox
                                        checked={state.selectAll}
                                        onChange={this.handleSelectAllToggle}
                                        value="SelectAll"
                                        color="accent"
                                        className="input-checkbox"
                                        />
                                }
                                />
                            {
                                props.masterActivities.map(masterActivity => {
                                    return this.getCheckboxTemplate(masterActivity)
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="submit-wrapper">
                    <LoadedButton color="default" className="btn-default" onClick={this.handlePrev}>Back</LoadedButton>
                    <LoadedButton color="primary" className="btn-primary" onClick={this.handleNext}>Next</LoadedButton>
                </div>
            </div>
        );
    }

    getCheckboxTemplate = (masterActivity) => {
        const state = this.state;
        let infotooltip;
        let isDisabled = masterActivity.isMandatory || (masterActivity.isShortListed && masterActivity.unSelectable);
        const selected = masterActivity.isMandatory || state.selectedActivities.includes(`${masterActivity.id}`);
        if(masterActivity.isShortListed){
            infotooltip = "On-going Activity";
        }
        else if(masterActivity.isMandatory){
            infotooltip = "Mandatory";
        }
        else{
            infotooltip = "Select this entry";
        }

        return (
            <li className="master-activity-item" key={masterActivity.id}>
                <FormControlLabel
                    title={infotooltip}
                    
                    label={masterActivity.title}
                    control={
                        <Checkbox
                            disabled={isDisabled}
                            checked={selected}
                            onChange={this.handleActivityToggle}
                            value={`${masterActivity.id}`}
                            color="accent"
                            className="input-checkbox"
                            />
                    }
                    />
            </li>
        )
    }

    validateForm = (request) => {
        const isValid = request.customisedActivities.length;
        return isValid;
    }

    handleSelectAllToggle = () => {
        const selectAll = this.state.selectAll;
        let selectedActivities;
        if(!selectAll){
            selectedActivities = this.props.masterActivities.filter(masterActivity => !masterActivity.isMandatory).map(masterActivity => `${masterActivity.id}`);
        }
        else{
            selectedActivities = [];
        }
        this.setState({selectAll: !selectAll, selectedActivities});
    }

    handleActivityToggle = (event) => {
        const value = event.target.value;
        let selectAll = this.state.selectAll;
        const selectedActivities = [...this.state.selectedActivities];
        const index = selectedActivities.indexOf(value);
        if(index > -1){
            selectedActivities.splice(index, 1);
            selectAll = false;
        }
        else{
            selectedActivities.push(value);
        }
        this.setState({selectAll, selectedActivities});
    }

    handlePrev = () => {
        this.props.goToLastPage(STAGE_ACTIVITIES);
    }

    handleNext = () => {
        const selectedActivities = this.state.selectedActivities.map(activityId => ({masterActivityId: parseInt(activityId, 10)}));
        const mandatoryActivities = this.props.masterActivities.filter(masterActivity => masterActivity.isMandatory).map(masterActivity => ({masterActivityId: masterActivity.id}));
        const request = {
            customisedActivities: [...selectedActivities, ...mandatoryActivities]
        };
        const isValid = this.validateForm(request);
        if(!isValid){
            return;
        }
        this.props.onSubmit(STAGE_ACTIVITIES, request);
    }

}

ClubSettingsStage2.defaultProps = {
    masterActivities: [],
    settings: null,
};

ClubSettingsStage2.propTypes = {
    masterActivities: PropTypes.array.isRequired,
    settings: PropTypes.object,
    goToLastPage: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ClubSettingsStage2;