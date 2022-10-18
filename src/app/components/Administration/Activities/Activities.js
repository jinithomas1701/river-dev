import React from "react";
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Dock from 'react-dock';

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { ActivityCard } from './ActivityCard/ActivityCard';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import {SelectBox} from '../../Common/SelectBox/SelectBox';
import ActivityDock from '../../Common/ActivityDock/ActivityDock';

import { ActivitiesService } from "./Activities.service";
import { activitiesListPush,
         searchKeyChange,
         clearActivitiesList,
         activitiesListReplace } from "./Activities.action"
import {Util} from "../../../Util/util";
import './Activities.scss';

const mapStateToProps = (state) => {
    return {
        activities: state.ActivitiesReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        activitiesListPush: (list) => {
            dispatch(activitiesListPush(list));
        },
        activitiesListReplace: (list) => {
            dispatch(activitiesListReplace(list));
        },
        searchKeyChange: (key) => {
            dispatch(searchKeyChange(key));
        },
        clearActivitiesList: () => {
            dispatch(clearActivitiesList());
        }
    }
};

const PRIVILEGE_CREATE_ACTIVITY = "CREATE_ACTIVITY";

class Activities extends React.Component {
    state = {
        pageNo: 0,
        filterFA: 'ALL',
        filterDiff: 'ALL',
        filterStatus: 'ALL',
        filterClub: 0,
        focusAreas: [],
        activityDifficulties: [],
        activityStatuses: [],
        clubsList: [],
        currentActivity: '',
        currentActivityIndex: '',
        isCouncilAccept: false
    }
    isReachedBottom = false;
    activeRole = '';
    
    constructor(props) {
        super(props);
        this.activeRole = Util.getActiveRole().value;
        this.getActivitieslist();
    }
    
    componentDidMount() {    
        this.loadFilters();
        // this.getActivitieslist();        
        window.onscroll = (ev) => {
            if (/#\/admin\/activities(\/[\d]*)*/.test(window.location.hash)) {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    if (!this.isReachedBottom && this.props.activities.activitiesList.length > 0) {
                        this.getActivitieslist();
                    }
                }
            }
        };      
    }

    componentDidUpdate(prevProps, prevState){
    }

    activitiesList = [];

    render() {

        const activitiesList = this.props.activities.activitiesList.map((activity, index) => {
            return <ActivityCard
                        key={activity.id}
                        activity={activity}
                        deleteCallback={this.onDeleteActivity.bind(this)}
                        viewCallback={this.onViewActivity.bind(this)}
                        role={this.activeRole}
                        editCallback={this.onEditActivity.bind(this)}
                        index={index}
                        onActivityChanges={this.onActivityChanges.bind(this)}
                        onCouncilAcceptActivity={this.onCouncilAcceptActivity.bind(this)}/>
        });

        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Activities" />
                    <div className="row" className="activities-admin-page">
                        <div className="col-md-12 flex-container">
                            <div className="filter-options">
                                {
                                    (this.activeRole == 'ROLE_CLUB_PRESIDENT' || this.activeRole == 'ROLE_SUPER_ADMIN') &&
                                        <div className="filter-item">
                                            <span className="filter-item-label">Focus Area</span>
                                            <SelectBox 
                                                id="focus-area-filter"
                                                required
                                                classes="filter-item-select"
                                                disableSysClasses
                                                selectedValue = {this.state.filterFA}
                                                selectArray={this.state.focusAreas || []}
                                                onSelect={this.handleFilterSelect('filterFA')}/>
                                        </div>
                                }
                                {
                                    (this.activeRole == 'ROLE_CLUB_PRESIDENT' || this.activeRole == 'ROLE_SUPER_ADMIN') &&
                                        <div className="filter-item">
                                            <span className="filter-item-label">Difficulty</span>                                                    
                                            <SelectBox 
                                                id="focus-area-filter"
                                                required
                                                classes="filter-item-select"
                                                disableSysClasses
                                                selectedValue = {this.state.filterDiff}
                                                selectArray={this.state.activityDifficulties || []}
                                                onSelect={this.handleFilterSelect('filterDiff')}/>
                                        </div>
                                }
                                <div className="filter-item">
                                    <span className="filter-item-label">Status</span>                                                    
                                    <SelectBox 
                                        id="focus-area-filter"
                                        required
                                        classes="filter-item-select"
                                        disableSysClasses
                                        selectedValue = {this.state.filterStatus}
                                        selectArray={this.state.activityStatuses || []}
                                        onSelect={this.handleFilterSelect('filterStatus')}/>
                                </div>
                                {
                                    (this.activeRole == 'ROLE_SUPER_ADMIN' || this.activeRole == 'ROLE_RIVER_COUNCIL') &&
                                        <div className="filter-item">
                                            <span className="filter-item-label">Clubs</span>                                                    
                                            <SelectBox 
                                                id="focus-area-filter"
                                                required
                                                classes="filter-item-select"
                                                disableSysClasses
                                                selectedValue = {this.state.filterClub}
                                                selectArray={this.state.clubsList || []}
                                                onSelect={this.handleFilterSelect('filterClub')}/>
                                        </div>
                                }
                            </div>
                            <div className="activities-container">
                                {    
                                    this.props.activities.activitiesList.length > 0 ?
                                        <div className="activities-body">
                                            {activitiesList}
                                        </div>
                                    : 
                                        <div className="empty-content-container">No activities found</div>
                                }
                                <div className="load-more" onClick={this.loadMore.bind(this)}>{this.props.activities.activitiesList.length > 0 ? 'Load More' : 'Refresh'}</div>                                    
                            </div>
                        </div>
                    </div>
                    {this.state.currentActivity &&
                            <Dock size={0.5} zIndex={200} position='right' isVisible={this.state.isVisible} dimMode="none" defaultSize={.6}>
                                {
                                    this.state.currentActivity &&
                                        <ActivityDock
                                            activity={this.state.currentActivity}
                                            index={this.state.currentActivityIndex}
                                            isCouncilApprove={this.state.isCouncilAccept}
                                            closeDock={this.onCloseDock.bind(this)}
                                            role={this.activeRole}
                                            onActivityChanges={this.onActivityChanges.bind(this)}
                                        />
                                }
                            </Dock>                        
                    }
                </MainContainer>
			</Root>
        );
    }

    handleFilterSelect = (name) => (value) => {
        this.setState({ [name]: value  }, () => {this.getActivitieslist();});
    }

    onAddnewClick() {
        this.props.history.push("/admin/activities/detail");
    };

    onCloseDock() {
        this.setState({
            ...this.state,
            currentActivity: '',
            currentActivityIndex: '',
            isCouncilAccept: false,
            isVisible: false
        })
    }

    loadMore() {
        const pageNo = this.state.pageNo;
        this.getActivitieslist(pageNo + 1);
    }

    onDeleteActivity(activity) {
        if (confirm ("Are you sure?")) {
            ActivitiesService.deleteActivity(activity.id)
            .then((data) => {
                riverToast.show("Deleted successfully");
                this.getActivitieslist();
            })
            .catch((error) => {
                riverToast.show("Something went wrong");
            })
        }
    }

    onActivityChanges(activity, index) {
        let activities = this.props.activities.activitiesList;

        activities[index] = activity;

        this.props.activitiesListReplace(activities);
    }
    
    onAddUser(activity) {

    }

    onEditActivity(activity) {
        this.props.history.push("/admin/activities/detail/" + activity.id);
    }

    onViewActivity(activity, index) {
        // this.props.history.push("/admin/activities/view/" + activity.id);
        this.setState({
            ...this.state,
            currentActivity: activity,
            currentActivityIndex: index,
            isVisible: true,
            isCouncilAccept: false
        })
    }

    onCouncilAcceptActivity(activity, index) {
        this.setState({
            ...this.state,
            currentActivity: activity,
            currentActivityIndex: index,
            isVisible: true,
            isCouncilAccept: true
        })
    }

    loadFilters() {
        switch (this.activeRole) {
            case 'ROLE_CLUB_PRESIDENT':
                this.loadDiffFilters();
                this.loadFAFilters();
                this.loadStatFilters("club");
                break;
            case 'ROLE_RIVER_COUNCIL':
                this.loadClubFilters();
                this.loadStatFilters("council");
                break;
            case 'ROLE_SUPER_ADMIN':
                this.loadDiffFilters();
                this.loadFAFilters();
                this.loadClubFilters();
                this.loadStatFilters("admin");
                break;
        }
    }

    loadDiffFilters() {
        this.setState({ activityDifficulties: [{title:'All',value:'ALL'},{title:'Easy',value:'EASY'},{title:'Difficult',value:'DIFF'},{title:'Very Diffiult',value:'VDIF'}] })
    }

    getFocusAreaMeta(list) {
        let result = list.map((item) => {
            return {title: item.title, value: item.code}
        });

        result.unshift({title:'All', value:'ALL'});

        return result;
    }

    loadFAFilters(){
        ActivitiesService.getFocusAreasList()
        .then((data) => {
            const list = data || [];
            this.setState({ focusAreas: this.getFocusAreaMeta(list) });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while getting activity categories");
        });
    }

    getClubMeta(list) {
        let result = list.map((item) => {
            return {title: item.name, value: item.id}
        });

        result.unshift({title:'All', value: 0});

        return result;
    }

    loadClubFilters() {
        ActivitiesService.getClubsList()
        .then((data) => {
            const list = data || [];
            this.setState({ clubsList: this.getClubMeta(list) });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while getting activity categories");
        });
    }

    loadStatFilters(page) {
        switch (page) {
            case "club":
                this.setState({ activityStatuses: [{title:'All',value:'ALL'},{title:'Assigned',value:'ASSIGNED'},{title:'Unassigned',value:'UNASSIGNED'}] })            
                break;
            case "council":
                this.setState({ activityStatuses: [{title:'All',value:'ALL'},{title:'Open',value:'OPEN'},{title:'Closed',value:'CLOSED'}] })            
                break;
            case "admin":
                this.setState({ activityStatuses: [{title:'All',value:'ALL'},{title:'Assigned',value:'ASSIGNED'},{title:'Unassigned',value:'UNASSIGNED'},{title:'Approved',value:'APPROVED'},{title:'Rejected',value:'REJECTED'}] })            
                break;
            default:
                this.setState({ activityStatuses: [{title:'All',value:'ALL'},{title:'Assigned',value:'ASSIGNED'},{title:'Unassigned',value:'UNASSIGNED'}] })            
                break;
        }
    }

    getActivitieslist(pageNo = 0) {
        let urlQuery = '?status=' + this.state.filterStatus;
        let clubUrlQuery = '&difficulty=' + this.state.filterDiff + '&focusArea=' + this.state.filterFA;
        let councilQuery = '&club=' + this.state.filterClub;

        if(this.activeRole == 'ROLE_CLUB_PRESIDENT') {
            urlQuery += clubUrlQuery;
        } else if(this.activeRole == 'ROLE_RIVER_COUNCIL') {
            urlQuery += councilQuery;
        } else if (this.activeRole == 'ROLE_SUPER_ADMIN') {
            urlQuery += clubUrlQuery + councilQuery;
        }

        ActivitiesService.getActivities(pageNo, urlQuery).
        then((data) => {
            this.activitiesList = data;
            if(pageNo === 0) {
                this.props.activitiesListReplace(data)
            } else {
                this.props.activitiesListPush(data);                
            }
            if(data.length > 0) {
                this.setState({ pageNo: pageNo });
            }
        }).
        catch((error) => {
            riverToast.show("Something went wrong while fetching activities list");
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activities);