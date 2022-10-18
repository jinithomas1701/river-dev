const MeetingDetailReducer = (state = {
    locationList: [],
    meetingTypeList: [],
    meetingFields: {
        title: "",
        desc: "",
        location: "",
        from: "",
        to: "",
        agenda: "",
        type: "",
        guestName: "",
        guestDesc: "",
        mom: "",
        notes: ""
    },
    chipSearchResult: [],
    guestList: [],
    selectedChips: [],
    meetingAttendees: [],
    meetingInvitees: [],
    meetingAbsentees: [],
    overallRating: 0
}, action) => {
    switch (action.type) {
        case "MEETING_DETAIL_SET_GUEST_LIST":
            state = {
                ...state,
                guestList: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_OVERALL_RATING":
            state = {
                ...state,
                overallRating: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_LOCATION_LIST":
            state = {
                ...state,
                locationList: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_TYPE_LIST":
            state = {
                ...state,
                meetingTypeList: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_SEARCH_USER_RESULT":
            state = {
                ...state,
                chipSearchResult: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_SELECTED_USER_RESULT":
            state = {
                ...state,
                selectedChips: action.payload
            };
            break;
        case "MEETING_DETAIL_FIELDS_CHANGE":
            const fields = state.meetingFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                meetingFields: fields
            };
            break;
        case "MEETING_DETAIL_SET_ALL_FIELDS":
            state = {
                ...state,
                meetingFields: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_ATTENDEEES_LIST":
            state = {
                ...state,
                meetingAttendees: action.payload
            };
            break;
        case "MEETING_DETAIL_SET_ABSENTEES_LIST":
            state = {
                ...state,
                meetingAbsentees: action.payload
            };
            break;
        case "MEETING_DETAIL_CLEAR_FIELDS":
            state = {
                locationList: [],
                meetingTypeList: [],
                meetingFields: {
                    title: "",
                    desc: "",
                    location: "",
                    from: "",
                    to: "",
                    agenda: "",
                    type: "",
                    guestName: "",
                    guestDesc: "",
                    mom: "",
                    notes: ""
                },
                chipSearchResult: [],
                guestList: [],
                selectedChips: [],
                meetingAttendees: [],
                meetingInvitees: [],
                meetingAbsentees: [],
                overallRating: 0
            }
            break;
    }
    return state;
};

export default MeetingDetailReducer;