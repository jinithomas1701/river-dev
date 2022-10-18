const LoginReducer = (state = {
    username: "",
    password: "",
    otp: ""
}, action) => {
    switch (action.type) {
        case "LOGIN_USERNAME_CHANGE":
            state = {
                ...state,
                username: action.payload
            };
            break;
        case "LOGIN_PASSWORD_CHANGE":
            state = {
                ...state,
                password: action.payload
            };
            break;
        case "ENTER_LOGIN_OTP":
            state = {
                ...state,
                otp: action.payload
            };
            break;
    }
    return state;
};

export default LoginReducer;