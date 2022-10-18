export function selfAssignChange(value) {
    return {
        type: "ACTIVITY_MASTER_DIALOG_SELF_ASSIGN_CHANGE",
        payload: value
    }
}

export function categoryChange(value) {
    return {
        type: "ACTIVITY_MASTER_DIALOG_CATEGORY_CHANGE",
        payload: value
    }
}

export function subCategoryChange(value) {
    return {
        type: "ACTIVITY_MASTER_DIALOG_SUB_CATEGORY_CHANGE",
        payload: value
    }
}

export function memberPointChange(value) {
    return {
        type: "ACTIVITY_MASTER_DIALOG_MEMBER_POINT_CHANGE",
        payload: value
    }
}

export function clubPointChange(value) {
    return {
        type: "ACTIVITY_MASTER_DIALOG_CLUB_POINT_CHANGE",
        payload: value
    }
}