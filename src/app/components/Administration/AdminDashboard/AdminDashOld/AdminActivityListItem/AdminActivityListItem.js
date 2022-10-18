import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';
import Dock from 'react-dock';

import AdminActivityTile from '../AdminActivityTile/AdminActivityTile';
//import AssignActivityTile from '../../AssignActivityTile/AssignActivityTile';
//import SelfAssignActivityTile from '../../SelfAssignActivityTile/SelfAssignActivityTile';
import ExpandableWrapper from '../../../../Common/ExpandableWrapper/ExpandableWrapper';
import {SearchWidget} from '../../../../Common/SearchWidget/SearchWidget';
import ClubSelect from '../../../../Common/ClubSelect/ClubSelect';
import {Util} from "../../../../../Util/util";
import {AdminDashboardService} from '../AdminDashboard.service';
import AppConfig from "../../../../../Util/Constants/AppConfig";
import { Toast, riverToast } from '../../../../Common/Toast/Toast';

import './AdminActivityListItem.scss';

const PAGE_SIZE = 10;
let CURRENT_PAGE_NO = 0;

export default class AdminActivityListItem extends Component {
    constructor(props){
        super(props);

        this.state = {
            activity: this.props.masterActivity,
            activityDetail: {},
            isAssigningActivity: false,
            isExpanded: false,
            masterActivityInfo: {},
            assignedActivityList: [],
            activity: this.props.activity,
            activityDetail: {},
            isActivityDockVisible:false,
            masterActivityFullDetails:  "",
            assignedActivityCount: 0,
            completedActivityCount: 0,
            presidentApprovedActivityCount: 0,
            pointCreditedActivityCount: 0,
            selectedStatusFilter: 'all',
            searchTerm: '',
            isLoadMoreShow: true
        };
    }

    componentDidMount() {
        this.setState({assignedActivityCount: this.props.masterActivity.assignedActivityCount});
        this.setState({completedActivityCount: this.props.masterActivity.completedActivityCount});
        this.setState({presidentApprovedActivityCount: this.props.masterActivity.presidentApprovedActivityCount});
        this.setState({pointCreditedActivityCount: this.props.masterActivity.pointCreditedActivityCount || 0});
        if (this.props.isExpand) {
            this.setState({isExpanded: true});
            //const searchString = 'ACTJPTDNXDE';//this.props.isExpand; // HARD CODED
            const searchString = this.props.isExpand || "";
            this.activityExpandClick(this.props.masterActivity, 'partial', searchString, '', 0);
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({...this.state,
                       assignedActivityCount: nextProps.masterActivity.assignedActivityCount,
                       completedActivityCount: nextProps.masterActivity.completedActivityCount,
                       presidentApprovedActivityCount: nextProps.masterActivity.presidentApprovedActivityCount,
                       pointCreditedActivityCount: nextProps.masterActivity.pointCreditedActivityCount
                      });
    }

    componentDidUpdate(prevProps) {
        const mAct = this.props.masterActivity;
        const tAct = prevProps.masterActivity;
        /*if(tAct.assignedActivityCount !== this.state.assignedActivityCount){
            this.setState({assignedActivityCount: mAct.assignedActivityCount});
        }*/
        /*if(tAct.completedActivityCount !== this.state.completedActivityCount){
            this.setState({completedActivityCount: mAct.completedActivityCount});
        }
        if(tAct.presidentApprovedActivityCount !== this.state.presidentApprovedActivityCount){
            this.setState({presidentApprovedActivityCount: mAct.presidentApprovedActivityCount});
        }
        if(tAct.pointCreditedActivityCount !== this.state.pointCreditedActivityCount){
            this.setState({pointCreditedActivityCount: mAct.pointCreditedActivityCount});
        }*/
        if (this.props.isExpand &&  this.props.isExpand !== prevProps.isExpand) {
            if (this.props.isExpand) {
                this.setState({isExpanded: true});
                const searchString = this.props.isExpand || "";
                this.activityExpandClick(this.props.masterActivity, 'partial', searchString, '', 0);
            }
        }
    }

    render() {
        const { masterActivity } = this.props;
        const { activity, isAssigningActivity, isExpanded } = this.state;
        let approvers;
        if (this.state.masterActivityFullDetails && this.state.masterActivityFullDetails.approvers) {
            approvers = this.state.masterActivityFullDetails.approvers.map((approver, index) => {
                return <div className="item" key={index}>
                    <div className="name">{approver.name}</div>
                    <div className="type">{approver.type}</div>
                </div>
            });
        }
        return (
            <div className="selected-activity-list-item">
                <ExpandableWrapper
                    className={(this.state.isExpanded ? 'expanded':'')}
                    isExpanded={isExpanded}
                    head={this.getActivityHead(masterActivity)} 
                    body={this.getActivityBody(masterActivity)}
                    onArrowClick={this.onHandleArrowClick.bind(this)}
                    isExpandClick={this.activityExpandClick.bind(this, masterActivity)} />  
                <Dock size={0.5} position='right' className="dock" isVisible={this.state.isActivityDockVisible}>
                    <div className="master-close-container" style={{position: "absolute",left: "0px"}} onClick={this.hideActivityDock}><Icon>close</Icon> Close</div>
                    <div className="dock-content-wrapper">
                        <div className="master-activity content-container">
                            <h6>{this.state.masterActivityFullDetails.title || ''}</h6>
                            <p className="text-sub">{this.state.masterActivityFullDetails.pointDesc || ""}</p>
                            {this.state.masterActivityFullDetails.description &&
                                <div>
                                    <h5>Description</h5>
                                    <div className="description-textbox" disabled>{this.state.masterActivityFullDetails.description || ''}</div>
                                </div>
                            }
                            {this.state.masterActivityFullDetails.rules &&
                                <div>
                                    <h5>Rules</h5>
                                    <div className="description-textbox" disabled>{this.state.masterActivityFullDetails.rules || ''}</div>
                                </div>
                            }
                            <div className="dock-list-content-container">
                                <div className="dock-list-container">
                                    <div className="dock-list-content">
                                        <b className="dock-header">MANDATORY</b>
                                        <p className="dock-detail">{!this.state.masterActivityFullDetails.mandatory ? "NO" : "YES"}</p>
                                    </div>
                                    <div className="dock-list-content">
                                        <b className="dock-header">INTER CLUB COLLABORATION</b>
                                        <p className="dock-detail">{!this.state.masterActivityFullDetails.interClub ? "NO" : "YES"}</p>
                                    </div>
                                </div>
                                <div className="dock-list-container">
                                    <div className="dock-list-content">
                                        <b className="dock-header">SELF ASSIGNABLE</b>
                                        <p className="dock-detail">{!this.state.masterActivityFullDetails.selfAssignable ? "NO" : "YES"}</p>
                                    </div>
                                    {/*<div className="dock-list-content">
                                        <b className="dock-header">MAX MEMBER POINT</b>
                                        <p className="dock-detail">{this.state.masterActivityFullDetails.maxMemberPoint}</p>
                                    </div>*/}
                                </div>
                                {/*<div className="dock-list-container">
                                    <div className="dock-list-content">
                                        <b className="dock-header">VALID FROM</b>
                                        <p className="dock-detail">{moment.unix(this.state.masterActivityFullDetails.validFrom/1000).format("DD MMM YYYY")}</p>
                                    </div>
                                    <div className="dock-list-content">
                                        <b className="dock-header">VALID TILL</b>
                                        <p className="dock-detail">{moment.unix(this.state.masterActivityFullDetails.validTo/1000).format("DD MMM YYYY")}</p>
                                    </div>
                                </div>*/}
                                {/*<div className="dock-list-container">
                                    <div className="dock-list-content">
                                        <b className="dock-header">CLUB POINT</b>
                                        <p className="dock-detail">{this.state.masterActivityFullDetails.clubPoint}</p>
                                    </div>
                                </div>*/}
                                <div className="dock-list-container">
                                    <div className="dock-list-content">
                                        <b className="dock-header">CLUB ASSESMENT PERIOD</b>
                                        <p className="dock-detail">{this.state.masterActivityFullDetails.clubAssesmentPeriod}</p>
                                    </div>
                                </div>
                                <div className="dock-list-container">
                                    <div className="dock-list-content">
                                        <b className="dock-header">MEMBER ASSESMENT PERIOD</b>
                                        <div className="item-content">
                                            {this.state.masterActivityFullDetails.memberAssesmentPeriod}
                                        </div>
                                    </div>
                                </div>
                                {this.state.masterActivityFullDetails.approvingMethod ?
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">APPROVING METHOD</b>
                                            <p className="dock-detail">
                                                {this.state.masterActivityFullDetails.approvingMethod}
                                            </p>
                                        </div>
                                    </div>:''
                                }
                                {this.state.masterActivityFullDetails.clubPointDistribution ?
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">CLUB POINT DISTRIBUTION</b>
                                            <div className="dock-detail">
                                                {this.state.masterActivityFullDetails.clubPointDistribution}
                                            </div>
                                        </div>
                                    </div>:''
                                }
                                {this.state.masterActivityFullDetails.memberPointDistribution ?
                                    <div className="dock-list-container-full-width">
                                        <b className="dock-header">MEMBER POINT DISTRIBUTION</b>
                                        <p className="item-content">
                                            {this.state.masterActivityFullDetails.memberPointDistribution}
                                        </p>
                                    </div>:''
                                }
                                {approvers ?
                                    <div className="dock-list-container-full-width">
                                        <b className="dock-header">APPROVERS</b>
                                        <div className="item-content">
                                            {approvers}
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

        );
    }

    onHandleArrowClick() {
        this.setState({isExpanded: !this.state.isExpanded});
        this.setState({isAssigningActivity: false});
    }

    showActivityDock = () => {
        console.log('-------start---------')
        this.setState({
            ...this.state,
            isActivityDockVisible:true
        },()=>{
            console.log(this.state.isActivityDockVisible);
        });
        console.log('-------end---------')
    }

    hideActivityDock = () => {
        console.log('-------start---------')
        this.setState({
            ...this.state,
            isActivityDockVisible:false
        },()=>{
            console.log(this.state.isActivityDockVisible);
        });
        console.log('-------end---------')
    }

    updateCount(updateVal){
        //let { assignedActivityCount, completedActivityCount, presidentApprovedActivityCount, pointCreditedActivityCount } = //this.state;
        const updatedState = {
            ...this.state,
            ...updateVal
        };
        this.setState(updatedState);
    }

getActivityHead(activity) {
    //const { assignedActivityCount, completedActivityCount, presidentApprovedActivityCount, pointCreditedActivityCount } = this.state;
    const { assignedActivityCount, completedActivityCount, presidentApprovedActivityCount, pointCreditedActivityCount } = this.state;
    const adminPrivilige = Util.hasPrivilage('VIEW_ADMIN_DASHBOARD') ? 'VIEW_ADMIN_DASHBOARD' : false;
    return <div className="activity-head" id={this.props.isExpand ? this.props.isExpand : ''}>
        <div className="title-section">
            {/*<div className="action" title="Details" onClick={this.onDockServices.bind(this)}><Icon>info</Icon></div>*/}
            <div className="title">
                <h1 className="title-main" onClick={this.onDockServices.bind(this)}>{activity.title || ''}</h1>
                <span className="title-sub">{activity.pointDesc || ''}</span>
            </div>
            <div className="status"></div>
        </div>
        <div className="bottom-section">
            <Button className="btn-expand-toggle" onClick={this.onToggleExpandClick.bind(this, this.state.isExpanded, activity)} fab >
                <Icon>{this.state.isExpanded? "expand_less" : "expand_more"}</Icon>
            </Button>
            {(adminPrivilige == 'VIEW_ADMIN_DASHBOARD') ?
                <div title="Activity Assigned" className="activity-count assigned" onClick={this.onCountClick.bind(this, 'A')}>
                    {assignedActivityCount || 0}
                </div>:''
            }
            {(adminPrivilige == 'VIEW_ADMIN_DASHBOARD') ?
                <div title="User Completed" className="activity-count completed" onClick={this.onCountClick.bind(this, 'C')}>
                    {completedActivityCount || 0}
                </div>:''
            }
            <div title="Pending Panel approval" className="activity-count president-approved" onClick={this.onCountClick.bind(this, 'PA')}>
                {presidentApprovedActivityCount || 0}
            </div>
            {(adminPrivilige == 'VIEW_ADMIN_DASHBOARD') ?
                <div title="Point credited" className="activity-count points-credited" onClick={this.onCountClick.bind(this, 'PC')}>
                    {pointCreditedActivityCount || 0}
                </div>:''
            }
        </div>
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

onCountClick(statusFlag) {
    const { masterActivity } = this.props;
    CURRENT_PAGE_NO = 0;
    this.setState({isExpanded: true});
    this.setState({isAssigningActivity: false});
    this.setState({selectedStatusFilter: statusFlag});
    this.activityExpandClick(masterActivity, 'partial', this.state.searchTerm, statusFlag);
}

onChangeSelectedTile(selectedTile){
    this.setState({selectedTile});
}

getActivityBody(masterActivity) {
    let assignedActivityElements;
    if (this.state.assignedActivityList && this.state.assignedActivityList.length > 0) {
        assignedActivityElements = this.state.assignedActivityList.map((activity, index) => {
            return <AdminActivityTile onActionCompleted={this.onActionCompleted.bind(this)} key={index} className={"activity-tile"} masterActivity={masterActivity} activity={activity} updateCount={this.updateCount.bind(this)} selectedTile={this.state.selectedTile} onChangeSelectedTile={this.onChangeSelectedTile.bind(this)} />
        });
    } /*else {
        assignedActivityElements = <div className="placeholder">No assigned activities found</div>
    }*/

    /*if(this.state.isAssigningActivity){
        assignedActivityElements.push(<div className="placeholder">No assigned activities found</div>);
    }*/


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
                            {activityInfo.interClub ? 'Yes' : 'No'}
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-head">
                            Mandatory
                        </div>
                        <div className="item-content">
                            {activityInfo.mandatory ? 'Yes' : 'No'}
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-head">
                            Self assignable
                        </div>
                        <div className="item-content">
                            {activityInfo.selfAssignable ? 'Yes' : 'No'}
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
        <div className="assign-activity-search-wrapper">                    
            <SearchWidget onChange={(value) => {
                    this.setState({searchTerm: value});
                }} onSearch={this.onSearchAssignActivity.bind(this)} onClear={this.onClearAssignActivitySearch.bind(this)} />
        </div>
        <div className="status-filter-wrapper">
            <ClubSelect selected={this.state.selectedStatusFilter} placeholder="Status filter" source={this.normalizeStatusForClubSelect()} onSelect={(value) => {
                    this.setState({selectedStatusFilter: value});
                    CURRENT_PAGE_NO = 0;
                    this.activityExpandClick(masterActivity, 'partial', this.state.searchTerm, value);
                }}/>
        </div>
        <div className="activity-body">
            {this.state.isAssigningActivity && 
                <AssignActivityTile className="new-assign-activity" masterActivity={masterActivity}
                    onSuccess={this.onAssignSuccess.bind(this)}/>
            }
            {assignedActivityElements}
            {((this.state.assignedActivityList && this.state.assignedActivityList.length === 0) && !this.state.isAssigningActivity) && (
                <h5 className="no-activity-notification">No Assigned activities found</h5>
            )}
            {this.state.isLoadMoreShow && this.state.assignedActivityList.length > 0 ?
                <div className="page-action">
                    <div className="action-item" onClick={this.loadMoreAssignedActivities.bind(this)}>Load more</div>
                </div>:''
            }
        </div>
    </div>;
}

loadMoreAssignedActivities() {
    const { masterActivity } = this.props;
    const { searchTerm,  selectedStatusFilter} = this.state;
    CURRENT_PAGE_NO++;
    this.activityExpandClick(masterActivity, 'partial', searchTerm, selectedStatusFilter, CURRENT_PAGE_NO);
}

normalizeStatusForClubSelect() {
    const role = Util.getActiveRole().value;
    const statusList = Util.getActivityStatusList(role);
    const normalizedArray = [{
        label: 'All',
        value: 'all'
    }];
    statusList.forEach((status, index) => {
        normalizedArray.push({
            label: status.label,
            value: status.code
        });
    });

    return normalizedArray;
}

onDockServices(){
    this.getActivityFullDetail();
    this.showActivityDock();
}

onSearchAssignActivity(text) {
    const { masterActivity } = this.props;
    const { searchTerm } = this.state;
    this.activityExpandClick(masterActivity, 'partial', searchTerm);
}

onClearAssignActivitySearch(needApiCall = true) {
    const { masterActivity } = this.props;
    this.setState({searchTerm: ''});
    this.activityExpandClick(masterActivity);
}

getCurrentRoleVariable(){
    const adminPrivilige = Util.hasPrivilage('VIEW_ADMIN_DASHBOARD') ? 'VIEW_ADMIN_DASHBOARD' : false;
    let roleVariable;
    roleVariable = "president"
    return roleVariable;
}

getActivityFullDetail(){
    const masterActivityId = this.props.masterActivity.id;
    console.log(masterActivityId);

    const roleVariable = this.getCurrentRoleVariable();

    AdminDashboardService.mainActivitiesFullDetails(roleVariable,masterActivityId,"full")
        .then((data) => {
        this.setState({...this.state, masterActivityFullDetails: data.activityInfo});
    })
        .catch((error) => {
        console.log(error);
        riverToast.show("Something went wrong while fetching Masteractivity id (Details) ");
    });
}

onAssignNewActivityClick(activity) {

    if (this.state.isAssigningActivity && this.state.isExpanded) {
        this.setState({isExpanded: false});
    } else if (!this.state.isExpanded) {
        this.setState({isExpanded: true});
    }
    this.activityExpandClick(activity);
    this.setState({isAssigningActivity: !this.state.isAssigningActivity});
}

onAssignSuccess() {
    const { masterActivity } = this.props;
    this.setState({isAssigningActivity: false});
    this.activityExpandClick(masterActivity);
}

onActionCompleted(action) {
    const { masterActivity } = this.props;
    this.activityExpandClick(masterActivity);
}

activityExpandClick(masterActivity, context = 'partial', searchString = '', status = '', pageNo = 0) {
    let statusFilter;
    if (status) {
        statusFilter = status;
    } else {
        statusFilter = this.state.selectedStatusFilter;
    } 

    AdminDashboardService.getActivityDetail(masterActivity.id, context, (searchString || this.state.searchTerm), statusFilter, pageNo, PAGE_SIZE)
        .then((data) => {
        if (data && data.activityInfo) {
            this.setState({masterActivityInfo: data.activityInfo});
            this.setState({assignedActivityCount: data.activityInfo.assignedActivityCount});
            this.setState({completedActivityCount: data.activityInfo.completedActivityCount});
            this.setState({pointCreditedActivityCount: data.activityInfo.pointCreditedActivityCount || 0});
            this.setState({presidentApprovedActivityCount: data.activityInfo.presidentApprovedActivityCount});
            this.setState({selectedTile: false});
        }
        if (data && data.assignedActivities && data.assignedActivities.length > -1) {

            let assignedActivityList  = this.state.assignedActivityList || [];
            if (pageNo == 0) {
                assignedActivityList = data.assignedActivities;
            } else {
                assignedActivityList = assignedActivityList.concat(data.assignedActivities);
            }

            this.setState({assignedActivityList});
            this.setState({selectedTile: false});
            if (data.assignedActivities.length >= PAGE_SIZE) {
                this.setState({isLoadMoreShow: true});    
            } else {
                this.setState({isLoadMoreShow: false});   
            }
        } else {
            this.setState({isLoadMoreShow: false});
        }

        if (this.props.isExpand) {
            document.getElementById(this.props.isExpand).scrollIntoView();
        }
    })
        .catch((error) => {
        console.log(error);
        riverToast.show("Something went wrong while fetching activity detail");
    });
}
}