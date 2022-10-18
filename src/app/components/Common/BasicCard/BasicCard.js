import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';

import { Util } from '../../../Util/util';

// css
import './BasicCard.scss';

export class BasicCard extends React.Component {
    state = {
        hasDelete: typeof this.props.hasDelete == "undefined" ? true : this.props.hasDelete
    };
    render() {
        return(
            <div className="basicCard" onClick={this.handlePollClick.bind(this, this.props.detail)}>
                {this.state.hasDelete &&
                    <Tooltip title="Delete Poll">
                        <Icon
                            className="extra-info-icon delete"
                            onClick={this.handleDeleteClick.bind(this, this.props.detail)}
                        >
                            clear
                        </Icon>
                    </Tooltip>
                }
                <Tooltip title={("Created On ") + Util.getDateStringFromTimestamp(this.props.detail.createdDate)}>
                    <Icon
                        className="extra-info-icon time"
                    >
                        schedule
                    </Icon>
                </Tooltip>
                <Tooltip title={this.props.detail.electionStatus}>
                    <Icon
                        className="extra-info-icon flag"
                    >
                        flag
                    </Icon>
                </Tooltip>
                <div className="title-container custom-scroll">
                    <div className="title">{this.props.detail.name}</div>
                </div>
                <div className="clubname-container">
                    {
                        this.props.detail.clubName ?
                            <Tooltip title="CLUB NAME">
                                <div className="clubname text-ellipsis">
                                    {this.props.detail.clubName}
                                </div>
                            </Tooltip>
                        : 
                            <Tooltip title="VISIBLE TO ALL">
                                <div className="clubname text-ellipsis">
                                    All
                                </div>
                            </Tooltip>
                    }
                </div>
            </div>
        )
    }

    handleDeleteClick(detail, event) {
        this.props.deleteCallback(detail);
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handlePollClick(detail) {
        this.props.onCardClick(detail);
    }
}