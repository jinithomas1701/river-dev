import React, { Component } from 'react';
import {connect} from "react-redux";
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

// custom component
import { Util } from "../../../Util/util";
import { CommonService } from "../../Layout/Common.service";

//css
import "./LanderHeader.scss";

export default class LanderHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            avatar: '',
            userDetails: ''
        };
    }

    render(){
        return (
            <header className="page-header-wrapper">
                {!this.props.hideHeader && <img src="resources/images/logo_club_2.png" className="page-logo" width="80" height="80" alt="Club"/>}
                <div className="header-actions">
                    { this.getAvatar() }
                    <span className="username" onClick={this.gotoProfile}>{this.state.userDetails.fullName}</span>
                    <Button onClick={this.onLogout.bind(this)} size="small" className="logout-btn" fab ><Icon>power_settings_new</Icon></Button>
                    <div className="switcher">
                        <a className="item active">Site</a>
                        <a className="item" onClick={this.navigateToPortal.bind(this)}>Portal</a>
                    </div>
                </div>
            </header>
        );
    }

    componentDidMount(){
        CommonService.getLoggedInUserDetails()
            .then(userDetails => {
            this.setState({userDetails});
        })
            .catch(error => {
            riverToast.show(error.status_message);
        });
    }

    navigateToPortal(){
        const userDetails=Util.getLoggedInUserDetails();
        const nextPage = Util.getRedirectPath(userDetails.activeRole.value).slice(1);
        this.props.history.push(nextPage);
    }

    getAvatar() {
        let avatarElement;
        if(!this.state.userDetails){
            return null;
        }
        if (this.state.userDetails.avatar) {
            //avatarElement = <img src={Util.getFullImageUrl(this.state.userDetails.avatar)} alt="dp" className="profile-avatar"/>;
            avatarElement = <Avatar className="user-avatar" onClick={this.gotoProfile} src={Util.getFullImageUrl(this.state.userDetails.avatar)} alt ="dp" />;
        } else {
            avatarElement = <Avatar className="user-avatar" onClick={this.gotoProfile}>{this.state.userDetails.fullName.charAt(0)}</Avatar>;
        }

        return avatarElement;
    }

    gotoProfile = () => {
        this.props.history.push('/myProfile');
    }
    
    onLogout() {
        let type;
        if(Util.getLoggedInUserDetails()){
            type=Util.getLoggedInUserDetails().type;
        }
        Util.clearLoggedInUserData();
        if(type && type == 'client'){
            window.location.href = "/#/login/guest";
        }else{
            window.location.href = "/#/login";
        }
    }
}