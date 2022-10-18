export function setMembers(memberList){
    return {
        type: "CLUB_SETTINGS_SET_MEMBERS",
        payload: memberList
    }
}

export function setClubSettings(settings){
    return {
        type: "CLUB_SETTINGS_SET_SETTINGS",
        payload: settings
    }
}

export function setMasterActivities(masterActivities){
    return {
        type: "CLUB_SETTINGS_SET_MASTER_ACTIVITIES",
        payload: masterActivities
    }
}