import React from "react";
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import AddUser from 'material-ui-icons/PersonAdd';
import Menu, { MenuItem } from 'material-ui/Menu';
import Notifications from 'material-ui-icons/Notifications';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {connect} from "react-redux";
import Badge from 'material-ui/Badge';
import { LinearProgress } from 'material-ui/Progress';
import Popover from 'react-simple-popover';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';

import { Toast, riverToast } from '../Common/Toast/Toast';
import { CommonService } from "./Common.service";
import {Util} from "../../Util/util";
import {SelectBox} from "../Common/SelectBox/SelectBox";
import NotificationsMenu from "../Common/Notifications/Notifications";
import { recentNotificationsListChange,
        unreadNotificationsChange,
        unreadNotificationsCountChange,
        changeNotificationPayload } from "../Common/Notifications/Notifications.actions";

import "./header.scss";
const PRIVILEGE_ADMINISTRATION = "ADMIN_PRIVILEGE";
const PRIVILEGE_VIEW_PROFILE = "VIEW_PROFILE";

const mapStateToProps = (state) => {
    return {
        notifications: state.NotificationsReducer,
        feeds: state.FeedsReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        recentNotificationsListChange: (recentNotificationsList) => {
            dispatch(recentNotificationsListChange(recentNotificationsList))
        },
        unreadNotificationsCountChange: (count) => {
            dispatch(unreadNotificationsCountChange(count))
        },
        changeNotificationPayload: (type, payload) => {
            dispatch(changeNotificationPayload(type, payload))
        }
    }
};
class Header extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userMenuOpen: false,
            anchorEl: null,
            selectedRole: "",
            fullName: "",
            username: "",
            avatar: null,
            roleList: [],
            notificationMenuOpen: false,
            showLoader: false,
            apiOnCall: {
                recentNotifications: false,
                newNotifications: false
            },
            userDetails:{
                roles:[],
                activeRole:''
            }
        };
        this.notificationStyle = {
            width: "30rem"
        };

        this.usermenuStyle = {
            width: "auto"
        };

        this.classes={
            root:{
                height:'2rem'
            }
        };

        this.timerId = "";
    }


    componentDidMount() {
        Util.setHeaderContext(this);
        let userDetails = Util.getLoggedInUserDetails();

        if(!userDetails){
            CommonService.getLoggedInUserDetails()
            .then(data => {
                Util.setLoggedInUserDetails(data);
                this.setUserDetails(data);

                let userDetails =  Util.getLoggedInUserDetails();
                this.setState({userDetails,currentRole:userDetails.activeRole.value});

            })
                .catch(error => {
                riverToast.show(error.status_message);
            });
        }
        else{
            Util.setLoggedInUserDetails(userDetails);
            this.setUserDetails(userDetails);
            this.setState({userDetails,currentRole:userDetails.activeRole.value});
        }
        //this.getNotifications();
        //this.timerId = setInterval(this.getNotifications.bind(this), 1000*60*5);
    }

    componentDidUpdate(prevProps, prevState) {
        if((prevState.userDetails && prevState.userDetails.activeRole) && prevState.userDetails.activeRole.value != this.state.userDetails.activeRole.value) {
            let userDetails =  Util.getLoggedInUserDetails();

        }
    }

    setUserDetails(userDetails) {
        this.setState({
            ...this.state,
            roleList: userDetails.roles,
            fullName: userDetails.fullName,
            username: userDetails.username,
            avatar: userDetails.avatar,
            selectedRole: userDetails.activeRole.value
        });
    }

    componentWillUpdate() {
        if(this.timerId) {
            clearInterval(this.timerId);
            this.timerId = setInterval(this.getNotifications.bind(this), 1000*60*5);            
        }
    }

    componentWillUnmount() {
        if(this.timerId) {
            clearInterval(this.timerId);    
        }
    }

    render() {

        let adminLabel="";
        if(this.state.selectedRole=='ROLE_RIVER_COUNCIL'){
            adminLabel="Manage Panel";
        }else if(this.state.selectedRole=="ROLE_CLUB_PRESIDENT"){
            adminLabel="Manage Club"
        }else{
            adminLabel="Administration";
        }

        const switchTemplate = <Switch onChange={this.navigateToLanderPage.bind(this)} value="1" color="primary" />;

        //from maincontainer
        const activeRole=this.state.userDetails.activeRole.value;

        const roles=this.state.userDetails.roles.sort((a,b)=>{return a.value>b.value}).map((item,index)=>{
            let styleClass="role-switcher-item"

            if(item.value==activeRole){
                styleClass+=' active';

            }

            if(item.value !== 'ROLE_CLUB_CLIENT') return <div key={item.value} className={styleClass} onClick={()=>{this.onSwitchRole(item.value)}}>{item.title}</div>

        });

        return (
            <div>
                <AppBar position="static" className="app-bar-container" style={{ backgroundColor: "#fff",boxShadow:"0 0 16px #f3f3f3" }}>
                    <Toolbar className="tool-bar">
                        <IconButton color="default" aria-label="Menu" title="Expand/Collapse Menu">
                            <MenuIcon onClick={this.onMenuIconClick.bind(this)}/>
                        </IconButton>
                        <Typography type="title" color="inherit" className="flex">
                            <img height="80" className="club-logo" src="../../../../resources/images/litmus-logo.svg"/>
                        </Typography> 
                        {
                            activeRole !== 'ROLE_CLUB_CLIENT' &&
                                <div className="role-switcher">
                                    <div className="role-switcher-title"> VIEWING AS </div>
                                    <div className="role-switcher-items-container">
                                        <SelectBox 
                                            id="club-location-select" 
                                            selectedValue={this.state.currentRole}
                                            selectArray={this.state.userDetails.roles}
                                            onSelect={this.handleRoleChange.bind(this)}
                                            />
                                    </div>
                                </div>
                        }


                        <FormControlLabel
                            label="Site"
                            control={ switchTemplate }
                            className="app-bar-icon-wrapper"
                            />
                        <div className="app-bar-icon-wrapper" title="User">
                            <IconButton
                                onClick={this.onUserIconClick.bind(this)}
                                ref="usermenu"
                                className="header-icon"
                                aria-label="Add User"
                                >
                                <AccountCircle />
                            </IconButton>
                            <Popover
                                placement='bottom'
                                containerStyle = {{"zIndex":"1101"}}
                                style={this.usermenuStyle}
                                target={this.refs.usermenu}
                                show={this.state.userMenuOpen}
                                onHide={this.onUserIconClick.bind(this)}
                                >
                                <div className="profile-card">
                                    <div className="section">
                                        <div  className="profile-wrapper">
                                            {this.getAvatar()}

                                            <div className="user-text">
                                                <div className="name hover-cursor"  onClick={this.gotoMyProfile.bind(this)}>{this.state.fullName}</div>
                                                <div className="email hover-cursor" title={this.state.username} onClick={this.gotoMyProfile.bind(this)}>{this.state.username}</div>
                                                <div className="action-wrapper">
                                                    {
                                                        Util.hasPrivilage(PRIVILEGE_VIEW_PROFILE) &&
                                                            <div className="river-btn" onClick={this.gotoMyProfile.bind(this)}>
                                                                View Profile
                                                            </div>
                                                    }
                                                    <div className="river-btn" onClick={this.onLogout.bind(this)}>
                                                        LOGOUT
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section role-wrapper">
                                        <SelectBox 
                                            id="user-role-select" 
                                            label="Role" 
                                            selectedValue={this.state.selectedRole}
                                            selectArray={this.state.roleList}
                                            onSelect={this.onSelectRole.bind(this)}/>
                                        {
                                            (this.state.roleList.length > 1) && <div className="river-btn flat" onClick={this.onSwitchRole.bind(this,null)}>
                                                    SWITCH
                                                </div> }
                                    </div>

                                </div>
                            </Popover>                            
                        </div>
                    </Toolbar>
                    {this.state.showLoader &&
                        <LinearProgress />
                    }
                </AppBar>
            </div>
        );
    }


    handleRoleChange(value) {
        if(this.state.currentRole !== value){
            this.setState({currentRole:value});
            this.onSwitchRole(value);
        }
    }

    onMenuIconClick() {
        Util.toggleSidemenu();
    }

    getAvatar() {
        let avatarElement;
        if (this.state.avatar) {
            avatarElement = <img src={Util.getFullImageUrl(this.state.avatar)} alt="dp" className="profile-avatar"/>;
        } else {
            avatarElement = <Avatar onClick={this.gotoMyProfile.bind(this)} className="hover-cursor">{this.state.fullName.charAt(0)}</Avatar>;
        }

        return avatarElement;
    }

    onUserIconClick(event) {
        this.setState({userMenuOpen: !this.state.userMenuOpen});
    }

    onNotificationsIconClick() {
        this.setState({notificationMenuOpen: !this.state.notificationMenuOpen});        
    }

    onLogout() {
        let type='';
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

    onHeaderMenuClose() {
        this.setState({userMenuOpen: false});
    }

    onSelectRole(role,load=false) {        
        if (role) {
            this.setState({
                ...this.state,
                selectedRole: role
            });
            if(load){
                //alert(role);
                this.onSwitchRole(role);
            }
        }


    }

    gotoMyProfile(){
        window.location.href = "/#/myProfile";
    }

    processNotificationsList(notificationsList) {
        this.props.recentNotificationsListChange(notificationsList || []);
        const changedFeeds = this.iterateNotifications(notificationsList);
    }

    iterateNotifications(notificationsList) {
        let tempVars = {};

        notificationsList.forEach( (notification) => {
            if(notification.status != "read") {
                const urlParams = notification.url.match(/\/([\w]+)\/([\w\W\D]*)/);

                switch (urlParams[1]) {
                    case "feed":
                        const thisFeedId = notification.url.match(/\/([\w]+)\/([\w\W\D]*)/)[2];

                        if(!tempVars.feedIds) {
                            tempVars.feedIds = [];
                        }

                        if(!tempVars.feedIds.includes(thisFeedId) && notification.payload) {
                            tempVars.feedIds.push(thisFeedId);

                            if(this.isFeedLoaded(thisFeedId, this.props.feeds.feedsList)){
                                this.props.changeNotificationPayload("FEED", notification.payload);
                            }
                        }
                        break;
                }
            }
        });
    }

    isFeedLoaded(myFeedId, feedsList){
        var result = false;

        feedsList.forEach( feed => {
            if(feed.feedId == myFeedId) {
                result = true;
            }
        })

        return result;
    }

    getNotifications() {
        const apiKey = "newNotifications"; 
        if(Util.isLoggedIn() && !this.state.apiOnCall[apiKey]) {
            this.apiOnCallSwitch(apiKey);
            CommonService.getNotifications()
                .then((data) => {
                this.props.unreadNotificationsCountChange(data.newNotificationCount);
                this.processNotificationsList(data.notification);
                this.apiOnCallSwitch(apiKey);
            })
                .catch((error) => {
                this.apiOnCallSwitch(apiKey);
                // riverToast.show("Something went wrong fetching notifications");
            })
        }
    }

    markReadNotifications() {
        const apiKey = "recentNotifications";
        if(Util.isLoggedIn() && !this.state.apiOnCall[apiKey]) {
            this.apiOnCallSwitch(apiKey);
            CommonService.notificationsMarkRead()
                .then((data) => {
                this.apiOnCallSwitch(apiKey);
                return true;
            })
                .catch((error) => {
                this.apiOnCallSwitch(apiKey);
                // riverToast.show("Something went wrong fetching notifications");
            })
        }
    }

    apiOnCallSwitch(apiKey) {
        var apiOnCallList = this.state.apiOnCall;
        apiOnCallList[apiKey] = !apiOnCallList[apiKey];

        this.setState({ apiOnCall: apiOnCallList });
    }

    onSwitchRole(role=null) {
        let request={};
        if(role){
            request = {
                newRole: role
            };

        }else{
            request = {
                newRole: this.state.selectedRole
            };
        }
        CommonService.switchRole(request)
            .then(data => {

            CommonService.getLoggedInUserDetails()
                .then( data => {
                    this.setState({userMenuOpen: false});
                    riverToast.show("User role has been changed");
                    Util.setLoggedInUserDetails(data);
                    this.setState({userDetails:data});

                    let redirectPath = Util.getRedirectPath(data.activeRole.value);
            
                    if(window.location.href.endsWith(redirectPath)) {
                        window.location.reload();
                    } else {
                        window.location.href = redirectPath;
                    }
                })
                .catch(error => {
                    riverToast.show("Something went wrong while loading user details.");
                });
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while switching role");
        });
    }

    navigateToLanderPage(){
        this.props.history.push("/welcome");
    }
}

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(Header) );