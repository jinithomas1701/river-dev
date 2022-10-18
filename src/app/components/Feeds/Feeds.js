import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { connect } from "react-redux";
import { CircularProgress } from 'material-ui/Progress';

import { Root } from "../Layout/Root";
import { SearchWidget } from "../Common/SearchWidget/SearchWidget";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { Toast, riverToast } from '../Common/Toast/Toast';
import { MyUserCardWidget } from './MyUserCardWidget/MyUserCardWidget';
import UpcomingMeetingWidget from './UpcomingMeetingWidget/UpcomingMeetingWidget';
import OngoingPollWidget from './OngoingPollWidget/OngoingPollWidget';
import MyClubWidget from './MyClubWidget/MyClubWidget';
import FeedElement from "./FeedElement/FeedElement";
import StatusDialog from "./StatusDialog/StatusDialog";
import ActionsDialog from "./ActionsDialog/ActionsDialog";
import ImageDialog from "./ImageDialog/ImageDialog";
import { Util } from "../../Util/util";
import { FeedsService } from "./Feeds.service";
import {
    setStatusDialogVisibility,
    setFeedsList,
    clearFeedsList,
    pushCommentToFeed,
    pushMoreComments,
    toggleLoadCommentLoader,
    setAction,
    deleteFeed,
    appendFeeds,
    setUpcomingMeetings,
    clearUpcomingMeetings,
    setOngoingPolls,
    clearOngoingPolls
} from "./Feeds.actions";
import {ActivityDetailDialog} from "../Activities/ActivityDetailDialog/ActivityDetailDialog";

import "./Feeds.scss";
import SurveyBanner from "./SurveyBanner/SurveyBanner";
import { ActivitiesUserService } from "../Activities/ActivitiesUser.service";
import { activitiesListChange, clearActivitiesList, activitiesListReplace } from "../Activities/ActivitiesUser.action";

const mapStateToProps = (state) => {
    return {
        feeds: state.FeedsReducer,
        activities: state.ActivitiesUserReducer
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
        },
        appendFeeds: (feedsList) => {
            dispatch(appendFeeds(feedsList));
        },
        setUpcomingMeetings: (meetingsList) => {
            dispatch(setUpcomingMeetings(meetingsList));
        },
        clearUpcomingMeetings: () => {
            dispatch(clearUpcomingMeetings());
        },
        setOngoingPolls: (pollsList) => {
            dispatch(setOngoingPolls(pollsList));
        },
        clearOngoingPolls: () => {
            dispatch(clearOngoingPolls());
        },
        activitiesListReplace: (list) => {
            dispatch(activitiesListReplace(list));
        }
    }
};

const PRIVILEGE_CREATE_STATUS = "CREATE_STATUS";
const PRIVILEGE_VIEW_FEED = "VIEW_FEED";
const PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD = "VIEW_CLUB_PRESIDENT_DASHBOARD";
const PRIVILEGE_VIEW_COUNCIL_DASHBOARD = "VIEW_COUNCIL_DASHBOARD";
const PRIVILEGE_VIEW_CEO_DASHBOARD = "VIEW_CEO_DASHBOARD";

class Feeds extends React.Component {
    feedPerPage = 5;
    pageNumber = 0;
    commentSkipCount = 0;
    commentSize = 5;
    feedId = "";
    isReachedBottom = false;
    scrollTime = 0;
    state = {
        feedLoader: false,
        actionsListDialogState: false,
        actionsList: [],
        imageDialog: false,
        imageSrc: "",
        showRandomSurvey: false,
        randomSurvey: "",
        refreshIntervalId: "",
        upcomingMeetings: "",
        activityDetails: '',
        activityDetailModal: false
    }

    myClubDetails = Util.getMyClubDetails();
    refreshIntervalId = "";

    componentDidMount() {
        this.props.clearFeedsList();
        this.getFeeds(this.pageNumber, this.feedPerPage);
        this.getRandomSurvey();
        this.getUpcomingMeetings();
        this.getOngoingPolls();
        this.getActivities();
        window.addEventListener('scroll', this.handleScroll);
        this.refreshIntervalId = setInterval(this.onRefreshFeeds.bind(this), 1000 * 60 * 7);
    }
    
    handleScroll = (event) => {
        if (window.location.hash === "#/dashboard") {
            /**
             * @description load feed only if user scroll interval is greater than 200ms.
             */
            const scrollTime = event.timeStamp;
            const canloadMoreFeeds = (scrollTime - this.scrollTime) > 300;
            this.scrollTime = scrollTime;

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                if (!this.isReachedBottom && !this.props.match.params.feedId && this.props.feeds.feedsList.length > 0 && canloadMoreFeeds) {
                    this.pageNumber++;
                    this.getFeeds(this.pageNumber, this.feedPerPage);
                }
            }
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        if (this.refreshIntervalId) clearInterval(this.refreshIntervalId);
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
                onImageClick={this.onImageClick.bind(this)} />
        });

        
        const upcomingMeetings = this.props.feeds.upcomingMeetings.map((meeting, index) => {

            return <UpcomingMeetingWidget
                key={index}
                meeting={meeting}
            />

        });

        const ongoingPolls = this.props.feeds.ongoingPolls.map((poll, index) => {
            if (poll.electionStatus == "Election is active" || poll.electionStatus == "Nomination is active") {
                return <OngoingPollWidget
                    key={index}
                    poll={poll}
                />
            }
            return false;
        });

        const activitiesList = this.props.activities.activitiesList.map((item, index) => {
            return  <div className="master-activity-feed-tile" key={index} onClick={this.onActivityClick.bind(this,item)}>
                        <div className="title">{item.title}</div>
                        {/* {
                            item.council &&
                                <div className="council">Council: {item.council.name}</div>
                        } */}
                    </div>
        })
        return (
            <Root role="user">
                <MainContainer>
                    {
                        Util.hasPrivilage(PRIVILEGE_VIEW_FEED) ?
                            <div className="row feeds">
                                
                                <div className="col-md-8 feed-container">
                                    {
                                        (this.state.randomSurvey) &&
                                            <SurveyBanner
                                                survey={this.state.randomSurvey}
                                                viewSurveyCallback={this.routeToSurvey.bind(this)}
                                                castOptionCallback={this.castOption.bind(this)}
                                                closeBannerCallback={this.closeBanner.bind(this)}
                                            />
                                    }
                                    {
                                        Util.getLoggedInUserDetails().needToResetPassword &&
                                            <div className="change-pass-banner">
                                                You haven't changed the default password so needs OTP for each login. <span className="link" onClick={(e) => {this.props.history.push('/myProfile/2')}}>Change Password here</span>. 
                                            </div>
                                    }
                                    <MyUserCardWidget />
                                    <div className="top-helper-bar">
                                    
                                        <SearchWidget
                                            className="top-helper-bar-item search"
                                            onSearch={this.onSearchFeed.bind(this)}
                                            onClear={this.onClearSearch.bind(this)}
                                        />
                                        <Button
                                            className="top-helper-bar-item refresh"
                                            onClick={this.onRefreshFeeds.bind(this)}
                                        >
                                            <Icon>refresh</Icon>
                                        </Button>
                                    </div>
                                    <div className="feed-wrapper">
                                    
                                        
                                        {feedList.length <= 0 &&
                                            <div className="empty-content-container">No feeds found</div>
                                        }
                                        {feedList}
                                        {this.state.feedLoader &&
                                            <div className="feed-loader-container">
                                                <CircularProgress size={28} />
                                            </div>
                                        }
                                    </div>
                                </div>
                                
                                <div className="col-md-4 widgets-container">
                                    {/* <div className="widget-section">
                                        <div className="widget">
                                            <MyUserCardWidget />
                                        </div>
                                    </div> */}
                                    {/* {(this.props.activities.activitiesList && this.props.activities.activitiesList.length>0) && 
                                        <div className="master-activities-container">
                                            <div className="nameboard">
                                                Assigned Activities
                                            </div>
                                            {activitiesList}
                                        </div>
                                    } */}

                                    {this.myClubDetails.name &&
                                        <div className="widget-section">
                                            <div className="widget-section-title">My Club</div>
                                            <div className="widget clickable" title="View MyClub Page" onClick={this.onMyClubClick.bind(this)}>
                                                <MyClubWidget />
                                            </div>
                                        </div>
                                    }

                                    {
                                        (Util.hasPrivilage(PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD)) &&
                                            <div className="widget-section">
                                                <div className="widget-section-title">President Dashboard</div>
                                                <div className="widget clickable" title="View Club Dashboard" onClick={this.onMyClubDashClick.bind(this)}>
                                                    <div className="goto-clubdash">
                                                        <Icon className="goto-clubdash-icon">
                                                            dashboard
                                                        </Icon>
                                                        Club Dashboard
                                                    </div>
                                                </div>
                                            </div>
                                    }

                                    {
                                        (Util.hasPrivilage(PRIVILEGE_VIEW_CEO_DASHBOARD)) &&
                                            <div className="widget-section">
                                                <div className="widget-section-title">CEO Dashboard</div>
                                                <div className="widget clickable" title="View CEO Dashboard" onClick={this.onMyCeoDashClick.bind(this)}>
                                                    <div className="goto-ceodash">
                                                        <Icon className="goto-ceodash-icon">
                                                            dashboard
                                                        </Icon>
                                                        CEO Dashboard
                                                    </div>
                                                </div>
                                            </div>
                                    }

                                    {
                                        (Util.hasPrivilage(PRIVILEGE_VIEW_COUNCIL_DASHBOARD)) &&
                                            <div className="widget-section">
                                                <div className="widget-section-title">Council Dashboard</div>
                                                <div className="widget clickable" title="View Council Dashboard" onClick={this.onMyCouncilDashClick.bind(this)}>
                                                    <div className="goto-ceodash">
                                                        <Icon className="goto-ceodash-icon">
                                                            dashboard
                                                        </Icon>
                                                        Council Dashboard
                                                    </div>
                                                </div>
                                            </div>
                                    }

                                    <div className="widget-section">
                                        <div className="widget-section-title">Upcoming Meetings</div>

                                        <div className="widget">
                                            {this.props.feeds.upcomingMeetings.length > 0  && upcomingMeetings }
                                            {this.props.feeds.upcomingMeetings.length == 0 &&
                                                <div className="count-0">NO MEETINGS WITH IN A WEEK</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                
                            </div> :
                            <div className="empty-content-container">It's Empty Here!, Select an option from left menu to proceed</div>
                    }
                </MainContainer>
                {(Util.hasPrivilage(PRIVILEGE_CREATE_STATUS) &&
                    Util.hasPrivilage(PRIVILEGE_VIEW_FEED)) &&
                    <div className="bottom-fab-container">
                        <Button title="Add a status" fab color="primary" aria-label="add" onClick={this.handleStatusDialogVisibility.bind(this, true, false)}>
                            <Icon>add</Icon>
                        </Button>
                    </div>
                }
                <StatusDialog open={this.props.feeds.statusDialogOpen} onRequestClose={this.handleStatusDialogVisibility.bind(this)} />
                <ActionsDialog
                    open={this.state.actionsListDialogState}
                    actionsList={this.state.actionsList}
                    onRequestCloseActionsList={this.onActionListDialogueClose.bind(this)} />
                <ImageDialog
                    open={this.state.imageDialog}
                    imageSrc={this.state.imageSrc}
                    onRequestCloseImageDialog={this.handleCloseImageDialog.bind(this)} />
                <ActivityDetailDialog 
                    open={this.state.activityDetailModal}
                    activityDetails={this.state.activityDetails}
                    onRequestClose={this.statusDialogVisibility.bind(this)}/>
            </Root>
        );
    }

    handleStatusDialogVisibility(visible = false, statusPosted = false) {
        this.props.feedsOpen(visible);
        if (statusPosted) {
            this.onRefreshFeeds();
        }
    }

    handleCloseImageDialog() {
        this.setState({ imageDialog: false });
        this.setState({ imageSrc: "" });
    }

    statusDialogVisibility(value, needReload) {
        this.setState({activityDetailModal: value});
        if (needReload) {
            this.getActivities();
        }
    }

    onActivityClick(activity) {
        this.setState({activityDetails: activity});
        this.setState({activityDetailModal: true});
    }

    onMyClubClick() {
        this.props.history.push("/myClub");
    }

    onMyClubDashClick() {
        this.props.history.push("/admin/clubDash");
    }

    onMyCeoDashClick() {
        this.props.history.push("/admin/ceoDash");
    }

    onMyCouncilDashClick() {
        this.props.history.push("/admin/councilDash");        
    }

    onImageClick(imageSrc) {
        this.setState({ imageDialog: true });
        this.setState({ imageSrc: imageSrc });
    }

    closeBanner() {
        this.setState({ randomSurvey: "" });
        Util.setRandomBannerClose();
        riverToast.show("Banner will be displayed after 24 hours only")
    }

    castOption(surveyId, surveyObj) {
        FeedsService.castSurvey(surveyId, surveyObj)
            .then((data) => {
                riverToast.show("Casted your opinion successfully");
                this.getRandomSurvey();
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while casting");
            });
    }

    routeToSurvey(surveyId) {
        this.props.history.push("/survey/1/" + surveyId);
    }

    onActionsListDialogTrigger(actionsList) {
        this.setState({ actionsList: actionsList });
        this.setState({ actionsListDialogState: true });
    }

    onActionListDialogueClose() {
        this.setState({ actionsListDialogState: false });
        this.setState({ actionsList: [] });
    }

    onRefreshFeeds() {
        if (this.props.feeds.feedsList.length >= 1) {
            this.getNewFeeds(this.props.feeds.feedsList[0].feedId);
        } else {
            this.getFeeds(0, 5);
        }
    }

    onSearchFeed(searchKey) {
        this.setState({ feedLoader: true });
        FeedsService.feedSearch(searchKey)
            .then(data => {

                this.setState({ feedLoader: false });
                this.props.clearFeedsList();
                this.processFeedsResponse(data);
            })
            .catch(error => {
                this.setState({ feedLoader: false });
                riverToast.show(error.status_message || "Something went wring while searching feed");
            })
    }

    onClearSearch() {
        this.props.clearFeedsList();
        this.pageNumber = 0;
        this.getFeeds(this.pageNumber, this.feedPerPage);
    }

    onActionClick(action, feedObj) {
        if (action) {
            const actionRequest = {
                "action": action.type,
                "commentId": feedObj.commentId
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
        if (window.confirm("Are you sure to delete this feed")) {
            FeedsService.deleteFeed(feedId)
                .then((data) => {
                    this.processDeleteFeed(feedId);
                })
                .catch((error) => {
                    riverToast.show("Something went wrong while deleting feeds");
                });
        }
    }

    processDeleteFeed(feedId) {
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

    getRandomSurvey() {
        if (Util.getBannerStatus() == "active" ||
            (Util.getBannerStatus() == "inactive" &&
                Util.getBannerCloseTs() < new Date().getTime())) {
            Util.setBannerStatus("active");
            FeedsService.getRandomSurvey()
                .then(data => {
                    this.setState({ randomSurvey: data });
                })
                .catch(error => {
                    this.setState({ randomSurvey: "" });
                    riverToast.show(error.status_message || "Something went wrong while fetching random survey");
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
                userId: feedApiObj.postedBy.userId,
                badges: feedApiObj.postedBy.badges
            },
            fullCommentLoaded: false,
            commentSize: this.commentSize,
            type: feedApiObj.type,
            commentId: feedApiObj.commentId,
            isCommentLoading: false,
            postedOn: feedApiObj.postedOn,
            attachmentFiles: [],
            actions: feedApiObj.actions,
            commentsCount: feedApiObj.commentsCount,
            comments: feedApiObj.comments,
            visibility: feedApiObj.visibility,
            link: feedApiObj.link,
            crtdBfr: feedApiObj.crtdBfr
        }

        return feedObj;
    }

    processFeedsResponse(feedsList, placement) {
        const parsedFeedList = [];
        if (feedsList.length === 0) {
            this.isReachedBottom = true;
        }
        if (feedsList && feedsList.length > 0) {
            if (placement == "append") {
                feedsList.forEach((feed) => {
                    parsedFeedList.push(this.getFeedObj(feed));
                }, this);
                this.props.setFeedsList(parsedFeedList);
            } else {
                feedsList.forEach((feed, index) => {
                    parsedFeedList.splice(index, 0, this.getFeedObj(feed));
                }, this);
                const newFeeds = parsedFeedList.concat(this.props.feeds.feedsList);
                this.props.appendFeeds(newFeeds);
            }
        }
    }

    getUpcomingMeetings() {
        FeedsService.getUpcomingMeetings()
            .then((data) => {
                this.props.setUpcomingMeetings(data);
            })
            .catch((error) => {
                console.log(error.status_message || "Something went wrong while fetching upcoming meetings");
            })
    }

    getOngoingPolls() {
        FeedsService.getOngoingPolls()
            .then((data) => {
                this.props.setOngoingPolls(data);
            })
            .catch((error) => {
            console.log(error.status_message || "Something went wrong while fetching ongoing polls");
            })
    }

    getSingleFeedDetail(feedId) {
        if (feedId) {
            this.setState({ feedLoader: true });
            FeedsService.getFeed(feedId)
                .then(data => {
                    this.setState({ feedLoader: false });
                    this.props.setFeedsList([]);
                })
                .catch(error => {
                    this.setState({ feedLoader: false });
                    riverToast.show(error.status_message || "Something went wring while fetching feed");
                })
        }
    }

    getActivities(pageNo = 0, size = 30) {
        ActivitiesUserService.getActivitiesTab("assigned", '2018', '')
            .then(data => {
                if(data.length != 0) {
                    // this.pageNoIncrease();
                    this.props.activitiesListReplace(data);
                    this.activitiesList = this.props.activities.activitiesList;
                }
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong");
            });
    }

    getNewFeeds(feedId) {
        FeedsService.getNewFeeds(feedId)
            .then(data => {
                this.processFeedsResponse(data, "prepend");
            })
            .catch(error => {
                // riverToast.show(error.status_message || "Something went wrong while getting feeds");
            });
    }

    getFeeds(pageNumber, size) {
        // this.setState({feedLoader: true});
        FeedsService.getFeeds(pageNumber, size)
            .then(data => {
                this.processFeedsResponse(data, "append");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while getting feeds");
            });
    }


}

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);