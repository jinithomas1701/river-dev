export function loadUserCuds(list) {
    return {
        type: "USER_CUD_LOAD_CUD_LIST",
        payload: list
    }
}

export function fieldChange(field, value){
    return {
        type: "USER_CUD_CHANGE_FIELD_VALUE",
        payload: value,
        fieldName: field
    }
}

export function clearCudFields() {
    return {
        type: "USER_CUD_CLEAR_FIELDS"
    }
}

export function loadCouncils(list) {
    return {
        type: "USER_CUD_LOAD_COUNCIL_LIST",
        payload: list
    }
}

export function pushUserCuds(list) {
    return {
        type: "USER_CUD_PUSH_CUD_LIST",
        payload: list
    }
}

export function loadCud(cud) {
    return {
        type: "USER_CUD_PUSH_CUD_FIELDS",
        payload: cud
    }
}