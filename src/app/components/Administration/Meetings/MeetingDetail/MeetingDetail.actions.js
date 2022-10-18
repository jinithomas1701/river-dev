export function setLocationList(locationList) {
    return {
        type: "MEETING_DETAIL_SET_LOCATION_LIST",
        payload: locationList
    }
}

export function setMeetingType(result) {
    return {
        type: "MEETING_DETAIL_SET_TYPE_LIST",
        payload: result
    }
}

export function setUserSearchResult(result) {
    return {
        type: "MEETING_DETAIL_SET_SEARCH_USER_RESULT",
        payload: result
    }
}

export function setUsersSelectedResult(result) {
    return {
        type: "MEETING_DETAIL_SET_SELECTED_USER_RESULT",
        payload: result
    }
}

export function fieldChange(fieldName, value) {
    return {
        type: "MEETING_DETAIL_FIELDS_CHANGE",
        payload: value,
        fieldName: fieldName
    }
}

export function setAllFields(fields) {
    return {
        type: "MEETING_DETAIL_SET_ALL_FIELDS",
        payload: fields
    }
}

export function setGuestList(list) {
    return {
        type: "MEETING_DETAIL_SET_GUEST_LIST",
        payload: list
    }
}

export function setAttendeesList(list) {
    return {
        type: "MEETING_DETAIL_SET_ATTENDEEES_LIST",
        payload: list
    }
}

export function setAbsenteesList(list) {
    return {
        type: "MEETING_DETAIL_SET_ABSENTEES_LIST",
        payload: list
    }
}

export function setOverallRating(rating) {
    return {
        type: "MEETING_DETAIL_SET_OVERALL_RATING",
        payload: rating
    }
}

export function clearField() {
    return {
        type: "MEETING_DETAIL_CLEAR_FIELDS"
    }
}