const NotificationsReducer = ( state ={
    allNotificationsList: [],
    recentNotificationsList: [],
    unreadCount: 0
}, action) => {
    switch (action.type) {
        case "ALL_NOTIFICATIONS_LIST_CHANGE":
            state = {
                ...state,
                allNotificationsList: action.payload
            }
        break;
        case "RECENT_NOTIFICATIONS_LIST_CHANGE":
            state = {
                ...state,
                recentNotificationsList: action.payload
            }
        break;
        case "UNREAD_NOTIFICATIONS_COUNT_CHANGE":
            state = {
                ...state,
                unreadCount: action.payload
            }
        break;
    }
    return state;
};

export default NotificationsReducer;