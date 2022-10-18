const SurveyReducer = (state = {
    activeSurveysList: [],
    mySurveysList: [],
    finishedSurveysList: [],
    survey: {}
}, action) => {
    switch (action.type) {
        case "SURVEY_LOAD_LIST_ACTIVE":
            state = {
                ...state,
                activeSurveysList: action.payload
            }
            break;
        case "SURVEY_LOAD_LIST_MY":
            state = {
                ...state,
                mySurveysList: action.payload
            }
            break;
        case "SURVEY_LOAD_LIST_FINISHED":
            state = {
                ...state,
                finishedSurveysList: action.payload
            }
            break;
    }
    return state
}

export default SurveyReducer;