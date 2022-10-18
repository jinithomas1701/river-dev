
export function setActivityDetail(data){
    return {
        type: "ACTIVITY_VIEW_SET_ACTIVITY_DETAIL",
        payload: data
    }
}

export function loadActivityMasterList(list){
    return {
        type: "ACTIVITY_MASTER_LIST_CHANGE",
        payload: list
    }
}

export function changeSelectedActivity(activity){
    return {
        type: "SELECTED_ACTIVITY_CHANGE",
        payload: activity
    }
}

export function clearFormFields(){
    return {
        type: "ACTIVITY_DETAIL_FORM_FIELDS_CLEAR",
    }
}

export function setAssigneeUserSearchResult(result) {
    return {
        type: "ASSIGN_ACTIVITY_ASSIGN_USER_SEARCH_RESULT",
        payload: result
    }
}

export function setAssigneeUserSelected(user){
    return {
        type: "ASSIGN_ACTIVITY_SET_ASSIGNEE_USER_RESULT",
        payload: user
    }
}

export function setReviewerUserSearchResult(result) {
    return {
        type: "ASSIGN_ACTIVITY_REVIEW_USER_SEARCH_RESULT",
        payload: result
    }
}

export function setReviewerUserSelected(user){
    return {
        type: "ASSIGN_ACTIVITY_SET_REVIEWER_USER_RESULT",
        payload: user
    }
}
