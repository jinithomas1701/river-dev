import React from "react";
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { Link, NavLink } from 'react-router-dom';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import Avatar from 'material-ui/Avatar';
import { Util } from "../../Util/util";

import { CommonService } from "./Common.service";
import { SelectBox } from "../Common/SelectBox/SelectBox";
import { Toast, riverToast } from '../Common/Toast/Toast';

//custom components

//css
import "./Sidemenu.scss";

export class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            roleList: [],
            selectedRole: "",
            width: Util.getSidemenuWidth(),
            activeAccordian: '',
            clubName: ""
        };

        this.clubName = Util.getLoggedInUserDetails().myClub ? Util.getLoggedInUserDetails().myClub.name : "";
    }

    componentDidMount() {
        Util.setSidemenuContext(this);

        const userDetails = Util.getLoggedInUserDetails();
        if (!userDetails) {
            CommonService.getLoggedInUserDetails()
                .then(data => {
                    Util.setLoggedInUserDetails(data);
                    this.setUserDetails(data);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        }
        else {
            Util.setLoggedInUserDetails(userDetails);
            this.setUserDetails(userDetails);
        }
    }

    setUserDetails(userDetails) {
        this.setState({
            ...this.state,
            roleList: userDetails.roles,
            selectedRole: userDetails.activeRole.value,
        });
        this.clubName = Util.getLoggedInUserDetails().myClub ? Util.getLoggedInUserDetails().myClub.name : "";
    }

    render() {

        if (this.state.width == '3.3rem') {
            return <div></div>;
        }

        const myPath = window.location.hash.replace('#', '');
        let isMenuActive = false;
        let classess = "sidemenu-item child";



        var privilageList = Util.getLoggedInUserDetails() ? Util.getLoggedInUserDetails().currentPrivileges : [];

        var menuList = this.props.list.map((item, index) => {

            isMenuActive = false;

            if (Util.hasPrivilage(item.privilage)) {

                if (!this.clubName && item.text === "My Club") {
                    return null;
                }

                let hasMoreChild = false;
                const children = (item.children && item.children.length > 0) ? item.children.map((child, index) => {
                    if (Util.hasPrivilage(child.privilage)) {
                        if (!child.adminItem
                            || (child.adminItem && Util.hasPrivilage('ADMIN_PRIVILEGE'))) {

                            if (child.path === myPath) {
                                isMenuActive = true;
                                classess = "sidemenu-item child activemenu";
                            }
                            else if (child.path === '/admin/points') {
                                classess = "sidemenu-item child disabled";
                            }
                            else {
                                classess = "sidemenu-item child";
                            }

                            return <ListItem button className={classess} key={index} onClick={this.onSideMenuChildClick.bind(this, child.path)}>
                                {
                                    child.icon ?
                                        <ListItemIcon>
                                            <Icon style={{ "fontSize": "18px", "margin": "0" }}>{child.icon}</Icon>
                                        </ListItemIcon>
                                        :
                                        <Avatar alt="iD" src={'../../../resources/images/' + child.im} style={{ "height": "20px", "width": "1.5rem", "margin": "0" }} />
                                }
                                <ListItemText className="item-text" inset primary={child.text} />
                            </ListItem>
                        }
                    }
                }) : false;

                if (children.length > 1 && children.filter(item => { return item !== undefined }).length > 1) { hasMoreChild = true }
                if (item.path === myPath) {
                    classess = "sidemenu-item activemenu";
                }
                else {
                    classess = "sidemenu-item";
                }


                return <div className={("sidemenu-comp") + (this.state.activeAccordian == index ? " active" : "")} key={index} to={item.path}>
                    {this.state.width === "14rem" &&
                        <ListItem button className={classess} onClick={this.onSideMenuItemClick.bind(this, hasMoreChild, item, index)}>
                            {item.icon ?
                                <ListItemIcon>
                                    <Icon style={{ "fontSize": "18px", "margin": "0" }}>{item.icon}</Icon>
                                </ListItemIcon>
                                :
                                <Avatar alt="iD" src={'../../../resources/images/' + item.im} style={{ "height": "20px", "width": "1.5rem", "margin": "0" }} />
                            }
                            <ListItemText className="item-text" inset primary={item.text} />
                            {
                                (hasMoreChild) &&
                                (
                                    (this.state.activeAccordian == index || isMenuActive) ?
                                        <Icon className="expand-icon">expand_less</Icon>
                                        :
                                        <Icon className="expand-icon">expand_more</Icon>
                                )
                            }
                        </ListItem>
                    }
                    {
                        (item.children && item.children.length > 0) &&
                        <div className={("sidemenu-item-children") + ((this.state.activeAccordian == index || isMenuActive) ? " active" : "")}>
                            {children}
                        </div>
                    }
                    {this.state.width === "3.3rem" &&
                        <ListItem button className="sidemenu-item">
                            {item.icon ? <ListItemIcon>
                                <Icon style={{ "fontSize": "20px", "width": "22px", "margin": "0" }}>{item.icon}</Icon>
                            </ListItemIcon> :
                                <Avatar style={{ width: 'auto' }} alt="iD" src={'../../../resources/images/' + item.im} />
                            }
                            <div className="custom-tool-tip">{item.text}</div>
                        </ListItem>
                    }
                </div>;
            }
        });
        const style = {
            "height": "95%",
            "width": this.state.width,
            "overflow": "auto",
            "padding": "1rem 0px 1rem 0px"

        };
        const parentStyle = {
            "width": this.state.width
        };

        return (
            <div className="sidedrawer-container" style={parentStyle}>
                <div className="sidedrawer custom-scroll" style={style}>
                    <div className="head-panel">

                        <div className="img-panel">
                            <img className="club-logo" src="../../../../resources/images/logo_club_2.png" />
                        </div>
                        {/* <div className="role-switch">                        
                        <SelectBox 
                            id="user-role-select" 
                            label="Current Role" 
                            selectedValue={this.state.selectedRole}
                            selectArray={this.state.roleList}
                            onSelect={this.onSelectRole.bind(this)}
                            autoload={true}

                            />
                        </div> */}

                    </div>
                    <div className={this.drawerInner}>
                        <List>
                            {menuList}
                        </List>
                    </div>
                </div>
            </div>
        );
    }

    onSideMenuItemClick(hasChild, item, index) {
        if (item.children && item.children.length > 0 && hasChild) {
            if (this.state.activeAccordian == index) this.setState({ activeAccordian: '' });
            else this.setState({ activeAccordian: index });
        } else {
            this.setState({ activeAccordian: index });
            window.location.href = "#" + item.path;
        }
    }

    onSideMenuChildClick(path, event) {
        if (path === '/admin/points') {
            riverToast.show("This functionality is disabled for the moment.");
        }
        else {
            window.location.href = "#" + path;
        }
        // this.props.history.push(path);

        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    onSelectRole(role, load = false) {
        if (role) {
            this.setState({
                ...this.state,
                selectedRole: role
            });
            if (load) {
                //alert(role);
                this.onSwitchRole(role);
            }
        }


    }

    onSwitchRole(role = null) {
        let request = {};
        if (role) {
            request = {
                newRole: role
            };

        } else {
            request = {
                newRole: this.state.selectedRole
            };
        }
        CommonService.switchRole(request)
            .then(data => {
                this.setState({ userMenuOpen: false });
                riverToast.show("User role has been changed");
                Util.setLoggedInUserDetails(data);
                this.setUserDetails(data);
                if (window.location.href.endsWith('/dashboard')) {
                    window.location.reload();
                } else {
                    window.location.href = "/#/dashboard";
                }
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while switching role");
            });
    }


}

Sidebar.propTypes = {
    list: PropTypes.array.isRequired
}