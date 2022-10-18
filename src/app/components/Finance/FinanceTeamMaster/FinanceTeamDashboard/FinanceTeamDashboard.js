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
    setFinanceTeamDashboardList, setFinanceTeamDashboardChartData,
    setFinanceTeamDashboardDockTransactionDetails, setFinanceTeamDashboardDockDiscussionDetails,
    clearFinanceTeamDashboardDockDetails
} from './FinanceTeamDashboard.action';
import FinanceTeamListItemTile from '../FinanceTeamListItemTile/FinanceTeamListItemTile';
import FinanceTeamApproveDialog from '../FinanceTeamApproveDialog/FinanceTeamApproveDialog';
import FinanceTeamRejectDialog from '../FinanceTeamRejectDialog/FinanceTeamRejectDialog';
import FinanceTeamCreditDialog from '../FinanceTeamCreditDialog/FinanceTeamCreditDialog';
import FinanceTeamCompleteDialog from '../FinanceTeamCompleteDialog/FinanceTeamCompleteDialog';
import FinanceTeamDeescalateDialog from '../FinanceTeamDeescalateDialog/FinanceTeamDeescalateDialog';
import FinanceTeamListItemDockDetails from '../FinanceTeamListItemDockDetails/FinanceTeamListItemDockDetails';
import './FinanceTeamDashboard.scss';

const FILTER_TYPE = 'ALL';
const FILTER_STATUS = 'AFT';
const FILTER_GROUPBY = 'DT';
const FILTER_SEARCH = '';

const mapStateToProps = (state) => {
    return {
        FinanceTeamDashboardStore: state.FinanceTeamDashboardReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDashboardList: (dashboardList) => {
            dispatch(setFinanceTeamDashboardList(dashboardList));
        },
        setDashboardChartData: (dashboardChartData) => {
            dispatch(setFinanceTeamDashboardChartData(dashboardChartData));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setFinanceTeamDashboardDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setFinanceTeamDashboardDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearFinanceTeamDashboardDockDetails());
        }
    }
};

class FinanceTeamDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDockOpen: false,
            isDockLoading: false,
            isDiscussionDockOpen: false,
            isDiscussionDockLoading: false,
            isApproveDialogOpen: false,
            isApproveDialogLoading: false,
            isCreditDialogOpen: false,
            isCreditDialogLoading: false,
            isCompleteDialogOpen: false,
            isCompleteDialogLoading: false,
            isRejectDialogOpen: false,
            isRejectDialogLoading: false,
            isDeescalateDialogOpen: false,
            isDeescalateDialogLoading: false,

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
            <div className="finance-team-dashboard-wrapper">

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
                    <DashboardChart data={this.props.FinanceTeamDashboardStore.dashboardChartData} />
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

                <FieldHeader title={`Pending for action (${this.props.FinanceTeamDashboardStore.dashboardList.length})`} backgroundColor="#ffff" />

                {
                    this.props.FinanceTeamDashboardStore.dashboardList.length > 0 ?
                        this.props.FinanceTeamDashboardStore.dashboardList.map((item, key) =>
                            <FinanceTeamListItemTile key={key} {...item} onItemClick={this.handleItemClick.bind(item.referenceCode)} />
                        ) :
                        <div className="empty">
                            <p>No transactions pending</p>
                        </div>
                }

                {
                    this.props.FinanceTeamDashboardStore.dashboardList.length > 8 &&
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
                        <FinanceTeamListItemDockDetails
                            dockCloseHandler={this.handleDockClose}
                            isLoading={this.state.isDockLoading}
                            isDiscussionDockLoading={this.state.isDiscussionDockLoading}
                            transaction={this.props.FinanceTeamDashboardStore.dockTransactionDetails}
                            discussion={this.props.FinanceTeamDashboardStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={false}
                            onArchiveBtnClick={this.handleArchiveBtnClick}
                            approveTransactionHandler={this.handleApproveBtnClick}
                            creditTransactionHandler={this.handleCreditBtnClick}
                            completeTransactionHandler={this.handleCompleteBtnClick}
                            rejectTransactionHandler={this.handleRejectBtnClick}
                            deescalateTransactionHandler={this.handleDeescalateBtnClick}
                            privileges={this.props.privileges}
                        />
                    </Dock>
                }

                <FinanceTeamApproveDialog
                    isDialogOpen={this.state.isApproveDialogOpen}
                    isLoading={this.state.isApproveDialogLoading}
                    approveTransactionHandler={this.handleApproveSubmit}
                    cancelHandler={this.handleApproveCancel}
                    transaction={this.props.FinanceTeamDashboardStore.dockTransactionDetails}
                />

                <FinanceTeamRejectDialog
                    isDialogOpen={this.state.isRejectDialogOpen}
                    isLoading={this.state.isRejectDialogLoading}
                    rejectTransactionHandler={this.handleRejectSubmit}
                    cancelHandler={this.handleRejectCancel}
                    transaction={this.props.FinanceTeamDashboardStore.dockTransactionDetails}
                />

                <FinanceTeamCreditDialog
                    isDialogOpen={this.state.isCreditDialogOpen}
                    isLoading={this.state.isCreditDialogLoading}
                    creditTransactionHandler={this.handleCreditSubmit}
                    cancelHandler={this.handleCreditCancel}
                    transaction={this.props.FinanceTeamDashboardStore.dockTransactionDetails}
                />

                <FinanceTeamCompleteDialog
                    isDialogOpen={this.state.isCompleteDialogOpen}
                    isLoading={this.state.isCompleteDialogLoading}
                    completeTransactionHandler={this.handleCompleteSubmit}
                    cancelHandler={this.handleCompleteCancel}
                    transaction={this.props.FinanceTeamDashboardStore.dockTransactionDetails}
                />

                <FinanceTeamDeescalateDialog
                    isDialogOpen={this.state.isDeescalateDialogOpen}
                    isLoading={this.state.isDeescalateDialogLoading}
                    deescalateTransactionHandler={this.handleDeescalateSubmit}
                    cancelHandler={this.handleDeescalateCancel}
                    transaction={this.props.FinanceTeamDashboardStore.dockTransactionDetails}
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
        FinanceService.getFinanceTeamDashboardList(type, status, groupBy, search, page, count)
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
        FinanceService.getFinanceTeamDashboardChartData(clubId)
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
        FinanceService.getFinanceTeamDashboardClubList()
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

        FinanceService.getFinanceTeamDockTransactionDetails(transactionId)
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
        FinanceService.postFinanceTeamDockDiscussionDetails(discussionObj)
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
        FinanceService.getFinanceTeamDockDiscussionDetails(discussionId)
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

        FinanceService.archiveFinanceTeamTransaction(id)
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

        return FinanceService.approveFinanceTeamTransaction(id, transaction)
            .then(responseJSON => {
                this.setState({ isApproveDialogLoading: false });
                this.setState({ isApproveDialogOpen: false });
                riverToast.show("Successfully approved transaction.");
                this.loadDock(id);
                this.loadDashboardList();
                this.loadDashboardChartData(this.props.FinanceTeamDashboardStore.dockTransactionDetails.club.id);
                this.setState({ selectedClub: this.props.FinanceTeamDashboardStore.dockTransactionDetails.club.id });
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

        return FinanceService.rejectFinanceTeamTransaction(id, transaction)
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

    handleCreditBtnClick = () => {
        this.setState({ isCreditDialogOpen: true });
    }

    handleCreditCancel = () => {
        this.setState({ isCreditDialogOpen: false });
    }

    handleCreditSubmit = (id, transaction) => {
        this.setState({ isCreditDialogLoading: true });

        return FinanceService.creditTransaction(id, transaction)
            .then(responseJSON => {
                this.setState({ isCreditDialogLoading: false });
                this.setState({ isCreditDialogOpen: false });
                riverToast.show("Transaction status has been set to CREDITED.");
                this.loadDock(id);
                this.loadDashboardList();
                return true;
            }
            )
            .catch(error => {
                this.setState({ isCreditDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Unable to credit";
            }
            );
    }


    handleCompleteBtnClick = () => {
        this.setState({ isCompleteDialogOpen: true });
    }

    handleCompleteCancel = () => {
        this.setState({ isCompleteDialogOpen: false });
    }

    handleCompleteSubmit = (id, transaction) => {
        this.setState({ isCompleteDialogLoading: true });

        return FinanceService.closeTransaction(id, transaction)
            .then(responseJSON => {
                this.setState({ isCompleteDialogLoading: false });
                this.setState({ isCompleteDialogOpen: false });
                riverToast.show("Successfully completed the transaction.");
                this.loadDock(id);
                this.loadDashboardList();
                this.loadDashboardChartData(this.props.FinanceTeamDashboardStore.dockTransactionDetails.club.id);
                this.setState({ selectedClub: this.props.FinanceTeamDashboardStore.dockTransactionDetails.club.id });
                return true;
            }
            )
            .catch(error => {
                this.setState({ isCompleteDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Unable to complete transaction";
            }
            );
    }


    handleDeescalateBtnClick = () => {
        this.setState({ isDeescalateDialogOpen: true });
    }

    handleDeescalateCancel = () => {
        this.setState({ isDeescalateDialogOpen: false });
    }

    handleDeescalateSubmit = (id, transaction) => {
        this.setState({ isDeescalateDialogLoading: true });

        return FinanceService.deescalateTransaction(id, transaction)
            .then(responseJSON => {
                this.setState({ isDeescalateDialogLoading: false });
                this.setState({ isDeescalateDialogOpen: false });
                riverToast.show("Request sent for further clarification");
                this.loadDock(id);
                this.loadDashboardList();
                return true;
            }
            )
            .catch(error => {
                this.setState({ isDeescalateDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Unable to process clarification";
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

export default connect(mapStateToProps, mapDispatchToProps)(FinanceTeamDashboard);