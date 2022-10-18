import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import moment from 'moment';

// custom component
import { Root } from "../Layout/Root";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { Util } from '../../Util/util';
import { riverToast } from '../Common/Toast/Toast';

import PanelActivity from "../PanelActivity/PanelActivity";
import VoiceMaster from '../Voice/NewVoice/VoiceMaster/VoiceMaster';

// css
import './PanelDashboard.scss';

const TAB_ACTIVITY = "TAB_ACTIVITY";
const TAB_VOICE = "TAB_VOICE";
const ROLE_PANEL = "PA";

const PRIVILEGE_VIEW_VOICE = "VIEW_VOICE";

class PanelDashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabValue: TAB_ACTIVITY
        };

        const userDetails = Util.getLoggedInUserDetails();
        //const hasViewVoicePrivilege = Util.hasPrivilage(PRIVILEGE_VIEW_VOICE);
        const hasVoiceDepartments = userDetails.voiceDepartments.length > 0 || userDetails.voiceEscalationPanels.length > 0;
        this.canViewVoice = hasVoiceDepartments;
    }

    render(){
        
        const tabValue = this.state.tabValue
        
        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Panel Dashboard" />
                    <div className="row">
                        <div className="col-md-12 panel-dash-container">
                            <div className="row">
                                <div className="col-md-12">
                                    <Tabs
                                        className="main-tab"
                                        value={this.state.tabValue}
                                        onChange={this.handleTabChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        >
                                        <Tab value={TAB_ACTIVITY} label="Activities" />
                                        { this.canViewVoice && <Tab value={TAB_VOICE} label="Voice" /> }
                                    </Tabs>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="tab-body-container">
                                        { (tabValue === TAB_ACTIVITY) && <PanelActivity match={{...this.props.match}} /> }
                                        { (tabValue === TAB_VOICE) && <VoiceMaster mode={ROLE_PANEL} /> }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    handleTabChange = (event, tabValue) => {
        this.setState({tabValue});
    }
}

export default PanelDashboard;