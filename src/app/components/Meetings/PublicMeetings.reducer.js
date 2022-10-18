const PublicMeetingsReducer = (state = {
    meetingList: [],
    meetingDetail: {}
}, action) => {
    switch (action.type) {
        case "PUBLIC_MEETINGS_SET_MEETING_LIST":
            state = {
                ...state,
                meetingList: action.payload
            };
            break;
        case "PUBLIC_MEETINGS_SET_MEETING_DETAIL":
            state = {
                ...state,
                meetingDetail: action.payload
            };
            break;
        case "PUBLIC_MEETINGS_PUSH_COMMENT":
            state.meetingList[action.index].comments.push(action.payload);
            break;
        case "PUBLIC_MEETINGS_PUSH_MEETING_LIST":
            state.meetingList.concat(action.payload);
            break;
    }
    return state;
};

export default PublicMeetingsReducer;