export function setClubTreasurerTransactionSearch(filterSearchText){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_SET_SEARCH",
        payload: filterSearchText
    });
}

export function setClubTreasurerTransactionType(filterType){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_SET_TYPE",
        payload: filterType
    });
}

export function setClubTreasurerTransactionStatus(filterStatus){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_SET_STATUS",
        payload: filterStatus
    });
}

export function setClubTreasurerTransactionGroupBy(filterGroupBy){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_SET_GROUPBY",
        payload: filterGroupBy
    });
}

export function setClubTreasurerTransactionList(transactionList){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_SET_LIST",
        payload: transactionList
    });
}

export function appendClubTreasurerTransactionList(appendItem){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_APPEND_LIST",
        payload: appendItem
    });
}

export function setClubTreasurerTransactionDockTransactionDetails(transaction){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setClubTreasurerTransactionDockDiscussionDetails(discussion){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearClubTreasurerTransactionDockDetails(){
    return ({
        type: "CLUB-TREASURER-TRANSACTION_CLEAR_DOCK_DETAILS",
        payload: []
    });
}
