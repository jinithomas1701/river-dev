import React, { Component } from 'react';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';

// css
import './SurveyBanner.scss'

class SurveyBanner extends Component {
    state = {
        surveyOption: "",
        othersText: ""
    }

    render() {
        const optionsList = (this.props.survey.options) ? this.props.survey.options.map((option, index) => {
            return <FormControlLabel 
                        key = {index}
                        value={option.id}
                        control={<Radio />}
                        label={option.value}
                        className="survey-option"/>
        }) : false;

        return (
            <div className="club-banner">
                <div className="banner-actions">
                    <Icon className="banner-actions-btn" onClick={this.closeHandler.bind(this)}>close</Icon>
                </div>
                <div className="survey-container">
                    <div className="survey-title">{this.props.survey.title}</div>
                    <div className="survey-contents">
                        <FormControl component="fieldset" className="survey-option-form">
                            <RadioGroup
                                aria-label="survey options"
                                name="option"
                                value={this.state.surveyOption}
                                onChange={this.handleSurveyOptionChange.bind(this)}
                                className="survey-option-list"
                            >
                                {optionsList}
                                {
                                    (this.props.survey.otherOption) &&
                                        <FormControlLabel
                                            value="more"
                                            control={<Radio />}
                                            label="Other"
                                            className="survey-option"/>
                                }
                            </RadioGroup>
                        </FormControl>
                        {
                            (this.state.surveyOption == "more") &&
                                <div className="survey-option-otherstext-container">
                                    <TextField
                                        id="others-textbox"
                                        label="Other Opinions"
                                        placeholder="Please enter your opinion"
                                        multiline
                                        margin="normal"
                                        className="survey-option-otherstext w-full"
                                        value={this.state.othersText}
                                        onChange = {this.handleTextChange('othersText')}
                                    />
                                </div>
                        }
                    </div>
                    <div className="survey-actions">
                        <div className="details-link" onClick={this.viewSurvey.bind(this)}>
                            VIEW MORE DETAILS
                        </div>
                        <Button
                            className="survey-action-btn"
                            onClick={this.onCast.bind(this)}
                            raised
                        >
                            Cast
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    handleTextChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    handleSurveyOptionChange = (event, value) => {
        this.setState({ surveyOption: value });
        if(value != "more" && this.state.othersText) {
            this.setState({ othersText: "" });              
        }
    };

    closeHandler() {
        this.props.closeBannerCallback();
    }

    viewSurvey() {
        this.props.viewSurveyCallback(this.props.survey.id);
    }

    onCast(){
        let surveyObject = {
            optionId: (this.state.surveyOption == "more") ? "" : this.state.surveyOption,
            isOthers: (this.state.surveyOption == "more") ? true : false,
            otherOpinion: (this.state.surveyOption == "more") ? this.state.othersText : ""
        };

        this.props.castOptionCallback(this.props.survey.id, surveyObject); 
    }
}

export default SurveyBanner;