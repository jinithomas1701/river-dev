export function setMeetingList(list) {
    return {
        type: "PUBLIC_MEETINGS_SET_MEETING_LIST",
        payload: list
    }
}

export function setMeetingDetail(detail) {
    return {
        type: "PUBLIC_MEETINGS_SET_MEETING_DETAIL",
        payload: detail
    }
}

export function pushComment(index, comment) {
    return {
        type: "PUBLIC_MEETINGS_PUSH_COMMENT",
        index: index,
        payload: comment[0]
    }
}

export function pushMeetingList(list) {
    return {
        type: "PUBLIC_MEETINGS_PUSH_MEETING_LIST",
        payload: list
    }
}