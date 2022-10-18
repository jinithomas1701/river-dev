import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import moment from "moment";
import FileSaver from "file-saver";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import {SelectBox} from "../../Common/SelectBox/SelectBox";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';
import {changeField,
        setReport,
        setClubList,
        clearFields} from "./Report.actions";

import {ReportService} from "./Report.service";
import reportConfig from "../../../Util/Constants/reportConfig.json";

const mapStateToProps = (state) => {
    return {
        reportObj: state.ReportReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeField: (fieldName, value) => {
            dispatch(changeField(fieldName, value));
        },
        setReport: (value) => {
            dispatch(setReport(value));
        },
        setClubList: (value) => {
            dispatch(setClubList(value));
        },
        clearFields: () => {
            dispatch(clearFields());
        }
    }
};

import "./Report.scss";
const launchYear = 2017;
const yearBuffer = 10;

class Report extends React.Component {
    reportList = this.generateReportSelectList();
    monthList = [
        {title:"January",value:"January"},
        {title:"February",value:"February"},
        {title:"March",value:"March"},
        {title:"April",value:"April"},
        {title:"May",value:"May"},
        {title:"June",value:"June"},
        {title:"July",value:"July"},
        {title:"August",value:"August"},
        {title:"September",value:"September"},
        {title:"October",value:"October"},
        {title:"November",value:"November"},
        {title:"December",value:"December"}];
    yearList = [];
    constructor(props) {
        super(props);
        this.getClubList();
        const currentYear = new Date().getFullYear();
        for (var i = currentYear; i >= launchYear; i--) {
            this.yearList.push({title:i,value:i});
        }
    }

    generateReportSelectList() {
        const generatedList = [];
        reportConfig.reports.forEach(function(report) {
            generatedList.push({
                title: report.title,
                value: report
            });    
        }, this);

        return generatedList;
    }

    render() {
        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Report" />
                    <div className="row report-detail">
                        <div className="col-md-12">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <h5>Generate Report</h5>
                                </div>
                                <div className="page-content-section">
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <SelectBox 
                                                id="report-select" 
                                                label="Select Report" 
                                                selectedValue={this.props.reportObj.selectedReport}
                                                selectArray={this.reportList}
                                                onSelect={this.onSelectReport.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {this.props.reportObj.selectedReport && this.props.reportObj.selectedReport.fromDate != "NO" &&
                                            <div className="col-md-4 input-container">
                                                <TextField
                                                    id="fromDate"
                                                    label="From"
                                                    type= "date"
                                                    className="input-field"
                                                    margin="normal"
                                                    required = {this.props.reportObj.selectedReport.fromDate == "MND"}
                                                    value= {this.props.reportObj.reportFields.fromDate}
                                                    onChange={(e)=>{
                                                        this.props.changeField("fromDate", e.target.value);
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </div>
                                        }

                                        {this.props.reportObj.selectedReport && this.props.reportObj.selectedReport.toDate != "NO" &&
                                            <div className="col-md-4 input-container">
                                                <TextField
                                                    id="fromDate"
                                                    label="From"
                                                    type= "date"
                                                    className="input-field"
                                                    margin="normal"
                                                    required = {this.props.reportObj.reportFields.toDate == "MND"}
                                                    value= {this.props.reportObj.reportFields.toDate}
                                                    onChange={(e)=>{
                                                        this.props.changeField("toDate", e.target.value);
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </div>
                                        }
                                    </div>
                                    {this.props.reportObj.selectedReport && this.props.reportObj.selectedReport.clubId != "NO" &&
                                        <div className="row">
                                            <div className="col-md-4 input-container">
                                                <SelectBox 
                                                    id="club-select" 
                                                    label={("Select Club") + ((this.props.reportObj.selectedReport.clubId == "MND") ? "*" : "(optional)")} 
                                                    selectedValue={this.props.reportObj.reportFields.clubId}
                                                    selectArray={this.props.reportObj.clubList}
                                                    onSelect={this.onSelectClub.bind(this)}/>
                                            </div>
                                        </div>
                                    }
                                    {this.props.reportObj.selectedReport && this.props.reportObj.selectedReport.month != "NO" &&
                                        <div className="row">
                                            <div className="col-md-4 input-container">
                                                <SelectBox 
                                                    id="month-select" 
                                                    label={("Select Month") + ((this.props.reportObj.selectedReport.month == "MND") ? "*" : "(optional)")} 
                                                    selectedValue={this.props.reportObj.reportFields.month}
                                                    selectArray={this.monthList}
                                                    onSelect={this.onSelectMonth.bind(this)}/>
                                            </div>
                                        </div>
                                    }
                                    {this.props.reportObj.selectedReport && this.props.reportObj.selectedReport.year != "NO" &&
                                        <div className="row">
                                            <div className="col-md-4 input-container">
                                                <SelectBox 
                                                    id="YEAR-select" 
                                                    label={("Select Year") + ((this.props.reportObj.selectedReport.month == "MND") ? "*" : "(optional)")} 
                                                    selectedValue={this.props.reportObj.reportFields.year}
                                                    selectArray={this.yearList}
                                                    onSelect={this.onSelectYear.bind(this)}/>
                                            </div>
                                        </div>
                                    }
                                    {this.props.reportObj.selectedReport &&
                                        <div className="row">
                                            <div className="col-md-4 input-container">
                                                <Button raised color="primary" onClick={this.onSubmitReport.bind(this)}>SUBMIT</Button>
                                            </div>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    onSelectReport(report) {
        this.props.setReport(report);
        this.props.clearFields();
    }

    onSelectClub(club) {
        this.props.changeField("clubId", club);
    }

    onSelectYear(year) {
        this.props.changeField("year", year);
    } 

    onSelectMonth(month) {
        this.props.changeField("month", month);
    }

    getClubList() {
        ReportService.getClubsTask()
        .then((data) => {
            if (data && data.length > 0) {
                const parsedCLubList = [];
                data.forEach((club) => {
                    parsedCLubList.push({
                        title: club.clubName,
                        value: club.id
                    });
                }, this);
                this.props.setClubList(parsedCLubList);
            } else {
                this.props.setClubList([]);
            }
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching clubs")
        });
    }

    validateReportData() {
        const selectedReport = this.props.reportObj.selectedReport;
        let isValid = true;
        let msg = "";
        if (selectedReport.fromDate == "MND" && !this.props.reportObj.reportFields.fromDate) {
            msg = "Please enter from date";
        } else if (selectedReport.toDate == "MND" && !this.props.reportObj.reportFields.toDate) {
            msg = "Please enter to date";
        } else if (selectedReport.clubId == "MND" && !this.props.reportObj.reportFields.clubId) {
            msg = "Please select a club";
        } else if (selectedReport.month == "MND" && !this.props.reportObj.reportFields.month) {
            msg = "Please select a month";
        }
        if (msg) {
            isValid = false;
            riverToast.show(msg);
        }
        return isValid;
    }

    generateReportRequest() {
        const request = {};
        const selectedReport = this.props.reportObj.selectedReport;
        if (selectedReport.fromDate != "NO") {
            request.fromDate = Util.getDateInFormat(new Date(this.props.reportObj.reportFields.fromDate).getTime(), "YYYY-MM-DDTHH:mm:ss.0000000")+"Z";
        }
        if (selectedReport.toDate != "NO") {
            request.toDate = Util.getDateInFormat(new Date(this.props.reportObj.reportFields.toDate).getTime(), "YYYY-MM-DDTHH:mm:ss.0000000")+"Z";
        }
        if (selectedReport.clubId != "NO") {
            request.clubId = this.props.reportObj.reportFields.clubId;
        }
        if (selectedReport.month != "NO") {
            request.month = this.props.reportObj.reportFields.month;
        }
        if (selectedReport.year != "NO") {
            request.year = this.props.reportObj.reportFields.year;
        }
        return request;
    }

    onSubmitReport() {
        if (this.validateReportData()) {
            const reportRequest = this.generateReportRequest();
            ReportService.generateReport(this.props.reportObj.selectedReport.url, reportRequest)
            .then(data => {
                if (data.payload) {
                    Util.downloadFile(data.payload, "report", "pdf");
                } else {
                    riverToast.show(data.status_message || "Something went wrong while generating report");    
                }
                
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while generating report");
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);