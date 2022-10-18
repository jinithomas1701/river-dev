import React, {Component} from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import {Line, Bar} from 'react-chartjs-2';
import {Chart} from 'react-google-charts';
import moment from 'moment';

import {Util} from "../../../../Util/util";
import {SelectBox} from '../../../Common/SelectBox/SelectBox';
import { AdminActivitySummaryService } from "./AdminActivitySummary.service";

import './AdminActivitySummary.scss';

export default class AdminAdminActivitySummary extends Component{
    constructor(props){
        super(props);
        this.state = {
            filterActivityView:"G",
            filterActivityDay: 10,
            filterActivityReport: "nil",
            clubNameList: [],
            activitySummary: [],
            activitySummaryDetailsList: []
        };
    }
    
    componentDidMount = () => {
        this.init();
    }

    render(){
        return (
            <article className="dash-filter">
                <div className="filter-head">
                    <div className="cols-1">
                        <h1 className="title">Current status of activities created on last {this.state.filterActivityDay} days.</h1>
                    </div>
                    <div className="cols-2">
                        <span className="label">Days</span>
                        <SelectBox 
                            placeholder="Days"
                            classes="filter-report-select"
                            disableSysClasses
                            selectedValue = {this.state.filterActivityDay}
                            selectArray={[{value:10,title:'10'},{value:20,title:'20'},{value:50,title:'50'},{value:100,title:'100'}]}
                            onSelect={this.handleActivityReportFilterDay()}
                            />
                    </div>
                    <div className="cols-2">
                        <span className="label">View As</span>
                        <SelectBox 
                            placeholder="View As"
                            classes="filter-report-select"
                            disableSysClasses
                            selectedValue = {this.state.filterActivityView}
                            selectArray={[{value:"G",title:'Graph'},{value:"T",title:'Table'}]}
                            onSelect={this.handleActivityReportFilterView()}
                            />
                    </div>
                    <div className="cols-3">
                        <span className="label">Club</span>
                        <SelectBox 
                            placeholder="Filter"
                            classes="filter-report-select"
                            disableSysClasses
                            selectedValue = {this.state.filterActivityReport}
                            selectArray={this.state.clubNameList}
                            onSelect={this.handleActivityReportFilter()}
                            />
                    </div>
                </div>
                <div className="filter-results">
                    {this.getAdminActivitySummaryTemplate(this.state.activitySummary)}
                </div>
                {
                    (this.state.activitySummaryDetailsList.length > 0) && (
                        <div className="summary-details">
                            {this.getAdminActivitySummaryDetailsTemplate(this.state.activitySummaryDetailsList)}
                        </div>
                    )
                }
            </article>
        );
    }

    getAdminActivitySummaryDetailsTemplate(adminActivitySummaryDetailsList){
        const template = (
            <article className="summary-wrapper">
                <h1 className="title">Summary</h1>
                {
                    adminActivitySummaryDetailsList.map(summary => {
                        return (<div className="summary-row" key={summary.createdOn}>
                                <div className="title">{summary.title}</div>
                                <div className="info">
                                    <div className="cols-1">{summary.clubName}</div>
                                    <div className="cols-1">{Util.getStatusFullText(summary.status)}</div>
                                    <div className="cols-1">{moment.unix(summary.createdOn / 1000).format("DD MMM YYYY")}</div>
                                </div>
                            </div>)
                    })
                }
            </article>
        );

        return template;
    }

    getAdminActivitySummaryTemplate(adminActivitySummary){
        let activityListTemplate;
        if(adminActivitySummary.length){
            activityListTemplate = (this.state.filterActivityView=="G")? this.getAdminActivitySummaryGraphTemplate(adminActivitySummary) : this.getAdminActivitySummaryTableTemplate(adminActivitySummary);
        }
        else{
            activityListTemplate = <div className="empty-content">Activity history is empty.</div>
        }
        return activityListTemplate;
    }

    getAdminActivitySummaryTableTemplate(adminActivitySummary){
        return (
            <table className="filter-result-table">
                <thead>
                    <tr>
                        <th>Created Date</th>
                        <th>Assigned</th>
                        <th>Member<br />Completed</th>
                        <th>President<br />Approved/Rejected</th>
                        <th>Panel<br />Approved/Rejected</th>
                        <th>Point<br />credited</th>                        
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    { adminActivitySummary.map(activity => {
                        return (
                            <tr key={activity.date}>
                                <th>{moment.unix(activity.date / 1000).format("DD MMM YYYY")}</th>                                
                                <td>{activity.assignedCount}</td>
                                <td>{activity.completedCount}</td>
                                <td>{activity.presidentCount}</td>
                                <td>{activity.panelCount}</td>
                                <td>{activity.pointsCreditedCount}</td>
                                <td>{activity.assignedCount+activity.completedCount+activity.presidentCount+activity.panelCount+activity.pointsCreditedCount}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    getAdminActivitySummaryGraphTemplate(adminActivitySummary){
        let dataStore=[];        
        dataStore.push(["Created Date","Assigned","Member Completed","President Approved/Rejected","Panel Approved/Rejected","Point Credited"])

        adminActivitySummary.forEach((data)=>{
            let dataEl=[];
            dataEl.push(moment.unix(data.date / 1000).format("DD MMM YYYY"))
            dataEl.push(data.assignedCount);
            dataEl.push(data.completedCount);
            dataEl.push(data.presidentCount);
            dataEl.push(data.panelCount);
            dataEl.push(data.pointsCreditedCount);
            dataStore.push(dataEl);
        });

        const options = {
            title: 'Current Status of Activities',
            isStacked: true,
            colors: ['#f1ef8e','#ace987','#83bf88', '#4ca685','#158e82'],
            chartArea: { width: '50%' },
            hAxis: {
                title: 'No. of Activities',
                minValue: 0,
                textStyle:{color: '#666'}
            },
            vAxis: {
                title: 'Created Date',
                textStyle:{color: '#666'}
            },
        };

        const chartEvents = [
            {
                eventName: "select",
                callback: this.handleChartSelect.bind(this)
            }
        ];

        return (
            <Chart
                width={'100%'}
                height={'600px'}
                chartType="BarChart"
                loader={<div>Loading Chart</div>}
                data={dataStore}
                options={options}
                chartEvents={chartEvents}
                // For tests
                rootProps={{ 'data-testid': '1' }}
                />
        );
    }

    handleActivityReportFilterDay = () => (value) => {
        this.setState({ filterActivityDay : value  });
        this.loadAdminActivitySummary(this.state.filterActivityReport, value);
    }

    handleActivityReportFilterView = () => (value) => {
        this.setState({ filterActivityView : value  });
    }

    handleActivityReportFilter = () => (value) => {
        this.setState({ filterActivityReport : value  });
        this.loadAdminActivitySummary(value, this.state.filterActivityDay);
    }

    handleChartSelect = (chartWrapper) => {
        const {row, column} = {...chartWrapper.chart.getSelection()[0]};
        const dataTable = chartWrapper.dataTable.wg;
        const currentValue = dataTable[row].c[column].v;
        const currentDate = dataTable[row].c[0].v;
        let status;
        switch(column) {
            case 1:
                status = "A";
                break;
            case 2:
                status = "C";
                break;
            case 3:
                status = "PA";
                break;
            case 4:
                status = "LA";
                break;
            default:
                status = "PC";
                break;
        }
        //console.log(currentValue, currentDate);
        //adding extra day for fixing datetime issue
        const formattedDate = moment(currentDate).format('MM/DD/YYYY');
        this.loadAdminActivitySummaryDetails(formattedDate, status, 10);
    }
    
    init = () => {
        this.loadClubList();
        this.loadAdminActivitySummary();
    }

    loadClubList = () => {
        AdminActivitySummaryService.getClubList()
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
            riverToast.show(error.status_message || 'Something went wrong while fetching club list');
        });
    }

    loadAdminActivitySummaryDetails = (date, status, count, page = 0) => {
        AdminActivitySummaryService.getAdminActivitySummaryDetails(date, status, count, page)
            .then(activitySummaryDetailsList => {
            this.setState({activitySummaryDetailsList});
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading activity summury details.");
        });
    }

    loadAdminActivitySummary = (searchParams = "nil", interval = 10) => {
        AdminActivitySummaryService.getAdminActivitySummary(searchParams, interval)
            .then(activitySummary => {
            this.setState({activitySummary});
        })
            .catch(error => {
            riverToast.show(error.status_message || 'Something went wrong while fetching activity summary');
        });
    }
}