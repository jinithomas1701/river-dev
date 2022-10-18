const PointsReducer = ( state ={
    clubList: []
}, action ) => {
    switch (action.type) {
        case "POINTS_SET_CLUBLIST":
            state = {
                ...state,
                clubList: action.payload
            }
            break;
    }
    return state;
}

export default PointsReducer;