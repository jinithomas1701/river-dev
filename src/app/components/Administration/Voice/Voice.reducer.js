const VoiceAdminReducer = (state = {
    voiceList: [],
}, action) => {
    switch (action.type) {
        case "VOICE_ADMIN_SET_VOICE_LIST":
            state = {
                ...state,
                voiceList: action.payload
            };
            break;
    }
    return state;
};

export default VoiceAdminReducer;