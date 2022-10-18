import React from 'react';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';

import "./ActivityTree.scss";

const ActivityTree = function(props){
    return (
        <div className="activitytree-wrapper">
            <ol className="activitytree">
                <li className="branch">
                    <Avatar className="avatar-comp">A</Avatar>
                    <span className="name">Assigned</span>
                </li>
                <li className="branch">
                    <Avatar className="avatar-comp">Pr</Avatar>
                    <span className="name">President Approved</span>
                </li>
                <li className="branch">
                    <Avatar className="avatar-comp">Pn</Avatar>
                    <span className="name">Panel Approved</span>
                </li>
                <li className="branch">
                    <div className="end">
                        <Avatar className="avatar-comp">PD</Avatar>
                        <span className="name">Points Distributed</span>
                    </div>
                    <ul className="pointtree">
                        <li className="branch user">
                            <div className="end">
                                <span className="avatar">
                                    <img src="resources/images/img/user-avatar.png" alt="user avatar"/>
                                </span>
                                <span className="name">Assignee 1</span>
                                <span className="points">200 points</span>
                            </div>
                        </li>
                        <li className="branch user">
                            <div className="end">
                                <span className="avatar">
                                    <img src="resources/images/img/user-avatar.png" alt="user avatar"/>
                                </span>
                                <span className="name">Assignee 2</span>
                                <span className="points">200 points</span>
                            </div>
                        </li>
                        <li className="branch club">
                            <div className="end">
                                <span className="avatar">
                                    <img src="resources/images/img/club.png" alt="club logo"/>
                                </span>
                                <span className="name">Club (Devalokam)</span>
                                <span className="points">200 points</span>
                            </div>
                        </li>
                    </ul>
                </li>
            </ol>
        </div>
    );
}
export default ActivityTree;