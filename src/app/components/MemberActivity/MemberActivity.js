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
import MemberActivityDetailArea from '../MemberActivity/MemberActivityDetailArea/MemberActivityDetailArea';
import { SelectBox } from '../Common/SelectBox/SelectBox';
import CreateActivityDialog from '../Common/CreateActivityDialog/CreateActivityDialog';
import MemberActivityCompletePrompt from '../MemberActivity/MemberActivityCompletePrompt/MemberActivityCompletePrompt';
import PromptDialog from '../Common/PromptDialog/PromptDialog';
import SearchBar from '../Common/SearchBar/SearchBar';
import KpiDialog from '../Kpi/KpiDialog/KpiDialog';
import KpiDetailsDialog from '../Kpi/KpiDetailsDialog/KpiDetailsDialog';
import StackedList from '../Common/StackedList/StackedList';
import ActivityListTemplate from '../Common/ActivityListTemplate/ActivityListTemplate';
import Pagination from "../Common/Pagination/Pagination";

import MemberActivityService from './MemberActivity.service';

//redux actions
import { assignedActivityChange, selectedActivityChange, selectedActivityReset, pointMatrixChange, memberPointChange, clubPointChange, clubMemberListChange, clubDefaultMemberListChange, kpiListChange, selectedKpiChange, clearSelectedKpiDetails, storeDiscussion } from './MemberActivity.actions';

// css
import "./MemberActivity.scss";

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
        memberActivity: state.MemberActivityReducer
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
        clubMemberListChange: (memberList) => {
            dispatch(clubMemberListChange(memberList))
        },
        clubDefaultMemberListChange: (defaultMemberList) => {
            dispatch(clubDefaultMemberListChange(defaultMemberList))
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

class MemberActivity extends Component {
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
            kpiDetailsDialogOpen: false
        };
        this.userRole = ROLE_USER;
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
        this.handleActivityComplete = this.handleActivityComplete.bind(this);
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
        this.loadDiscussion = this.loadDiscussion.bind(this);

        this.comparator = this.comparator.bind(this);
    }

    componentDidMount() {
        const params = this.props.match.params;
        let activityId;
        if (params && params.activityId) {
            activityId = params.activityId;
        }
        this.init(activityId);
    }

    render() {

        const state = this.state;
        const memberActivity = this.props.memberActivity;
        const selectedId = memberActivity.selectedActivityDetails ? memberActivity.selectedActivityDetails.id : "";

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Member Activities" />
                    <div className="member-activity-wrapper">
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



                        {/*<StackedList
                            listData={memberActivity.assignedActivities}
                            itemTemplate={<ActivityListTemplate />}
                            emptyTemplate={<div>no data</div>}
                            comparator={this.comparator}
                            />*/}
                        <Pagination
                            countFromZero={false}
                            page={state.page}
                            pageSize={PAGE_COUNT}
                            forwardEnabled={state.pageForwardEnabled}
                            onPageStart={this.handlePagination}
                            onPageForward={this.handlePagination}
                            onPageBackward={this.handlePagination}
                        //onTextSearch={this.handlePagination}
                        //onPaginationTextChange={this.handlePageTextChange}
                        />

                        <ListDock
                            open={this.state.isActivityDetailDockOpen}
                            onClose={this.handleActivityDetailClose}
                        >
                            <ListDockListing>
                                <GroupedList
                                    loading={this.state.listLoading}
                                    categoryItems={memberActivity.assignedActivities}
                                    selectedId={selectedId}
                                    groupBy={this.state.groupBy}
                                    onSelect={this.handleListItemSelect.bind(this)}
                                />
                            </ListDockListing>
                            <ListDockDetail>
                                <MemberActivityDetailArea
                                    loading={state.loading}
                                    selectedActivity={memberActivity.selectedActivityDetails}
                                    discussionList={memberActivity.discussionList}
                                    onStarRateChange={this.handleStarRateChange}
                                    onCategoryChange={this.handleCategoryChange}
                                    onMultiplierChange={this.handleMultiplierChange}
                                    onAttachmentUpload={this.handleAttachmentUpload}
                                    onAttachmentDelete={this.handleAttachmentDelete}
                                    onAttachmentDownload={this.handleAttachmentDownload}
                                    onMemberDelete={this.handleMemberDelete}
                                    onMemberPointChange={this.handleMemberPointChange}
                                    onClubPointChange={this.handleClubPointChange}
                                    onKpiDetailsOpen={this.handleKpiDetailsDialogOpen}
                                    onActivityDraft={this.handleActivityDraft}
                                    onActivityComplete={this.handleActivityComplete}
                                    onActivityDelete={this.handleActivityDelete}
                                    onDiscussionLoad={this.loadDiscussion}
                                    onDiscussionSubmit={this.handleDiscussionSubmit}
                                    onClose={this.handleActivityDetailClose}
                                />
                            </ListDockDetail>
                        </ListDock>
                    </div>
                    <PromptDialog open={this.state.promptOpen} {...this.state.promptConfig} />
                    <MemberActivityCompletePrompt
                        open={this.state.completeDialogOpen}
                        activity={this.state.requestData}
                        onComplete={this.handleActivitySubmit}
                        onCancel={this.handleCancelCompletion}
                    />
                    <CreateActivityDialog
                        open={this.state.createDialogOpen}
                        canSelfSelect={false}
                        loading={this.state.loading}
                        disableUnAccessible={true}
                        kpiList={memberActivity.kpiList}
                        kpiDetails={memberActivity.kpiDetails}
                        memberList={memberActivity.memberList}
                        defaultMemberList={memberActivity.defaultMemberList}
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
                        kpi={memberActivity.kpiDetails}
                        onClose={this.handleKpiDetailsDialogClose}
                    />
                    <a style={{ "display": "none" }} id="download-anchor" ref="downloadAnchor">download</a>
                </MainContainer>
            </Root>
        );
    }

    comparator(prevItem, currItem) {
        const groupBy = this.state.groupBy;
        const { groupPropertyExtractor, comparingFunction } = this.getComparingRule(groupBy);
        const prevValue = prevItem ? groupPropertyExtractor(prevItem) : undefined;
        const comparisonResult = comparingFunction(currItem, prevValue);
        //console.log(comparisonResult);
        return comparisonResult;
    }

    getComparingRule(groupByLabel) {
        let groupPropertyExtractor, comparingFunction;
        switch (groupByLabel) {
            case GROUPBY_STATUS:
                groupPropertyExtractor = (a) => a.status;
                comparingFunction = this.compareByStatus;
                break;
            case GROUPBY_KPI:
                groupPropertyExtractor = a => a.kpi.id;
                comparingFunction = this.compareByKPI;
                break;
            default:
                break;
        }
        return { groupPropertyExtractor, comparingFunction };
    }

    compareByStatus(activity, lastValue) {
        let isNewGroup = lastValue !== activity.status;
        return {
            isNewGroup,
            heading: activity.status
        };
    }

    compareByKPI(activity, lastValue) {
        let isNewGroup = lastValue !== activity.kpi.id;
        return {
            isNewGroup,
            heading: activity.kpi.title
        };
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

    handlePagination = (pageData) => {
        const { page, count } = pageData;
        this.loadAssignedActivityList({ page, count });
    }

    handlePageTextChange = (pageData) => {
        this.setState({ page: pageData.page });
    };

    getDeleteConfirmationTemplate(activity) {
        return (
            <div className="deleteconfirm-wrapper">
                <p>Delete this activity?</p>
                <span><b>RefCode#</b> {activity.id}<br />
                    <b>"{activity.title}"</b>
                </span>
            </div>
        );
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

    handleAttachmentUpload(selectedActivityId, fileList) {
        const attachments = { attachments: fileList };
        MemberActivityService.uploadAttachments(selectedActivityId, attachments)
            .then(attachment => {
                this.loadSelectedActivityDetails(selectedActivityId);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while uploading attachment.');
            });
    }

    handleAttachmentDelete(selectedActivityId, file) {
        MemberActivityService.deleteAttachment(file.path)
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
        MemberActivityService.calculateStarPoint(selectedActivityId, ratingCode, multiplier)
            .then(pointMatrix => {
                this.props.pointMatrixChange(pointMatrix);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while calculating rating points.');
            });
    }

    handleCategoryChange(selectedActivityId, categoryCode, multiplier) {
        MemberActivityService.calculateCategoryPoint(selectedActivityId, categoryCode, multiplier)
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
        this.props.kpiListChange([]);
        this.getKpiList();
        this.props.clearSelectedKpiDetails();
        this.setState({ createDialogOpen: true });
    }

    handleActivityCreate(kpiId, createActivityObj) {
        this.setState({ loading: true });
        return MemberActivityService.createActivity(this.userRole, kpiId, createActivityObj)
            .then(newActivity => {
                this.setState({ loading: false, isActivityDetailDockOpen: true });
                //@DESC: update selectedactivity
                this.props.selectedActivityChange(newActivity);

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
        MemberActivityService.draftActivity(activityId, draftData)
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

    handleActivityComplete(activityData) {
        const requestData = { ...activityData };
        this.setState({ requestData, completeDialogOpen: true });
    }

    handleActivitySubmit(activityData, comment) {

        if (!comment.trim()) {
            riverToast.show('Please add a comment for this action.');
            return;
        }

        const newdate = moment(activityData.claimPeriod).startOf("month").add(2, "days").valueOf();
        const request = {
            category: activityData.currentRating,
            multiplier: activityData.multiplier,
            claimPeriod: newdate,
            comment: comment
        };
        this.setState({ loading: true });

        MemberActivityService.completeActivity(activityData.id, request)
            .then(activityDetails => {
                this.setState({ loading: false });
                this.setState({ isActivityDetailDockOpen: true });
                this.props.selectedActivityChange(activityDetails);
                this.loadAssignedActivityList();
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while completing the activity.');
            });
        this.setState({ completeDialogOpen: false });
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

    deleteActivity(activityId) {
        let promptConfig = { ...this.state.promptConfig, loading: true };
        this.setState({ loading: true, promptConfig });
        MemberActivityService.deleteActivity(activityId)
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
        return MemberActivityService.submitDiscussion(discussionObj)
            .then(voice => {
                this.loadDiscussion(this.props.memberActivity.selectedActivityDetails.discussionId);
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
        MemberActivityService.getClubMembers(kpiId)
            .then(clubMembers => {
                const memberList = [];
                const defaultMemberList = [];
                clubMembers.forEach(member => {
                    if (member.id === this.currentUser.userId) {
                        defaultMemberList.push({
                            id: member.email,
                            avatar: member.avatar,
                            title: member.name,
                            subText: member.club,
                            value: member.name,
                            deletable: false
                        })
                    }
                    else {
                        memberList.push({
                            id: member.email,
                            avatar: member.avatar,
                            title: member.name,
                            subText: member.club,
                            value: member.name,
                            deletable: true
                        });
                    }
                });
                this.props.clubMemberListChange(memberList);
                this.props.clubDefaultMemberListChange(defaultMemberList);
                this.setState({ loading: false });
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading club member list.');
                this.setState({ loading: false });
            });
    }

    loadAssignedActivityList(args) {
        this.setState({ listLoading: true });
        const config = {
            role: this.userRole,
            search: this.state.search,
            groupBy: this.state.groupBy,
            filterBy: this.state.filterBy,
            page: 0,
            count: PAGE_COUNT
        };
        const { search, groupBy, filterBy } = this.state;
        const request = { ...config, ...{ search, groupBy, filterBy }, ...args };

        MemberActivityService.getAssignedActivityList(request.role, request.search, request.groupBy, request.filterBy, request.page, request.count)
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
        MemberActivityService.loadAssignedActivityDetail(activityId, this.userRole)
            .then(selectedActivityDetails => {
                this.setState({ loading: false, isActivityDetailDockOpen: true });
                this.props.selectedActivityChange(selectedActivityDetails);
                this.loadDiscussion(selectedActivityDetails.discussionId);
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while loading assigned activity details.');
            });
    }

    getKpiList(searchTerm = "") {
        MemberActivityService.loadKpiList(searchTerm)
            .then(kpiDetails => {
                this.props.kpiListChange(kpiDetails.data);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading LineItem list.');
            });
    }

    getKpiDetails(kpiId) {
        this.setState({ loading: true });
        MemberActivityService.loadKpiDeatails(kpiId)
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
        MemberActivityService.getDiscussion(commentId)
            .then(discussion => {
                this.props.storeDiscussion(discussion);
            })
            .catch((error) => {
                this.props.clearDiscussion();
                riverToast.show(error.status_message || "Something went wrong while loading activity comments.");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberActivity);