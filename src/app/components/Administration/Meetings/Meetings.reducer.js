const MeetingsReducer = (state = {
    meetingList: [],
    meetingDetails: null
}, action) => {
    switch (action.type) {
        case "MEETINGS_SET_MEETING_LIST":
            state = {
                ...state,
                meetingList: action.payload
            };
            break;
        case "MEETINGS_PUSH_MEETING_LIST":
            state = {
                ...state,
                meetingList: state.meetingList.concat(action.payload)
            };
            break;
        case "MEETINGS_SET_MEETING_DETAILS":
            state = {
                ...state,
                meetingDetails: action.payload
            };
            break;
        case "MEETINGS_PUSH_COMMENT":
            state.meetingList[action.index].comments.push(action.payload);
            break;
    }
    return state;
};

export default MeetingsReducer;