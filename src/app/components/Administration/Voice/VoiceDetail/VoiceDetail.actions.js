export function setVoiceDetail(detail) {
    return {
        type: "VOICE_ADMIN_SET_DETAIL",
        payload: detail
    }
}

export function setVoiceTagList(list) {
    return {
        type: "VOICE_ADMIN_SET_VOICE_TAG_LIST",
        payload: list
    }
}

export function setVoiceStatus(status) {
    return {
        type: "VOICE_ADMIN_SET_STATUS",
        payload: status
    }
}

export function loadVoiceTypesList(list){
    return {
        type: "VOICE_ADMIN_LOAD_VOICE_TYPES_LIST",
        payload: list
    }
}

export function setVoiceCouncilList(list) {
    return {
        type: "VOICE_ADMIN_SET_VOICE_COUNCIL_LIST",
        payload: list
    }
}

export function setVoiceCouncil(council) {
    return {
        type: "VOICE_ADMIN_SET_VOICE_COUNCIL",
        payload: council
    }
}

export function setUsersSearchResult(list) {
    return {
        type: "VOICE_ADMIN_SET_USER_SEARCH_RESULT_LIST",
        payload: list
    }
}