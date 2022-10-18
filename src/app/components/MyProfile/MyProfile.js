import React, { Component } from 'react';
import { Util } from "../../Util/util";
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import moment from 'moment';
import TextField from 'material-ui/TextField';

// root component
import { Root } from "../Layout/Root";

// custom component
import { MyProfileService } from "./MyProfile.service";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import ImageUpload from '../Common/ImageUpload/ImageUpload';
import MyProfileCards from "./MyProfileCards/MyProfileCards";
import InfoCard from "./InfoCard/InfoCard";
import RecentPointsList from "./RecentPointsList/RecentPointsList";
import PanelRoleCard from "./PanelRoleCard/PanelRoleCard";
import ActivityPointHistoryDialog from '../Common/ActivityPointHistoryDialog/ActivityPointHistoryDialog';

// page depenedency
// css
import "./MyProfile.scss";
import { riverToast } from '../Common/Toast/Toast';


class MyProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            me: {
                "empId": "",
                "firstName": "",
                "lastName": "",
                "middleName": "",
                "email": "",
                "gender": "",
                "clubId": "",
                "clubName": "",
                "clubAvatar": "",
                "billable": "",
                "address": "",
                "district": "",
                "city": "",
                "nationality": "",
                "status": "",
                "avatar": "",
                "currentLocation": {
                    "id": "",
                    "name": "",
                    "address": "",
                    "pincode": ""
                },
                "baseLocation": {
                    "id": "",
                    "name": "",
                    "address": "",
                    "pincode": ""
                },
                "designation": {
                    "id": "",
                    "name": ""
                },
                "department": null,
                "point": null
            },
            value: 0,
            loadMoreEnabled: true,
            loadingMore: false,
            pointsPage: 0,
            userPointsHistory: [],
            recentPointsHistory: [],
            isActivityPointHistoryDialogOpen: false,
            activityPointHistory: null
        };
    }

    componentDidMount() {
        if(this.props.match.params.tabValue) {
            this.setState({ value: parseInt(this.props.match.params.tabValue) });
            this.getPointsHistory();
            if(this.props.match.params.tabValue == 1){
                this.state.pointsPage = 0;
                this.setState({ loadMoreEnabled: true });            

            }
        }
        else{
            this.loadMyDetails();
            this.getPointsHistory();
        }
    }

    render() {

        const councilsList = this.state.me.councils? this.state.me.councils : []; 
        const rolesList = this.state.me.roles ? this.state.me.roles : [];

        const tableRows = (this.state.userPointsHistory) ? this.state.userPointsHistory.map((item, index) => {
            return <TableRow key={index} className="points-history-table-row" onClick={this.openActivityPointHistoryDialog.bind(this, item)}>
                <TableCell>{moment.unix(item.createdDate/1000).format("DD MMM YYYY hh:mm A")}</TableCell>
                <TableCell className="desc-cell">{item.description}</TableCell>
                <TableCell numeric>{item.point}</TableCell>
            </TableRow>
        })
        : false;

        let avatarImage = this.state.me.avatar ? (Util.getFullImageUrl(this.state.me.avatar) + `?${Date.now()}`) : "/resources/images/img/user-avatar.png";

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="My Profile" />
                    <div className="my-profile-container">
                        <div className="my-profile-banner">
                            <div className="user-info">
                                <ImageUpload preview={avatarImage} onChange={this.onUserImageChange.bind(this)} />
                                <div className="user-info-meta">
                                    <div className="user-info-meta-fullname">
                                        {(this.state.me.firstName + " " + this.state.me.middleName + " " + this.state.me.lastName) || "name"}
                                    </div>
                                    <div className="user-info-meta-email">
                                        {this.state.me.email || "-----"}
                                    </div>
                                    <div className="user-info-meta-designation">
                                        { (this.state.me.designation) ? (this.state.me.designation.name || "------") : false }
                                    </div>
                                </div>
                                <div className="user-info-points">
                                    <div className="my-points">
                                        <Icon className="points-icon">stars</Icon>
                                        {this.state.me.userPoints || "-----"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AppBar
                            className="page-tabs-appbar"
                            position="static"
                            color="default"
                            >
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                >
                                <Tab label="Basic Details" />
                                <Tab label="Points History" />
                            </Tabs>
                        </AppBar>
                        {   
                            this.state.value === 0 && 
                                <div className="my-profile-cards-container tab-container">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <InfoCard club={this.getInfoCardData(this.state.me)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <PanelRoleCard panels={councilsList} roles={rolesList} activeRole={this.state.me.activeRole} />
                                        </div>
                                        <div className="col-lg-7">
                                            <RecentPointsList points={this.state.recentPointsHistory} clickHandler={this.navigateToPointsHistory.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            this.state.value === 1 &&
                                <div className="tab-container points-history-container">
                                    <div className="points-history-table-container">
                                        <Table className="points-history-table">
                                            <TableHead className="points-history-table-head">
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell numeric>Points</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="points-history-table-body">
                                                {tableRows}
                                            </TableBody>
                                        </Table>
                                        {
                                            (this.state.loadMoreEnabled) &&
                                                <div className="load-more-points-btn-div">
                                                    <Button
                                                        onClick={this.handleLoadMorePoints.bind(this)}
                                                        className= "load-more-btn"
                                                        color = "primary"
                                                        >
                                                        {
                                                            (!this.state.loadingMore) ? (
                                                                "Load More"
                                                            ) : (
                                                                "loading...."
                                                            )
                                                        }
                                                    </Button>
                                                </div>
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </MainContainer>
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
        MyProfileService.loadisActivityPointHistoryData(activity.referenceCode)
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

    getInfoCardData(info){
        const data = {
            clubName: info.clubName,
            clubPoints: info.clubPoints || 0,
            currentLocation: info.currentLocation? info.currentLocation.name : "---",
            baseLocation: info.baseLocation? info.baseLocation.name : "---",
            clubAvatar: Util.getImage(info.clubAvatar, "club")
        };
        return data;
    }

    navigateToPointsHistory(){
        this.setState({ value: 1 });
    }

    handleTabChange = (event, value) => {
        this.setState({ value });
        if(value == 1){
            this.state.pointsPage = 0;
            this.setState({ loadMoreEnabled: true });            
            this.getPointsHistory();

        }
    };

loadMyDetails() {
    MyProfileService.getMyProfile()
        .then((data) => {
        this.setState({ me: data});
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching profile details");
    });
}

getPointsHistory(page){
    const pageNo = page || this.state.pointsPage;

    this.setState({ loadingMore: true });

    MyProfileService.getPointsHistory(pageNo)
        .then((data) => {

        this.setState({ loadingMore : false });

        if(pageNo == 0){
            this.setState({ userPointsHistory: data });
            this.setState({ recentPointsHistory: data });

            if(data.length == 0) {
                this.setState({ loadMoreEnabled: false });                    
            }
        } else {
            let pointsHistory = [...this.state.userPointsHistory];

            if(data.length > 0){
                pointsHistory = [...pointsHistory, ...data];
                this.setState({ userPointsHistory: pointsHistory });
            } else {
                riverToast.show("No more history to show");
                this.setState({ loadMoreEnabled: false });
            }
        }
        this.setState({ pointsPage: pageNo + 1 });            
    })
        .catch((error) => {
        this.setState({ loadingMore : false });
        riverToast.show("something went wrong while fetching points")
    })

}

handleLoadMorePoints() {
    this.getPointsHistory();
}

onUserImageChange(avatar){
    Util.base64ImageFromFile(avatar).
    then( result => {
        let requestObj = {
            avatar: result
        };
        MyProfileService.updateProfileImage(requestObj)
            .then((resp) => {
            this.loadMyDetails();
        })
            .catch((error) => {
            riverToast.show("Something went wrong while updating profile image.")
        });
    }).
    catch(error => {
        riverToast.show("Something went wrong while changing image");                        
    });


}
}

export default MyProfile;