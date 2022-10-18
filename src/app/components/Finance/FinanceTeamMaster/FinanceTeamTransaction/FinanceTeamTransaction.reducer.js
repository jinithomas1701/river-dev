const FinanceTeamTransactionReducer = (state={
    filterSearchText: "",
    filterType: "ALL",
    filterStatus: "ALL",
    filterGroupBy: "ST",
    transactionList: [],
    dockTransactionDetails: "empty",
    dockDiscussionDetails: []
},action) => {
    switch(action.type){
        case "FINANCE-TEAM-TRANSACTION_SET_SEARCH":
            state = {
                ...state,
                filterSearchText: action.payload
            }
            break;
        case "FINANCE-TEAM-TRANSACTION_SET_TYPE":
            state = {
                ...state,
                filterType: action.payload
            }
            break;
        case "FINANCE-TEAM-TRANSACTION_SET_STATUS":
            state = {
                ...state,
                filterStatus: action.payload
            }
            break;
        case "FINANCE-TEAM-TRANSACTION_SET_GROUPBY":
            state = {
                ...state,
                filterGroupBy: action.payload
            }
            break;
        case "FINANCE-TEAM-TRANSACTION_SET_LIST":
            state = {
                ...state,
                transactionList: action.payload
            };
            break;
        case "FINANCE-TEAM-TRANSACTION_APPEND_LIST":
                let updatedlist = state.transactionList;
                updatedlist.unshift(action.payload);
                state = {
                    ...state,
                    transactionList: updatedlist
                };
                break;
        case "FINANCE-TEAM-TRANSACTION_DOCK_TRANSACTION_DETAILS":
            state = {
                ...state,
                dockTransactionDetails: action.payload
            };
            break;
        case "FINANCE-TEAM-TRANSACTION_DOCK_DISCUSSION_DETAILS":
            state = {
                ...state,
                dockDiscussionDetails: action.payload
            };
            break;
        case "FINANCE-TEAM-TRANSACTION_CLEAR_DOCK_DETAILS":
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
                filterGroupBy: "ST",
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

export default FinanceTeamTransactionReducer;