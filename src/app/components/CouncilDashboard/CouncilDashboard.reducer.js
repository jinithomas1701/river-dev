const CouncilDashboardReducer = (state = {
    activitiesList: [],
    voicesList: [],
    cudList: []
}, action) => {
    switch (action.type) {
        case "COUNCIL_DASHBOARD_LOAD_ACTIVITIES":
            state = {
                ...state,
                activitiesList: action.payload
            };
            break;
        case "COUNCIL_DASHBOARD_LOAD_VOICES":
            state = {
                ...state,
                voicesList: action.payload
            };
            break;
        case "COUNCIL_DASHBOARD_LOAD_CUDS":
            state = {
                ...state,
                cudList: action.payload
            };
            break;
    }
    return state;
};

export default CouncilDashboardReducer;