export function setCfoDashboardList(dashboardList){
    return ({
        type: "CFO-DASHBOARD_SET_LIST",
        payload: dashboardList
    });
}

export function setCfoDashboardChartData(chartData){
    return ({
        type: "CFO-DASHBOARD_CHART_DATA",
        payload: chartData
    });
}

export function setCfoDashboardDockTransactionDetails(transaction){
    return ({
        type: "CFO-DASHBOARD_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setCfoDashboardDockDiscussionDetails(discussion){
    return ({
        type: "CFO-DASHBOARD_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearCfoDashboardDockDetails(){
    return ({
        type: "CFO-DASHBOARD_CLEAR_DOCK_DETAILS",
        payload: []
    });
}
