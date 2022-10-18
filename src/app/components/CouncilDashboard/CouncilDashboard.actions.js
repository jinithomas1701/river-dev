export function loadActivitiesList(list) {
    return {
        type: "COUNCIL_DASHBOARD_LOAD_ACTIVITIES",
        payload: list
    }
}

export function loadVoicesList(list) {
    return {
        type: "COUNCIL_DASHBOARD_LOAD_VOICES",
        payload: list
    }
}

export function loadCudsList(list) {
    return {
        type: "COUNCIL_DASHBOARD_LOAD_CUDS",
        payload: list
    }
}