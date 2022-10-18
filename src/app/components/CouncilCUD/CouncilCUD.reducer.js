const CouncilCUDReducer = (state = {
    councilCud: {
        INPROGRESS: [],
        COMPLETED: []
    },
    bucketTypes: []
}, action) => {
    switch (action.type) {
        case "COUNCIL_CUD_LOAD_CUDS":
            let councilCuds = state.councilCud;
            councilCuds[action.status] = action.payload;
            state = {
                ...state,
                councilCud: councilCuds
            };
            break;
        case "COUNCIL_CUD_PUSH_CUDS":
            councilCuds = state.councilCud;
            councilCuds[action.status].push(...action.payload);
            state = {
                ...state,
                councilCud: councilCuds
            };
            break;
        case "COUNCIL_CUD_LOAD_BUCKET_LISTS":
            state = {
                ...state,
                bucketTypes: action.payload
            };
            break;
        case "COUNCIL_CUD_CLEAR_CUDS":
            state = {
                ...state,
                councilCud: {
                    INPROGRESS: [],
                    COMPLETED: []
                }
            }
            break;
    }
    return state;
};

export default CouncilCUDReducer;