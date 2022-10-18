export function resetData(){
    return {
        type: "RESET_DATA",
        payload: []
    }
}

export function storeUserList(userList){
    return {
        type: "USERS_LIST_CHANGE",
        payload: userList
    }
}

export function resetUserList(){
    return {
        type: "USERS_LIST_RESET",
        payload: []
    }
}

export function userListChange(userList) {
    return {
        type: "USERS_LIST_CHANGE",
        payload: userList
    }
}

export function storeClubList(clubList) {
    return {
        type: "USERS_CLUBS_CHANGE",
        payload: clubList
    }
}

export function storeEntityList(entityList) {
    return {
        type: "USERS_ENTITY_CHANGE",
        payload: entityList
    }
}

export function storeLocationList(locationList) {
    return {
        type: "USERS_LOCATION_CHANGE",
        payload: locationList
    }
}