const ActivityViewReducer = ( state = {
        selectedActivity: false,
        activityDetail: {},
        selectedAssigneeChip: [],
}, action) => {
    switch (action.type) {
        case "ACTIVITY_VIEW_SELECTED_ACTIVITY_CHANGE":
            state = {
                ...state,
                selectedActivity: action.payload
            }
            break;
        case "ACTIVITY_VIEW_SET_ACTIVITY_DETAIL":
            state = {
                ...state,
                activityDetail: action.payload
            }
            break;
        case "ACTIVITY_VIEW_ACTIVITY_DETAIL_FORM_FIELDS_CLEAR":
            state = {
                ...state,
                selectedActivity: false,
                selectedAssigneeChip: [],
            }
            break;
        case "ACTIVITY_VIEW_ASSIGN_ACTIVITY_SET_ASSIGNEE_USER_RESULT":
            state = {
                ...state,
                selectedAssigneeChip: action.payload
            }
            break;
    }
    return state;
}

export default ActivityViewReducer;