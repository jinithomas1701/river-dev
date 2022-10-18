export function changeField(fieldName, value) {
    return {
        type: "REPORT_CHANGE_FIELD_NAME",
        payload: value,
        fieldName: fieldName
    }
}

export function setReport(value) {
    return {
        type: "REPORT_SET_REPORT",
        payload: value
    }
}

export function setClubList(value) {
    return {
        type: "REPORT_SET_CLUB_LIST",
        payload: value
    }
}

export function clearFields() {
    return{
        type: "REPORT_CLEAR_FIELDS"
    }
}