export function assignedActivityChange(assignedActivities){
    return {
        type: "PANEL_ACTIVITY_ASSIGNED_ACTIVITIES_CHANGE",
        payload: assignedActivities
    }
}

export function selectedActivityChange(selectedActivityDetails){
    return {
        type: "PANEL_ACTIVITY_SELECTED_ACTIVITY_CHANGE",
        payload: selectedActivityDetails
    };
}
export function selectedActivityReset(){
    return {
        type: "PANEL_ACTIVITY_SELECTED_ACTIVITY_RESET",
        payload: undefined
    };
}

export function pointMatrixChange(pointMatrix){
    return {
        type: "PANEL_ACTIVITY_POINTMATRIX_CHANGE",
        payload: pointMatrix
    };
}

export function memberPointChange(memberPoint){
    return {
        type: "PANEL_ACTIVITY_MEMBER_POINT_CHANGE",
        payload: memberPoint
    };
}

export function clubPointChange(memberPoint){
    return {
        type: "PANEL_ACTIVITY_CLUB_POINT_CHANGE",
        payload: memberPoint
    };
}

export function pointReset(){
    return {
        type: "PANEL_ACTIVITY_POINT_RESET",
        payload: null
    };
}

export function kpiListChange(kpiList){
    return {
        type: "PANEL_ACTIVITY_KPI_LIST_CHANGE",
        payload: kpiList
    };
}

export function selectedKpiChange(selectedKpiDetails){
    return {
        type: "PANEL_ACTIVITY_KPI_DETAILS_CHANGE",
        payload: selectedKpiDetails
    };
}

export function clearSelectedKpiDetails(){
    return {
        type: "PANEL_ACTIVITY_KPI_DETAILS_CHANGE",
        payload: null
    };
}

export function storeDiscussion(discussionList){
    return {
        type: "PANEL_ACTIVITY_STORE_DISCUSSION",
        payload: discussionList
    };
}