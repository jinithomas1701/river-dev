import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

// custom component
import { Util } from "../../../Util/util";
import RatingCriteria from "../../Common/RatingCriteria/RatingCriteria";
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import AvatarChips from '../../Common/AvatarChips/AvatarChips';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';

// css
import "./KpiDetails.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";

class KpiDetails extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        //@TODO: remove unnecessary div and use reactFragment in v16.0
        const props = this.props;
        const kpi = props.kpi;
        const approvalPanel = this.getApprovingPanel(kpi.approvers || []);

        return (
            <div className="kpidetails-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="title">Title</h2>
                        <div className="body">{kpi.title}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="title">Description</h2>
                        <div className="body">{kpi.description || "No Description available."}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <h2 className="title">Point Description</h2>
                        <div className="body pts-desc">{kpi.pointDescription || "<No Pont Description available>"}</div>
                        <h2 className="title">Rules</h2>
                        <div className="body">{kpi.rules || "No Rules description available."}</div>
                        <h2 className="title">Point Details</h2>
                        <RatingCriteria ratingType={kpi.ratingType} ratingValues={kpi.categories || []} />
                    </div>
                    <div className="col-6">
                        <table className="table-properties">
                           <caption></caption>
                            <tbody>
                                <tr>
                                    <th>Mandatory</th>
                                    <th>Self Assignable</th>
                                </tr>
                                <tr>
                                    <td>{kpi.mandatory? "Yes" : "No"}</td>
                                    <td>{kpi.selfAssignable? "Yes" : "No"}</td>
                                </tr>
                                <tr>
                                    <th>Inter-Club Collaboration</th>
                                    <th>Approving Method</th>
                                </tr>
                                <tr>
                                    <td>{kpi.interClub? "Yes" : "No"}</td>
                                    <td>{kpi.approvingMethod}</td>
                                </tr>
                                <tr>
                                    <th>Club Point Distribution</th>
                                    <th>Member Point Distribution</th>
                                </tr>
                                <tr>
                                    <td>{kpi.clubPointDistribution}</td>
                                    <td>{kpi.memberPointDistribution}</td>
                                </tr>
                                <tr>
                                    <th>Club Assesment Period</th>
                                    <th>Member Assesment Period</th>
                                </tr>
                                <tr>
                                    <td>{kpi.clubAssessmentPeriod}</td>
                                    <td>{kpi.memberAssessmentPeriod}</td>
                                </tr>
                                <tr>
                                    <th colSpan="2">Additional Points</th>
                                </tr>
                                <tr>
                                    <td colSpan="2">{kpi.additionalPoints} Pts</td>
                                </tr>
                            </tbody>
                        </table>
                        <FieldHeader title="Panels" />
                        <AvatarChips
                            list={approvalPanel}
                            deletable={false}
                            />
                    </div>
                </div>
                <LoaderOverlay show={props.loading} />
            </div>
        );
    }

    getApprovingPanel(approvers){
        const aproverList = approvers.map((approver, index) => ({title: approver.name, id: `${index}${approver.name}`}));
        return aproverList;
    }
}


KpiDetails.defaultProps = {
    kpi: {},
    loading: false
}

KpiDetails.propTypes = {
    loading: PropTypes.bool,
    kpi: PropTypes.object,
};

export default KpiDetails;