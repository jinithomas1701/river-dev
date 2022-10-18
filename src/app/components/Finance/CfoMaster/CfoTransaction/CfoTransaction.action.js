export function setCfoTransactionSearch(filterSearchText){
    return ({
        type: "CFO-TRANSACTION_SET_SEARCH",
        payload: filterSearchText
    });
}

export function setCfoTransactionType(filterType){
    return ({
        type: "CFO-TRANSACTION_SET_TYPE",
        payload: filterType
    });
}

export function setCfoTransactionStatus(filterStatus){
    return ({
        type: "CFO-TRANSACTION_SET_STATUS",
        payload: filterStatus
    });
}

export function setCfoTransactionGroupBy(filterGroupBy){
    return ({
        type: "CFO-TRANSACTION_SET_GROUPBY",
        payload: filterGroupBy
    });
}

export function setCfoTransactionList(transactionList){
    return ({
        type: "CFO-TRANSACTION_SET_LIST",
        payload: transactionList
    });
}

export function appendCfoTransactionList(appendItem){
    return ({
        type: "CFO-TRANSACTION_APPEND_LIST",
        payload: appendItem
    });
}

export function setCfoTransactionDockTransactionDetails(transaction){
    return ({
        type: "CFO-TRANSACTION_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setCfoTransactionDockDiscussionDetails(discussion){
    return ({
        type: "CFO-TRANSACTION_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearCfoTransactionDockDetails(){
    return ({
        type: "CFO-TRANSACTION_CLEAR_DOCK_DETAILS",
        payload: []
    });
}
