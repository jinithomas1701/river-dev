export function setFinanceTeamDashboardList(dashboardList){
    return ({
        type: "FINANCE-TEAM-DASHBOARD_SET_LIST",
        payload: dashboardList
    });
}

export function setFinanceTeamDashboardChartData(chartData){
    return ({
        type: "FINANCE-TEAM-DASHBOARD_CHART_DATA",
        payload: chartData
    });
}

export function setFinanceTeamDashboardDockTransactionDetails(transaction){
    return ({
        type: "FINANCE-TEAM-DASHBOARD_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setFinanceTeamDashboardDockDiscussionDetails(discussion){
    return ({
        type: "FINANCE-TEAM-DASHBOARD_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearFinanceTeamDashboardDockDetails(){
    return ({
        type: "FINANCE-TEAM-DASHBOARD_CLEAR_DOCK_DETAILS",
        payload: []
    });
}
