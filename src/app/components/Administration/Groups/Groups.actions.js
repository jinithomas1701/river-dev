export function searchKeyChange(searchKey) {
    return {
        type: "GROUPS_SEARCH_KEY_CHANGE",
        payload: searchKey
    }
}

export function groupListChange(groupList) {
    return {
        type: "GROUPS_LIST_CHANGE",
        payload: groupList
    }
}