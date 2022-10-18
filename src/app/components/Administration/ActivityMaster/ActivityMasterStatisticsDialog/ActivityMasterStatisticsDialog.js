import React from "react";
import { render } from 'react-dom';
import Icon from 'material-ui/Icon';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import  { Doughnut } from  'react-chartjs-2';
import { Link } from 'react-router-dom';

import { Toast, riverToast } from '../../../Common/Toast/Toast';
import {Util} from '../../../../Util/util';
import { ActivityMasterStatisticsDialogService } from "./ActivityMasterStatisticsDialog.service"

import "./ActivityMasterStatisticsDialog.scss";

class ActivityMasterStatisticsDialog extends React.Component {

    state = {
        activityMasterStats : ""
    }

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            if(this.props.activityMaster){
                this.loadActivityMasterStat(this.props.activityMaster.id);
            }
        }
    }

    // data = {
    //     labels: [
    //         'Total',
    //         'Completed',
    //         'In Progress'
    //     ],
    //     datasets: [{
    //         data: [this.state.activityMasterStats.totalActivities, this.state.activityMasterStats.activitiesCompleted, this.state.activityMasterStats.activitiesInProgress],
    //         backgroundColor: [
    //         '#FF6384',
    //         '#36A2EB',
    //         '#FFCE56'
    //         ],
    //         hoverBackgroundColor: [
    //         '#FF6384',
    //         '#36A2EB',
    //         '#FFCE56'
    //         ]
    //     }]
    // };

    render() {

        const clubsList = (this.state.activityMasterStats) ? this.state.activityMasterStats.notTakenClubs.map((club, index) => {
                                                                return <div key={index} className="club-tile">
                                                                            <div className="club-name">{club}</div>
                                                                        </div>
                                                            }) 
                                                            : false;
        const statusNameMap = {
            "In Progress": "in-progress",
            "Approved": "approved",
            "Completed": "completed",
            "Rejected": "rejected"
        }
        const tableRows = (this.state.activityMasterStats) ? this.state.activityMasterStats.activityMasterClubData.map((club, index) => {
                                                                return <TableRow key={index} className="activities-table-row">
                                                                            <TableCell>{club.club}</TableCell>
                                                                            <TableCell>{club.activityTitle}</TableCell>
                                                                            <TableCell className={(statusNameMap[club.status]) ? statusNameMap[club.status] : "status"}>{club.status}</TableCell>
                                                                            <TableCell numeric>{club.numberOfAssignees}</TableCell>
                                                                            <TableCell><Link to={"/admin/activities/detail/" + club.linkToActivity}>{club.activityTitle}</Link></TableCell>
                                                                            <TableCell numeric>{club.clubPointsEarned}</TableCell>
                                                                        </TableRow>
                                                            })
                                                            : false;
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="activities-statistics-dialog"
            >
                <DialogTitle>Activity Statistics</DialogTitle>
                <DialogContent>
                    <div className="activity-master-statistics-dialog-container">
                        <div className="stat-types-container statistics-item">
                            <div className="heading">Activity Stats</div>
                            <div className="statistics-item-list">
                                <div className="stats-graphs-container">
                                    {/* <div className="stats-graph">
                                        <Doughnut data={this.data} redraw/>
                                    </div> */}
                                </div>
                                <div className="stat-type total">
                                    <div className="title">Total</div>
                                    <div className="count">{this.state.activityMasterStats.totalActivities}</div>
                                </div>
                                <div className="stat-type in-progress">
                                    <div className="title">In Progress</div>
                                    <div className="count">{this.state.activityMasterStats.activitiesInProgress}</div>
                                </div>
                                <div className="stat-type completed">
                                    <div className="title">Completed</div>
                                    <div className="count">{this.state.activityMasterStats.activitiesCompleted}</div>
                                </div>
                                <div className="stat-type approved">
                                    <div className="title">Approved</div>
                                    <div className="count">{this.state.activityMasterStats.activitiesApproved}</div>
                                </div>
                                <div className="stat-type rejected">
                                    <div className="title">Rejected</div>
                                    <div className="count">{this.state.activityMasterStats.activitiesRejected}</div>
                                </div>
                            </div>
                        </div>
                        <div className="excluded-clubs-container statistics-item">
                            <div className="heading">Clubs that haven't taken this Activity</div>
                            <div className="clubs-list statistics-item-list">
                                {
                                    (clubsList.length > 0) ?
                                        clubsList
                                        : <div>No clubs left</div>
                                }
                            </div>
                        </div>
                        {
                            (tableRows.length > 0) &&
                                <div className="activity-status-table-container statistics-item">
                                    <div className="heading">Activity Stats</div>
                                    <div className="statistics-item-table">
                                        <Table className="activities-table">
                                            <TableHead className="activities-table-head">
                                                <TableRow>
                                                    <TableCell>Club</TableCell>
                                                    <TableCell>Activity title</TableCell>
                                                    <TableCell>Current Status</TableCell>
                                                    <TableCell>No. of Assignees</TableCell>
                                                    <TableCell>Link to activity</TableCell>
                                                    <TableCell>Points Earned</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody className="activities-table-body">
                                                {tableRows}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                        }
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    loadActivityMasterStat(activityMasterId) {
        ActivityMasterStatisticsDialogService.getActivityMasterStats(activityMasterId)
        .then((data) => {
            this.setState({ activityMasterStats: data });
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching stats");
        })
    }

    handleRequestClose() {
        this.props.onRequestClose()
    }
}

  export default ActivityMasterStatisticsDialog;