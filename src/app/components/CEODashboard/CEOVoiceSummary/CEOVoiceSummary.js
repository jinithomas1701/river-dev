import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import moment from 'moment';

// custom component
import { Util } from "../../../Util/util";
import { riverToast } from '../../Common/Toast/Toast';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';

// css
import "./CEOVoiceSummary.scss";

const CEOVoiceSummary = (props) => {
    return (
        <div className="ceo-voicesummary-wrapper">
            <table className="summary-table">
                <tbody>
                    <tr>
                        <th>Total</th>
                        <th>Escalated</th>
                        <th>Pending</th>
                    </tr>
                    <tr>
                        <td className="voice-total">{props.total}</td>
                        <td className="voice-escalated">{props.escalated}</td>
                        <td className="voice-pending">{props.pending}</td>
                    </tr>
                    <tr>
                        <th>In Progress</th>
                        <th>Resolved</th>
                        <th>Rejected</th>
                    </tr>
                    <tr>
                        <td className="voice-inprogress">{props.inProgress}</td>
                        <td className="voice-resolved">{props.resolved} </td>
                        <td className="voice-rejected">{props.rejected}</td>
                    </tr>
                </tbody>
            </table>
            <LoaderOverlay show={props.loading} />
        </div>
    );
};

CEOVoiceSummary.defaulProps = {
    bool: false
};

CEOVoiceSummary.propTypes = {
    total: PropTypes.number,
    escalated: PropTypes.number,
    pending: PropTypes.number,
    inProgress: PropTypes.number,
    resolved: PropTypes.number,
    rejected: PropTypes.number,
    loading: PropTypes.bool
};

export default CEOVoiceSummary;