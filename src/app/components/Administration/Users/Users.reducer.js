const UsersReducer = (state = {
    userList: [],
    clubList: [],
    entityList: [],
    locationList: []
}, action) => {
    switch (action.type) {
        case "RESET_DATA":
            state = {
                ...state,
                userList: [],
                clubList: [],
                entityList: [],
                locationList: []
            };
            break;
        case "USERS_LIST_CHANGE":
            {
                const userList = [...state.userList, ...action.payload];
                state = {
                    ...state,
                    userList: userList
                };
            }
            break;
        case "USERS_LIST_RESET":
            state = {
                ...state,
                userList: []
            };
            break;
        case "USERS_CLUBS_CHANGE":
            state = {
                ...state,
                clubList: action.payload
            };
            break;
        case "USERS_ENTITY_CHANGE":
            state = {
                ...state,
                entityList: action.payload
            };
            break;
        case "USERS_LOCATION_CHANGE":
            state = {
                ...state,
                locationList: action.payload
            };
            break;
    }
    return state;
};

export default UsersReducer;