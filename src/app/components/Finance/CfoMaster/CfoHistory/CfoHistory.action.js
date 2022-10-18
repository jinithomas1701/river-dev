export function setCfoHistorySearch(filterSearchText){
    return ({
        type: "CFO-HISTORY_SET_SEARCH",
        payload: filterSearchText
    });
}

export function setCfoHistoryType(filterType){
    return ({
        type: "CFO-HISTORY_SET_TYPE",
        payload: filterType
    });
}

export function setCfoHistoryStatus(filterStatus){
    return ({
        type: "CFO-HISTORY_SET_STATUS",
        payload: filterStatus
    });
}

export function setCfoHistoryGroupBy(filterGroupBy){
    return ({
        type: "CFO-HISTORY_SET_GROUPBY",
        payload: filterGroupBy
    });
}


export function setCfoHistoryList(historyList){
    return ({
        type: "CFO-HISTORY_SET_LIST",
        payload: historyList
    });
}

export function setCfoHistoryDockTransactionDetails(transaction){
    return ({
        type: "CFO-HISTORY_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setCfoHistoryDockDiscussionDetails(discussion){
    return ({
        type: "CFO-HISTORY_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearCfoHistoryDockDetails(){
    return ({
        type: "CFO-HISTORY_CLEAR_DOCK_DETAILS",
        payload: []
    });
}