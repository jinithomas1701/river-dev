export function setLocationList(locationList) {
    return {
        type: "CLUBS_DETAIL_SET_LOCATION_LIST",
        payload: locationList
    }
}

export function fieldChange(fieldName, value) {
    return {
        type: "CLUBS_DETAIL_FIELDS_CHANGE",
        payload: value,
        fieldName: fieldName
    }
}

export function setNonClubMembers(value) {
    return {
        type: "CLUBS_DETAIL_SET_NONCLUB_MEMBERS",
        payload: value
    }
}

export function setClubMembers(value) {
    return {
        type: "CLUBS_DETAIL_SET_CLUB_MEMBERS",
        payload: value
    }
}

export function resetForm() {
    return {
        type: "CLUBS_DETAIL_RESET_FORM",
        payload: ""
    }
}

export function toggleConfirmBox(visible, options = {}) {
    return {
        type: "CLUBS_DETAIL_TOGGLE_CONFIRM_BOX",
        payload: visible,
        options: options
    }
}

export function setClubRoles(list) {
    return {
        type: "CLUBS_DETAIL_SET_CLUB_ROLES",
        payload: list
    }
}

export function changeClubImage(image){
    return {
        type: "CLUBS_DETAIL_CLUB_IMAGE_CHANGE",
        payload: image
    }
}