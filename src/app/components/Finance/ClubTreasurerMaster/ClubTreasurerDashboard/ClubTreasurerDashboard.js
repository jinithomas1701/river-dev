import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import Icon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import FinanceService from '../../Finance.service';
import { riverToast } from '../../../Common/Toast/Toast';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import { CommonService } from '../../../Layout/Common.service';
import Pagination from '../../../Common/Pagination/Pagination';
import DashboardChart from '../../CommonUtils/DashboardChart/DashboardChart';
import {
    setClubTreasurerDashboardList, setClubTreasurerDashboardChartData,
    setClubTreasurerDashboardDockTransactionDetails, setClubTreasurerDashboardDockDiscussionDetails,
    clearClubTreasurerDashboardDockDetails
} from './ClubTreasurerDashboard.action';
import ClubTreasurerListItemTile from '../ClubTreasurerListItemTile/ClubTreasurerListItemTile';
import ClubTreasurerSubmitDialog from '../ClubTreasurerSubmitDialog/ClubTreasurerSubmitDialog';
import ClubTreasurerDeleteDialog from '../ClubTreasurerDeleteDialog/ClubTreasurerDeleteDialog';
import CreateTransactionDialog from '../../CommonUtils/CreateTransactionDialog/CreateTransactionDialog';
import ClubTreasurerListItemDockDetails from '../ClubTreasurerListItemDockDetails/ClubTreasurerListItemDockDetails';
import './ClubTreasurerDashboard.scss';

const mapStateToProps = (state) => {
    return {
        ClubTreasurerDashboardStore: state.ClubTreasurerDashboardReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDashboardList: (dashboardList) => {
            dispatch(setClubTreasurerDashboardList(dashboardList));
        },
        setDashboardChartData: (dashboardChartData) => {
            dispatch(setClubTreasurerDashboardChartData(dashboardChartData));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setClubTreasurerDashboardDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setClubTreasurerDashboardDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearClubTreasurerDashboardDockDetails());
        }
    }
};

class ClubTreasurerDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCreateTransactionDialogOpen: false,
            isCreateTransactionDialogLoading: false,
            isDockOpen: false,
            isDockLoading: false,
            isDiscussionDockOpen: false,
            isDiscussionDockLoading: false,
            isSubmitDialogOpen: false,
            isSubmitDialogLoading: false,
            isDeleteDialogOpen: false,
            isDeleteDialogLoading: false,

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
        this.setDashboardChart();
        this.loadDashboardList();
    }

    render() {
        return (
            <div className="club-treasurer-dashboard-wrapper">
                <div className="create-button-wrapper">
                    {
                        this.props.privileges.canCreateTransaction &&
                        <Button
                            className="btn-primary"
                            onClick={this.handleCreateTransactionDialogButton}
                        >
                            Create Transaction
                        </Button>
                    }
                </div>

                <CreateTransactionDialog
                    isDialogOpen={this.state.isCreateTransactionDialogOpen}
                    closeDialogHandler={this.handleCreateTransactionDialogClose}
                    createTransactionHandler={this.handleCreateTransaction}
                    isLoading={this.state.isCreateTransactionDialogLoading}
                />

                {
                    this.props.privileges.canViewDashboardChart &&
                    <DashboardChart data={this.props.ClubTreasurerDashboardStore.dashboardChartData} />
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

                <FieldHeader title={`Pending for action (${this.props.ClubTreasurerDashboardStore.dashboardList.length})`} backgroundColor="#ffff" />

                {
                    this.props.ClubTreasurerDashboardStore.dashboardList.length > 0 ?
                        this.props.ClubTreasurerDashboardStore.dashboardList.map((item, key) =>
                            <ClubTreasurerListItemTile key={key} {...item} onItemClick={this.handleItemClick.bind(item.referenceCode)} />
                        ) :
                        <div className="empty">
                            <p>No transactions pending</p>
                        </div>
                }

                {
                    this.props.ClubTreasurerDashboardStore.dashboardList.length > 8 &&
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
                        <ClubTreasurerListItemDockDetails
                            dockCloseHandler={this.handleDockClose}
                            isLoading={this.state.isDockLoading}
                            isDiscussionDockLoading={this.state.isDiscussionDockLoading}
                            transaction={this.props.ClubTreasurerDashboardStore.dockTransactionDetails}
                            discussion={this.props.ClubTreasurerDashboardStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={false}
                            onArchiveBtnClick={this.handleArchiveBtnClick}
                            deleteTransactionDialogHandler={this.handleDeleteTransactionDialog}
                            submitBillDialogHandler={this.handleSubmitBillDialog}
                            privileges={this.props.privileges}
                        />
                    </Dock>
                }

                <ClubTreasurerSubmitDialog
                    isDialogOpen={this.state.isSubmitDialogOpen}
                    isLoading={this.state.isSubmitDialogLoading}
                    submitHandler={this.handleBillSubmit}
                    cancelHandler={this.handleBillCancel}
                    transaction={this.props.ClubTreasurerDashboardStore.dockTransactionDetails}
                />

                <ClubTreasurerDeleteDialog
                    isDialogOpen={this.state.isDeleteDialogOpen}
                    isLoading={this.state.isDeleteDialogLoading}
                    deleteTransactionHandler={this.handleDeleteTransactionSubmit}
                    cancelHandler={this.handleDeleteTransactionCancel}
                    transaction={this.props.ClubTreasurerDashboardStore.dockTransactionDetails}
                />
            </div>
        );
    }

    loadDashboardList = (
        type = "ALL",
        status = "CR",
        groupBy = "DT",
        search = "",
        page = this.state.pageNo,
        count = this.state.pageSize
    ) => {
        FinanceService.getClubTreasurerDashboardList(type, status, groupBy, search, page, count)
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

    setDashboardChart = () => {
        FinanceService.getClubTreasurerDashboardChartData()
            .then(dashboardChartData => {
                this.props.setDashboardChartData(dashboardChartData);
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
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

        FinanceService.getClubTreasurerDockTransactionDetails(transactionId)
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
        FinanceService.postClubTreasurerDockDiscussionDetails(discussionObj)
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
        FinanceService.getClubTreasurerDockDiscussionDetails(discussionId)
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

        FinanceService.archiveClubTreasurerTransaction(id)
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

    handleSubmitBillDialog = () => {
        this.setState({ isSubmitDialogOpen: true });
    }

    handleCreateTransactionDialogButton = () => {
        ;
        this.setState({ isCreateTransactionDialogOpen: true });
    }

    handleCreateTransactionDialogClose = () => {
        ;
        this.setState({ isCreateTransactionDialogOpen: false });
    }

    handleCreateTransaction = (transaction) => {
        this.setState({ isCreateTransactionDialogLoading: true });
        let requestJSON = transaction;

        //API service call happens here for create transaction
        return FinanceService.createTransaction(requestJSON)
            .then(responseJSON => {
                this.setState({ isCreateTransactionDialogLoading: false });
                riverToast.show("Successfully created transaction request.");
                this.loadDock(responseJSON.referenceCode);
                return true;
            }
            )
            .catch(error => {
                this.setState({ isCreateTransactionDialogLoading: false });
                riverToast.show(error.status_message || "Something went wrong with the request. Please try again.");
                throw "Unable to create transaction";
            }
            );
    }

    handleSubmitBillDialog = () => {
        this.setState({ isSubmitDialogOpen: true });
    }

    handleBillCancel = () => {
        this.setState({ isSubmitDialogOpen: false });
    }

    handleBillSubmit = (id, bills) => {
        this.setState({ isSubmitDialogLoading: true });

        return FinanceService.submitBills(id, bills)
            .then(responseJSON => {
                this.setState({ isSubmitDialogLoading: false });
                this.setState({ isSubmitDialogOpen: false });
                riverToast.show("Successfully submitted your bills.");
                this.loadDock(id);
                this.loadDashboardList();
                return true;
            }
            )
            .catch(error => {
                this.setState({ isSubmitDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Unable to submit bills";
            }
            );
    }

    handleDeleteTransactionDialog = () => {
        this.setState({ isDeleteDialogOpen: true });
    }

    handleDeleteTransactionCancel = () => {
        this.setState({ isDeleteDialogOpen: false });
    }

    handleDeleteTransactionSubmit = (id) => {
        this.setState({ isDeleteDialogLoading: true });

        return FinanceService.deleteClubTreasurerTransaction(id)
            .then(responseJSON => {
                this.setState({ isDeleteDialogLoading: false });
                this.setState({ isDeleteDialogOpen: false });
                this.setState({ isDockOpen: false });
                riverToast.show("Successfully deleted the transaction.");
                return true;
            }
            )
            .catch(error => {
                this.setState({ isDeleteDialogLoading: false });
                riverToast.show(error.status_message || "Please try again.");
                throw "Unable to delete transaction";
            }
            );
    }

    handlePageForward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = "ALL";
        let status = "CR";
        let groupBy = "DT";
        let searchText = "";
        let count = this.state.pageSize;
        let page = (pageData.page);

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

    handlePageBackward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = "ALL";
        let status = "CR";
        let groupBy = "DT";
        let searchText = "";
        let count = this.state.pageSize;
        let page = (pageData.page);

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

    handlePageEnd = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = "ALL";
        let status = "CR";
        let groupBy = "DT";
        let searchText = "";
        let count = this.state.pageSize;
        let page = (pageData.page);

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

    handlePageStart = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = "ALL";
        let status = "CR";
        let groupBy = "DT";
        let searchText = "";
        let count = this.state.pageSize;
        let page = (pageData.page);

        this.loadDashboardList(type, status, groupBy, searchText, page, count);
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ClubTreasurerDashboard);