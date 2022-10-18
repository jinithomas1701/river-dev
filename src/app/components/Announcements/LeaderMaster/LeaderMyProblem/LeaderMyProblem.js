import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import { Button } from 'material-ui';
import AnnouncementService from '../../AnnouncementService';
import Filters from '../../CommonComponents/Filters';
import Pagination from '../../../Common/Pagination/Pagination';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import LeaderStateProblemDialog from '../LeaderProblem/LeaderStateProblemDialog';
import LeaderUpdateProblemDialog from '../LeaderProblem/LeaderUpdateProblemDialog';
import { riverToast } from '../../../Common/Toast/Toast';
import LeaderProblemClosingDialog from '../LeaderProblem/LeaderProblemClosingDialog';
import SolutionApproveDialog from '../../CommonComponents/SolutionApproveDialog';
import AnnouncementSolutionDetails from '../../CommonComponents/AnnouncementSolutionDetails';
import AnnouncementProblemTile from "../../CommonComponents/AnnouncementProblemTile/AnnouncementProblemTile";
//css
import "./LeaderMyProblem.scss";
const STATUS_CLOSE = "CLO";
const STATUS_OPEN = "OPN";
const GROUP_BY_STATUS = "ST";
const GROUP_BY_DATE = "DT";
const PROBLEM_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        LeaderProblemStore: state.LeaderMyProblemReducer
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

class LeaderMyProblem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            searchText: "",
            StateProblemDialog: false,
            announcementDockOpen: false,
            UpdateProblemDialog: false,
            problemClosingDialog: false,
            solutionApproveDialog: false,
            checkedB: false,
            showMore: false,
            solutionDockOpen: false,
            SolutionDetails: "",
            closingProblemId: "",
            problemDetailLoad: "",
            updateProblemdetail: "",
            solutionId: "",
            userDetails: "",
            tagList: [],
            detail: "",
            clubBy: "ST",
            statusBy: "ALL",
            page: 0,
        }
        this.filterStatusList = this.getFilterStatusList();
        this.filterClubByList = this.getFilterClubList();
    }


    componentDidMount() {
        this.userDetails();
        this.handleTagSelect();
        this.getAnnouncementMyProblemList();
    }

    getAnnouncementMyProblemList = (
        searchText = this.state.searchText,
        statusBy = this.state.statusBy,
        clubBy = this.state.clubBy,
        page = this.state.page,
        count = PROBLEM_COUNT
    ) => {
        AnnouncementService.getAnnouncementMyProblemList(searchText, statusBy, clubBy, page, count)
            .then(
                announcementsList => {
                    let filterList = [...this.props.LeaderProblemStore.filterList, ...announcementsList];
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
            <div className="leader-Problem-wrapper">
                <div className='row'>
                    <div className='col-md-10'>
                        <Filters
                            input="Group By"
                            filterStatusList={this.filterStatusList}
                            filterClubByList={this.filterClubByList}
                            selectedStatus={this.state.statusBy}
                            selectedClubBy={this.state.clubBy}
                            onFilterChange={this.handleFilterChange}
                        />
                    </div>
                    <div className='col-md-2 button'>
                        <Button className='btn-primary' onClick={this.StateProblemDialogOpen}>STATE A PROBLEM</Button>
                    </div>
                </div>

                <div className="problem-list-wrapper">
                    {
                        this.getProblemTileTemplate(this.props.LeaderProblemStore.filterList)
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
                        admin={false}
                        president={false}
                        leader={this.props.leader}
                        onSolutionTileSelect={this.onSolutionTileSelect}
                        handleTaskAttachmentSelect={this.handleTaskAttachmentSelect}
                        userDetails={this.state.userDetails}
                        onAttachmentSelect={this.handleAttachmentSelect}
                        checkedB={this.state.checkedB}
                        solutionApproveDialogOpen={this.solutionApproveDialogOpen}
                        updateProblemDialogOpen={this.UpdateProblemDialog}
                        problemClosingDialogOpen={this.problemClosingDetail}
                        dockClose={this.announcementDockClose}
                        problemDetail={this.state.detail}
                        isLoading={this.state.isLoading}
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
                        problemDetail={this.state.detail}
                        onAttachmentSelect={this.handleAttachmentSelect}
                        dockClose={this.solutionDockClose}
                        solutionDetails={this.state.SolutionDetails}
                        isLoading={this.state.isLoading}
                        onUpdateSolutionClick={this.onUpdateSolutionOpen}
                    />
                </Dock>

                <LeaderStateProblemDialog
                    tagList={this.state.tagList}
                    isLoading={this.state.isLoading}
                    open={this.state.StateProblemDialog}
                    tagListCall={this.handleTagSelect}
                    onClose={this.StateProblemDialogClose}
                    onCreate={this.handleStateProblem}
                />

                {this.state.UpdateProblemDialog === true &&
                    <LeaderUpdateProblemDialog
                        problemdetail={this.state.detail}
                        tagList={this.state.tagList}
                        isLoading={this.state.isLoading}
                        open={this.state.UpdateProblemDialog}
                        tagListCall={this.handleTagSelect}
                        onClose={this.UpdateProblemDialogClose}
                        onCreate={this.handleOnUpdateProblemCall}
                    />
                }

                {this.state.closingProblemId &&
                    <LeaderProblemClosingDialog
                        open={this.state.problemClosingDialog}
                        closingProblemId={this.state.closingProblemId}
                        isLoading={this.state.isLoading}
                        problemDetail={this.state.detail}
                        onClose={this.problemClosingDialogClose}
                        onCreate={this.handleProblemClose}
                    />
                }
                {this.state.solutionId &&
                    this.state.problemDetailLoad &&
                    <SolutionApproveDialog
                        solutionId={this.state.solutionId}
                        problemdetail={this.state.problemDetailLoad}
                        open={this.state.solutionApproveDialog}
                        onClose={this.solutionApproveDialogClose}
                        onCreate={this.handleSolutionApprove}
                        isLoading={this.state.isLoading}
                    />
                }

            </div>
        );
    }
    onLoadMore = () => {
        const page = this.state.page + 1;
        this.setState({ page });
        this.getAnnouncementMyProblemList(
            this.state.searchText,
            this.state.statusBy,
            this.state.clubBy,
            page,
            PROBLEM_COUNT
        );
    }
    getProblemTileTemplate = (problemList) => {
        let template = (<div className='no-input'>No Problems Found</div>);
        if (problemList && problemList.length > 0) {
            template = problemList.map((problem) => {
                return (
                    <AnnouncementProblemTile
                        admin={false}
                        key={problem.id}
                        values={problem}
                        onSelect={this.click}
                    />);
            })
        }
        return template;
    }

    onSolutionTileSelect = (solutionDetail) => {
        this.loadSolutionDetail();
        this.updateSolution(solutionDetail.id);
    }
    loadSolutionDetail = () => {
        this.setState({ isLoading: true });
        this.setState({ solutionDockOpen: true });
    }
    updateSolution = (solutionId) => {
        AnnouncementService.getSolutionDetails(solutionId)
            .then(
                solutiondetail => {
                    this.setState({ isLoading: false });
                    this.setState({ SolutionDetails: solutiondetail });
                }
            ).catch(
                error => {
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    solutionDockClose = () => {
        this.setState({ solutionDockOpen: false });
    }
    handleFilterChange = (config) => {
        this.filterListReset();
        let status = config.status;
        let club = config.clubBy;
        let search = config.search;
        let page = 0;
        let count = PROBLEM_COUNT;
        this.setState({
            statusBy: config.status,
            clubBy: config.clubBy,
            searchText: config.search,
            page: page,
        });
        this.getAnnouncementMyProblemList(search, status, club, page, count);


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
        this.handleLoadProblemDetail(element);
    }


    handleTaskAttachmentSelect = (file) => {
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

    handleLoadProblemDetail = (element) => {
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
    UpdateProblemDialog = (element) => {
        this.UpdateProblemDialogOpen();
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
                        id:tag.code
                    });
                });
                this.setState({ tagList: tagArrayList });
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
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

    handleStateProblem = (request) => {

        return AnnouncementService.handleStateProblem(request)
            .then(() => {
                this.StateProblemDialogClose();
                this.filterListReset();
                this.getAnnouncementMyProblemList();
                riverToast.show("Problem is created sucessfully");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating Problem.");
                throw "problem creation error"
            });
    }
    handleOnUpdateProblemCall = (request, problemId, problemDetail) => {
        return AnnouncementService.handleOnUpdateProblem(request, problemId)
            .then(() => {
                this.UpdateProblemDialogClose();
                this.filterListReset();
                this.handleLoadProblemDetail(problemDetail)
                this.getAnnouncementMyProblemList();
                riverToast.show("the problem is been updated");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating Problem.");
                throw "problem update error"
            })
    }

    handleSolutionApprove = (comment, solutionId, problemdetail) => {
        return AnnouncementService.handleSolutionApprove(comment, solutionId)
            .then((data) => {
                this.solutionApproveDialogClose();
                this.filterListReset();
                this.handleLoadProblemDetail(problemdetail);
                this.getAnnouncementMyProblemList();
                this.setState({ details: data });
                riverToast.show("the solution is been approved");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while approving solution.");
                throw "solution approve error"
            })
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
    problemClosingDetail = (problemDetail) => {
        this.problemClosingDialogOpen();
        this.setState({ closingProblemId: problemDetail.id })
    }

    handleProblemClose = (comment, problemId, element) => {
        return AnnouncementService.handleProblemClose(comment, problemId, element)
            .then(() => {
                this.problemClosingDialogClose();
                this.filterListReset();
                this.getAnnouncementMyProblemList();

                this.announcementDockClose();
                riverToast.show("the problem is been closed");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while closing the Problem.");
                throw "problem closing error"
            })
    }

    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
    loadAnnouncementDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ announcementDockOpen: true });
    }
    StateProblemDialogOpen = () => {

        this.setState({ StateProblemDialog: true });
    }
    StateProblemDialogClose = () => {
        this.setState({ StateProblemDialog: false });
    }
    UpdateProblemDialogOpen = () => {
        this.setState({ UpdateProblemDialog: true });
    }
    UpdateProblemDialogClose = () => {
        this.setState({ UpdateProblemDialog: false });
    }
    problemClosingDialogOpen = () => {
        this.setState({ problemClosingDialog: true });
    }
    problemClosingDialogClose = () => {
        this.setState({ problemClosingDialog: false });
    }
    solutionApproveDialogOpen = (id, problemDetail) => {
        this.setState({ solutionId: id });
        this.setState({ problemDetailLoad: problemDetail })
        this.setState({ solutionApproveDialog: true });
    }
    solutionApproveDialogClose = () => {
        this.setState({ solutionId: "" });
        this.setState({ solutionApproveDialog: false });
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeaderMyProblem);