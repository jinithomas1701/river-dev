import React from "react";
import { render } from 'react-dom';
import {
    BrowserRouter,
    HashRouter,
    Route,
    Redirect,
    Link,
    Switch,
    IndexRoute,
    browserHistory
} from 'react-router-dom';
import { Util } from "./util";

const PRIVILEGE_ADMINISTRATION = "ADMIN_PRIVILEGE";

function cacheActivityLinkPage(match) {
    const params = match.params;
    if (params && params.activityId && match.path === "/view-activity/:activityId?") {
        const details = {...match, timestamp: new Date().getTime()};
        Util.setActivityLinkDetails(details);
    }
}

function getRedirectionComponent(props, privilege, Component) {
    let routeElement;
    const userDetails = Util.getLoggedInUserDetails();
    cacheActivityLinkPage(props.match)
    if (Util.getAuthToken()) {
        if (userDetails) {

            if (privilege && userDetails.currentPrivileges.indexOf(privilege) < 0) {
                routeElement = <Redirect to='/accessDenied' />;
            } else {
                if (props.location.pathname.indexOf("/admin") >= 0 && userDetails.currentPrivileges.indexOf(PRIVILEGE_ADMINISTRATION) < 0) {
                    routeElement = <Redirect to='/accessDenied' />;
                } else {
                    if (props.location.pathname.indexOf("/login") >= 0) {
                        routeElement = <Redirect to='/#/dashboard' />;
                    } else {
                        routeElement = <Component {...props} />;
                    }
                }
            }
        } else {
            routeElement = <Redirect to='/#/login/Your-session-expired' />;
        }
    } else {
        routeElement = <Redirect to='/#/login/Your-session-expired' />;
    }

    return routeElement;
}

export const PrivateRoute = ({ component: Component, privilege, ...rest }) => (
    <Route {...rest} render={(props) => (
        getRedirectionComponent(props, privilege, Component)
    )} />
)