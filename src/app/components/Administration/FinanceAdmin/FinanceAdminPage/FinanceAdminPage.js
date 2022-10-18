import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';

import { Root } from "../../../Layout/Root";
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { PageTitle } from "../../../Common/PageTitle/PageTitle";

import FinanceAdminOverView from "../FinanceAdminOverView/FinanceAdminOverView";

import "./FinanceAdminPage.scss";
import { Util } from '../../../../Util/util';

class FinanceAdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const PRIVILEGES = {
            canUpdateConfig: Util.hasPrivilage("UPDATE_FINANCE_CONFIG")
        }
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Finance Settings" />
                    <div className="financeadmin-page-wrapper">
                        <FinanceAdminOverView privileges={PRIVILEGES} />
                    </div>
                </MainContainer>
            </Root>
        );
    }

    init = () => {
    }
}

export default FinanceAdminPage;