import React, { Component } from 'react';
import { LinearProgress } from 'material-ui/Progress';

import {ContactCard} from "../../../Common/ContactCard/ContactCard";

// css
import './ResultOptionComponent.scss';

class ResultOptionCComponent extends Component {
    render() {
        return (
            <div className="poll-result-option">
                <div className="poll-result-option-text">
                    <ContactCard
                        name={this.props.nominee.user.fullName}
                        email={this.props.nominee.user.username}
                        image={ (this.props.nominee.user.avatar) ? this.props.nominee.user.avatar : "../../../../../resources/images/img/user-avatar.png"}
                    />
                </div>
                <div className="poll-result-option-progress" title={"Total Polls for " + this.props.nominee.user.fullName + " is " + this.props.nominee.voteCount}>
                    <LinearProgress color="primary" mode="determinate" value={this.props.progress} className="poll-result-option-progress-bar" style={{"height": "93%"}}/>
                    <div className="poll-result-option-progress-value">
                        {this.props.progress}%
                    </div>
                </div>
            </div>
        );
    }
}

export default ResultOptionCComponent;