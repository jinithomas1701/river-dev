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

// root component
import {Root} from "../Layout/Root";

// custom component
import {Util} from "../../Util/util";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {riverToast} from '../Common/Toast/Toast';
import {SelectBox} from '../Common/SelectBox/SelectBox';
import CreateCommitmentDialog from './CreateCommitmentDialog/CreateCommitmentDialog';
import EditTargetDialog from "./EditTargetDialog/EditTargetDialog";
import SimpleListDialog from '../Common/SimpleListDialog/SimpleListDialog';

// css
import "./ClubDashboard.scss";

// actions
import {
    setClubPoints,
    setPointsDiff,
    loadPillarStats,
    clearPillarStats,
    loadActivitiesList,
    loadVoicesList,
    loadCommitmentsList,
    changeCommitmentStatus,
    loadCommitmentStatus,
    loadWeeklyCommitmentsList,
    loadMemberSummaryList,
    setClubWeeklyPoints,
    setTargetAchieved,
    loadTopUsersList,
    loadCudsList,
    loadTargetsList,
    setClubTarget
} from './ClubDashboard.actions';
import {ClubDashboardService} from './ClubDashboard.service';

const mapStateToProps = (state, ownProps) => {
    return {clubDash: state.ClubDashboardReducer}
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
        changeCommitmentStatus: (index, value) => {
            dispatch(changeCommitmentStatus({index: index, value: value}));
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
        loadCudsList: (list) => {
            dispatch(loadCudsList(list))
        },
        loadTargetsList: (list) => {
            dispatch(loadTargetsList(list))
        },
        setClubTarget: (points) => {
            dispatch(setClubTarget(points))
        }
    }
}

class ClubDashboard extends Component {
    state = {
        value: 0,
        clubsNames: [],
        clubsPoints: [],
        pillarBarType: 0,
        lastWeekPageNo: 0,
        topClub: "",
        myClub: "",
        pillarBar: [
            'Yearly Chart', 'Monthly Chart', 'Yearly Chart'
        ],
        lastWeekSideBarValue: 0,
        commitmentTabValue: 0,
        createCommitment: false,
        editTargetDialog: false,
        currentTarget: "",
        lastWeekFrom: "",
        lastWeekTo: "",
        assigneesList: []
    }

constructor(props) {
    super(props);
}

componentDidMount() {
    if (this.props.match.params.tabValue) {
        this.setState({
            value: parseInt(this.props.match.params.tabValue)
        });
    }
    this.getLastWeekResults(this.state.lastWeekPageNo);
}

componentDidUpdate() {}

componentWillUnmount() {}

render() {
    const activityTableRows = (this.props.clubDash.activitiesList)
    ? this
    .props
    .clubDash
    .activitiesList
    .map((item, index) => {
        return <TableRow key={index} className="points-history-table-row">
            <TableCell
                className="link no-ellipsis"
                onClick={() => {
                    this
                        .props
                        .history
                        .push("/admin/activities/view/" + item.id);
                }}>{item.title}</TableCell>
            <TableCell className="no-ellipsis">{item.description}</TableCell>
            <TableCell className="no-ellipsis">{item.activityMaster
                    ? item.activityMaster.title
                : ""}</TableCell>
            <TableCell className="no-ellipsis">
                {(item.assigneeList && item.assigneeList.length > 1) && <div
                                                                            className="show-assignees-btn"
                                                                            onClick={this
                            .onViewAssigneesList
                            .bind(this, item.assigneeList)}>
                        View ({item.assigneeList.length})
                    </div>
                }
                {(item.assigneeList == null || !item.assigneeList || item.assigneeList.length == 0) && <div className="show-assignees-empty-msg">
                    No Assignees
                </div>
                }
                {(item.assigneeList && item.assigneeList.length == 1) && <div className="show-assignees-single-assignee">
                    {item.assigneeList[0]}
                </div>
                }
            </TableCell>
            <TableCell className="no-ellipsis">{item.council
                    ? item.council.name
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{item.workflowStatus}</TableCell>
            <TableCell className="no-ellipsis">{item.actionByUser
                    ? item.actionByUser.fullname
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{item.updatedDate
                    ? moment
                    .unix(item.updatedDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")
                : moment
                    .unix(item.createdDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
            <TableCell className="no-ellipsis">{item.memberPoints}</TableCell>
            <TableCell className="no-ellipsis">{item.clubPoints}</TableCell>
        </TableRow>
    })
    : false;

    const voicesTableRows = (this.props.clubDash.voicesList)
    ? this
    .props
    .clubDash
    .voicesList
    .map((item, index) => {
        return <TableRow key={index} className="points-history-table-row">
            <TableCell
                className="link no-ellipsis"
                onClick={() => {
                    this
                        .props
                        .history
                        .push("/admin/voices/detail/" + item.voiceId + '/' + item.voiceHash);
                }}>{item.title}</TableCell>
            <TableCell className="no-ellipsis">{item.postedBy
                    ? item.postedBy.name
                : ''}</TableCell>
            <TableCell className="no-ellipsis">{item.voiceCouncils
                    ? item.voiceCouncils.name
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{item.actionStatus.message}</TableCell>
            <TableCell className="no-ellipsis">{item.actionStatus
                    ? item.actionStatus.userFullName
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{moment
                    .unix(item.createdOn / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
        </TableRow>
    })
    : false;

    const commitmentTableRows = (this.props.clubDash.weeklyCommitmentsList)
    ? this
    .props
    .clubDash
    .weeklyCommitmentsList
    .map((item, index) => {
        return <TableRow key={index} className="points-history-table-row">
            <TableCell className="no-ellipsis">{item.title}</TableCell>
            <TableCell className="no-ellipsis">{item.description}</TableCell>
            <TableCell className="no-ellipsis">{moment
                    .unix(item.targetDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
            <TableCell className="no-ellipsis">{item.currentStatusName}</TableCell>
            <TableCell className="no-ellipsis">{item.updatedDate
                    ? moment
                    .unix(item.updatedDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")
                : moment
                    .unix(item.createdDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
        </TableRow>
    })
    : false;

    const memberSummaryTableRows = (this.props.clubDash.memberSummaryList)
    ? this
    .props
    .clubDash
    .memberSummaryList
    .map((item, index) => {
        return <TableRow key={index} className="points-history-table-row">
            <TableCell className="no-ellipsis">{item.memberName}</TableCell>
            <TableCell className="no-ellipsis">{item.designation}</TableCell>
            <TableCell className="no-ellipsis">{item.clubDesignation}</TableCell>
            <TableCell className="no-ellipsis">{item.personalPoints}</TableCell>
            <TableCell className="no-ellipsis">{item.clubPoints}</TableCell>
        </TableRow>
    })
    : false;

    const cudTableRows = (this.props.clubDash.cudTableList)
    ? this
    .props
    .clubDash
    .cudTableList
    .map((item, index) => {
        return <TableRow key={index} className="points-history-table-row">
            <TableCell className="no-ellipsis">{item.title}</TableCell>
            <TableCell className="no-ellipsis">{item.description}</TableCell>
            <TableCell className="no-ellipsis">{moment
                    .unix(item.achievementDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
            <TableCell className="no-ellipsis">{item.createdBy
                    ? item.createdBy.fullname
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{moment
                    .unix(item.createdDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
            <TableCell className="no-ellipsis">{item.council
                    ? item.council.name
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{item.councilActionStatus}</TableCell>
            <TableCell className="no-ellipsis">{item.bucket_type
                    ? item.bucket_type.title
                : ""}</TableCell>
            <TableCell className="no-ellipsis">{item.memberPoint}</TableCell>
            <TableCell className="no-ellipsis">{item.clubPoint}</TableCell>
        </TableRow>
    })
    : false;

    const topUsersTableRows = (this.props.clubDash.topUsersTableList)
    ? this
    .props
    .clubDash
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

    const allCommitmentsTableRows = (this.props.clubDash.allCommitmentsTableList)
    ? this
    .props
    .clubDash
    .allCommitmentsTableList
    .map((item, index) => {
        return <TableRow key={index} className="points-history-table-row">
            <TableCell className="no-ellipsis">{item.title}</TableCell>
            <TableCell className="no-ellipsis">{item.description}</TableCell>
            <TableCell className="no-ellipsis">{moment
                    .unix(item.targetDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
            <TableCell className="no-ellipsis">
                <select
                    className="g-select"
                    value={item.currentStatus}
                    onChange={this.handleCommitmentStatusChange(index, item.id)}>
                    {this
                        .props
                        .clubDash
                        .statusList
                        .map((status, index) => {
                        return <option key={index} value={status.value}>{status.title}</option>
                    })
                    }
                </select>
            </TableCell>
            <TableCell className="no-ellipsis">{moment
                    .unix(item.updatedDate / 1000)
                    .format("DD MMM YYYY, hh:mm A")}</TableCell>
        </TableRow>
    })
    : false;

    const barTypeList = [
        {
            title: 'Weekly',
            value: 0
        }, {
            title: 'Monthly',
            value: 1
        }, {
            title: 'Yearly',
            value: 2
        }
    ];

    const sidebarBtns = [
        {
            title: "Summary",
            value: 0,
            count: null
        }, {
            title: "Commitments",
            value: 1,
            count: this.props.clubDash.allCommitmentsTableList.length || 0
        }, {
            title: "Activities",
            value: 2,
            count: this.props.clubDash.activitiesList.length || 0
        }, {
            title: "Voices",
            value: 3,
            count: this.props.clubDash.voicesList.length || 0
        }, {
            title: "CUD",
            value: 4,
            count: this.props.clubDash.cudTableList.length || 0
        }
    ]
    const lastWeekSideBtns = sidebarBtns.map((item, index) => {
        return <div
                   className={("last-weeks-sidebar-btn ") + ((this.state.lastWeekSideBarValue == index) ? "active" : "")}
                   key={index}
                   onClick={this.handleSidebarChange.bind(this, index)}
                   >
            {item.title} {item.count && <span className="count">{item.count}</span> }
        </div>
    });

    const targetsList = this
    .props
    .clubDash
    .targetsList
    .map((item, index) => {
        return <div key={index} className="fy-target-tile">
            <div className="club-target-actions">
                <Icon
                    className="club-target-actions-edit-btn"
                    onClick={this
                        .onTargetEdit
                        .bind(this, item)}>
                    edit
                </Icon>
            </div>
            <span className="target-point">{item.target}</span>
            <span className="target-text">target for year</span>
            <span className="target-year">{item.financialYear}</span>
        </div>
    });

    return (
        <Root role="admin">
            <MainContainer>
                <PageTitle title="Club Dashboard"/>
                <div className="club-dashboard-container">

                    <div className="link_container">
                        <div className="box">
                            <div className="title">
                                Meetings
                            </div>
                            <div className="links">
                                <span>
                                    <a href="/#/admin/meetings/detail">Create Meeting</a>
                                </span>
                                <span>
                                    <a href="/#/admin/meetings">View all Meetings</a>
                                </span>                                    
                            </div>
                        </div>

                        <div className="box">
                            <div className="title">
                                Activities
                            </div>
                            <div className="links">
                                <span>
                                    <a href="/#/admin/activities/detail">Create Activity</a>
                                </span>
                                <span>
                                    <a href="/#/admin/activities">View all Activities</a>
                                </span>                                    
                            </div>
                        </div>

                        <div className="box">
                            <div className="title">
                                Voices
                            </div>
                            <div className="links">                                    
                                <span>
                                    <a href="/#/admin/voices">View all voices</a>
                                </span>                                    
                            </div>
                        </div>

                        <div className="box">
                            <div className="title">
                                Polls
                            </div>
                            <div className="links">      
                                <span>
                                    <a href="/#/admin/polls/detail/">Create a poll</a>
                                </span>                               
                                <span>
                                    <a href="/#/admin/polls">View all polls</a>
                                </span>                                    
                            </div>
                        </div>
                        <div className="box">
                            <div className="title">
                                Administration
                            </div>
                            <div className="links">            
                                <span>
                                    <a href="/#/admin">Go to administration home</a>
                                </span>                                    
                            </div>
                        </div>

                    </div>

                    <AppBar className="page-tabs-appbar" position="static" color="default">
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary">
                            <Tab label="Week Summary"/>
                            <Tab label="Compare"/>
                            <Tab label="Pillars"/>
                            <Tab label="Commitments & Targets"/>
                        </Tabs>
                    </AppBar>
                    {this.state.value === 0 && <div className="tab-container last-weeks">
                        <div className="last-weeks-first-col">
                            <div className="last-weeks-week-control last-weeks-sidebar">
                                <div className="last-weeks-week-control-btns-container">
                                    <Tooltip title="Previous Week" placement="top">
                                        <Icon
                                            className="last-weeks-week-control-btn"
                                            onClick={this
                                                .getWeekSummary
                                                .bind(this, 'prev')}>
                                            chevron_left
                                        </Icon>
                                    </Tooltip>
                                    <div className="last-weeks-week-control-text">
                                        <span className="last-weeks-week-control-date">{moment
                                                .unix(this.state.lastWeekFrom / 1000)
                                                .format("DD MMM YYYY")}</span>
                                        <span>to</span>
                                        <span className="last-weeks-week-control-date">{moment
                                                .unix(this.state.lastWeekTo / 1000)
                                                .format("DD MMM YYYY")}</span>
                                    </div>
                                    <Icon
                                        className={("last-weeks-week-control-btn") + (this.state.lastWeekPageNo == 0
                                                                                      ? " disabled"
                                                                                      : "")}
                                        onClick={this
                                            .getWeekSummary
                                            .bind(this, 'next')}>
                                        chevron_right
                                    </Icon>
                                </div>
                            </div>
                            <div className="last-weeks-sidebar">
                                {lastWeekSideBtns}
                            </div>
                        </div>
                        {(this.state.lastWeekSideBarValue == 0) && <div className="last-weeks-table-container summary">
                        <div className="points-by-club">
                            Club got <span style={{}}>{this.props.clubDash.clubWeeklyPoint}</span> points this week.
                        </div>
                        <div className="points-by-members">
                            <Table className="points-by-members-table">
                                <TableHead className="points-by-members-table-head">
                                    <TableRow>
                                        <TableCell>Member Name</TableCell>
                                        <TableCell>L7 Designation</TableCell>
                                        <TableCell>Club Designation</TableCell>
                                        <TableCell>User Points</TableCell>
                                        <TableCell>Club Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="points-by-members-table-body">
                                    {memberSummaryTableRows}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                        }
                        {(this.state.lastWeekSideBarValue == 1) && <div className="last-weeks-table-container commitments">
                        <div className="last-weeks-table-title">
                            Commitments
                        </div>
                        <div className="last-weeks-table-content">
                            <Table className="last-weeks-table">
                                <TableHead className="last-weeks-table-head">
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Target Date</TableCell>
                                        <TableCell>Current Status</TableCell>
                                        <TableCell>Last Updated</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="last-weeks-table-body">
                                    {commitmentTableRows}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                        }
                        {(this.state.lastWeekSideBarValue == 2) && <div className="last-weeks-table-container activities">
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
                            <Table className="last-weeks-table">
                                <TableHead className="last-weeks-table-head">
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Master</TableCell>
                                        <TableCell>Assignees</TableCell>
                                        <TableCell>Panel</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action By</TableCell>
                                        <TableCell>Last Updated</TableCell>
                                        <TableCell>User Points</TableCell>
                                        <TableCell>Club Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="last-weeks-table-body">
                                    {activityTableRows}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                        }
                        {(this.state.lastWeekSideBarValue == 3) && <div className="last-weeks-table-container voices">
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
                            <Table className="last-weeks-table">
                                <TableHead className="last-weeks-table-head">
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Raised By</TableCell>
                                        <TableCell>Panel</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action By</TableCell>
                                        <TableCell>Created On</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="last-weeks-table-body">
                                    {voicesTableRows}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                        }
                        {(this.state.lastWeekSideBarValue == 4) && <div className="last-weeks-table-container cud">
                        <div className="last-weeks-table-title">
                            CUD
                        </div>
                        <div className="last-weeks-table-content">
                            <Table className="last-weeks-table">
                                <TableHead className="last-weeks-table-head">
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Raised By</TableCell>
                                        <TableCell>Raised Date</TableCell>
                                        <TableCell>Panel</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Bucket</TableCell>
                                        <TableCell>User Points</TableCell>
                                        <TableCell>Club Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="last-weeks-table-body">
                                    {cudTableRows}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                        }
                    </div>
                    }
                    {this.state.value === 1 && <div className="tab-container compare">
                        <div className="compare-top-percent-container">
                            <div className="compare-top-container">
                                {(this.state.myClub == this.state.topClub) && <div className="top-club self">
                                    <span className="top-club-value">{this.state.myClub}</span>
                                    <span className="top-club-text">is the club having the top point.</span>
                                </div>
                                }
                                {this.state.topClub && (this.state.myClub != this.state.topClub) && <div className="top-club others">
                                    <span className="top-club-value">{this.props.clubDash.pointsDiff}</span>
                                    <span className="top-club-text">points less than the club having the top point.</span>
                                </div>
                                }
                                {!this.state.topClub && <div className="top-club others">
                                    <span className="top-club-value">N/A</span>
                                    <span className="top-club-text">club having the top point</span>
                                </div>
                                }
                                <div className="top-club club-target">
                                    <span className="top-club-value">{this.props.clubDash.targetAchieved}%</span>
                                    <span className="top-club-text">Target achieved</span>
                                </div>
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
                        <div className="compare-chart-container">
                            <Chart
                                chartType="ColumnChart"
                                data={this.props.clubDash.clubPoints}
                                options={{
                                    title: 'Club Point Levels (Target: ' + this.props.clubDash.clubTarget + ')',
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
                                height="400px"
                                legend_toggle/>
                        </div>
                    </div>
                    }
                    {this.state.value === 2 && <div className="tab-container pillar">
                        <div className="pillar-chart-container">
                            <Chart
                                chartType="ColumnChart"
                                data={this.props.clubDash.pillarStats}
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
                                graph_id="PointsChart"
                                width="100%"
                                height="400px"/>
                        </div>
                        {/* <div className="pillar-bar-selector">
                                        <SelectBox
                                            id="pillar-bar-type"
                                            label="Bar Type"
                                            selectedValue = {this.state.pillarBarType}
                                            selectArray={barTypeList}
                                            onSelect={this.handleSelect('pillarBarType')}/>
                                    </div> */}
                    </div>
                    }
                    {this.state.value === 3 && <div className="tab-container commitments-targets">

                        <Tabs
                            value={this.state.commitmentTabValue}
                            onChange={this.handleCommitmentTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className="commitments-targets-tab">
                            <Tab label="Commitments"/>
                            <Tab label="Targets"/>
                        </Tabs>
                        {(this.state.commitmentTabValue == 0) && <div className="commitments-targets-tab-container commitments">
                        <div className="commitments-list">
                            <div className="commitments-list-head">
                                <div className="commitments-list-head-title">
                                    All Commitments
                                </div>
                                <div className="commitments-list-head-btn-container">
                                    <Button
                                        className="commitments-list-head-btn"
                                        raised
                                        color="primary"
                                        onClick={this
                                            .toggleCreateCommitment
                                            .bind(this)}>
                                        Add New
                                    </Button>
                                </div>
                            </div>
                            <Table className="commitments-list-table">
                                <TableHead className="commitments-list-table-head">
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Target Date</TableCell>
                                        <TableCell>Current Status</TableCell>
                                        <TableCell>Last Update</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="commitments-list-table-body">
                                    {allCommitmentsTableRows}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                        }
                        {(this.state.commitmentTabValue == 1) && <div className="commitments-targets-tab-container targets">
                        {targetsList}
                        <div className="bottom-fab-container new-activity-fab">
                            <Button
                                title="Add a new target"
                                fab
                                color="primary"
                                aria-label="add"
                                onClick={this
                                    .handleAddNewTarget
                                    .bind(this)}>
                                <Icon>add</Icon>
                            </Button>
                        </div>
                    </div>
                        }
                    </div>
                    }
                </div>
                <CreateCommitmentDialog
                    open={this.state.createCommitment}
                    onRequestClose={this
                        .toggleCreateCommitment
                        .bind(this)}
                    afterSuccess={this
                        .onCommitmentSuccess
                        .bind(this)}/>
                <EditTargetDialog
                    open={this.state.editTargetDialog}
                    target={this.state.currentTarget}
                    onRequestClose={this
                        .toggleTargetEditDialog
                        .bind(this)}
                    onSuccess={this
                        .toggleTargetEditDialog
                        .bind(this, true)}/>
                <SimpleListDialog
                    open={this.state.assigneesListDialog}
                    onRequestClose={this
                        .toggleAssigneesListDialog
                        .bind(this)}
                    title="Activities assignees list"
                    list={this.state.assigneesList}/>
            </MainContainer>
        </Root>
    );
}

handleTabChange = (event, value) => {
    this.setState({value});
    if (value == 1) {
        this.loadPoints();
    } else if (value == 2) {
        this.getPillarStats();
    } else if (value == 3) {
        this.loadCommitmentTargetTab();
    } else {
        this.setState({lastWeekPageNo: 0})
        this.getLastWeekResults(this.state.lastWeekPageNo);
    }
};

handleSidebarChange(value) {
    this.setState({lastWeekSideBarValue: value});
}

handleCommitmentTabChange = (event, value) => {
    this.setState({commitmentTabValue: value});
    this.loadCommitmentTargetTab(value);
}

handleSelect = name => value => {
    this.setState({[name]: value});
    if (name == "pillarBarType") {
        this.changeBarData(value)
    }
}

onTargetEdit(targetItem) {
    this.setState({currentTarget: targetItem});
    this.toggleTargetEditDialog();
}

handleAddNewTarget() {
    this.toggleTargetEditDialog();
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

toggleAssigneesListDialog(list) {
    const flag = !this.state.assigneesListDialog;
    if (!flag) {
        this.setState({
            ...this.state,
            assigneesList: [],
            assigneesListDialog: flag
        });
    } else {
        this.setState({assigneesListDialog: flag});
    }
}

getWeekSummary(durn) {
    const currentPage = this.state.lastWeekPageNo;
    if (durn == "next" && currentPage == 0) {
        return;
    } else {
        switch (durn) {
            case 'prev':
                this.getLastWeekResults(currentPage + 1);
                break;

            case 'next':
                this.getLastWeekResults(currentPage - 1);
                break;
        }
    }
}

loadCommitmentTargetTab(value) {
    let commitmentTab = (value || value == 0)
    ? value
    : this.state.commitmentTabValue;
    if (commitmentTab == 0) {
        this.getCommitmentsStatuses();
        this.getCommitmentsList();
    } else {
        this.getTargetsList();
    }
}

handleCommitmentStatusChange = (index, commitmentId) => event => {
    const commitmentUpdate = {
        id: commitmentId,
        currentStatus: event.target.value
    }
    this.changeCommitmentStatus(commitmentUpdate, index)
}

toggleCreateCommitment() {
    const flag = !this.state.createCommitment;

    this.setState({createCommitment: flag});
}

changeBarData(value) {
    switch (value) {
        case 0:

            break;
        case 1:

            break;
        case 2:

            break;
        default:

            break;
    }
}

loadCurrentTab() {
    switch (this.state.value) {
        case 1:
            this.loadPoints();
            break;
        case 2:
            this.getPillarStats();
            break;
        case 3:
            this.getCommitmentsList();
            break;
        default:
            this.getLastWeekResults(this.state.lastWeekPageNo);
            break;
    }
}

storePoints(data) {
    this.setState({
        ...this.state,
        topClub: data.topperName,
        myClub: data.myClubName
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

onCommitmentSuccess() {
    this.getCommitmentsList();
}

loadPoints() {
    ClubDashboardService
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

getPillarStats() {
    ClubDashboardService
        .getPillarStats()
        .then((data) => {
        this.processPillarStats(data);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching pillar statistics");
    })
}

getCommitmentsStatuses() {
    ClubDashboardService
        .getCommitmentsStatuses()
        .then((data) => {
        this
            .props
            .loadCommitmentStatus(data);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching commitment statuses");
    });
}

getTargetsList() {
    ClubDashboardService
        .getTargetsList()
        .then((data) => {
        this
            .props
            .loadTargetsList(data);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching target list");
    });
}

getCommitmentsList() {
    ClubDashboardService
        .getCommitmentsList()
        .then((data) => {
        this
            .props
            .loadCommitmentsList(data);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching commitment list");
    });
}

changeCommitmentStatus(commitment, index) {
    ClubDashboardService
        .updateCommitmentStatus(commitment)
        .then((data) => {
        riverToast.show("Commitment status changed successfully");
        this
            .props
            .changeCommitmentStatus(index, parseInt(commitment.currentStatus));
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while changing commitment status");
    });
}

getLastWeekResults(pageNo) {
    ClubDashboardService
        .getLastWeekResults(pageNo)
        .then((data) => {
        this.setState({lastWeekFrom: data.fromDate, lastWeekTo: data.toDate, lastWeekPageNo: pageNo});
        this
            .props
            .loadActivitiesList(data.activityList);
        this
            .props
            .loadVoicesList(data.voiceList);
        this
            .props
            .loadWeeklyCommitmentsList(data.commitmentList);
        this
            .props
            .loadCudsList(data.cudList);
        this
            .props
            .loadMemberSummaryList(data.weekPoints.memberPoints);
        this
            .props
            .setClubWeeklyPoints(data.weekPoints.totalPoint)
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching last week results");
    })
}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClubDashboard);