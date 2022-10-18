export function loadCategoryList(list) {
    return {
        type: "ACTIVITY_MASTER_CATEGORY_LIST_LOAD",
        payload: list
    }
}

export function loadCouncilList(list) {
    return {
        type: "ACTIVITY_MASTER_COUNCIL_LIST_LOAD",
        payload: list
    }
}

export function fieldChange(fieldName, value) {
    return {
        fieldName: fieldName,
        type: "ACTIVITY_MASTER_FORM_FIELD_CHANGE",
        payload: value
    }
}

export function clearFields() {
    return {
        type: "ACTIVITY_MASTER_FORM_FIELDS_CLEAR"
    }
}

export function disableCouncilApprove(value) {
    return {
        type: "ACTIVITY_MASTER_COUNCIL_APPROVE_DISABLED",
        payload: value
    }
}