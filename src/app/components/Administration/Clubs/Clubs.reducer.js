const ClubsReducer = (state = {
    searchKey: "",
    clubList: []
}, action) => {
    switch (action.type) {
        case "CLUBS_SEARCH_KEY_CHANGE":
            state = {
                ...state,
                detailDealogOpen: action.payload
            };
            break;
        case "CLUBS_LIST_CHANGE":
            state = {
                ...state,
                clubList: action.payload
            };
            break;
    }
    return state;
};

export default ClubsReducer;