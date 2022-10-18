const ActivitiesUserReducer = ( state ={
    searchKey: "",
    activitiesList: []
}, action) => {
    switch (action.type) {
        case "ACTIVITIES_USER_LIST_CHANGE":
            let newList = state.activitiesList;
            newList = newList.concat(action.payload)
            state = {
                ...state,
                activitiesList: action.payload
            }
            break;
        case "ACTIVITIES_USER_LIST_REPLACE":
            state = {
                ...state,
                activitiesList: action.payload
            }
            break;
        case "ACTIVITIES_USER_SEARCH_KEY_CHANGE":
            state = {
                ...state,
                searchKey: action.payload
            }
            break;
        case "ACTIVITIES_USER_CLEAR_LIST":
            state = {
                ...state,
                activitiesList: []
            }
            break;
    }
    return state;
};

export default ActivitiesUserReducer;