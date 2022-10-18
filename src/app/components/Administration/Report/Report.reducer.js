const ReportReducer = (state = {
    reportFields: {
        fromDate: "",
        toDate: "",
        clubId: "",
        month: "",
        year: ""
    },
    selectedUrl: "",
    selectedReport: null,
    clubList: []
}, action) => {
    switch (action.type) {
        case "REPORT_CHANGE_FIELD_NAME":
            const fields = state.reportFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                reportFields: fields
            };
        break;
        case "REPORT_SET_REPORT":
            state = {
                ...state,
                selectedReport: action.payload
            };
        break;
        case "REPORT_SET_CLUB_LIST":
            state = {
                ...state,
                clubList: action.payload
            };
        break;
        case "REPORT_CLEAR_FIELDS":
            state = {
                ...state,
                reportFields: {
                    fromDate: "",
                    toDate: "",
                    clubId: "",
                    month: "",
                    year: ""
                }
            };
        break;
    }
    return state;
};

export default ReportReducer;