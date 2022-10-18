export function fieldChange(fieldName, value) {
    return {
        type: "VOICE_DETAIL_FIELDS_CHANGE",
        payload: value,
        fieldName: fieldName
    }
}

export function setVoiceUserTagSearchResult(result) {
    return {
        type: "VOICE_DETAIL_SET_SEARCH_VOICE_USER_TAG_RESULT",
        payload: result
    }
}

export function setVoiceUserTagsSelectedResult(result) {
    return {
        type: "VOICE_DETAIL_SET_SELECTED_VOICE_USER_TAGS_RESULT",
        payload: result
    }
}

export function removeAttachment(index, isRefine) {
    return {
        type: "VOICE_DETAIL_REMOVE_ATTACHMENT",
        payload: index,
        isRefine: isRefine
    }
}

export function removeRefineAttachment(index) {
    return {
        type: "VOICE_DETAIL_REMOVE__REFINE_ATTACHMENT",
        payload: index
    }
}

export function setAttachements(list, isRefine){
    return {
        type: "VOICE_DETAIL_SET_ATTACHMENT_LIST",
        payload: list,
        isRefine: isRefine
    }
}

export function setRefineAttachements(list){
    return {
        type: "VOICE_DETAIL_SET_REFINE_ATTACHMENT_LIST",
        payload: list
    }
}

export function loadVoiceTypesList(list){
    return {
        type: "VOICE_DETAIL_LOAD_VOICE_TYPES_LIST",
        payload: list
    }
}

export function loadVoiceCouncilsList(list){
    return {
        type: "VOICE_DETAIL_LOAD_VOICE_COUNCILS_LIST",
        payload: list
    }
}

export function changeSelectedCouncilValue(value) {
    return {
        type: "VOICE_DETAIL_SELECTED_COUNCIL_VALUE_CHANGE",
        payload: value
    }
}

export function pushAttachement(image, isRefine){
    return {
        type: "VOICE_DETAIL_ATTACHEMENT_PUSH",
        payload: image,
        isRefine: isRefine
    }
}

export function changeLoadedVoiceDetails(voice){
    return {
        type: "VOICE_DETAIL_DETAILS_CHANGE",
        payload: voice
    }
}

export function clearFields(){
    return {
        type: "VOICE_DETAIL_CLEAR_FORM_FIELDS"
    }
}