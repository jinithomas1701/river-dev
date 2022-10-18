import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import { Link } from 'react-router-dom';
import moment from 'moment';

// custom component
import { Root } from "../Layout/Root";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { Util } from '../../Util/util';
import { riverToast } from '../Common/Toast/Toast';
import PresidentActivity from "../PresidentActivity/PresidentActivity";
import PresidentDashboardService from "./PresidentDashboard.service";

// css
import './PresidentDashboard.scss';



class PresidentDashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabValue: 0,
            totalPoint: 0,
            targetPercentage: 0,
            target: 0
        };
    }

    componentDidMount(){
        this.init();
    }

    render(){
        
        const {totalPoint, targetPercentage, target} = this.state;
        
        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Club Dashboard" />
                    <div className="row">
                        <div className="col-md-12 president-dash-container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="dash-quickinfo">
                                        <dl className="point-card">
                                            <dd>Club Points</dd>
                                            <dt>{totalPoint}<sub>pts</sub></dt>
                                        </dl>
                                        <dl className="point-card">
                                            <dd>Target achieved</dd>
                                            <dt>{targetPercentage}%</dt>
                                        </dl>
                                        <dl className="point-card">
                                            <dd>Current Target</dd>
                                            <dt>{target}</dt>
                                        </dl>
                                        <Link to="/admin/club/settings" className="btn-bordered btn-settings" color="default" title="Settings">
                                            <Icon>settings</Icon>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-12">
                                    <Tabs
                                        className="main-tab"
                                        value={this.state.tabValue}
                                        onChange={this.handleTabChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        >
                                        <Tab label="Activities"  />
                                        {/*<Tab label="Commitments" />*/}
                                    </Tabs>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="tab-body-container">
                                        <PresidentActivity match={{...this.props.match}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    init = () => {
        this.loadFinishStatus();
    }

    handleTabChange = (event, tabValue) => {
        this.setState({tabValue});
    }
    
    loadFinishStatus = () => {
        PresidentDashboardService.getFinishStatus()
        .then(status => {
            if(status.finish){
                this.loadClubPoints();
            }
            else{
                this.props.history.push("/admin/club/settings");
            }
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading Club Status.");
        });
    }

    loadClubPoints = () => {
        PresidentDashboardService.getComparePoints()
            .then(responseData => {
            const {totalPoint, targetPercentage, target} = responseData;
            this.setState({totalPoint, targetPercentage, target});
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading Club Points.");
        });
    }
}

export default PresidentDashboard;