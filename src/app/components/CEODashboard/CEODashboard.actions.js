export function loadClubPoints(points) {
    return {
        type: "CEO_DASHBOARD_SET_CLUB_POINTS",
        payload: points
    }    
}

export function loadActivitiesList(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_ACTIVITIES_LIST",
        payload: list
    }    
}

export function loadVoicesList(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_VOICES_LIST",
        payload: list
    }    
}

export function loadCommitmentsList(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_COMMITMENTS_LIST",
        payload: list
    }    
}

export function loadCudList(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_CUD_LIST",
        payload: list
    }    
}

export function loadFocusAreaPoints(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_FOCUS_AREA_POINTS",
        payload: list
    }
}

export function loadFocusAreaList(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_FOCUS_AREA_LIST",
        payload: list        
    }
}

export function loadClubsList(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_CLUB_LIST",
        payload: list  
    }
}

export function clearActivitiesList() {
    return {
        type: "CEO_DASHBOARD_CLEAR_CLUB_LIST"
    }
}

export function loadTopClubs(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_TOP_CLUBS_LIST",
        payload: list  
    }
}

export function loadTopMembers(list) {
    return {
        type: "CEO_DASHBOARD_LOAD_TOP_MEMBERS_LIST",
        payload: list  
    }
}