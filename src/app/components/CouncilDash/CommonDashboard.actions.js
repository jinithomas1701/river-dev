export function setClubPoints(clubPoints) {
    return {
        type: "COMMON_DASHBOARD_SET_CLUB_POINTS",
        payload: clubPoints
    }
}

export function setClubWeeklyPoints(clubPoints) {
    return {
        type: "COMMON_DASHBOARD_SET_CLUB_WEEKLY_POINTS",
        payload: clubPoints
    }
}

export function setPointsDiff(points) {
    return {
        type: "COMMON_DASHBOARD_SET_CLUB_POINT_DIFF",
        payload: points
    }
}

export function loadPillarStats(pillarStats) {
    return {
        type: "COMMON_DASHBOARD_SET_PILLAR_STATISTICS",
        payload: pillarStats
    }
}

export function loadTopUsersList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_TOP_USERS_LIST",
        payload: list
    }
}

export function clearPillarStats() {
    return {
        type: "COMMON_DASHBOARD_CLEAR_PILLAR_STATISTICS"
    }
}

export function loadActivitiesList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_ACTIVITIES_LIST",
        payload: list
    }
}

export function pushActivitiesList(list) {
    return {
        type: "COMMON_DASHBOARD_PUSH_ACTIVITIES_LIST",
        payload: list
    }
}

export function loadVoicesList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_VOICES_LIST",
        payload: list
    }
}

export function pushVoicesList(list) {
    return {
        type: "COMMON_DASHBOARD_PUSH_VOICES_LIST",
        payload: list
    }
}

export function loadCommitmentsList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_COMMITMENTS_LIST",
        payload: list
    }
}

export function pushCommitmentsList(list) {
    return {
        type: "COMMON_DASHBOARD_PUSH_COMMITMENTS_LIST",
        payload: list
    }
}

export function loadMemberSummaryList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_MEMBER_SUMMARY_LIST",
        payload: list
    }
}


export function loadWeeklyCommitmentsList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_WEEKLY_COMMITMENTS_LIST",
        payload: list
    }
}

export function changeCommitmentStatus(payload) {
    return {
        type: "COMMON_DASHBOARD_CHANGE_COMMITMENTS_STATUS",
        payload: payload
    }
}

export function fieldChange(field, value) {
    return {
        type: "COMMON_DASHBOARD_CHANGE_FIELD_VALUE",
        payload: value,
        fieldName: field
    }
}

export function loadCommitmentStatus(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_COMMITMENTS_STATUS_LIST",
        payload: list
    }
}

export function clearCommitmentsFields() {
    return {
        type: "COMMON_DASHBOARD_CLEAR_COMMITMENTS_FIELDS"
    }
}

export function setTargetAchieved(percent) {
    return {
        type: "COMMON_DASHBOARD_SET_TARGET_ACHIEVED",
        payload: percent
    }
}

export function loadTargetsList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_TARGETS_LIST",
        payload: list
    }
}

export function setClubTarget(points) {
    return {
        type: "COMMON_DASHBOARD_SET_CLUB_TARGET",
        payload: points
    }
}

export function setBODUserSearchResult(users) {
    return {
        type: "COMMON_DASHBOARD_SET_BOD_USER_SEARCH_RESULT",
        payload: users
    }
}

export function setBODUserSelected(users) {
    return {
        type: "COMMON_DASHBOARD_SET_SELECTED_BOD_CHIPS",
        payload: users
    }
}

export function loadMembersList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_MEMBERS_LIST",
        payload: list
    }
}

export function loadMasterActivitiesList(list) {
    return {
        type: "COMMON_DASHBOARD_LOAD_MASTER_ACTIVITIES_LIST",
        payload: list
    }
}