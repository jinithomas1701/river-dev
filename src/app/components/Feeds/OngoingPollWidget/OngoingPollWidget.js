import React, { Component } from 'react';
import moment from 'moment';
import Icon from "material-ui/Icon";

import { Util } from '../../../Util/util';

// css
import './OngoingPollWidget.scss';

class OngoingPollWidget extends Component {
    render() {
        return (
            <div className="ongoing-poll-widget" onClick={this.gotoPolls.bind(this)}>
                <div className="poll-icon"><Icon>poll</Icon></div>
                <div className="poll-datas">
                    <div className="poll-title text-ellipsis" title={this.props.poll.title}>
                        {this.props.poll.title}
                    </div>
                    <div className="poll-date">
                        {
                            this.props.poll.electionStatus == "Nomination is active" ?
                                "Nomination till " + Util.getDateStringFromTimestamp(this.props.poll.nominationEndDate)
                                :
                                "Polling till " + Util.getDateStringFromTimestamp(this.props.poll.electionEndDate)
                        }
                        {
                            (this.props.poll.visibility != "@all" && this.props.poll.clubName) && <div className="poll-type-club-name text-ellipsis" title={this.props.poll.clubName || ""}>&middot; {this.props.poll.clubName || ""}</div>
                        }

                    </div>
                </div>

            </div>
        );
    }

    gotoPolls() {
        if (this.props.poll.electionStatus == "Nomination is active") {
            window.location.href = "/#/polls/0";
        } else {
            window.location.href = "/#/polls/1";
        }
    }
}

export default OngoingPollWidget;