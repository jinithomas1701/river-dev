const FeedElementReducer = (state = {
    statusDialogOpen: false,
    feedsList: [],
    comment: ""
}, action) => {
    switch (action.type) {
        case "FEEDS_ELEMENT_COMMENT_CHANGE":
            state = {
                ...state,
                comment: action.payload
            };
            break;
    }
    return state;
};

export default FeedElementReducer;