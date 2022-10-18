const AdminVoiceDetailsReducer = (state = {
    departmentDetails: null,
    unAssignedMemberList: []
}, action) => {
    switch(action.type) {
        case "ADMIN_VOICE_DETAILS_DEPARTMENT_DETAILS_CHANGE":
        state = {
            ...state,
            departmentDetails: action.payload
        };
        break;
        case "ADMIN_VOICE_DETAILS_MEMBERLIST_CHANGE":
        state = {
            ...state,
            unAssignedMemberList: action.payload
        };
        break;
        default:
        break;
    }
    return state;
};

export default AdminVoiceDetailsReducer;