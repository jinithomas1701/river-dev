const UserCUDReducer = (state = {
    userCudList: [],
    councilList: [],
    userCudFields: {
        title: "",
        description: "",
        achievementDate: "",
        council: ""
    }
}, action) => {
    switch (action.type) {
        case "USER_CUD_LOAD_CUD_LIST":
            state = {
                ...state,
                userCudList: action.payload
            };
            break;
        case "USER_CUD_PUSH_CUD_LIST":
            let userCudList = state.userCudList;
            userCudList.push(...action.payload);
            state = {
                ...state,
                userCudList: userCudList
            };
            break;
        case "USER_CUD_CHANGE_FIELD_VALUE":
            let userCudFields = state.userCudFields;
            userCudFields[action.fieldName] = action.payload;
            state = {
                ...state,
                userCudFields: userCudFields
            };
            break;
        case "USER_CUD_LOAD_COUNCIL_LIST":
            state = {
                ...state,
                councilList: action.payload
            };
            break;
        case "USER_CUD_CLEAR_FIELDS":
            state = {
                ...state,
                userCudFields: {
                    title: "",
                    description: "",
                    achievementDate: "",
                    council: ""
                }
            }
            break;
        case "USER_CUD_PUSH_CUD_FIELDS":
            state = {
                ...state,
                userCudFields: action.payload
            }
            break;
    }
    return state;
};

export default UserCUDReducer;