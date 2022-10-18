import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton/IconButton';

// custom component
import { Util } from "../../../Util/util";
import ActivityProgressBar from '../../Common/ActivityProgressBar/ActivityProgressBar';

// css
import "./ActivityHeaderInfo.scss";

const handleKpiDetailsOpen = (props) => {
    props.onKpiDetailsOpen(props.kpi.id);
}

const ActivityHeaderInfo = (props) => {
    return (
        <div className="activityheaderinfo-wrapper">
            <ActivityProgressBar status={props.status} />
            <h1 className="activity-title">{props.title}</h1>
            <div className="kpi-title">
                <IconButton color="primary" className="btn-icon btn-kpi-details" onClick={handleKpiDetailsOpen.bind(this, props)}>info</IconButton>
                <span className="text">{props.kpi.title}</span>
            </div>
            <div className="alt-info">
                <span className="ref-code">#{props.id}</span>
                <dl>
                    <dt>Created</dt>
                    <dd>{Util.formatDateFromUnix(props.createdOn, "DD MMM YYYY")}</dd>
                </dl>
                <dl>
                    <dt>Modified</dt>
                    <dd>{Util.formatDateFromUnix(props.lastUpdatedOn, "DD MMM YYYY")}</dd>
                </dl>
            </div>
            <div className="activity-description">
                <strong className="desc-lable">Description: </strong>
                <div className="desc-body">{props.description}</div>
            </div>
        </div>
    );
};

ActivityHeaderInfo.propTypes = {
    onKpiDetailsOpen: PropTypes.func
};

export default ActivityHeaderInfo;