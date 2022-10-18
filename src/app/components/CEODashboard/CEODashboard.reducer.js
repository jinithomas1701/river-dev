const CEODashboardReducer = (state = {
    commitmentsList: [],
    activitiesList: [],
    voicesList: [],
    clubPoints: [],
    clubsList: [],
    focusAreaPoints: [],
    cudList: [],
    focusAreaList: [],
    topClubs: [],
    topMembers: []
}, action) => {
    switch (action.type) {
        case "CEO_DASHBOARD_LOAD_ACTIVITIES_LIST":
            state = {
                ...state,
                activitiesList: action.payload
            };
            break;
        case "CEO_DASHBOARD_LOAD_VOICES_LIST":
            state = {
                ...state,
                voicesList: action.payload
            };
            break;
        case "CEO_DASHBOARD_LOAD_COMMITMENTS_LIST":
            state = {
                ...state,
                commitmentsList: action.payload
            };
            break;
        case "CEO_DASHBOARD_LOAD_CUD_LIST":
            state = {
                ...state,
                cudList: action.payload
            };
            break;
        case "CEO_DASHBOARD_SET_CLUB_POINTS":
            state = {
                ...state,
                clubPoints: action.payload
            };
            break;
        case "CEO_DASHBOARD_LOAD_FOCUS_AREA_POINTS":
            state = {
                ...state,
                focusAreaPoints: action.payload
            }
            break;
        case "CEO_DASHBOARD_LOAD_FOCUS_AREA_LIST":
            state = {
                ...state,
                focusAreaList: action.payload
            }
            break;
        case "CEO_DASHBOARD_LOAD_CLUB_LIST":
            state = {
                ...state,
                clubsList: action.payload
            }
            break;
        case "CEO_DASHBOARD_CLEAR_CLUB_LIST":
            state = {
                ...state,
                activitiesList: []
            }
            break;
        case "CEO_DASHBOARD_LOAD_TOP_CLUBS_LIST":
            state = {
                ...state,
                topClubs: action.payload
            }
            break;
        case "CEO_DASHBOARD_LOAD_TOP_MEMBERS_LIST":
            state = {
                ...state,
                topMembers: action.payload
            }
            break;
    }
    return state;
};

export default CEODashboardReducer;