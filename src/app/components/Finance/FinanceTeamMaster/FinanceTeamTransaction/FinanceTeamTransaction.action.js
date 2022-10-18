export function setFinanceTeamTransactionSearch(filterSearchText){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_SET_SEARCH",
        payload: filterSearchText
    });
}

export function setFinanceTeamTransactionType(filterType){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_SET_TYPE",
        payload: filterType
    });
}

export function setFinanceTeamTransactionStatus(filterStatus){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_SET_STATUS",
        payload: filterStatus
    });
}

export function setFinanceTeamTransactionGroupBy(filterGroupBy){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_SET_GROUPBY",
        payload: filterGroupBy
    });
}

export function setFinanceTeamTransactionList(transactionList){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_SET_LIST",
        payload: transactionList
    });
}

export function appendFinanceTeamTransactionList(appendItem){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_APPEND_LIST",
        payload: appendItem
    });
}

export function setFinanceTeamTransactionDockTransactionDetails(transaction){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setFinanceTeamTransactionDockDiscussionDetails(discussion){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearFinanceTeamTransactionDockDetails(){
    return ({
        type: "FINANCE-TEAM-TRANSACTION_CLEAR_DOCK_DETAILS",
        payload: []
    });
}
