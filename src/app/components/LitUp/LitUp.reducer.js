const LitUpReducer = (state = {
    litUpTopicsList: [],
    adminsChipsResult: [],
    selectedAdminsChips: [],
    votersChipsResult: [],
    selectedVotersChips: [],
    ideaTopicDetails: null,
    myVote:{},
    allVotes:{}
}, action) => {
    switch (action.type) {
        case "LITUP_SET_TOPICS_LIST":
            state = {
                ...state,
                litUpTopicsList: action.payload
            }
            break;
        case "LITUP_SET_TOPIC_DETAILS":
            state = {
                ...state,
                ideaTopicDetails: action.payload
            }
            break;
        case "LITUP_SET_SEARCH_ADMINS_RESULT":
            state = {
                ...state,
                adminsChipsResult: action.payload
            };
            break;
        case "LITUP_SET_SEARCH_VOTERS_RESULT":
            state = {
                ...state,
                votersChipsResult: action.payload
            };
            break;
        case "LITUP_SET_SELECTED_ADMINS_RESULT":
            state = {
                ...state,
                selectedAdminsChips: action.payload
            };
            break;
        case "LITUP_SET_SELECTED_VOTERS_RESULT":
            state = {
                ...state,
                selectedVotersChips: action.payload
            };
            break;
        case "LITUP_CLEAR_PANEL_DETAILS":
            state = {
                ...state,
                selectedAdminsChips: [],
                selectedVotersChips: []
            }
            break;
        case "LITUP_VOTE_DATA":
            if(action.voteType=='all'){
                state={
                    ...state,
                    allVotes:action.payload
                }
            }else{
                state={
                    ...state,
                    myVote:action.payload
                }
            }
            break;
    }
    return state
}

export default LitUpReducer;