import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';
import Dock from 'react-dock';

import MyActivityTile from '../MyActivityTile/MyActivityTile';
import AssignActivityTile from '../AssignActivityTile/AssignActivityTile';
import SelfAssignActivityTile from '../SelfAssignActivityTile/SelfAssignActivityTile';
import ExpandableWrapper from '../../Common/ExpandableWrapper/ExpandableWrapper';
import {SearchWidget} from '../../Common/SearchWidget/SearchWidget';
import {Util} from "../../../Util/util";
import {CommonDashboardService} from '../CommonDashboard.service';
import {riverToast} from '../../Common/Toast/Toast';
import MyActivityDock from '../ActivityDock/MyActivityDock';
import AppConfig from "../../../Util/Constants/AppConfig";

import './MyActivityListItem.scss';

const PAGE_SIZE = 10;
const PRIVILEGE_CREATE_ACTIVITY = "CREATE_ACTIVITY";
let CURRENT_PAGE_NO = 0;

export default class MyActivityListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            activityDetail: {},
            isAssigningActivity: false,
            isExpanded: false,
            masterActivityInfo: {},
            assignedActivityList: [],
            activity: this.props.activity,
            activityDetail: {},
            isActivityDockVisible:false,
            isLoadMoreShow: true
        };
    }
    /*state = {
        activity: this.props.masterActivity,
        activityDetail: {},
        isAssigningActivity: false,
        isExpanded: false,
        masterActivityInfo: {},
        assignedActivityList: [],
        activity: this.props.activity,
        activityDetail: {},
        isActivityDockVisible:false,
        isLoadMoreShow: true
    };*/

    componentDidMount() {
        this.setState({assignedActivityCount: this.props.activity.activityInfo.assignedActivityCount});
        //this.setState({completedActivityCount: this.props.activity.activityInfo.completedActivityCount});
        //this.setState({presidentApprovedActivityCount: this.props.activity.activityInfo.presidentApprovedActivityCount});
        //this.setState({pointsCreditedActivityCount: this.props.activity.activityInfo.pointsCreditedActivityCount || 0});
        if (this.props.isExpand) {
            this.setState({isExpanded: true});
            //const searchString = 'ACTJPTDNXDE';//this.props.isExpand; // HARD CODED
            const searchString = this.props.isExpand || "";
            this.activityExpandClick(this.props.activity.activityInfo, 'partial', searchString, '', 0);
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.isExpand &&  this.props.isExpand !== prevProps.isExpand) {
            this.setState({isExpanded: true});
            const searchString = this.props.isExpand || "";
            this.activityExpandClick(this.props.activity.activityInfo, 'partial', searchString, '', 0);
        }
    }

    render() {
        //const { masterActivity } = this.props;
        const masterActivity = {...this.props.activity.activityInfo};
        const myActivity = this.props.activity.assignedActivities;
        const { activity, isAssigningActivity, isExpanded } = this.state;

        return (
            <div className="my-activity">
                <div className="activity-list-item">
                    <ExpandableWrapper
                        className={(this.state.isExpanded ? 'expanded':'')}
                        isExpanded={isExpanded}
                        head={this.getActivityHead(masterActivity,myActivity)} 
                        body={this.getActivityBody(masterActivity,myActivity)}
                        onArrowClick={this.onHandleArrowClick.bind(this)}
                        isExpandClick={this.activityExpandClick.bind(this, masterActivity)} />
                    <Dock size={0.5} position='right' className="dock" isVisible={this.state.isActivityDockVisible}>
                        <div className="dock-close-container" style={{position: "absolute",left: "0px"}} onClick={this.hideActivityDock}><Icon>close</Icon>Close</div>
                        <div className="dock-content-wrapper">
                            <div className="content-container">
                                <h5>{masterActivity.title || ''}</h5>
                                <p className="text-sub">{masterActivity.pointDesc || ""}</p>
                                {masterActivity.description &&
                                    <div className="dock-details-content">
                                        <h6>Description</h6>
                                        <div className="description-textbox" disabled>{masterActivity.description || ''}</div>
                                    </div>
                                }
                                {masterActivity.rules &&
                                    <div className="dock-details-content">
                                        <h6>Rules</h6>
                                        <div className="description-textbox" disabled>{masterActivity.rules || ''}</div>
                                    </div>
                                }
                                <div className="dock-list-content-container">
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">MANDATORY</b>
                                            <p className="dock-detail">{!masterActivity.mandatory ? "NO" : "YES"}</p>
                                        </div>
                                        <div className="dock-list-content">
                                            <b className="dock-header">INTER CLUB COLLABORATION</b>
                                            <p className="dock-detail">{masterActivity.interClub ? "YES" : "NO"}</p>
                                            {/*<p className="dock-detail">{(!masterActivity.interClub).toString()}</p>*/}
                                        </div>
                                    </div>
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">SELF ASSIGNABLE</b>
                                            <p className="dock-detail">{!masterActivity.selfAssignable ? "NO" : "YES"}</p>
                                        </div>
                                        {/* <div className="dock-list-content">
                                            <b className="dock-header">MAX MEMBER POINT</b>
                                            <p className="dock-detail">{masterActivity.maxMemberPoint}</p>
                                        </div>*/}
                                    </div>
                                    {/*<div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">VALID FROM</b>
                                            <p className="dock-detail">{moment.unix(masterActivity.validFrom/1000).format("DD MMM YYYY")}</p>
                                        </div>
                                        <div className="dock-list-content">
                                            <b className="dock-header">VALID TILL</b>
                                            <p className="dock-detail">{moment.unix(masterActivity.validTo/1000).format("DD MMM YYYY")}</p>
                                        </div>
                                    </div>*/}
                                    {/*<div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">CLUB POINT</b>
                                            <p className="dock-detail">{masterActivity.clubPoint}</p>
                                        </div>
                                    </div>*/}
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">CLUB ASSESMENT PERIOD</b>
                                            <p className="dock-detail">{masterActivity.clubAssesmentPeriod}</p>
                                        </div>
                                    </div>
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">MEMBER ASSESMENT PERIOD</b>
                                            <p className="dock-detail">{masterActivity.memberAssesmentPeriod}</p>
                                        </div>
                                    </div>
                                    {masterActivity.approvingMethod ?
                                        <div className="myactivity-dock-list-container-full-width">
                                            <b className="dock-header">APPROVING METHOD</b>
                                            <div className="item-content">
                                                {masterActivity.approvingMethod}
                                            </div>
                                        </div>:''
                                    }
                                    {masterActivity.clubPointDistribution ?
                                        <div className="myactivity-dock-list-container-full-width">
                                            <b className="dock-header">CLUB POINT DISTRIBUTION</b>
                                            <div className="item-content">
                                                {masterActivity.clubPointDistribution}
                                            </div>
                                        </div>:''
                                    }
                                    {masterActivity.memberPointDistribution ?
                                        <div className="myactivity-dock-list-container-full-width">
                                            <b className="dock-header">MEMBER POINT DISTRIBUTION</b>
                                            <div className="item-content">
                                                {masterActivity.memberPointDistribution}
                                            </div>
                                        </div>:''
                                    }
                                </div>
                                {/* {(myActivity && myActivity.length) && (
                                <table className="table-container">
                                <thead>
                                    <tr className="table-heading">
                                        <th>Key</th>
                                        <th>Value</th>
                                        <th>Key</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        myActivity[0].assignees.map(item => {
                                            return (
                                                <tr className="table-content">
                                                    <td className="table-date">{item.index}</td>
                                                    <td className="table-name">{item.name}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                                </table>
                                )
                            } */}
                                {/* <div className="assignee-tab">
                                <div className="assignee-data">
                                    <Icon>person</Icon>
                                    <b>Assignee name</b>
                                    <b>Status:<p>Panel rated</p></b>
                                </div>
                                <div className="assignee-input">
                                    <div className="upload-btn-wrapper">
                                        <button className="btn"><Icon>attach_file</Icon> Attachment</button>
                                        <input type="file" name="myfile" />
                                    </div>
                                    <div className="upload-btn-wrapper" style={{marginLeft:"2px"}}>
                                        <button className="btn" style={{backgroundColor:"#E8F8F6", color:"#0D9485"}}><Icon>attach_file</Icon> Attachment</button>
                                        <input type="file" name="myfile" />
                                    </div>
                                    <textarea className="description-textbox"/>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </Dock>
                </div>
            </div>

        );
    }

    onHandleArrowClick() {
        this.setState({isExpanded: !this.state.isExpanded});
        if (this.state.isExpanded) {
            this.setState({isAssigningActivity: false});
        }
    }

    showActivityDock = () => {
        //console.log('-------start---------')
        this.setState({
            ...this.state,
            isActivityDockVisible:true
        },()=>{
            //console.log(this.state.isActivityDockVisible);
        });
        //console.log('-------end---------')
    }

    hideActivityDock = () => {
        //console.log('-------start---------')
        this.setState({
            ...this.state,
            isActivityDockVisible:false
        },()=>{
            console.log(this.state.isActivityDockVisible);
        });
        //console.log('-------end---------')
    }
    getActivityHead(activity,myActivity) {
        const currentRole = Util.getActiveRole().value;
        //console.log(currentRole);
        return <div className="activity-head">
            <div className="title-section">
                {/*<div className="action" onClick={this.showActivityDock.bind(this)}><Icon>info</Icon></div>*/}
                <div className="title" onClick={this.showActivityDock.bind(this)}>
                    <h1 className="title-main" onClick={this.showActivityDock.bind(this)}>{activity.title || ''}</h1>
                    <span className="title-sub">{activity.pointDesc || ''}</span>
                </div>
                <div className="status"></div>
            </div>
            <div className="bottom-section">
                <Button className="btn-expand-toggle" onClick={this.onToggleExpandClick.bind(this, this.state.isExpanded, activity)} fab >
                    <Icon>{this.state.isExpanded? "expand_less" : "expand_more"}</Icon>
                </Button>
                <div className="activity-count selfassigned">
                    {this.state.masterActivityInfo.hasOwnProperty('assignedActivityCount')?this.state.masterActivityInfo.assignedActivityCount : activity.assignedActivityCount}
                </div>
                {/* <div className="activity-count completed">
                    {activity.completedActivityCount}
                </div>
                <div className="activity-count assigned">
                    {myActivity && myActivity.length}
                </div>
                <div className="activity-count completed">
                    {myActivity && myActivity.length}
                </div> */}
                {/*<div className="point-section" title="Member point: The maximum a member can score">
                    <Icon>person</Icon>
                    <div className="point">{activity.maxMemberPoint || 0}</div>
                </div>
                <div className="point-section">
                    <Icon>store</Icon>
                    <div className="point">{activity.clubPoint || 0}</div>
                </div>*/}
                {/*(Util.hasPrivilage(PRIVILEGE_CREATE_ACTIVITY) && (this.state.activity.activityInfo.selfAssignable)) &&
                    !AppConfig.isActivityAssignmentDisabled && <div className="action-section" title={this.state.isAssigningActivity ? 'Close' : 'Assign activity'} onClick={this.onAssignNewActivityClick.bind(this, activity)}>
                        {this.state.isAssigningActivity ?
                            <Icon>cancel</Icon>:
                            <Icon>add_circle</Icon>
                        }
                    </div>
                */}
                {(Util.hasPrivilage(PRIVILEGE_CREATE_ACTIVITY) && (activity.selfAssignable)) &&
                    !AppConfig.isActivityAssignmentDisabled && <div className="action-section" title={this.state.isAssigningActivity ? 'Close' : 'Assign activity'} onClick={this.onAssignNewActivityClick.bind(this, activity)}>
                        {this.state.isAssigningActivity ?
                            <Icon>cancel</Icon>:
                            <Icon>add_circle</Icon>
                        }
                    </div>
                }
            </div>
        </div>;
    }

onChangeSelectedTile(selectedTile){
    this.setState({selectedTile});
}

getActivityBody(masterActivity,myActivity) {
    let assignedActivityElements;
    if (this.state.assignedActivityList && this.state.assignedActivityList.length > 0) {
        assignedActivityElements = this.state.assignedActivityList.map((activity, index) => {
            return <MyActivityTile onActionCompleted={this.onActionCompleted.bind(this)} key={activity.id} className={"activity-tile"} masterActivity={masterActivity} activity={activity} selectedTile={this.state.selectedTile} onChangeSelectedTile={this.onChangeSelectedTile.bind(this)} />
        });
    }

    const activityInfo = this.state.masterActivityInfo || {};

    return <div className="activity-body-wrapper">
        <div className="into-wrapper">
            <div className="activity-info">
                <div className="activity-info-row">
                    <div className="full-length-text">
                        {activityInfo.description}
                    </div>
                </div>
                <div className="activity-info-row">
                    <div className="item">
                        <div className="item-head">
                            Inter club
                        </div>
                        <div className="item-content">
                            {masterActivity.interClub ? 'Yes' : 'No'}
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-head">
                            Mandatory
                        </div>
                        <div className="item-content">
                            {masterActivity.mandatory ? 'Yes' : 'No'}
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-head">
                            Self assignable
                        </div>
                        <div className="item-content">
                            {masterActivity.selfAssignable ? 'Yes' : 'No'}
                        </div>
                    </div>

                </div>
                {activityInfo.rules &&
                    <div className="activity-info-column">
                        <div className="item-head">Rules</div>
                        <div className="full-length-text">
                            {activityInfo.rules}
                        </div>
                    </div>
                }
            </div>
        </div>
        {(myActivity !== null) && (
            <div className="assign-activity-search-wrapper">
                {/* <SearchWidget isVisible={false} onSearch={this.onSearchActivity.bind(this)} onClear={this.onClearActivitySearch.bind(this)} /> */}
            </div>
        )
        }
        {((this.state.assignedActivityList.length ===0 && myActivity === null) || (this.state.assignedActivityList.length === 0) && (!this.state.isAssigningActivity)) && (
            <h5 className="no-activity-notification">No Assigned activities found</h5>
        )
        }
        {
            <div className="activity-body" style={{width:"100%"}}>
                {this.state.isAssigningActivity && 
                    <SelfAssignActivityTile className="new-assign-activity" masterActivity={masterActivity}
                        onSuccess={this.onAssignSuccess.bind(this)} onClose={this.onSelfAssignActivitySelfDelete.bind(this)}/>
                }
                {assignedActivityElements}
                { myActivity !== null && this.state.isLoadMoreShow ?
                    <div className="page-action">
                        <div className="action-item" onClick={this.loadMoreAssignedActivities.bind(this)}>Load more</div>
                    </div>:''
                }
            </div>
        }
    </div>;
}

onToggleExpandClick(isExpanded, masterActivity){
    if(isExpanded){
        this.onHandleArrowClick(this);
    }
    else{
        this.onHandleArrowClick(this);
        this.activityExpandClick(masterActivity);
    }
}

/*onDockServices(){
        this.getActivityFullDetail();
        this.showActivityDock();
    }

    getActivityFullDetail(){
        const masterActivityId = this.props.activity.activityInfo.id;
        //console.log(masterActivityId);
        CommonDashboardService.assignedActivitieFullDetails(masterActivityId)
        .then((data) => {
           //console.log(data);
        })
        .catch((error) => {
            //console.log(error);
            riverToast.show("Something went wrong while fetching Masteractivity id (Details) ");
        });
    }*/

loadMoreAssignedActivities() {
    const masterActivity = this.props.activity.activityInfo;
    CURRENT_PAGE_NO++;
    this.activityExpandClick(masterActivity, 'partial', '', '', CURRENT_PAGE_NO);
}

onSearchActivity(text) {
    //console.log(text);
    const masterActivityId = this.props.activity.activityInfo.id;
    //console.log(masterActivityId);
    this.activitySearch(masterActivityId,text);
}

onClearActivitySearch() {
    const masterActivityId = this.props.activity.activityInfo.id;
    //console.log('cleared');
    this.activitySearch(masterActivityId,'');
}

onSearchAssignActivity(text) {
    const { masterActivity } = this.props;
    this.activityExpandClick(masterActivity, 'partial', text);
}

onClearAssignActivitySearch() {
    const { masterActivity } = this.props;
    this.activityExpandClick(masterActivity);
}

onAssignNewActivityClick(activity) {

    if (this.state.isAssigningActivity && this.state.isExpanded) {
        this.setState({isExpanded: false});
    } else if (!this.state.isExpanded) {
        this.setState({isExpanded: true});
    }

    this.setState({isAssigningActivity: !this.state.isAssigningActivity});
    this.activityExpandClick(activity);
}

onAssignSuccess() {
    const masterActivity = this.props.activity.activityInfo;
    this.setState({isAssigningActivity: false});
    this.activityExpandClick(masterActivity);
}

onActionCompleted(action) {
    const { masterActivityInfo } = this.state;
    if(action === 'delete'){
        const pageSize = (CURRENT_PAGE_NO + 1) * PAGE_SIZE;
        CURRENT_PAGE_NO = 0;
        return this.activityExpandClick(masterActivityInfo, 'partial', '', '', CURRENT_PAGE_NO, pageSize);
    }
    return this.activityExpandClick(masterActivityInfo);
}
getStatusObject(statusCode) {
    let statusObj;
    const statusList = Util.getActivityStatusList();
    statusList.forEach(status => {
        if (status.code == statusCode) {
            statusObj = status
        }
    });

    return statusObj.label;
}
onSelfAssignActivitySelfDelete() {
    this.setState({isAssigningActivity: false});
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//activityExpandClick(masterActivity, pageNo = 0) {
activityExpandClick(masterActivity, context = 'partial', searchString = '', status = '', pageNo = 0, pageSize = PAGE_SIZE) {
    return CommonDashboardService.assignedActivitieFullDetails(masterActivity.id, searchString, pageNo, pageSize)
        .then((data) => {
        //console.log(data);
        if (data && data.activityInfo) {
            this.setState({masterActivityInfo: data.activityInfo});
            this.setState({assignedActivityCount: data.activityInfo.assignedActivityCount});
            this.setState({selectedTile: false});
        }
        if (data && data.assignedActivities && data.assignedActivities.length > -1) {
            // this.setState({assignedActivityList: data.assignedActivities});
            let assignedActivityList  = this.state.assignedActivityList || [];
            if (pageNo == 0) {
                assignedActivityList = data.assignedActivities;
            } else {
                assignedActivityList = assignedActivityList.concat(data.assignedActivities);
            }

            this.setState({assignedActivityList});
            this.setState({selectedTile: false});
            if (data.assignedActivities.length < PAGE_SIZE) {
                this.setState({isLoadMoreShow: false});    
            } else {
                this.setState({isLoadMoreShow: true});    
            }
        }
        /*if(data && data.assignedActivities && data.assignedActivities.length === 0){
            assignedActivityList = data.assignedActivities;
        }*/
    })
        .catch((error) => {
        //console.log(error);
        riverToast.show("Something went wrong while fetching activity detail");
    });
}

activitySearch(masterActivityId,text) {
    CommonDashboardService.assignedActivitieFullDetailsSearch(masterActivityId,text)
        .then((data) => {
        //console.log(data);
        if (data && data.activityInfo) {
            this.setState({masterActivityInfo: data.activityInfo});
        }
        if (data && data.assignedActivities && data.assignedActivities.length > 0) {
            this.setState({assignedActivityList: data.assignedActivities});
        }
    })
        .catch((error) => {
        //console.log(error);
        riverToast.show("Something went wrong while fetching activity detail");
    });
}

/*activityExpandClick(masterActivity, context = 'partial', searchString = '') {
        CommonDashboardService.getActivityDetail(masterActivity.id, context, searchString)
        .then((data) => {
           //console.log(data);
            if (data && data.activityInfo) {
                this.setState({masterActivityInfo: data.activityInfo});
            }
            if (data && data.assignedActivities && data.assignedActivities.length > 0) {
                this.setState({assignedActivityList: data.assignedActivities});
            }
        })
        .catch((error) => {
            //console.log(error);
            riverToast.show("Something went wrong while fetching activity detail");
        });
    }*/
}