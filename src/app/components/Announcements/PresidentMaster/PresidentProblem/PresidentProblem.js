import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import { Button } from 'material-ui';
import AnnouncementService from '../../AnnouncementService';
import Filters from '../../CommonComponents/Filters';
import Pagination from '../../../Common/Pagination/Pagination';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import PresidentCreateSolutionWithProblem from '../PresidentCommon/PresidentCreateSolutionWithProblem';
import { CommonService } from '../../../Layout/Common.service';
import { riverToast } from "../../../Common/Toast/Toast";
import PresidentAddSolutionDialog from "../PresidentProblem/PresidentAddSolutionDialog";
import AnnouncementSolutionDetails from "../../CommonComponents/AnnouncementSolutionDetails";
import UpdateSolutionDialog from "../../CommonComponents/UpdateSolutionDialog";
import AnnouncementProblemTile from "../../CommonComponents/AnnouncementProblemTile/AnnouncementProblemTile";
//css
import './PresidentProblem.scss';
const LEADER_PROBLEM = "L";
const STATUS_CLOSE = "CLO";
const STATUS_OPEN = "OPN";
const GROUP_BY_STATUS = "ST";
const GROUP_BY_DATE = "DT";
const PROBLEM_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        PresidentProblemStore: state.PresidentProblemReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        filterTypeChange: (filterType) => {
            dispatch({
                type: "ON-FILTERTYPE-CHANGE",
                payload: filterType
            });
        },
        filterClubByChange: (filterClubBy) => {
            dispatch({
                type: "ON-FILTERCLUBBY-CHANGE",
                payload: filterClubBy
            });
        },
        filterListChange: (filterList) => {
            dispatch({
                type: "ON-FILTERLIST-CHANGE",
                payload: filterList
            });
        }

    }
}

class PresidentProblem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            searchText: "",
            announcementDockOpen: false,
            handleCreateSolutionDialog: false,
            handleAddSolutionDialog: false,
            solutionDockOpen: false,
            updateSolutionDialog: false,
            showMore: false,
            solutionDetails: "",
            tagList: [],
            detail: "",
            userDetails: "",
            problemDetail: "",
            clubBy: "ST",
            statusBy: "ALL",
            page: 0,
        }
        this.filterStatusList = this.getFilterStatusList();
        this.filterClubByList = this.getFilterClubList();
    }
    componentDidMount() {
        this.userDetails();
        this.getAnnouncementproblemList();
    }
    getAnnouncementproblemList = (
        searchText = this.state.searchText,
        statusBy = this.state.statusBy,
        clubBy = this.state.clubBy,
        page = this.state.page,
        count = PROBLEM_COUNT,
        filter = "PR"
    ) => {
        AnnouncementService.getAnnouncementProblemList(searchText, filter, statusBy, clubBy, page, count)
            .then(
                announcementsList => {
                    let filterList = [...this.props.PresidentProblemStore.filterList, ...announcementsList];
                    this.props.filterListChange(filterList);
                    const showMore = PROBLEM_COUNT <= announcementsList.length;
                    this.setState({
                        showMore
                    });
                }
            ).catch(
                error => {
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    componentWillUnmount() {
        this.filterListReset();
    }
    filterListReset=()=>{
        this.props.filterListChange([])
    }
    render() {
        return (
            <div className="president-Problem-wrapper">
                <div className='row'>
                    <div className='col-md-10'>
                        <Filters
                            input="Group By"
                            selectedStatus={this.state.statusBy}
                            selectedClubBy={this.state.clubBy}
                            filterStatusList={this.filterStatusList}
                            filterClubByList={this.filterClubByList}
                            onFilterChange={this.handleFilterChange}
                        />
                    </div>
                    {this.props.president === true &&
                        <div className='col-md-2 create-solution-button'>
                            <Button className='btn-primary button' onClick={this.handleCreateSolutionDialogOpen}>CREATE SOLUTION</Button>
                        </div>
                    }
                    {this.state.handleCreateSolutionDialog === true &&
                        <PresidentCreateSolutionWithProblem
                            tagList={this.state.tagList}
                            isLoading={this.state.isLoading}
                            open={this.state.handleCreateSolutionDialog}
                            tagListCall={this.handleTagSelect}
                            onCreate={this.handleCreateSolution}
                            onClose={this.handleCreateSolutionClose}
                        />
                    }
                </div>

                <div className="problem-list-wrapper">
                    {
                        this.getProblemTileTemplate(this.props.PresidentProblemStore.filterList)
                    }
                </div>
                <div className="loadmore">
                    {this.state.showMore && <Button className="btn-default" onClick={this.onLoadMore}>Load More</Button>}
                </div>

                <a style={{ "display": "none" }} id="download-anchor" ></a>
                <Dock
                    size={0.5}
                    zIndex={200}
                    position="right"
                    isVisible={this.state.announcementDockOpen}
                    dimMode="none"
                    defaultSize={.5}
                >
                    <AnnouncementProblemDetails
                        leader={false}
                        president={this.props.president}
                        userDetails={this.state.userDetails}
                        problemDetail={this.state.detail}
                        isLoading={this.state.isLoading}
                        handleAddSolutionDialog={this.handleAddSolutionDialogOpen}
                        onSolutionTileSelect={this.onSolutionTileSelect}
                        onAttachmentSelect={this.handleAttachmentSelect}
                        handleDetailAttachment={this.handleDetailAttachment}
                        dockClose={this.announcementDockClose}
                    />

                </Dock>
                <Dock
                    size={0.48}
                    zIndex={200}
                    position="right"
                    isVisible={this.state.solutionDockOpen}
                    dimMode="none"
                    defaultSize={.5}
                >
                    <AnnouncementSolutionDetails
                        userDetails={this.state.userDetails}
                        solutionDetails={this.state.solutionDetails}
                        isLoading={this.state.isLoading}
                        onAttachmentSelect={this.handleAttachmentSelect}
                        dockClose={this.solutionDockClose}
                        onUpdateSolutionClick={this.onUpdateSolutionOpen}
                    />

                </Dock>
                {
                    this.state.updateSolutionDialog === true &&
                    <UpdateSolutionDialog
                        open={this.state.updateSolutionDialog}
                        solutionDetails={this.state.solutionDetails}
                        onClose={this.onUpdateSolutionClose}
                        onCreate={this.onClickUpdate}
                    />
                }

                {this.state.handleAddSolutionDialog === true &&
                    this.state.problemDetail &&
                    <PresidentAddSolutionDialog

                        problemDetail={this.state.problemDetail}
                        open={this.state.handleAddSolutionDialog}
                        onClose={this.handleAddSolutionDialogClose}
                        onCreate={this.handleAddSolutionForProblem}
                    />
                }
            </div>
        );
    }
    getProblemTileTemplate = (problemList) => {
        let template = (<div className='no-input'>No Problems Found</div>);
        const hasPrivilage = this.props.president === true;

        if (problemList && problemList.length > 0) {
            template = problemList.map((problem) => {
                const actionButtons = (<React.Fragment>
                    {
                        (hasPrivilage && problem.status.name === "open" && problem.problemType === LEADER_PROBLEM) &&
                        <Button
                            title="Propose Solution"
                            className='btn-primary'
                            onClick={this.handleAddSolutionDialog(problem)}
                        >Propose Solution</Button>
                    }
                </React.Fragment>)
                return (
                    <AnnouncementProblemTile
                        president={this.props.president}
                        actionButtons={actionButtons}
                        key={problem.id}
                        values={problem}
                        onSelect={this.click}
                    />);
            })
        }
        return template;
    }

    onLoadMore = () => {
        const page = this.state.page + 1;
        this.setState({ page });
        this.getAnnouncementproblemList(
            this.state.searchText,
            this.state.statusBy,
            this.state.clubBy,
            page,
            PROBLEM_COUNT
        );
    }

    handleAddSolutionDialog = (problem) => (event) => {
        event.stopPropagation();
        this.handleAddSolutionDialogOpen(problem);
    }

    solutionDockClose = () => {
        this.setState({ solutionDockOpen: false });
    }
    onUpdateSolutionOpen = () => {
        this.setState({ updateSolutionDialog: true });
    }
    onUpdateSolutionClose = () => {
        this.setState({ updateSolutionDialog: false });
    }
    onClickUpdate = (request, solutionId) => {
        return AnnouncementService.putSolutionDetails(request, solutionId)
            .then(() => {
                riverToast.show("solution updated");
                this.getSolutionDetail(solutionId);
                this.filterListReset();
                this.getAnnouncementproblemList();
                this.setState({ updateSolutionDialog: false });
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating solution.");
                throw "task update error"
            });

    }

    onSolutionTileSelect = (solutionDetail) => {
        this.loadSolutionDetail();
        this.getSolutionDetail(solutionDetail.id);
    }
    getSolutionDetail = (solutionId) => {
        AnnouncementService.getSolutionDetails(solutionId)
            .then(
                solutiondetail => {
                    this.setState({ isLoading: false });
                    this.setState({ solutionDetails: solutiondetail });
                }
            ).catch(
                error => {
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    loadSolutionDetail = () => {
        this.setState({ isLoading: true });
        this.setState({ solutionDockOpen: true });
    }
    handleFilterChange = (config) => {
        this.filterListReset();
        let statusBy = config.status;
        let clubBy = config.clubBy;
        let searchText = config.search;
        let page = 0;
        let count = PROBLEM_COUNT;
        this.setState({
            statusBy: config.status,
            clubBy: config.clubBy,
            searchText: config.search,
            page: page,
        });
        this.getAnnouncementproblemList(searchText, statusBy, clubBy, page, count);


    }

    getFilterStatusList = () => {
        return [
            { title: "ALL", value: "ALL" },
            { title: "OPEN", value: "OPN" },
            { title: "CLOSE", value: "CLO" }

        ];
    }
    getFilterClubList = () => {
        return [
            { title: "STATUS", value: "ST" },
            { title: "DATE", value: "DT" }
        ];
    }
    click = (element) => {
        this.loadAnnouncementDetails(element.id);
        this.handleAnnouncementDetailCall(element);
    }
    handleAnnouncementDetailCall = (element) => {
        AnnouncementService.getProblemDetails(element.id)
            .then(
                announcementsdetail => {
                    this.setState({ isLoading: false });
                    this.setState({ detail: announcementsdetail });
                }
            )
            .catch(
                error => {
                    riverToast.show(error.status_message || "error on problem detail");
                }
            )
    }

    handleTagSelect = (search) => {
        const page = this.state.page;
        AnnouncementService.handleTagSelect(search, page)
            .then(tagList => {
                let tagArrayList = [];
                tagList.map((tag) => {
                    tagArrayList.push({
                        title: tag.name,
                        label: tag.name,
                        value: tag.code,
                        id: tag.code
                    });
                });
                this.setState({ tagList: tagArrayList });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            });
    }

    handleAttachmentSelect = (file) => {
        this.setState({ isLoading: true });
        CommonService.downloadFromUrl(file.path, 'announcement/solution/attachment/{?}')
            .then(blob => {
                const dlnk = document.getElementById('download-anchor');
                const objectUrl = window.URL.createObjectURL(blob);
                dlnk.href = objectUrl;
                dlnk.target = '_blank';
                dlnk.download = file.name;
                dlnk.click();
                window.URL.revokeObjectURL(objectUrl);
                this.setState({ isLoading: false });
            })
            .catch(error => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || 'Something went wrong while downloading file.');
            });
    }



    handleDetailAttachment = (file) => {
        this.setState({ isLoading: true });
        CommonService.downloadFromUrl(file.path, 'announcement/problem/attachment/{?}')
            .then(blob => {
                const dlnk = document.getElementById('download-anchor');
                const objectUrl = window.URL.createObjectURL(blob);
                dlnk.href = objectUrl;
                dlnk.target = '_blank';
                dlnk.download = file.name;
                dlnk.click();
                window.URL.revokeObjectURL(objectUrl);
                this.setState({ isLoading: false });
            })
            .catch(error => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || 'Something went wrong while downloading file.');
            });
    }

    handleCreateSolution = (request) => {
        return AnnouncementService.handlePostSolutionWithProblem(request)
            .then(() => {
                this.handleCreateSolutionClose();
                this.filterListReset();
                this.getAnnouncementproblemList();
                riverToast.show("Solution is created sucessfully");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating Announcement.");
                throw "announcement create error"
            });
    }
    handleAddSolutionForProblem = (request, problemDetail) => {
        const problemId = problemDetail.id
        return AnnouncementService.handleAddSolutionForProblem(request, problemId)
            .then(() => {
                this.handleAddSolutionDialogClose();
                this.filterListReset();
                this.handleAnnouncementDetailCall(problemDetail);
                this.getAnnouncementproblemList();
                riverToast.show("Solution is created sucessfully");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating Announcement.");
                throw "announcement create error"
            });
    }

    userDetails = () => {
        AnnouncementService.userDetails()
            .then(userDetails => {
                this.setState({ userDetails: userDetails })
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong");

            });
    }

    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
    loadAnnouncementDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ announcementDockOpen: true });
    }
    handleCreateSolutionDialogOpen = () => {
        this.handleTagSelect();
        this.setState({ handleCreateSolutionDialog: true });
    }
    handleAddSolutionDialogOpen = (problemDetail) => {

        this.setState({ problemDetail: problemDetail })
        this.setState({ handleAddSolutionDialog: true });
    }
    handleCreateSolutionClose = () => {
        this.setState({ handleCreateSolutionDialog: false });
    }
    handleAddSolutionDialogClose = () => {
        this.setState({ handleAddSolutionDialog: false })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PresidentProblem);