import React, {Component} from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';

// root component
import {Root} from "../Layout/Root";

// custom component
import {Util} from "../../Util/util";
import {ContactCard} from "../Common/ContactCard/ContactCard";
import {MyClubService} from "./MyClub.service";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import MyClubCards from "./MyClubCards/MyClubCards"
import {Discussion} from "../Common/Discussion/Discussion";
import ImageUpload from '../Common/ImageUpload/ImageUpload';
import MyClubEditSloganDialog from "./MyClubEditSloganDialog/MyClubEditSloganDialog"
import ActivityPointHistoryDialog from '../Common/ActivityPointHistoryDialog/ActivityPointHistoryDialog';

// page depenedency css
import "./MyClub.scss";
import {riverToast} from '../Common/Toast/Toast';

// actions
import {loadDiscussion, clearDiscussions} from './MyClub.actions';

const mapStateToProps = (state) => {
    return {myclub: state.MyClubReducer}
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadDiscussion: (discussion) => {
            dispatch(loadDiscussion(discussion))
        },
        clearDiscussions: () => {
            dispatch(clearDiscussions());
        }
    }
}

const PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD = "VIEW_CLUB_PRESIDENT_DASHBOARD";

class MyClub extends Component {

    state = {
        myClub: {},
        value: 0,
        loadMoreEnabled: true,
        loadingMore: false,
        pointsPage: 0,
        disscussionSubmitProgress: false,
        clubPointsHistory: [],
        discussionPage: 0,
        noMoreDisc: false,
        isSloganDialogOpen: false,
        isActivityPointHistoryDialogOpen: false,
        activityPointHistory: null
    }

constructor(props) {
    super(props);
}

componentDidMount() {
    this.loadInitialData();
}

componentWillUnmount() {
    this
        .props
        .clearDiscussions();
}

render() {
    const userListElements = (this.state.myClub.clubMembers)
    ? (this.state.myClub.clubMembers.map((user, index) => {
        return <ContactCard
                   key={index}
                   name={user.name}
                   email={user.email}
                   image={(user.avatar)
                ? user.avatar
            : "../../../../../resources/images/img/user-avatar.png"}
                   clubRole={((user.clubRole)
                              ? user.clubRole
                              : "Member")}/>
    }))
    : false;

    const tableRows = (this.state.clubPointsHistory)
    ? this
    .state
    .clubPointsHistory
    .map((item, index) => {
        if(index >= 14){
            console.log(index);
        }
        return <TableRow key={index} className="points-history-table-row" onClick={this.openActivityPointHistoryDialog.bind(this, item)}>
            <TableCell>{moment
                    .unix(item.createdDate / 1000)
                    .format("DD MMM YYYY hh:mm A")}</TableCell>
            <TableCell className="desc-cell">{item.description}</TableCell>
            <TableCell>{item.point}</TableCell>
        </TableRow>
    })
    : false;

    let avatarImage = this.state.myClub.avatar ? (Util.getFullImageUrl(this.state.myClub.avatar) + `?${Date.now()}`) : "/resources/images/img/club.png";

    return (
        <Root role="user">
            <MainContainer>
                <PageTitle title="My Club"/>
                <div className="my-club-container">
                    <div className="my-club-banner">
                        <div className="club-info">
                            {
                                ( Util.getActiveRole().value === 'ROLE_CLUB_PRESIDENT' )? 
                                    <ImageUpload preview={avatarImage} onChange={this.onMyClubLogoChange.bind(this)} /> :
                                    <img className="club-info-avatar" src={avatarImage} alt="ClubLogo"/>
                            }
                            <div className="club-info-meta">
                                <div className="club-info-meta-clubname">
                                    {(this.state.myClub.clubName) || "Club Not Assigned Yet"}
                                </div>
                                <div className="club-info-meta-description">
                                    {this.state.myClub.clubDescription || ""}
                                </div>
                            </div>
                            <div className="club-info-points">
                                <div className="club-points">
                                    <Icon className="points-icon">stars</Icon>
                                    {this.state.myClub.clubPoints || "--"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <AppBar className="page-tabs-appbar" position="static" color="default">
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary">
                            <Tab label="Basic Details"/>
                            <Tab label="Points History"/>
                            {/* <Tab label="Club Discussions"/> */}
                        </Tabs>
                    </AppBar>
                    {(!this.state.myClub.clubName) && <div style={{
                                "textAlign": "center",
                                    "margin": "4rem 0",
                                        "color": "#9c9387",
                                            "fontWeight": "500"
                            }}>
                            No Club Assigned Yet, Please Contact Admin
                        </div>
                    }
                    {this.state.value === 0 && (this.state.myClub.clubName) && <div className="my-club-cards-container tab-container">
                        <MyClubCards title="Basic Details" icon="description">
                            <div className="basic-details-container">
                                <div className="section basic-field">
                                    <div className="basic-field-name">
                                        Club Slogan:
                                    </div>
                                    <div className="basic-field-detail">
                                        <span className="slogan-entry">{this.state.myClub.clubSlogan || "----"}</span>
                                        { ( Util.getActiveRole().value === 'ROLE_CLUB_PRESIDENT' ) && 
                                            <IconButton
                                                title="Update Club Slogan"
                                                color="primary"
                                                aria-label="Edit"
                                                size="small"
                                                onClick={this.sloganUpdateDialogToggle}>
                                                <Icon>edit</Icon>
                                            </IconButton>
                                        }
                                    </div>
                                </div>
                                <div className="section basic-field">
                                    <div className="basic-field-name">
                                        Club Location:
                                    </div>
                                    <div className="basic-field-detail">
                                        {((this.state.myClub.clubLocation)
                                          ? this.state.myClub.clubLocation.name
                                          : false) || "----"}
                                    </div>
                                </div>
                            </div>
                        </MyClubCards>
                        <MyClubCards title="Club Members" icon="store_mall_directory">

                            <div className="club-container">
                                {(Util.hasPrivilage(PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD)) && <h6>
                                    <a
                                        onClick={this.gotoDashboard.bind(this)}
                                        style={{
                                            color: 'green',
                                                marginBottom: '1rem',
                                                    textDecoration: 'underline',
                                                        cursor:'pointer'
                                        }}>
                                        Go to club Dashboard</a>
                                </h6>}
                                <div className="section member-field">
                                    {(userListElements.length > 0)
                                        ? userListElements
                                    : "No Members"
                                    }
                                </div>
                            </div>
                        </MyClubCards>
                    </div>
                    }
                    {this.state.value === 1 && (this.state.myClub.clubName) && <div className="tab-container points-history-container">
                        <div className="points-history-table-container">
                            <Table className="points-history-table">
                                <TableHead className="points-history-table-head">
                                    <TableRow>
                                        <TableCell >Date</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="points-history-table-body">
                                    {tableRows}
                                </TableBody>
                            </Table>
                            {(this.state.loadMoreEnabled) && <div className="load-more-points-btn-div">
                                <Button
                                    onClick={this
                                        .handleLoadMorePoints
                                        .bind(this)}
                                    className="load-more-btn"
                                    color="primary">
                                    {(!this.state.loadingMore)
                                        ? ("Load More")
                                    : ("loading....")
                                    }
                                </Button>
                            </div>
                            }
                        </div>
                    </div>
                    }
                    {this.state.value === 2 && (this.state.myClub.clubName) && <div className="tab-container club-discussion-container">
                        <div className="discussion-wrapper">
                            <Discussion
                                submitInprogress={this.state.disscussionSubmitProgress}
                                height="25rem"
                                loadMore={!this.state.noMoreDisc}
                                onLoadMore={this
                                    .getDiscussions
                                    .bind(this, this.state.discussionPage, 10)}
                                discussions={this.props.myclub.discussion}
                                userPopOver={true}
                                onSubmitMessage={this
                                    .onSubmitDiscussionMessage
                                    .bind(this)}/>
                        </div>
                    </div>
                    }
                </div>
            </MainContainer>
            <MyClubEditSloganDialog
                open={this.state.isSloganDialogOpen}
                slogan={this.state.myClub.clubSlogan || ''}
                onClose={this.handleSloganDialogClose}
                onSubmit={this.updateSlogan}
                />
            <ActivityPointHistoryDialog
                open={this.state.isActivityPointHistoryDialogOpen}
                historyData={this.state.activityPointHistory}
                handlePopupClose={this.closeActivityPointHistoryDialog.bind(this)}
                />
        </Root>
    );
}

openActivityPointHistoryDialog(activity){
    this.setState({
        activityPointHistory: null,
        isActivityPointHistoryDialogOpen: true
    });
    MyClubService.loadisActivityPointHistoryData(activity.referenceCode)
        .then(activityPointHistory => {
        this.setState({activityPointHistory});
    })
        .catch((error) => {
        const errMessage = error.status_message || "Something went wrong while loading activity point history.";
        this.setState({
            activityPointHistory: {error: errMessage}
        });
        riverToast.show(errMessage)
    });
}

closeActivityPointHistoryDialog(){
    this.setState({
        activityPointHistory: null,
        isActivityPointHistoryDialogOpen: false
    });
}

loadInitialData(){
    this.loadMyClubDetails();
    if (this.props.match.params.tabValue) {
        this.setState({
            value: parseInt(this.props.match.params.tabValue)
        });
        this.loadCurrentTab()
    }
}

handleTabChange = (event, value) => {
    this.setState({value});
    if (value == 1) {
        this.state.pointsPage = 0;
        this.setState({loadMoreEnabled: true});
        this.getPointsHistory();
    } else if (value == 2) {
        this.getDiscussions(this.state.discussionPage, 10);
    }
};

loadCurrentTab() {
    if (this.props.match.params.tabValue == 1) {
        this.state.pointsPage = 0;
        this.setState({loadMoreEnabled: true});
        this.getPointsHistory();
    } else if (this.props.match.params.tabValue == 2) {
        this.getDiscussions(this.state.discussionPage, 10);
    }
}

loadMyClubDetails() {
    MyClubService
        .getMyClub()
        .then((data) => {
        const club = data;
        this.setClubState(club);
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching club details");
    });
}

setClubState(data) {
    this.setState({myClub: data});
}

discussionScrollToBottom() {
    document
        .querySelector(".message-container")
        .scrollTo(0, document.querySelector(".message-container").scrollHeight);
}

gotoDashboard() {
    this
        .props
        .history
        .push("/admin/clubDash");
}

getPointsHistory() {
    const pageNo = this.state.pointsPage;

    this.setState({loadingMore: true});

    MyClubService
        .getPointsHistory(pageNo)
        .then((data) => {

        this.setState({loadingMore: false});

        if (pageNo == 0) {
            this.setState({clubPointsHistory: data});
        } else {
            let pointsHistory = [...this.state.clubPointsHistory];

            if (data.length > 0) {
                //pointsHistory.push(data);
                pointsHistory = [...pointsHistory, ...data]
                this.setState({clubPointsHistory: pointsHistory});
            } else {
                riverToast.show("No more history to show");
                this.setState({loadMoreEnabled: false});
            }
        }
        this.setState({
            pointsPage: pageNo + 1
        });
    })
        .catch((error) => {
        this.setState({loadingMore: false});
        riverToast.show("somwthing went wrong while fetching points")
    })

}

onSubmitDiscussionMessage(message) {
    if (message.trim()) {
        const messageRequest = {
            message: message
        };
        this.setState({disscussionSubmitProgress: true});
        MyClubService
            .postDiscussionMessage(messageRequest)
            .then(data => {
            const userDetail = Util.getLoggedInUserDetails();
            this.setState({disscussionSubmitProgress: false});
            const discussion = this.props.myclub.discussion;
            const currentDiscussionObj = {
                postedBy: {
                    avatar: userDetail.avatar,
                    name: userDetail.fullName,
                    userId: userDetail.userId,
                    username: userDetail.username
                },
                postedOn: new Date().getTime(),
                type: null,
                value: message
            };
            discussion.push(currentDiscussionObj);
            this
                .props
                .loadDiscussion(discussion);
            this.discussionScrollToBottom();
        })
            .catch((error) => {
            this.setState({disscussionSubmitProgress: false});
            riverToast.show(error.status_message || "Something went wrong while posting message");
        })
    }
}

getDiscussions(pageNo, size) {
    MyClubService
        .getDiscussions(pageNo, size)
        .then(data => {
        if (data.length > 0) {
            let discussions = this.props.myclub.discussion;
            discussions = data.concat(discussions);
            this
                .props
                .loadDiscussion(discussions);
            if (!this.state.discussionPage > 0) {
                this.discussionScrollToBottom();
            }
            this.setState({
                discussionPage: this.state.discussionPage + 1
            })
        } else {
            this.setState({noMoreDisc: true});
        }
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while getting discussions");
    })
}

handleLoadMorePoints() {
    this.getPointsHistory();
}
onMyClubLogoChange(avatar){
    Util.base64ImageFromFile(avatar).
    then( result => {
        const requestObj = {
            avatar: result
        };
        MyClubService.updateClubLogo(requestObj)
            .then((club) => {
            this.loadInitialData();
        })
            .catch((error) => {
            riverToast.show("Something went wrong while updating Club logo.")
        });
    }).
    catch(error => {
        riverToast.show("Something went wrong while changing club logo");                        
    });
}

sloganUpdateDialogToggle = () => {
    this.setState({isSloganDialogOpen: !this.state.isSloganDialogOpen});
}

handleSloganDialogClose = () => {
    this.setState({isSloganDialogOpen: false});
}

handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
        [name]: value
    });
}

updateSlogan = (slogan) => {
    console.log(slogan);
    if(slogan && slogan !== this.state.myClub.clubSlogan){
        const requestObj = {slogan};
        MyClubService.updateClubSlogan(requestObj)
            .then((club) => {
            console.log(club);
            this.setClubState(club);
            this.setState({isSloganDialogOpen: false});
        })
            .catch((error) => {
            riverToast.show("Something went wrong while updating Club Slogan.")
        });
    }
    else{
        this.setState({isSloganDialogOpen: false});
    }
}

}

export default connect(mapStateToProps, mapDispatchToProps)(MyClub);