export function setFinanceTeamHistorySearch(filterSearchText){
    return ({
        type: "FINANCE-TEAM-HISTORY_SET_SEARCH",
        payload: filterSearchText
    });
}

export function setFinanceTeamHistoryType(filterType){
    return ({
        type: "FINANCE-TEAM-HISTORY_SET_TYPE",
        payload: filterType
    });
}

export function setFinanceTeamHistoryStatus(filterStatus){
    return ({
        type: "FINANCE-TEAM-HISTORY_SET_STATUS",
        payload: filterStatus
    });
}

export function setFinanceTeamHistoryGroupBy(filterGroupBy){
    return ({
        type: "FINANCE-TEAM-HISTORY_SET_GROUPBY",
        payload: filterGroupBy
    });
}


export function setFinanceTeamHistoryList(historyList){
    return ({
        type: "FINANCE-TEAM-HISTORY_SET_LIST",
        payload: historyList
    });
}

export function setFinanceTeamHistoryDockTransactionDetails(transaction){
    return ({
        type: "FINANCE-TEAM-HISTORY_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setFinanceTeamHistoryDockDiscussionDetails(discussion){
    return ({
        type: "FINANCE-TEAM-HISTORY_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearFinanceTeamHistoryDockDetails(){
    return ({
        type: "FINANCE-TEAM-HISTORY_CLEAR_DOCK_DETAILS",
        payload: []
    });
}