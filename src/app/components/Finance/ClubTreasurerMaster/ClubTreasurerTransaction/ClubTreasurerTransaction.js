import React, { Component } from 'react';
import Dock from 'react-dock';
import moment from 'moment';
import { connect } from "react-redux";
import Button from 'material-ui/Button';
import FinanceService from '../../Finance.service';
import { riverToast } from '../../../Common/Toast/Toast';
import Filters from '../../CommonUtils/Filters/Filters';
import { CommonService } from '../../../Layout/Common.service';
import Pagination from '../../../Common/Pagination/Pagination';
import StackedList from '../../CommonUtils/StackedList/StackedList';
import {
    setClubTreasurerTransactionSearch, setClubTreasurerTransactionType, setClubTreasurerTransactionStatus,
    setClubTreasurerTransactionGroupBy, setClubTreasurerTransactionList, appendClubTreasurerTransactionList,
    setClubTreasurerTransactionDockTransactionDetails, setClubTreasurerTransactionDockDiscussionDetails,
    clearClubTreasurerTransactionDockDetails
} from './ClubTreasurerTransaction.action';
import ClubTreasurerListItemTile from '../ClubTreasurerListItemTile/ClubTreasurerListItemTile';
import ClubTreasurerSubmitDialog from '../ClubTreasurerSubmitDialog/ClubTreasurerSubmitDialog';
import ClubTreasurerDeleteDialog from '../ClubTreasurerDeleteDialog/ClubTreasurerDeleteDialog';
import CreateTransactionDialog from '../../CommonUtils/CreateTransactionDialog/CreateTransactionDialog';
import ClubTreasurerListItemDockDetails from '../ClubTreasurerListItemDockDetails/ClubTreasurerListItemDockDetails';
import './ClubTreasurerTransaction.scss';

const GROUPBY_MONTH = 'DT';
const GROUPBY_STATUS = 'ST';
const GROUPBY_ALLOWANCE_TYPE = 'AT';

const mapStateToProps = (state) => {
    return {
        ClubTreasurerTransactionStore: state.ClubTreasurerTransactionReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setFilterSearchText: (filterSearchText) => {
            dispatch(setClubTreasurerTransactionSearch(filterSearchText));
        },
        setFilterType: (filterType) => {
            dispatch(setClubTreasurerTransactionType(filterType));
        },
        setFilterStatus: (filterStatus) => {
            dispatch(setClubTreasurerTransactionStatus(filterStatus));
        },
        setFilterGroupBy: (filterGroupBy) => {
            dispatch(setClubTreasurerTransactionGroupBy(filterGroupBy));
        },
        setTransactionList: (transactionList) => {
            dispatch(setClubTreasurerTransactionList(transactionList));
        },
        appendTransactionList: (appendItem) => {
            dispatch(appendClubTreasurerTransactionList(appendItem));
        },
        setDockTransactionDetails: (transaction) => {
            dispatch(setClubTreasurerTransactionDockTransactionDetails(transaction));
        },
        setDockDiscussionDetails: (discussion) => {
            dispatch(setClubTreasurerTransactionDockDiscussionDetails(discussion));
        },
        clearDockTransactionDetails: () => {
            dispatch(clearClubTreasurerTransactionDockDetails());
        }
    }
};

class ClubTreasurerTransaction extends Component {

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
            <div className="club-treasurer-transaction-wrapper">
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

                <Filters
                    filterTypeList={this.filterTypeList}
                    filterStatusList={this.filterStatusList}
                    filterGroupByList={this.filterGroupByList}
                    selectedType={this.props.ClubTreasurerTransactionStore.filterType}
                    selectedStatus={this.props.ClubTreasurerTransactionStore.filterStatus}
                    selectedGroupBy={this.props.ClubTreasurerTransactionStore.filterGroupBy}
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
                    listData={this.props.ClubTreasurerTransactionStore.transactionList}
                    itemTemplate={<ClubTreasurerListItemTile />}
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
                    this.props.ClubTreasurerTransactionStore.transactionList.length > 8 &&
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
                            transaction={this.props.ClubTreasurerTransactionStore.dockTransactionDetails}
                            discussion={this.props.ClubTreasurerTransactionStore.dockDiscussionDetails}
                            onDiscussionSubmit={this.handleDiscussionSubmit}
                            onAttachmentSelect={this.handleAttachmentSelect}
                            isArchivePossible={true}
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
                    transaction={this.props.ClubTreasurerTransactionStore.dockTransactionDetails}
                />

                <ClubTreasurerDeleteDialog
                    isDialogOpen={this.state.isDeleteDialogOpen}
                    isLoading={this.state.isDeleteDialogLoading}
                    deleteTransactionHandler={this.handleDeleteTransactionSubmit}
                    cancelHandler={this.handleDeleteTransactionCancel}
                    transaction={this.props.ClubTreasurerTransactionStore.dockTransactionDetails}
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
            { title: "MONTH", value: "DT" },
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
                this.props.appendTransactionList(responseJSON);
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
        type = this.props.ClubTreasurerTransactionStore.filterType,
        status = this.props.ClubTreasurerTransactionStore.filterStatus,
        groupBy = this.props.ClubTreasurerTransactionStore.filterGroupBy,
        searchText = this.props.ClubTreasurerTransactionStore.filterSearchText,
        page = this.state.pageNo,
        count = this.state.pageSize,
    ) => {

        FinanceService.getClubTreasurerTransactionList(type, status, groupBy, searchText, page, count)
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
                this.loadTransactionList();
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
                this.loadTransactionList();
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

        let type = this.props.ClubTreasurerTransactionStore.filterType;
        let status = this.props.ClubTreasurerTransactionStore.filterStatus;
        let groupBy = this.props.ClubTreasurerTransactionStore.filterGroupBy;
        let searchText = this.props.ClubTreasurerTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageBackward = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.ClubTreasurerTransactionStore.filterType;
        let status = this.props.ClubTreasurerTransactionStore.filterStatus;
        let groupBy = this.props.ClubTreasurerTransactionStore.filterGroupBy;
        let searchText = this.props.ClubTreasurerTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageEnd = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.ClubTreasurerTransactionStore.filterType;
        let status = this.props.ClubTreasurerTransactionStore.filterStatus;
        let groupBy = this.props.ClubTreasurerTransactionStore.filterGroupBy;
        let searchText = this.props.ClubTreasurerTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }

    handlePageStart = (pageData) => {
        this.setState({ pageNo: pageData.page });

        let type = this.props.ClubTreasurerTransactionStore.filterType;
        let status = this.props.ClubTreasurerTransactionStore.filterStatus;
        let groupBy = this.props.ClubTreasurerTransactionStore.filterGroupBy;
        let searchText = this.props.ClubTreasurerTransactionStore.filterSearchText;
        let count = this.state.pageSize;
        let page = pageData.page;

        this.loadTransactionList(type, status, groupBy, searchText, page, count);
    }



    comparator = (prevItem, currItem) => {
        const groupBy = this.props.ClubTreasurerTransactionStore.filterGroupBy;
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

export default connect(mapStateToProps, mapDispatchToProps)(ClubTreasurerTransaction);