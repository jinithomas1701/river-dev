import React, { Component } from 'react';
import { connect } from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import moment from 'moment';

// root component
import { Root } from "../../../Layout/Root";

// custom component
import { Util } from "../../../../Util/util";
import { CommonService } from '../../../Layout/Common.service';
import { riverToast } from '../../../Common/Toast/Toast';
import { ListDock, ListDockListing, ListDockDetail } from '../../../Common/ListDock/ListDock';
import GroupedList from '../../../Common/GroupedList/GroupedList';
import AdminActivityDetailArea from './AdminActivityDetailArea/AdminActivityDetailArea';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import SearchBar from '../../../Common/SearchBar/SearchBar';
import KpiDialog from '../../../Kpi/KpiDialog/KpiDialog';
import KpiDetailsDialog from '../../../Kpi/KpiDetailsDialog/KpiDetailsDialog';
import Pagination from "../../../Common/Pagination/Pagination";

import AdminActivityService from './AdminActivity.service';

//redux actions
import { assignedActivityChange, selectedActivityChange, selectedActivityReset, pointMatrixChange, memberPointChange, clubPointChange, pointReset, kpiListChange, selectedKpiChange, clearSelectedKpiDetails, storeDiscussion } from './AdminActivity.actions';

// css
import "./AdminActivity.scss";

const ROLE_ADMIN = 'AD';

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
        panelActivity: state.AdminActivityReducer
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

class AdminActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            listLoading: false,
            searchText: "",
            groupBy: GROUPBY_STATUS,
            filterBy: FILTERBY_ALL,
            page: 0,
            pageForwardEnabled: true,
            isActivityDetailDockOpen: false,
            promptOpen: false,
            promptConfig: null,
            completeDialogOpen: false,
            comment: "",
            kpiMasterDialogOpen: false,
            kpiDetailsDialogOpen: false,
            commentPromptOpen: false,
            commentPromptConfig: null
        };
        this.userRole = ROLE_ADMIN;
        this.filterList = this.getFilterList();
        this.groupList = this.getGroupList();
        this.currentUser = Util.getLoggedInUserDetails();
    }

    componentDidMount = () => {
        this.init();
    }

    render = () => {

        const state = this.state;
        const panelActivity = this.props.panelActivity;
        const selectedId = panelActivity.selectedActivityDetails ? panelActivity.selectedActivityDetails.id : "";

        return (
            <div className="panel-activity-wrapper">
                <div className="panel-activity-wrapper">
                    <div className="row filter-area">
                        <div className="col-md-5">
                            <SearchBar
                                placeholder="Search Activity"
                                value={state.searchText}
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
                                categoryItems={panelActivity.assignedActivities}
                                selectedId={selectedId}
                                groupBy={this.state.groupBy}
                                onSelect={this.handleListItemSelect.bind(this)}
                            />
                        </ListDockListing>
                        <ListDockDetail>
                            <AdminActivityDetailArea
                                loading={state.loading}
                                selectedActivity={panelActivity.selectedActivityDetails}
                                discussionList={panelActivity.discussionList}
                                onAttachmentDownload={this.handleAttachmentDownload}
                                onKpiDetailsOpen={this.handleKpiDetailsDialogOpen}
                                onDiscussionSubmit={this.handleDiscussionSubmit}
                                onClose={this.handleActivityDetailClose}
                            />
                        </ListDockDetail>
                    </ListDock>
                </div>
                <KpiDialog
                    open={state.kpiMasterDialogOpen}
                    onClose={this.handleKpiMasterDialogClose}
                />
                <KpiDetailsDialog
                    open={state.kpiDetailsDialogOpen}
                    loading={state.loading}
                    kpi={panelActivity.kpiDetails}
                    onClose={this.handleKpiDetailsDialogClose}
                />
                <a style={{ "display": "none" }} id="download-anchor" ref="downloadAnchor">download</a>
            </div>
        );
    }

    init = () => {
        this.loadAssignedActivityList();
        this.getKpiList();
    }

    getFilterList = () => {
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

    getGroupList = () => {
        return [
            { title: "LINE ITEM", value: "LI" },
            { title: "STATUS", value: "ST" }
        ];
    }

    handleSearchTextChange = (searchText) => {
        this.setState({ searchText });
    }

    handleSearchTextSubmit = (searchText) => {
        this.setState({ searchText });
        this.loadAssignedActivityList({ search: searchText });
    }

    handleFilterChange = (filterBy) => {
        this.setState({ filterBy });
        this.loadAssignedActivityList({ filterBy });
    }

    handleGroupChange = (groupBy) => {
        this.setState({ groupBy });
        this.loadAssignedActivityList({ groupBy });
    }

    handlePagination = (pageData) => {
        const { page, count } = pageData;
        this.loadAssignedActivityList({ page, count });
    }

    handleAttachmentDownload = (file) => {
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

    handleListItemSelect = (activity) => {
        this.props.selectedActivityReset();
        this.setState({ isActivityDetailDockOpen: false });
        this.loadSelectedActivityDetails(activity.id);
    }

    handleActivityDetailClose = () => {
        this.setState({ isActivityDetailDockOpen: false });
        this.props.selectedActivityReset();
    }

    handleKpiMasterDialogOpen = () => {
        this.setState({ kpiMasterDialogOpen: true });
    }

    handleKpiMasterDialogClose = () => {
        this.setState({ kpiMasterDialogOpen: false });
    }

    handleKpiDetailsDialogOpen = (kpiId) => {
        this.props.clearSelectedKpiDetails();
        this.setState({ kpiDetailsDialogOpen: true });
        this.getKpiDetails(kpiId);
    }

    handleKpiDetailsDialogClose = () => {
        this.setState({ kpiDetailsDialogOpen: false });
    }

    handleDiscussionSubmit = (discussionObj) => {
        return AdminActivityService.submitDiscussion(discussionObj)
            .then(voice => {
                this.loadDiscussion(this.props.panelActivity.selectedActivityDetails.discussionId);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while submitting your comment.");
            });
    }

    loadAssignedActivityList = (args) => {
        this.setState({ listLoading: true });
        const config = {
            role: this.userRole,
            search: this.state.searchText,
            groupBy: GROUPBY_STATUS,
            filterBy: FILTERBY_ALL,
            page: 0,
            count: PAGE_COUNT
        };
        const { search, groupBy, filterBy } = this.state;
        const request = { ...config, ...{ search, groupBy, filterBy }, ...args };

        AdminActivityService.getAssignedActivityList(request.role, request.search, request.groupBy, request.filterBy, request.page, request.count)
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

    loadSelectedActivityDetails = (activityId) => {
        this.setState({ loading: true });
        AdminActivityService.loadAssignedActivityDetail(activityId, this.userRole)
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

    getKpiList = (searchText = "") => {
        AdminActivityService.loadKpiList(searchText)
            .then(kpiDetails => {
                this.props.kpiListChange(kpiDetails.data);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading LineItem list.');
            });
    }

    getKpiDetails = (kpiId) => {
        this.setState({ loading: true });
        AdminActivityService.loadKpiDeatails(kpiId)
            .then(kpiDetail => {
                this.setState({ loading: false });
                this.props.selectedKpiChange(kpiDetail);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while loading LineItem details.');
                this.setState({ loading: false });
            });
    }

    loadDiscussion = (commentId) => {
        AdminActivityService.getDiscussion(commentId)
            .then(discussion => {
                this.props.storeDiscussion(discussion);
            })
            .catch((error) => {
                this.props.clearDiscussion();
                riverToast.show(error.status_message || "Something went wrong while loading activity comments.");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminActivity);