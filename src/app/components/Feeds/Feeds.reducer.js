
const FeedsReducer = (state = {
    statusDialogOpen: false,
    upcomingMeetings: [],
    feedsList: [],
    ongoingPolls: []
}, action) => {
    let feedList = [];
    switch (action.type) {
        case "FEEDS_STATUS_DIALOG_OPEN":
            state = {
                ...state,
                statusDialogOpen: action.payload
            };
            break;
        case "FEEDS_SET_LIST":
            state = {
                ...state,
                feedsList: state.feedsList.concat(action.payload)
            };
            break;
        case "FEEDS_CLEAR_LIST":
            state = {
                ...state,
                feedsList: []
            };
            break;
        case "FEEDS_PUSH_COMMENT_TO_FEED":
            feedList = state.feedsList;
            const userDetails = action.payload.me;
            feedList.forEach((feed) => {
                if (feed.feedId === action.payload.feedObj.feedId) {
                    const commentObj = {
                        value: action.payload.value,
                        postedBy: {
                            avatar: userDetails.avatar,
                            name: userDetails.fullName,
                            username: userDetails.username,
                            userId: userDetails.userId
                        },
                        postedOn: Math.round((new Date()).getTime()),
                    };
                    feed.comments.unshift(commentObj);
                }
            }, this);
            state = {
                ...state,
                feedsList: feedList
            };
            break;
        case "FEEDS_PUSH_MORE_COMMENTS_TO_FEED":
            feedList = state.feedsList;
            feedList.forEach((feed) => {
                if (feed.feedId === action.payload.feedObj.feedId) {
                    feed.comments = feed.comments.concat(action.payload.comments);
                    if (action.payload.comments.length < feed.commentSize) {
                        feed.fullCommentLoaded = true;
                    }
                }
            }, this);
            state = {
                ...state,
                feedsList: feedList
            };
            break;
        case "FEEDS_SET_ACTION":
            feedList = state.feedsList;
            feedList.forEach((feed) => {
                if (feed.feedId === action.payload.feedObj.feedId) {
                    feed.actions.forEach((feedAction, index) => {
                        if (feedAction.type === action.payload.action.type) {
                            feedAction.checked = !action.payload.action.checked;
                            if (feedAction.checked) {
                                feedAction.count++;
                                feedAction.actionBy.unshift(action.payload.actionObj);
                            } else {
                                feedAction.count--;
                                feedAction.actionBy.forEach((user, index) => {
                                    if (user.id == action.payload.actionObj.id){
                                        feedAction.actionBy.splice(index, 1);
                                        return;
                                    }
                                })
                            }
                        }
                    });
                }
            }, this);
            state = {
                ...state,
                feedsList: feedList
            };
            break;
        case "FEEDS_TOGGLE_COMMENT_LOADER":
            feedList = state.feedsList;
            feedList.forEach((feed) => {
                if (feed.feedId === action.payload.feedObj.feedId) {
                    feed.isCommentLoading = action.payload.isLoading;
                }
            }, this);
            state = {
                ...state,
                feedsList: feedList
            };
            break;
        case "FEEDS_DELETE_FEED":
            feedList = state.feedsList;
            feedList.forEach((feed, index) => {
                if (feed.feedId === action.payload) {
                    feedList.splice(index, 1);
                }
            });
            state = {
                ...state,
                feedsList: feedList
            };
            break;
        case "CHANGE_NOTIFICATIONS_PAYLOAD_FOR_FEED":
            feedList = state.feedsList;
            var feedIndex = null;
            feedList.forEach((feed, index) => {
                if (action.payload && feed.feedId === action.payload.feedId) {
                    feedIndex = index;
                }
            });

            feedList.splice(feedIndex, 1);
            feedList.splice(feedIndex, 0, action.payload);
            state = {
                ...state,
                feedsList: feedList
            };
            break;
        case "FEEDS_APPEND_FEEDS":
            state = {
                ...state,
                feedsList: action.payload
            }
            break;
        case "FEEDS_LOAD_UPCOMING_MEETINGS":
            state = {
                ...state,
                upcomingMeetings: action.payload
            }
            break;
        case "FEEDS_CLEAR_UPCOMING_MEETINGS":
            state = {
                ...state,
                upcomingMeetings: []
            }
            break;
        case "FEEDS_LOAD_ONGOING_POLLS":
            state = {
                ...state,
                ongoingPolls: action.payload
            }
            break;
        case "FEEDS_CLEAR_ONGOING_POLLS":
            state = {
                ...state,
                ongoingPolls: []
            }
            break;
    }
    return state;
};

export default FeedsReducer;