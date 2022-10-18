const MyClubReducer = (state = {
    discussion: []
}, action) => {
    switch (action.type) {
        case "MY_CLUB_LOAD_DISCUSSION":
            state = {
                ...state,
                discussion: action.payload
            };
            break;
        case "MY_CLUB_CLEAR_DISCUSSION":
            state = {
                ...state,
                discussion: []
            };
            break;
    }
    return state;
};

export default MyClubReducer;