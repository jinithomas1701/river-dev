export function fieldChange(fieldName, value) {
    return {
        fieldName: fieldName,
        type: "CREATE_SURVEY_FORM_FIELD_CHANGE",
        payload: value
    }
}

export function addNewOptionField() {
    return {
        type: "CREATE_SURVEY_ADD_NEW_OPTION_FIELD"
    }
}

export function removeOption(optionIndex) {
    return {
        type: "CREATE_SURVEY_REMOVE_OPTION_AT_INDEX",
        payload: optionIndex 
    }
}

export function changeOption(index, value) {
    return {
        type: "CREATE_SURVEY_CHANGE_OPTION_FIELD_AT_INDEX",
        index: index,
        value: value
    }
}

export function setUsersSelectedResult(result) {
    return {
        type: "CREATE_SURVEY_SET_SELECTED_USER_RESULT",
        payload: result
    }
}

export function setUserSearchResult(result) {
    return {
        type: "CREATE_SURVEY_SET_SEARCH_USER_RESULT",
        payload: result
    }
}

export function clearField() {
    return {
        type: "CREATE_SURVEY_CLEAR_FIELDS"
    }
}

export function loadSurvey(survey) {
    return{
        type: "CREATE_SURVEY_LOAD_SURVEY",
        payload: survey
    }
}