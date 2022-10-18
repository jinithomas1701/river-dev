import React from 'react';
import Icon from 'material-ui/Icon';

import "./PanelRoleCard.scss";

const PanelRoleCard = function (props) {
    return (
        <article className="panelrole-card">
            <header className="header">Panels &amp; Roles</header>
            <div className="body">
                <div className="chip-section">
                    <h2 className="subheader">Your Panels</h2>
                    {
                        props.panels.length? 
                            (<ul className="chip-container">
                                {
                                    props.panels.map(function (panel) {
                                        return <li className="chip-item" key={panel.councilName}>{panel.councilName}</li>
                                    })
                                }
                            </ul>)
                        :
                        (<p>You are not assigned to any panel</p>)
                    }
                </div>
                <div className="chip-section">
                    <h2 className="subheader">Your Roles</h2>
                    {
                        props.roles.length? 
                            (<ul className="chip-container">
                                {
                                    props.roles.map(function (role) {
                                        const selectedClass = (props.activeRole.title == role.title)? "active" : "";
                                        return <li className={`chip-item ${selectedClass}`} key={role.title}>
                                        {(props.activeRole.title == role.title) && <Icon className="active-role-icon">verified_user</Icon>} {role.title}</li>
                                    })
                                }
                            </ul>)
                        :
                        (<p>You are not assigned to any roles</p>)
                    }
                </div>
            </div>
        </article>
    );
}

export default PanelRoleCard;