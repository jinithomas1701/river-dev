export function setField(fieldName, payload){
    return {
        type: "POLL_DETAIL_FIELD_CHANGE",
        payload: payload,
        fieldName: fieldName
    }
}

export function clearFields() {
    return {
        type: "POLL_DETAIL_CLEAR_FIELDS"
    }
}

export function loadPollDetails(poll) {
    return {
        type: "POLL_DETAIL_LOAD_POLL_DETAILS",
        payload: poll
    }
}

export function changeClubList(clubList) {
    return {
        type: "POLL_DETAIL_CHANGE_CLUB_LIST",
        payload: clubList
    }
}