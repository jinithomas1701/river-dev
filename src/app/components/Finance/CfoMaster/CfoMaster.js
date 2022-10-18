import React, { Component } from "react";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import CfoDashboard from './CfoDashboard/CfoDashboard';
import CfoTransaction from './CfoTransaction/CfoTransaction';
import CfoHistory from './CfoHistory/CfoHistory';
import './CfoMaster.scss';

class CfoMaster extends Component {

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
            <div className="cfo-master-wrapper">
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
                    props.privileges.canViewTransactionList && <CfoDashboard privileges={props.privileges} />
                }
                {
                    this.state.tabValue === "1" &&
                    props.privileges.canViewTransactionList && <CfoTransaction privileges={props.privileges} />
                }
                {
                    this.state.tabValue === "2" &&
                    props.privileges.canViewHistoryList && <CfoHistory privileges={props.privileges} />
                }
            </div>
        );
    }
}

export default CfoMaster;