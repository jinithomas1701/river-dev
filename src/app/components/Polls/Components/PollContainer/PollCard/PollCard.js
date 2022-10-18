import React from "react";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import moment from "moment";
import Tooltip from 'material-ui/Tooltip';

import "./PollCard.scss";

export default class PollCard extends React.Component {
    render() {
        return (
            <div className="pollcard">
                {
                    this.props.poll.visibility != '@all' &&
                        <Tooltip id="visibility-icon" title={'Poll limited to club - '+this.props.poll.clubName}>
                            <div className="visibility-ribbon">
                                <Icon className="visibility-ribbon-icon">store</Icon>
                            </div>
                        </Tooltip>
                }
                <div className="pollcard-container">
                    <Tooltip title={this.props.poll.title}>
                        <div className="pollcard-title text-ellipsis">{this.props.poll.title}</div>
                    </Tooltip>
                    <div className="extra-container">
                        <div className="extra-content buttons">
                            {
                                (this.props.type == "nominations") ?
                                (
                                    (!this.props.poll.isNominated) ?
                                        (
                                            <Button
                                                color="primary"
                                                className="action-title"
                                                onClick={this.actionClick.bind(this, this.props.poll)}
                                            >
                                                Nominate Me
                                            </Button>
                                        ) :
                                        (
                                            (<Button
                                                color="primary"
                                                className="action-title done"
                                                disabled
                                            >
                                                You are nominated
                                            </Button>)
                                        )
                                ) : (
                                    false
                                )
                                
                            }
                            {
                                (this.props.type == "elections") ?
                                (
                                    (!this.props.poll.isVoted) ?
                                        (
                                            <Button
                                                color="primary"
                                                className="action-title"
                                                onClick={this.actionClick.bind(this, this.props.poll)}
                                            >
                                                Cast Vote
                                            </Button>
                                        ) :
                                        (
                                            (<Button
                                                color="primary"
                                                className="action-title done"
                                                disabled
                                            >
                                                Vote Casted
                                            </Button>)
                                        )
                                ) : (
                                    false
                                )
                            }
                            {
                                (this.props.type == "elected") &&
                                <Button
                                    color="primary"
                                    className="action-title"
                                    onClick={this.actionClick.bind(this, this.props.poll)}
                                >
                                    View Result
                                </Button>
                            }
                        </div>
                        {
                            (this.props.type == "nominations") &&
                            <div className="nomination schedule extra-content">
                                <span className="end-date">Till {moment.unix(this.props.poll.nominationEndDate / 1000).format("DD-MM-YY hh:mm A")}</span>
                            </div>
                        }
                        {
                            (this.props.type == "elections") &&
                            <div className="election schedule extra-content">
                                <span className="end-date">Till {moment.unix(this.props.poll.electionEndDate / 1000).format("DD-MM-YY hh:mm A")}</span>
                            </div>
                        }
                    </div>
                    
                </div>
                <div className="description-container custom-scroll">
                    <div className={("description") + (!this.props.poll.description ? " empty" : "")}>
                        {this.props.poll.description || "No Description"}
                    </div>
                </div>
                <div className="info-container">
                    <div className="info">
                        <div className="info-value title">
                            {
                                (this.props.type == "nominations") &&
                                    "Nominations"
                            }
                            {
                                (this.props.type == "elections" || this.props.type == "elected") &&
                                    "Total Votes"
                            }
                        </div>
                        <div className="info-value count">
                            {
                                (this.props.type == "nominations") &&
                                (
                                    this.props.poll.nominees ? this.props.poll.nominees.length : "-2-"
                                )
                            }
                            {
                                (this.props.type == "elections" || this.props.type == "elected") &&
                                (
                                    this.props.poll.totalVotes
                                )
                            }
                        </div>
                    </div>
                    <div className="info  flex-1">
                        <div className="info-value created-by text-ellipsis" title={this.props.poll.createdBy ? 'Created By: '+this.props.poll.createdBy.fullname : ""}>
                            <Icon>mode_edit</Icon> {this.props.poll.createdBy ? this.props.poll.createdBy.fullname : "--"}
                        </div>
                        <div title="Created Time" className="info-value created-date">
                        <Icon>access_time</Icon>{moment.unix(this.props.poll.createdDate/1000).format("DD MMM YYYY, hh:mm A")}
                        </div>
                    </div>                    
                </div>
            </div>
        );
    }

    actionClick(poll) {
        this.props.actionCallback(poll);
    }
}