import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import moment from 'moment';
import FinanceService from '../../Finance.service';
import { riverToast } from '../../../Common/Toast/Toast';
import Filters from '../../CommonUtils/Filters/Filters';
import { CommonService } from '../../../Layout/Common.service';
import {
    setFinanceTeamHistorySearch, setFinanceTeamHistoryType, setFinanceTeamHistoryStatus,
    setFinanceTeamHistoryGroupBy, setFinanceTeamHistoryList, setFinanceTeamHistoryDockTransactionDetails,
    setFinanceTeamHistoryDockDiscussionDetails, clearFinanceTeamHistoryDockDetails
} from './FinanceTeamHistory.action';
import Pagination from '../../../Common/Pagination/Pagination';
import StackedList from '../../CommonUtils/StackedList/StackedList';
import FinanceTeamListItemTile from '../FinanceTeamListItemTile/FinanceTeamListItemTile';
import FinanceTeamApproveDialog from '../FinanceTeamApproveDialog/FinanceTeamApproveDialog';
import FinanceTeamListItemDockDetails from '../FinanceTeamListItemDockDetails/FinanceTeamListItemDockDetails';
import './FinanceTeamHistory.scss';

const GROUPBY_MONTH = 'DT';
const GROUPBY_STATUS = 'ST';
const GROUPBY_ALLOWANCE_TYPE = 'AT';

const mapStateToProps = (state) => {
    return {
        FinanceTeamHistoryStore: state.FinanceTeamHistoryReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setFilterSearchText: (filterSearchText) => {
            dispatch(setFinanceTeamHistorySearch(filterSearchText));
        },
        setFilterType: (filterType) => {
            dispatch(setFinanceTeamHistoryType(filterType));
        },
        setFilterStatus: (filterStatus) => {
            dispatch(setFinanceTeamHistoryStatus(filterStatus));
        },
        setFilterGroupBy: (filterGroupBy) => {
            dispatch(setFinanceTeamHistoryGroupBy(filterGroupBy));
        },
        setHistoryList: (historyList) => {
            dispatch(setFinanceTeamHistoryList(historyList));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setFinanceTeamHistoryDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setFinanceTeamHistoryDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearFinanceTeamHistoryDockDetails());
        }
    }
};

class FinanceTeamHistory extends Component {

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

            pageNo: 0,
            pageSize: 10,
            forwardEnabled: false
        }

        this.filterTypeList = this.getFilterTypeList();
        this.filterStatusList = this.getFilterStatusList();
        this.filterGroupByList = this.getFilterGroupByList();
    }

    componentDidMount() {
        this.loadHistoryList();
    }

    render() {
        return (
            <div className="finance-team-history-wrapper">

                <Filters
                    filterTypeList={this.filterTypeList}
                    filterStatusList={this.filterStatusList}
                    filterGroupByList={this.filterGroupByList}
                    selectedType={this.props.FinanceTeamHistoryStore.filterType}
                    selectedStatus={this.props.FinanceTeamHistoryStore.filterStatus}
                    selectedGroupBy={this.props.FinanceTeamHistoryStore.filterGroupBy}
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
                    listData={this.props.FinanceTeamHistoryStore.historyList}
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
                    this.props.FinanceTeamHistoryStore.historyList.length > 8 &&
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
                            transaction={this.props.FinanceTeamHistoryStore.dockTransactionDetails}
                            discussion={this.props.FinanceTeamHistoryStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={false}
                            onArchiveBtnClick={this.handleArchiveBtnClick}
                            approveTransactionHandler={this.handleApproveBtnClick}
                            creditTransactionHandler={this.handleCreditedBtnClick}
                            completedTransactionHandler={this.handleCompletedBtnClick}
                            rejectTransactionHandler={this.handleRejectBtnClick}
                            deescalateTransactionHandler={this.handleDeescalateBtnClick}
                        />
                    </Dock>
                }

                <FinanceTeamApproveDialog
                    isDialogOpen={this.state.isSubmitDialogOpen}
                    isLoading={this.state.isSubmitDialogLoading}
                    approveTransactionHandler={this.handleBillSubmit}
                    cancelHandler={this.handleBillCancel}
                    transaction={this.props.FinanceTeamHistoryStore.dockTransactionDetails}
                />
            </div>
        );
    }

    loadHistoryList(
        type = this.props.FinanceTeamHistoryStore.filterType,
        status = this.props.FinanceTeamHistoryStore.filterStatus,
        groupBy = this.props.FinanceTeamHistoryStore.filterGroupBy,
        searchText = this.props.FinanceTeamHistoryStore.filterSearchText,
        page = this.state.pageNo,
        count = this.state.pageSize,
    ) {

        FinanceService.getFinanceTeamHistoryList(type, status, groupBy, searchText, page, count)
            .then(historyList => {
                this.props.setHistoryList(historyList);
                this.setState({ forwardEnabled: (historyList.length === this.state.pageSize) });
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
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
            { title: "DECLINED", value: "DE" },
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
        this.loadHistoryList(type, status, groupBy, searchText, page, count);
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
                this.loadHistoryList();
            }
            )
            .catch(error => {
                this.setState({ isDockLoading: false });
                riverToast.show(error.status_message || "Something went wrong in the network. Unable to archive transaction at the moment.");
            }
            );
    }

    handleApproveBtnClick = () => {
        this.setState({ isSubmitDialogOpen: true });
    }

    handleCreditedBtnClick = () => {
        riverToast.show("Credited");
    }

    handleCompletedBtnClick = () => {
        riverToast.show("Completed");
    }

    handleRejectBtnClick = () => {
        riverToast.show("Rejected");
    }

    handleDeescalateBtnClick = () => {
        riverToast.show("Deescalated");
    }


    handleCreateTransactionDialog = () => {
        ;
        this.setState({ isCreateTransactionDialogOpen: true });
    }

    handleCloseDialog = () => {
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
                this.loadHistoryList();
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

    handlePageForward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamHistoryStore.filterType;
        let status = this.props.FinanceTeamHistoryStore.filterStatus;
        let groupBy = this.props.FinanceTeamHistoryStore.filterGroupBy;
        let searchText = this.props.FinanceTeamHistoryStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadHistoryList(type, status, groupBy, searchText, page, count);
    }

    handlePageBackward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamHistoryStore.filterType;
        let status = this.props.FinanceTeamHistoryStore.filterStatus;
        let groupBy = this.props.FinanceTeamHistoryStore.filterGroupBy;
        let searchText = this.props.FinanceTeamHistoryStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadHistoryList(type, status, groupBy, searchText, page, count);
    }

    handlePageEnd = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamHistoryStore.filterType;
        let status = this.props.FinanceTeamHistoryStore.filterStatus;
        let groupBy = this.props.FinanceTeamHistoryStore.filterGroupBy;
        let searchText = this.props.FinanceTeamHistoryStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadHistoryList(type, status, groupBy, searchText, page, count);
    }

    handlePageStart = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.FinanceTeamHistoryStore.filterType;
        let status = this.props.FinanceTeamHistoryStore.filterStatus;
        let groupBy = this.props.FinanceTeamHistoryStore.filterGroupBy;
        let searchText = this.props.FinanceTeamHistoryStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadHistoryList(type, status, groupBy, searchText, page, count);
    }



    comparator = (prevItem, currItem) => {
        const groupBy = this.props.FinanceTeamHistoryStore.filterGroupBy;
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
            heading: moment.unix(activity.createdOn / 1000).format("MMMM")
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

export default connect(mapStateToProps, mapDispatchToProps)(FinanceTeamHistory);