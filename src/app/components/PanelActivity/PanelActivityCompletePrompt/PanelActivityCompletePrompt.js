import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import moment from 'moment';

// custom component
import {Util} from "../../../Util/util";
import StarRate from '../../Common/StarRate/StarRate';
import AvatarChips from '../../Common/AvatarChips/AvatarChips';
import { DateDisplay } from '../../Common/MinorComponents/MinorComponents';

// css
import "./PanelActivityCompletePrompt.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";
const ACTIVITY_STATUS_ACTIVE = "A";

class PanelActivityCompletePrompt extends Component{
    constructor(props){
        super(props);
        this.state = {
            comment: ""
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidUpdate(prevProps) {
        const prevActivity = prevProps.activity;
        const currActivity = this.props.activity;
        if ((!prevActivity && currActivity) || (prevActivity && currActivity && (prevActivity.id !== currActivity.id))) {
            this.resetForm();
        }
    }

    render(){
        const activity = this.props.activity;
        const template = activity? this.getMainTemplate(activity) : this.getLoadingTemplate();

        return template;
    }

    resetForm(){
        this.setState({comment: ""});
    }

    getMainTemplate(activity){
        const displayStarRating = (activity.ratingType === RATING_TYPE_STAR);
        const displayCategory = (activity.ratingType === RATING_TYPE_CATEGORY);
        const assignees = this.getAssigneesList(activity.pointMatrix.assignees);
        const clubs = this.getClubList(activity.pointMatrix.clubs);

        return (
            <Dialog
                open={this.props.open}
                maxWidth="md"
                className="panel-activitycomplete-wrapper"
                >
                <DialogTitle className="header">Approve Activity</DialogTitle>
                <DialogContent className="content">
                    <section  className="complete-activity-wrapper">
                        <table className="display-wrapper">
                            <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <h1 className="title">Title:</h1>
                                        <div className="brief">{activity.title}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <h2 className="title">Description:</h2>
                                        <div className="brief">{activity.description}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 className="title">Reference Code:</h2>
                                        <div className="brief">{activity.id}</div>
                                    </td>
                                    <td>
                                        {
                                            (displayStarRating) && <div>
                                                    <h2 className="title">{activity.kpi.title}</h2>
                                                    <StarRate
                                                        value={activity.currentRating}
                                                        categories={activity.kpi.ratings}
                                                        />
                                                </div>
                                        }
                                        {
                                            (displayCategory) && <div>
                                                    <h2 className="title">{activity.kpi.title}</h2>
                                                    <div className="brief">{this.getCategoryLabel(activity.kpi.ratings, activity.currentRating)}</div>
                                                </div>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 className="title">Multiplier:</h2>
                                        <div className="brief">{activity.multiplier}</div>
                                    </td>
                                    <td>
                                        <h2 className="title">Claim Period:</h2>
                                        <div className="brief"><DateDisplay format="MMM YYYY" date={activity.claimPeriod} /></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="assignees-wrapper">
                            <AvatarChips
                                list={assignees}
                                deletable={false}
                                />
                        </div>
                        <div className="club-wrapper">
                            <AvatarChips
                                list={clubs}
                                deletable={false}
                                />
                        </div>
                        <div className="justification-wrapper">
                            <textarea
                                className="input-comment"
                                placeholder="Please add Justification"
                                value={this.state.comment}
                                onChange={this.handleCommentChange}
                                />
                        </div>
                    </section>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <Button className="btn-default" color="default" onClick={this.handleCancel}>Cancel</Button>
                    <Button className="btn-primary" color="primary" onClick={this.handleComplete}>Approve</Button>
                </DialogActions>
            </Dialog>
        );
    }

    getLoadingTemplate(){
        return (
            <Dialog
                open={this.props.open}
                maxWidth="md"
                className="panel-activitycomplete-wrapper"
                >
                <DialogTitle>Approve Activity</DialogTitle>
                <DialogContent>
                    <section  className="complete-activity-wrapper">
                        <p>loading...</p>
                    </section>
                </DialogContent>
                <DialogActions>
                    <Button color="default" onClick={this.handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

    getCategoryLabel(categories, code){
        const selected = categories.find(category => {
            return category.code === code;
        });

        return selected.label;
    }

    getAssigneesList(assigneesList){
        const assignees = assigneesList.map(assignee => {
            const pointHistoryText = assignee.changedPoints !== assignee.defaultPoints ? ` (was ${assignee.defaultPoints})` : "";
            return {
                id: assignee.id,
                title: assignee.name,
                subText: `${assignee.changedPoints} ${pointHistoryText}`,
                avatar: assignee.avatar
            }
        });
        return assignees;
    }

    getClubList(clubList){
        const clubs = clubList.map(club => {
            const pointHistoryText = club.changedPoints !== club.defaultPoints ? ` (was ${club.defaultPoints})` : "";
            return {
                id: club.id,
                title: club.name,
                subText: `${club.changedPoints}${pointHistoryText}`,
                avatar: club.avatar
            }
        });
        return clubs;
    }

    getClubTemplate(clubs){
        return clubs.map(club => {
            return <span key={club.id}>{club.name}</span>
        });
    }

    handleCommentChange(event){
        const comment = event.target.value;
        this.setState({comment})
    }

    handleComplete(){
        const comment = this.state.comment;
        this.props.onComplete(this.props.activity, comment);
    }

    handleCancel(){
        this.resetForm();
        this.props.onCancel();
    }
}

PanelActivityCompletePrompt.propTypes = {
    open: PropTypes.bool.isRequired,
    activity: PropTypes.object,
    comment: PropTypes.string,
    onCommentChange: PropTypes.func,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func
};

export default PanelActivityCompletePrompt;