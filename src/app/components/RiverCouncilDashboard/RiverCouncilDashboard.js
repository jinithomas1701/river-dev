import React, {Component} from 'react';
import Icon from 'material-ui/Icon';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { CircularProgress } from 'material-ui/Progress';
import {Chart} from 'react-google-charts';
import moment from 'moment';

import { Root } from "../Layout/Root";

import { riverToast } from '../Common/Toast/Toast';
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { RiverCouncilDashboardService } from "./RiverCouncilDashboard.service";

import "./RiverCouncilDashboard.scss";

export default class RiverCouncilDashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            clubDetails: [],
            selectedClub: "",
            selectedClubPoints: "",
            clubPointStatus: "idle"
        };
    }

    render(){
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="River Dashboard" />
                    <div className="rivercouncil-dashboard-container">
                        <div className="row">
                            <div className="col-md-12">
                                <h2 className="heading-lvl2">Club Points</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                { this.getStandingsTableTemplate(this.state.clubDetails) }
                            </div>
                            <div className="col-md-6">
                                { this.getStandingChartTemplate(this.state.clubDetails) }
                            </div>
                        </div>
                        { this.getClubDetailsTemplate(this.state.selectedClubPoints) }
                    </div>
                </MainContainer>
            </Root>
        )
    }

    componentDidMount(){
        this.loadClubStandings();
    }

    getStandingsTableTemplate(standings){
        return (
            <Table className="standing-table">
                <TableHead>
                    <TableRow className="table-row">
                        <TableCell>No</TableCell>
                        <TableCell className="item-with-icon">
                            <div>
                                <Icon>store</Icon>Club
                            </div>
                        </TableCell>
                        <TableCell numeric className="item-with-icon">
                            <div className="numeric">
                                <Icon>stars</Icon> Points
                            </div>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {standings.map((item, index) => {
                        return (
                            <TableRow className="table-row" key={item.clubId} onClick={this.handleClubSelect.bind(this, item)}>
                                <TableCell component="th" scope="row">{((index + 1) < 10)? `0${(index + 1)}`: (index + 1)}.</TableCell>
                                <TableCell>{item.clubName}</TableCell>
                                <TableCell numeric className="item-with-icon">
                                    {item.clubPoints}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    getStandingChartTemplate(standings){
        const options = {
            chart: {
                title: 'Club Points',
                //subtitle: 'CLub points: 2018-2019',
                backgroundColor: {
                    fill: 'transparent'
                }
            }
        };
        const data = [['Club', 'Points']].concat(standings.map(club => {
            return [club.clubName, club.clubPoints];
        }));
        return (
            <div className="chart-container">
                <Chart
                    width={'500px'}
                    height={'300px'}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={options}
                    rootProps={{ 'data-testid': '2' }}
                    />
            </div>
        );
    }

    getClubDetailsTemplate(club){
        return (
            <div className="row">
                {
                    this.state.selectedClubPoints && (
                        <div className="col-md-12">
                            <h2 className="heading-lvl2">{this.state.selectedClub.clubName} <span className="subtext">Point Details</span></h2>
                            <article className="point-card marker">
                                <header className="header">
                                    <div className="point-count">
                                        <span className="points">{club.credited.total}<sub className="label">pts</sub></span>
                                        <p>Club Points</p>
                                    </div>
                                </header>
                            </article>
                            <div className="pointcard-wrapper">
                                <article className={`point-card ${(club.credited.throughActivity.point > club.pending.point) && 'bigger'}`}>
                                    <header className="header">
                                        <div className="point-count">
                                            <span className="points">{club.credited.throughActivity.point}<sub className="label">pts</sub></span>
                                        </div>
                                    </header>
                                    <div className="desc">
                                        Through <b>{club.credited.throughActivity.count}</b> {(club.credited.throughActivity.count < 2)? "activity": "activities"}
                                    </div>
                                </article>
                                <article className={`point-card ${(club.pending.point > club.credited.throughActivity.point) && 'bigger'}`}>
                                    <header className="header">
                                        <div className="point-count">
                                            <span className="points">{club.pending.point}<sub className="label">pts</sub></span>
                                        </div>
                                    </header>
                                    <div className="desc">
                                        From others <b>({club.pending.count})</b>
                                    </div>
                                </article>
                            </div>
                        </div>
                    )
                }
                {
                    (this.state.clubPointStatus === "loading") && (
                        <div className="col-md-12">
                            <div className="loading-bar">
                                <CircularProgress size={18}/>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }

    handleClubSelect(selectedClub){
        this.setState({...this, selectedClub, selectedClubPoints: "", clubPointStatus: "loading"})
        RiverCouncilDashboardService.getClubDetails(selectedClub.clubId)
            .then(selectedClubPoints => {
            this.setState({...this, selectedClubPoints, clubPointStatus: "idle"});
        })
            .catch(error => {
            this.setState({...this, selectedClub: "", selectedClubPoints: "", clubPointStatus: "idle"})
            riverToast.show(error.status_message || "Something went wrong while loading club details.");
        });
    }

    loadClubStandings(){
        RiverCouncilDashboardService.getClubStandings()
            .then(clubDetails => {
            this.setState({...this, clubDetails});
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while loading club standings.");
        });
    }
}