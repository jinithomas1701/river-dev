export function activitiesListPush(activitiesList) {
    return {
        type: "ACTIVITIES_LIST_CHANGE",
        payload: activitiesList
    }
}

export function searchKeyChange(searchKey) {
    return {
        type: "ACTIVITIES_SEARCH_KEY_CHANGE",
        payload: searchKey
    }
}


export function clearActivitiesList() {
    return {
        type: "ACTIVITIES_CLEAR_LIST"
    }
}

export function activitiesListReplace(activitiesList) {
    return {
        type: "ACTIVITIES_LIST_REPLACE",
        payload: activitiesList
    }
}