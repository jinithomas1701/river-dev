const UserDetailsReducer = (state = {
    departmentsList: [],
    designationsList: [],
    locationsList: [],
    rolesList: [],
    projectsList: [],
    employeeTypeList: [],
    userImage: '',
    userDetailsFields :{
        avatar: '',
        currentLocation: '',
        baseLocation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender : '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        degree: '',
        college: '',
        passYear: '',
        experience: '',
        dateofjoin: '',
        projectName: '',
        department: '',
        designation: '',
        email: '',
        password: '',
        empId: '',
        roleId: '',
        roles: [],
        clubId: ''
    }
}, action) => {
    switch (action.type) {
        case "USER_DETAILS_FIELD_CHANGE":
            const fields = state.userDetailsFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                userDetailsFields : fields
            };
            break;
        case "USER_DETAILS_DESIGNATIONS_LIST_CHANGE":
            state = {
                ...state,
                designationsList: action.payload
            };
            break;
        case "USER_DETAILS_DEPARTMENTS_LIST_CHANGE":
            state = {
                ...state,
                departmentsList: action.payload
            };
            break;
        case "USER_DETAILS_LOCATIONS_LIST_CHANGE":
            state = {
                ...state,
                locationsList: action.payload
            };
            break;
        case "USER_DETAILS_PROJECTS_LIST_CHANGE":
            state = {
                ...state,
                projectsList: action.payload
            };
            break;
        case "USER_DETAILS_ROLES_LIST_CHANGE":
            state = {
                ...state,
                rolesList: action.payload
            };
            break;
        case "USER_DETAILS_CLEAR_FORM_FIELDS":
            state = {
                ...state,
                departmentsList: [],
                designationsList: [],
                locationsList: [],
                projectsList: [],
                rolesList: [],
                userImage: '',
                userDetailsFields :{
                    avatar: '',
                    currentLocation: '',
                    baseLocation: '',
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    gender : '',
                    address: '',
                    city: '',
                    state: '',
                    country: '',
                    pincode: '',
                    degree: '',
                    college: '',
                    passYear: '',
                    experience: '',
                    dateofjoin: '',
                    projectName: '',
                    department: '',
                    designation: '',
                    email: '',
                    password: '',
                    empId: '',
                    roleId: '',
                    roles: [],
                    clubId: ''
                }
            };
            break;
        case "USER_DETAILS_LOAD_USER_DETAILS":
            state = {
                ...state,
                userDetailsFields : action.payload
            }
            break;
        case "USER_DETAILS_USER_IMAGE_CHANGE":
            state = {
                ...state,
                userImage : action.payload
            }
            break;
        case "USER_DETAILS_EMPLOYEE_TYPE_CHANGE":
            state = {
                ...state,
                employeeTypeList : action.payload
            }
            break;
    }
    return state;
};

export default UserDetailsReducer;