const LitipediaReducer = (
    state = {
        termsList: '',
        recentTerms: [],
        mostViewedTerms: []
    },
    action
) => {
    switch (action.type) {
        case "LITIPEDIA_LOAD_TERMS_LIST":
            state = {
                ...state,
                termsList: action.payload
            }
            break;
        case "LITIPEDIA_PUSH_TO_TERMS_LIST":
            state = {
                ...state,
                termsList: [...state.termsList, ...action.payload]
            }
            break;
        case "LITIPEDIA_LOAD_RECENT_TERMS_LIST":
            state ={
                ...state,
                recentTerms: action.payload
            }
            break;
        case "LITIPEDIA_LOAD_MOST_VIEWED_TERMS_LIST":
            state = {
                ...state,
                mostViewedTerms: action.payload
            }
            break;
    }

    return state;
};

export default LitipediaReducer;