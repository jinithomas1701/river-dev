const VoiceMasterReducer = (state = {
    voiceList: [],
    selectedVoice: undefined,
    departmentList: [],
    voiceTypeList: [],
    discussion: []
}, action) => {
    switch(action.type) {
        case "VOICE_MASTER_STORE_VOICE_LIST":
            state = {
                ...state,
                voiceList: action.payload
            };
            break;
        case "VOICE_MASTER_CLEAR_VOICE_LIST":
            state = {
                ...state,
                voiceList: []
            };
            break;
        case "VOICE_MASTER_STORE_VOICE_DETAILS":
            state = {
                ...state,
                selectedVoice: action.payload
            };
            break;
        case "VOICE_MASTER_CLEAR_VOICE_DETAILS":
            state = {
                ...state,
                selectedVoice: undefined
            };
            break;
        case "VOICE_MASTER_STORE_DEPARTMENTS":
            state = {
                ...state,
                departmentList: action.payload
            };
            break;
        case "VOICE_MASTER_STORE_VOICETYPES":
            state = {
                ...state,
                voiceTypeList: action.payload
            };
            break;
        case "VOICE_MASTER_STORE_DISCUSSION":
            state = {
                ...state,
                discussion: action.payload
            };
            break;
        case "VOICE_MASTER_CLEAR_DISCUSSION":
            state = {
                ...state,
                discussion: []
            };
            break;
        default:
            break;
    }

    return state;
}

export default VoiceMasterReducer;