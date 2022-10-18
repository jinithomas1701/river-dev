export function setStatusDialogVisibility(visibile) {
    return {
        type: "FEEDS_STATUS_DIALOG_OPEN",
        payload: visibile
    }
}

export function setFeedsList(feeds) {
    return {
        type: "FEEDS_SET_LIST",
        payload: feeds
    }
}

export function clearFeedsList(feeds) {
    return {
        type: "FEEDS_CLEAR_LIST",
        payload: feeds
    }
}

export function pushCommentToFeed(comment, feedObj) {
    return {
        type: "FEEDS_PUSH_COMMENT_TO_FEED",
        payload: {
            value: comment,
            feedObj: feedObj
        }
    }
}

export function pushMoreComments(comments, feedObj) {
    return {
        type: "FEEDS_PUSH_MORE_COMMENTS_TO_FEED",
        payload: {
            comments: comments,
            feedObj: feedObj
        }
    }
}

export function setAction(action, feedObj, actionObj) {
    return {
        type: "FEEDS_SET_ACTION",
        payload: {
            action: action,
            feedObj: feedObj,
            actionObj: actionObj
        }
    }
}

export function toggleLoadCommentLoader(feedObj,isLoading = false) {
    return {
        type: "FEEDS_TOGGLE_COMMENT_LOADER",
        payload: {
            feedObj:feedObj,
            isLoading:isLoading
        }
    }
}

export function deleteFeed(feedId) {
    return {
        type: "FEEDS_DELETE_FEED",
        payload: feedId
    }
}