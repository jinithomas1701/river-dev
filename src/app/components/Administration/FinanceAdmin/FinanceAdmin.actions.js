export function setLocationList(locationList) {
    return {
        type: "FINANCE_ADMIN_SET_FINANCE_LOCATION_LIST",
        payload: locationList
    };
}

export function setSelectedLocation(location) {
    return {
        type: "FINANCE_ADMIN_SET_SELECTED_LOCATION",
        payload: location
    };
}

export function setConfigYears(years) {
    return {
        type: "FINANCE_ADMIN_SET_CONFIGURATION_YEARS",
        payload: years
    };
}

export function setSelectedFinancialYear(year) {
    return {
        type: "FINANCE_ADMIN_SET_SELECTED_FINANCIAL_YEAR",
        payload: year
    };
}

export function setLocationClubList(clubList) {
    return {
        type: "FINANCE_ADMIN_SET_LOCATION_CLUB_LIST",
        payload: clubList
    };
}

export function setSelectedClub(club) {
    return {
        type: "FINANCE_ADMIN_SET_SELECTED_CLUB",
        payload: club
    };
}