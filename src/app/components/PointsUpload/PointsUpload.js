import React, {Component} from 'react';
import Icon from 'material-ui/Icon';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';

// root component
import {Root} from "../Layout/Root";

// custom component
import {Util} from "../../Util/util";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {riverToast} from '../Common/Toast/Toast';
import {SelectBox} from '../Common/SelectBox/SelectBox';

import "./PointsUpload.scss";
import {PointsUploadService} from "./PointsUpload.service";

export default class PointsUpload extends Component{
    constructor(props){
        super(props);

        this.state = {
            report: [],
            clubList: [],
            selectedClub: "",
            errorText: ""
        };
    }

    componentDidMount(){
        this.loadClubList();
        //this.loadPointsUpload();
    }

    render(){
        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Points"/>
                    <div className="user-reports-wrapper">
                        <div className="tools">
                            <SelectBox 
                                placeholder="Days"
                                classes="filter-club-select"
                                disableSysClasses
                                selectedValue = {this.state.selectedClub}
                                selectArray={this.state.clubList}
                                onSelect={this.handleClubFilter()}
                                />
                            <div className="file-container">
                                <div className="file-wrapper">
                                    <input type="file" id="file-input" onChange={(e) => { this.handlePointUpload(e); }} />
                                </div>
                                <label htmlFor="file-input" className="file-label">Upload</label>
                            </div>
                        </div>
                        {
                            this.state.errorText && <div className="error-mssg">{this.state.errorText}</div>
                        }
                        <div className="report-table-wrapper">
                            {this.getPointTableTemplate(this.state.report)}
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    handleClubFilter = () => (value) => {
        this.setState({ selectedClub : value  });
        this.loadPointsUpload(value);
    }

    onPointFileChange(event) {
        this.setState({ selectedFile: event.target.files[0] });
    }

handlePointUpload(event) {
    const formData = new FormData();
    const selectedFile = event.target.files[0];
    event.target.value = "";
    formData.append('points', selectedFile);
    formData.append('clubId', this.state.selectedClub);
    PointsUploadService.uploadData(formData)
        .then(report => {
        if(report instanceof Array){
            this.setState({report})
        }

    }).catch(error => {
        if (error.status_message) {
            this.setState({ errorText: error.status_message });
        } else {
            riverToast.show("Something went wrong while bulk uploading points.");
        }
    });
}

getPointTableTemplate(report){
    const dateTemplate = ({value}) => <span>{moment(value).format("MMM YY")}</span>;
    const NewLayout = ({ Table, Pagination, Filter, SettingsWrapper }) => (
        <div>
            <div className="report-table-header">
                <Filter />
                <Pagination />
            </div>
            <Table />
            <Pagination />
        </div>
    );

    return (
        <Griddle
            data={report}
            plugins={[plugins.LocalPlugin]}
            className="report-table-wrapper"
            components={{Layout: NewLayout}}
            >
            <RowDefinition>
                <ColumnDefinition id="entryId" title="Id" />
                <ColumnDefinition id="lineItem" title="Title" />
                <ColumnDefinition id="club" title="Club" />
                <ColumnDefinition id="memberPoint" title="Member Point" />
                <ColumnDefinition id="clubPoint" title="Club Point" />
                <ColumnDefinition id="claimPeriod" title="Claim Period" customComponent={dateTemplate} />
                <ColumnDefinition id="assignee" title="Assignees" />
                <ColumnDefinition id="description" title="Justification" />
            </RowDefinition>
        </Griddle>
    );
}

loadClubList(){
    this.setState({ errorText: "" });
    PointsUploadService.getClubList()
        .then(data => {
        let clubList = data.map(club => {
            return {
                title: club.name,
                value: club.id
            }
        });
        //clubList = [{title: "All", value: "nil"}, ...clubList];
        this.setState({clubList});

        if(clubList.length){
            this.setState({selectedClub: clubList[0].value});
            this.loadPointsUpload(clubList[0].value);
        }
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while loading club list.");
    });
}

loadPointsUpload(clubId){
    this.setState({ errorText: "" });
    PointsUploadService.getPointsUpload(clubId)
        .then(report => {
        this.setState({report});
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while loading bulk club points.")
    });
}
}