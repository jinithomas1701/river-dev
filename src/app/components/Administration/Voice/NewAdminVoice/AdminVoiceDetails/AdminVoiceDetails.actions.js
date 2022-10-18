export function setDepartmentDetails(departmentDetails){
    return {
        type: "ADMIN_VOICE_DETAILS_DEPARTMENT_DETAILS_CHANGE",
        payload: departmentDetails
    };
}

export function setMemberList(unAssignedMemberList){
    return {
        type: "ADMIN_VOICE_DETAILS_MEMBERLIST_CHANGE",
        payload: unAssignedMemberList
    };
}