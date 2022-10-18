const ClubSettingsReducer = (state = {
    members: [],
    settings: null,
    masterActivities: []
}, action) => {
    switch(action.type) {
        case "CLUB_SETTINGS_SET_MEMBERS":
            state = {
                ...state,
                members: action.payload
            }
            break;
        case "CLUB_SETTINGS_SET_SETTINGS":
            state = {
                ...state,
                settings: action.payload
            }
            break;
        case "CLUB_SETTINGS_SET_MASTER_ACTIVITIES":
            state = {
                ...state,
                masterActivities: action.payload
            }
            break;
        default:
            break;
    }

    return state;
};

export default ClubSettingsReducer;