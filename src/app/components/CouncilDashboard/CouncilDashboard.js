import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import  { Line, Bar } from  'react-chartjs-2';
import { Chart } from 'react-google-charts';
import moment from 'moment';

// root component
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { riverToast } from '../Common/Toast/Toast';
import {SelectBox} from '../Common/SelectBox/SelectBox';
import SimpleListDialog from '../Common/SimpleListDialog/SimpleListDialog';

// css
import "./CouncilDashboard.scss";

// actions
import { loadActivitiesList,
         loadVoicesList,
         loadCudsList } from './CouncilDashboard.actions';
import { CouncilDashboardService } from './CouncilDashboard.service';

const mapStateToProps = (state, ownProps) => {
    return {
        councilDash: state.CouncilDashboardReducer
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadVoicesList: (list) => {
            dispatch(loadVoicesList(list))
        },
        loadActivitiesList: (list) => {
            dispatch(loadActivitiesList(list))
        },
        loadCudsList: (list) => {
            dispatch(loadCudsList(list))
        }
    }
}

class CouncilDashboard extends Component {
    state = {
        lastWeekSideBarValue: 0,
        pageNo: 0,
        lastWeekFrom: "",
        lastWeekTo: "",
        assigneesList: []
    }

    componentDidMount() {
        this.getLastWeek(this.state.pageNo);
    }
    render() {
        const sidebarBtns = [
            {
                title: "Activities",
                value: 1
            },
            {
                title: "Voices",
                value: 2
            },
            {
                title: "CUD",
                value: 3
            }
        ]

        const lastWeekSideBtns = sidebarBtns.map((item, index) => {
            return <div
                        className={("last-week-sidebar-btn ") + ((this.state.lastWeekSideBarValue == index) ? "active" : "")}
                        key={index}
                        onClick={this.handleSidebarChange.bind(this, index)}
                    >
                        {item.title}
                    </div>
        });

        const activityTableRows = (this.props.councilDash.activitiesList) ? this.props.councilDash.activitiesList.map((item, index) => {
            return <TableRow key={index} className="points-history-table-row">
                        <TableCell className="link no-ellipsis"  onClick={() => {this.props.history.push("/admin/activities/view/" + item.id);}}>{item.title}</TableCell>
                        <TableCell className="no-ellipsis">{item.description}</TableCell>
                        <TableCell className="no-ellipsis">{item.activityMaster ? item.activityMaster.title : "" }</TableCell>                        
                        <TableCell className="no-ellipsis">
                        {
                                (item.assigneeList && item.assigneeList.length > 1) &&
                                    <div 
                                        className="show-assignees-btn"
                                        onClick={this.onViewAssigneesList.bind(this, item.assigneeList)}
                                    >
                                        View ({item.assigneeList.length})
                                    </div>
                            }
                            {
                                (item.assigneeList == null || !item.assigneeList || item.assigneeList.length == 0) &&
                                    <div className="show-assignees-empty-msg">
                                        No Assignees
                                    </div>
                            }
                            {
                                (item.assigneeList && item.assigneeList.length == 1) &&
                                    <div 
                                        className="show-assignees-single-assignee"
                                    >
                                        {item.assigneeList[0]}
                                    </div>
                            }
                        </TableCell>
                        <TableCell className="no-ellipsis">{item.council ? item.council.name : ""}</TableCell>
                        <TableCell className="no-ellipsis">{item.club ? item.club.clubName : ""}</TableCell>
                        <TableCell className="no-ellipsis">{item.status}</TableCell>
                        <TableCell className="no-ellipsis">{item.createdBy}</TableCell>
                        <TableCell className="no-ellipsis">{item.updatedDate ? moment.unix(item.updatedDate / 1000).format("DD MMM YYYY, hh:mm A") : moment.unix(item.createdDate / 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>
                        <TableCell className="no-ellipsis">{moment.unix(item.updatedDate / 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>
                        <TableCell className="no-ellipsis">{item.memberPoints}</TableCell>                        
                        <TableCell className="no-ellipsis">{item.clubPoints}</TableCell>
                    </TableRow>
        })
        : false;

        const voicesTableRows = (this.props.councilDash.voicesList) ? this.props.councilDash.voicesList.map((item, index) => {
            return <TableRow key={index} className="points-history-table-row">
                        <TableCell className="link"  onClick={() => {this.props.history.push("/admin/voices/detail/" + item.voiceId + '/' + item.voiceHash);}}>{item.title}</TableCell>
                        <TableCell className="no-ellipsis">{item.postedBy ? item.postedBy.name : ''}</TableCell>
                        <TableCell className="no-ellipsis">{item.voiceCouncils ? item.voiceCouncils.name : ""}</TableCell>
                        <TableCell className="no-ellipsis">{item.actionStatus ? item.actionStatus.message : ""}</TableCell>
                        <TableCell className="no-ellipsis">{item.actionStatus ? item.actionStatus.userFullName : ""}</TableCell>
                        <TableCell className="no-ellipsis">{moment.unix(item.createdOn / 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>                        
                    </TableRow>
        })
        : false;

        const cudTableRows = (this.props.councilDash.cudList) ? this.props.councilDash.cudList.map((item, index) => {
            return <TableRow key={index} className="points-history-table-row">
                        <TableCell className="no-ellipsis">{item.title}</TableCell>
                        <TableCell className="no-ellipsis">{item.description}</TableCell>
                        <TableCell className="no-ellipsis">{moment.unix(item.achievementDate / 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>
                        <TableCell className="no-ellipsis">{item.createdBy ? item.createdBy.fullname : ""}</TableCell>
                        <TableCell className="no-ellipsis">{moment.unix(item.createdDate / 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>
                        <TableCell className="no-ellipsis">{item.council ? item.council.name : ""}</TableCell>                        
                        <TableCell className="no-ellipsis">{item.councilActionStatus}</TableCell>
                        <TableCell className="no-ellipsis">{item.bucket_type ? item.bucket_type.title : ""}</TableCell>
                        <TableCell className="no-ellipsis">{item.memberPoint}</TableCell>
                        <TableCell className="no-ellipsis">{item.clubPoint}</TableCell>                       
                    </TableRow>
        })
        : false;

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Council Dashboard" />
                    <div className="council-dashboard-container">
                    <div className="link_container">
                            
                            <div className="box">
                                <div className="title">
                                    Activities
                                </div>
                                <div className="links">
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
                                    CUD
                                </div>
                                <div className="links">            
                                    <span>
                                        <a href="/#/admin/councilCUD">View all CUD</a>
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
                        <div className="last-week-first-col">
                            <div className="last-week-week-control last-week-sidebar">
                                <div className="last-week-week-control-btns-container">
                                    <Icon
                                        className="last-week-week-control-btn"
                                        onClick={this.getWeekSummary.bind(this, 'prev')}
                                    >
                                        chevron_left
                                    </Icon>
                                    <div className="last-week-week-control-text">
                                        <span className="last-weeks-week-control-date">{moment.unix(this.state.lastWeekFrom / 1000).format("DD MMM YYYY")}</span>
                                        <span>to</span>
                                        <span className="last-weeks-week-control-date">{moment.unix(this.state.lastWeekTo / 1000).format("DD MMM YYYY")}</span>
                                    </div>
                                    <Icon
                                        className={("last-week-week-control-btn") + (this.state.pageNo == 0 ? " disabled" : "")}
                                        onClick={this.getWeekSummary.bind(this, 'next')}
                                    >
                                        chevron_right
                                    </Icon>
                                </div>
                            </div>
                            <div className="last-week-sidebar">
                                {lastWeekSideBtns}
                            </div>
                        </div>
                        {
                            (this.state.lastWeekSideBarValue == 0) &&
                                <div className="last-week-table-container activities">
                                    <div className="table-navigate">
                                        <div className="link" onClick={() => {this.props.history.push("/admin/activities")}}>Go To Activities</div>
                                    </div>
                                    <div className="last-week-table-title">
                                        Activities
                                    </div>
                                    <div className="last-week-table-content">
                                        <Table className="last-week-table">
                                            <TableHead className="last-week-table-head">
                                                <TableRow>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell>Master</TableCell>
                                                    <TableCell>Assignees</TableCell>
                                                    <TableCell>Panel</TableCell>
                                                    <TableCell>Club Name</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Action By</TableCell>
                                                    <TableCell>Last Updated</TableCell>
                                                    <TableCell>User Points</TableCell>
                                                    <TableCell>Club Points</TableCell>                                                        
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="last-week-table-body">
                                                {activityTableRows}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                        }
                        {
                            (this.state.lastWeekSideBarValue == 1) &&
                                <div className="last-week-table-container voices">
                                    <div className="table-navigate">
                                        <div className="link" onClick={() => {this.props.history.push("/admin/voices")}}>Go To Voices</div>
                                    </div>
                                    <div className="last-week-table-title">
                                        Voices
                                    </div>
                                    <div className="last-week-table-content">
                                        <Table className="last-week-table">
                                            <TableHead className="last-week-table-head">
                                                <TableRow>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>Raised By</TableCell>
                                                    <TableCell>Panel</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Action By</TableCell>
                                                    <TableCell>Created On</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="last-week-table-body">
                                                {voicesTableRows}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                        }
                        {
                            (this.state.lastWeekSideBarValue == 2) &&
                                <div className="last-week-table-container cud">
                                    <div className="last-week-table-title">
                                        CUD
                                    </div>
                                    <div className="last-week-table-content">
                                        <Table className="last-week-table">
                                            <TableHead className="last-week-table-head">
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
                                            <TableBody className="last-week-table-body">
                                                {cudTableRows}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                        }
                    </div>
                </MainContainer>
                <SimpleListDialog
                    open={this.state.assigneesListDialog}
                    onRequestClose={this.toggleAssigneesListDialog.bind(this)}
                    title="Activities assignees list"
                    list={this.state.assigneesList}
                />
            </Root>
        );
    }

    handleSidebarChange(value) {
        this.setState({ lastWeekSideBarValue : value });
    };

    onViewAssigneesList(list) {
        this.setState({
            ...this.state,
            assigneesList: list,
            assigneesListDialog: true
        });
    }

    toggleAssigneesListDialog(list) {
        const flag = !this.state.assigneesListDialog;
        if(!flag) {
            this.setState({
                ...this.state,
                assigneesList: [],
                assigneesListDialog: flag
            });
        } else {
            this.setState({ assigneesListDialog: flag });
        }
    }

    getWeekSummary(durn) {
        const currentPage = this.state.pageNo;
        if(durn == "next" && currentPage == 0) {
            return;
        } else {
            switch (durn) {
                case 'prev':
                    this.getLastWeek(currentPage + 1);
                    break;
            
                case 'next':
                    this.getLastWeek(currentPage - 1);
                    break;
            }
        }
    }

    getLastWeek(pageNo) {
        CouncilDashboardService.getLastWeek(pageNo)
        .then((data) => {
            this.setState({
                lastWeekFrom: data.fromDate,
                lastWeekTo: data.toDate,
                pageNo: pageNo
            });
            this.props.loadActivitiesList(data.activityList);
            this.props.loadVoicesList(data.voiceList);
            this.props.loadCudsList(data.cudList);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while getting council last week");
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CouncilDashboard)