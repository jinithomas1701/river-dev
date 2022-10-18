import React, { Component } from 'react';
import { Root } from "../Layout/Root";
import { connect } from "react-redux";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import FinanceTeamMaster from './FinanceTeamMaster/FinanceTeamMaster';
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

class ClubTreasurerPage extends Component {

    componentWillUnmount() {
        this.props.reset();
    }

    render() {
        const PRIVILEGES = {
            canViewDashboardChart: Util.hasPrivilage("VIEW_TRANSACTION_DASHBOARD_FINANCE_TEAM"),
            canViewTransactionList: Util.hasPrivilage("VIEW_TRANSACTION_LIST_FINANCE_TEAM"),
            canViewHistoryList: Util.hasPrivilage("VIEW_TRANSACTION_HISTORY_FINANCE_TEAM"),
            canViewTransactionDetails: Util.hasPrivilage("VIEW_TRANSACTION_DETAIL_FINANCE_TEAM"),
            canDownloadAttachment: Util.hasPrivilage("DOWNLOAD_ATTACHMENT"),
            canApproveTransaction: Util.hasPrivilage("APPROVE_TRANSACTION_FINANCE_TEAM"),
            canRejectTransaction: Util.hasPrivilage("REJECT_TRANSACTION_FINANCE_TEAM"),
            canCreditTransaction: Util.hasPrivilage("CREDIT_TRANSACTION"),
            canDeescalateTransaction: Util.hasPrivilage("DE_ESCALATE_SUBMISSION"),
            canCloseTransaction: Util.hasPrivilage("CLOSE_TRANSACTION")
        }

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Club Finance" />
                    <FinanceTeamMaster privileges={PRIVILEGES} />
                </MainContainer>
            </Root>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClubTreasurerPage);