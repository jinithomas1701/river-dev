const GoForGrowthReducer = (state = {
    gfgList: []
}, action) => {
    switch (action.type) {
        case "GOFORGROWTH_LOAD_GFG_LIST":
            let gfgListTemp = state.gfgList;
            gfgListTemp = action.payload;
            state = {
                ...state,
                gfgList: gfgListTemp
            }
            break;
        case "GOFORGROWTH_PUSH_GFG_LIST":
            gfgListTemp = state.gfgList;
            gfgListTemp = gfgListTemp.concat(action.payload);
            state = {
                ...state,
                gfgList: gfgListTemp
            }
            break;
        case "GOFORGROWTH_UNSHIFT_GFG_LIST":
            gfgListTemp = state.gfgList;
            gfgListTemp.unshift(action.payload);
            state = {
                ...state,
                gfgList: gfgListTemp
            }
            break;
        case "GOFORGROWTH_CHANGE_GFG_ON_INDEX":
            gfgListTemp = state.gfgList;
            gfgListTemp[action.index] = action.payload;
            state = {
                ...state,
                gfgList: gfgListTemp
            }
            break;
        case "GOFORGROWTH_DELETE_GFG_AT_INDEX":
            gfgListTemp = state.gfgList;
            gfgListTemp.splice(action.payload, 1);
            state = {
                ...state,
                gfgList: gfgListTemp
            }
            break;
    }
    return state
}

export default GoForGrowthReducer;