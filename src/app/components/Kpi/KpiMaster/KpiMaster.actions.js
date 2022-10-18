export function KpiLsitChange(kpiList){
    return {
        type: "KPI_KPI_LIST_CHANGE",
        payload: kpiList
    }
}

export function selectedKpiChange(selectedKpiDetails){
    return {
        type: "KPI_SELECTED_KPI_CHANGE",
        payload: selectedKpiDetails
    };
}

export function selectedKpiReset(){
    return {
        type: "KPI_SELECTED_KPI_RESET",
        payload: undefined
    };
}