export function searchKeyChange(searchKey) {
    return {
        type: "CLUBS_SEARCH_KEY_CHANGE",
        payload: searchKey
    }
}

export function clubListChange(clubList) {
    return {
        type: "CLUBS_LIST_CHANGE",
        payload: clubList
    }
}