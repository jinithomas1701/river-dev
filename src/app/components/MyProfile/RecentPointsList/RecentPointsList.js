import React from 'react';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Util } from "../../../Util/util";

import "./RecentPointsList.scss";

const RecentPointsList = function (props) {
    return (
        <article className="recent-points-card">
            <header className="header">Your recent Points</header>
            {
                (props.points && props.points.length) ?
                    (<div className="body">
                        <ul className="recent-list">
                            {
                                props.points.map(function (point, index) {
                                    const time = Util.beautifyDate(point.createdDate);
                                    return <li className="item" key={index}>
                                        <div className="part-1">
                                            <span className="desc">{point.description}</span>
                                            <span className="points"><Icon className="points-icon">local_activity</Icon> {point.point}</span>
                                        </div>
                                        <div className="part-2">{time}</div>
                                    </li>
                                })
                            }
                        </ul>
                        <a className="link" onClick={props.clickHandler}>View Point History</a>
                    </div>)
                : 
                (<div className="body nopoints">
                        <p>You haven't scored any points yet.<br />Visit MyActivities page to find some activities and get involved.</p>
                    </div>)
            }
        </article>
    );
}

export default RecentPointsList;