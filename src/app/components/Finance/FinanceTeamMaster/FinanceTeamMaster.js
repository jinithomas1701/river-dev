import React, { Component } from "react";
import Tabs, { Tab } from 'material-ui/Tabs';
import FinanceTeamDashboard from './FinanceTeamDashboard/FinanceTeamDashboard';
import FinanceTeamTransaction from './FinanceTeamTransaction/FinanceTeamTransaction';
import FinanceTeamHistory from './FinanceTeamHistory/FinanceTeamHistory';
import './FinanceTeamMaster.scss';

class FinanceTeamMaster extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabValue: "0"
        };
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    render() {
        const props = this.props;

        return (
            <div className="finance-team-master-wrapper">
                <div className="row">
                    <div className="col-md-8 tab-wrapper">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth={true}
                        >
                            {props.privileges.canViewTransactionList && <Tab value="0" label="Dashboard" />}
                            {props.privileges.canViewTransactionList && <Tab value="1" label="Transactions" />}
                            {props.privileges.canViewHistoryList && <Tab value="2" label="History" />}
                        </Tabs>
                    </div>
                </div>
                {
                    this.state.tabValue === "0" &&
                    props.privileges.canViewTransactionList && <FinanceTeamDashboard privileges={props.privileges} />
                }
                {
                    this.state.tabValue === "1" &&
                    props.privileges.canViewTransactionList && <FinanceTeamTransaction privileges={props.privileges} />
                }
                {
                    this.state.tabValue === "2" &&
                    props.privileges.canViewHistoryList && <FinanceTeamHistory privileges={props.privileges} />
                }
            </div>
        );
    }
}

export default FinanceTeamMaster;