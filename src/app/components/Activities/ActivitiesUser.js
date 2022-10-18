import React from "react";
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

//root component
import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { Util } from '../../Util/util';
import { AddNewBtn } from '../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../Common/SearchWidget/SearchWidget';
import { Toast, riverToast } from '../Common/Toast/Toast';
import { ActivitiesUserCard } from './ActivitiesUserCard/ActivitiesUserCard';
import { ActivitiesUserService } from "./ActivitiesUser.service";
import {ActivityDetailDialog} from "./ActivityDetailDialog/ActivityDetailDialog";
import MyActivityListItem from '../CommonDashboard/MyActivityListItem/MyActivityListItem';
import AppConfig from "../../Util/Constants/AppConfig";

//redux actions
import { activitiesListChange, clearActivitiesList, activitiesListReplace } from "./ActivitiesUser.action";
// css
import './ActivitiesUser.scss';


const mapStateToProps = (state) => {
    return {
        activityUser: state.ActivitiesUserReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        activitiesListChange: (activitiesList) => {
            dispatch(activitiesListChange(activitiesList))
        },
        activitiesListReplace: (activitiesList) => {
            dispatch(activitiesListReplace(activitiesList))
        },
        searchKeyChange: (searchKey) => {
            dispatch(searchKeyChange(searchKey))
        },
        clearActivitiesList: () => {
            dispatch(clearActivitiesList())
        }
    }
};

const PRIVILEGE_CREATE_ACTIVITY = "CREATE_ACTIVITY";

class ActivitiesUser extends React.Component {
    state = {
        activityDetails: {},
        activityList: [],
        detailModal: false,
        tabValue: 0,
        selfAssignablePageNo: 0,
        assignedPageNo: 0,
        completedPageNo: 0,
        refId: ""
    };
isReachedBottom = false;

activitiesList = [];
constructor(props) {
    super(props);
}

componentDidMount() {
    if(this.props.match.params.refId){
        this.setState({ tabValue: 0, refId: this.props.match.params.refId  }, function (state) {
            this.props.clearActivitiesList();        
            //this.loadCurrentTabList();
            this.getUserActivitiesOnSelected(this.state.refId);
        })
    }
    else{
        this.props.clearActivitiesList();        
        this.loadCurrentTabList();
    }

    // window.onscroll = (ev) => {
    //     if (/#\/activities(\/[\d]*)*/.test(window.location.hash)) {
    //         if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //             if (!this.isReachedBottom && this.props.activityUser.activitiesList.length > 0) {
    //                 this.loadCurrentTabList();
    //             }
    //         }
    //     }
    // };      
}

componentDidUpdate(prevProps, prevState){
    if(prevState.tabValue != this.state.tabValue) {
        this.postTabChange();
        this.loadCurrentTabList("new");
    }
}

render() {
    const activityList = this.props.activityUser.activitiesList.map((activity, index) => {
        return <ActivitiesUserCard
                   key={index}
                   onClick={this.onActivityClick.bind(this)}
                   activity={activity}
                   onSelfAssign={this.onAssignSelf.bind(this)}
                   />;
    });

    const activityTableRows = this.props.activityUser.activitiesList.map((activitiesList, index) => {
        return <MyActivityListItem
                   key={activitiesList.id}
                   activity={activitiesList}
                   isExpand={activitiesList.shouldExpandRefId || false} />
    });

    return ( 
        <Root role="user">
            <MainContainer>
                <PageTitle title="My Activities" />
                {AppConfig.isActivityAssignmentDisabled && <div className="alert-mssg">
                    <h1 className="title"><Icon>warning</Icon> Point Claim has been disabled.</h1>
                    <p>This functionality will be available soon after line item update.</p>
                </div>}
                <div className="myactivity-search-wrapper">
                    <SearchWidget searchKey={this.state.refId} onSearch={this.onSearchActivity.bind(this)} onClear={this.onClearActivitySearch.bind(this)} />
                </div>
                <div className="activity-count-color-info">
                    <div className="label-container">
                        <div className="label">
                            <div className="color green"></div>
                            <div className="text">Assigned</div>
                        </div>
                    </div>                                 
                </div>
                { 
                    <div className="activities-container">
                        <div className="activities-list">
                            {
                                activityTableRows.length !== 0 ?
                                    activityTableRows
                                :
                                    <div className="empty-notification">No activities found</div>
                            }
                            {
                                this.state.page == 'club' &&
                                    <div className="load-more" onClick={this.loadMoreClubTabs.bind(this)}>Load More</div>
                            }
                            {
                                this.state.page == 'council' &&
                                    <div className="load-more" onClick={this.loadMoreCouncilTabs.bind(this)}>Load More</div>
                            }
                        </div>
                    </div>
                }         
                {/* <div className="row activities-user-page" style={{ display: 'none' }}>
                        <div className="col-md-12 flex-container">
                            <AppBar
                                className="page-tabs-appbar"                                
                                position="static"
                            >
                                <Tabs
                                    value={this.state.tabValue}
                                    onChange={this.handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    className="tabs-container"
                                    fullWidth
                                >
                                    <Tab className={("tab") + (this.state.tabValue === 0 ? " active" : "")} label="Self Assignable" />
                                    <Tab className={("tab") + (this.state.tabValue === 1 ? " active" : "")} label="Assigned" />
                                  </Tabs>
                            </AppBar>
                            {/* <div className="row">
                                <div className="col-md-12 listing-extras">
                                    <SearchWidget onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)} />
                                </div>
                            </div> */}
                {/* <div className="row w-full margin-top-1">
                                <div className="col-md-12 listing-extras">
                                    <SearchWidget onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)} />
                                </div>
                            </div> */}
                {/* {   
                                this.state.tabValue === 0 &&
                                (
                                    this.props.activityUser.activitiesList.length > 0 ?
                                        <div className="activity-tab-body activity-self-assignable">
                                            {activityList}
                                        </div>
                                    : 
                                        <div className="empty-content-container">No activities found</div>
                                )
                            } */}
                {/* {
                                this.state.tabValue === 1 &&
                                (
                                    this.props.activityUser.activitiesList.length > 0 ?
                                        <div className="activity-tab-body activity-assigned">
                                            {activityList}
                                        </div>
                                    : 
                                        <div className="empty-content-container">No activities found</div>
                                )
                            }
                            {
                                this.state.tabValue === 2 &&
                                (
                                    this.props.activityUser.activitiesList.length > 0 ?
                                        <div className="activity-tab-body activity-summary">
                                           <h1>Waiting for api</h1>
                                        </div>
                                    : 
                                        <div className="empty-content-container">No activities found</div>
                                )
                            } */}
                {/* {activityList} */}
                {/* </div>
                    </div> */}
                {/* {Util.hasPrivilage(PRIVILEGE_CREATE_ACTIVITY) &&
                        <div className="bottom-fab-container new-activity-fab">
                            <Button title="Add New Activity" fab color="primary" aria-label="add" onClick={this.onAddnewClick.bind(this)}>
                                <Icon>add</Icon>
                            </Button>
                        </div>
                    } */}

            </MainContainer>
            <ActivityDetailDialog 
                open={this.state.detailModal}
                activityDetails={this.state.activityDetails}
                onRequestClose={this.statusDialogVisibility.bind(this)}/>
        </Root>
    );
}


onSearchActivity(text) {
    console.log(text);
    //this.props.history.push(`/activities/${text}`);
    this.getUserActivitiesSearch(text);
}

onClearActivitySearch() {
    console.log('cleared');
    this.setState({refId: ""});
    //this.props.history.push("/activities");
    this.getUserActivitiesSearch("");
}


handleTabChange = (event, value) => {        
    this.setState({
        ...this.state,
        tabValue: value
    });
};

postTabChange = () => {
    this.props.clearActivitiesList();

    this.setState({
        ...this.state,
        selfAssignablePageNo: 0,
        assignedPageNo: 0
    })
}
onAddnewClick() {
    this.props.history.push("/activities/detail");
}

statusDialogVisibility(value, needReload) {
    this.setState({detailModal: value});
    if (needReload) {
        this.loadCurrentTabList(0);
    }
}

onSearch(searchKey) {
    const filteredActivities = this.filterItems(searchKey, this.activitiesList);
    this.props.activitiesListReplace(filteredActivities);
}

filterItems(query, array) {
    return array.filter((el) => {
        return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    })
}

onClearSearch() {
    this.props.activitiesListReplace(this.activitiesList);
}

onActivityClick(activity) {
    this.setState({activityDetails: activity});
    this.setState({detailModal: true});
}

pageNoIncrease() {
    const tabValue = this.state.tabValue;

    switch (tabValue) {
        case 0:
            this.setState({ selfAssignablePageNo: this.state.selfAssignablePageNo + 1 });
            break;
        case 1:
            this.setState({ assignedPageNo: this.state.assignedPageNo + 1 });
            break;
        case 2:
            this.setState({ summaryPageNo: this.state.summaryPageNo + 1 });
            break;
        default:
            break;
    }
}

loadCurrentTabList(pageNo){
    const tabValue = this.state.tabValue;

    switch (tabValue) {
        case 0:
            this.loadSelfAssignableList();
            break;
        case 1:
            this.loadAssignedList((pageNo === 0 || pageNo) ? pageNo : this.state.assignedPageNo);
            break;
        case 2:
            this.loadSummaryList((pageNo === 1 || pageNo) ? pageNo : this.state.summaryPageNo);
            break;
        default:
            this.setState({ tabValue: 0 });
            break;
    }
}

loadSelfAssignableList(pageNo, size = 30) {
    this.getActivitiesTab("selfAssignable");
}

loadAssignedList(pageNo, size = 30) {
    this.getActivitiesTab("assigned", '');
}

loadSummaryList(pageNo, size = 30) {
    this.getActivitiesTab("Summary", '');
}

onAssignSelf(id) {
    ActivitiesUserService.selfAssignActivity(id)
        .then(data => {
        riverToast.show('Activity assigned successfully.');
        this.loadAssignedList(0);
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while loading self assign activity");
    });
}

getActivitiesTab(status, year, query) {
    ActivitiesUserService.getActivitiesTab(status, '2018', '')
        .then(data => {
        /*if (this.props.match.params && this.props.match.params.refId) {
            data[0].shouldExpandRefId = this.props.match.params.refId;
        }*/
        this.props.activitiesListChange(data);
        this.activitiesList = this.props.activityUser.activitiesList;
        if(data.length != 0) {
            this.pageNoIncrease();
        }
    })
    /*.catch(error => {
        riverToast.show(error.status_message || "Something went wrong while loading activities list tab.");
    });*/

}

getActivities() {
    ActivitiesUserService.getActivities()
        .then(data => {
        if(pageNo === 0) {
            /*if (this.props.match.params && this.props.match.params.refId) {
                data[0].shouldExpandRefId = this.props.match.params.refId;
            }*/
            this.activitiesList = data;
            this.props.activitiesListChange(data);
        }
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while loading activities.");
    });
}

getUserActivitiesSearch(text) {
    ActivitiesUserService.getUserActivitiesSearch(text)
        .then(data => {
        if (text) {
            if(data.length){
                data[0].shouldExpandRefId = this.props.match.params.refId;
            }
        }
        else{
            if(data.length){
                data[0].shouldExpandRefId = false;
            }
            window.location.reload();
        }
        this.activitiesList = data;
        this.props.activitiesListChange(data);
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while loading activities.");
    });
}

getUserActivitiesOnSelected(text) {
    ActivitiesUserService.getUserActivitiesSearch(text)
        .then(data => {
        if (text) {
            //data[0].shouldExpandRefId = this.props.match.params.refId;
            data[0].shouldExpandRefId = this.state.refId || "";
        }
        else{
            data[0].shouldExpandRefId = false;
        }
        this.activitiesList = data;
        this.props.activitiesListChange(data);
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while loading activities.");
    });
}
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesUser);