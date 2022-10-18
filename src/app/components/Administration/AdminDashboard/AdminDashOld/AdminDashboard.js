import React, {Component} from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import {Line, Bar} from 'react-chartjs-2';
import {Chart} from 'react-google-charts';
import moment from 'moment';
import Tooltip from 'material-ui/Tooltip';
import Radio from 'material-ui/Radio';
import Dock from 'react-dock';
import Checkbox from 'material-ui/Checkbox';
import Datetime from 'react-datetime';

import {Root} from "../../../Layout/Root";

import {Util} from "../../../../Util/util";
import {MainContainer} from "../../../Common/MainContainer/MainContainer";
import ClubSelect from '../../../Common/ClubSelect/ClubSelect';
import {PageTitle} from '../../../Common/PageTitle/PageTitle';
import {riverToast} from '../../../Common/Toast/Toast';
import {SelectBox} from '../../../Common/SelectBox/SelectBox';
import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';
import ClubButton from '../../../Common/ClubButton/ClubButton';
//import MasterActivityDock from './MasterActivityDock/MasterActivityDock';
import ActivityDock from '../../../Common/ActivityDock/ActivityDock';
import { SearchWidget } from '../../../Common/SearchWidget/SearchWidget';
import AdminActivityListItem from './AdminActivityListItem/AdminActivityListItem';
import AppConfig from "../../../../Util/Constants/AppConfig";
//import ActivitySummary from "./ActivitySummary/ActivitySummary";

import './AdminDashboard.scss';

// actions
import {
    setClubPoints,
    setPointsDiff,
    loadPillarStats,
    clearPillarStats,
    loadActivitiesList,
    loadVoicesList,
    loadCommitmentsList,
    setTargetAchieved,
    loadTopUsersList,
    setClubTarget,
    setBODUserSearchResult,
    setBODUserSelected,
    loadMembersList,
    loadMasterActivitiesList,
    fieldChange,
    pushActivitiesList,
    pushVoicesList,
    pushCommitmentsList,
    loadRecentMeetings,
    loadCudsList,
    pushCudsList
} from './AdminDashboard.actions';
import {AdminDashboardService} from './AdminDashboard.service';

const VIEW_ADMIN_DASHBOARD = "VIEW_ADMIN_DASHBOARD";

const mapStateToProps = (state, ownProps) => {
    return {commonDash: state.AdminDashboardReducer}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setClubPoints: (clubPoints) => {
            dispatch(setClubPoints(clubPoints));
        },
        setPointsDiff: (points) => {
            dispatch(setPointsDiff(points))
        },
        loadPillarStats: (pillarStats) => {
            dispatch(loadPillarStats(pillarStats))
        },
        clearPillarStats: () => {
            dispatch(clearPillarStats())
        },
        loadActivitiesList: (activitiesList) => {
            dispatch(loadActivitiesList(activitiesList))
        },
        loadVoicesList: (voicesList) => {
            dispatch(loadVoicesList(voicesList))
        },
        loadCommitmentsList: (commitmentsList) => {
            dispatch(loadCommitmentsList(commitmentsList))
        },
        setTargetAchieved: (percent) => {
            dispatch(setTargetAchieved(percent));
        },
        loadTopUsersList: (list) => {
            dispatch(loadTopUsersList(list))
        },
        setClubTarget: (points) => {
            dispatch(setClubTarget(points))
        },
        setBODUserSearchResult: (list) => {
            dispatch(setBODUserSearchResult(list))
        },
        setBODUserSelected: (list) => {
            dispatch(setBODUserSelected(list))
        },
        loadMembersList: (list) => {
            dispatch(loadMembersList(list))
        },
        loadMasterActivitiesList: (list) => {
            dispatch(loadMasterActivitiesList(list))
        },
        fieldChange: (field, value) => {
            dispatch(fieldChange(field, value))
        },
        pushActivitiesList: (list) => {
            dispatch(pushActivitiesList(list))
        },
        pushVoicesList: (list) => {
            dispatch(pushVoicesList(list))
        },
        pushCommitmentsList: (list) => {
            dispatch(pushCommitmentsList(list))
        },
        loadRecentMeetings: (meeting) => {
            dispatch(loadRecentMeetings(meeting))
        },
        loadCudsList: (list) => {
            dispatch(loadCudsList(list))
        },
        pushCudsList: (list) => {
            dispatch(pushCudsList(list))
        }
    }
}

class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        const privileges = Util.getLoggedInUserDetails().currentPrivileges;
        this.state = {
            pillarBarType: 0,
            lastWeekPageNo: 0,
            selectedValue:"all",
            topClub: "",
            myClub: "",
            pillarBar: [
                'Yearly Chart', 'Monthly Chart', 'Yearly Chart'
            ],
            summaryTableTabValue: 0,
            assigneesList: [],
            setupDone: true,
            activeStep: 0,
            activitiesPageNo: 0,
            isLoadMoreShow: true,
            activitiesCategory: 'all',
            activitiesLevel: 'all',
            voicesPageNo: 0,
            commitmentsPageNo: 0,
            activityCategories: [],
            isVisible: false,
            selectedMasters: [],
            customizeActivityDialog: false,
            unFinished: true,
            pageInitializing: true,
            filterFA: 'ALL',
            filterDiff: 'ALL',
            filterStatus: 'ALL',
            filterClub: 0,
            clubsList: [],
            activityDifficulties: [{title:'All',value:'ALL'},{title:'Easy',value:'EASY'},{title:'Difficult',value:'DIFF'},{title:'Very Diffiult',value:'VDIF'}],
            activityStatuses: [],
            councilsList: [],
            title: privileges.indexOf(VIEW_ADMIN_DASHBOARD) > -1 ? 'Admin Dashboard' : 'Audit Dashboard',
            page: '',
            cudsPageNo: 0,
            councilStats: '',
            filterStatusVoice: 'ALL',
            filterTypeVoice: 'ALL',
            voiceTypes: [],
            voiceStatuses: [],
            isRecentMeetingActionsOpen: false,
            clubmembersList:[],
            isAddNewCommitment: false,
            commitmentDescription: '',
            commitmentDate: Math.round(new Date().getTime()/1000),
            commitmentTitle: '',
            commitmentStatusList: [],
            isPresidentSetupComplete: true,
            isCheckAllActivity: false,
            clubNameList: [],
            activitySummary: [],
            activitySummaryDetailsList: []
        };
        this.adminPrivilige = '';
    }

    componentDidMount() {
        this.adminPrivilige = Util.hasPrivilage('VIEW_ADMIN_DASHBOARD') ? 'VIEW_ADMIN_DASHBOARD' : false;
        this.clubDashInit();
    }

    render() {
        const activityTableRows = (this.props.commonDash && this.props.commonDash.activitiesList)
        ? this
        .props
        .commonDash
        .activitiesList
        .map((item, index) => {
            return <AdminActivityListItem
                       key={index}
                       masterActivity={item}
                       isExpand={item.shouldExpandRefId || false} />
        })
        : false;

        const masterActivities = (this.props.commonDash && this.props.commonDash.masterActivities) ? this.props.commonDash.masterActivities.map((activity, index) => {

            let infotooltip = "Select this entry";
            let isSelected = activity.isMandatory || this.state.selectedMasters.includes(activity.id);
            let isDisabled = activity.isMandatory || (activity.isShortListed && activity.unSelectable);

            if(activity.isShortListed){
                infotooltip = "On Going Activity";
            }
            if(activity.isMandatory){
                infotooltip = "Mandatory";
            }

            return  <div className="master-activity-item" key={index}>
                <div className="selector">
                    <Tooltip title={infotooltip}>
                        <div>   
                            <Checkbox
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={(event) => {this.handleMasterCheckBoxChange(event, activity.id, index)}}
                                value="checkedB"
                                color="accent"
                                className="checkbox"
                                /> 
                        </div>
                    </Tooltip>
                </div>
                <div className="title">
                    <div className="value" onClick={this.onMasterActivityClick.bind(this, activity, index)}>{activity.shortlisted ? activity.shortlisted.title : activity.title}</div>
                </div>
                {/* <div className="customize" onClick={this.toggleCustomizeActivityDialog.bind(this, activity, index)}>Customize</div> */}
            </div>
        }) : [];

        return (
            <div>
                    {
                        this.state.pageInitializing ?
                            <div className="initializing">
                                Page is getting initialized
                            </div>
                            :
                        this.state.setupDone ? 
                            <div className="common-dashboard-container">
                                <div className="dashboard-datas">
                                    {/*<ActivitySummary
                                        activitySummary={this.state.activitySummary}
                                        activitySummaryDetailsList={this.state.activitySummaryDetailsList}
                                        clubNameList={this.state.clubNameList}
                                        loadActivitySummary={this.loadActivitySummary.bind(this)}
                                        loadActivitySummaryDetails={this.loadActivitySummaryDetails.bind(this)}
                                        />*/}
                                    <div className="tab-container compare">
                                        <div className="compare-top-percent-container">
                                            {
                                                this.state.page == 'club' &&
                                                    <div className="compare-top-container">
                                                        <div className="top-club others">
                                                            {/*<span className="top-club-value">{this.getClubPoint()}</span>*/}
                                                            <span className="top-club-value">{this.state.totalPoint}</span>
                                                            <span className="top-club-text">Club points</span>
                                                        </div>
                                                        <div className="top-club club-target">
                                                            {/*<span className="top-club-value">{this.props.commonDash.targetAchieved}%</span>*/}
                                                            <span className="top-club-value">{this.state.targetPercentage}%</span>
                                                            <span className="top-club-text">Target achieved</span>
                                                        </div>
                                                        {
                                                            this.state.clubTarget ?
                                                                <div className="top-club club-target-tile">                                                            
                                                                    <span className="top-club-value">{this.state.clubTarget}</span>
                                                                    <span className="top-club-text">Current Target</span>
                                                                </div>:''
                                                        }
                                                        <div className="top-club settings" onClick={this.onClubSettingsUpdate.bind(this)}>
                                                            <span className="top-club-value-icon"><Icon>settings</Icon></span>
                                                            <span className="top-club-text">Settings</span>
                                                        </div>
                                                    </div>
                                            }
                                            {/* {
                                            (this.state.page == 'council' && this.state.councilStats) &&
                                                <div className="compare-top-container">
                                                    <div className="top-club others">
                                                        <span className="top-club-value">{this.state.councilStats.activities} Activities</span>
                                                        <span className="top-club-text">pending to take action.</span>
                                                    </div>
                                                    <div className="top-club others">
                                                        <span className="top-club-value">{this.state.councilStats.voices} Voices</span>
                                                        <span className="top-club-text">pending to take action.</span>
                                                    </div>
                                                    <div className="top-club club-target">
                                                        <span className="top-club-value">{this.state.councilStats.cuds} cuds</span>
                                                        <span className="top-club-text">pending to take action.</span>
                                                    </div>
                                                </div>
                                        } */}

                                        </div>
                                    </div>
                                    {
                                        /*(this.adminPrivilige) && (
                                            <div className="tab-container recent-meetings">
                                                <div className="tab-container-header">
                                                    {<div className="page-headind"><Icon>access_time</Icon>Today's Meetings</div>
                                                    <div className="meeting-actions">
                                                        <Button classes={{root: "btn-alternate"}} onClick={this.handleScheduleMeeting.bind(this)} size="small"><Icon>date_range</Icon> Schedule Meeting</Button>
                                                    </div>}
                                                </div>
                                                <div className="tab-container-header">
                                                    {
                                                        (this.state.page == 'club') && 
                                                            (
                                                            (this.props.commonDash.recentMeetings && this.props.commonDash.recentMeetings.length) ?
                                                            this.getRecentMeetingTemplate()
                                                            : 
                                                            <div className="no-data">
                                                                <span className="title">No meeting is scheduled at this time.</span>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )*/
                                    }

                                    <div className="tab-container last-weeks">
                                        {(this.state.summaryTableTabValue == 0) && 
                                            <div className="last-weeks-table-container activities">
                                                <div className="table-navigate">
                                                    {/* <div
                                                    className="link"
                                                    onClick={() => {
                                                        this
                                                            .props
                                                            .history
                                                            .push("/admin/activities")
                                                }}>Go To Activities</div> */}
                                                </div>
                                                {/* <div className="last-weeks-table-title">
                                                Activities
                                            </div> */}
                                                <div className="last-weeks-table-content">
                                                    <div className="activities-container">
                                                        {AppConfig.isActivityAssignmentDisabled && <div className="alert-mssg">
                                                            <h1 className="title"><Icon>warning</Icon> Point Claim has been disabled.</h1>
                                                            <p>This functionality will be available soon after line item update.</p>
                                                        </div>}
                                                        <div className="search-wrapper">
                                                            <SearchWidget onSearch={this.onSearchActivity.bind(this)} onClear={this.onClearActivitySearch.bind(this)} />
                                                        </div>
                                                        <div className="label-container">
                                                            {(this.adminPrivilige == 'VIEW_ADMIN_DASHBOARD') ?
                                                                <div className="label">
                                                                    <div className="color violet"></div>
                                                                    <div className="text">Activity Assigned</div>
                                                                </div>:''
                                                            }
                                                            {(this.adminPrivilige == 'VIEW_ADMIN_DASHBOARD') ?
                                                                <div className="label">
                                                                    <div className="color green"></div>
                                                                    <div className="text">User Completed</div>
                                                                </div>:''
                                                            }
                                                            <div className="label">
                                                                <div className="color yellow"></div>
                                                                <div className="text">Pending Panel Approval</div>
                                                            </div>
                                                            {(this.adminPrivilige == 'VIEW_ADMIN_DASHBOARD') ?
                                                                <div className="label">
                                                                    <div className="color brown"></div>
                                                                    <div className="text">Point credited</div>
                                                                </div>:''
                                                            }
                                                        </div>
                                                        <div className="activities-tiles">
                                                            {
                                                                activityTableRows.length > 0 ?
                                                                    activityTableRows
                                                                :
                                                                    <div className="empty-notification">No activities found</div>
                                                            }
                                                            {
                                                                this.state.isLoadMoreShow ?
                                                                    <div className="load-more" onClick={this.loadMoreClubTabs.bind(this)}>Load More</div>:''
                                                            }
                                                            {/* {
                                                            this.state.page == 'council' &&
                                                                <div className="load-more" onClick={this.loadMoreCouncilTabs.bind(this)}>Load More</div>
                                                        } */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {(this.state.summaryTableTabValue == "revert to 1 for enabling voices tab") && 
                                            <div className="last-weeks-table-container voices">
                                                <div className="table-navigate">
                                                    <div
                                                        className="link"
                                                        onClick={() => {
                                                            this
                                                                .props
                                                                .history
                                                                .push("/admin/voices")
                                                        }}>Go To Voices</div>
                                                </div>
                                                <div className="last-weeks-table-title">
                                                    Voices
                                                </div>
                                                <div className="last-weeks-table-content">
                                                    <div className="filter-options">
                                                        <div className="filter-item">
                                                            <span className="filter-item-label">Status</span>
                                                            <SelectBox 
                                                                id="focus-area-filter"
                                                                required
                                                                classes="filter-item-select"
                                                                disableSysClasses
                                                                selectedValue = {this.state.filterStatusVoice}
                                                                selectArray={this.state.voiceStatuseses || []}
                                                                onSelect={this.handleFilterSelectVoice('filterStatusVoice')}/>
                                                        </div>
                                                        <div className="filter-item">
                                                            <span className="filter-item-label">Type</span>                                                    
                                                            <SelectBox 
                                                                id="focus-area-filter"
                                                                required
                                                                classes="filter-item-select"
                                                                disableSysClasses
                                                                selectedValue = {this.state.filterTypeVoice}
                                                                selectArray={this.state.voiceTypes || []}
                                                                onSelect={this.handleFilterSelectVoice('filterTypeVoice')}/>
                                                        </div>
                                                    </div>
                                                    <div className="voice-tiles">
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
                                            </div>
                                        }
                                        {(this.state.summaryTableTabValue == 1) &&
                                            (
                                            this.state.page == 'club' ?
                                            <div className="last-weeks-table-container commitments">
                                                <div className="last-weeks-table-title commitment">
                                                    <div className="title-commitment">Commitments</div>
                                                    {!this.state.isAddNewCommitment ?
                                                        <div className="title-action">
                                                            <ClubButton onClick={() => {this.addNewCommitment(this.state.isAddNewCommitment)}} className="action-btn" title="ADD NEW" color="#22BCAC" textColor="#FFFFFF" />
                                                        </div>:''
                                                    }
                                                </div>
                                                <div className="last-weeks-table-content">
                                                    {this.state.isAddNewCommitment ?
                                                        <div className="add-commitment-wrapper">
                                                            <textarea rows="1" type="text" placeholder="Title" className="title-field"
                                                                value={this.state.commitmentTitle}
                                                                onChange = {(e) => {this.setState({commitmentTitle: e.target.value})}}>
                                                            </textarea>
                                                            <textarea rows="1" type="text" placeholder="Description" className="title-field"
                                                                value={this.state.commitmentDescription}
                                                                onChange = {(e) => {this.setState({commitmentDescription: e.target.value})}}>
                                                            </textarea>
                                                            <Datetime
                                                                inputProps={{placeholder: 'Date', id:"commitment-date", className:"commitment-datetime-input"}}
                                                                className="commitment-datetime-picker"
                                                                onChange={(value)=>{
                                                                    this.setState({commitmentDate: Math.round((new Date(value)).getTime() / 1000)});
                                                                }}
                                                                value={new Date(this.state.commitmentDate * 1000)}
                                                                />
                                                            <ClubSelect className="commitment-status-select" selected={this.state.commitmentStatus} placeholder="Status" source={this.normalizeStatusForCommitmentStatus()} onSelect={(value) => {
                                                                    this.setState({commitmentStatus: value});
                                                                }}/>
                                                            <ClubButton onClick={() => {this.createNewCommitment()}} className="action-btn" title="CREATE" color="rgb(195, 136, 22)" textColor="#48F8E6" />
                                                            <Button className="commitment-later-btn" onClick={() => {this.addNewCommitment(this.state.isAddNewCommitment)}}><Icon>clear</Icon></Button>
                                                        </div>:''
                                                    }
                                                    <div className="commitments-tiles">
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
                                            </div>
                                            :
                                            <div className="last-weeks-table-container cuds">
                                                <div className="last-weeks-table-title">
                                                    Cuds
                                                </div>
                                                <div className="last-weeks-table-content">
                                                    <div className="cuds-tiles">
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
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                                {
                                    /*this.state.page == 'club' &&
                                    <div className="charts-container">
                                        <div className="top-5-users chart-item">
                                            <div className="top-5-users-title">
                                                Top 5 Contributers of the Club
                                            </div>
                                            <Table className="top-5-users-table">
                                                <TableHead className="top-5-users-table-head">
                                                    <TableRow>
                                                        <TableCell className="table-first-col top-users">User</TableCell>
                                                        <TableCell className="table-second-col top-users">Total Points</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody className="top-5-users-table-body">
                                                    {topUsersTableRows}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="pillar-chart-container chart-item">
                                            <Chart
                                                chartType="ColumnChart"
                                                data={this.props.commonDash.pillarStats}
                                                options={{
                                                    title: this.state.pillarBar[this.state.pillarBarType],
                                                        hAxis: {
                                                            title: 'Activities Name'
                                                        },
                                                            legend: {
                                                                "position": "top",
                                                                    "maxLines": 3
                                                            },
                                                                colors: ['#444444', '#22BCAC']
                                                }}
                                                loader="Rendering..."
                                                graph_id="PillarPointsChart"
                                                height="400px"
                                                />
                                        </div>
                                        <div className="compare-chart-container chart-item">
                                            <Chart
                                                chartType="ColumnChart"
                                                data={this.props.commonDash.clubPoints}
                                                options={{
                                                    title: 'Club Point Levels (Target: ' + this.props.commonDash.clubTarget + ')',
                                                        hAxis: {
                                                            title: 'Club Name'
                                                        },
                                                            vAxis: {
                                                                title: 'Points'
                                                            }
                                                }}
                                                loader="Rendering..."
                                                graph_id="PointsChart"
                                                legend_toggle
                                                />
                                        </div>
                                    </div>*/
                                }
                            </div> 
                            : 
                            <div className="club-settings-wizard">
                            <div className="wizard-header-wrapper">
                                <div className="wizard-header">
                                    <div className={("wizard-section-title first") + (this.state.activeStep === 0 ? " active" : "")}>
                                        <span className={("index ") + ((this.state.secretary && this.state.treasurer  && this.state.sergentAtArms && this.props.commonDash.selectedBODChip.length > 0) ? " done" : "")}>
                                            {
                                                (this.state.secretary && this.state.treasurer && this.state.sergentAtArms && this.props.commonDash.selectedBODChip.length > 0) ?
                                                    <span className="done-icon"><Icon>done</Icon></span>
                                                    :
                                                    <span>1</span>
                                            }
                                        </span>
                                        <span className="text">Select Office Bearers</span>
                                    </div>
                                    <div className={("wizard-section-title") + (this.state.activeStep === 1 ? " active" : ((this.state.selectedMasters && this.state.selectedMasters.length > 0) ? " completed" : ""))}>
                                        <span className={("index ") + ((this.state.selectedMasters && this.state.selectedMasters.length > 0) ? "done" : "")}>
                                            {
                                                (this.state.selectedMasters && this.state.selectedMasters.length > 0) ?
                                                    <span className="done-icon"><Icon>done</Icon></span>
                                                    :
                                                    <span>2</span>
                                            }
                                        </span>
                                        <span className="text">Choose Activities for the Club</span>
                                    </div>
                                    <div className={("wizard-section-title last") + (this.state.activeStep === 2 ? " active" :  ((this.props.commonDash.commonDashFields.target && this.props.commonDash.commonDashFields.location) ? " completed" : ""))}>
                                        <span className={("index ") + ((this.props.commonDash.commonDashFields.target && this.props.commonDash.commonDashFields.location) ? "done" : "")}>
                                            {
                                                (this.props.commonDash.commonDashFields.target && this.props.commonDash.commonDashFields.location) ?
                                                    <span className="done-icon"><Icon>done</Icon></span>
                                                    :
                                                    <span>3</span>
                                            }
                                        </span>
                                        <span className="text" style={{margin : "2pt -75pt"}}>Set Points Target &amp; Meeting Location</span>
                                    </div>
                                    <div className="line"></div>
                                </div>
                            </div>

                            <div className="wizard-body">
                                {

                                    this.state.activeStep === 0 &&
                                        <div className="wizard-section-body">
                                            <div className="wizard-section-tip"> <Icon>info</Icon> Select secretary, treasurer and board directors</div>
                                            <div className="office-bearers-list wizard-field-body">
                                                <div className="office-bearer field">
                                                    <div className="bearer-post field-label field-label">Secretary</div>
                                                    <div className="bearer-input-select field-input field-input">
                                                        <SelectBox 
                                                            id="secretary-select" 
                                                            required
                                                            selectedValue = {this.state.secretary}
                                                            selectArray={this.state.clubmembersList}
                                                            onSelect={this.handleSecretarySelect()}
                                                            style={{padding: "0.5rem 1rem",
                                                                background: "#f5f5f5",
                                                                    margin: ".5rem 0",
                                                                        color: "#888",
                                                                            border: "1px solid #ccc",
                                                                                display: "flex",
                                                                                    alignitems: "center"}}
                                                            />
                                                    </div>
                                                </div>
                                                <div className="office-bearer field">
                                                    <div className="bearer-post field-label">Treasurer</div>
                                                    <div className="bearer-input-select field-input">
                                                        <SelectBox 
                                                            id="treasurer-select" 
                                                            required
                                                            selectedValue = {this.state.treasurer}
                                                            selectArray={this.state.clubmembersList}
                                                            onSelect={this.handleTreasurerSelect()}/>
                                                    </div>
                                                </div>
                                                <div className="office-bearer field">
                                                    <div className="bearer-post field-label">Sergent at arms</div>
                                                    <div className="bearer-input-select field-input">
                                                        <SelectBox 
                                                            id="sergentAtArms-select" 
                                                            required
                                                            selectedValue = {this.state.sergentAtArms}
                                                            selectArray={this.state.clubmembersList}
                                                            onSelect={this.handleSergentAtArmsSelect()}/>
                                                    </div>
                                                </div>
                                                <div className="office-bearer field">
                                                    <div className="bearer-post field-label">River Council</div>
                                                    <div className="bearer-input-select field-input">
                                                        <UserChipMultiSelect 
                                                            customStyle = {{width : "100%"}}
                                                            innerStyle = {{width : "auto"}}
                                                            searchBoxClass = "bod-multi-select"
                                                            showPreloader={this.state.showBODSearchPreloader}
                                                            onTextChange={this.onBODSearch.bind(this)}
                                                            resultChips={this.props.commonDash.bodChipSearchResult}
                                                            selectedChips={this.props.commonDash.selectedBODChip}
                                                            onItemSelect={this.onBODItemSelect.bind(this)}
                                                            onDeleteChip={this.onDeleteBODUser.bind(this)}
                                                            />
                                                    </div>
                                                </div>
                                                {/* <div className="office-bearer field">
                                                        <div className="bearer-post field-label">Treasurer</div>
                                                        <div className="bearer-input-select field-input">
                                                            <SelectBox 
                                                                id="treasurer-select" 
                                                                required
                                                                selectedValue = {this.state.treasurer}
                                                                selectArray={this.props.commonDash.membersList || []}
                                                                onSelect={this.handleTreasurerSelect()}/>
                                                        </div>
                                                    </div>
                                                    <div className="office-bearer field">
                                                        <div className="bearer-post field-label">Board Of Directors</div>
                                                        <div className="bearer-input-select field-input">
                                                            <UserChipMultiSelect 
                                                                placeholder = "Board Of Directors"
                                                                // customStyle = {{width : "17rem"}}
                                                                searchBoxClass = "bod-multi-select"
                                                                showPreloader={this.state.showBODSearchPreloader}
                                                                onTextChange={this.onBODSearch.bind(this)}
                                                                resultChips={this.props.commonDash.bodChipSearchResult}
                                                                selectedChips={this.props.commonDash.selectedBODChip}
                                                                onItemSelect={this.onBODItemSelect.bind(this)}
                                                                onDeleteChip={this.onDeleteBODUser.bind(this)}
                                                                />
                                                        </div>
                                                    </div> */}
                                            </div>
                                        </div>


                                }
                                {
                                    this.state.activeStep === 1 &&
                                        <div className="wizard-section-body">
                                            <div className="wizard-section-tip"> <Icon>info</Icon>  Select activities for your club, you can assign these activities to your club members later. Click on the title to see details and customize</div>
                                            <div className="select-all-checkbox">
                                                <Tooltip title="Select all entries">    
                                                    <Checkbox
                                                        onChange={this.handleSelectAllCheckBoxChange.bind(this)}
                                                        color="accent"
                                                        className="checkbox"
                                                        label="Select All"
                                                        inputProps={
                                                            {id: "some"}
                                                        }
                                                        checked={this.state.isCheckAllActivity}
                                                        />
                                                </Tooltip>
                                                <label htmlFor="some" className="label">Select All</label>
                                            </div>
                                            <div className="master-activities-list">
                                                {masterActivities}
                                            </div>
                                        </div>
                                }
                                {
                                    this.state.activeStep === 2 &&
                                        <div className="wizard-section-body">
                                            <div className="wizard-section-tip"><Icon>info</Icon> Set yearly target and default meeting location for club</div>
                                            <div className="target-location-fields wizard-field-body">
                                                <div className="target field">
                                                    <div className="field-label">Target</div>
                                                    <div className="field-input">
                                                        <TextField
                                                            id="target"
                                                            placeholder="Target"
                                                            className="input-field"
                                                            margin="normal"
                                                            value = {this.props.commonDash.commonDashFields.target}
                                                            onChange = {this.handleCDFieldChange('target')}
                                                            />
                                                    </div>
                                                </div>
                                                <div className="location field">
                                                    <div className="field-label">Meeting Location</div>
                                                    <div className="field-input  input-container">
                                                        <TextField
                                                            id="location"
                                                            placeholder="Location"
                                                            className="input-field"
                                                            margin="normal"
                                                            value = {this.props.commonDash.commonDashFields.location}
                                                            onChange = {this.handleCDFieldChange('location')}
                                                            />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="wizard-actions">
                                <div className="nav-btns">
                                    {
                                        (this.state.isPresidentSetupComplete && this.state.activeStep === 0) && 
                                            <Button color="default" onClick={this.cancelSettings.bind(this)} style={{position:"absolute",left:"3%"}}
                                                >
                                                <Icon>chevron_left</Icon> Cancel Setup
                                            </Button>
                                    }
                                    {
                                        (this.state.activeStep !== 0) && 
                                            <Button
                                                raised
                                                color="primary"
                                                onClick={this.handleStepBack}
                                                style={{position:"absolute",left:"3%"}}
                                                >
                                                Back
                                            </Button>
                                    }
                                    <div className="save-next-btns">
                                        <Button
                                            raised
                                            color="primary"
                                            onClick={this.handleSave}
                                            className=""
                                            style={{display:"none"}}
                                            >
                                            Save
                                        </Button>
                                        <Button
                                            raised
                                            color="primary"
                                            onClick={this.handleNext}
                                            disabled={this.state.activeStep === 2 && this.state.unFinished}
                                            >
                                            { (this.state.activeStep === 2) ? 'Finish' : 'Next'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {
                                (this.state.activeStep === 2 && this.state.unFinished) &&
                                    <div className="wizard-alert">Please fill and save all fields to finish setup.</div>
                            }
                        </div>
                    }
                    {
                        (this.state.currentMasterActivity || this.state.currentActivity || this.state.currentVoice || this.state.currentCommitment || this.state.currentCud) &&
                            <Dock size={0.5} zIndex={200} position='right' isVisible={this.state.isVisible} dimMode="none" defaultSize={.6}>
                                {
                                    this.state.currentMasterActivity &&
                                        <MasterActivityDock
                                            closeDock={this.onCloseDock.bind(this)}
                                            selectedMasters={this.state.selectedMasters}
                                            index={this.state.currentMasterIndex}
                                            onCustomizeActivity={this.onCustomizeActivity.bind(this)}
                                            handleMasterCheckBoxChange={this.handleMasterCheckBoxChange.bind(this)}
                                            activity={this.state.currentMasterActivity}
                                            />
                                }
                                {
                                    this.state.currentActivity &&
                                        <ActivityDock
                                            activity={this.state.currentActivity}
                                            closeDock={this.onCloseDock.bind(this)}
                                            onActivityChanges={this.assignSuccess.bind(this)}
                                            index={this.state.currentActivityIndex}
                                            isCouncilApprove={this.state.isCouncilAccept}
                                            role={this.adminPrivilige}
                                            />
                                }
                                {
                                    this.state.currentVoice &&
                                        <VoiceDock
                                            voice={this.state.currentVoice}
                                            closeDock={this.onCloseDock.bind(this)}
                                            voiceTypes={this.state.voiceTypes}
                                            index={this.state.currentVoiceIndex}
                                            onVoiceChangeSuccess={this.onVoiceChanges.bind(this)}   
                                            councils={this.state.councilsList}                                         
                                            />
                                }
                                {
                                    this.state.currentCommitment &&
                                        <CommitmentDock
                                            statusList={this.state.commitmentStatusList}
                                            commitment={this.state.currentCommitment}
                                            closeDock={this.onCloseDock.bind(this)}
                                            index={this.state.currentCommitmentIndex}
                                            onActionCompleted={this.onCommitmentDockActionCompleted.bind(this)}
                                            />
                                }
                                {
                                    this.state.currentCud &&
                                        <CUDDock
                                            cud={this.state.currentCud}
                                            closeDock={this.onCloseDock.bind(this)}
                                            index={this.state.currentCudIndex}
                                            />
                                }
                            </Dock>
                    }
            </div>
        );
    }

    cancelSettings(){
        //this.setState({});
        window.location.reload();
    }

    normalizeStatusForCommitmentStatus() {
        const normalizedStatus = [];
        this.state.commitmentStatusList.forEach(status => {
            normalizedStatus.push({
                label: status.title,
                value: status.value
            });
        });

        return normalizedStatus;
    }

    onCommitmentDockActionCompleted() {
        this.getCommitments(0);
    }

    isDateValid = function( current ){
        return current.isAfter( this.yesterday );
    };

addNewCommitment() {
    this.setState({isAddNewCommitment: !this.state.isAddNewCommitment});
}

getClubPoint() {
    const userDetail = Util.getLoggedInUserDetails();
    return userDetail.myClub.clubPoints || 0;
}

onSearchActivity(text) {
    this.props.loadActivitiesList([]);
    this.getActivities(0, text);
}

onClearActivitySearch() {
    this.props.loadActivitiesList([]);
    this.getActivities(0);
}

handleScheduleMeeting(){
    this.props.history.push('/admin/meetings')
}

getRecentMeetingTemplate(){
    /*return (
        <div className="tab-container recent-meetings">
            <div className="meeting-datas">
                <span className="title">{this.props.commonDash.recentMeetings.title} @ {moment.unix(this.props.commonDash.recentMeetings.fromDate / 1000).format("HH:mm")}</span>
            </div>
            <div className="meeting-actions">
                {
                    !this.props.commonDash.recentMeetings.started || !this.props.commonDash.recentMeetings.ended ? 
                        <div className={("meeting-action-btn end")} onClick={this.startStopMeeting.bind(this, this.props.commonDash.recentMeetings)}>{this.props.commonDash.recentMeetings.started && !this.props.commonDash.recentMeetings.ended ? "End " : "Start "} Meeting</div>
                        :
                        <div className={("meeting-action-btn markAttendance")} onClick={() => {this.props.history.push('/admin/meetings')}}>Mark Attendance</div>                                                    
                }
            </div>
        </div>
    );*/

    return (
        <div className="meeting-wrapper">
            {
                this.props.commonDash.recentMeetings.map((meeting, index) => {
                    const startTime = moment.unix(meeting.fromDate / 1000);
                    const endTime = moment.unix(meeting.toDate / 1000);
                    const meetingActionClass = (meeting.openStatus || meeting.started)? "opend" : "closed";

                    return (
                        <div className="meeting-list-item" key={meeting.meetingId}>
                            <div className="meeting-list-icon">
                                <Icon>wb_incandescent</Icon>
                            </div>
                            <div className="meeting-title">
                                {meeting.title}
                            </div>
                            <div className="meeting-datetime">
                                <div className="date">
                                    <span>{startTime.format("MMM")}</span>
                                    <span>{startTime.format("DD")}</span>
                                </div>
                                <div className="time">
                                    <span>{startTime.format("hh:mm A")}</span> To <span>{endTime.format("hh:mm A")}</span>
                                </div>
                            </div>
                            <div className="meeting-location">
                                {meeting.location}
                            </div>
                            <div className={`meeting-actions ${meetingActionClass}`}>
                                {
                                    (!meeting.started && !meeting.ended) && <div className="meeting-action-drawer">
                                            <Button className="btn-meeting-action-start" onClick={this.startStopMeeting.bind(this, meeting)} color="default">START MEETING</Button>
                                        </div>
                                }
                                {
                                    (meeting.started && !meeting.ended) && <div className="meeting-action-drawer">
                                            <Button className="btn-meeting-action-start" onClick={this.startStopMeeting.bind(this, meeting)} color="default">END MEETING</Button>
                                        </div>
                                }
                                {
                                    (meeting.started && meeting.ended) && <div className="meeting-action-drawer">
                                            <Button className="btn-meeting-action-start" color="default" onClick={this.handleMarkAttendance.bind(this, meeting)}>MARK ATTENDANCE</Button>
                                        </div>
                                }
                                <Button className="btn-meeting-actiont-toggle" onClick={ this.toggleRecentMeetingActions.bind(this, meeting) }>
                                    <Icon>chevron_left</Icon>
                                </Button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

toggleRecentMeetingActions(meetingItem) {
    meetingItem.openStatus = !meetingItem.openStatus;
    const meetingList = [...this.props.commonDash.recentMeetings];
    this.props.loadRecentMeetings(meetingList);
    //this.setState({...this.state, isRecentMeetingActionsOpen: !this.state.isRecentMeetingActionsOpen});
}

handleMarkAttendance(meetingItem) {
    this.props.history.push("/admin/meetings/detail/"+meetingItem.meetingId);
    //this.props.history.push('/admin/meetings');
}

clubDashInit() {
    this.setState({pageInitializing: false});
    this.loadPoints();
    //this.getPillarStats();
    this.getLastWeekResults(this.state.lastWeekPageNo); // This calls selected activityList
    //this.getFocusAreas();
    this.getRecentMeeting();
    this.loadStatusFilters("club");
    this.loadVoiceFilters();
    this.loadClubList();
    this.loadActivitySummary("nil", 10);
}

loadActivitySummary(searchParams, interval = 10){
    AdminDashboardService.getActivitySummary(searchParams, interval)
        .then(activitySummary => {
        this.setState({activitySummary});
    })
        .catch(error => {
        riverToast.show(error.status_message || 'Something went wrong while fetching activity summary');
    });
}

loadClubList(){
    AdminDashboardService.getClubList()
        .then(data => {
        let clubNameList = data.map(club => {
            return {
                title: club.name,
                value: club.id
            }
        });
        clubNameList = [{title: "All", value: "nil"}, ...clubNameList];
        this.setState({clubNameList});
    })
        .catch(error => {
        console.log(error);
        riverToast.show(error.status_message || 'Something went wrong while fetching club list');
    });
}

onClubSettingsUpdate() {
    this.setState({ setupDone: false });
    this.clubWizardInit();
}

councilDashInit() {
    this.setState({
        ...this.state,
        title: 'Panel Dashboard',
        page: 'council',
        setupDone: true,
        pageInitializing: false
    });

    this.getActivities(0, this.props.match.params.refId, true);
    this.getCouncilVoices();
    this.getCouncilCuds();
    //this.getFocusAreas();
    this.getCouncilStats();
    this.loadClubFilters();
    this.loadStatusFilters("council");
    this.loadVoiceFilters();
}

clubWizardInit() {
    this.getClubMembers();
    this.getMasterActivities();
    this.getClubSettings();
}

handleSelectAllCheckBoxChange(event) {
    if(event.target.checked) {
        this.setState({
            selectedMasters: this.props.commonDash.masterActivities.map((item) => item.id),
            isCheckAllActivity: true
        })
    } else {
        /*this.setState({
            selectedMasters: []
        })*/
        const {selectedMasters, selectAll} = this.populateActivitiesCheckbox(this.props.commonDash.masterActivities);
        this.setState({
            isCheckAllActivity: selectAll,
            selectedMasters});
    }
}

handleNext = () => {
    this.handleSave();
}

handleStepNext = () => {
    const { activeStep } = this.state;

    if(activeStep != 2){
        this.setState({ activeStep: activeStep + 1 });
    } else {
        this.finishSetup();
    }

    if(activeStep == 1) {
        this.isClubSettingsFinish();
    } 
}

handleStepBack = () => {
    const { activeStep } = this.state;

    this.setState({ activeStep: activeStep - 1 });
}

handleSave = () => {
    const { activeStep } = this.state;

    switch (activeStep) {
        case 0:
            this.saveOfficeBearers();
            break;
        case 1:
            this.saveActivities();
            break;
        case 2:
            this.saveTargetLocation();
            break;
        default:
            break;
    }
}

handleCDFieldChange = (name) => (event) => {
    this.props.fieldChange(name, event.target.value );
}

handleChange = event => {
    this.setState({ selectedValue: event.target.value });
};

handleSummaryTableTabChange(value) {
    this.setState({summaryTableTabValue: value});

    if(value == 1) {
        this.getCouncils();
    }
}

handleSecretarySelect = name => value => {
    this.setState( {secretary: value});
}

handleTreasurerSelect = name => value => {
    this.setState( {treasurer: value});
}

handleSergentAtArmsSelect = name => value => {
    this.setState( {sergentAtArms: value});
}

handleFilterSelect = (name) => (value) => {
    this.setState({ [name]: value  }, () => {
        if(this.state.page == 'club'){
            this.getActivities();
        } else if (this.state.page == 'council') {
            // this.getCouncilActivities();
            this.getActivities();
        }
    });
}

handleFilterSelectVoice = (name) => (value) => {
    this.setState({ [name]: value  }, () => {
        if(this.state.page == 'club'){
            this.getVoices();
        } else if (this.state.page == 'council') {
            this.getCouncilVoices();
        }
    });
}

onCloseDock() {
    this.setState({
        ...this.state,
        currentMasterActivity: '',
        isVisible: false,
        currentMasterIndex: '',
        currentActivity: '',
        currentActivityIndex: '',
        currentCommitment: '',
        currentCommitmentIndex: '',
        currentVoice: '',
        currentVoiceIndex: '',
        isCouncilAccept:false
    })
}

loadMoreClubTabs() {
    const currentTab = this.state.summaryTableTabValue;

    let pageNo = 0;
    switch (currentTab) {
        case 0:
            pageNo = this.state.activitiesPageNo;
            this.getActivities(pageNo + 1);
            break;
            /*case 1:
            pageNo = this.state.voicesPageNo;
            this.getVoices(pageNo + 1);
            break;*/
        case 1:
            pageNo = this.state.commitmentsPageNo;
            this.getCommitments(pageNo + 1);
        default:
            break;
    }
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

loadStatusFilters(page) {
    switch (page) {
        case "council":
            this.setState({
                activityStatuses: [{title:'All',value:'ALL'},{title:'Open',value:'OPEN'},{title:'Closed',value:'CLOSED'}]
            })
            break;
        case "club":
            this.setState({
                activityStatuses: [{title:'All',value:'ALL'},{title:'Assigned',value:'assigned'},{title:'Unassigned',value:'unassigned'}]
            })
            break;
        default:
            this.setState({
                activityStatuses: [{title:'All',value:'ALL'},{title:'Assigned',value:'assigned'},{title:'Unassigned',value:'unassigned'}]
            })
            break;
    }
}

loadVoiceFilters() {
    this.setState({
        voiceStatuseses: [{title:'All',value:'ALL'},{title:'Open',value:'OPEN'},{title:'Closed',value:'CLOSED'}]
    });
    this.getVoiceTypes();
}

loadMoreCouncilTabs() {
    const currentTab = this.state.summaryTableTabValue;

    let pageNo = 0;
    switch (currentTab) {
        case 0:
            pageNo = this.state.activitiesPageNo;
            // this.getCouncilActivities(pageNo + 1);
            this.getActivities(pageNo + 1);
            break;
            /*case 1:
            pageNo = this.state.voicesPageNo;
            this.getCouncilVoices(pageNo + 1);
            break;*/
        case 1:
            pageNo = this.state.cudsPageNo;
            this.getCouncilCuds(pageNo + 1);
        default:
            break;
    }
}

onVoiceClick(voice, index) {
    this.setState({
        ...this.state,
        isVisible: true,
        currentVoice: voice,
        currentVoiceIndex: index
    });
}

onCommitmentClick(commitment, index) {
    this.setState({
        ...this.state,
        isVisible: true,
        currentCommitment: commitment,
        currentCommitmentIndex: index
    });
}

onCudClick(cud, index) {
    this.setState({
        ...this.state,
        isVisible: true,
        currentCud: cud,
        currentCudIndex: index
    });
}

onCustomizeActivity(index, title, description, id, clubActivityId) {
    const activityList = this.props.commonDash.masterActivities;

    activityList[index].shortlisted = {
        title: title,
        description: description
    }    
    if(clubActivityId) {
        activityList[index].shortlisted.clubActivityId = clubActivityId;
    }

    this.props.loadMasterActivitiesList(activityList);
}

toggleCustomizeActivityDialog(activity, index) {
    const flag = !this.state.customizeActivityDialog;

    if(activity) {
        this.setState({ 
            ...this.state,
            customizeActivityDialog: flag,
            currentMasterActivity: activity,
            currentMasterIndex: index
        });
    } else {
        this.setState({ 
            ...this.state,
            customizeActivityDialog: flag,
            currentMasterActivity: '',
            currentMasterIndex: ''
        });
    }
}

handleMasterCheckBoxChange(event, activityId) {
    let selectedItems=this.state.selectedMasters;
    if(!event.target.checked){
        this.setState({isCheckAllActivity: false});
    }

    if(selectedItems.includes(activityId)){
        selectedItems.splice(selectedItems.indexOf(activityId),1);
    }else{
        selectedItems.push(activityId);
    }

    //this.setState({selectedItems: selectedItems});
    this.setState({selectedMasters: selectedItems});
}

storePoints(data) {
    this.setState({
        ...this.state,
        topClub: data.topperName,
        myClub: data.myClubName,
        targetPercentage: data.targetPercentage,
        totalPoint: data.totalPoint,
        clubTarget: data.target
    });

    this.processClubPoints(data.clubPoints, data.myClubName, data.topperName);
}

processClubPoints(clubsPoints, myClubName, topClub) {
    let points = clubsPoints.map((club) => {
        let color = "blue";
        let annotation = "";
        if (club.clubName == myClubName) {
            color = "red";
            annotation = "Your Club"
        } else if (club.clubName == topClub) {
            color = "green";
            annotation = "Top Point Club"
        }

        return [club.clubName, club.totalPoints, color, annotation];
    }, this);
    points.unshift([
        'Club',
        'Points', {
            role: "style"
        }, {
            role: "annotation"
        }
    ]);

    this
        .props
        .setClubPoints(points);
}

processPillarStats(stats) {
    let statsFinal = stats.map((pillar) => {
        return [pillar.categoryName, pillar.maxPoints, pillar.pointsEarned]
    });

    statsFinal.unshift(["Activity", "Max Points", "Points Earned"]);

    this
        .props
        .loadPillarStats(statsFinal);
}

onMasterActivityClick(activity, index) {
    // this.setState({
    //     ...this.state,
    //     isVisible: true,
    //     currentMasterActivity: activity,
    //     currentMasterIndex: index
    // });
    this.getWizardActivityList(activity.id);
}

onActivityClick(activity, index) {
    this.setState({
        ...this.state,
        isVisible: true,
        currentActivity: activity,
        currentActivityIndex: index
    });
}

createNewCommitment() {
    const {commitmentDate, commitmentDescription, commitmentTitle, commitmentStatus} = this.state;
    if (commitmentTitle && commitmentDescription && commitmentStatus) {
        const userDetails = Util.getLoggedInUserDetails();
        const request = {
            title: commitmentTitle,
            description: commitmentTitle, 
            targetDate: commitmentDate, 
            clubId: userDetails.myClub.id,
            currentStatus: commitmentStatus
        };
        AdminDashboardService.createCommitment(request)
            .then(data => {
            riverToast.show('Commitment has been created successfully');
            this.setState({
                ...this.state,
                commitmentDescription: '',
                commitmentStatus: '',
                commitmentTitle: '',
                commitmentDate: Math.round(new Date().getTime()/1000),
                isAddNewCommitment: false
            });
            this.getCommitments(0);
        })
            .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while creating commitment');
        });
    } else {
        riverToast.show('All fields are mandatory');
    }
}

loadPoints() {
    AdminDashboardService
        .getComparePoints()
        .then((data) => {
        this.storePoints(data);
        this
            .props
            .setTargetAchieved(data.targetPercentage);
        this
            .props
            .setClubTarget(data.target);
        this
            .props
            .setPointsDiff(data.pointDiff);
        /*this
            .props
            .loadTopUsersList(data.memberPoints);*/
    })
        .catch((error) => {
        // riverToast.show("Something went wrong while fetching points");
    })
}

onBODSearch(searchText) {
    if (searchText.length >= 3) {
        this.setState({showBODSearchPreloader: true});
        AdminDashboardService.searchUser(searchText)
            .then((data) => {
            this.setState({showBODSearchPreloader: false});
            if (data) {
                this.props.setBODUserSearchResult(data);
            }
        })
            .catch((error) => {
            this.setState({showBODSearchPreloader: false});
            riverToast.show(error.status_message);
        });
    } else if (searchText.length < 3){
        this.setState({showBODSearchPreloader: false});            
        this.props.setBODUserSearchResult([]);
    }
}

onBODItemSelect(item) {
    this.props.setBODUserSearchResult([]);
    const selectedUsers = this.props.commonDash.selectedBODChip;
    let isChipExists = false;

    selectedUsers.forEach((element) => {
        if (element.id === item.id) {
            isChipExists = true;
        }
    }, this);

    if (!isChipExists) {
        selectedUsers.push(item);
        this.props.setBODUserSelected(selectedUsers);
    }        
}

onDeleteBODUser(item) {
    const selectedUsers = this.props.commonDash.selectedBODChip;
    let selectedIndex = -1;
    this.props.commonDash.selectedBODChip.forEach(function(element, index) {
        if (element.id == item.id) {
            selectedIndex = index;
        }
    }, this);
    selectedUsers.splice(selectedIndex, 1);
    this.props.setBODUserSelected(selectedUsers);
}

processVoiceTypes(list) {
    let result = list.map((item) => {
        return {title: item.voiceType, value: item.id}
    });


    return [{title:'All',value:'ALL'},...result];
}

getVoiceTypes() {
    /*AdminDashboardService.getVoiceTypes()
        .then((data) => {
        this.setState({ voiceTypes: this.processVoiceTypes(data)});
    })
        .catch((error) => {
        console.log(error);
        riverToast.show("Something went wrong while fetching voice list.");
    })*/
    this.setState({ voiceTypes: []});
}

getWizardActivityList(activity){
    AdminDashboardService.getWizardActivityMasters(activity)
        .then((data) => {
        this.setState({
            ...this.state,
            isVisible: true,
            currentMasterActivity: data,
            currentMasterIndex: data.id
        });
    })
        .catch((error) => {
        console.log(error);
        riverToast.show("Something went wrong while fetching activity.");
    })
}

getMasterActivities() {
    AdminDashboardService.getActivityMasters()
        .then((data) => {
        /*let selectedMasters = [];
        let selectAll = true;
        data.forEach(item => {
            if(item.isShortListed){
                selectedMasters.push(item.id);
            }
            else{
                selectAll = false;
            }
        })*/
        const {selectedMasters, selectAll} = this.populateActivitiesCheckbox(data);
        this.props.loadMasterActivitiesList(data);
        this.setState({
            isCheckAllActivity: selectAll,
            selectedMasters});
    })
        .catch((error) => {
        console.log(error);
        riverToast.show("Something went wrong while fetching activity masters.");
    })
}

populateActivitiesCheckbox(data){
    let selectedMasters = [];
    let selectAll = true;
    data.forEach(item => {
        if(item.isShortListed){
            selectedMasters.push(item.id);
        }
        else{
            selectAll = false;
        }
    })
    return {
        selectedMasters,
        selectAll
    };
}

getMembersMeta(list) {
    return list.map((user) => { return {title: user.firstName + ' ' + user.middleName + ' ' + user.lastName, value: user.userId} });
}

getClubMembers() {
    AdminDashboardService
        .getClubMembers()
        .then((data) => {
        const tempList = this.getMembersMeta(data);
        this.props.loadMembersList(tempList);
        this.setState({clubmembersList: [...tempList]})
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching club members");
    })
}

getCouncils() {
    AdminDashboardService
        .getCouncils()
        .then((data) => {
        if (data) {
            this.voiceCouncilList = data;
            const parsedCouncilArray = [];
            data.forEach(function (element) {
                parsedCouncilArray.push({
                    title: element.name,
                    value: element.tagId,
                    hash: element.hash
                });
            }, this);
            this.setState({ councilsList: parsedCouncilArray});
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching councils");
    })
}

getCouncilStats() {
    AdminDashboardService
        .getCouncilStats()
        .then((data) => {
        this.setState({
            councilStats: data
        });
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching council stats data");
    })
}

getPillarStats() {
    AdminDashboardService
        .getPillarStats()
        .then((data) => {
        this.processPillarStats(data);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching pillar statistics");
    })
}

saveOfficeBearers() {
    if(this.state.secretary && this.state.treasurer  &&  this.state.sergentAtArms && this.props.commonDash.selectedBODChip.length > 0) {
        const clubOB = {
            secretary: this.state.secretary,
            treasurer: this.state.treasurer,
            sergentAtArms: this.state.sergentAtArms,
            boardMembers: this.props.commonDash.selectedBODChip.map((user) => user.id)
        }

        this.saveClubWizard(1, clubOB);
    } else {
        if(this.state.secretary && this.state.treasurer  &&  this.state.sergentAtArms && this.props.commonDash.selectedBODChip.length == 0) {
            riverToast.show("Please select atleast one Board Of Director");
        } else {
            riverToast.show("Please fill all fields");
        }
    }
}

onVoiceChanges(voice, index) {
    let voiceList = this.props.commonDash.voicesList;
    voiceList[index] = voice;

    this.props.loadVoicesList(voiceList);
    // this.getVoices(0);
    this.setState({ currentVoice: voice });
}

getMastersSelectedList() {
    const activitiesList = [];

    this.state.selectedMasters.forEach((masterId) => {
        this.props.commonDash.masterActivities.find((master) => {
            if(master.id ==masterId) {
                /*activitiesList.push({
                    masterActivityId: masterId,
                    clubActivityId: (master.shortlisted && master.shortlisted.clubActivityId) ? master.shortlisted.clubActivityId : null,
                    title: (master.shortlisted && master.shortlisted.title) ? master.shortlisted.title : master.title,
                    description: (master.shortlisted && master.shortlisted.description) ? master.shortlisted.description : master.description
                });*/
                activitiesList.push({
                    masterActivityId: masterId
                });
            } 
        })
    });

    return {customisedActivities:  activitiesList};
}

saveActivities() {
    if(this.state.selectedMasters.length > 0){
        this.saveClubWizard(2, this.getMastersSelectedList());
    } else {
        riverToast.show("No activities selected");
    }
}

saveTargetLocation() {
    if(this.props.commonDash.commonDashFields.target && this.props.commonDash.commonDashFields.location) {
        this.saveClubWizard(3, {target: this.props.commonDash.commonDashFields.target, location: this.props.commonDash.commonDashFields.location})
    } else {
        riverToast.show("Please check the fields.")
    }
}

saveClubWizard(step, object) {
    AdminDashboardService.saveWizard(step, object)
        .then((data) => {
        riverToast.show("Settings saved successfully");
        if(step == 1) {
            this.handleStepNext();               
        }
        if(step == 2) {
            this.handleStepNext();               
        }
        if(step == 3) {
            this.isClubSettingsFinish();
            window.location.reload();                
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while saving settings");
    });
}

assignSuccess(activity, index, component) {
    let activities = this.props.commonDash.activitiesList;

    activities[index] = activity;

    this.props.loadActivitiesList(activities);

    if(component == "dock") {
        this.setState({ currentActivity: activity });
    }
}

getFocusAreaMeta(list) {
    let result = list.map((item) => {
        return {title: item.title, value: item.code}
    });

    result.unshift({title:'All', value:'ALL'});

    return result;
}

getFocusAreas() {
    AdminDashboardService.getFocusAreasList()
        .then((data) => {
        const list = data || [];
        this.setState({ focusAreas: this.getFocusAreaMeta(list) });
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while getting activity categories");
    });
}

getCouncilActivities(pageNo = 0) {
    let urlQuery = '?difficulty=' + this.state.filterDiff + '&focusArea=' + this.state.filterFA + '&status=' + this.state.filterStatus + '&club=' + this.state.filterClub;
    AdminDashboardService.getCouncilActivities(pageNo, urlQuery)
        .then((data) => {
        if(pageNo === 0) {
            this
                .props
                .loadActivitiesList(data);
        } else {
            this.props.pushActivitiesList(data)
        }
        if(data.length > 0) {
            this.setState({ activitiesPageNo: pageNo });
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while getting activity categories");
    });
}

getActivities(pageNo = 0, searchTerm = '', expand = false) {
    let urlQuery = '?difficulty=' + this.state.filterDiff + '&focusArea=' + this.state.filterFA + '&status=' + this.state.filterStatus;
    AdminDashboardService.getActivities(pageNo, urlQuery, searchTerm)
        .then((data) => {
        if (data && data.length < 10) {
            this.setState({isLoadMoreShow: false});
        } else {
            this.setState({isLoadMoreShow: true});
        }
        if(pageNo === 0) {
            //if (this.props.match.params && this.props.match.params.refId) {
            if(expand){
                data[0].shouldExpandRefId = searchTerm;
            }
            else{
                //window.location.reload();
            }
            this.props.loadActivitiesList(data);
        } else {
            this.props.pushActivitiesList(data)
        }
        if(data.length > 0) {
            this.setState({ activitiesPageNo: pageNo });
        }
    })
    /*.catch((error) => {
        console.log(error);
        riverToast.show(error.status_message || "Something went wrong while fetching activities list");
    });*/
}

getCouncilVoices(pageNo = 0) {
    let urlQuery = '?status=' + this.state.filterStatusVoice + '&type=' + this.state.filterTypeVoice;        
    AdminDashboardService
        .getCouncilVoices(pageNo, urlQuery)
        .then((data) => {
        if(pageNo === 0) {
            this
                .props
                .loadVoicesList(data);
        } else {
            this.props.pushVoicesList(data);
        }
        if(data.length > 0) {
            this.setState({ voicesPageNo: pageNo });
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching Voices list");
    });
}

getVoices(pageNo = 0) {
    let urlQuery = '?status=' + this.state.filterStatusVoice + '&type=' + this.state.filterTypeVoice;        
    AdminDashboardService
        .getVoices(pageNo, urlQuery)
        .then((data) => {
        if(pageNo === 0) {
            this
                .props
                .loadVoicesList(data);
        } else {
            this.props.pushVoicesList(data);
        }
        if(data.length > 0) {
            this.setState({ voicesPageNo: pageNo });
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching Voices list");
    });
}

getRecentMeeting() {
    /*AdminDashboardService.getRecentMeeting()
        .then((data) => {
        //if(data.length > 0) this.props.loadRecentMeetings(data[0]);
        const meetingList = data.map(item => ({...item, openStatus: false}));
        this.props.loadRecentMeetings(meetingList);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching recent meetings");
    });*/
    this.props.loadRecentMeetings([]);
}

getCouncilCuds(pageNo = 0) {
    AdminDashboardService
        .getCouncilCuds(pageNo)
        .then((data) => {
        if(pageNo === 0) {
            this
                .props
                .loadCudsList(data);
        } else {
            this.props.pushCudsList(data);
        }
        if(data.length > 0) {
            this.setState({ cudsPageNo: pageNo });
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching Cuds list");
    });
}

getCommitments(pageNo = 0) {
    /*AdminDashboardService
        .getCommitments(pageNo)
        .then((data) => {
        if(pageNo === 0) {
            this
                .props
                .loadCommitmentsList(data);
        } else {
            this.props.pushCommitmentsList(data);
        }
        if(data.length > 0) {
            this.setState({ commitmentsPageNo: pageNo });
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching Commitments list");
    });*/
    this.props.loadCommitmentsList([]);
}

getLastWeekResults(pageNo) {
    /*if (this.props.match.params && this.props.match.params.refId) {
        this.getActivities(0, this.props.match.params.refId, true);
    } else {
        this.getActivities(0);
    }*/
    this.getActivities(0);
    this.getCommitments(0);
    //this.getVoices(0);
    this.getCommitmentsStatuses();
}

getCommitmentsStatuses() {
    AdminDashboardService.getCommitmentsStatuses()
        .then(statusList => {
        if (statusList && statusList.length > 0) {
            this.setState({commitmentStatusList:statusList});
            this.setState({commitmentStatus: statusList[0].value});
        }
    })
        .catch(error => {
        console.log(error);
        riverToast.show(error.status_message || 'Something went wrong while fetching status');
    })
}

getClubSettings() { 
    AdminDashboardService.getClubSettings()
        .then((data) => {
        this.setState({
            ...this.state,
            secretary: data.secretary,
            treasurer: data.treasurer,
            sergentAtArms:data.sergentAtArms,
            //selectedMasters: data.activities,
            isPresidentSetupComplete: data.isFinished
        });
        this.props.fieldChange('location', data.location);
        this.props.fieldChange('target', data.target);
        this.props.setBODUserSelected(data.boardMembers.map(user => {return {avatar: user.avatar ,fullname: user.firstName + ' ' + user.middleName + ' ' + user.lastName,id: user.userId,type: "USER",username: user.email}}) || []);
    })
        .catch((error) => {
        // riverToast.show(error.status_message || "Something went wrong while checking club status");
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
    AdminDashboardService.getClubsList()
        .then((data) => {
        const list = data || [];
        this.setState({ clubsList: this.getClubMeta(list) });
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while getting activity categories");
    });
}

startStopMeeting(meeting) {
    let request = {
        isEnded: false,
        isStarted: false
    }
    if(!meeting.started) {
        request.isStarted = true;
    } else if (meeting.started && !meeting.ended) {
        request = {
            isEnded: true,
            isStarted: true
        };
    }
    AdminDashboardService.startStopMeetingTask(meeting.meetingId, request)
        .then((data) => {
        riverToast.show(("Meeting " + (!meeting.started ? "started" : "stopped") + " successfully."));
        this.getRecentMeeting();
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while starting the meeting");
    });  
}

checkClubSetupStatus() {
    this.setState({
        ...this.state,
        title: 'Club Dashboard',
        page: 'club'
    });
    AdminDashboardService.checkSetupFinished()
        .then((data) => {
        this.setState({
            ...this.state,
            pageInitializing: false,
            setupDone: data.finish 
        });
        if(data.finish) {
            this.clubDashInit();
        } else {
            this.clubWizardInit();
        }
    })
        .catch((error) => {
        console.log(error);
        riverToast.show(error.status_message || "Something went wrong while checking club status");
    });
}

isClubSettingsFinish() {
    AdminDashboardService.isClubSettingsFinish()
        .then((data) => {
        this.setState({ unFinished: !data.ensure });
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while checking club status");
    });
}

finishSetup() {
    AdminDashboardService.finishSettings()
        .then((data) => {
        riverToast.show("Club setup finished successfully");
        window.location.reload();
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while finishing club settings");
    });
}

loadActivitySummaryDetails(date, status, count, page = 0){
    AdminDashboardService.getActivitySummaryDetails(date, status, count, page)
    .then(activitySummaryDetailsList => {
        this.setState({activitySummaryDetailsList});
    })
    .catch((error) => {
        console.log(error);
        riverToast.show(error.status_message || "Something went wrong while loading activity summury details.");
    });
}
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);