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
import "./MemberActivityDetailArea.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";
const ACTIVITY_STATUS_ACTIVE = "A";

class MemberActivityDetailArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentRating: null,
            multiplier: undefined,
            anchorEl: null,
            commentsDockOpen: false,
            claimPeriod: new Date().getTime()
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
        this.handleCompleteActivity = this.handleCompleteActivity.bind(this);
        this.handleDraftActivity = this.handleDraftActivity.bind(this);
        this.handleDeleteActivity = this.handleDeleteActivity.bind(this);
        this.handleDiscussionSubmit = this.handleDiscussionSubmit.bind(this);
        this.handleDockClose = this.handleDockClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextSelectedActivity = nextProps.selectedActivity;
        const selectedActivity = this.props.selectedActivity;

        if (nextSelectedActivity && !selectedActivity) {
            //@DESC: updating values when new activity is loaded

            const currentRating = (nextSelectedActivity && nextSelectedActivity.currentRating) ? nextSelectedActivity.currentRating.code : null;
            const multiplier = nextSelectedActivity.multiplier;
            const claimPeriod = new Date(nextSelectedActivity.submittedClaimPeriod).getTime();
            this.setState({ currentRating, multiplier, claimPeriod });
        }
    }

    render() {
        const props = this.props;
        const activity = props.selectedActivity;
        const editableActivity = (activity && activity.status === ACTIVITY_STATUS_ACTIVE);
        const { anchorEl } = this.state;
        const currentUser = activity ? activity.pointMatrix.assignees.find(item => {
            return (this.userId === item.userId);
        }) : null;
        const isStatusActive = currentUser ? currentUser.status === ACTIVITY_STATUS_ACTIVE : false;
        const activityMessage = isStatusActive ? "Please complete the task in order to submit activity" : " ";

        return (
            <section className="member-activity-detail">
                <div className="action-wrapper">
                    <IconButton className="btn-icon btn-show-comment" color="default" title="Comments" onClick={this.handleCommentsDockOpen}>comment</IconButton>
                    <IconButton className="btn-extra" color="default" title="More Options" onClick={this.handleExtraMenuOpen}>more_vert</IconButton>
                </div>
                <div className={`activity-message ${isStatusActive ? "show" : "empty"}`}>{activityMessage}</div>
                {activity && this.getDockTemplate(activity, editableActivity, currentUser)}
                {(activity && editableActivity) && this.getActionsTemplate(activity, currentUser)}
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
            </section >
        );
    }

    getDockTemplate(activity, editableActivity, currentUser) {

        return (
            <section className="member-activity-content">
                <ActivityHeaderInfo {...activity}
                    onKpiDetailsOpen={this.props.onKpiDetailsOpen}
                />
                {editableActivity ? this.getFormTemplate(activity, currentUser) : this.getDisplayTemplate(activity, currentUser)}
                <FieldHeader title="Member Points" />
                <div className="memberbox-list-wrapper">
                    {this.getMemberBoxTemplate(activity)}
                </div>
                <FieldHeader title="Club Points" />
                <div className="clubbox-list-wrapper">
                    {this.getClubBoxTemplate(activity)}
                </div>
            </section>
        );
    }

    getFormTemplate(activity, currentUser) {
        const displayStarRating = (activity.ratingType === RATING_TYPE_STAR);
        const displayCategory = (activity.ratingType === RATING_TYPE_CATEGORY);
        const categoryList = displayCategory ? activity.kpi.ratings.map(item => ({ title: item.label, value: item.code })) : [];

        return (
            <div className="member-activity-form">
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
                            (displayCategory && categoryList.length) && <SelectBox
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
                                value={this.state.multiplier}
                                onChange={this.handleMultiplierChange}
                            />
                        }
                    </div>
                </div>
                <FieldHeader title="Attachments" />
                <AttachmentInput
                    editable={true}
                    attachments={currentUser.attachments}
                    onAddAttachment={this.handleAttachmentUpload}
                    onDeleteAttachment={this.handleAttachmentDelete}
                />

            </div>
        );
    }

    getDisplayTemplate(activity, currentUser) {
        const displayStarRating = (activity.ratingType === RATING_TYPE_STAR);
        const displayCategory = (activity.ratingType === RATING_TYPE_CATEGORY);

        return (
            <div className="member-activity-display">
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
                            {
                                activity.kpi.hasMultiplier && <td>
                                    <dl className="final-values">
                                        <dd className="tite">Multiplier</dd>
                                        <dt className="description">{activity.multiplier}</dt>
                                    </dl>
                                </td>
                            }
                        </tr>
                    </tbody>
                </table>
                <FieldHeader title="Attachments" />
                <AttachmentInput
                    editable={false}
                    attachments={currentUser.attachments}
                    onAddAttachment={this.handleAttachmentUpload}
                    onDeleteAttachment={this.handleAttachmentDelete}
                />
            </div>
        );
    }

    getActionsTemplate(activity, currentUser) {
        const loading = this.props.loading;
        const isStatusActive = currentUser.status === ACTIVITY_STATUS_ACTIVE;
        return (
            <div className="submit-wrapper">
                {
                    isStatusActive && <LoadedButton title="Complete" className="btn-primary btn-submit" color="primary" onClick={this.handleCompleteActivity} loading={loading}>Complete</LoadedButton>
                }
                {
                    isStatusActive && <LoadedButton title="Draft" className="btn-default btn-draft" color="default" onClick={this.handleDraftActivity} loading={loading}>Save Draft</LoadedButton>
                }
                <LoadedButton title="Delete" className="btn-complimentary btn-bordered btn-delete" color="default" onClick={this.handleDeleteActivity} loading={loading}><Icon>delete</Icon> Delete</LoadedButton>
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
        const point = args[1];
        this.props.onClubPointChange(member, point);
    }

    handleCompleteActivity() {
        let { currentRating, multiplier, claimPeriod } = this.state;
        let activity = { ...this.state.selectedActivity };

        currentRating = currentRating || activity.currentRating.code;
        multiplier = multiplier || activity.multiplier;
        claimPeriod = claimPeriod || activity.claimPeriod;
        const newdate = moment(claimPeriod).startOf("month").add(2, "days").valueOf();

        activity = { ...this.props.selectedActivity, ...this.state.selectedActivity, currentRating, multiplier, claimPeriod };

        this.props.onActivityComplete(activity);
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
            categoryCode: currentRating,
            multiplier
        };
        this.props.onActivityDraft(activity.id, draftData);
    }

    handleDeleteActivity() {
        this.props.onActivityDelete(this.props.selectedActivity);
    }

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
                    points={member.calculatedPoints}
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
                    points={club.calculatedPoints}
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

MemberActivityDetailArea.defaultProps = {
    discussionList: []
};

MemberActivityDetailArea.propTypes = {
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
    onKpiDetailsOpen: PropTypes.func,
    onActivityComplete: PropTypes.func,
    onActivityDraft: PropTypes.func,
    onActivityDelete: PropTypes.func,
    onDiscussionLoad: PropTypes.func,
    onDiscussionSubmit: PropTypes.func
};

export default MemberActivityDetailArea;