import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';

// css
import './ClubCard.scss';

import { Util } from '../../../../Util/util';

const PRIVILEGE_DELETE_CLUB = "DELETE_CLUB";
const PRIVILEGE_ACTIVATE_CLUB = "ACTIVATE_CLUB";

export class ClubCard extends React.Component {
    render() {
        return(
            <div className="clubcard" onClick={this.handleClubClick.bind(this, this.props.club)}>
                {Util.hasPrivilage(PRIVILEGE_DELETE_CLUB) && this.props.club.status &&
                    <Icon className="extra-info-icon"
                        title="Delete"
                        onClick={this.handleDeleteClick.bind(this, this.props.club)}>delete</Icon>
                }
                {
                    (Util.hasPrivilage(PRIVILEGE_ACTIVATE_CLUB) && !this.props.club.status) &&
                        <Icon className="extra-info-icon"
                            title="Activate"
                            onClick={this.handleActivateClick.bind(this, this.props.club)}>restore</Icon>
                }
                <div className="avatar-area">
                    <div className="image-holder">
                        <img src={(this.props.club.avatar) ? Util.getFullImageUrl(this.props.club.avatar) : "../../../../../resources/images/img/club.png"} className="clubcard-img"/>
                    </div>
                    <span title="Club Points" className="points"><Icon>stars</Icon> {this.props.club.clubPoints}</span>
                </div>
                <div className="info-area">
                    <h5 className="heading">{this.props.club.clubName}</h5>
                    <div className="more-info">
                        <span className="members">{this.props.club.membersCount} Members</span>
                        <span title="Club President" className="president">{this.props.club.clubPresident || "-"}</span>
                        <span title="Club Location" className="location">{this.props.club.clubLocation}</span>
                        <span title="Status" className={`status ${ this.props.club.status? "active" : "inactive" }`}>{this.props.club.status? "ACTIVE" : "INACTIVE"}</span>
                    </div>
                </div>
            </div>
        )
    }

    handleDeleteClick(club, event) {
        this.props.deleteCallback(club);
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleActivateClick(club, event) {
        this.props.activateCallback(club);
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleClubClick(club) {
        this.props.onClubClick(club);
    }
}