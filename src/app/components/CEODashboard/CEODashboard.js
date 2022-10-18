import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { Chart } from 'react-google-charts';
import Paper from 'material-ui/Paper';
import moment from 'moment';

// root component
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { riverToast } from '../Common/Toast/Toast';
import SimpleListDialog from '../Common/SimpleListDialog/SimpleListDialog';
import CEOVoice from './CEOVoice/CEOVoice';

// css
import "./CEODashboard.scss";

// actions
import { loadActivitiesList,
        loadVoicesList,
        loadCommitmentsList,
        loadCudList,
        loadFocusAreaPoints,
        loadFocusAreaList,
        loadClubPoints,
        loadClubsList,
        clearActivitiesList,
        loadTopClubs,
        loadTopMembers } from './CEODashboard.actions';
import { CEODashboardService } from './CEODashboard.service';

const mapStateToProps = (state, ownProps) => {
    return {
        ceoDash: state.CEODashboardReducer
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadActivitiesList: (list) => {
            dispatch(loadActivitiesList(list))
        },
        loadVoicesList: (list) => {
            dispatch(loadVoicesList(list))
        },
        loadCommitmentsList: (list) => {
            dispatch(loadCommitmentsList(list))
        },
        loadCudList: (list) => {
            dispatch(loadCudList(list))
        },
        loadFocusAreaPoints: (list) => {
            dispatch(loadFocusAreaPoints(list))
        },
        loadFocusAreaList: (list) => {
            dispatch(loadFocusAreaList(list))
        },
        loadClubPoints: (list) => {
            dispatch(loadClubPoints(list))
        },
        loadClubsList: (list) => {
            dispatch(loadClubsList(list))
        },
        clearActivitiesList: () => {
            dispatch(clearActivitiesList())
        },
        loadTopClubs: (list) => {
            dispatch(loadTopClubs(list))
        },
        loadTopMembers: (list) => {
            dispatch(loadTopMembers(list))
        }
    }
}

class CEODashboard extends Component {
    state = {
        slices: {},
        tabValue: 0,
        selectedFAStroke: []
    }

faChart = '';
clubChart = '';

constructor(props) {
    super(props);
    const superClass = this;


    this.faChartEvents = [
        {
            eventName: 'select',
            callback(Chart) {
                var selection = Chart.chart.getSelection();
                selection = selection[0];

                if(!superClass.faChart) superClass.faChart = Chart;

                // Chart.chart.setSelection([{row:selection.row,column:selection.column}]);

                superClass.props.clearActivitiesList();

                if(selection && (selection.row === 0 || selection.row)){
                    const selectedFA = superClass.props.ceoDash.focusAreaList[selection.row];
                    superClass.setState({
                        ...superClass.state,
                        slices: {},
                        selectedFA: selectedFA,
                        selectedIndex: selection.row
                    });


                    superClass.loadClubChart(selectedFA.code);
                } else {
                    superClass.setState({
                        ...superClass.state,
                        slices: {},
                        selectedFA: ''
                    });
                }    

                // setTimeout(superClass.setSelectionFAChart(selection), 3000);
            },
        }
    ];

    this.clubChartEvents = [
        {
            eventName: 'select',
            callback(Chart) {
                var selection = Chart.chart.getSelection();
                selection = selection[0];
                // superClass.props.clearActivitiesList();

                if(!superClass.clubChart) superClass.clubChart = Chart;

                if(selection && (selection.row === 0 || selection.row)){
                    const selectedClub = superClass.props.ceoDash.clubsList[selection.row];
                    superClass.setState({
                        ...superClass.state,
                        slices: { [selection.row]: {offset: 0.2} },
                        selectedClub: selectedClub
                    });

                    superClass.getSelectedClubActivities(selectedClub.clubId)
                } else {
                    superClass.setState({ 
                        ...superClass.state,
                        slices: {},
                        selectedClub: '' 
                    });
                }    
            },
        }
    ];

    this.handleTabChange = this.handleTabChange.bind(this);
}

componentDidMount() {
    this.getTopMembers(10);
    this.getFocusAreaPoints();
    this.getTopClubs();
    this.getTopMembers();
}


render() {

    const activitiesList = this.props.ceoDash.activitiesList.map((activity, index) =>{
        return  <div key={index} className="activity-item" style={{"transition":"all 1s linear"}}>
            <div className="head">
                <div className="title" onClick={this.getActivity.bind(this, activity.id)}>{activity.title}</div>
                <div className="infos">                               
                    <div className="points">
                        <div className="club point">
                            <Icon className="icon">store</Icon> {activity.clubPoint}
                        </div>
                        <div className="member point">
                            <Icon className="icon">person</Icon> {activity.memberPoint}
                        </div>
                    </div>
                    <div className="status">{activity.status}</div>
                </div>
            </div>
            <div className="description">{activity.description}</div>
            <div className="assignees-list">
                {
                    activity.assignees &&
                        activity.assignees.map((assignee, index) => {
                        return <div className="assignee" key={index}>
                            <span className="assignee-name">{assignee.assignee.fullname}</span>
                            {
                                assignee.userDone &&
                                    <span className="assignee-done"><Icon className="icon">done</Icon></span>
                            }
                        </div>
                    })
                }
            </div>
        </div>
    });

    const topClubsTable = this.props.ceoDash.topClubs.map((club, index) => {
        return  <div className="table-row" key={index}>
            <div className="name table-cell">{club.clubName}</div>
            <div className="table-cell">{club.points}</div>
        </div>
    });

    const topMembersTable = this.props.ceoDash.topMembers.map((item, index) => {
        return  <div className="table-row" key={index}>
            <div className="name table-cell">{item.user.firstname +  ' ' + item.user.lastname}</div>
            <div className="club table-cell">{item.user.clubName ? item.user.clubName : '--'}</div>
            <div className="table-cell">{item.point}</div>
        </div>
    });

    const selectedAssigneesList = this.state.currentActivity ? this.state.currentActivity.assignees.map((assignee, index) => {
        return  <div className="assignee" key={index}>
            <div className="assignee-status">
                {
                    assignee.userDone &&
                        <Icon className="user-done">done</Icon>
                }
            </div>
            <div className="name">{assignee.assignee.fullname}</div>
        </div>
    }) : false ;

    return (
        <Root role="admin">
            <MainContainer>
                <PageTitle title="CEO Dashboard" />
                <div className="ceo-dashboard-container">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className="tabs-container"
                            fullWidth
                            >
                                <Tab label="Activities" />
                                <Tab label="Voice" />
                        </Tabs>
                    { this.state.tabValue == 0 && <div className="ceo-activities-wrapper">
                        <div className="fs-chart-area">
                            <div className="chart-container fa-chart">
                                <div className="info-banner"> Click on any bar item to see the clubwise distribution</div>
                                <Chart
                                    chartType="ColumnChart"
                                    data={this.props.ceoDash.focusAreaPoints}
                                    options={{
                                        title: 'Focus area wise point levels',
                                            hAxis: {
                                                title: 'Focus Area'
                                            },
                                                vAxis: {
                                                    title: 'Points'
                                                },
                                                    is3D: true,
                                                        animation: {
                                                            duration: 1000,
                                                                easing: 'out'
                                                        },
                                    }}
                                    loader="Rendering..."
                                    graph_id="faPoints"
                                    legend_toggle
                                    width="auto"
                                    chartEvents={this.faChartEvents}
                                    />
                            </div>
                            <div className="chart-container club-chart">

                                {
                                    this.state.selectedFA ?
                                        <div>
                                            <div className="info-banner"> Click on any portion to see the associated activities</div>
                                            <div className="fa-details-close" onClick={this.closeFADetails.bind(this)}><Icon className="icon">close</Icon></div>                                        
                                            <Chart
                                                chartType="PieChart"
                                                data={this.props.ceoDash.clubPoints}
                                                options={{
                                                    title: 'Club wise point distribution - ' + this.state.selectedFA.title,
                                                        hAxis: {
                                                            title: 'Club Name'
                                                        },
                                                            vAxis: {
                                                                title: 'Points'
                                                            },
                                                                slices: this.state.slices,
                                                                    is3D: true,
                                                                        animation: {
                                                                            duration: 2000,
                                                                                easing: 'inAndOut',
                                                                                    startup: true
                                                                        }
                                                }}
                                                loader="Rendering..."
                                                graph_id="clubPoints"
                                                legend_toggle
                                                width="100%"
                                                chartEvents={this.clubChartEvents}
                                                />
                                        </div>
                                        : 
                                        <div className="chart-placeholder">
                                        <Icon className="icon">pie_chart</Icon>
                                        <div className="helper-text">Click any bar chart item to view the clubwise point distribution.</div>
                                    </div>
                                }
                            </div>
                            {
                                this.state.selectedClub && 
                                    <div className="club-activities-details">
                                        {
                                            this.props.ceoDash.activitiesList.length > 0 &&
                                                <div className="activities-list">
                                                    <h6> Associated Activities</h6>
                                                    <div className="activities-list-close" onClick={this.closeClubActivitiesDetails.bind(this)}><Icon className="icon">close</Icon></div>
                                                    {activitiesList}
                                                </div>
                                        }

                                        {this.props.ceoDash.activitiesList.length == 0 && <div className="no-records">No activties found</div>}

                                        {
                                            this.state.currentActivity &&
                                                <div className="activity-container">
                                                    <div className="activity">
                                                        <div className="title">
                                                            <div className="value">{this.state.currentActivity.title}</div>
                                                        </div>
                                                        <div className="fy">
                                                            <span className="label">Effective on </span>
                                                            <span className="value">{this.state.currentActivity.year} - {this.state.currentActivity.year + 1}</span>                    
                                                        </div>
                                                        <div className="description">
                                                            <div className="label">Activity Description</div>
                                                            <div className="value">{this.state.currentActivity.description}</div>
                                                        </div>
                                                        <div className="infos">
                                                            <div className="item">
                                                                <div className="label">Self Assignable</div>
                                                                <div className="value">{this.state.currentActivity.selfAssignable ? "True" : "False"}</div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="label">Focus Area</div>
                                                                <div className="value">{this.state.currentActivity.focusArea ? this.state.currentActivity.focusArea.title : ""}</div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="label">Club Points</div>
                                                                <div className="value">{this.state.currentActivity.clubPoint}</div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="label">Member Points</div>
                                                                <div className="value">{this.state.currentActivity.memberPoint}</div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="label">Status</div>
                                                                <div className="value">{this.state.currentActivity.status}</div>
                                                            </div>
                                                        </div>
                                                        <div className="assignees-box">
                                                            <div className="title">Assignees</div>
                                                            {
                                                                this.state.currentActivity.assignees.length > 0 ?
                                                                    <div className="assignees">
                                                                        {selectedAssigneesList}
                                                                    </div>
                                                                    :
                                                                    <div className="assignees-empty-note">No assignees yet</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                            }
                        </div>
                        <div className="top-tables">
                            {
                                this.props.ceoDash.topClubs.length > 0 &&
                                    <div className="top-list-table club">
                                        <div className="table-cation">Top Clubs</div>
                                        <div className="table-head">
                                            <div className="table-row">
                                                <div className="table-cell">Club Name</div>
                                                <div className="table-cell">Points</div>                                                    
                                            </div>
                                        </div>
                                        <div className="table-body">
                                            {topClubsTable}
                                        </div>
                                    </div>
                            }
                            {
                                this.props.ceoDash.topMembers.length > 0 &&
                                    <div className="top-list-table member">
                                        <div className="table-cation">Top Members</div>
                                        <div className="table-head">
                                            <div className="table-row">
                                                <div className="table-cell">User Name</div>
                                                <div className="table-cell">Club</div>                                                    
                                                <div className="table-cell">Points</div>                                                    
                                            </div>
                                        </div>
                                        <div className="table-body">
                                            {topMembersTable}
                                        </div>
                                    </div>
                            }
                        </div>
                    </div> }
                    { this.state.tabValue === 1 && <CEOVoice /> }
                </div>
            </MainContainer>
        </Root>
    );
}

handleTabChange(event, value){
    this.setState({tabValue: value})
}

closeFADetails() {
    this.setState({
        ...this.state,
        selectedClub: '',
        selectedFA: '',
        currentActivity: '',
        slices: {}
    });
    this.props.clearActivitiesList();
}

closeClubActivitiesDetails() {
    this.setState({
        ...this.state,
        selectedClub:'',
        currentActivity: '',
        slices: {}
    });
    this.props.clearActivitiesList();
}

getTopMembers(count) {
    CEODashboardService.getTopMembers(count)
        .then((data) => {

    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching top members");
    })
}

setSelectionFAChart(selection) {
    this.faChart.chart.setSelection([selection]);
}

processFocusAreaLists(list) {
    return list.map((item) => {
        return item.focusArea
    })
}

processFocusArePoints(list) {
    const colors = ['red','orange','yellow','green','blue','violet','indigo'];
    let result = list.map((item, index) => {
        return [item.focusArea.title, item.points, "color: " + colors[index] + ";,stroke-width: " + (typeof this.state.selectedFAStroke[index] != 'undefined' ? this.state.selectedFAStroke[index] : '0') + ";stroke-color: " + this.state.strokeColor + ";"]
    });

    result.unshift(['Focus Area','Points',{ role: 'style'}]);

    return result;
}

getFocusAreaPoints() {
    CEODashboardService.getFocusAreaPoints()
        .then((data) => {
        this.props.loadFocusAreaPoints(this.processFocusArePoints(data));
        this.props.loadFocusAreaList(this.processFocusAreaLists(data));
        let strokesArray = new Array(data.length);
        strokesArray = strokesArray.fill(0);

        this.setState({
            selectedFAStroke: strokesArray
        })
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching focus area points");
    })
}

processClubPoints(list) {
    let result = list.map((item) => {
        return [item.clubName, item.points]
    });

    result.unshift(['Club Name','Points']);

    return result;
}

loadClubChart(faCode) {
    CEODashboardService.getClubPoints(faCode)
        .then((data) => {
        this.props.loadClubPoints(this.processClubPoints(data));
        this.props.loadClubsList(data)
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching club points");
    })
}

getSelectedClubActivities(clubId) {
    CEODashboardService.getClubActivities(clubId, this.state.selectedFA.code)
        .then((data) => {
        this.props.loadActivitiesList(data);
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching club details");
    })
}

getActivity(activityId) {
    CEODashboardService.getClubActivityDetails(activityId)
        .then((data) => {
        this.setState({
            currentActivity: data
        })
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching activity details");
    })
}

getTopMembers(count = 10) {
    CEODashboardService.getTopMembers(count)
        .then((data) => {
        this.props.loadTopMembers(data);
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching top members");
    });
}

getTopClubs(count = 10) {
    CEODashboardService.getTopClubs(count)
        .then((data) => {
        this.props.loadTopClubs(data);
    })
        .catch((error) => {
        riverToast.show("Something went wrong while fetching top clubs");
    });
}
}

export default connect(mapStateToProps, mapDispatchToProps)(CEODashboard);