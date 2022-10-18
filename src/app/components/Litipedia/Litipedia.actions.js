export function loadAllTerms(list) {
    return {
        type: "LITIPEDIA_LOAD_TERMS_LIST",
        payload: list
    }
}

export function pushMoreTerms(list) {
    return {
        type: "LITIPEDIA_PUSH_TO_TERMS_LIST",
        payload: list
    }
}

export function loadRecentTerms(list) {
    return {
        type: "LITIPEDIA_LOAD_RECENT_TERMS_LIST",
        payload: list
    }    
}

export function loadMostViewedTerms(list) {
    return {
        type: "LITIPEDIA_LOAD_MOST_VIEWED_TERMS_LIST",
        payload: list
    }
}