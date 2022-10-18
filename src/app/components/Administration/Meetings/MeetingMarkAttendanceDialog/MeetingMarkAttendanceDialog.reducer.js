const ActivityMasterDetailDialogReducer = (state = {
    isSelfAssign: false,
    category: "",
    subCategory: "",
    memberPoints: 0,
    clubPoints: 0
}, action) => {
    switch (action.type) {
        case "ACTIVITY_MASTER_DIALOG_SELF_ASSIGN_CHANGE":
            state = {
                ...state,
                isSelfAssign: action.payload
            };
            break;
        case "ACTIVITY_MASTER_DIALOG_CATEGORY_CHANGE":
            state = {
                ...state,
                category: action.payload
            };
            break;
        case "ACTIVITY_MASTER_DIALOG_SUB_CATEGORY_CHANGE":
            state = {
                ...state,
                subCategory: action.payload
            };
            break;
        case "ACTIVITY_MASTER_DIALOG_MEMBER_POINT_CHANGE":
            state = {
                ...state,
                memberPoints: action.payload
            };
            break;   
        case "ACTIVITY_MASTER_DIALOG_CLUB_POINT_CHANGE":
            state = {
                ...state,
                clubPoints: action.payload
            };
            break;  
    }
    return state;
};

export default ActivityMasterDetailDialogReducer;