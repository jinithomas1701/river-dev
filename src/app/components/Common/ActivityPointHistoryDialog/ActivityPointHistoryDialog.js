import React from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import moment from 'moment';

import "./ActivityPointHistoryDialog.scss";

const SHORT_TEXT_LEN = 150;

class ActivityPointHistoryDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            masterExpanded: false,
            activityExpanded: false
        };
    }

    render() {
        const historyData = this.props.historyData;
        return (
            <Dialog open={this.props.open} onClose={this.handlePopupClose} className="activity-pointhistory-dialog-wrapper" >
                <DialogContent>
                    <div className="main-wrapper">
                        {
                            (historyData !== null && !historyData.error) && this.getDetailsTemplate(historyData)
                        }
                        {
                            (historyData !== null && historyData.error) && this.getErrorMessageTemplate(historyData)
                        }
                        { (historyData === null) && this.getLoadingTemplate() }
                        <div className="close-btn">
                            <IconButton onClick={this.handlePopupClose.bind(this)}>
                                <Icon>clear</Icon>
                            </IconButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    getErrorMessageTemplate(historyData){
        return (
            <div className="error-wrapper">
                <p><Icon className="error-icon">warning</Icon> {historyData.error}</p>
            </div>
        );
    }

    getLoadingTemplate(historyData){
        return (
            <div className="loading-wrapper">
                <CircularProgress size={18}/>
                <p>loading data</p>
            </div>
        );
    }

    getDetailsTemplate(historyData){
        return (
            <section className="details-wrapper">
                <h1 className="title-master">{historyData.masterTitle}</h1>
                <h2 className="title-activity">{historyData.activityTitle}</h2>
                <table className="headsup-table">
                    <thead>
                        <tr>
                            <th>Reference Code:</th>
                            <th className="text-right">Points Credited on:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{historyData.referenceCode}</td>
                            <td className="text-right">{moment.unix(historyData.creditedDate / 1000).format("DD MMM YYYY hh:mm A")}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="points-group">
                    <div className="col">
                        <h3 className="subheading">Assignees</h3>
                        <div className="table-wrapper">
                            <table className="point-table user">
                                <tbody>
                                    {this.getPointsTemplate(historyData.assignees)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <h3 className="subheading">Clubs</h3>
                        <div className="table-wrapper">
                            <table className="point-table club">
                                <tbody>
                                    {this.getPointsTemplate(historyData.clubs)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <table className="approvers-table">
                    <thead>
                        <tr>
                            <th>Approvers:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>{this.getApproversTemplate(historyData.panel)}</ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="descriptions">
                    {historyData.masterDesc && this.getMasterDescriptionText(historyData.masterDesc)}
                    {historyData.activityDesc && this.getActivityDescriptionText(historyData.activityDesc)}
                </div>
            </section>
        );
    }

    handlePopupClose(){
        this.props.handlePopupClose();
    }

    getPointsTemplate(pointData){
        const template = pointData.map((item, index) => {
            return (
                <tr key={index}>
                    <th>{item.name}</th>
                    {item.club && <td>{item.club}</td>}
                    <td className="text-right">{item.point}</td>
                </tr>);
        });

        return template;
    }

    getApproversTemplate(panel){
        const template = panel.map((approver, index) => {
            return (
                <li key={index}>{approver.name} {approver.type === "PANEL" && <span>(Panel)</span>}</li>
            );
        });
        return template;
    }

    getMasterDescriptionText(text){
        let newText;
        if(text.length < SHORT_TEXT_LEN || this.state.masterExpanded){
            newText = text;
        }
        else {
            newText = text.slice(0, SHORT_TEXT_LEN);
        }
        return (
            <p>
                <b>Main Descriptions:</b>
                {newText}
                {(text.length > SHORT_TEXT_LEN && this.state.masterExpanded) && <a onClick={this.toggleMasterDescription.bind(this)}>...show less</a>}
                {(text.length > SHORT_TEXT_LEN && !this.state.masterExpanded) && <a onClick={this.toggleMasterDescription.bind(this)}>...Show more</a>}
            </p>
        )
    }

    getActivityDescriptionText(text){
        let newText;
        if(text.length < SHORT_TEXT_LEN || this.state.activityExpanded){
            newText = text;
        }
        else {
            newText = text.slice(0, SHORT_TEXT_LEN);
        }
        return (
            <p>
                <b>Claim Descriptions:</b>
                {newText}
                {(text.length > SHORT_TEXT_LEN && this.state.activityExpanded) && <a onClick={this.toggleActivityDescription.bind(this)}>...show less</a>}
                {(text.length > SHORT_TEXT_LEN && !this.state.activityExpanded) && <a onClick={this.toggleActivityDescription.bind(this)}>...Show more</a>}
            </p>
        )
    }

    toggleMasterDescription(){
        this.setState({
            masterExpanded: !this.state.masterExpanded
        });
    }

    toggleActivityDescription(){
        this.setState({
            activityExpanded: !this.state.activityExpanded
        });
    }
}

export default ActivityPointHistoryDialog;