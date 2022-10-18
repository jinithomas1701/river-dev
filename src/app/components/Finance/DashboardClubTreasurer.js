import React, { Component } from 'react';
import { Root } from "../Layout/Root";
import { connect } from "react-redux";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import ClubTreasurerMaster from './ClubTreasurerMaster/ClubTreasurerMaster';
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

class DashboardClubTreasurer extends Component {

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
            canCreateTransaction: Util.hasPrivilage("CREATE_TRANSACTION"),
            canViewDashboardChart: Util.hasPrivilage("VIEW_TRANSACTION_DASHBOARD_TREASURER"),
            canViewTransactionList: Util.hasPrivilage("VIEW_TRANSACTION_LIST_TREASURER"),
            canViewHistoryList: Util.hasPrivilage("VIEW_TRANSACTION_HISTORY_TREASURER"),
            canViewTransactionDetails: Util.hasPrivilage("VIEW_TRANSACTION_DETAIL_TREASURER"),
            canDeleteTransaction: Util.hasPrivilage("DELETE_TRANSACTION"),
            canSubmitReceipts: Util.hasPrivilage("SUBMIT_TRANSACTION_DOCUMENT"),
            canArchiveTransaction: Util.hasPrivilage("ARCHIVE_TRANSACTION"),
            canDownloadAttachment: Util.hasPrivilage("DOWNLOAD_ATTACHMENT")
        }
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Treasurer Dashboard" />

                    <div className="row">
                        <div className="col-md-12" style={{ marginBottom: "1rem" }}>
                            <Tabs
                                value={this.state.tabValue}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab value="0" label="Finance" />
                            </Tabs>
                        </div>
                    </div>
                    {
                        this.state.tabValue === "0" &&
                        <ClubTreasurerMaster privileges={PRIVILEGES} />
                    }
                </MainContainer>
            </Root>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardClubTreasurer);