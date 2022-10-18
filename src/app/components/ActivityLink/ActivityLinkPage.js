import React, { Component } from 'react';
import { connect } from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemText, ListItemAvatar } from 'material-ui/List';
import Dialog, { DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';

// root component
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { riverToast } from '../Common/Toast/Toast';

import { CommonService } from "../Layout/Common.service";
import { ActivityLinkService } from "./ActivityLinkPage.service";

// css
import "./ActivityLinkPage.scss";


class ActivityLinkPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityId: "",
            roles: []
        };

        this.availableRoles = {
            "ROLE_CLUB_PRESIDENT": "/admin/clubDash/:activityId?",
            "ROLE_CLUB_MEMBER": "/member_activity/:activityId?",
            "ROLE_SUPER_ADMIN": "/admin/adminDash/:activityId?",
            "ROLE_RIVER_COUNCIL": "/admin/councilDash/:activityId?",
        };
    }

    componentDidMount = () => {
        const params = this.props.match.params;
        let activityId;
        if (params && params.activityId) {
            activityId = params.activityId;
            this.setState({ activityId: params.activityId });
            Util.setActivityLinkDetails({});
        }
        this.init(activityId);
    };

    render() {
        const state = this.state;

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Activity Details" />
                    <div className="activitylinkpage-wrapper">
                        {
                            (state.roles.length !== 0) && <Dialog
                                open={true}
                                size="lg"
                            >
                                <DialogTitle>View Activity As:</DialogTitle>
                                <DialogContent>
                                    <Paper>
                                        <List>
                                            {
                                                state.roles.map(role => {
                                                    return <ListItem key={role.id} onClick={this.handleRoleSelect(role.name)} button>{role.title}</ListItem>
                                                })
                                            }
                                        </List>
                                    </Paper>
                                </DialogContent>
                            </Dialog>
                        }
                    </div>
                </MainContainer>
            </Root>
        );
    };

    init = (activityId) => {
        if (activityId) {
            this.loadUserActivityRoles(activityId)
        }
    };

    loadUserActivityRoles = (activityId) => {
        ActivityLinkService.getUserActivityRoles(activityId)
            .then(response => {
                const roles = response.map(role => ({ ...role }));
                this.setState({ roles });
            })
            .catch((error) => {
                if (error.status_code === "404") {
                    riverToast.show("No such activity found!");
                    window.location.href = "/#/welcome/";
                }
                else if (error.status_code === "401") {
                    riverToast.show("You don't have the permission to access this activity!");
                    let userDetails = Util.getLoggedInUserDetails();
                    const role = userDetails.activeRole.value;
                    let path = this.availableRoles[role] ? this.availableRoles[role] : "/#/welcome/";
                    path = path.replace(":activityId?", "");
                    this.props.history.push(path);
                }
                if (error.network_error) {
                    riverToast.show(error.message || "Something went wrong while loading activity roles.");
                }
            });
    }

    handleRoleSelect = (role) => () => {
        ActivityLinkService.switchRole(role)
            .then(() => {
                CommonService.getLoggedInUserDetails()
                    .then(data => {
                        Util.setLoggedInUserDetails(data);
                        this.gotoActivityDetailsPage(role);
                    })
                    .catch(error => {
                        riverToast.show("Something went wrong");
                    });
            })
            .catch((error) => {
                if (error.network_error) {
                    riverToast.show(error.message || "Something went wrong while switching roles.");
                }
            });
    }

    gotoActivityDetailsPage = (role) => {
        let path = this.availableRoles[role];
        let rgx = new RegExp(":activityId\\?", "g");
        path = path.replace(rgx, this.state.activityId);
        console.log(path);
        this.props.history.push(path);
    };
}

export default ActivityLinkPage;