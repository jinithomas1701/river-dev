export function allNotificationsListChange(allNotificationsList) {
    return {
        type: "ALL_NOTIFICATIONS_LIST_CHANGE",
        payload: allNotificationsList
    }
}

export function recentNotificationsListChange(recentNotificationsList) {
    return {
        type: "RECENT_NOTIFICATIONS_LIST_CHANGE",
        payload: recentNotificationsList
    }
}

export function unreadNotificationsCountChange(count) {
    return {
        type: "UNREAD_NOTIFICATIONS_COUNT_CHANGE",
        payload: count
    }
}

export function changeNotificationPayload(payloadType, payload) {
    return {
        type: "CHANGE_NOTIFICATIONS_PAYLOAD_FOR_" + payloadType,
        payload: payload
    }
}