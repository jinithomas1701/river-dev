import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "material-ui/Icon";

import { DateDisplay } from "../../../Common/MinorComponents/MinorComponents";
import { UserAvatar } from "../../../Common/MinorComponents/MinorComponents";
//css
import "./AnnouncementTaskTile.scss";

const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
const STATUS_PENDING_APPROVAL = "AP";


class AnnouncementTaskTile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const task = props.task;
        const classList = `announcement-task-tile-wrapper theme-${props.theme}`;
        const clubfullClass = task.clubs && task.clubs.length ? "has-club" : "no-club";

        return (
            <article
                className={classList}
                title={task.title}
                onClick={this.handleSelect}
            >

                <header className="header">
                    <div className="date-wrapper">
                        <Icon>{this.getStatusIcon(task.status.code)}</Icon>
                        {
                            task.deadline ? <DateDisplay date={task.deadline} format="DD MMM" prefix="Deadline: " /> : <span className="date-display" title="No deadline set">--</span>
                        }
                    </div>
                    <div className="status-wrapper">
                        <Icon>timeline</Icon>
                        <span className="status">{this.getStatusText(task.status, task.clubs)}</span>
                    </div>
                </header>
                <div className="body">
                    <div className={`club-wrapper ${clubfullClass}`}>
                        {this.getClubTemplate(task.clubs)}
                    </div>
                    <Icon className="forward-arrow">arrow_forward</Icon>
                    <h1 className="title">{task.title.substring(0, 30)}</h1>
                </div>
                <div className="action-wrapper">
                    {props.actionButtons}
                </div>
            </article>
        );
    }

    getClubTemplate = (clubs) => {
        let template = <Icon title="No Clubs">more_horiz</Icon>;
        if (clubs && clubs.length) {
            template = clubs.map(club => <UserAvatar
                key={club.id}
                name={club.name}
                src={club.avatar}
            />);
        }
        return template;
    }

    getStatusText = (status, clubs) => {
        let statusText = "";
        if (status.code === STATUS_UPCOMING) {
            if (!clubs || clubs.length < 1) {
                statusText = "Open";
            }
            else {
                statusText = "Upcoming";
            }
        }
        else {
            statusText = status.name;
        }
        return statusText;
    }

    getStatusIcon = (status) => {
        let statusText = status === STATUS_COMPLETED ? "hourglass_full" : "hourglass_empty";
        return statusText;
    }

    handleSelect = () => {
        const props = this.props;
        props.onSelect(props.task);
    }
}

AnnouncementTaskTile.defaultProps = {
    canChangeStatus: false,
    canApproveTask: false,
    canShowInterest: false,
    actionButtons: null,
    theme: "type1"
};

AnnouncementTaskTile.propTypes = {
    canChangeStatus: PropTypes.bool,
    canApproveTask: PropTypes.bool,
    canShowInterest: PropTypes.bool,
    actionButtons: PropTypes.node,
    theme: PropTypes.oneOf(["type1", "type2", "type3"]),
    onSelect: PropTypes.func,
};

export default AnnouncementTaskTile;