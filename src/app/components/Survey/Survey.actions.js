export function loadSurveyList(surveysType, surveyList) {
    return {
        type: "SURVEY_LOAD_LIST_" + surveysType.toUpperCase(),
        payload: surveyList
    }
}