export function setClubTreasurerHistorySearch(filterSearchText){
    return ({
        type: "CLUB-TREASURER-HISTORY_SET_SEARCH",
        payload: filterSearchText
    });
}

export function setClubTreasurerHistoryType(filterType){
    return ({
        type: "CLUB-TREASURER-HISTORY_SET_TYPE",
        payload: filterType
    });
}

export function setClubTreasurerHistoryStatus(filterStatus){
    return ({
        type: "CLUB-TREASURER-HISTORY_SET_STATUS",
        payload: filterStatus
    });
}

export function setClubTreasurerHistoryGroupBy(filterGroupBy){
    return ({
        type: "CLUB-TREASURER-HISTORY_SET_GROUPBY",
        payload: filterGroupBy
    });
}


export function setClubTreasurerHistoryList(historyList){
    return ({
        type: "CLUB-TREASURER-HISTORY_SET_LIST",
        payload: historyList
    });
}

export function setClubTreasurerHistoryDockTransactionDetails(transaction){
    return ({
        type: "CLUB-TREASURER-HISTORY_DOCK_TRANSACTION_DETAILS",
        payload: transaction
    });
}

export function setClubTreasurerHistoryDockDiscussionDetails(discussion){
    return ({
        type: "CLUB-TREASURER-HISTORY_DOCK_DISCUSSION_DETAILS",
        payload: discussion
    });
}

export function clearClubTreasurerHistoryDockDetails(){
    return ({
        type: "CLUB-TREASURER-HISTORY_CLEAR_DOCK_DETAILS",
        payload: []
    });
}