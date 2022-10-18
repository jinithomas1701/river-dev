import React from "react";
import { connect } from "react-redux";
import { CommonService } from "../../Layout/Common.service";
import { Toast, riverToast } from '../Toast/Toast';
import { Link } from 'react-router-dom'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Icon from 'material-ui/Icon';
import { Util } from '../../../Util/util';

import {
    allNotificationsListChange,
    recentNotificationsListChange,
    unreadNotificationsCountChange
} from "./Notifications.actions";

import './Notifications.scss';

const mapStateToProps = (state) => {
    return {
        notifications: state.NotificationsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        allNotificationsListChange: (allNotificationsList) => {
            dispatch(allNotificationsListChange(allNotificationsList))
        },
        recentNotificationsListChange: (recentNotificationsList) => {
            dispatch(recentNotificationsListChange(recentNotificationsList))
        },
        unreadNotificationsCountChange: (count) => {
            dispatch(unreadNotificationsCountChange(count))
        }
    }
};

class NotificationsMenu extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.getNotifications();
    }

    componentDidMount() {
        this.markRead();
    }
    
    render() {

        const recentNotifications = this.props.notifications.recentNotificationsList.map((item, index) => {
            return (
                <ListItem button className="notification-list-item" key={index}>
                    {item.status == 'new' &&
                        <Avatar className="notification-list-item-avatar new-avatar">
                            <Icon color="contrast" className="notification-list-item-icon">fiber_new</Icon>
                        </Avatar>
                    }
                    {item.status == 'read' &&
                        <Avatar className="notification-list-item-avatar">
                            <Icon className="notification-list-item-icon">done_all</Icon>
                        </Avatar>
                    }
                    {
                        (item.url) ? (
                            <Link to={item.url}>
                                <ListItemText className={item.status + " river-notify-title-head"} primary={item.title} secondary={Util.getDateInFormat(item.createdDate, "DD MMM YYYY hh:mma")} />
                            </Link>
                        ) : (
                            <ListItemText className={item.status + " river-notify-title-head"} primary={item.title} secondary={Util.getDateInFormat(item.createdDate, "DD MMM YYYY hh:mma")} />
                        )
                    }
                </ListItem>);

        });

        return (
            <div className="notifications-menu custom-scroll">
                {
                    (recentNotifications.length > 0) ? (
                        <List>
                            {recentNotifications}
                        </List>
                    ) : (
                        <div className="loading-text">
                            <Icon className="no-notification-icon">notifications_off</Icon>
                            <div className="no-notification-text">No Notifications</div>
                        </div>
                    )
                }
            </div>
        )
    }

    getNotifications() {
        this.props.getNotificationsCallBack();
    }

    markRead() {
        this.props.markReadNotificationsCallBack();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsMenu)