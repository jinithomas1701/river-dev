const KpiMasterReducer = (state ={
    kpiList: [],
    selectedKpiDetails: undefined
}, action) => {
    switch(action.type) {
        case "KPI_KPI_LIST_CHANGE":
            state = {
                ...state,
                kpiList: action.payload
            };
            break;
        case "KPI_SELECTED_KPI_CHANGE":
            state = {
                ...state,
                selectedKpiDetails: action.payload
            };
            break;
        case "KPI_SELECTED_KPI_RESET":
            state = {
                ...state,
                selectedKpiDetails: undefined
            };
            break;
        default:
            break;
    }

    return state;
};

export default KpiMasterReducer;