export function fieldChange(fieldName, data){
    return {
        fieldName: fieldName,
        type: "USER_ACTIVITY_ACTIVITY_DETAIL_FORM_FIELD_CHANGE",
        payload: data
    }
}

export function loadActivityMasterList(list){
    return {
        type: "USER_ACTIVITY_ACTIVITY_MASTER_LIST_CHANGE",
        payload: list
    }
}

export function changeSelectedActivity(activity){
    return {
        type: "USER_ACTIVITY_SELECTED_ACTIVITY_CHANGE",
        payload: activity
    }
}

export function clearFormFields(){
    return {
        type: "USER_ACTIVITY_ACTIVITY_DETAIL_FORM_FIELDS_CLEAR",
    }
}

export function setAssigneeUserSearchResult(result) {
    return {
        type: "USER_ACTIVITY_ASSIGN_ACTIVITY_ASSIGN_USER_SEARCH_RESULT",
        payload: result
    }
}

export function setAssigneeUserSelected(user){
    return {
        type: "USER_ACTIVITY_ASSIGN_ACTIVITY_SET_ASSIGNEE_USER_RESULT",
        payload: user
    }
}

export function setReviewerUserSearchResult(result) {
    return {
        type: "USER_ACTIVITY_ASSIGN_ACTIVITY_REVIEW_USER_SEARCH_RESULT",
        payload: result
    }
}

export function setReviewerUserSelected(user){
    return {
        type: "USER_ACTIVITY_ASSIGN_ACTIVITY_SET_REVIEWER_USER_RESULT",
        payload: user
    }
}
