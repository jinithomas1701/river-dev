import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

// css
import './SurveyCard.scss';

class SurveyCard extends Component {
    render() {
        return (
            <div className="survey-card" onClick={this.handleOpenSurvey.bind(this)}>
                {
                    (this.props.editable) &&
                        <div className="survey-card-extras">
                            <Icon className="survey-card-extras-icon" onClick={this.editSurvey.bind(this)}>create</Icon>
                        </div>
                }
                <div className="survey-card-body">
                    {/* <div className="survey-thumb">
                        <img src="../../../resources/images/survey-thumb.svg" alt="survey-thumb"/>
                    </div> */}
                    <div className="survey-card-body-contents">
                        <div className="survey-title">
                            {this.props.survey.title}
                        </div>
                    </div>
                </div>
                {/* <div className="survey-btn">
                    <Button
                        title="View Survey"
                        aria-label="view"
                        onClick={this.handleOpenSurvey.bind(this)}
                    >
                        View
                        <Icon>bubble_chart</Icon>
                    </Button>
                </div> */}
            </div>
        );
    }

    handleOpenSurvey(){
        this.props.openSurveyDialogCallback(this.props.survey);
    }

    editSurvey(event){
        this.props.editSurveyCallback(this.props.survey);
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }
}

export default SurveyCard;