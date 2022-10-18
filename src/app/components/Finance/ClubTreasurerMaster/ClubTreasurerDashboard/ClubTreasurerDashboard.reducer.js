const ClubTreasurerDashboardReducer = (state={
    dashboardChartData: "empty",
    dashboardList: [],
    dockTransactionDetails: "empty",
    dockDiscussionDetails: []
},action) => {
    switch(action.type){
        case "CLUB-TREASURER-DASHBOARD_SET_LIST":
            state = {
                ...state,
                dashboardList: action.payload
            };
            break;
        case "CLUB-TREASURER-DASHBOARD_CHART_DATA":
            state = {
                ...state,
                dashboardChartData: action.payload
            };
            break;
        case "CLUB-TREASURER-DASHBOARD_DOCK_TRANSACTION_DETAILS":
            state = {
                ...state,
                dockTransactionDetails: action.payload
            };
            break;
        case "CLUB-TREASURER-DASHBOARD_DOCK_DISCUSSION_DETAILS":
            state = {
                ...state,
                dockDiscussionDetails: action.payload
            };
            break;
        case "CLUB-TREASURER-DASHBOARD_CLEAR_DOCK_DETAILS":
            state = {
                ...state,
                dockTransactionDetails: "empty",
                dockDiscussionDetails: []
            };
            break;
        case "RESET":
            state = {
                ...state,
                dashboardChartData: "empty",
                dashboardList: [],
                dockTransactionDetails: "empty",
                dockDiscussionDetails: []
            };
            break;
        default:
            state={...state};
            break;
    }
    return state;
}

export default ClubTreasurerDashboardReducer;