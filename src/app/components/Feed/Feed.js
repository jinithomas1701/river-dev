import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import { CircularProgress } from 'material-ui/Progress';

import { Root } from "../Layout/Root";
import { SearchWidget } from "../Common/SearchWidget/SearchWidget";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { Toast, riverToast } from '../Common/Toast/Toast';
import { MyUserCardWidget } from './MyUserCardWidget/MyUserCardWidget';
import FeedElement from "./FeedElement/FeedElement";
import StatusDialog from "./StatusDialog/StatusDialog";
import ActionsDialog from "./ActionsDialog/ActionsDialog";
import ImageDialog from "../Common/ImageDialog/ImageDialog";
import {Util} from "../../Util/util";
import store from "../../Util/store";
import { CommonService } from "../Layout/Common.service";
import {FeedsService} from "./Feed.service";
import {
    setStatusDialogVisibility, 
    setFeedsList, 
    clearFeedsList,
    pushCommentToFeed, 
    pushMoreComments, 
    toggleLoadCommentLoader, 
    setAction,
    deleteFeed
} from "./Feed.actions";

import "./Feed.scss";

const mapStateToProps = (state) => {
    return {
        feeds: state.FeedsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        feedsOpen: (visible) => {
            dispatch(setStatusDialogVisibility(visible));
        },
        setFeedsList: (feeds) => {
            dispatch(setFeedsList(feeds));
        },
        clearFeedsList: () => {
            dispatch(clearFeedsList());
        },
        pushCommentToFeed: (comment, feedObj) => {
            dispatch(pushCommentToFeed(comment, feedObj));
        },
        pushMoreComments: (comments, feedObj) => {
            dispatch(pushMoreComments(comments, feedObj));
        },
        setAction: (action, feedObj, actionObj) => {
            dispatch(setAction(action, feedObj, actionObj));
        },
        toggleLoadCommentLoader: (isLoading, feedObj) => {
            dispatch(toggleLoadCommentLoader(feedObj, isLoading));
        },
        deleteFeed: (feedId) => {
            dispatch(deleteFeed(feedId));
        }
    }
};

const PRIVILEGE_CREATE_STATUS = "CREATE_STATUS";

class Feed extends React.Component {
    feedPerPage = 5;
    pageNumber = 0;
    commentSkipCount = 0;
    commentSize = 5;
    feedId = "";
    isReachedBottom = false;
    state = {
        feedLoader: false,
        actionsListDialogState: false,
        actionsList: [],
        imageDialog: false,
        imageSrc: ""
    }

    componentDidMount() {
        this.props.clearFeedsList();
        this.feedId = this.props.match.params.feedId;
        if (this.feedId) {
            this.getSingleFeedDetail(this.feedId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.feedId != this.props.match.params.feedId) {
            this.feedId = nextProps.match.params.feedId;
            this.props.clearFeedsList();
            this.getSingleFeedDetail(this.feedId);
        }
    }

    render() {
        const feedList = this.props.feeds.feedsList.map((feed, index) => {
            return <FeedElement
                key={index}
                feedData={feed}
                onComment={this.handleOnComment.bind(this)}
                onLoadMoreComments={this.handleOnLoadMoreCmments.bind(this)}
                onActionClick={this.onActionClick.bind(this)}
                onActionsListClick={(likes) => this.onActionsListDialogTrigger.bind(this, likes)}
                onDeleteFeed={this.onDeleteFeeds.bind(this)}
                onImageClick={this.onImageClick.bind(this)}/>
        });
        return (
			<Root role="user">
				<MainContainer>
                    <div className="row feeds">
                        <div className="col-md-8 feed-container">
                            <div className="feed-wrapper">
                                {feedList.length <= 0 && 
                                    <div className="empty-content-container">Feed not found</div>
                                }
                                {feedList}
                                <div className="feed-action-container">
                                    <Button color="primary" onClick={this.gotoAllFeeds.bind(this)}>VIEW ALL FEEDS</Button>
                                </div>
                                {this.state.feedLoader &&
                                    <div className="feed-loader-container">
                                        <CircularProgress size={28}/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-4">
                                <MyUserCardWidget />
                        </div>
                    </div>
                </MainContainer>
                {/* <StatusDialog open={this.props.feeds.statusDialogOpen} onRequestClose={this.handleStatusDialogVisibility.bind(this)}/> */}
                <ActionsDialog
                    open={this.state.actionsListDialogState}
                    actionsList={this.state.actionsList}
                    onRequestCloseActionsList={this.onActionListDialogueClose.bind(this)}/>
                <ImageDialog
                    open={this.state.imageDialog}
                    imageSrc={this.state.imageSrc}
                    onRequestCloseImageDialog={this.handleCloseImageDialog.bind(this)}/>
			</Root>
        );
    }

    pageRecall() {
        this.pageNumber = 0;
        this.props.clearFeedsList();
        this.getFeeds(this.pageNumber, this.feedPerPage);
    }

    gotoAllFeeds() {
        // this.props.history.push("/dashboard");
        window.location.href = "#/dashboard";
    }

    handleStatusDialogVisibility(visible = false, statusPosted = false) {
        this.props.feedsOpen(visible);
        if (statusPosted) {
            this.pageRecall();
        }
    }

    handleCloseImageDialog() {
        this.setState({ imageDialog: false });
        this.setState({ imageSrc: "" });
    }

    onImageClick(imageSrc){
        this.setState({ imageDialog: true });
        this.setState({ imageSrc: imageSrc });
    }

    onActionsListDialogTrigger(actionsList){
        this.setState({ actionsList: actionsList });
        this.setState({ actionsListDialogState: true });        
    }

    onActionListDialogueClose(){
        this.setState({actionsListDialogState: false});
        this.setState({ actionsList: [] });        
    }

    onActionClick(action, feedObj) {
        if (action) {
            const actionRequest = {
                "action" : action.type,
                "commentId" : feedObj.commentId
            };
            FeedsService.updateAction(actionRequest)
                .then(data => {
                    const me = Util.getLoggedInUserDetails();
                    const actionObj = {
                            id: me.userId,
                            username: me.username,
                            fullname: me.fullName,
                            email: me.email,
                            avatar: me.avatar,
                            type: "USER"
                        }
                    this.props.setAction(action, feedObj, actionObj);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        }
    }

    onDeleteFeeds(feedId) {
        if(window.confirm("Are you sure to delete this feed")){
            FeedsService.deleteFeed(feedId)
            .then((data) => {
                this.processDeleteFeed(feedId);
            })
            .catch((error) => {
                riverToast.show("Something went wrong while deleting feeds");
            });
        }
    }

    processDeleteFeed(feedId){
        this.props.deleteFeed(feedId);
        riverToast.show("Feed deleted successfully");
    }

    handleOnLoadMoreCmments(feedObj) {
        if (feedObj && feedObj.commentId) {
            this.props.toggleLoadCommentLoader(true, feedObj);
            this.commentSkipCount = feedObj.comments.length;
            FeedsService.loadMoreComments(feedObj.commentId, this.commentSkipCount, this.commentSize)
                .then(comments => {
                    this.props.toggleLoadCommentLoader(false, feedObj);
                    this.props.pushMoreComments(comments, feedObj);
                })
                .catch(error => {
                    this.props.toggleLoadCommentLoader(false, feedObj);
                    riverToast.show(error.status_message);
                });

        }
    }

    processOnCommenteResponse(comment, feedObj) {
        this.props.pushCommentToFeed(comment, feedObj);
    }

    handleOnComment(comment, feedObj) {
        if (comment.trim()) {
            const commentRequest = {
                value: comment,
                commentId: feedObj.commentId
            };
            FeedsService.postComment(commentRequest)
                .then(data => {
                    this.processOnCommenteResponse(comment, feedObj);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        }
    }

    getFeedObj(feedApiObj) {
        let feedObj = {
            feedId: feedApiObj.feedId,
            title: feedApiObj.title,
            content: feedApiObj.content,
            contentImage: (feedApiObj.images && feedApiObj.images[0]) ? Util.getFullImageUrl(feedApiObj.images[0], false) : null,
            postedBy: {
                name: feedApiObj.postedBy.name,
                image: feedApiObj.postedBy.avatar ? Util.getFullImageUrl(feedApiObj.postedBy.avatar) : "../../../../../resources/images/img/user-avatar.png",
                userId: feedApiObj.postedBy.userId 
            },
            fullCommentLoaded: false,
            commentSize: this.commentSize,
            commentId: feedApiObj.commentId,
            type: feedApiObj.type,
            isCommentLoading: false,
            postedOn: feedApiObj.postedOn,
            attachmentFiles : [],
            actions: feedApiObj.actions,
            commentsCount: feedApiObj.commentsCount,
            comments: feedApiObj.comments,
            visibility: feedApiObj.visibility,
            link: feedApiObj.link,
            crtdBfr: feedApiObj.crtdBfr
        }

        return feedObj;
    }

    processFeedsResponse(feed) {
        this.props.setFeedsList([this.getFeedObj(feed)]);
    }

    getSingleFeedDetail(feedId) {
        if (feedId) {
            this.setState({feedLoader: true});
            FeedsService.getFeed(feedId)
                .then(data => {
                    this.setState({feedLoader: false});
                    if(data){
                        this.processFeedsResponse(data);
                    }
                })
                .catch(error => {
                    this.setState({feedLoader: false});
                    riverToast.show(error.status_message || "Something went wring while fetching feed");
                })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);