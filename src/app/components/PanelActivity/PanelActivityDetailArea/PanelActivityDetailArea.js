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
import { Util } from "../../../Util/util";
import { riverToast } from '../../Common/Toast/Toast';
import ActivityHeaderInfo from '../../Common/ActivityHeaderInfo/ActivityHeaderInfo';
import StarRate from '../../Common/StarRate/StarRate';
import AttachmentInput from '../../Common/AttachmentInput/AttachmentInput';
import MemberBox from '../../Common/MemberBox/MemberBox';
import ClubBox from '../../Common/ClubBox/ClubBox';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import { SelectBox } from '../../Common/SelectBox/SelectBox';
import ClaimPeriodInput from '../../Common/ClaimPeriodInput/ClaimPeriodInput';
import { LoaderOverlay, DateDisplay } from '../../Common/MinorComponents/MinorComponents';
import LoadedButton from '../../Common/LoadedButton/LoadedButton';
import DiscussionDock from '../../Common/DiscussionDock/DiscussionDock';
import ApproversList from '../../Common/ApproversList/ApproversList';

// css
import "./PanelActivityDetailArea.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";
const ACTIVITY_STATUS_ACTIVE = "A";
const ACTIVITY_STATUS_COMPLETED = "C";
const ACTIVITY_STATUS_PRESIDENT_APPROVED = 'PA';
const ACTIVITY_STATUS_PRESIDENT_REJECTED = 'PR';
const ACTIVITY_STATUS_PANEL_APPROVED = 'LA';
const ACTIVITY_STATUS_PANEL_REJECTED = 'LR';
const ACTIVITY_STATUS_POINTS_CREDITED = 'PC';
const ACTION_REJECTED = "ACTION_REJECTED";
const ACTION_APPROVED = "ACTION_APPROVED";
const ACTION_UNAPPROVED = "ACTION_UNAPPROVED";

class PanelActivityDetailArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentRating: null,
            multiplier: undefined,
            anchorEl: null,
            commentsDockOpen: false,
            claimPeriod: new Date().getTime(),
            isPointEditing: false,
            customizePointsComment: ""
        };
        this.userId = Util.getLoggedInUserDetails().userId;

        this.handleCommentsDockOpen = this.handleCommentsDockOpen.bind(this);
        this.handleCommentsDockClose = this.handleCommentsDockClose.bind(this);
        this.handleExtraMenuOpen = this.handleExtraMenuOpen.bind(this);
        this.handleExtraMenuClose = this.handleExtraMenuClose.bind(this);
        this.handleStarRateSelect = this.handleStarRateSelect.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleMultiplierChange = this.handleMultiplierChange.bind(this);
        this.handleClaimPeriodChange = this.handleClaimPeriodChange.bind(this);
        this.handleAttachmentUpload = this.handleAttachmentUpload.bind(this);
        this.handleAttachmentDelete = this.handleAttachmentDelete.bind(this);
        this.handleApproveActivity = this.handleApproveActivity.bind(this);
        this.handleDraftActivity = this.handleDraftActivity.bind(this);
        this.handleDeleteActivity = this.handleDeleteActivity.bind(this);
        this.handleDiscussionSubmit = this.handleDiscussionSubmit.bind(this);
        this.handleDockClose = this.handleDockClose.bind(this);
        this.handleRejectActivity = this.handleRejectActivity.bind(this);
        this.handleCustomPointsChange = this.handleCustomPointsChange.bind(this);
        this.handleOpenPointCustomization = this.handleOpenPointCustomization.bind(this);
        this.handleSavePointCustomization = this.handleSavePointCustomization.bind(this);
        this.handleResetPointCustomization = this.handleResetPointCustomization.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextSelectedActivity = nextProps.selectedActivity;
        const selectedActivity = this.props.selectedActivity;

        if (nextSelectedActivity && !selectedActivity) {
            //@DESC: updating values when new activity is loaded

            const currentRating = (nextSelectedActivity && nextSelectedActivity.currentRating) ? nextSelectedActivity.currentRating.code : null;
            const multiplier = nextSelectedActivity.multiplier;
            const claimPeriod = new Date(nextSelectedActivity.submittedClaimPeriod).getTime();
            this.setState({ currentRating, multiplier, claimPeriod, isPointEditing: false, customizePointsComment: "" });
        }
    }

    render() {
        const props = this.props;
        const activity = props.selectedActivity;
        const editableActivity = (activity && activity.status === ACTIVITY_STATUS_PRESIDENT_APPROVED);
        const { anchorEl } = this.state;

        const headsupMessage = this.getHeadsupMessage(activity);

        return (
            <section className="panel-activity-detail">
                <IconButton className="btn-icon btn-show-comment" color="default" title="Comments" onClick={this.handleCommentsDockOpen}>comment</IconButton>
                <IconButton className="btn-extra" color="default" title="More Options" onClick={this.handleExtraMenuOpen}>more_vert</IconButton>
                <div className={`activity-message ${headsupMessage.className}`}>{headsupMessage.message}</div>
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

    getHeadsupMessage = (activity) => {
        const activityStatus = this.getUserActionStatus(activity);
        const headsupMessage = this.getActivityMessage(activityStatus);
        return headsupMessage;
    }

    getUserActionStatus = (activity) => {
        let action;
        if (!activity) {
            return action;
        }
        const actionStatus = activity.approveInfo.find(item => item.id === this.userId);
        if (actionStatus.rejected) {
            action = ACTION_REJECTED;
        }
        else if (actionStatus.approved) {
            action = ACTION_APPROVED;
        }
        else {
            action = ACTION_UNAPPROVED;
        }

        return action;
    };

    getActivityMessage = (status) => {
        let message = "";
        let className = "";
        switch (status) {
            case ACTION_APPROVED:
                message = "You have approved this activity";
                className = "primary";
                break;
            case ACTION_REJECTED:
                message = "You have rejected this activity";
                className = "secondary";
                break;

            default:
                break;
        }

        return { message, className };
    }

    getDockTemplate(activity, editableActivity) {
        const state = this.state;
        const editableClass = state.isPointEditing ? "editing" : "viewing";
        const actionStatus = activity.approveInfo.find(item => item.id === this.userId);
        const actionsPending = !actionStatus.approved && !actionStatus.rejected;
        const showApprovers = activity.status !== ACTIVITY_STATUS_ACTIVE && activity.status !== ACTIVITY_STATUS_COMPLETED && activity.status !== ACTIVITY_STATUS_PRESIDENT_REJECTED;

        return (
            <section className="panel-activity-content">
                <ActivityHeaderInfo {...activity}
                    onKpiDetailsOpen={this.props.onKpiDetailsOpen}
                />
                {showApprovers && <ApproversList approverList={activity.approveInfo} />}
                {(editableActivity && actionsPending) ? this.getFormTemplate(activity) : this.getDisplayTemplate(activity)}
                <div className={`customizepoints-wrapper ${editableClass}`}>
                    <FieldHeader title="Member Points" />
                    <div className="memberbox-list-wrapper">
                        {this.getMemberBoxTemplate(activity)}
                    </div>
                    <FieldHeader title="Club Points" />
                    <div className="clubbox-list-wrapper">
                        {this.getClubBoxTemplate(activity)}
                    </div>
                    <div className="customizepoints-input-wrapper">
                        {
                            state.isPointEditing && <TextField
                                multiline
                                fullWidth
                                rows={4}
                                label="Customisation Description"
                                margin="normal"
                                className="input-field"
                                value={state.customizePointsComment}
                                onChange={this.handleCustomPointsChange}
                            />
                        }
                        {
                            (editableActivity && actionsPending) && <div className="submit-wrapper">
                                {
                                    (!state.isPointEditing && editableActivity) && <Button className="btn-default" color="default" onClick={this.handleOpenPointCustomization}>Edit Points</Button>
                                }
                                {
                                    (state.isPointEditing && editableActivity) && <Button className="btn-primary" color="primary" onClick={this.handleSavePointCustomization}>Confirm</Button>
                                }
                                {
                                    (state.isPointEditing && editableActivity) && <Button className="btn-bordered" color="default" onClick={this.handleResetPointCustomization}>Reset</Button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </section>
        );
    }

    getFormTemplate(activity) {
        const displayStarRating = (activity.ratingType === RATING_TYPE_STAR);
        const displayCategory = (activity.ratingType === RATING_TYPE_CATEGORY);
        const categoryList = displayCategory ? activity.kpi.ratings.map(item => ({ title: item.label, value: item.code })) : [];
        const currentUser = activity.pointMatrix.assignees.find(item => {
            return (this.userId === item.userId);
        });
        const attachmentFiles = currentUser ? currentUser.attachments : [];

        return (
            <div className="panel-activity-form">
                <FieldHeader title="Assessments" />
                <div className="row">
                    <div className="col-md-12 col-star-rate">
                        {
                            (displayStarRating) && <div>
                                <span className="label">Rating</span>
                                <StarRate
                                    editable={true}
                                    value={this.state.currentRating}
                                    categories={activity.kpi.ratings}
                                    onSelect={this.handleStarRateSelect}
                                />
                            </div>
                        }
                        {
                            displayCategory && <SelectBox
                                id="input-categorylist"
                                label={activity.kpi.starRatingLabel}
                                selectedValue={this.state.currentRating}
                                selectArray={categoryList}
                                onSelect={this.handleCategoryChange}
                            />
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ClaimPeriodInput
                            onChange={this.handleClaimPeriodChange}
                            value={this.state.claimPeriod}
                        />
                    </div>
                    <div className="col-md-6">
                        {
                            activity.kpi.hasMultiplier && <TextField
                                id="input-multiplier"
                                label="Multiplier"
                                margin="normal"
                                className="input-field"
                                type="number"
                                min={1}
                                step={1}
                                value={this.state.multiplier}
                                onChange={this.handleMultiplierChange}
                            />
                        }
                    </div>
                </div>
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

    getDisplayTemplate(activity) {
        const displayStarRating = (activity.ratingType === RATING_TYPE_STAR);
        const displayCategory = (activity.ratingType === RATING_TYPE_CATEGORY);
        const currentUser = activity.pointMatrix.assignees.find(item => {
            return (this.userId === item.userId);
        });
        const attachmentFiles = currentUser ? currentUser.attachments : [];

        return (
            <div className="panel-activity-display">
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

    getActionsTemplate(activity, editableActivity) {
        const loading = this.props.loading;
        const deletable = activity.deletable;
        const actionStatus = activity.approveInfo.find(item => item.id === this.userId);

        return (
            <div className="submit-wrapper">
                {
                    (editableActivity && !actionStatus.approved) && <LoadedButton title="Approve" className="btn-primary btn-submit" color="primary" onClick={this.handleApproveActivity} loading={loading}>Approve</LoadedButton>
                }
                {
                    (editableActivity && !actionStatus.approved) && <LoadedButton title="Reassign" className="btn-default btn-submit" color="default" onClick={this.handleResubmitActivity} loading={loading}>Reassign</LoadedButton>
                }
                {
                    /*editableActivity && <LoadedButton title="Draft" className="btn-default btn-draft" color="default" onClick={this.handleDraftActivity} loading={loading}>Save Draft</LoadedButton>*/
                }
                {
                    (editableActivity && !actionStatus.rejected && !actionStatus.approved) && <LoadedButton title="Reject" className="btn-complimentary btn-reject" color="default" onClick={this.handleRejectActivity} loading={loading}>Reject</LoadedButton>
                }
                {
                    deletable && <LoadedButton title="Delete" className="btn-complimentary btn-bordered btn-delete" color="default" onClick={this.handleDeleteActivity} loading={loading}><Icon>delete</Icon> Delete</LoadedButton>
                }
            </div>
        );
    }

    handleDockClose() {
        this.setState({ anchorEl: false, commentsDockOpen: false });
        this.props.onClose();
    }

    handleCommentsDockOpen() {
        this.setState({ anchorEl: false, commentsDockOpen: true });
        this.props.onDiscussionLoad(this.props.selectedActivity.discussionId);
    }

    handleCommentsDockClose() {
        this.setState({ commentsDockOpen: false });
    }

    handleDiscussionSubmit(value) {
        const discussionObj = {
            commentId: this.props.selectedActivity.discussionId,
            value
        };

        this.props.onDiscussionSubmit(discussionObj);
    }

    handleExtraMenuOpen(event) {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleExtraMenuClose() {
        this.setState({ anchorEl: null });
    }

    handleStarRateSelect(selectedStar) {
        const activity = this.props.selectedActivity;
        const currentRating = selectedStar.code;
        this.setState({ currentRating });

        this.props.onStarRateChange(activity.id, currentRating, this.state.multiplier);
    }

    handleCategoryChange(categoryId) {
        const activity = this.props.selectedActivity;
        this.setState({ currentRating: categoryId });

        this.props.onCategoryChange(activity.id, categoryId, this.state.multiplier);
    }

    handleMultiplierChange(event) {
        const multiplier = event.target.value < 1 ? 1 : event.target.value;
        const activity = this.props.selectedActivity;
        const ratingType = activity.ratingType;
        const ratingCode = this.state.currentRating;
        this.setState({ multiplier });

        this.props.onMultiplierChange(activity.id, ratingType, ratingCode, multiplier);
    }

    handleClaimPeriodChange(claimDate) {
        const claimPeriod = Math.round((new Date(claimDate)).getTime());
        this.setState({ claimPeriod });
    }

    handleAttachmentUpload(file) {
        const activity = { ...this.props.selectedActivity };
        this.props.onAttachmentUpload(activity.id, [file]);
    }

    handleAttachmentDelete(file) {
        const activity = { ...this.props.selectedActivity };
        this.props.onAttachmentDelete(activity.id, file);
    }

    handleMemberDelete(member) {
        this.props.onMemberDelete(member);
    }

    handleMemberPointChange(...args) {
        const member = args[0].userId;
        const point = isNaN(args[1]) ? 0 : args[1];
        this.props.onMemberPointChange(member, point);
    }

    handleClubPointChange(...args) {
        const member = args[0].id;
        const point = isNaN(args[1]) ? 0 : args[1];
        this.props.onClubPointChange(member, point);
    }

    handleApproveActivity() {
        if (this.state.isPointEditing) {
            riverToast.show("Please finish customizing points");
            return;
        }

        let { currentRating, multiplier, claimPeriod } = this.state;
        let activity = { ...this.state.selectedActivity };

        currentRating = currentRating || activity.currentRating.code;
        multiplier = multiplier || activity.multiplier;
        claimPeriod = claimPeriod || activity.claimPeriod;
        const newdate = moment(claimPeriod).startOf("month").add(2, "days").valueOf();

        activity = { ...this.props.selectedActivity, ...this.state.selectedActivity, currentRating, multiplier, claimPeriod };

        this.props.onActivityApprove(activity, this.state.customizePointsComment);
    }

    handleDraftActivity() {
        let { currentRating, multiplier, claimPeriod } = this.state;
        const activity = { ...this.props.selectedActivity };

        currentRating = currentRating || activity.currentRating.code;
        multiplier = multiplier || activity.multiplier;
        claimPeriod = claimPeriod || activity.claimPeriod;
        const newdate = moment(claimPeriod).startOf("month").add(2, "days").valueOf();

        let draftData = {
            title: activity.title,
            description: activity.description,
            claimPeriod: newdate,
            categoryCode: currentRating
        };
        this.props.onActivityDraft(activity.id, draftData);
    }

    handleDeleteActivity() {
        this.props.onActivityDelete(this.props.selectedActivity);
    }

    handleRejectActivity() {
        this.props.onReject(this.props.selectedActivity);
    }

    handleOpenPointCustomization() {
        this.setState({ isPointEditing: true });
    }

    handleSavePointCustomization() {
        if (!this.state.customizePointsComment.trim()) {
            riverToast.show("Please enter a justification for customizing the points.");
            return;
        }
        this.setState({ isPointEditing: false });
    }

    handleResetPointCustomization() {
        this.setState({ isPointEditing: false, customizePointsComment: "" });
        this.props.onPointReset();
    }

    handleCustomPointsChange(event) {
        this.setState({ customizePointsComment: event.target.value });
    }

    handleResubmitActivity = () => {
        if (this.state.isPointEditing) {
            riverToast.show("Please finish customizing points");
            return;
        }
        const activity = this.props.selectedActivity;
        this.props.onResubmit(activity);
    };

    getMemberBoxTemplate(activity) {
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
                    //menuItem={this.getMemberBoxMenuTemplate(member)}
                    pointEditable={this.state.isPointEditing}
                    points={member.changedPoints}
                    attachments={member.attachments}
                    defaultPoints={member.defaultPoints}
                    onPointChange={this.handleMemberPointChange.bind(this, member)}
                    onAttachmentDownload={props.onAttachmentDownload}
                />
            );
        });

        return template;
    }

    getClubBoxTemplate(activity) {
        let template = activity.pointMatrix.clubs.map(club => {
            return (
                <ClubBox
                    key={club.id}
                    id={club.id}
                    title={club.name || ""}
                    avatar={club.avatar}
                    //menuItem={this.getClubBoxMenuTemplate(club)}
                    pointEditable={this.state.isPointEditing}
                    points={club.changedPoints}
                    defaultPoints={club.defaultPoints}
                    onPointChange={this.handleClubPointChange.bind(this, club)}
                />
            );
        });

        return template;
    }

    getMemberBoxMenuTemplate(member) {
        const menuTemplate = (
            <div>
                <MenuItem onClick={this.handleMemberDelete.bind(this, member)}>Delete</MenuItem>
            </div>
        );

        return menuTemplate;
    }

    getClubBoxMenuTemplate(club) {
        const menuTemplate = (
            <div>
                <MenuItem onClick={this.handleMemberDelete.bind(this, club)}>action</MenuItem>
            </div>
        );

        return menuTemplate;
    }
}

PanelActivityDetailArea.defaultProps = {
    discussionList: []
};

PanelActivityDetailArea.propTypes = {
    selectedActivity: PropTypes.object,
    discussionList: PropTypes.array,
    onStarRateChange: PropTypes.func,
    onCategoryChange: PropTypes.func,
    onMultiplierChange: PropTypes.func,
    onAttachmentUpload: PropTypes.func,
    onAttachmentDelete: PropTypes.func,
    onAttachmentDownload: PropTypes.func,
    onMemberDelete: PropTypes.func,
    onMemberPointChange: PropTypes.func,
    onClubPointChange: PropTypes.func,
    onPointReset: PropTypes.func,
    onKpiDetailsOpen: PropTypes.func,
    onActivityApprove: PropTypes.func,
    onActivityDraft: PropTypes.func,
    onReject: PropTypes.func,
    onResubmit: PropTypes.func,
    onActivityDelete: PropTypes.func,
    onDiscussionLoad: PropTypes.func,
    onDiscussionSubmit: PropTypes.func
};

export default PanelActivityDetailArea;