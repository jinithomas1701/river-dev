export function fieldChange(fieldName, value) {
    return {
        type: "STATUS_FIELDS_CHANGE",
        payload: value,
        fieldName: fieldName
    }
}

export function addAttachment(attachmentFiles) {
    return {
        type: "STATUS_ADD_ATTACHMENT",
        payload: attachmentFiles
    }
}

export function setVisibilityList(list) {
    return {
        type: "STATUS_SET_VISIBILITY_LIST",
        payload: list
    }
}

export function setVisibilityValue(value) {
    return {
        type: "STATUS_SET_VISIBILITY_VALUE",
        payload: value
    }
}


export function addImage(imageFile) {
    return {
        type: "STATUS_ADD_IMAGE",
        payload: imageFile
    }
}

export function clearAll() {
    return {
        type: "STATUS_CLEAR_ALL",
        payload: null
    }
}

export function removeAttachment(index) {
    return {
        type: "STATUS_REMOVE_ATTACHMENT",
        payload: index
    }
}
