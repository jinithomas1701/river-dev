import React, {Component} from 'react';
import Tabs, {Tab} from 'material-ui/Tabs';
import Tooltip from 'material-ui/Tooltip';

import {Root} from "../../Layout/Root";
import {Util} from "../../../Util/util";
import {MainContainer} from "../../Common/MainContainer/MainContainer";
import {PageTitle} from '../../Common/PageTitle/PageTitle';
import AdminDashboard from "../AdminDashboard/AdminDashOld/AdminDashboard";
import AdminActivity from "../AdminDashboard/AdminActivity/AdminActivity";
import AdminActivitySummary from "../AdminDashboard/AdminActivitySummary/AdminActivitySummary";
import VoiceMaster from "../../Voice/NewVoice/VoiceMaster/VoiceMaster";
import AnnouncementsAdmin from "../../Announcements/AnnouncementsAdmin";
import './AdminDashPage.scss';

const TAB_ACTIVITY = "TAB_ACTIVITY";
const TAB_VOICE = "TAB_VOICE";
const ROLE_ADMIN = "AD";
const TAB_ANNOUNCEMENT= "TAB_ANNOUNCEMENT";

class AdminDashPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: TAB_ACTIVITY
        };
    }

    render(){
        const tabValue = this.state.tabValue;
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Admin Dashboard" />
                    <div className="adminpage-wrapper">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            >
                            <Tab label="Activity" value={TAB_ACTIVITY} />
                            <Tab label="Voice" value={TAB_VOICE} />
                            <Tab label="Club Initiative" value={TAB_ANNOUNCEMENT} />
                        </Tabs>
                        <div className="admintab-content">
                            { tabValue === TAB_ACTIVITY &&  this.getActivityTemplate() }
                            { tabValue === TAB_VOICE && <VoiceMaster mode={ROLE_ADMIN} /> }
                            { (tabValue === TAB_ANNOUNCEMENT&& Util.hasPrivilage("VIEW_ADMIN_ANNOUNCEMENT")) && <AnnouncementsAdmin admin={true}mode={ROLE_ADMIN} /> }
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    getActivityTemplate(){
        return (
            <div className="">
                <div className="admingraph-wrapper">
                    <AdminActivitySummary />
                </div>
                <AdminActivity />
            </div>
        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };
}

export default AdminDashPage;