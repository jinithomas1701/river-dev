const PollsReducer = ( state ={
    pollsList: []
}, action ) => {
    switch (action.type) {
        case "POLLS_LIST_STORE":
            state = {
                ...state,
                pollsList: action.payload
            }
            break;
    }
    return state;
}

export default PollsReducer;