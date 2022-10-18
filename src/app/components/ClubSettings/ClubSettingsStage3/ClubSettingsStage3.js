import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import moment from 'moment';

import {Util} from "../../../Util/util";
import { riverToast } from "../../Common/Toast/Toast";
import LoadedButton from "../../Common/LoadedButton/LoadedButton";

import "./ClubSettingsStage3.scss";

const STAGE_POINTS = 3;

class ClubSettingsStage3 extends Component{
    constructor(props){
        super(props);
        this.state = {
            target: 1,
            location: ""
        };
        this.isUiUpdated = false;
    }
    
    componentDidUpdate = (prevProps) => {
        const currProps = this.props;
        if(currProps.settings && !this.isUiUpdated){
            const {target, location} = currProps.settings;
            this.setState({target, location});
            this.isUiUpdated = true;
        }
    }

    render = () => {
        const props = this.props;
        const state = this.state;

        return (
            <div className="settings-stage3-wrapper">
                <div className="row">
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            type="number"
                            step={1}
                            label="Target"
                            placeholder="Target"
                            name="target"
                            className="input-field"
                            margin="normal"
                            value={this.state.target}
                            onChange={this.handleTargetChange}
                            />
                    </div>
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            label="Meeting Location"
                            placeholder="Meeting Location"
                            name="location"
                            className="input-field"
                            margin="normal"
                            value={this.state.location}
                            onChange={this.handleInputChange}
                            />
                    </div>
                </div>
                <div className="submit-wrapper">
                    <LoadedButton color="default" className="btn-default" onClick={this.handlePrev}>Back</LoadedButton>
                    <LoadedButton color="primary" className="btn-primary" onClick={this.handleNext}>Next</LoadedButton>
                </div>
            </div>
        );
    }

    handleTargetChange = (event) => {
        let target = parseInt(event.target.value, 10);
        target = (isNaN(target) || target < 1) ? 1: target;
        this.setState({target});
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({[name]: value});
    }

    validateForm = (request) => {
        let isValid = true;
        if(!request.location.trim() || !request.target){
            isValid = false;
        }
        return isValid;
    }

    handlePrev = () => {
        this.props.goToLastPage(STAGE_POINTS);
    }

    handleNext = () => {
        const state = this.state;
        const request = {
            location: state.location,
            target: state.target,
        };
        const isValid = this.validateForm(request);
        if(!isValid){
            return;
        }
        this.props.onSubmit(STAGE_POINTS, request);
    }

}

ClubSettingsStage3.defaultProps = {
    settings: null,
};

ClubSettingsStage3.propTypes = {
    settings: PropTypes.object,
    goToLastPage: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ClubSettingsStage3;