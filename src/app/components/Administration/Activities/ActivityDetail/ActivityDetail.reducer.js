const ActivityDetailReducer = ( state = {
        activityMasterList: [],
        selectedActivity: false,
        ActivityDetailFields : {
            title: "",
            activityMaster: "",
            description: "",
            clubPoints: "",
            memberPoints: "",
            fromDate: "",
            toDate: "",
            isFeed: true,
            isDone: false,
            isReviewMode: false,
            assigneId: "",
            reviewerId: ""
        },
        assigneeChipSearchResult: [],
        reviewerChipSearchResult: [],
        selectedAssigneeChip: [],
        selectedReviewerChip: []
}, action) => {
    switch (action.type) {
        case "ACTIVITY_DETAIL_FORM_FIELD_CHANGE":
            const fields = state.ActivityDetailFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                ActivityDetailFields: fields
            }
        break;
        case "ACTIVITY_MASTER_LIST_CHANGE":
            state = {
                ...state,
                activityMasterList: action.payload
            }
        break;
        case "SELECTED_ACTIVITY_CHANGE":
            state = {
                ...state,
                selectedActivity: action.payload
            }
            break;
        case "ACTIVITY_DETAIL_FORM_FIELDS_CLEAR":
            state = {
                ...state,
                selectedActivity: false,
                ActivityDetailFields : {
                    title: "",
                    activityMaster: "",
                    description: "",
                    clubPoints: "",
                    memberPoints: "",
                    fromDate: "",
                    toDate: "",
                    isFeed: true,
                    isDone: false,
                    isReviewMode: false,
                    assigneId: "",
                    reviewerId: ""
                },
                assigneeChipSearchResult: [],
                reviewerChipSearchResult: [],
                selectedAssigneeChip: [],
                selectedReviewerChip: []
            }
            break;
        case "ASSIGN_ACTIVITY_ASSIGN_USER_SEARCH_RESULT":
            state = {
                ...state,
                assigneeChipSearchResult: action.payload
            }
            break;
        case "ASSIGN_ACTIVITY_SET_ASSIGNEE_USER_RESULT":
            state = {
                ...state,
                selectedAssigneeChip: action.payload
            }
            break;
        case "ASSIGN_ACTIVITY_REVIEW_USER_SEARCH_RESULT":
            state = {
                ...state,
                reviewerChipSearchResult: action.payload
            }
            break;
        case "ASSIGN_ACTIVITY_SET_REVIEWER_USER_RESULT":
            state = {
                ...state,
                selectedReviewerChip: action.payload
            }
            break;
    }
    return state;
}

export default ActivityDetailReducer;