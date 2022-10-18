export function setDetailDialogVisibility(visibile) {
    return {
        type: "ACTIVITY_MASTER_DETAIL_DIALOG_OPEN",
        payload: visibile
    }
}

export function loadActivityMasterList(list) {
    return {
        type: "LOAD_ACTIVITY_MASTER_LIST",
        payload: list
    }
}