import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import moment from 'moment';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';

//root component
import { Root } from "../../Layout/Root";

// custom component
import {Util} from "../../../Util/util";

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import {SurveyService} from "../Survey.service";

import './CastSurveyDialog.scss';

export default class CastSurveyDialog extends React.Component {

    state = {
        survey: "",
        surveyOption: "",
        othersText: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.resetState();
            /* if(!this.props.survey) {
                this.handleRequestClose();
            } */
            this.dialogInit();
        }
        if (this.state.survey != prevState.survey) {
            this.postCastSurveyInit();
        }
    }
    
    componentWillUnmount(){
        console.log(this);
    }

    componentDidMount() {
        if(this.props.open){
            this.dialogInit();
        }
    }

    dialogInit() {
        if(this.props.survey && !this.props.survey.title) {
            this.getSurvey(this.props.survey.id);
        } else if(this.props.survey){
            this.setState({ survey: this.props.survey })
            this.postCastSurveyInit();
        }
    }

    postCastSurveyInit() {
        if(this.state.survey && this.state.survey.castedInfo) {
            this.setState({ 
                ...this.state,
                surveyOption: (this.state.survey.castedInfo.isOther) ? "other" : this.state.survey.castedInfo.optionId,
                othersText: (this.state.survey.castedInfo.isOther) ? this.state.survey.castedInfo.data : ""
            });
        }
    }

    render() {
        let userDetails = Util.getLoggedInUserDetails();
        
        const optionsList = (this.state.survey.options) ? this.state.survey.options.map((option, index) => {
            return <FormControlLabel 
                        key = {index}
                        value={option.id}
                        control={<Radio />}
                        label={option.value}
                        className="survey-option"/>
        }) : false;


        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="mark-survey-dialog-container">
                <DialogTitle>{(this.state.survey && this.state.survey.title) ? this.state.survey.title : "Loading..."}</DialogTitle>
                <DialogContent>
                    <div className="content-container">
                        {
                            this.state.survey.createdBy &&
                                <div className="survey-created-info">
                                    <div className="survey-created-by-name">Created By: {this.state.survey.createdBy.name}</div>
                                    <div className="survey-created-date">Created On: {moment.unix(this.state.survey.createdOn/1000).format("DD MMM YYYY, hh:mm A")}</div>
                                </div>
                        }
                        {
                            (optionsList.length > 0) &&
                                <FormControl component="fieldset" className="survey-option-form">
                                    <FormLabel component="legend" className="survey-option-description">
                                        {(this.state.survey) ? this.state.survey.description : "loading survey..."}
                                    </FormLabel>
                                    <RadioGroup
                                        aria-label="survey options"
                                        name="option"
                                        value={this.state.surveyOption}
                                        onChange={this.handleOptionChange.bind(this)}
                                        className="survey-option-list"
                                    >
                                        {optionsList}
                                        {
                                            (this.state.survey.otherOption) &&
                                                <FormControlLabel
                                                    value="other"
                                                    control={<Radio />}
                                                    label="Other"
                                                    className="survey-option"/>
                                        }
                                    </RadioGroup>
                                </FormControl>
                        }
                        {
                            (this.state.surveyOption == "other") &&
                                <div className="survey-option-otherstext-container">
                                    <TextField
                                        id="others-textbox"
                                        label="Other Opinions"
                                        placeholder="Please enter your opinion"
                                        multiline
                                        margin="normal"
                                        className="survey-option-otherstext"
                                        value={this.state.othersText}
                                        onChange = {this.handleTextChange('othersText')}
                                    />
                                </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    {
                        (this.state.survey.title && this.state.survey.status == "active") &&
                            <div>
                                {
                                    (this.state.survey.createdBy && userDetails.userId === this.state.survey.createdBy.id) &&
                                        <Button
                                            onClick={this.onPublishResult.bind(this)}
                                            color="primary"
                                        >
                                            Publish Result
                                        </Button>
                                }
                                <Button
                                    disabled = {(!this.state.surveyOption) ? true: false}
                                    onClick={this.onSubmit.bind(this)}
                                    color="primary"
                                >
                                    Submit
                                </Button>
                            </div>
                    }
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.resetState();
        this.props.onRequestClose(false);
    }

    resetState() {
        this.setState({
            survey: "",
            surveyOption: "",
            othersText: ""
        });
    }

    handleOptionChange = (event, value) => {
        this.setState({ surveyOption: value });
        if(value != "other") {
            if(this.state.othersText) {
                this.setState({ othersText: "" });              
            }
        }
    };

    handleTextChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    isFormValid(){
        if( !this.state.survey ||
            !this.state.survey.id
        ){
            return false;
        }

        return true;
    }

    onSubmit(){
        let surveyObject = {
            optionId: (this.state.surveyOption == "other") ? "" : this.state.surveyOption,
            isOthers: (this.state.surveyOption == "other") ? true : false,
            otherOpinion: (this.state.surveyOption == "other") ? this.state.othersText : ""
        };

        if(this.isFormValid()){
            SurveyService.castSurvey(this.state.survey.id, surveyObject)
            .then((data) => {
                this.setState({ submitted: true });
                riverToast.show("Casted your opinion successfully");
                this.resetState();
                this.props.onSurveySubmitCallBack();
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while casting");
            })
        }
    }

    onPublishResult() {
        SurveyService.publishResult(this.state.survey.id)
            .then((data) => {
                riverToast.show("Survey result published successfully");
                this.resetState();
                this.props.onSurveySubmitCallBack();
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while publishing result");
            })
    }

    getSurvey(surveyId) {
        SurveyService.getSurvey(surveyId)
        .then((data) => {
            this.setState({ survey: data })
            this.postCastSurveyInit();
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching survey");
            this.handleRequestClose();
        });
    }

}