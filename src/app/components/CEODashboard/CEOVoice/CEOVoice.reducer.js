const CEOVoiceReducer = ( state = {
    summary: null,
    chart: []
}, action ) => {
    switch(action.type) {
        case "CEO_VOICE_SET_DETAILS":
            state = {
                ...state,
                summary: action.payload
            };
            break;
        case "CEO_VOICE_SET_CHART":
            state = {
                ...state,
                chart: action.payload
            };
            break;
        default:
            break;
    }

    return state;
};

export default CEOVoiceReducer;