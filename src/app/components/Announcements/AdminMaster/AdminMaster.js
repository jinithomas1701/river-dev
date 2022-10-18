import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';


import AdminWhatsHappening from "./AdminWhatsHappening/AdminWhatsHappening"
import AdminWhatsNew from './AdminWhatsNew/AdminWhatsNew';
import AdminProblem from './AdminProblem/AdminProblem';

import './AdminMaster.scss';


class AdminMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0
        };
    }

    render() {
        return (
            <div className="admin-announcements-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="WHAT'S HAPPENING" />
                            <Tab label="Open Initiatives" />
                            <Tab label="Challenges" />
                        </Tabs>
                    </div>
                    <div className="col-md-4">

                    </div>
                </div>
                {
                    this.state.tabValue === 0 &&
                    <AdminWhatsHappening admin={this.props.admin} />
                }
                {
                    this.state.tabValue === 1 &&
                    <AdminWhatsNew admin={this.props.admin} />
                }
                {
                    this.state.tabValue === 2 &&
                    <AdminProblem admin={this.props.admin} />
                }
            </div>
        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

}
export default AdminMaster