export function loadPollsList(list) {
    return {
        type: "POLLS_LOAD_POLLS_LIST",
        payload: list
    }
}

export function loadNominationActivePolls(list) {
    return {
        type: "POLLS_LOAD_NOMINATION_ACTIVE_LIST",
        payload: list
    }
}

export function loadElectionActivePolls(list) {
    return {
        type: "POLLS_LOAD_ELECTION_ACTIVE_LIST",
        payload: list
    }
}

export function loadCompletedPolls(list) {
    return {
        type: "POLLS_LOAD_COMPLETED_POLLS_LIST",
        payload: list
    }
}

export function clearPollsList() {
    return {
        type: "POLLS_CLEAR_POLLS_LIST"
    }
}