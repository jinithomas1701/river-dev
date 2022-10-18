export function fieldChange(fieldName, value) {
    return {
        type: "GROUPS_DETAIL_FIELDS_CHANGE",
        payload: value,
        fieldName: fieldName
    }
}

export function setGroupMembers(value) {
    return {
        type: "GROUPS_DETAIL_SET_GROUP_MEMBERS",
        payload: value
    }
}

export function resetForm() {
    return {
        type: "GROUPS_DETAIL_RESET_FORM",
        payload: ""
    }
}

export function toggleConfirmBox(visible, options = {}) {
    return {
        type: "GROUPS_DETAIL_TOGGLE_CONFIRM_BOX",
        payload: visible,
        options: options
    }
}

export function setUserSearchResult(list) {
    return {
        type: "GROUP_DETAIL_SET_SEARCH_MEMBERS_RESULT",
        payload: list
    }
}

export function setMembersSelectedResult(list) {
    return {
        type: "GROUP_DETAIL_SET_MEMBERS_SELECTED",
        payload: list
    }
}