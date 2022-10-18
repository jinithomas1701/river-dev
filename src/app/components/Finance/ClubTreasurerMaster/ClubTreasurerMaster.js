import React, { Component } from "react";
import Tabs, { Tab } from 'material-ui/Tabs';
import ClubTreasurerDashboard from './ClubTreasurerDashboard/ClubTreasurerDashboard';
import ClubTreasurerTransaction from './ClubTreasurerTransaction/ClubTreasurerTransaction';
import ClubTreasurerHistory from './ClubTreasurerHistory/ClubTreasurerHistory';
import './ClubTreasurerMaster.scss';
import { Util } from '../../../Util/util';

class ClubTreasurerMaster extends Component {

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
        console.log(props.privileges);
        return (
            <div className="club-treasurer-master-wrapper">
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
                    props.privileges.canViewTransactionList && <ClubTreasurerDashboard privileges={props.privileges} />
                }
                {
                    this.state.tabValue === "1" &&
                    props.privileges.canViewTransactionList && <ClubTreasurerTransaction privileges={props.privileges} />
                }
                {
                    this.state.tabValue === "2" &&
                    props.privileges.canViewHistoryList && <ClubTreasurerHistory privileges={props.privileges} />
                }
            </div>
        );
    }
}

export default ClubTreasurerMaster;