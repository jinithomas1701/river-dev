import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';

// page dependency
import { Util } from "../../../Util/util";

// css
import "./LanderNav.scss";


function getMenuList(){
    let currentRole = "ALL";
    try{
        currentRole = Util.getActiveRole().value;
    }
    catch(error){
        currentRole = "ALL";
    }

    let dashText = currentRole === ('ROLE_CLUB_PRESIDENT' || currentRole === 'ROLE_RIVER_COUNCIL')? "Dashboard" : "Feed";
    let dashPath, privilageText;
    switch(currentRole) {
        case 'ROLE_CLUB_PRESIDENT':
            dashText = "Dashboard";
            dashPath = "/admin/clubDash";
            privilageText = "VIEW_CLUB_PRESIDENT_DASHBOARD";
            break;
        case 'ROLE_RIVER_COUNCIL':
            dashText = "Dashboard";
            dashPath = "/admin/councilDash";
            privilageText = "VIEW_COUNCIL_DASHBOARD";
            break;
        default:
            dashText = "Feed";
            dashPath = "/dashboard";
            privilageText = "VIEW_USER_MENU";
            break;
    }
    const menuList = [
        {
            "icon": "dashboard",
            "text": dashText,
            "path": dashPath,
            "privilage": privilageText
        },
        {
            "icon": "directions_run",
            "text": "My Activities",
            "path": "/member_activity",
            "privilage": "VIEW_USER_MENU"

        },
        {
            "icon": "date_range",
            "text": "Meetings",
            "path": "/meetings",
            "privilage": "VIEW_USER_MENU"
        },
        {
            "icon": "record_voice_over",
            "text": "Voices",
            "path": "/voice",
            "privilage": "VIEW_VOICE"
        },
        {
            "icon": "store",
            "text": "My Club",
            "path": "/myClub",
            "privilage": "VIEW_USER_MENU"
        },
        {
            "icon": "person",
            "text": "My Profile",
            "path": "/myProfile",
            "privilage": "VIEW_USER_MENU"
        }
    ];

    return menuList;
}

const menuList = getMenuList();

class LanderNav extends Component {
    render() {
        return (
            <nav className="lander-nav">
                <ul>
                    {
                        menuList.map((item, index) => {
                            return Util.hasPrivilage(item.privilage) ?
                                <li key={index}>
                                    <Link to={item.path}><Icon>{item.icon}</Icon> {item.text}</Link>
                                </li>
                                :
                            null
                        })
                    }
                </ul>
            </nav>
        );
    }
}

export default LanderNav;