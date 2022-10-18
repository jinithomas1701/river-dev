const VoiceReducer = ( state ={
    voiceList: []
}, action ) => {
    switch (action.type) {
        case "VOICE_USER_LOAD_VOICE_LIST":
            state = {
                ...state,
                voiceList: action.payload
            }
            break;
    }
    return state;
}

export default VoiceReducer;