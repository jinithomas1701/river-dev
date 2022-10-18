export function loadDiscussion(discussion) {
    return {
        type: "MY_CLUB_LOAD_DISCUSSION",
        payload: discussion
    }
}

export function clearDiscussions() {
    return {
        type: "MY_CLUB_CLEAR_DISCUSSION"
    }
}