import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import PresidentWhatsHappening from "./PresidentWhatsHappening/PresidentWhatsHappening"
import PresidentWhatsNew from './PresidentWhatsNew/PresidentWhatsNew';
import PresidentProblem from './PresidentProblem/PresidentProblem';
//css
import './PresidentMaster.scss';
class PresidentMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0
        };
    }
    render() {
        return (
            <div className="president-announcements-wrapper">
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
                        </Tabs>
                    </div>
                    <div className="col-md-4">

                    </div>
                </div>
                {
                    this.state.tabValue === 0 &&

                    <PresidentWhatsHappening />

                }
                {
                    this.state.tabValue === 1 &&
                    <PresidentWhatsNew />

                }
                {
                    this.state.tabValue === 2 &&
                    <PresidentProblem president={this.props.president} />

                }

            </div>
        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

}
export default PresidentMaster