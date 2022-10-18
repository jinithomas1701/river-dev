import React, { Component } from 'react';
import { Root } from "../Layout/Root";
import { connect } from "react-redux";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import CfoMaster from './CfoMaster/CfoMaster';
import Tabs, { Tab } from 'material-ui/Tabs';
import { Util } from '../../Util/util';

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        reset: () => {
            dispatch({
                type: "RESET",
                payload: ""
            });
        }
    }
}

class DashboardCfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: "0"
        };
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    componentWillUnmount() {
        this.props.reset();
    }

    render() {
        const PRIVILEGES = {
            canViewDashboardChart: Util.hasPrivilage("VIEW_TRANSACTION_DASHBOARD_CFO"),
            canViewTransactionList: Util.hasPrivilage("VIEW_TRANSACTION_LIST_CFO"),
            canViewHistoryList: Util.hasPrivilage("VIEW_TRANSACTION_HISTORY_CFO"),
            canViewTransactionDetails: Util.hasPrivilage("VIEW_TRANSACTION_DETAIL_CFO"),
            canDownloadAttachment: Util.hasPrivilage("DOWNLOAD_ATTACHMENT"),
            canApproveTransaction: Util.hasPrivilage("APPROVE_TRANSACTION_CFO"),
            canRejectTransaction: Util.hasPrivilage("REJECT_TRANSACTION_CFO")
        }

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="CFO Dashboard" />
                    <div className="row">
                        <div className="col-md-12" style={{ marginBottom: "1rem" }}>
                            <Tabs
                                value={this.state.tabValue}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab value="0" label="Club Finance" />
                            </Tabs>
                        </div>
                    </div>
                    {
                        this.state.tabValue === "0" &&
                        <CfoMaster privileges={PRIVILEGES} />
                    }
                </MainContainer>
            </Root>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCfo);