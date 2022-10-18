import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import LeaderWhatsHappening from "./LeaderWhatsHappening/LeaderWhatsHappening"
import LeaderWhatsNew from './LeaderWhatsNew/LeaderWhatsNew';
import LeaderProblem from './LeaderProblem/LeaderProblem';
import LeaderMyProblem from './LeaderMyProblem/LeaderMyProblem';
//css
import './LeaderMaster.scss';
class LeaderMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0
        };
    }
    render() {
        return (
            <div className="leader-announcements-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary">

                            <Tab label="WHAT'S HAPPENING" />
                            <Tab label="Open Initiatives" />
                            <Tab label="Challenges" />
                            <Tab label="My Challenges" />
                        </Tabs>
                    </div>
                </div>
                {
                    this.state.tabValue === 0 &&

                    <LeaderWhatsHappening />

                }
                {
                    this.state.tabValue === 1 &&
                    <LeaderWhatsNew leader={this.props.leader} />

                }
                {
                    this.state.tabValue === 2 &&
                    <LeaderProblem leader={this.props.leader} />

                }
                {
                    this.state.tabValue === 3 &&
                    <LeaderMyProblem leader={this.props.leader} />

                }


            </div>

        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

}
export default LeaderMaster;