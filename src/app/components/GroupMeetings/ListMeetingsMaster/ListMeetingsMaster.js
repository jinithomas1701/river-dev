import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Button from 'material-ui/Button';
import Filters from '../../Finance/CommonUtils/Filters/Filters';
import GroupMeetingsService from '../GroupMeetings.service';
import { riverToast } from '../../Common/Toast/Toast';
import GroupMeetingsTile from '../CommonUtils/GroupMeetingsTile/GroupMeetingsTile';
import StackedList from '../../Common/StackedList/StackedList';
import moment from 'moment';
import { Util } from '../../../Util/util';
import './ListMeetingsMaster.scss';

const PRIVILEGE_CREATE_MEETING = "MTN_CREATE";
const PRIVILEGE_SHOW_MEETING_LIST = "MTN_GET_MEETING_LIST";

const GROUPBY_STATUS = "ST";
const GROUPBY_MONTH = "DT";
const CLUBMEETING ="CM";
const ALL = "ALL";

class ListMeetingsMaster extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: "",
            type: CLUBMEETING,
            status: ALL,
            groupBy:GROUPBY_STATUS,
            page: 0,
            count: 10,
            meetingList: [],
            showLoadMore: false
        }
        this.filterTypeList = this.getFilterTypeList();
        this.filterStatusList = this.getFilterStatusList();
        this.filterGroupByList = this.getFilterGroupByList();
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const state = this.state;
        const showCreateButton = Util.hasPrivilage(PRIVILEGE_CREATE_MEETING);
        const showMeetingList = Util.hasPrivilage(PRIVILEGE_SHOW_MEETING_LIST);

        return (
            <div className="list-meetings-page-wrapper">
                <Filters
                    theme="light"
                    filterTypeList={this.filterTypeList}
                    filterStatusList={this.filterStatusList}
                    filterGroupByList={this.filterGroupByList}
                    selectedType={state.type}
                    selectedStatus={state.status}
                    selectedGroupBy={state.groupBy}
                    onFilterChange={this.filterChangeHandler}
                />

                {
                    showCreateButton &&
                    <div className="create-meetings-button-wrapper">
                        <Button className="btn-primary" onClick={this.createMeetingHandler}>Create</ Button>
                    </div>
                }

                {
                    showMeetingList ?
                        state.meetingList.length > 0 ?
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="meetings-list-wrapper">
                                        <StackedList
                                            listData={state.meetingList}
                                            className=""
                                            itemTemplate={<GroupMeetingsTile />}
                                            comparator={this.comparator}
                                            itemProps={
                                                {
                                                    onClick: this.meetingItemClickHandler
                                                }
                                            }
                                            headerBgColor="#f9f9f9"
                                        />
                                    </div>
                                    {
                                        state.showLoadMore &&
                                        <div className="load-more-button-wrapper">
                                            <Button className="btn-default" onClick={this.loadMoreMeetingListHandler}>Load More</Button>
                                        </div>
                                    }
                                </div>
                            </div> :
                            <div className="empty-content-container">No meetings</div> :
                        <div className="empty-content-container">No meetings</div>
                }
            </div>
        );
    }

    init = () => {
        this.getGroupMeetingsList();
    }

    getGroupMeetingsList = (
        search = this.state.search,
        type = this.state.type,
        status = this.state.status,
        groupBy = this.state.groupBy,
        page = this.state.page,
        count = this.state.count
    ) => {
        GroupMeetingsService.getGroupMeetingsList(search, type, status, groupBy, page, count)
            .then(meetingList => {
                const showLoadMore = meetingList.length < this.state.count ? false : true;
                const appendedMeetingList = page !== 0 ?[...this.state.meetingList, ...meetingList]:meetingList;
                this.setState({
                    meetingList: appendedMeetingList,
                    showLoadMore
                });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Failed to fetch meeting list.")
            })
    }

    getFilterTypeList = () => {
        return ([
            { title: "CLUB MEETING", value: "CM" }
        ]);
    }

    getFilterStatusList = () => {
        return ([
            { title: "ALL", value: "ALL" },
            { title: "UPCOMING", value: "UPC" },
            { title: "ONGOING", value: "ONG" },
            { title: "CONCLUDED", value: "CON" }
        ]);
    }

    getFilterGroupByList = () => {
        return ([
            { title: "STATUS", value: "ST" },
            { title: "MONTH", value: "DT" },
        ]);
    }

    filterChangeHandler = (filter) => {
        let search = filter.search;
        let type = filter.type;
        let status = filter.status;
        let groupBy = filter.groupBy;
        let page = 0;
        let count = this.state.count;

        this.getGroupMeetingsList(search, type, status, groupBy, page, count)
        this.setState({
            search, type, status, groupBy, page, count
        })
    }

    createMeetingHandler = () => {
        this.props.history.push("/group-meetings/create");
    }

    meetingItemClickHandler = (meeting) => {
        this.props.history.push("/group-meetings/view/" + meeting.referenceCode);
    }

    comparator = (prevItem, currItem) => {
        const groupBy = this.state.groupBy;
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
                groupPropertyExtractor = (a) => moment.unix(a.startTime / 1000).format("MMM YYYY");
                comparingFunction = this.compareByMonth;
                break;
            default:
                break;
        }
        return { groupPropertyExtractor, comparingFunction };
    }

    compareByStatus = (meeting, lastValue) => {
        let isNewGroup = lastValue !== meeting.status;
        let statusHeading;
        switch (meeting.status) {
            case "UPC":
                statusHeading = "Upcoming";
                break;
            case "ONG":
                statusHeading = "Ongoing";
                break;
            case "CON":
                statusHeading = "Concluded";
                break;
        }
        return {
            isNewGroup,
            heading: statusHeading
        };
    }

    compareByMonth = (meeting, lastValue) => {
        let isNewGroup = lastValue !== moment.unix(meeting.startTime / 1000).format("MMM YYYY");
        return {
            isNewGroup,
            heading: moment.unix(meeting.startTime / 1000).format("MMMM YYYY")
        };
    }

    loadMoreMeetingListHandler = () => {
        this.getGroupMeetingsList(
            this.state.search,
            this.state.type,
            this.state.status,
            this.state.groupBy,
            this.state.page + 1,
            this.state.count
        );
    }

}

export default withRouter(ListMeetingsMaster);