const PollDetailReducer = (state = {
    pollName: '',
    clubsList: [],
    pollDetailsFields: {
        title :'',
        description: '',
        nominationStartDate: '',
        nominationEndDate: '',
        electionStartDate: '',
        electionEndDate: '',
        nominees: [],
        electionStatus: '',
        winner: [],
        visibility: '',
        totalVotes: ''
    }
}, action) => {
    switch(action.type) {
        case "POLL_DETAIL_FIELD_CHANGE":
            const fields = state.pollDetailsFields;
            fields[action.fieldName] = action.payload;        
            state = {
                ...state,
                pollDetailsFields: fields
            }
        break;
        case "POLL_DETAIL_CLEAR_FIELDS":
            state ={
                pollName: '',
                pollDetailsFields: {
                    title :'',
                    description: '',
                    nominationStartDate: '',
                    nominationEndDate: '',
                    electionStartDate: '',
                    electionEndDate: '',
                    nominees: [],
                    electionStatus: '',
                    winner: [],
                    visibility: ''
                }
            }
        break;
        case "POLL_DETAIL_LOAD_POLL_DETAILS":
            state = {
                ...state,
                pollDetailsFields: action.payload
            }
        break;
        case "POLL_DETAIL_CHANGE_CLUB_LIST":
            
            state = {
                ...state,
                clubsList: action.payload
            }
        break;
    }

    return state;
};

export default PollDetailReducer;