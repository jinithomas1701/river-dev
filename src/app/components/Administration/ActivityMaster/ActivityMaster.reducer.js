const ActivityMasterReducer = (state = {
    detailDialogOpen: false,
    activityMasterList: []
}, action) => {
    switch (action.type) {
        case "ACTIVITY_MASTER_DETAIL_DIALOG_OPEN":
            state = {
                ...state,
                detailDialogOpen: action.payload
            };
            break;
        case "LOAD_ACTIVITY_MASTER_LIST":
            state = {
                ...state,
                activityMasterList: action.payload
            }
    }
    return state;
};

export default ActivityMasterReducer;