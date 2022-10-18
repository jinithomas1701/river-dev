import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';

// css
import './UserCard.scss';

export class UserCard extends React.Component {
    state = {
        side: this.props.side,
        hasDelete: typeof this.props.hasDelete == "undefined"
            ? true
            : this.props.hasDelete
    }

    render() {
        return (

            <div className="user-card"    >
                <div className="left-section">
                    <div className="icon">
                        <img src={this.props.user.avatar} className="usercard-img" />
                    </div>
                    <div className="details">
                        <div className="name" onClick={this.handleUserClick.bind(this, this.props.user)}>
                            {this.props.user.name}
                        </div>
                        <div className="email">{this.props.user.email}</div>
                        <div className="points">{this.props.user.totalPoints} Points</div>
                        <div className="more-info">
                            <span className="club-name">{this.props.user.clubName || "-"}</span> {this.getStatusTemplate(this.props.user.status)}
                        </div>
                    </div>
                </div>
                {
                    (this.props.showDelete) && <div className="right-section">
                        <div className="item" onClick={this.handleDeleteClick.bind(this, this.props.user)}>
                            <Icon title="Delete User" className="delete-icon">delete</Icon>
                        </div>
                    </div>
                }
            </div>
        )
    }

    getStatusTemplate(status) {
        let statusTemplate;
        switch (status) {
            case "active":
                statusTemplate = <span className="userstatus active" title="Litmus7 employee">Active</span>;
                break;
            case "inactive":
                statusTemplate = <span className="userstatus inactive" title="Left Litmus7">Inactive</span>;
                break;
            case "temp":
                statusTemplate = <span className="userstatus temp" title="Password needs to be changed.">Temporary</span>;
                break;
            case "leadership":
                statusTemplate = <span className="userstatus leadership" title="Part of Elite Club Member. Cannot be allocated to any Club.">Leadership</span>;
                break;
            default:
                statusTemplate = "-";
                break;
        }
        return statusTemplate;
    }

    handleOnClick(event) {
        this.setState({
            side: this.state.side == "front"
                ? "back"
                : "front"
        });
        event.stopPropagation();
        event
            .nativeEvent
            .stopImmediatePropagation();
    };

    handleDeleteClick(user, event) {
        this
            .props
            .deleteCallback(user);
        event.stopPropagation();
        event
            .nativeEvent
            .stopImmediatePropagation();
    }

    handleUserClick(user) {
        this
            .props
            .onUserClick(user);
    }
}
