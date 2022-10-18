import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { Util } from "../../Util/util";
import { Root } from "../Layout/Root";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import AnnouncementsLeader from './AnnouncementsLeader';
//css
import './LeaderDashBoard.scss';

const TAB_ANNOUNCEMENT = "TAB_ANNOUNCEMENT";
class LeaderDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: TAB_ANNOUNCEMENT
        };
    }
    render() {
        const tabValue = this.state.tabValue;
        return (
            <Root >
                <MainContainer>
                    <PageTitle title="Leader Dashboard" />
                    <div className="leaderpage-wrapper">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="Club Initiatives" value={TAB_ANNOUNCEMENT} />
                        </Tabs>
                        <div className="leader-tab-content">

                            {(tabValue === TAB_ANNOUNCEMENT && Util.hasPrivilage("VIEW_LEADER_ANNOUNCEMENT")) && <AnnouncementsLeader leader={true} />}
                        </div>
                    </div>
                </MainContainer>
            </Root>
        )
    }
    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };
}

export default LeaderDashBoard