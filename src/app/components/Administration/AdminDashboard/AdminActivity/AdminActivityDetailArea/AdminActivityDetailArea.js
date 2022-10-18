import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton/IconButton';
import TextField from 'material-ui/TextField';
import Menu, { MenuItem } from 'material-ui/Menu';
import moment from 'moment';
import Datetime from 'react-datetime';

// custom component
import { Util } from "../../../../../Util/util";
import { riverToast } from '../../../../Common/Toast/Toast';
import ActivityHeaderInfo from '../../../../Common/ActivityHeaderInfo/ActivityHeaderInfo';
import StarRate from '../../../../Common/StarRate/StarRate';
import AttachmentInput from '../../../../Common/AttachmentInput/AttachmentInput';
import MemberBox from '../../../../Common/MemberBox/MemberBox';
import ClubBox from '../../../../Common/ClubBox/ClubBox';
import FieldHeader from '../../../../Common/FieldHeader/FieldHeader';
import { SelectBox } from '../../../../Common/SelectBox/SelectBox';
import { LoaderOverlay, DateDisplay } from '../../../../Common/MinorComponents/MinorComponents';
import LoadedButton from '../../../../Common/LoadedButton/LoadedButton';
import DiscussionDock from '../../../../Common/DiscussionDock/DiscussionDock';
import ApproversList from '../../../../Common/ApproversList/ApproversList';

// css
import "./AdminActivityDetailArea.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";
const ACTIVITY_STATUS_ACTIVE = "A";
const ACTIVITY_STATUS_COMPLETED = "C";
const ACTIVITY_STATUS_PRESIDENT_APPROVED = 'PA';
const ACTIVITY_STATUS_PRESIDENT_REJECTED = 'PR';
const ACTIVITY_STATUS_PANEL_APPROVED = 'LA';
const ACTIVITY_STATUS_PANEL_REJECTED = 'LR';
const ACTIVITY_STATUS_POINTS_CREDITED = 'PC';

class AdminActivityDetailArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentRating: null,
            multiplier: undefined,
            anchorEl: null,
            commentsDockOpen: false,
            claimPeriod: new Date().getTime(),
            customizePointsComment: ""
        };
        this.userId = Util.getLoggedInUserDetails().userId;
    }

    componentWillReceiveProps = (nextProps) => {
        const nextSelectedActivity = nextProps.selectedActivity;
        const selectedActivity = this.props.selectedActivity;

        if (nextSelectedActivity && !selectedActivity) {
            //@DESC: updating values when new activity is loaded

            const currentRating = (nextSelectedActivity && nextSelectedActivity.currentRating) ? nextSelectedActivity.currentRating.code : null;
            const multiplier = nextSelectedActivity.multiplier;
            const claimPeriod = new Date(nextSelectedActivity.submittedClaimPeriod).getTime();
            this.setState({ currentRating, multiplier, claimPeriod, customizePointsComment: "" });
        }
    }

    render = () => {
        const props = this.props;
        const activity = props.selectedActivity;
        const editableActivity = false;
        const { anchorEl } = this.state;

        return (
            <section className="admin-activity-detail">
                <IconButton className="btn-icon btn-show-comment" color="default" title="Comments" onClick={this.handleCommentsDockOpen}>comment</IconButton>
                <IconButton className="btn-extra" color="default" title="More Options" onClick={this.handleExtraMenuOpen}>more_vert</IconButton>
                {activity && this.getDockTemplate(activity, editableActivity)}
                {(activity) && this.getActionsTemplate(activity, editableActivity)}
                <LoaderOverlay show={props.loading} />
                <DiscussionDock
                    open={this.state.commentsDockOpen}
                    discussion={props.discussionList}
                    onSubmit={this.handleDiscussionSubmit}
                    onClose={this.handleCommentsDockClose}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onRequestClose={this.handleExtraMenuClose}
                >
                    <MenuItem onClick={this.handleCommentsDockOpen}>Comments</MenuItem>
                    <MenuItem onClick={this.handleDockClose}>Close</MenuItem>
                </Menu>
            </section>
        );
    }

    getDockTemplate = (activity, editableActivity) => {
        const state = this.state;
        const showApprovers = activity.status !== ACTIVITY_STATUS_ACTIVE && activity.status !== ACTIVITY_STATUS_COMPLETED && activity.status !== ACTIVITY_STATUS_PRESIDENT_REJECTED;

        return (
            <section className="admin-activity-content">
                <ActivityHeaderInfo {...activity}
                    onKpiDetailsOpen={this.props.onKpiDetailsOpen}
                />
                {showApprovers && <ApproversList approverList={activity.approveInfo} />}
                {this.getDisplayTemplate(activity)}
                <FieldHeader title="Field &amp; Headers" />
                <div className="customizepoints-wrapper viewing">
                    <div className="memberbox-list-wrapper">
                        {this.getMemberBoxTemplate(activity)}
                    </div>
                    <div className="clubbox-list-wrapper">
                        {this.getClubBoxTemplate(activity)}
                    </div>
                </div>
            </section>
        );
    }

    getDisplayTemplate = (activity) => {
        const displayStarRating = (activity.ratingType === RATING_TYPE_STAR);
        const displayCategory = (activity.ratingType === RATING_TYPE_CATEGORY);
        const currentUser = activity.pointMatrix.assignees.find(item => {
            return (this.userId === item.userId);
        });
        const attachmentFiles = currentUser ? currentUser.attachments : [];

        return (
            <div className="admin-activity-display">
                <FieldHeader title="Assessments" />
                <table className="table-display">
                    <tbody>
                        <tr>
                            <td colSpan="2">
                                {
                                    (displayStarRating) && <div>
                                        <span className="label">Rating</span>
                                        <StarRate
                                            editable={false}
                                            value={this.state.currentRating}
                                            categories={activity.kpi.ratings}
                                            onSelect={this.handleStarRateSelect}
                                        />
                                    </div>
                                }
                                {
                                    displayCategory && <dl className="final-values">
                                        <dd className="tite">{activity.kpi.starRatingLabel}</dd>
                                        <dt className="description">{activity.currentRating.label}</dt>
                                    </dl>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <dl className="final-values">
                                    <dd className="tite">Claim Period</dd>
                                    <dt className="description">{activity.calculatedClaimPeriod}</dt>
                                </dl>
                            </td>
                            <td>
                                {
                                    activity.kpi.hasMultiplier && <dl className="final-values">
                                        <dd className="tite">Multiplier</dd>
                                        <dt className="description">{activity.multiplier}</dt>
                                    </dl>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <FieldHeader title="Attachments" />
                <AttachmentInput
                    editable={false}
                    attachments={attachmentFiles}
                    onAddAttachment={this.handleAttachmentUpload}
                    onDeleteAttachment={this.handleAttachmentDelete}
                />
            </div>
        );
    }

    getActionsTemplate = (activity, editableActivity) => {

        return (
            <div className="submit-wrapper">
            </div>
        );
    }

    handleDockClose = () => {
        this.setState({ anchorEl: false, commentsDockOpen: false });
        this.props.onClose();
    }

    handleCommentsDockOpen = () => {
        this.setState({ anchorEl: false, commentsDockOpen: true });
    }

    handleCommentsDockClose = () => {
        this.setState({ commentsDockOpen: false });
    }

    handleDiscussionSubmit = (value) => {
        const discussionObj = {
            commentId: this.props.selectedActivity.discussionId,
            value
        };

        this.props.onDiscussionSubmit(discussionObj);
    }

    handleExtraMenuOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleExtraMenuClose = () => {
        this.setState({ anchorEl: null });
    }

    getMemberBoxTemplate = (activity) => {
        const props = this.props;

        let template = activity.pointMatrix.assignees.map(member => {
            const clubName = member.clubName ? member.clubName.toUpperCase() : "";

            return (
                <MemberBox
                    key={member.id}
                    id={member.id}
                    title={member.name}
                    subTitle={clubName}
                    avatar={member.avatar}
                    status={member.status}
                    points={member.changedPoints}
                    attachments={member.attachments}
                    defaultPoints={member.defaultPoints}
                    onAttachmentDownload={props.onAttachmentDownload}
                />
            );
        });

        return template;
    }

    getClubBoxTemplate = (activity) => {
        let template = activity.pointMatrix.clubs.map(club => {
            return (
                <ClubBox
                    key={club.id}
                    id={club.id}
                    title={club.name || ""}
                    avatar={club.avatar}
                    points={club.changedPoints}
                    defaultPoints={club.defaultPoints}
                />
            );
        });

        return template;
    }

    getMemberBoxMenuTemplate = (member) => {
        const menuTemplate = (
            <div>
                <MenuItem onClick={this.handleMemberDelete.bind(this, member)}>Delete</MenuItem>
            </div>
        );

        return menuTemplate;
    }

    getClubBoxMenuTemplate = (club) => {
        const menuTemplate = (
            <div>
                <MenuItem onClick={this.handleMemberDelete.bind(this, club)}>action</MenuItem>
            </div>
        );

        return menuTemplate;
    }
}

AdminActivityDetailArea.defaultProps = {
    discussionList: []
};

AdminActivityDetailArea.propTypes = {
    selectedActivity: PropTypes.object,
    discussionList: PropTypes.array,
    onAttachmentDownload: PropTypes.func,
    onKpiDetailsOpen: PropTypes.func,
    onDiscussionSubmit: PropTypes.func,
    onClose: PropTypes.func
};

export default AdminActivityDetailArea;