import React, { Component } from 'react';
import { LinearProgress } from 'material-ui/Progress';

// css
import './ResultOptionComponent.scss';

class ResultOptionCComponent extends Component {
    render() {
        return (
            <div className="survey-result-option">
                <div className="survey-result-option-text">
                    {this.props.option.value}
                </div>
                <div className="survey-result-option-progress" title={"Count for " + this.props.option.value + " is " + this.props.option.count}>
                    <LinearProgress color="primary" mode="determinate" value={this.props.progress} className="survey-result-option-progress-bar" style={{"height": "93%"}}/>
                    <div className="survey-result-option-progress-value">
                        {this.props.progress}%
                    </div>
                </div>
            </div>
        );
    }
}

export default ResultOptionCComponent;