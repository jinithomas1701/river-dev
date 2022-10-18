const CreateSurveyDialogReducer = (state = {
    chipSearchResult: [],
    detailFormFields : {
        id: "",
        title: "",
        description: "",
        options: [
            {
                id: "",
                value: ""
            }
        ],
        visibility: [],
        includeOthers: false,
        publishResult: true,
        doPublished: false,
        visibleToAll: true,
        endDate: ""
    }
}, action) => {
    switch (action.type) {
        case "CREATE_SURVEY_FORM_FIELD_CHANGE":
            let fields = state.detailFormFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                detailFormFields: fields
            }
            break;
        case "CREATE_SURVEY_ADD_NEW_OPTION_FIELD":
            fields = state.detailFormFields;        
            let optionsList = state.detailFormFields.options;
            optionsList.push({
                id: "",
                value: ""
            });
            fields.options = optionsList;
            state = {
                ...state,
                detailFormFields: fields 
            }
            break;
        case "CREATE_SURVEY_REMOVE_OPTION_AT_INDEX":
            fields = state.detailFormFields;
            fields.options.splice(action.payload, 1);
            state = {
                ...state,
                detailFormFields: fields
            }
            break;
        case "CREATE_SURVEY_CHANGE_OPTION_FIELD_AT_INDEX":
            fields = state.detailFormFields;
            if(fields.options[action.index]){
                fields.options[action.index].value = action.value
            }
            state = {
                ...state,
                detailFormFields: fields
            }
            break;
        case "CREATE_SURVEY_SET_SEARCH_USER_RESULT":
            state = {
                ...state,
                chipSearchResult: action.payload
            };
            break;
        case "CREATE_SURVEY_CLEAR_FIELDS":
            state = {
                chipSearchResult: [],
                detailFormFields : {
                    id: "",
                    title: "",
                    description: "",
                    options: [
                        {
                            id: "",
                            value: ""
                        }
                    ],
                    visibility: [],
                    includeOthers: false,
                    publishResult: false,
                    visibleToAll: true,
                    endDate: ""
                }
            }
            break;
        case "CREATE_SURVEY_LOAD_SURVEY":
            state = {
                ...state,
                detailFormFields: action.payload
            }
            break;
    }
    return state
}

export default CreateSurveyDialogReducer