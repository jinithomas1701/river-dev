export function setMeetingList(list) {
    return {
        type: "MEETINGS_SET_MEETING_LIST",
        payload: list
    }
}

export function pushMeetingList(list) {
    return {
        type: "MEETINGS_PUSH_MEETING_LIST",
        payload: list
    }
}

export function setMeetingDetails(details) {
    return {
        type: "MEETINGS_SET_MEETING_DETAILS",
        payload: details
    }
}

export function pushComment(index, comment) {
    return {
        type: "MEETINGS_PUSH_COMMENT",
        index: index,
        payload: comment[0]
    }
}