export function assignedActivityChange(assignedActivities){
    return {
        type: "MEMBERACTIVITY_ASSIGNED_ACTIVITIES_CHANGE",
        payload: assignedActivities
    }
}

export function selectedActivityChange(selectedActivityDetails){
    return {
        type: "MEMBERACTIVITY_SELECTED_ACTIVITY_CHANGE",
        payload: selectedActivityDetails
    };
}
export function selectedActivityReset(){
    return {
        type: "MEMBERACTIVITY_SELECTED_ACTIVITY_RESET",
        payload: undefined
    };
}

export function pointMatrixChange(pointMatrix){
    return {
        type: "MEMBERACTIVITY_POINTMATRIX_CHANGE",
        payload: pointMatrix
    };
}

export function memberPointChange(memberPoint){
    return {
        type: "MEMBERACTIVITY_MEMBER_POINT_CHANGE",
        payload: memberPoint
    };
}

export function clubPointChange(memberPoint){
    return {
        type: "MEMBERACTIVITY_CLUB_POINT_CHANGE",
        payload: memberPoint
    };
}

export function clubMemberListChange(memberList){
    return {
        type: "MEMBERACTIVITY_MEMBER_LIST_CHANGE",
        payload: memberList
    };
}

export function clubDefaultMemberListChange(defaultMemberList){
    return {
        type: "MEMBERACTIVITY_DEFAULT_MEMBER_LIST_CHANGE",
        payload: defaultMemberList
    };
}

export function kpiListChange(kpiList){
    return {
        type: "MEMBERACTIVITY_KPI_LIST_CHANGE",
        payload: kpiList
    };
}

export function selectedKpiChange(selectedKpiDetails){
    return {
        type: "MEMBERACTIVITY_KPI_DETAILS_CHANGE",
        payload: selectedKpiDetails
    };
}

export function clearSelectedKpiDetails(){
    return {
        type: "MEMBERACTIVITY_KPI_DETAILS_CHANGE",
        payload: null
    };
}

export function storeDiscussion(discussionList){
    return {
        type: "MEMBERACTIVITY_STORE_DISCUSSION",
        payload: discussionList
    };
}