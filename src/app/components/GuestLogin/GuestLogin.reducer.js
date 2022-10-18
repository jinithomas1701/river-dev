const GuestLoginReducer = (state = {
    username: "",
    password: "",
    otp: ""
}, action) => {
    switch (action.type) {
        case "GUEST_LOGIN_USERNAME_CHANGE":
            state = {
                ...state,
                username: action.payload
            };
            break;
        case "GUEST_LOGIN_PASSWORD_CHANGE":
            state = {
                ...state,
                password: action.payload
            };
            break;
        case "ENTER_GUEST_LOGIN_OTP":
            state = {
                ...state,
                otp: action.payload
            };
            break;
    }
    return state;
};

export default GuestLoginReducer;