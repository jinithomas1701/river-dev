export function setLitUpTopics(topicsList) {
    return {
        type: "LITUP_SET_TOPICS_LIST",
        payload: topicsList
    }
}

export function setLitUpTopicDetails(details) {
    return {
        type: "LITUP_SET_TOPIC_DETAILS",
        payload: details
    }
}

export function setUserSearchResult(searchResult, scope) {
    return {
        type: "LITUP_SET_SEARCH_" + scope +"_RESULT",
        payload: searchResult
    }
}

export function setUserSelectedResult(result, scope) {
    return {
        type: "LITUP_SET_SELECTED_" + scope +"_RESULT",
        payload: result
    }
}

export function clearPanelData() {
    return {
        type: "LITUP_CLEAR_PANEL_DETAILS"
    }
}

export function setVoteData(voteType,data) {
    return {
        type: "LITUP_VOTE_DATA",
        voteType,
        payload: data
    }
}
