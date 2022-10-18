export function activitiesListChange(activitiesList) {
    return {
        type: "ACTIVITIES_USER_LIST_CHANGE",
        payload: activitiesList
    }
}

export function searchKeyChange(searchKey) {
    return {
        type: "ACTIVITIES_USER_SEARCH_KEY_CHANGE",
        payload: searchKey
    }
}

export function clearActivitiesList() {
    return {
        type: "ACTIVITIES_USER_CLEAR_LIST"
    }
}


export function activitiesListReplace(activitiesList) {
    return {
        type: "ACTIVITIES_USER_LIST_REPLACE",
        payload: activitiesList
    }
}