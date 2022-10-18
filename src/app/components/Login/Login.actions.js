export function setUsername(username) {
    return {
        type: "LOGIN_USERNAME_CHANGE",
        payload: username
    }
}

export function setPassword(password) {
    return {
        type: "LOGIN_PASSWORD_CHANGE",
        payload: password
    }
}

export function enterOtp(otp) {
    return {
        type: "ENTER_LOGIN_OTP",
        payload: otp
    }
}