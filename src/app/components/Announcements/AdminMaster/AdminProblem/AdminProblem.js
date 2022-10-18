import React, { Component } from 'react';
import { connect } from "react-redux";
import Dialog, { DialogContent } from 'material-ui/Dialog';
import { Util } from "../../../../Util/util";
import Dock from 'react-dock';
import { Button, Chip } from 'material-ui';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import AnnouncementService from '../../AnnouncementService';
import { CommonService } from '../../../Layout/Common.service';
import Filters from '../../CommonComponents/Filters';
import { riverToast } from '../../../Common/Toast/Toast';
import AnnouncementProblemTile from "../../CommonComponents/AnnouncementProblemTile/AnnouncementProblemTile";
import Pagination from '../../../Common/Pagination/Pagination';
import AnnouncementSolutionDetails from '../../CommonComponents/AnnouncementSolutionDetails';
import UpdateSolutionDialog from '../../CommonComponents/UpdateSolutionDialog';
import AdminAnnouncementCreate from '../../AdminMaster/AdminWhatsHappening/AdminAnnouncementCreate';

import './AdminProblem.scss';
const classes = Util.overrideCommonDialogClasses();
const PROBLEM_CLOSE = "CL";
const STATUS_CLOSE = "CLO";
const STATUS_OPEN = "OPN";
const GROUP_BY_STATUS = "ST";
const GROUP_BY_DATE = "DT";
const PROBLEM_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        AdminProblemStore: state.AdminProblemReducer
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

class AdminProblem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            solutionDockOpen: false,
            announcementDockOpen: false,
            updateSolutionDialog: false,
            createDockOpen: false,
            showMore: false,
            problemDetail: "",
            searchText: "",
            detail: "",
            clubListArray: "",
            solutionDetails: "",
            userDetails: "",
            clubBy: "ST",
            statusBy: "ALL",
            page: 0,
        }
        this.filterStatusList = this.getFilterStatusList();
        this.filterClubByList = this.getFilterClubList();
    }
    componentDidMount() {
        this.userDetails();
        this.loadClubListArray();
        this.getAnnouncementproblemList();
    }
    getAnnouncementproblemList = (
        searchText = this.state.searchText,
        statusBy = this.state.statusBy,
        clubBy = this.state.clubBy,
        page = this.state.page,
        count = PROBLEM_COUNT,
        filter = "AD"
    ) => {
        AnnouncementService.getAnnouncementProblemList(searchText, filter, statusBy, clubBy, page, count)
            .then((announcementsList) => {
                let filterList = [...this.props.AdminProblemStore.filterList, ...announcementsList];
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

    render() {

        return (
            <div className="admin-problem-wrapper">
                <Filters
                    input="Group By"
                    selectedStatus={this.state.statusBy}
                    selectedClubBy={this.state.clubBy}
                    filterStatusList={this.filterStatusList}
                    filterClubByList={this.filterClubByList}
                    onFilterChange={this.handleFilterChange}
                />

                <div className="problem-list-wrapper">
                    {
                        this.getProblemTileTemplate(this.props.AdminProblemStore.filterList)
                    }
                </div>
                <div className="loadmore">
                    {this.state.showMore && <Button className="btn-default" onClick={this.onLoadMore}>Load More</Button>}
                </div>

                {this.state.ProblemDetail &&
                    <Dialog
                        open={this.state.createDockOpen}
                        classes={classes}
                        maxWidth="md"
                        onRequestClose={this.createDockClose}
                        className="create-announcement-dialog-wrapper"
                    >
                        <DialogContent className="content">
                            <AdminAnnouncementCreate
                                showProblemButton={false}
                                showProblemDeleteButton={false}
                                clubListing={this.state.clubListArray}
                                selectedProblem={this.state.ProblemDetail}
                                onCreate={this.handleAnnouncementCreate}
                                closecreatedock={this.createDockClose}
                            />
                        </DialogContent>
                    </Dialog>
                }

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
                        admin={this.props.admin}
                        problemDetail={this.state.detail}
                        isLoading={this.state.isLoading}
                        userDetails={this.state.userDetails}
                        createDockOpen={this.createDockOpen}
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

            </div>
        );
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

    getProblemTileTemplate = (problemList) => {
        let template = (<div className='no-input'>No Problems Found</div>);
        const hasPrivilage = this.props.admin === true && Util.hasPrivilage("CREATE_TASK");

        if (problemList && problemList.length > 0) {
            template = problemList.map((problem) => {
                const actionButtons = (<React.Fragment>
                    {
                        (hasPrivilage && problem.announced === false && problem.status && problem.status.code === PROBLEM_CLOSE) &&
                        <Button
                            title="Create Task"
                            className='btn-primary'
                            onClick={this.handleCreateTaskTileClick(problem)}
                        >Create Task</Button>
                    }
                </React.Fragment>)
                return (
                    <AnnouncementProblemTile
                        admin={this.props.admin}
                        actionButtons={actionButtons}
                        key={problem.id}
                        values={problem}
                        onSelect={this.click}
                    />);
            })
        }
        return template;
    }
    handleCreateTaskTileClick = (problem) => (event) => {
        event.stopPropagation();
        this.createDockOpen(problem);
    }

    handleAnnouncementCreate = (request) => {
        return AnnouncementService.postCreateAnnouncement(request)
            .then(() => {
                this.createDockClose();
                this.filterListReset();
                this.getAnnouncementproblemList();
                riverToast.show("Announcement created sucessfully");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating Announcement.");
                throw "announcement create error"
            });
    }
    createDockOpen = (ProblemDetail) => {
        this.setState({ createDockOpen: true });
        this.setState({ ProblemDetail });
    }

    createDockClose = () => {
        this.setState({ createDockOpen: false });
    }
    onClickUpdate = (request, solutionId) => {
        return AnnouncementService.putSolutionDetails(request, solutionId)
            .then(() => {
                riverToast.show("solution updated");
                this.updateSolution(solutionId);
                this.setState({ updateSolutionDialog: false });
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating solution.");
                throw "task update error"
            });

    }
    loadClubListArray = () => {
        AnnouncementService.getClubList()
            .then(clubList => {
                let clubArrayList = [];
                clubList.map((club) => {
                    clubArrayList.push({
                        title: club.clubName,
                        value: club.clubId
                    });
                });

                this.setState({ clubListArray: clubArrayList });
            }
            )
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong in the network");
            }
            );
    }

    onUpdateSolutionOpen = () => {
        this.setState({ updateSolutionDialog: true });
    }
    onUpdateSolutionClose = () => {
        this.setState({ updateSolutionDialog: false });
    }


    click = (element) => {
        this.loadAnnouncementDetails(element.id);
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

    userDetails = () => {
        AnnouncementService.userDetails()
            .then(userDetails => {
                this.setState({ userDetails: userDetails })
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong");

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

    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
    solutionDockClose = () => {
        this.setState({ solutionDockOpen: false });
    }
    loadAnnouncementDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ announcementDockOpen: true });
    }
    onSolutionTileSelect = (solutionDetail) => {
        this.loadSolutionDetail();
        this.updateSolution(solutionDetail.id);
    }
    updateSolution = (solutionId) => {
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
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminProblem);