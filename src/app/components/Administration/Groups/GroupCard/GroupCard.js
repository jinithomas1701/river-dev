import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';

// css
import './GroupCard.scss';

export class GroupCard extends React.Component {
    render() {
        return(
            <div className="groupcard" onClick={this.handleGroupClick.bind(this, this.props.group)}>
                <Icon className="extra-info-icon"
                    title="Delete Panel"
                    onClick={this.handleDeleteClick.bind(this, this.props.group)}>delete</Icon>
                <div className="image-holder">
                    <img src="../../../../../resources/images/img/club.png" className="groupcard-img"/>
                </div>
                <h5 className="heading">{this.props.group.name}</h5>
                <span className="members">{this.props.group.membersCount} Members</span>
            </div>
        )
    }

    handleDeleteClick(group, event) {
        this.props.deleteCallback(group);
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleGroupClick(group) {
        this.props.onGroupClick(group);
    }
}