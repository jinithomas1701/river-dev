export function setUsername(username) {
    return {
        type: "GUEST_LOGIN_USERNAME_CHANGE",
        payload: username
    }
}

export function setPassword(password) {
    return {
        type: "GUEST_LOGIN_PASSWORD_CHANGE",
        payload: password
    }
}

export function enterOtp(otp) {
    return {
        type: "ENTER_GUEST_LOGIN_OTP",
        payload: otp
    }
}