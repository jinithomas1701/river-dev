export function setClubTreasurerDashboardList(dashboardList){
    return ({
        type: "CLUB-TREASURER-DASHBOARD_SET_LIST",
        payload: dashboardList
    });
}

export function setClubTreasurerDashboardChartData(chartData){
    return ({
        type: "CLUB-TREASURER-DASHBOARD_CHART_DATA",
        payload: chartData
    });
}

export function setClubTreasurerDashboardDockTransactionDetails(transaction){
    return ({
        type: "CLUB-TREASURER-DASHBOARD_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setClubTreasurerDashboardDockDiscussionDetails(discussion){
    return ({
        type: "CLUB-TREASURER-DASHBOARD_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearClubTreasurerDashboardDockDetails(){
    return ({
        type: "CLUB-TREASURER-DASHBOARD_CLEAR_DOCK_DETAILS",
        payload: []
    });
}
