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
    setCfoTransactionSearch, setCfoTransactionType, setCfoTransactionStatus,
    setCfoTransactionGroupBy, setCfoTransactionList, appendCfoTransactionList,
    setCfoTransactionDockTransactionDetails, setCfoTransactionDockDiscussionDetails,
    clearCfoTransactionDockDetails
} from './CfoTransaction.action';
import CfoListItemTile from '../CfoListItemTile/CfoListItemTile';
import CfoApproveDialog from '../CfoApproveDialog/CfoApproveDialog';
import CfoRejectDialog from '../CfoRejectDialog/CfoRejectDialog';
import CfoListItemDockDetails from '../CfoListItemDockDetails/CfoListItemDockDetails';
import './CfoTransaction.scss';

const GROUPBY_MONTH = 'DT';
const GROUPBY_STATUS = 'ST';
const GROUPBY_ALLOWANCE_TYPE = 'AT';

const mapStateToProps = (state) => {
    return {
        CfoTransactionStore: state.CfoTransactionReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setFilterSearchText: (filterSearchText) => {
            dispatch(setCfoTransactionSearch(filterSearchText));
        },
        setFilterType: (filterType) => {
            dispatch(setCfoTransactionType(filterType));
        },
        setFilterStatus: (filterStatus) => {
            dispatch(setCfoTransactionStatus(filterStatus));
        },
        setFilterGroupBy: (filterGroupBy) => {
            dispatch(setCfoTransactionGroupBy(filterGroupBy));
        },
        setTransactionList: (transactionList) => {
            dispatch(setCfoTransactionList(transactionList));
        },
        appendTransactionList: (appendItem) => {
            dispatch(appendCfoTransactionList(appendItem));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setCfoTransactionDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setCfoTransactionDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearCfoTransactionDockDetails());
        }
    }
};

class CfoTransaction extends Component {

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
            <div className="cfo-transaction-wrapper">

                <Filters
                    filterTypeList={this.filterTypeList}
                    filterStatusList={this.filterStatusList}
                    filterGroupByList={this.filterGroupByList}
                    selectedType={this.props.CfoTransactionStore.filterType}
                    selectedStatus={this.props.CfoTransactionStore.filterStatus}
                    selectedGroupBy={this.props.CfoTransactionStore.filterGroupBy}
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
                    listData={this.props.CfoTransactionStore.transactionList}
                    itemTemplate={<CfoListItemTile />}
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
                    this.props.CfoTransactionStore.transactionList.length > 8 &&
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
                            transaction={this.props.CfoTransactionStore.dockTransactionDetails}
                            discussion={this.props.CfoTransactionStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={false}
                            approveTransactionHandler={this.handleApproveBtnClick}
                            rejectTransactionHandler={this.handleRejectBtnClick}
                        />
                    </Dock>
                }

                <CfoApproveDialog
                    isDialogOpen={this.state.isApproveDialogOpen}
                    isLoading={this.state.isApproveDialogLoading}
                    approveTransactionHandler={this.handleApproveSubmit}
                    cancelHandler={this.handleApproveCancel}
                    transaction={this.props.CfoTransactionStore.dockTransactionDetails}
                />

                <CfoRejectDialog
                    isDialogOpen={this.state.isRejectDialogOpen}
                    isLoading={this.state.isRejectDialogLoading}
                    rejectTransactionHandler={this.handleRejectSubmit}
                    cancelHandler={this.handleRejectCancel}
                    transaction={this.props.CfoTransactionStore.dockTransactionDetails}
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
        type = this.props.CfoTransactionStore.filterType,
        status = this.props.CfoTransactionStore.filterStatus,
        groupBy = this.props.CfoTransactionStore.filterGroupBy,
        searchText = this.props.CfoTransactionStore.filterSearchText,
        page = this.state.pageNo,
        count = this.state.pageSize,
    ) => {

        FinanceService.getCfoTransactionList(type, status, groupBy, searchText, page, count)
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

        return FinanceService.approveCfoTransaction(id, transaction)
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

        return FinanceService.rejectCfoTransaction(id, transaction)
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

    handlePageForward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.CfoTransactionStore.filterType;
        let status = this.props.CfoTransactionStore.filterStatus;
        let groupBy = this.props.CfoTransactionStore.filterGroupBy;
        let searchText = this.props.CfoTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageBackward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.CfoTransactionStore.filterType;
        let status = this.props.CfoTransactionStore.filterStatus;
        let groupBy = this.props.CfoTransactionStore.filterGroupBy;
        let searchText = this.props.CfoTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageEnd = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.CfoTransactionStore.filterType;
        let status = this.props.CfoTransactionStore.filterStatus;
        let groupBy = this.props.CfoTransactionStore.filterGroupBy;
        let searchText = this.props.CfoTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageStart = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.CfoTransactionStore.filterType;
        let status = this.props.CfoTransactionStore.filterStatus;
        let groupBy = this.props.CfoTransactionStore.filterGroupBy;
        let searchText = this.props.CfoTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }



    comparator = (prevItem, currItem) => {
        const groupBy = this.props.CfoTransactionStore.filterGroupBy;
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

export default connect(mapStateToProps, mapDispatchToProps)(CfoTransaction);