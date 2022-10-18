const ClubTreasurerTransactionReducer = (state={
    filterSearchText: "",
    filterType: "ALL",
    filterStatus: "ALL",
    filterGroupBy: "DT",
    transactionList: [],
    dockTransactionDetails: "empty",
    dockDiscussionDetails: []
},action) => {
    switch(action.type){
        case "CLUB-TREASURER-TRANSACTION_SET_SEARCH":
            state = {
                ...state,
                filterSearchText: action.payload
            }
            break;
        case "CLUB-TREASURER-TRANSACTION_SET_TYPE":
            state = {
                ...state,
                filterType: action.payload
            }
            break;
        case "CLUB-TREASURER-TRANSACTION_SET_STATUS":
            state = {
                ...state,
                filterStatus: action.payload
            }
            break;
        case "CLUB-TREASURER-TRANSACTION_SET_GROUPBY":
            state = {
                ...state,
                filterGroupBy: action.payload
            }
            break;
        case "CLUB-TREASURER-TRANSACTION_SET_LIST":
            state = {
                ...state,
                transactionList: action.payload
            };
            break;
        case "CLUB-TREASURER-TRANSACTION_APPEND_LIST":
                let updatedlist = state.transactionList;
                updatedlist.unshift(action.payload);
                state = {
                    ...state,
                    transactionList: updatedlist
                };
                break;
        case "CLUB-TREASURER-TRANSACTION_DOCK_TRANSACTION_DETAILS":
            state = {
                ...state,
                dockTransactionDetails: action.payload
            };
            break;
        case "CLUB-TREASURER-TRANSACTION_DOCK_DISCUSSION_DETAILS":
            state = {
                ...state,
                dockDiscussionDetails: action.payload
            };
            break;
        case "CLUB-TREASURER-TRANSACTION_CLEAR_DOCK_DETAILS":
            state = {
                ...state,
                dockTransactionDetails: "empty",
                dockDiscussionDetails: []
            };
            break;
        case "RESET":
            state = {
                ...state,
                filterSearchText: "",
                filterType: "ALL",
                filterStatus: "ALL",
                filterGroupBy: "DT",
                transactionList: [],
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

export default ClubTreasurerTransactionReducer;