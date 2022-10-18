const GroupsReducer = (state = {
    searchKey: "",
    groupList: []
}, action) => {
    switch (action.type) {
        case "GROUPS_SEARCH_KEY_CHANGE":
            state = {
                ...state,
                detailDealogOpen: action.payload
            };
            break;
        case "GROUPS_LIST_CHANGE":
            state = {
                ...state,
                groupList: action.payload
            };
            break;
    }
    return state;
};

export default GroupsReducer;