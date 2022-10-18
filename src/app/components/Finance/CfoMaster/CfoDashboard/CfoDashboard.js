import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import FinanceService from '../../Finance.service';
import { riverToast } from '../../../Common/Toast/Toast';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import { CommonService } from '../../../Layout/Common.service';
import Pagination from '../../../Common/Pagination/Pagination';
import DashboardChart from '../../CommonUtils/DashboardChart/DashboardChart';
import {
    setCfoDashboardList, setCfoDashboardChartData,
    setCfoDashboardDockTransactionDetails, setCfoDashboardDockDiscussionDetails,
    clearCfoDashboardDockDetails
} from './CfoDashboard.action';
import CfoListItemTile from '../CfoListItemTile/CfoListItemTile';
import CfoApproveDialog from '../CfoApproveDialog/CfoApproveDialog';
import CfoRejectDialog from '../CfoRejectDialog/CfoRejectDialog';
import CfoListItemDockDetails from '../CfoListItemDockDetails/CfoListItemDockDetails';
import './CfoDashboard.scss';

const FILTER_TYPE = 'ACF';
const FILTER_STATUS = 'RE';
const FILTER_GROUPBY = 'DT';
const FILTER_SEARCH = '';

const mapStateToProps = (state) => {
    return {
        CfoDashboardStore: state.CfoDashboardReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDashboardList: (dashboardList) => {
            dispatch(setCfoDashboardList(dashboardList));
        },
        setDashboardChartData: (dashboardChartData) => {
            dispatch(setCfoDashboardChartData(dashboardChartData));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setCfoDashboardDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setCfoDashboardDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearCfoDashboardDockDetails());
        }
    }
};

class CfoDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDockOpen: false,
            isDockLoading: false,
            isDiscussionDockOpen: false,
            isDiscussionDockLoading: false,
            isApproveDialogOpen: false,
            isApproveDialogLoading: false,
            isRejectDialogOpen: false,
            isRejectDialogLoading: false,

            clubList: [],
            selectedClub: "",

            pageNo: 0,
            pageSize: 10,
            forwardEnabled: false
        }
    }

    componentDidMount() {
        this.init();
    }

    init() {
        //api service  
        this.loadClubList();
        //this.loadDashboardChartData();
        this.loadDashboardList();
    }

    render() {
        return (
            <div className="cfo-dashboard-wrapper">

                {
                    this.props.privileges.canViewDashboardChart && this.state.clubList.length > 0 &&
                    <div className="row">
                        <div className="col-md-2 club-listing-wrapper">
                            <SelectBox
                                label="Club"
                                classes="input-select"
                                selectedValue={this.state.selectedClub}
                                selectArray={this.state.clubList}
                                onSelect={this.handleClubChange}
                            />
                        </div>
                    </div>
                }

                {
                    this.props.privileges.canViewDashboardChart &&
                    <DashboardChart data={this.props.CfoDashboardStore.dashboardChartData} />
                }

                <Pagination
                    page={this.state.pageNo}
                    pageSize={this.state.pageSize}
                    totalPages={undefined}
                    onPageForward={this.handlePageForward}
                    onPageBackward={this.handlePageBackward}
                    onPageStart={this.handlePageStart}
                    onPageEnd={this.handlePageEnd}
                    forwardEnabled={this.state.forwardEnabled}
                />

                <FieldHeader title={`Pending for action (${this.props.CfoDashboardStore.dashboardList.length})`} backgroundColor="#ffff" />

                {
                    this.props.CfoDashboardStore.dashboardList.length > 0 ?
                        this.props.CfoDashboardStore.dashboardList.map((item, key) =>
                            <CfoListItemTile key={key} {...item} onItemClick={this.handleItemClick.bind(item.referenceCode)} />
                        ) :
                        <div className="empty">
                            <p>No transactions pending</p>
                        </div>
                }

                {
                    this.props.CfoDashboardStore.dashboardList.length > 8 &&
                    <Pagination
                        page={this.state.pageNo}
                        pageSize={this.state.pageSize}
                        totalPages={undefined}
                        onPageForward={this.handlePageForward}
                        onPageBackward={this.handlePageBackward}
                        onPageStart={this.handlePageStart}
                        onPageEnd={this.handlePageEnd}
                        forwardEnabled={this.state.forwardEnabled}
                    />
                }

                <a style={{ "display": "none" }} id="download-anchor" ></a>
                {
                    this.props.privileges.canViewTransactionDetails &&
                    <Dock
                        size={0.4}
                        zIndex={200}
                        position="right"
                        isVisible={this.state.isDockOpen}
                        dimMode="opaque"
                        defaultSize={.5}
                        fluid={true}
                        onVisibleChange={this.handleDockClose}
                    >
                        <CfoListItemDockDetails
                            dockCloseHandler={this.handleDockClose}
                            isLoading={this.state.isDockLoading}
                            isDiscussionDockLoading={this.state.isDiscussionDockLoading}
                            transaction={this.props.CfoDashboardStore.dockTransactionDetails}
                            discussion={this.props.CfoDashboardStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={false}
                            onArchiveBtnClick={this.handleArchiveBtnClick}
                            approveTransactionHandler={this.handleApproveBtnClick}
                            rejectTransactionHandler={this.handleRejectBtnClick}
                            privileges={this.props.privileges}
                        />
                    </Dock>
                }

                <CfoApproveDialog
                    isDialogOpen={this.state.isApproveDialogOpen}
                    isLoading={this.state.isApproveDialogLoading}
                    approveTransactionHandler={this.handleApproveSubmit}
                    cancelHandler={this.handleApproveCancel}
                    transaction={this.props.CfoDashboardStore.dockTransactionDetails}
                />

                <CfoRejectDialog
                    isDialogOpen={this.state.isRejectDialogOpen}
                    isLoading={this.state.isRejectDialogLoading}
                    rejectTransactionHandler={this.handleRejectSubmit}
                    cancelHandler={this.handleRejectCancel}
                    transaction={this.props.CfoDashboardStore.dockTransactionDetails}
                />
            </div>
        );
    }

    loadDashboardList = (
        type = FILTER_TYPE,
        status = FILTER_STATUS,
        groupBy = FILTER_GROUPBY,
        search = FILTER_SEARCH,
        page = this.state.pageNo,
        count = this.state.pageSize
    ) => {
        FinanceService.getCfoDashboardList(type, status, groupBy, search, page, count)
            .then(dashboardList => {
                this.props.setDashboardList(dashboardList);
                this.setState({ forwardEnabled: (dashboardList.length === this.state.pageSize) });
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
    }

    loadDashboardChartData = (clubId = this.state.selectedClub) => {
        FinanceService.getCfoDashboardChartData(clubId)
            .then(dashboardChartData => {
                this.props.setDashboardChartData(dashboardChartData);
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
    }

    loadClubList = () => {
        FinanceService.getCfoDashboardClubList()
            .then(clubList => {
                let clubArrayList = [];
                clubList.map((club) => {
                    clubArrayList.push({
                        title: club.clubName,
                        value: club.clubId
                    });
                });
                this.setState({ clubList: clubArrayList });
                this.setState({ selectedClub: clubArrayList[0].value });
                this.loadDashboardChartData(clubArrayList[0].value);
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
    }

    handleClubChange = (clubId) => {
        this.setState({ selectedClub: clubId });
        this.loadDashboardChartData(clubId);
    }

    handleItemClick = (transactionItem) => {
        // api for list item click happens here
        this.loadDock(transactionItem.referenceCode);
    }

    loadDock = (transactionId) => {
        this.setState({
            isDockOpen: true,
            isDockLoading: true
        });

        FinanceService.getCfoDockTransactionDetails(transactionId)
            .then(transaction => {
                this.setState({ isDockLoading: false });
                this.props.setDockTransactionDetails(transaction);
                this.loadDiscussion(transaction.discussionId);
            }
            )
            .catch(error => {
                this.setState({ isDockLoading: false });
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
    }

    handleDockClose = () => {
        this.setState({ isDockOpen: false });
        this.props.clearDockTransactionDetails();
    }

    handleDiscussionSubmit = (discussionObj) => {
        let discussionId = discussionObj.commentId;
        this.setState({ isDiscussionDockLoading: true });

        //api for comment posting
        FinanceService.postCfoDockDiscussionDetails(discussionObj)
            .then(discussion => {
                this.loadDiscussion(discussionId);
            }
            )
            .catch(error => {
                this.setState({ isDiscussionDockLoading: false });
                riverToast.show(error.status_message || "Failed to post your comment");
            }
            );

    }

    loadDiscussion = (discussionId) => {

        //api for discussion loading
        FinanceService.getCfoDockDiscussionDetails(discussionId)
            .then(discussion => {
                this.setState({ isDiscussionDockLoading: false });
                this.props.setDockDiscussionDetails(discussion);
            }
            )
            .catch(error => {
                this.setState({ isDiscussionDockLoading: false });
                riverToast.show(error.status_message || "Failed to load discussion details");
            }
            );
    }

    handleAttachmentSelect = (file) => {
        this.setState({ isDockLoading: true });
        CommonService.downloadFromUrl(file.path, 'finance/attachment/{?}')
            .then(blob => {
                const dlnk = document.getElementById('download-anchor');
                const objectUrl = window.URL.createObjectURL(blob);
                dlnk.href = objectUrl;
                dlnk.target = '_blank';
                dlnk.download = file.name;
                dlnk.click();
                window.URL.revokeObjectURL(objectUrl);
                this.setState({ isDockLoading: false });
            })
            .catch(error => {
                this.setState({ isDockLoading: false });
                riverToast.show(error.status_message || 'Something went wrong while downloading file.');
            });
    }

    handleArchiveBtnClick = (id) => {
        this.setState({ isDockLoading: true });

        FinanceService.archiveCfoTransaction(id)
            .then(data => {
                this.setState({ isDockLoading: false });
                this.setState({ isDockOpen: false });
                riverToast.show("Successfully archived your transaction");
                this.loadDashboardList();
            }
            )
            .catch(error => {
                this.setState({ isDockLoading: false });
                riverToast.show(error.status_message || "Something went wrong in the network. Unable to archive transaction at the moment.");
            }
            );
    }

    handleApproveBtnClick = () => {
        this.setState({ isApproveDialogOpen: true });
    }

    handleApproveCancel = () => {
        this.setState({ isApproveDialogOpen: false });
    }

    handleApproveSubmit = (id, transaction) => {
        this.setState({ isApproveDialogLoading: true });

        return FinanceService.approveCfoTransaction(id, transaction)
            .then(responseJSON => {
                this.setState({ isApproveDialogLoading: false });
                this.setState({ isApproveDialogOpen: false });
                riverToast.show("Successfully approved transaction.");
                this.loadDock(id);
                this.loadDashboardList();
                this.loadDashboardChartData(this.props.CfoDashboardStore.dockTransactionDetails.club.id);
                this.setState({ selectedClub: this.props.CfoDashboardStore.dockTransactionDetails.club.id });
                return true;
            }
            )
            .catch(error => {
                this.setState({ isApproveDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Unable to approve transaction";
            }
            );
    }

    handleRejectBtnClick = () => {
        this.setState({ isRejectDialogOpen: true });
    }

    handleRejectCancel = () => {
        this.setState({ isRejectDialogOpen: false });
    }

    handleRejectSubmit = (id, transaction) => {
        this.setState({ isRejectDialogLoading: true });

        return FinanceService.rejectCfoTransaction(id, transaction)
            .then(responseJSON => {
                this.setState({ isRejectDialogLoading: false });
                this.setState({ isRejectDialogOpen: false });
                riverToast.show("Transaction has been rejected.");
                this.loadDock(id);
                this.loadDashboardList();
                return true;
            }
            )
            .catch(error => {
                this.setState({ isRejectDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Failed to reject transaction";
            }
            );
    }

    handlePageForward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = FILTER_TYPE;
        let status = FILTER_STATUS;
        let groupBy = FILTER_GROUPBY;
        let searchText = FILTER_SEARCH;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

    handlePageBackward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = FILTER_TYPE;
        let status = FILTER_STATUS;
        let groupBy = FILTER_GROUPBY;
        let searchText = FILTER_SEARCH;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

    handlePageEnd = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = FILTER_TYPE;
        let status = FILTER_STATUS;
        let groupBy = FILTER_GROUPBY;
        let searchText = FILTER_SEARCH;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

    handlePageStart = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = FILTER_TYPE;
        let status = FILTER_STATUS;
        let groupBy = FILTER_GROUPBY;
        let searchText = FILTER_SEARCH;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(CfoDashboard);