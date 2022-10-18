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

// root component
import {Root} from "../Layout/Root";

// custom component
import {Util} from "../../Util/util";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {riverToast} from '../Common/Toast/Toast';
import {SelectBox} from '../Common/SelectBox/SelectBox';
import { UserChipMultiSelect } from '../Common/UserChipMultiSelect/UserChipMultiSelect';
import MasterActivityDock from './MasterActivityDock/MasterActivityDock';
import ActivityDock from './ActivityDock/ActivityDock';
import ActivityItem from './ActivityItem/ActivityItem';

// css
import "./CommonDashboard.scss";

// actions
import {
    setClubPoints,
    setPointsDiff,
    loadPillarStats,
    clearPillarStats,
    loadActivitiesList,
    loadVoicesList,
    loadCommitmentsList,
    loadCommitmentStatus,
    loadWeeklyCommitmentsList,
    loadMemberSummaryList,
    setClubWeeklyPoints,
    setTargetAchieved,
    loadTopUsersList,
    loadTargetsList,
    setClubTarget,
    setBODUserSearchResult,
    setBODUserSelected,
    loadMembersList,
    loadMasterActivitiesList,
    fieldChange,
    pushActivitiesList,
    pushVoicesList,
    pushCommitmentsList
} from './CommonDashboard.actions';
import {CommonDashboardService} from './CommonDashboard.service';
import { TextField } from 'material-ui';

const mapStateToProps = (state, ownProps) => {
    return {commonDash: state.CommonDashboardReducer}
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
        loadWeeklyCommitmentsList: (commitmentsList) => {
            dispatch(loadWeeklyCommitmentsList(commitmentsList))
        },
        loadCommitmentStatus: (list) => {
            dispatch(loadCommitmentStatus(list));
        },
        loadMemberSummaryList: (list) => {
            dispatch(loadMemberSummaryList(list));
        },
        setClubWeeklyPoints: (clubPoints) => {
            dispatch(setClubWeeklyPoints(clubPoints));
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
        }
    }
}

class CommonDashboard extends Component {
    state = {
        value: 0,
        clubsNames: [],
        clubsPoints: [],
        pillarBarType: 0,
        lastWeekPageNo: 0,
        selectedValue:"all",
        topClub: "",
        myClub: "",
        pillarBar: [
            'Yearly Chart', 'Monthly Chart', 'Yearly Chart'
        ],
        summaryTableTabValue: 0,
        commitmentTabValue: 0,
        createCommitment: false,
        editTargetDialog: false,
        currentTarget: "",
        lastWeekFrom: "",
        lastWeekTo: "",
        assigneesList: [],
        setupDone: false,
        activeStep: 0,
        activitiesPageNo: 0,
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
        filterFA: 'all',
        filterDiff: 'all',
        filterStatus: 'all',
        activityDifficulties: [{title:'All',value:'all'},{title:'Easy',value:'easy'},{title:'Difficult',value:'difficult'},{title:'Very Diffiult',value:'veryDifficult'}],
        activityStatuses: [{title:'All',value:'all'},{title:'Assigned',value:'assigned'},{title:'Unassigned',value:'unassigned'}]
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkClubSetupStatus();
    }

    render() {
        const activityTableRows = (this.props.commonDash.activitiesList)
            ? this
                .props
                .commonDash
                .activitiesList
                .map((item, index) => {
                    return  <ActivityItem
                                key={item.id}
                                activity={item}
                                index={index}
                                onActivityItemClick={this.onActivityClick.bind(this)}
                                onAssignUsers={this.assignActivity.bind(this)}
                            />
                })
            : false;

        const voicesTableRows = (this.props.commonDash.voicesList)
            ? this
                .props
                .commonDash
                .voicesList
                .map((item, index) => {
                    return  <div key={index}  className="item-tile">
                                <div
                                    className="link no-ellipsis"
                                    onClick={() => {
                                    this
                                        .props
                                        .history
                                        .push("/admin/voices/detail/" + item.voiceId + "/" + item.voiceHash);
                                }}>{item.title}</div>
                            </div>
                })
            : false;

        const commitmentTableRows = (this.props.commonDash.weeklyCommitmentsList)
            ? this
                .props
                .commonDash
                .weeklyCommitmentsList
                .map((item, index) => {
                    return  <div key={index}  className="item-tile">
                                <div>{item.title}</div>
                            </div>
                })
            : false;

        const topUsersTableRows = (this.props.commonDash.topUsersTableList)
            ? this
                .props
                .commonDash
                .topUsersTableList
                .map((item, index) => {
                    return <TableRow key={index} className="top-5-users-table-row">
                        <TableCell className="table-first-col top-users">
                            <div className="top-users-title">{item.memberName}</div>
                        </TableCell>
                        <TableCell className="table-second-col top-users">{item.clubPoints}</TableCell>
                    </TableRow>
                })
            : false;

        const sidebarBtns = [
            {
                title: "Activities",
                value: 0,
                count: this.props.commonDash.activitiesList.length || 0
            },
            {
                title: "Voices",
                value: 1,
                count: this.props.commonDash.voicesList.length || 0
            },
            {
                title: "Commitments",
                value: 2,
                count: this.props.commonDash.weeklyCommitmentsList.length || 0
            }
        ]
        const dashboardTabs = sidebarBtns.map((item, index) => {
            return <div
                        className={("last-weeks-sidebar-btn ") + ((this.state.summaryTableTabValue == index) ? "active" : "")}
                        key={index}
                        onClick={this.handleSummaryTableTabChange.bind(this, index)}
                    >
                        {item.title} { (item.count) ? <span className="count">{item.count}</span> : ''}
                    </div>
        });

        const masterActivities = this.props.commonDash.masterActivities.map((activity, index) => {
            return  <div className="master-activity-item" key={index}>
                        <div className="selector">
                            <Tooltip title="Select this entry">    
                                <Checkbox
                                    checked={this.state.selectedMasters.includes(activity.id)}
                                    onChange={this.handleMasterCheckBoxChange.bind(this, activity.id, index)}
                                    value="checkedB"
                                    color="accent"
                                    className="checkbox"
                                /> 
                            </Tooltip>
                        </div>
                        <div className="title">
                            <div className="value" onClick={this.onMasterActivityClick.bind(this, activity, index)}>{activity.shortlisted ? activity.shortlisted.title : activity.title}</div>
                        </div>
                        {/* <div className="customize" onClick={this.toggleCustomizeActivityDialog.bind(this, activity, index)}>Customize</div> */}
                    </div>
        })

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Club Dashboard" />
                    {
                        this.state.pageInitializing ?
                            <div className="initializing">
                                Page is getting initialized
                            </div>
                        :
                        this.state.setupDone ? 
                            <div className="common-dashboard-container">
                                <div className="dashboard-datas">
                                    <div className="tab-container last-weeks">
                                        <div className="last-weeks-sidebar">
                                            {dashboardTabs}
                                        </div>
                                        {(this.state.summaryTableTabValue == 0) && 
                                        <div className="last-weeks-table-container activities">
                                            <div className="table-navigate">
                                                <div
                                                    className="link"
                                                    onClick={() => {
                                                    this
                                                        .props
                                                        .history
                                                        .push("/admin/activities")
                                                }}>Go To Activities</div>
                                            </div>
                                            <div className="last-weeks-table-title">
                                                Activities
                                            </div>
                                            <div className="last-weeks-table-content">
                                                <div className="filter-options">
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
                                                </div>
                                                
                                                <div className="activities-container">
                                                    <div className="activities-tiles">
                                                        {activityTableRows}
                                                        <div className="load-more" onClick={this.loadMore.bind(this)}>Load More</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        {(this.state.summaryTableTabValue == 1) && 
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
                                                <div className="voice-tiles">
                                                    {voicesTableRows}
                                                    <div className="load-more" onClick={this.loadMore.bind(this)}>Load More</div>                                                    
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        {(this.state.summaryTableTabValue == 2) && 
                                            <div className="last-weeks-table-container commitments">
                                                <div className="last-weeks-table-title">
                                                    Commitments
                                                </div>
                                                <div className="last-weeks-table-content">
                                                    <div className="commitments-tiles">
                                                        {commitmentTableRows}
                                                        <div className="load-more" onClick={this.loadMore.bind(this)}>Load More</div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-container compare">
                                        <div className="compare-top-percent-container">
                                            <div className="compare-top-container">
                                                {(this.state.myClub == this.state.topClub) && <div className="top-club self">
                                                    <span className="top-club-value">{this.state.myClub}</span>
                                                    <span className="top-club-text">is the club having the top point.</span>
                                                </div>
                                                }
                                                {this.state.topClub && (this.state.myClub != this.state.topClub) && <div className="top-club others">
                                                    <span className="top-club-value">{this.props.commonDash.pointsDiff}</span>
                                                    <span className="top-club-text">points less than the club having the top point.</span>
                                                </div>
                                                }
                                                {!this.state.topClub && <div className="top-club others">
                                                    <span className="top-club-value">N/A</span>
                                                    <span className="top-club-text">club having the top point</span>
                                                </div>
                                                }
                                                <div className="top-club club-target">
                                                    <span className="top-club-value">{this.props.commonDash.targetAchieved}%</span>
                                                    <span className="top-club-text">Target achieved</span>
                                                </div>
                                                {
                                                    this.props.commonDash.clubTarget &&
                                                        <div className="top-club club-target-tile">
                                                            <span className="top-club-target-title">Target</span>
                                                            <span className="top-club-target-value">{this.props.commonDash.clubTarget}</span>
                                                        </div>
                                                }
                                            </div>
                                            {/*<div className="top-5-users">
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
                                            </div>*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="charts-container">
                                    <div className="pillar-chart-container">
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
                                            width="100%"
                                            height="400px"/>
                                    </div>
                                    <div className="compare-chart-container">
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
                                            width="100%"
                                            legend_toggle
                                        />
                                    </div>
                                </div>
                            </div> 
                        : 
                            <div className="club-settings-wizard">
                                <div className="wizard-header">
                                    <div className={("wizard-section-title") + (this.state.activeStep === 0 ? " active" : ((this.state.secretary && this.state.treasurer && this.props.commonDash.selectedBODChip.length > 0) ? " completed" : ""))}>
                                        Office Bearers
                                    </div>
                                    <div className={("wizard-section-title") + (this.state.activeStep === 1 ? " active" : ((this.state.selectedMasters && this.state.selectedMasters.length > 0) ? " completed" : ""))}>
                                        Manage Activities
                                    </div>
                                    <div className={("wizard-section-title") + (this.state.activeStep === 2 ? " active" :  ((this.props.commonDash.commonDashFields.target && this.props.commonDash.commonDashFields.location) ? " completed" : ""))}>
                                        Target and Location
                                    </div>
                                </div>
                                <div className="wizard-body">
                                    {
                                        this.state.activeStep === 0 &&
                                            <div className="wizard-section-body">
                                                <div className="office-bearers-list wizard-field-body">
                                                    <div className="office-bearer field">
                                                        <div className="bearer-post field-label field-label">Secretary</div>
                                                        <div className="bearer-input-select field-input field-input">
                                                            <SelectBox 
                                                                id="secretary-select" 
                                                                required
                                                                selectedValue = {this.state.secretary}
                                                                selectArray={this.props.commonDash.membersList || []}
                                                                onSelect={this.handleSecretarySelect()}/>
                                                        </div>
                                                    </div>
                                                    <div className="office-bearer field">
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
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                    {
                                        this.state.activeStep === 1 &&
                                            <div className="wizard-section-body">
                                                <div className="master-activities-list">
                                                    {masterActivities}
                                                </div>
                                            </div>
                                    }
                                    {
                                        this.state.activeStep === 2 &&
                                            <div className="wizard-section-body">
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
                                                        <div className="field-label">Location</div>
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
                                        <Button
                                            raised
                                            color="primary"
                                            disabled = {this.state.activeStep === 0}
                                            onClick={this.handleStepBack}
                                        >
                                            Back
                                        </Button>
                                        <div className="save-next-btns">
                                            <Button
                                                raised
                                                color="primary"
                                                onClick={this.handleSave}
                                                className=""
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                raised
                                                color="primary"
                                                onClick={this.handleStepNext}
                                                disabled={this.state.activeStep === 2 && this.state.unFinished}
                                            >
                                                { (this.state.activeStep === 2) ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                    {
                        (this.state.currentMasterActivity || this.state.currentActivity) &&
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
                                            index={this.state.currentActivityIndex}
                                        />
                                }
                            </Dock>
                    }
                </MainContainer>
            </Root>
        );
    }

    clubDashInit() {
        this.loadPoints();
        this.getPillarStats();
        this.getLastWeekResults(this.state.lastWeekPageNo);
        this.getActivitiesCategories();
    }
    
    clubWizardInit() {
        this.getClubMembers();
        this.getMasterActivities();
        this.getClubSettings();
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
    }

    handleSecretarySelect = name => value => {
        this.setState( {secretary: value});
    }

    handleTreasurerSelect = name => value => {
        this.setState( {treasurer: value});
    }

    handleFilterSelect = (name) => (value) => {
        this.setState({ [name]: value  })
    }

    onCloseDock() {
        this.setState({
            ...this.state,
            currentMasterActivity: '',
            isVisible: false,
            currentMasterIndex: '',
            currentActivity: '',
            currentActivityIndex: ''
        })
    }

    loadMore() {
        const currentTab = this.state.summaryTableTabValue;

        let pageNo = 0;
        switch (currentTab) {
            case 0:
                pageNo = this.state.activitiesPageNo;
                this.getActivities(pageNo + 1);
                break;
            case 1:
                pageNo = this.state.voicesPageNo;
                this.getVoices(pageNo + 1);
                break;
            case 2:
                pageNo = this.state.commitmentsPageNo;
                this.getCommitments(pageNo + 1);
            default:
                break;
        }
    }

    toggleTargetEditDialog(success = false) {
        const flag = !this.state.editTargetDialog;
        if (success || !flag) {
            this.setState({
                ...this.state,
                editTargetDialog: flag,
                currentTarget: ""
            });
            if (!flag) {
                this.getTargetsList();
            }
        } else {
            this.setState({editTargetDialog: flag});
        }
    }

    onViewAssigneesList(list) {
        this.setState({
            ...this.state,
            assigneesList: list,
            assigneesListDialog: true
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

    handleMasterCheckBoxChange(activityId) {
        let selectedItems=this.state.selectedMasters;

        if(selectedItems.includes(activityId)){
            selectedItems.splice(selectedItems.indexOf(activityId),1);
        }else{
            selectedItems.push(activityId);
        }

        this.setState({selectedItems: selectedItems});
    }

    storePoints(data) {
        this.setState({
            ...this.state,
            topClub: data.topperName,
            myClub: data.myClubName
        });

        this.processClubPoints(data.clubPoints, data.myClubName, data.topperName);
    }

    onCustomizeSubmit(title, description, id) {
        console.log(title, description, id)
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
        this.setState({
            ...this.state,
            isVisible: true,
            currentMasterActivity: activity,
            currentMasterIndex: index
        });
    }

    onActivityClick(activity, index) {
        this.setState({
            ...this.state,
            isVisible: true,
            currentActivity: activity,
            currentActivityIndex: index
        });
    }

    loadPoints() {
        CommonDashboardService
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
                this
                    .props
                    .loadTopUsersList(data.memberPoints);
            })
            .catch((error) => {
                // riverToast.show("Something went wrong while fetching points");
            })
    }

    onBODSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showBODSearchPreloader: true});
            CommonDashboardService.searchUser(searchText)
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
        } else if (searchText.length <= 0){
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

    getMasterActivities() {
        CommonDashboardService.getActivityMasters()
        .then((data) => {
            this.props.loadMasterActivitiesList(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching activity masters.");
        })
    }

    getMembersMeta(list) {
        return list.map((user) => { return {title: user.firstName + ' ' + user.middleName + ' ' + user.lastName, value: user.userId} });
    }

    getClubMembers() {
        CommonDashboardService
            .getClubMembers()
            .then((data) => {
                this.props.loadMembersList(this.getMembersMeta(data));
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching club members");
            })
    }

    getPillarStats() {
        CommonDashboardService
            .getPillarStats()
            .then((data) => {
                this.processPillarStats(data);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching pillar statistics");
            })
    }

    saveOfficeBearers() {
        if(this.state.secretary && this.state.treasurer && this.props.commonDash.selectedBODChip.length > 0) {
            const clubOB = {
                secretary: this.state.secretary,
                treasurer: this.state.treasurer,
                boardMembers: this.props.commonDash.selectedBODChip.map((user) => user.id)
            }

            this.saveClubWizard(1, clubOB);
        } else {
            if(this.state.secretary && this.state.treasurer && this.props.commonDash.selectedBODChip.length == 0) {
                riverToast.show("Please select atleast one Board Of Director");
            } else {
                riverToast.show("Please fill all fields");
            }
        }
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
        CommonDashboardService.saveWizard(step, object)
        .then((data) => {
            riverToast.show("Settings saved successfully");
            if(step == 3) {
                this.isClubSettingsFinish();                
            }
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while saving settings");
        });
    }

    getFocusAreaMeta(list) {
        let result = list.map((item) => {
            return {title: item.title, value: item.id}
        });

        result.unshift({title:'All', value:'all'});

        return result;
    }

    getActivitiesCategories() {
        CommonDashboardService.getActivityCategoryList()
        .then((data) => {
            const list = data || [];
            this.setState({ focusAreas: this.getFocusAreaMeta(list) });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while getting activity categories");
        });
    }

    getActivities(pageNo = 0) {
        CommonDashboardService
            .getActivities(pageNo)
            .then((data) => {
                if(pageNo === 0) {
                    this
                    .props
                    .loadActivitiesList(data);
                } else {
                    this.props.pushActivitiesList(data)
                }

            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching activities list");
            });
    }

    getVoices(pageNo = 0) {
        CommonDashboardService
            .getVoices(pageNo)
            .then((data) => {
                if(pageNo === 0) {
                    this
                    .props
                    .loadVoicesList(data);
                } else {
                    this.props.pushVoicesList(data);
                }
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching Voices list");
            });
    }

    getCommitments(pageNo = 0) {
        CommonDashboardService
            .getCommitments(pageNo)
            .then((data) => {
                if(pageNo === 0) {
                    this
                    .props
                    .loadWeeklyCommitmentsList(data);
                } else {
                    this.props.pushCommitmentsList(data);
                }
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching Commitments list");
            });
    }

    getLastWeekResults(pageNo) {
        this.getActivities(0);
        this.getCommitments(0);
        this.getVoices(0);
        // CommonDashboardService
        //     .getLastWeekResults(pageNo)
        //     .then((data) => {
        //         this.setState({lastWeekFrom: data.fromDate, lastWeekTo: data.toDate, lastWeekPageNo: pageNo});
        //         this
        //             .props
        //             .loadActivitiesList(data.activityList);
        //         this
        //             .props
        //             .loadVoicesList(data.voiceList);
        //         this
        //             .props
        //             .loadWeeklyCommitmentsList(data.commitmentList);
        //         this
        //             .props
        //             .loadCudsList(data.cudList);
        //         this
        //             .props
        //             .loadMemberSummaryList(data.weekPoints.memberPoints);
        //         this
        //             .props
        //             .setClubWeeklyPoints(data.weekPoints.totalPoint)
        //     })
        //     .catch((error) => {
        //         riverToast.show(error.status_message || "Something went wrong while fetching last week results");
        //     })
    }

    getClubSettings() { 
        CommonDashboardService.getClubSettings()
        .then((data) => {
            this.setState({
                ...this.state,
                secretary: data.secretary,
                treasurer: data.treasurer,
                selectedMasters: data.activities
            });
            this.props.fieldChange('location', data.location);
            this.props.fieldChange('target', data.target);
            this.props.setBODUserSelected(data.boardMembers.map(user => {return {avatar: user.avatar ,fullname: user.firstName + ' ' + user.middleName + ' ' + user.lastName,id: user.userId,type: "USER",username: user.email}}) || []);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while checking club status");
        });
    }

    checkClubSetupStatus() {
        CommonDashboardService.checkSetupFinished()
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
            riverToast.show(error.status_message || "Something went wrong while checking club status");
        });
    }

    isClubSettingsFinish() {
        CommonDashboardService.isClubSettingsFinish()
        .then((data) => {
            this.setState({ unFinished: !data.ensure });
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while checking club status");
        });
    }

    finishSetup() {
        CommonDashboardService.finishSettings()
        .then((data) => {
            riverToast.show("Club setup finished successfully");
            window.location.reload();
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while finishing club settings");
        });
    }

    assignActivity(activityId, assignees, year = '2018') {
        let request = {users: assignees, year: year};
        CommonDashboardService.assignActivity(activityId, request)
        .then((data) => {
            riverToast.show("Assigned to activity successfully");
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while finishing club settings");
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonDashboard);