import {Util} from "../../Util/util";

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
    const me = Util.getLoggedInUserDetails();
    return {
        type: "FEEDS_PUSH_COMMENT_TO_FEED",
        payload: {
            value: comment,
            feedObj: feedObj,
            me: me
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

export function appendFeeds(feedsList) {
    return {
        type: "FEEDS_APPEND_FEEDS",
        payload: feedsList
    }
}

export function setUpcomingMeetings(meetingsList) {
    return {
        type: "FEEDS_LOAD_UPCOMING_MEETINGS",
        payload: meetingsList
    }
}

export function clearUpcomingMeetings() {
    return {
        type: "FEEDS_CLEAR_UPCOMING_MEETINGS"
    }
}

export function setOngoingPolls(pollsList) {
    return {
        type: "FEEDS_LOAD_ONGOING_POLLS",
        payload: pollsList
    }
}

export function clearOngoingPolls() {
    return {
        type: "FEEDS_CLEAR_ONGOING_POLLS"
    }
}