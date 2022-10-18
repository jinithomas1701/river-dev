export function setClubPoints(clubPoints) {
    return {
        type: "ADMIN_DASHBOARD_SET_CLUB_POINTS",
        payload: clubPoints
    }
}

export function setPointsDiff(points) {
    return {
        type: "ADMIN_DASHBOARD_SET_CLUB_POINT_DIFF",
        payload: points
    }
}

export function loadRecentMeetings(meetings) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_RECENT_MEETINGS",
        payload: meetings
    }
}

export function loadPillarStats(pillarStats) {
    return {
        type: "ADMIN_DASHBOARD_SET_PILLAR_STATISTICS",
        payload: pillarStats
    }
}

export function loadTopUsersList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_TOP_USERS_LIST",
        payload: list
    }
}

export function clearPillarStats() {
    return {
        type: "ADMIN_DASHBOARD_CLEAR_PILLAR_STATISTICS"
    }
}

export function loadActivitiesList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_ACTIVITIES_LIST",
        payload: list
    }
}

export function pushActivitiesList(list) {
    return {
        type: "ADMIN_DASHBOARD_PUSH_ACTIVITIES_LIST",
        payload: list
    }
}

export function loadVoicesList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_VOICES_LIST",
        payload: list
    }
}

export function pushVoicesList(list) {
    return {
        type: "ADMIN_DASHBOARD_PUSH_VOICES_LIST",
        payload: list
    }
}

export function pushCommitmentsList(list) {
    return {
        type: "ADMIN_DASHBOARD_PUSH_COMMITMENTS_LIST",
        payload: list
    }
}

export function loadMemberSummaryList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_MEMBER_SUMMARY_LIST",
        payload: list
    }
}


export function loadCommitmentsList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_WEEKLY_COMMITMENTS_LIST",
        payload: list
    }
}

export function loadCudsList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_CUDS_LIST",
        payload: list
    }
}

export function pushCudsList(list) {
    return {
        type: "ADMIN_DASHBOARD_PUSH_CUDS_LIST",
        payload: list
    }
}

export function changeCommitmentStatus(payload) {
    return {
        type: "ADMIN_DASHBOARD_CHANGE_COMMITMENTS_STATUS",
        payload: payload
    }
}

export function fieldChange(field, value) {
    return {
        type: "ADMIN_DASHBOARD_CHANGE_FIELD_VALUE",
        payload: value,
        fieldName: field
    }
}

export function clearCommitmentsFields() {
    return {
        type: "ADMIN_DASHBOARD_CLEAR_COMMITMENTS_FIELDS"
    }
}

export function setTargetAchieved(percent) {
    return {
        type: "ADMIN_DASHBOARD_SET_TARGET_ACHIEVED",
        payload: percent
    }
}

export function setClubTarget(points) {
    return {
        type: "ADMIN_DASHBOARD_SET_CLUB_TARGET",
        payload: points
    }
}

export function setBODUserSearchResult(users) {
    return {
        type: "ADMIN_DASHBOARD_SET_BOD_USER_SEARCH_RESULT",
        payload: users
    }
}

export function setBODUserSelected(users) {
    return {
        type: "ADMIN_DASHBOARD_SET_SELECTED_BOD_CHIPS",
        payload: users
    }
}

export function loadMembersList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_MEMBERS_LIST",
        payload: list
    }
}

export function loadMasterActivitiesList(list) {
    return {
        type: "ADMIN_DASHBOARD_LOAD_MASTER_ACTIVITIES_LIST",
        payload: list
    }
}