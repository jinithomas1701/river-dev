const UserPollsReducer = (state = {
    pollsList: [],
    onNominationPolls: [],
    onElectionPolls: [],
    completedPolls: []
}, action) => {
    switch (action.type) {
        case "POLLS_LOAD_POLLS_LIST":
            state = {
                ...state,
                pollsList: action.payload
            }
            break;
        case "POLLS_LOAD_NOMINATION_ACTIVE_LIST":
            state = {
                ...state,
                onNominationPolls: action.payload
            }
            break;
        case "POLLS_LOAD_ELECTION_ACTIVE_LIST":
            state = {
                ...state,
                onElectionPolls: action.payload
            }
            break;
        case "POLLS_LOAD_COMPLETED_POLLS_LIST":
            state = {
                ...state,
                completedPolls: action.payload
            }
            break;
        case "POLLS_CLEAR_POLLS_LIST":
            state = {
                ...state,
                pollsList: []
            }
            break;
    }
    return state;
}

export default UserPollsReducer;