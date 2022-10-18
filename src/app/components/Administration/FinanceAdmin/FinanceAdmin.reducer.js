const FinanceAdminReducer = (state = {
    locationList: [],
    selectedLocation: null,
    selectedClub: null,
    configYearList: [],
    clubList: [],
    selectedFinancialYear: new Date().getMonth()<=2 ? new Date().getFullYear()-1 : new Date().getFullYear()
}, action) => {
    switch (action.type) {
        case "FINANCE_ADMIN_SET_FINANCE_LOCATION_LIST":
            state = {
                ...state,
                locationList: action.payload
            };
            break;
        case "FINANCE_ADMIN_SET_SELECTED_LOCATION":
            state = {
                ...state,
                selectedLocation: action.payload
            };
            break;
        case "FINANCE_ADMIN_SET_CONFIGURATION_YEARS":
            state = {
                ...state,
                configYearList: action.payload
            };
            break;
        case "FINANCE_ADMIN_SET_SELECTED_FINANCIAL_YEAR":
            state = {
                ...state,
                selectedFinancialYear: action.payload
            };
            break;
        case "FINANCE_ADMIN_SET_LOCATION_CLUB_LIST":
                state = {
                    ...state,
                    clubList: action.payload
                };
                break;
        case "FINANCE_ADMIN_SET_SELECTED_CLUB":
                state = {
                    ...state,
                    selectedClub: action.payload
                };
                break;
        case "FINANCE_ADMIN_RESET":
                state = {
                    ...state,
                    locationList: [],
                    selectedLocation: null,
                    selectedClub: null,
                    configYearList: [],
                    clubList: [],
                    selectedFinancialYear: new Date().getMonth()<=2 ? new Date().getFullYear()-1 : new Date().getFullYear()
                };
                break;
        default:
            break;
    }

    return state;
};

export default FinanceAdminReducer;