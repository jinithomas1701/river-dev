const ClubDetailReducer = (state = {
    locationList: [],
    confirmBoxVisibility: false,
    confirmBoxTitle: "Are you sure ?",
    confirmBoxContent: "Do you want to do this.",
    clubImage: "",
    clubFields: {
        avatar: "",
        clubName: "",
        clubDescription: "",
        clubSlogan: "",
        clubLocation: "",
        clubMembers: [],
        clubPoints: 0,
        clubPresident: "",
        clubBoardMembers: [],
        displayInLandingPage: "",
        code: ""
    },
    nonClubMembers: [],
    clubMembers: [],
    clubRoles: []
}, action) => {
    switch (action.type) {
        case "CLUBS_DETAIL_SET_LOCATION_LIST":
            state = {
                ...state,
                locationList: action.payload
            };
            break;
        case "CLUBS_DETAIL_FIELDS_CHANGE":
            const fields = state.clubFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                clubFields: fields
            };
            break;
        case "CLUBS_DETAIL_SET_CLUB_ROLES":
            state = {
                ...state,
                clubRoles: action.payload
            };
            break;
        case "CLUBS_DETAIL_SET_NONCLUB_MEMBERS":
            state = {
                ...state,
                nonClubMembers: action.payload
            };
            break;
        case "CLUBS_DETAIL_SET_CLUB_MEMBERS":
            state = {
                ...state,
                clubMembers: action.payload
            };
            break;
        case "CLUBS_DETAIL_RESET_FORM":
            state = {
                ...state,
                clubFields: {
                    avatar: "",
                    clubName: "",
                    clubDescription: "",
                    clubSlogan: "",
                    clubLocation: "",
                    clubMembers: [],
                    clubPoints: 0,
                    clubPresident: "",
                    clubBoardMembers: [],
                    displayInLandingPage: "",
                    code: ""
                }
            }
            break;
        case "CLUBS_DETAIL_TOGGLE_CONFIRM_BOX":
            state = {
                ...state,
                confirmBoxVisibility: action.payload
            }

            if (action.options && action.options.title) {
                state = {
                    ...state,
                    confirmBoxTitle: action.options.title
                }   
            }

            if (action.options && action.options.content) {
                state = {
                    ...state,
                    confirmBoxContent: action.options.content
                }   
            }
            break;
        case "CLUBS_DETAIL_CLUB_IMAGE_CHANGE":
            state = {
                ...state,
                clubImage : action.payload
            }
            break;
    }
    return state;
};

export default ClubDetailReducer;