export function setField(fieldname, payload) {
    return {
        type: "USER_DETAILS_FIELD_CHANGE",
        payload: payload,
        fieldName: fieldname
    }
}

export function setDepartmentsList(list){
    return {
        type: "USER_DETAILS_DEPARTMENTS_LIST_CHANGE",
        payload: list
    }
}

export function setDesignationsList(list){
    return {
        type: "USER_DETAILS_DESIGNATIONS_LIST_CHANGE",
        payload: list
    }
}

export function setLocationsList(list){
    return {
        type: "USER_DETAILS_LOCATIONS_LIST_CHANGE",
        payload: list
    }
}

export function setProjectsList(list){
    return {
        type: "USER_DETAILS_PROJECTS_LIST_CHANGE",
        payload: list
    }
}

export function setRolesList(list){
    return {
        type: "USER_DETAILS_ROLES_LIST_CHANGE",
        payload: list
    }
}

export function clearFormFields(){
    return {
        type: "USER_DETAILS_CLEAR_FORM_FIELDS",
    }
}

export function loadUserDetails(user){
    return {
        type: "USER_DETAILS_LOAD_USER_DETAILS",
        payload: user
    }
}

export function changeUserImage(image){
    return {
        type: "USER_DETAILS_USER_IMAGE_CHANGE",
        payload: image
    }
}

export function changeEmployeeTypeList(employeeTypeList){
    return {
        type: "USER_DETAILS_EMPLOYEE_TYPE_CHANGE",
        payload: employeeTypeList
    }
}