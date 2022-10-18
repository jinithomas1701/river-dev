import React from 'react';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';

import "./InfoCard.scss";

const InfoCard = function(props){
    return (
        <div className="infocard-wrapper">
            <article className="infocard-item">
                <div className="infocard-img logo">
                    <div className="image-holder">
                        <img src={props.club.clubAvatar} alt="club logo" />
                    </div>
                </div>
                <div className="infocard-body">
                    <h1 className="infocard-header">My Club
                        {props.club.clubName && <Link to="/myClub" className="redirect-link" title="View MyClub page">
                            <Icon className="redirect-icon">input</Icon>
                        </Link>}
                    </h1>
                    <p className="infocard-desc">{props.club.clubName || "Not Assigned Yet"} <span className="points"><Icon className="points-icon">local_activity</Icon>{props.club.clubPoints}</span></p>
                </div>
            </article>
            <article className="infocard-item">
                <div className="infocard-img">
                    <Icon>person_pin_circle</Icon>
                </div>
                <div className="infocard-body">
                    <h1 className="infocard-header">Current Location</h1>
                    <p className="infocard-desc">{props.club.currentLocation}</p>
                </div>
            </article>
            <article className="infocard-item">
                <div className="infocard-img">
                    <Icon>pin_drop</Icon>
                </div>
                <div className="infocard-body">
                    <h1 className="infocard-header">Base Location</h1>
                    <p className="infocard-desc">{props.club.baseLocation}</p>
                </div>
            </article>
        </div>
    );
}
export default InfoCard;