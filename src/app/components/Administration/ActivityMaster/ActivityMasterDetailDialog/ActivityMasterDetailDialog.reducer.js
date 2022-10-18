const ActivityMasterDetailDialogReducer = (state = {
    activityMasterCategoryList: [],
    activityMasterCouncilList: [],
    isCouncilApproveDisabled: false,
    detailFormFields : {
        id: "",
        isSelfAssign: false,
        isCouncilApprove: true,
        isRewards: false,
        council: "",
        description: "",
        focusArea: "",
        title: "",
        memberPoint: 0,
        clubPoint: 0
    }
}, action) => {
    switch (action.type) {
        case "ACTIVITY_MASTER_COUNCIL_APPROVE_DISABLED":
            state = {
                ...state,
                isCouncilApproveDisabled: action.payload
            };
            break;
        case "ACTIVITY_MASTER_CATEGORY_LIST_LOAD":
            state = {
                ...state,
                activityMasterCategoryList: action.payload
            };
            break;
        case "ACTIVITY_MASTER_COUNCIL_LIST_LOAD":
            state = {
                ...state,
                activityMasterCouncilList: action.payload
            };
            break;
        case "ACTIVITY_MASTER_FORM_FIELD_CHANGE":
            const fields = state.detailFormFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                detailFormFields: fields
            }
            break;
        case "ACTIVITY_MASTER_FORM_FIELDS_CLEAR":
            state = {
                activityMasterCategoryList: [],
                detailFormFields : {
                    isSelfAssign: false,
                    isCouncilApprove: false,
                    isRewards: false,
                    council: "",
                    description: "",
                    category: "",
                    title: "",
                    memberPoint: 0,
                    clubPoint: 0
                }
            }
            break;
    }
    return state;
};

export default ActivityMasterDetailDialogReducer;