import React, { Component } from 'react';
import { connect } from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import moment from 'moment';

// root component
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { CommonService } from '../Layout/Common.service';
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { riverToast } from '../Common/Toast/Toast';
import { ListDock, ListDockListing, ListDockDetail } from '../Common/ListDock/ListDock';
import GroupedList from '../Common/GroupedList/GroupedList';
import PresidentActivityDetailArea from './PresidentActivityDetailArea/PresidentActivityDetailArea';
import { SelectBox } from '../Common/SelectBox/SelectBox';
import CreateActivityDialog from '../Common/CreateActivityDialog/CreateActivityDialog';
import PresidentActivityCompletePrompt from './PresidentActivityCompletePrompt/PresidentActivityCompletePrompt';
import PromptDialog from '../Common/PromptDialog/PromptDialog';
import CommentPrompt from '../Common/CommentPrompt/CommentPrompt';
import SearchBar from '../Common/SearchBar/SearchBar';
import KpiDialog from '../Kpi/KpiDialog/KpiDialog';
import KpiDetailsDialog from '../Kpi/KpiDetailsDialog/KpiDetailsDialog';
import Pagination from "../Common/Pagination/Pagination";

import PresidentActivityService from './PresidentActivity.service';

//redux actions
import { assignedActivityChange, selectedActivityChange, selectedActivityReset, pointMatrixChange, memberPointChange, clubPointChange, pointReset, clubMemberListChange, kpiListChange, selectedKpiChange, clearSelectedKpiDetails, storeDiscussion } from './PresidentActivity.actions';

// css
import "./PresidentActivity.scss";

const ROLE_PRESIDENT = 'PR';
const ROLE_PANEL = 'PA';
const ROLE_USER = 'US';
const ROLE_ADMIN = 'AD';
const ROLE_AUDITOR = 'AU';

const GROUPBY_STATUS = 'ST';
const GROUPBY_KPI = 'LI';

const FILTERBY_ALL = 'ALL';
const FILTERBY_Assigned = 'A';
const FILTERBY_Completed = 'C';
const FILTERBY_PRESIDENT_APPROVED = 'PA';
const FILTERBY_PRESIDENT_REJECTED = 'PR';
const FILTERBY_PANEL_APPROVED = 'LA';
const FILTERBY_PANEL_REJECTED = 'LR';
const FILTERBY_POINTS_CREDITED = 'PC';

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";

const PAGE_COUNT = 20;

const mapStateToProps = (state) => {
    return {
        presidentActivity: state.PresidentActivityReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        assignedActivityChange: (assignedActivities) => {
            dispatch(assignedActivityChange(assignedActivities))
        },
        selectedActivityChange: (selectedActivityDetails) => {
            dispatch(selectedActivityChange(selectedActivityDetails))
        },
        selectedActivityReset: (selectedActivityDetails) => {
            dispatch(selectedActivityReset(selectedActivityDetails))
        },
        pointMatrixChange: (pointMatrix) => {
            dispatch(pointMatrixChange(pointMatrix))
        },
        memberPointChange: (pointMatrix) => {
            dispatch(memberPointChange(pointMatrix))
        },
        clubPointChange: (pointMatrix) => {
            dispatch(clubPointChange(pointMatrix))
        },
        pointReset: () => {
            dispatch(pointReset())
        },
        clubMemberListChange: (memberList) => {
            dispatch(clubMemberListChange(memberList))
        },
        kpiListChange: (kpiList) => {
            dispatch(kpiListChange(kpiList))
        },
        selectedKpiChange: (kpiDetails) => {
            dispatch(selectedKpiChange(kpiDetails))
        },
        clearSelectedKpiDetails: () => {
            dispatch(clearSelectedKpiDetails())
        },
        storeDiscussion: (discussionList) => {
            dispatch(storeDiscussion(discussionList))
        }
    };
};

class PresidentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            listLoading: false,
            search: "",
            groupBy: GROUPBY_STATUS,
            filterBy: FILTERBY_ALL,
            page: 0,
            pageForwardEnabled: true,
            isActivityDetailDockOpen: false,
            promptOpen: false,
            promptConfig: null,
            createDialogOpen: false,
            completeDialogOpen: false,
            comment: "",
            kpiMasterDialogOpen: false,
            kpiDetailsDialogOpen: false,
            commentPromptOpen: false,
            commentPromptConfig: null
        };
        this.userRole = ROLE_PRESIDENT;
        this.filterList = this.getFilterList();
        this.groupList = this.getGroupList();
        this.currentUser = Util.getLoggedInUserDetails();

        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.handleSearchTextSubmit = this.handleSearchTextSubmit.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleStarRateChange = this.handleStarRateChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleMultiplierChange = this.handleMultiplierChange.bind(this);
        this.handleAttachmentUpload = this.handleAttachmentUpload.bind(this);
        this.handleAttachmentDelete = this.handleAttachmentDelete.bind(this);
        this.handleAttachmentDownload = this.handleAttachmentDownload.bind(this);
        this.handleMemberDelete = this.handleMemberDelete.bind(this);
        this.handleMemberPointChange = this.handleMemberPointChange.bind(this);
        this.handleClubPointChange = this.handleClubPointChange.bind(this);
        this.handleActivityApprove = this.handleActivityApprove.bind(this);
        this.handleActivityDraft = this.handleActivityDraft.bind(this);
        this.handleActivityDelete = this.handleActivityDelete.bind(this);
        this.cancelPromptOperation = this.cancelPromptOperation.bind(this);
        this.handleActivitySubmit = this.handleActivitySubmit.bind(this);
        this.handleCancelCompletion = this.handleCancelCompletion.bind(this);
        this.handleActivityCreateDialogOpen = this.handleActivityCreateDialogOpen.bind(this);
        this.handleActivityCreate = this.handleActivityCreate.bind(this);
        this.handleCancelCreate = this.handleCancelCreate.bind(this);
        this.handleSelectKpi = this.handleSelectKpi.bind(this);
        this.handleKpiMasterDialogOpen = this.handleKpiMasterDialogOpen.bind(this);
        this.handleKpiMasterDialogClose = this.handleKpiMasterDialogClose.bind(this);
        this.handleDiscussionSubmit = this.handleDiscussionSubmit.bind(this);
        this.handleActivityDetailClose = this.handleActivityDetailClose.bind(this);
        this.handleKpiDetailsDialogOpen = this.handleKpiDetailsDialogOpen.bind(this);
        this.handleKpiDetailsDialogClose = this.handleKpiDetailsDialogClose.bind(this);
        this.getKpiList = this.getKpiList.bind(this);
        this.handleActivityForceStop = this.handleActivityForceStop.bind(this);
        this.handleActivityReject = this.handleActivityReject.bind(this);
        this.handleCommentPromptClose = this.handleCommentPromptClose.bind(this);
        this.loadDiscussion = this.loadDiscussion.bind(this);
    }

    componentDidMount() {
        let activityId;
        const params = this.props.match.params;
        if (params && params.activityId) {
            activityId = params.activityId;
        }
        this.init(activityId);
    }

    render() {

        const state = this.state;
        const presidentActivity = this.props.presidentActivity;
        const selectedId = presidentActivity.selectedActivityDetails ? presidentActivity.selectedActivityDetails.id : "";

        return (
            <div className="president-activity-wrapper">
                <div className="president-activity-wrapper">
                    <div className="row filter-area">
                        <div className="col-md-5">
                            <SearchBar
                                placeholder="Search Activity"
                                value={state.search}
                                theme="minimal"
                                onChange={this.handleSearchTextChange}
                                onSubmit={this.handleSearchTextSubmit}
                            />
                        </div>
                        <div className="col-md-2">
                            <SelectBox
                                label="Filter"
                                classes="input-select"
                                selectedValue={state.filterBy}
                                selectArray={this.filterList}
                                onSelect={this.handleFilterChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <SelectBox
                                label="GroupBy"
                                classes="input-select"
                                selectedValue={state.groupBy}
                                selectArray={this.groupList}
                                onSelect={this.handleGroupChange}
                            />
                        </div>
                        <div className="col-md-3 action-wrapper">
                            <Button className="btn-primary" onClick={this.handleActivityCreateDialogOpen}>Create Activity</Button>
                            <Button className="btn-primary btn-icon-plain" title="LineItem List" onClick={this.handleKpiMasterDialogOpen}><Icon>toc</Icon></Button>
                        </div>
                    </div>
                    <Pagination
                        countFromZero={false}
                        page={state.page}
                        pageSize={PAGE_COUNT}
                        forwardEnabled={state.pageForwardEnabled}
                        onPageStart={this.handlePagination}
                        onPageForward={this.handlePagination}
                        onPageBackward={this.handlePagination}
                    />
                    <ListDock
                        open={this.state.isActivityDetailDockOpen}
                        onClose={this.handleActivityDetailClose}
                    >
                        <ListDockListing>
                            <GroupedList
                                loading={this.state.listLoading}
                                categoryItems={presidentActivity.assignedActivities}
                                selectedId={selectedId}
                                groupBy={this.state.groupBy}
                                onSelect={this.handleListItemSelect.bind(this)}
                            />
                        </ListDockListing>
                        <ListDockDetail>
                            <PresidentActivityDetailArea
                                loading={state.loading}
                                selectedActivity={presidentActivity.selectedActivityDetails}
                                discussionList={presidentActivity.discussionList}
                                onStarRateChange={this.handleStarRateChange}
                                onCategoryChange={this.handleCategoryChange}
                                onMultiplierChange={this.handleMultiplierChange}
                                onAttachmentUpload={this.handleAttachmentUpload}
                                onAttachmentDelete={this.handleAttachmentDelete}
                                onAttachmentDownload={this.handleAttachmentDownload}
                                onMemberDelete={this.handleMemberDelete}
                                onMemberPointChange={this.handleMemberPointChange}
                                onClubPointChange={this.handleClubPointChange}
                                onPointReset={this.props.pointReset}
                                onKpiDetailsOpen={this.handleKpiDetailsDialogOpen}
                                onActivityDraft={this.handleActivityDraft}
                                onReject={this.handleActivityReject}
                                onForceStop={this.handleActivityForceStop}
                                onActivityApprove={this.handleActivityApprove}
                                onResubmit={this.handleActivityResubmit}
                                onActivityDelete={this.handleActivityDelete}
                                onDiscussionLoad={this.loadDiscussion}
                                onDiscussionSubmit={this.handleDiscussionSubmit}
                                onClose={this.handleActivityDetailClose}
                            />
                        </ListDockDetail>
                    </ListDock>
                </div>
                <PromptDialog open={this.state.promptOpen} {...this.state.promptConfig} />
                <PresidentActivityCompletePrompt
                    open={this.state.completeDialogOpen}
                    activity={this.state.requestData}
                    onComplete={this.handleActivitySubmit}
                    onCancel={this.handleCancelCompletion}
                />
                <CreateActivityDialog
                    open={this.state.createDialogOpen}
                    loading={this.state.loading}
                    kpiList={presidentActivity.kpiList}
                    kpiDetails={presidentActivity.kpiDetails}
                    memberList={presidentActivity.memberList}
                    onSearchKpi={this.getKpiList}
                    onSelectKpi={this.handleSelectKpi}
                    onCreate={this.handleActivityCreate}
                    onCancel={this.handleCancelCreate}
                />
                <KpiDialog
                    open={state.kpiMasterDialogOpen}
                    onClose={this.handleKpiMasterDialogClose}
                />
                <KpiDetailsDialog
                    open={state.kpiDetailsDialogOpen}
                    loading={state.loading}
                    kpi={presidentActivity.kpiDetails}
                    onClose={this.handleKpiDetailsDialogClose}
                />
                <CommentPrompt
                    open={state.commentPromptOpen}
                    {...state.commentPromptConfig}
                />
                <a style={{ "display": "none" }} id="download-anchor" ref="downloadAnchor">download</a>
            </div>
        );
    }

    init(activityId) {
        this.loadAssignedActivityList();
        this.getKpiList();
        if (activityId) {
            this.loadSelectedActivityDetails(activityId);
        }
    }

    getFilterList() {
        return [
            { title: "ALL", value: 'ALL' },
            { title: "ASSIGNED", value: 'A' },
            { title: "COMPLETED", value: 'C' },
            { title: "PRESIDENT APPROVED", value: 'PA' },
            { title: "PRESIDENT REJECTED", value: 'PR' },
            { title: "PANEL APPROVED", value: 'LA' },
            { title: "PANEL REJECTED", value: 'LR' },
            { title: "POINTS CREDITED", value: 'PC' }
        ];
    }

    getGroupList() {
        return [
            { title: "LINE ITEM", value: "LI" },
            { title: "STATUS", value: "ST" }
        ];
    }

    getDeleteConfirmationTemplate(activity) {
        return (
            <div className="confirm-dialog-wrapper">
                <p>Delete this activity?</p>
                <span><b>RefCode#</b> {activity.id}<br />
                    <b>"{activity.title}"</b>
                </span>
            </div>
        );
    }

    getForceStopConfirmationTemplate(activity) {
        return (
            <div className="confirm-dialog-wrapper">
                <p>Some members haven't completed submitting their activity.<br />
                    Are you sure to force stop this activity?</p>
                <span><b>RefCode#</b> {activity.id}<br />
                    <b>{activity.title}</b>
                </span>
            </div>
        );
    }

    getRejectConfirmationTemplate(activity) {
        return (
            <div className="confirm-dialog-wrapper">
                <p>Are you sure to Reject this activity?</p>
                <span><b>RefCode#</b> {activity.id}<br />
                    <b>{activity.title}</b>
                </span>
            </div>
        );
    }

    getResubmitConfirmationTemplate = (activity) => {
        return (
            <div className="confirm-dialog-wrapper">
                <p>Are you sure to Reassign this activity?</p>
                <span><b>RefCode#</b> {activity.id}<br />
                    <b>{activity.title}</b>
                </span>
            </div>
        );
    };

    getCustomisedPoints(activity) {
        const assigneePoints = activity.pointMatrix.assignees.map(assignee => ({ id: assignee.id, point: assignee.changedPoints }));
        const clubPoints = activity.pointMatrix.clubs.map(club => ({ id: club.id, point: club.changedPoints }));
        const justification = activity.customizePointsComment;
        return { assigneePoints, clubPoints, justification };
    }

    handleSearchTextChange(search) {
        this.setState({ search });
    }

    handleSearchTextSubmit(search) {
        this.setState({ search });
        this.loadAssignedActivityList({ search: search });
    }

    handleFilterChange(filterBy) {
        this.setState({ filterBy });
        this.loadAssignedActivityList({ filterBy });
    }

    handleGroupChange(groupBy) {
        this.setState({ groupBy });
        this.loadAssignedActivityList({ groupBy });
    }

    handlePagination = (pageData) => {
        const { page, count } = pageData;
        this.loadAssignedActivityList({ page, count });
    }

    handleAttachmentUpload(selectedActivityId, fileList) {
        const attachments = { attachments: fileList };
        PresidentActivityService.uploadAttachments(selectedActivityId, attachments)
            .then(attachment => {
                this.loadSelectedActivityDetails(selectedActivityId);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while uploading attachment.');
            });
    }

    handleAttachmentDelete(selectedActivityId, file) {
        PresidentActivityService.deleteAttachment(file.path)
            .then(attachment => {
                this.loadSelectedActivityDetails(selectedActivityId);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while deleting the attachment.');
            });
    }

    handleAttachmentDownload(file) {
        CommonService.downloadFromUrl(file.path)
            .then(blob => {
                const dlnk = this.refs.downloadAnchor;
                const objectUrl = window.URL.createObjectURL(blob);
                dlnk.href = objectUrl;
                dlnk.target = '_blank';
                dlnk.download = file.name;
                dlnk.click();
                window.URL.revokeObjectURL(objectUrl);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while downloading file.');
            });
    }

    handleStarRateChange(selectedActivityId, ratingCode, multiplier) {
        PresidentActivityService.calculateStarPoint(selectedActivityId, ratingCode, multiplier)
            .then(pointMatrix => {
                this.props.pointMatrixChange(pointMatrix);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while calculating rating points.');
            });
    }

    handleCategoryChange(selectedActivityId, categoryCode, multiplier) {
        PresidentActivityService.calculateCategoryPoint(selectedActivityId, categoryCode, multiplier)
            .then(pointMatrix => {
                this.props.pointMatrixChange(pointMatrix);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while calculating category points.');
            });
    }

    handleMultiplierChange(selectedActivityId, ratingType, code, multiplier) {
        if (ratingType === RATING_TYPE_STAR) {
            this.handleStarRateChange(selectedActivityId, code, multiplier);
        }
        else if (ratingType === RATING_TYPE_CATEGORY) {
            this.handleCategoryChange(selectedActivityId, code, multiplier);
        }
    }

    handleListItemSelect(activity) {
        this.props.selectedActivityReset();
        this.setState({ isActivityDetailDockOpen: false });
        this.loadSelectedActivityDetails(activity.id);
    }

    handleMemberPointChange(memberId, points) {
        this.props.memberPointChange([memberId, points]);
    }

    handleMemberDelete(member) {
        console.log("deleting member...", member);
    }

    handleActivityDetailClose() {
        this.setState({ isActivityDetailDockOpen: false });
        this.props.selectedActivityReset();
    }

    handleClubPointChange(memberId, points) {
        this.props.clubPointChange([memberId, points]);
    }

    handleActivityCreateDialogOpen() {
        this.setState({ createDialogOpen: true });
        this.props.kpiListChange([]);
        this.getKpiList();
        this.props.clearSelectedKpiDetails();
    }

    handleActivityCreate(kpiId, createActivityObj) {
        this.setState({ loading: true });
        return PresidentActivityService.createActivity(this.userRole, kpiId, createActivityObj)
            .then(newActivity => {
                this.setState({ loading: false });
                this.loadAssignedActivityList();
                return true;
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while creating the activity.');
                throw (error);
            });
    }

    handleCancelCreate() {
        this.setState({ createDialogOpen: false });
    }

    handleActivityResubmit = (activity) => {
        const promptOpen = true;
        const promptConfig = {
            title: "Confirm Reassign",
            loading: this.state.loading,
            theme: "complimentary",
            children: this.getResubmitConfirmationTemplate(activity),
            okLabel: "Reassign",
            cancelHandler: this.cancelPromptOperation,
            okHandler: this.resubmitActivity.bind(this, activity.id)
        }
        this.setState({ ...this.state, promptOpen, promptConfig });
    };

    resubmitActivity = (activityId) => {
        PresidentActivityService.resubmitActivity(activityId, this.userRole)
            .then(activityDetails => {
                let promptConfig = { ...this.state.promptConfig, loading: false, promptConfig };
                this.setState({ promptOpen: false, loading: false, isActivityDetailDockOpen: true });
                this.props.selectedActivityChange(activityDetails);
                this.loadAssignedActivityList();
                riverToast.show("Activity was resubmitted successfully.");
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while drafting the activity.');
            });
    };

    handleActivityDelete(activity) {
        const promptOpen = true;
        const promptConfig = {
            title: "Confirm Delete",
            loading: this.state.loading,
            theme: "complimentary",
            children: this.getDeleteConfirmationTemplate(activity),
            okLabel: "Delete",
            cancelHandler: this.cancelPromptOperation,
            okHandler: this.deleteActivity.bind(this, activity.id)
        }
        this.setState({ ...this.state, promptOpen, promptConfig });
    }

    handleActivityDraft(activityId, draftData) {
        this.setState({ loading: true });
        PresidentActivityService.draftActivity(activityId, draftData)
            .then(selectedActivityDetails => {
                this.setState({ loading: false });
                this.props.selectedActivityChange(selectedActivityDetails);
                this.loadAssignedActivityList();
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while drafting the activity.');
            });
    }

    handleActivityApprove(activityData, customizePointsComment) {
        const requestData = { ...activityData, customizePointsComment };
        this.setState({ requestData, completeDialogOpen: true });
    }

    handleActivitySubmit(activityData, comment) {

        if (!comment.trim()) {
            riverToast.show('Please add a comment for this action.');
            return;
        }

        const newdate = moment(activityData.claimPeriod).startOf("month").add(2, "days").valueOf();
        let request = {
            rating: activityData.currentRating,
            category: activityData.currentRating,
            multiplier: activityData.multiplier,
            claimPeriod: newdate,
            comment: comment
        };
        request.customisedPoints = this.getCustomisedPoints(activityData);
        this.setState({ loading: true });

        PresidentActivityService.approveActivity(activityData.id, request)
            .then(activityDetails => {
                this.setState({ loading: false, isActivityDetailDockOpen: true, completeDialogOpen: false });
                this.props.selectedActivityChange(activityDetails);
                this.loadAssignedActivityList();
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while completing the activity.');
            });
    }

    handleCancelCompletion() {
        this.setState({
            requestData: null,
            completeDialogOpen: false
        });
    }

    handleSelectKpi(kpiId) {
        this.getKpiDetails(kpiId);
        this.loadClubMembers(kpiId);
    }

    handleKpiMasterDialogOpen() {
        this.setState({ kpiMasterDialogOpen: true });
    }

    handleKpiMasterDialogClose() {
        this.setState({ kpiMasterDialogOpen: false });
    }

    handleKpiDetailsDialogOpen(kpiId) {
        this.props.clearSelectedKpiDetails();
        this.setState({ kpiDetailsDialogOpen: true });
        this.getKpiDetails(kpiId);
    }

    handleKpiDetailsDialogClose() {
        this.setState({ kpiDetailsDialogOpen: false });
    }

    handleActivityReject(activity) {
        const commentPromptOpen = true;
        const commentPromptConfig = {
            title: "Confirm Reject",
            loading: this.state.loading,
            theme: "complimentary",
            comment: "",
            children: this.getRejectConfirmationTemplate(activity),
            SubmitBtnText: "Reject",
            onClose: this.handleCommentPromptClose,
            onSubmit: this.rejectActivity.bind(this, activity.id)
        }
        this.setState({ ...this.state, commentPromptOpen, commentPromptConfig });
    }

    handleCommentPromptClose() {
        const commentPromptOpen = false;
        this.setState({ commentPromptOpen });
    }

    rejectActivity(activityId, comment) {
        let commentPromptConfig = { ...this.state.commentPromptConfig, loading: true };
        this.setState({ loading: true, commentPromptConfig });
        const requestObj = { comment };

        PresidentActivityService.rejectActivity(activityId, requestObj, this.userRole)
            .then(() => {
                let commentPromptConfig = { ...this.state.commentPromptConfig, loading: false, commentPromptConfig };
                this.setState({ commentPromptOpen: false, loading: false, isActivityDetailDockOpen: false });
                this.loadAssignedActivityList();
                riverToast.show("Activity was rejected successfully.");
            })
            .catch(error => {
                let commentPromptConfig = { ...this.state.commentPromptConfig, loading: false, commentPromptConfig };
                this.setState({ commentPromptOpen: false, loading: false, isActivityDetailDockOpen: false });
                riverToast.show(error.status_message || 'Something went wrong while rejecting the activity.');
            });
    }

    handleActivityForceStop(activity) {
        const promptOpen = true;
        const promptConfig = {
            title: "Confirm Force Stop",
            loading: this.state.loading,
            theme: "complimentary",
            children: this.getForceStopConfirmationTemplate(activity),
            okLabel: "Force Stop",
            cancelHandler: this.cancelPromptOperation,
            okHandler: this.forceStopActivity.bind(this, activity.id)
        }
        this.setState({ ...this.state, promptOpen, promptConfig });
    }

    forceStopActivity(activityId) {
        let promptConfig = { ...this.state.promptConfig, loading: true };
        this.setState({ loading: true, promptConfig });

        PresidentActivityService.forceStopActivity(activityId)
            .then(() => {
                let promptConfig = { ...this.state.promptConfig, loading: false, promptConfig };
                this.setState({ promptOpen: false, loading: false, isActivityDetailDockOpen: false });
                this.loadAssignedActivityList();
                riverToast.show("Activity was force stopped successfully.");
            })
            .catch(error => {
                let promptConfig = { ...this.state.promptConfig, loading: false, promptConfig };
                this.setState({ promptOpen: false, loading: false, isActivityDetailDockOpen: false });
                riverToast.show(error.status_message || 'Something went wrong while force-stopping the activity.');
            });
    }

    deleteActivity(activityId) {
        let promptConfig = { ...this.state.promptConfig, loading: true };
        this.setState({ loading: true, promptConfig });

        PresidentActivityService.deleteActivity(activityId)
            .then(() => {
                let promptConfig = { ...this.state.promptConfig, loading: false, promptConfig };
                this.setState({ promptOpen: false, loading: false, isActivityDetailDockOpen: false });
                this.loadAssignedActivityList();
                riverToast.show("Activity was deleted successfully.");
            })
            .catch(error => {
                let promptConfig = { ...this.state.promptConfig, loading: false, promptConfig };
                this.setState({ promptOpen: false, loading: false, isActivityDetailDockOpen: false });
                riverToast.show(error.status_message || 'Something went wrong while deleting the activity.');
            });
    }

    handleDiscussionSubmit(discussionObj) {
        return PresidentActivityService.submitDiscussion(discussionObj)
            .then(voice => {
                this.loadDiscussion(this.props.presidentActivity.selectedActivityDetails.discussionId);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while submitting your comment.");
            });
    }

    cancelPromptOperation() {
        this.setState({ promptOpen: false });
    }

    loadClubMembers(kpiId) {
        this.setState({ loading: true });
        PresidentActivityService.getClubMembers(kpiId)
            .then(clubMembers => {
                let memberList = clubMembers.map(member => ({
                    id: member.email,
                    avatar: member.avatar,
                    title: member.name,
                    subText: member.club,
                    value: member.name,
                    deletable: true
                }));
                this.props.clubMemberListChange(memberList);
                this.setState({ loading: false });
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading club member list.');
                this.setState({ loading: false });
            });
    }

    loadAssignedActivityList(args) {
        const config = {
            role: this.userRole,
            search: this.state.search,
            groupBy: GROUPBY_STATUS,
            filterBy: FILTERBY_ALL,
            page: 0,
            count: PAGE_COUNT
        };
        const { search, groupBy, filterBy } = this.state;
        const request = { ...config, ...{ search, groupBy, filterBy }, ...args };

        this.setState({ listLoading: true });
        PresidentActivityService.getAssignedActivityList(request.role, request.search, request.groupBy, request.filterBy, request.page, request.count)
            .then(assignedActivities => {
                const page = request.page;
                const pageForwardEnabled = assignedActivities.length === PAGE_COUNT;
                this.setState({ listLoading: false, page, pageForwardEnabled });
                this.props.assignedActivityChange(assignedActivities);
            })
            .catch(error => {
                this.setState({ listLoading: false });
                riverToast.show(error.status_message || 'Something went wrong while loading assigned activity list.');
            });
    }

    loadSelectedActivityDetails(activityId) {
        this.setState({ loading: true });
        PresidentActivityService.loadAssignedActivityDetail(activityId, this.userRole)
            .then(selectedActivityDetails => {
                this.props.selectedActivityChange(selectedActivityDetails);
                this.setState({ loading: false, isActivityDetailDockOpen: true });
                this.loadDiscussion(selectedActivityDetails.discussionId);
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while loading assigned activity details.');
            });
    }

    getKpiList(search = "") {
        PresidentActivityService.loadKpiList(search)
            .then(kpiDetails => {
                this.props.kpiListChange(kpiDetails.data);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading LineItem list.');
            });
    }

    getKpiDetails(kpiId) {
        this.setState({ loading: true });
        PresidentActivityService.loadKpiDeatails(kpiId)
            .then(kpiDetail => {
                this.setState({ loading: false });
                this.props.selectedKpiChange(kpiDetail);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading LineItem details.');
                this.setState({ loading: false });
            });
    }

    loadDiscussion(commentId) {
        PresidentActivityService.getDiscussion(commentId)
            .then(discussion => {
                this.props.storeDiscussion(discussion);
            })
            .catch((error) => {
                this.props.clearDiscussion();
                riverToast.show(error.status_message || "Something went wrong while loading activity comments.");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PresidentActivity);