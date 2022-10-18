import React, {Component} from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';

import {Root} from "../Layout/Root";
import {Util} from "../../Util/util";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {riverToast} from '../Common/Toast/Toast';
import ClubSettingsStage1 from "./ClubSettingsStage1/ClubSettingsStage1";
import ClubSettingsStage2 from "./ClubSettingsStage2/ClubSettingsStage2";
import ClubSettingsStage3 from "./ClubSettingsStage3/ClubSettingsStage3";

import "./ClubSettingsPage.scss";

import ClubSettingsService from "./ClubSettings.service";
import {setMembers, setClubSettings, setMasterActivities} from "./ClubSettings.actions";

const mapStateToProps = (state) => {
    return {
        club: state.ClubSettingsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMembers : (memberList) => {
            dispatch(setMembers(memberList))
        },
        setClubSettings : (settings) => {
            dispatch(setClubSettings(settings))
        },
        setMasterActivities : (masterActivities) => {
            dispatch(setMasterActivities(masterActivities))
        },
    };
};

const STAGE_OFFICIALS = 1;
const STAGE_ACTIVITIES = 2;
const STAGE_POINTS = 3;

class ClubSettingsPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentTab: STAGE_OFFICIALS
        };
    }

    componentDidMount(){
        this.init();
    }

    render = () => {
        const state = this.state;
        const currentTab = state.currentTab;
        const props = this.props;
        const club = props.club;

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Settings" />
                    <div className="clubsettings-wrapper">
                        <ol className="stage-overview-header">
                            <li className={`stage-header-item ${currentTab >= STAGE_OFFICIALS? "active" : ""}`}>
                                <div className="stage-number">
                                    1<Icon>check_circle</Icon>
                                </div>
                                <div className="title">Select Office Bearers</div>
                            </li>
                            <li className={`stage-header-item ${currentTab >= STAGE_ACTIVITIES? "active" : ""}`}>
                                <div className="stage-number">
                                    2
                                    <Icon>check_circle</Icon>
                                </div>
                                <div className="title">Choose Activities for the Club</div>
                            </li>
                            <li className={`stage-header-item ${currentTab >= STAGE_POINTS? "active" : ""}`}>
                                <div className="stage-number">
                                    3
                                    <Icon>check_circle</Icon>
                                </div>
                                <div className="title">Set Target and Meeting Location</div>
                            </li>
                        </ol>
                        <div className="stage-content-wrapper">
                            {
                                (state.currentTab === STAGE_OFFICIALS) && <ClubSettingsStage1
                                                                              members={club.members}
                                                                              settings={club.settings}
                                                                              goToLastPage={this.prevStage}
                                                                              onSubmit={this.saveClubSettings}
                                                                              />
                            }
                            {
                                (state.currentTab === STAGE_ACTIVITIES) && <ClubSettingsStage2
                                                                               masterActivities={club.masterActivities}
                                                                               settings={club.settings}
                                                                               goToLastPage={this.prevStage}
                                                                               onSubmit={this.saveClubSettings}
                                                                               />
                            }
                            {
                                (state.currentTab === STAGE_POINTS) && <ClubSettingsStage3
                                                                               settings={club.settings}
                                                                               goToLastPage={this.prevStage}
                                                                               onSubmit={this.saveClubSettings}
                                                                               />
                            }
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    init = () => {
        this.gotoStage(STAGE_OFFICIALS);
    }

    prevStage = (stage) => {
        if(stage > STAGE_OFFICIALS){
            this.gotoStage(stage - 1)
        }
        else{
            this.props.history.push("/admin/clubDash");
        }
    }

    gotoNextStage = (stage) => {
        if(stage < STAGE_POINTS){
            this.gotoStage(stage + 1)
        }
        else{
            this.props.history.push("/admin/clubDash");
        }
    }

    gotoStage = (stage) => {
        switch(stage) {
            case STAGE_OFFICIALS:
                this.setState({currentTab: STAGE_OFFICIALS});
                this.loadOfficialsData();
                break;
            case STAGE_ACTIVITIES:
                this.setState({currentTab: STAGE_ACTIVITIES});
                this.loadActivitiesData();
                break;
            case STAGE_POINTS:
                this.setState({currentTab: STAGE_POINTS});
                this.loadPointsData();
                break;
            default:
                break;
        }
    }

    loadOfficialsData = () => {
        this.loadClubSettings();
        this.loadClubMember();
    }

    loadActivitiesData = () => {
        this.loadClubSettings();
        this.loadMasterActivities();
    }

    loadPointsData = () => {
        this.loadClubSettings();
    }

    saveClubSettings = (stage, submitObj) => {
        ClubSettingsService.saveClubSettings(stage, submitObj)
            .then(() => {
            this.gotoNextStage(this.state.currentTab);
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while saving club settings.");
        });
    }

    loadClubMember = () => {
        ClubSettingsService.getClubMembers()
            .then(response => {
            const members = response.map(member => ({
                id: member.id,
                value: member.id,
                avatar: member.avatar,
                empId: member.empId,
                email: member.email,
                title: `${member.firstName} ${member.lastName}`
            }));

            this.props.setMembers(members);
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading club members.");
        });
    }

    loadClubSettings = () => {
        ClubSettingsService.getClubSettings()
            .then(settings => {
            this.props.setClubSettings(settings);
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading club settings.");
        });
    }

    loadMasterActivities = () => {
        ClubSettingsService.getMasterActivities()
            .then(masterActivities => {
            this.props.setMasterActivities(masterActivities);
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading club activities.");
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClubSettingsPage);