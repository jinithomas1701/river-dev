import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
import moment from 'moment';

  // custom component
import {Util} from '../../../Util/util';
import ResultOptionComponent from './ResultOptionComponent/ResultOptionComponent';

// css
import './ViewSurveyResultDialog.scss';

class ViewSurveyResultDialog extends Component {

    state = {
        showOthers: false
    }

    render() {
        const totalCount = this.props.survey.totalOpinions;

        const optionsList = (this.props.survey) ? (this.props.survey.options.map((option, index) => {
            return <ResultOptionComponent
                        key = {index}
                        option = {option}
                        progress = {Math.round(option.count * 100 / totalCount)}
                    />
        })) : false;

        const othersList = (this.props.survey.otherOption && this.props.survey.otherOption.count > 0) ? (
            this.props.survey.otherOption.otherOpinions.map((opinion, index) => {
                return <div className="survey-other-opinion" key={index} title={"By " + opinion.surveyUser.name + " (" + opinion.surveyUser.username + ")"}>
                            {(index + 1 ) + " : " + opinion.value}
                        </div>
            })
        ): "No Opinions Found";

        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="view-survey-result-dialog">
                <DialogTitle className="view-survey-result-dialog-title">{this.props.survey.title}</DialogTitle>
                <DialogContent className="view-survey-result-dialog-contents">
                    <DialogContentText className="view-survey-result-dialog-description">
                        {this.props.survey.description}
                    </DialogContentText>
                    <div className="total-count-display">
                        Total Casted Opininions : {totalCount}
                    </div>
                    <div className="view-survey-result-dialog-contents-result-container">
                        {optionsList}
                        {
                            (this.props.survey.otherOption) &&
                                <ResultOptionComponent
                                    option = {{value: "Others", count: this.props.survey.otherOption.count}}
                                    progress = { Math.round(this.props.survey.otherOption.count * 100 / totalCount) }
                                />
                        }
                        {
                            (this.props.survey.otherOption && this.props.survey.otherOption.count > 0) &&
                                <div className="view-other-opinions-btn-container">
                                    <Button
                                        className="view-other-btn-opinions"
                                        onClick={this.showOthersToggle.bind(this)}
                                    >
                                        View Other Opinions
                                    </Button>
                                </div>
                        }
                        {
                            (this.state.showOthers) &&
                                <div className="survey-other-opinion-list">
                                    {othersList}
                                </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose(){
        this.props.onRequestClose(false);
    }

    showOthersToggle() {
        this.setState({ showOthers: !this.state.showOthers })
    }
}

export default ViewSurveyResultDialog;