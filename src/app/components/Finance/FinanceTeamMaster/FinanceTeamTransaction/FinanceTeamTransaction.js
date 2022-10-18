import React, { Component } from 'react';
import Dock from 'react-dock';
import moment from 'moment';
import { connect } from "react-redux";
import FinanceService from '../../Finance.service';
import { riverToast } from '../../../Common/Toast/Toast';
import Filters from '../../CommonUtils/Filters/Filters';
import { CommonService } from '../../../Layout/Common.service';
import Pagination from '../../../Common/Pagination/Pagination';
import StackedList from '../../CommonUtils/StackedList/StackedList';
import {
    setFinanceTeamTransactionSearch, setFinanceTeamTransactionType, setFinanceTeamTransactionStatus,
    setFinanceTeamTransactionGroupBy, setFinanceTeamTransactionList, appendFinanceTeamTransactionList,
    setFinanceTeamTransactionDockTransactionDetails, setFinanceTeamTransactionDockDiscussionDetails,
    clearFinanceTeamTransactionDockDetails
} from './FinanceTeamTransaction.action';
import FinanceTeamListItemTile from '../FinanceTeamListItemTile/FinanceTeamListItemTile';
import FinanceTeamApproveDialog from '../FinanceTeamApproveDialog/FinanceTeamApproveDialog';
import FinanceTeamRejectDialog from '../FinanceTeamRejectDialog/FinanceTeamRejectDialog';
import FinanceTeamCreditDialog from '../FinanceTeamCreditDialog/FinanceTeamCreditDialog';
import FinanceTeamCompleteDialog from '../FinanceTeamCompleteDialog/FinanceTeamCompleteDialog';
import FinanceTeamDeescalateDialog from '../FinanceTeamDeescalateDialog/FinanceTeamDeescalateDialog';
import FinanceTeamListItemDockDetails from '../FinanceTeamListItemDockDetails/FinanceTeamListItemDockDetails';
import './FinanceTeamTransaction.scss';

const GROUPBY_MONTH = 'DT';
const GROUPBY_STATUS = 'ST';
const GROUPBY_ALLOWANCE_TYPE = 'AT';

const mapStateToProps = (state) => {
    return {
        FinanceTeamTransactionStore: state.FinanceTeamTransactionReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setFilterSearchText: (filterSearchText) => {
            dispatch(setFinanceTeamTransactionSearch(filterSearchText));
        },
        setFilterType: (filterType) => {
            dispatch(setFinanceTeamTransactionType(filterType));
        },
        setFilterStatus: (filterStatus) => {
            dispatch(setFinanceTeamTransactionStatus(filterStatus));
        },
        setFilterGroupBy: (filterGroupBy) => {
            dispatch(setFinanceTeamTransactionGroupBy(filterGroupBy));
        },
        setTransactionList: (transactionList) => {
            dispatch(setFinanceTeamTransactionList(transactionList));
        },
        appendTransactionList: (appendItem) => {
            dispatch(appendFinanceTeamTransactionList(appendItem));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setFinanceTeamTransactionDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setFinanceTeamTransactionDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearFinanceTeamTransactionDockDetails());
        }
    }
};

class FinanceTeamTransaction extends Component {

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

            pageNo: 0,
            pageSize: 10,
            forwardEnabled: false
        }

        this.filterTypeList = this.getFilterTypeList();
        this.filterStatusList = this.getFilterStatusList();
        this.filterGroupByList = this.getFilterGroupByList();
    }

    componentDidMount() {
        this.init();
    }

    init() {
        //api service on component mounting
        this.loadTransactionList();
    }

    render() {
        return (
            <div className="finance-team-transaction-wrapper">

                <Filters
                    filterTypeList={this.filterTypeList}
                    filterStatusList={this.filterStatusList}
                    filterGroupByList={this.filterGroupByList}
                    selectedType={this.props.FinanceTeamTransactionStore.filterType}
                    selectedStatus={this.props.FinanceTeamTransactionStore.filterStatus}
                    selectedGroupBy={this.props.FinanceTeamTransactionStore.filterGroupBy}
                    onFilterChange={this.handleFilterChange}
                />

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

                <StackedList
                    listData={this.props.FinanceTeamTransactionStore.transactionList}
                    itemTemplate={<FinanceTeamListItemTile />}
                    emptyTemplate={<div className="empty">
                        <p>No transactions found</p>
                    </div>}
                    comparator={this.comparator}
                    itemProps={
                        {
                            onItemClick: this.handleItemClick
                        }
                    }
                    headerBgColor="#ffff"
                />

                {
                    this.props.FinanceTeamTransactionStore.transactionList.length > 8 &&
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
                            transaction={this.props.FinanceTeamTransactionStore.dockTransactionDetails}
                            discussion={this.props.FinanceTeamTransactionStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={false}
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
                    transaction={this.props.FinanceTeamTransactionStore.dockTransactionDetails}
                />

                <FinanceTeamRejectDialog
                    isDialogOpen={this.state.isRejectDialogOpen}
                    isLoading={this.state.isRejectDialogLoading}
                    rejectTransactionHandler={this.handleRejectSubmit}
                    cancelHandler={this.handleRejectCancel}
                    transaction={this.props.FinanceTeamTransactionStore.dockTransactionDetails}
                />

                <FinanceTeamCreditDialog
                    isDialogOpen={this.state.isCreditDialogOpen}
                    isLoading={this.state.isCreditDialogLoading}
                    creditTransactionHandler={this.handleCreditSubmit}
                    cancelHandler={this.handleCreditCancel}
                    transaction={this.props.FinanceTeamTransactionStore.dockTransactionDetails}
                />

                <FinanceTeamCompleteDialog
                    isDialogOpen={this.state.isCompleteDialogOpen}
                    isLoading={this.state.isCompleteDialogLoading}
                    completeTransactionHandler={this.handleCompleteSubmit}
                    cancelHandler={this.handleCompleteCancel}
                    transaction={this.props.FinanceTeamTransactionStore.dockTransactionDetails}
                />

                <FinanceTeamDeescalateDialog
                    isDialogOpen={this.state.isDeescalateDialogOpen}
                    isLoading={this.state.isDeescalateDialogLoading}
                    deescalateTransactionHandler={this.handleDeescalateSubmit}
                    cancelHandler={this.handleDeescalateCancel}
                    transaction={this.props.FinanceTeamTransactionStore.dockTransactionDetails}
                />
            </div>
        );
    }


    getFilterTypeList = () => {
        return [
            { title: "ALL", value: 'ALL' },
            { title: "MEETING ALLOWANCE", value: 'MA' },
            { title: "EVENT ALLOWANCE", value: 'EA' },
            { title: "OTHER ALLOWANCE", value: 'OA' }
        ];
    }

    getFilterStatusList = () => {
        return [
            { title: "ALL", value: "ALL" },
            { title: "REQUESTED", value: "RE" },
            { title: "DECLINED", value: "DE" },
            { title: "APPROVED", value: "AP" },
            { title: "CREDITED", value: "CR" },
            { title: "SUBMITTED", value: "SU" },
            { title: "CLOSED", value: "CL" }
        ];
    }

    getFilterGroupByList = () => {
        return [
            //{title: "MONTH", value: "DT"},
            { title: "STATUS", value: "ST" },
            { title: "ALLOWANCE TYPE", value: "AT" }
        ];
    }

    handleFilterChange = (selectedValues) => {
        let searchText = selectedValues.search;
        let type = selectedValues.type;
        let status = selectedValues.status;
        let groupBy = selectedValues.groupBy;
        let count = this.state.pageSize;
        let page = 0;

        this.props.setFilterSearchText("");
        this.props.setFilterType(type);
        this.props.setFilterStatus(status);
        this.props.setFilterGroupBy(groupBy);
        this.setState({ pageNo: page });

        // api for filter change happens here
        this.loadTransactionList(type, status, groupBy, searchText, page, count);
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
                this.loadTransactionList();
            }
            )
            .catch(error => {
                this.setState({ isDockLoading: false });
                riverToast.show(error.status_message || "Something went wrong in the network. Unable to archive transaction at the moment.");
            }
            );
    }

    loadTransactionList = (
        type = this.props.FinanceTeamTransactionStore.filterType,
        status = this.props.FinanceTeamTransactionStore.filterStatus,
        groupBy = this.props.FinanceTeamTransactionStore.filterGroupBy,
        searchText = this.props.FinanceTeamTransactionStore.filterSearchText,
        page = this.state.pageNo,
        count = this.state.pageSize,
    ) => {

        FinanceService.getFinanceTeamTransactionList(type, status, groupBy, searchText, page, count)
            .then(transactionList => {
                this.props.setTransactionList(transactionList);
                this.setState({ forwardEnabled: (transactionList.length === this.state.pageSize) });
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
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
                this.loadTransactionList();
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
                this.loadTransactionList();
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
                this.loadTransactionList();
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
                this.loadTransactionList();
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
                this.loadTransactionList();
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

        let type = this.props.FinanceTeamTransactionStore.filterType;
        let status = this.props.FinanceTeamTransactionStore.filterStatus;
        let groupBy = this.props.FinanceTeamTransactionStore.filterGroupBy;
        let searchText = this.props.FinanceTeamTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageBackward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamTransactionStore.filterType;
        let status = this.props.FinanceTeamTransactionStore.filterStatus;
        let groupBy = this.props.FinanceTeamTransactionStore.filterGroupBy;
        let searchText = this.props.FinanceTeamTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageEnd = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamTransactionStore.filterType;
        let status = this.props.FinanceTeamTransactionStore.filterStatus;
        let groupBy = this.props.FinanceTeamTransactionStore.filterGroupBy;
        let searchText = this.props.FinanceTeamTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageStart = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamTransactionStore.filterType;
        let status = this.props.FinanceTeamTransactionStore.filterStatus;
        let groupBy = this.props.FinanceTeamTransactionStore.filterGroupBy;
        let searchText = this.props.FinanceTeamTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }



    comparator = (prevItem, currItem) => {
        const groupBy = this.props.FinanceTeamTransactionStore.filterGroupBy;
        const { groupPropertyExtractor, comparingFunction } = this.getComparingRule(groupBy);
        const prevValue = prevItem ? groupPropertyExtractor(prevItem) : undefined;
        const comparisonResult = comparingFunction(currItem, prevValue);
        return comparisonResult;
    }

    getComparingRule = (groupByLabel) => {
        let groupPropertyExtractor, comparingFunction;
        switch (groupByLabel) {
            case GROUPBY_STATUS:
                groupPropertyExtractor = (a) => a.status;
                comparingFunction = this.compareByStatus;
                break;
            case GROUPBY_MONTH:
                groupPropertyExtractor = a => moment.unix(a.createdOn / 1000).format("MMM YYYY");
                comparingFunction = this.compareByMonth;
                break;
            case GROUPBY_ALLOWANCE_TYPE:
                groupPropertyExtractor = a => a.transactionType.name;
                comparingFunction = this.compareByAllowanceType;
                break;
            default:
                break;
        }
        return { groupPropertyExtractor, comparingFunction };
    }

    compareByStatus = (activity, lastValue) => {
        let isNewGroup = lastValue !== activity.status;
        let statusHeading;
        switch (activity.status) {
            case "RE":
                statusHeading = "Requested";
                break;
            case "DE":
                statusHeading = "Declined";
                break;
            case "AP":
                statusHeading = "Approved";
                break;
            case "CR":
                statusHeading = "Credited";
                break;
            case "SU":
                statusHeading = "Submitted";
                break;
            case "CL":
                statusHeading = "Closed";
                break;
        }
        return {
            isNewGroup,
            heading: statusHeading
        };
    }

    compareByMonth = (activity, lastValue) => {
        let isNewGroup = lastValue !== moment.unix(activity.createdOn / 1000).format("MMM YYYY");
        return {
            isNewGroup,
            heading: moment.unix(activity.createdOn / 1000).format("MMMM YYYY")
        };
    }

    compareByAllowanceType = (activity, lastValue) => {
        let isNewGroup = lastValue !== activity.transactionType.name;
        return {
            isNewGroup,
            heading: activity.transactionType.name
        };
    }


}

export default connect(mapStateToProps, mapDispatchToProps)(FinanceTeamTransaction);