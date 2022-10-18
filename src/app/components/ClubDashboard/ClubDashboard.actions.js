export function setClubPoints(clubPoints) {
    return {
        type: "CLUB_DASHBOARD_SET_CLUB_POINTS",
        payload: clubPoints
    }
}

export function setClubWeeklyPoints(clubPoints) {
    return {
        type: "CLUB_DASHBOARD_SET_CLUB_WEEKLY_POINTS",
        payload: clubPoints
    }
}

export function setPointsDiff(points) {
    return {
        type: "CLUB_DASHBOARD_SET_CLUB_POINT_DIFF",
        payload: points
    }
}

export function loadPillarStats(pillarStats) {
    return {
        type: "CLUB_DASHBOARD_SET_PILLAR_STATISTICS",
        payload: pillarStats
    }
}

export function loadTopUsersList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_TOP_USERS_LIST",
        payload: list
    }
}

export function clearPillarStats() {
    return {
        type: "CLUB_DASHBOARD_CLEAR_PILLAR_STATISTICS"
    }
}

export function loadActivitiesList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_ACTIVITIES_LIST",
        payload: list
    }
}

export function loadVoicesList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_VOICES_LIST",
        payload: list
    }
}

export function loadCudsList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_CUDS_LIST",
        payload: list
    }
}

export function loadCommitmentsList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_COMMITMENTS_LIST",
        payload: list
    }
}

export function loadMemberSummaryList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_MEMBER_SUMMARY_LIST",
        payload: list
    }
}


export function loadWeeklyCommitmentsList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_WEEKLY_COMMITMENTS_LIST",
        payload: list
    }
}

export function changeCommitmentStatus(payload) {
    return {
        type: "CLUB_DASHBOARD_CHANGE_COMMITMENTS_STATUS",
        payload: payload
    }
}

export function fieldChange(field, value) {
    return {
        type: "CLUB_DASHBOARD_CHANGE_FIELD_VALUE",
        payload: value,
        fieldName: field
    }
}

export function loadCommitmentStatus(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_COMMITMENTS_STATUS_LIST",
        payload: list
    }
}

export function clearCommitmentsFields() {
    return {
        type: "CLUB_DASHBOARD_CLEAR_COMMITMENTS_FIELDS"
    }
}

export function setTargetAchieved(percent) {
    return {
        type: "CLUB_DASHBOARD_SET_TARGET_ACHIEVED",
        payload: percent
    }
}

export function loadTargetsList(list) {
    return {
        type: "CLUB_DASHBOARD_LOAD_TARGETS_LIST",
        payload: list
    }
}

export function setClubTarget(points) {
    return {
        type: "CLUB_DASHBOARD_SET_CLUB_TARGET",
        payload: points
    }
}