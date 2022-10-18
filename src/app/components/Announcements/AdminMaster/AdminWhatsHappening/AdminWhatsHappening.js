import React, { Component } from 'react';
import { connect } from "react-redux";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';

import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import Dock from 'react-dock';

import { Util } from "../../../../Util/util";
import { CommonService } from '../../../Layout/Common.service';
import Filters from '../../CommonComponents/Filters';
import AnnouncementService from '../../AnnouncementService';
import AdminAnnouncementCreate from './AdminAnnouncementCreate';
import { riverToast } from '../../../Common/Toast/Toast';
import AnnouncementWhatsHappeningDetails from '../../CommonComponents/AnnouncementWhatsHappeningDetails';
import AdminAnnouncementStatusUpdateDialog from '../AdminCommon/AdminAnnouncementStatusUpdateDialog';
import TaskDeleteDialog from '../AdminCommon/TaskDeleteDialog';
import AdminAnnouncementTaskUpdateDialog from '../AdminCommon/AdminAnnouncementTaskUpdateDialog';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import AdminAnnouncementCreateProblemSelectDialog from './AdminAnnouncementCreateProblemSelectDialog';
import AnnouncementSolutionDetails from "../../CommonComponents/AnnouncementSolutionDetails";
import AnnouncementTaskTile from "../../CommonComponents/AnnouncementTaskTile/AnnouncementTaskTile";
import CardActionButton from "../../CommonComponents/CardActionButton/CardActionButton";
//CSS
import './AdminWhatsHappening.scss';

const classes = Util.overrideCommonDialogClasses();
const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
const STATUS_PENDING_APPROVAL = "AP";
const themeList = ["type1", "type2", "type3"];
const TASK_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        AdminWhatsHappeningStore: state.AdminWhatsHappeningReducer
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

class AdminWhatsHappening extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWhatsHappeningDetailDockLoading: false,
            createDockOpen: false,
            announcementDockOpen: false,
            showProblemDetailDock: false,
            updateDialogOpen: false,
            statusUpdateDialogOpen: false,
            problemDialogOpen: false,
            solutionDockOpen: false,
            statusBy: "ALL",
            problemStatus: "CLO",
            updateSolutionDialog: false,
            clubListArray: [],
            problemListDetail: [],
            detail: "",
            searchText: "",
            selectedProblem: null,
            userDetails: "",
            alert: false,
            showMore: false,
            statusDetail: "",
            solutionDetails: "",
            Problemdetail: "",
            taskDetail: "",
            clubBy: "ALL",
            page: 0,
        }
        this.filterStatusList = this.getFilterStatusList();
    }

    componentDidMount() {
        this.userDetails();
        this.loadClubList();
        this.getAnnouncementWhatsHappeningList();
    }

    getAnnouncementWhatsHappeningList = (
        clubBy = this.state.clubBy,
        statusBy = this.state.statusBy,
        searchText = this.state.searchText,
        page = this.state.page,
        count = TASK_COUNT

    ) => {
        clubBy = clubBy === 'ALL' ? '' : clubBy;
        AnnouncementService.getAnnouncementWhatsHappeningList(clubBy, statusBy, searchText, page, count)
            .then((announcementsList) => {
                let filterList = [...this.props.AdminWhatsHappeningStore.filterList, ...announcementsList];
                this.props.filterListChange(filterList);
                const showMore = TASK_COUNT <= announcementsList.length;
                this.setState({
                    showMore
                });
            })
            .catch(error => {
                riverToast.show(error.status_message || "error");
            })
    }

    getFilterStatusList = () => {
        return [
            { title: "ALL", value: "ALL" },
            { title: "UPCOMING", value: "UPC" },
            { title: "IN-PROGRESS", value: "INP" },
            { title: "COMPLETED", value: "COM" }

        ];
    }

    handleFilterChange = (config) => {
        this.filterListReset();
        let status = config.status;
        let club = config.clubBy;
        let search = config.search;
        let page = 0;
        let count = TASK_COUNT;

        this.setState({
            statusBy: status,
            clubBy: club,
            searchText: search,
            page: page,
        });
        this.getAnnouncementWhatsHappeningList(club, status, search, page, count);
    }


    componentWillUnmount() {
        this.filterListReset();
    }
    filterListReset=()=>{
        this.props.filterListChange([])
    }
    render() {
        const showProblemDetails = typeof this.state.Problemdetail === "object" && this.state.showProblemDetailDock;
        return (
            <div className="upcoming-wrapper">
                <div className="row">
                    <div className="col-md-10 filter">
                        <Filters
                            input="Club"
                            filterClubByList={this.state.clubList}
                            selectedStatus={this.state.statusBy}
                            selectedClubBy={this.state.clubBy}
                            filterStatusList={this.filterStatusList}
                            onFilterChange={this.handleFilterChange}
                        />
                    </div>

                    <div className="col-md-2 create-button-wrapper">
                        <Button
                            variant="contained" color="primary" className="btn-primary task-create "
                            onClick={this.createDockOpen}
                        >
                            NEW ANNOUNCEMENT
                        </Button>
                    </div>
                </div>


                <div className="announcment-list-wrapper">
                    {
                        this.getTileListTemplate(this.props.AdminWhatsHappeningStore.filterList)
                    }
                </div>
                <div className="loadmore">
                    {this.state.showMore && <Button className="btn-default" onClick={this.onLoadMore}>Load More</Button>}
                </div>

                {
                    this.state.statusDetail &&
                    <AdminAnnouncementStatusUpdateDialog
                    taskDetail={this.state.statusDetail}
                    open={this.state.statusupdateDialogOpen}
                        onStatusUpdateSubmission={this.onStatusUpdateSubmission}
                        onClose={this.handleStatusUpdateDialogClose}
                    />
                }

                <Dialog
                    open={this.state.createDockOpen}
                    classes={classes}
                    maxWidth="md"
                    onRequestClose={this.createDockClose}
                    className="create-announcement-dialog-wrapper"
                >
                    <DialogContent className="content">
                        <AdminAnnouncementCreate
                            showProblemDeleteButton={true}
                            showProblemButton={true}
                            clubListing={this.state.clubListArray}
                            selectedProblem={this.state.selectedProblem}
                            onProblemSelect={this.handleproblemSelect}
                            onCreate={this.handleAnnouncementCreate}
                            closecreatedock={this.createDockClose}
                            onProblemRemove={this.onProblemRemove}
                        />
                    </DialogContent>
                </Dialog>

                <AdminAnnouncementCreateProblemSelectDialog
                    aria-labelledby="responsive-dialog-title"
                    scroll='paper'
                    problemList={this.state.problemListDetail}
                    open={this.state.problemDialogOpen}
                    onClose={this.handleProblemDialogClose}
                    handleProblemFilterChange={this.handleProblemFilterChange}
                    onSingleProblemSelect={this.onSingleProblemSelect}
                />

                <a style={{ "display": "none" }} id="download-anchor" ></a>
                <Dock
                    size={0.5}
                    zIndex={200}
                    position="right"
                    isVisible={this.state.announcementDockOpen}
                    dimMode="none"
                    defaultSize={.5}
                >
                    <AnnouncementWhatsHappeningDetails
                        admin={this.props.admin}
                        handleTaskAttachmentSelect={this.handleTaskAttachmentSelect}
                        userDetails={this.state.userDetails}
                        announcementDetail={this.state.detail}
                        isLoading={this.state.isWhatsHappeningDetailDockLoading}
                        dockClose={this.announcementDockClose}
                        handleTaskDeleteDialogOpen={this.handleTaskDeleteDialogOpen}
                        handleShowProblemDetail={this.handleShowProblemDetail}
                        handleTaskUpdateDialog={this.handleTaskUpdateDialogOpen}
                    />
                </Dock>

                <TaskDeleteDialog
                    handleAnnouncementTaskDelete={this.handleAnnouncementTaskDelete}
                    open={this.state.alert}
                    onClose={this.handleTaskDeleteDialogClose}
                />
                {
                    this.state.updateDialogOpen === true &&
                    <AdminAnnouncementTaskUpdateDialog
                        open={this.state.updateDialogOpen}
                        taskDetail={this.state.detail}
                        clubListing={this.state.clubListArray}
                        onClose={this.handlupdatDialogClose}
                        handleAnnouncementUpdate={this.handleTaskUpdate}
                    />
                }

                <Slide in={showProblemDetails} direction="left" unmountOnExit>
                    <Dialog
                        open={showProblemDetails}
                        fullScreen
                        className="problem-detail-dialog-wrapper task-problem"
                    >
                        <DialogContent className="content">
                            {
                                (showProblemDetails) && <AnnouncementProblemDetails
                                    admin={this.props.admin}
                                    problemDetail={this.state.Problemdetail}
                                    isLoading={this.state.isLoading}
                                    onSolutionTileSelect={this.onSolutionTileSelect}
                                    onAttachmentSelect={this.handleAttachmentSelect}
                                    handleDetailAttachment={this.handleDetailAttachment}
                                    dockClose={this.showProblemDetailDockClose}
                                />
                            }
                        </DialogContent>
                    </Dialog>
                </Slide>

                <Dialog
                    open={this.state.solutionDockOpen}
                    onRequestClose={this.solutionDockClose}
                    fullWidth={true}
                    maxWidth="md"
                    className="solution-detail-dialog-wrapper"
                >
                    <DialogContent className="content">
                        {

                            (this.state.solutionDockOpen) && <AnnouncementSolutionDetails
                                userClub={this.state.userDetails.myClub.id}
                                solutionDetails={this.state.solutionDetails}
                                problemStatus={this.state.Problemdetail}
                                isLoading={this.state.isWhatsHappeningDetailDockLoading}
                                onAttachmentSelect={this.handleAttachmentSelect}
                                dockClose={this.solutionDockClose}
                            />

                        }
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    onLoadMore = () => {
        const page = this.state.page + 1;
        this.setState({ page });
        this.getAnnouncementWhatsHappeningList(
            this.state.clubBy,
            this.state.statusBy,
            this.state.searchText,
            page,
            TASK_COUNT
        );
    }
    getTileListTemplate = (taskList) => {
        let template = (<div className='no-input'>No Announcements Found</div>);
        const hasPrivilage = this.props.admin && Util.hasPrivilage('UPDATE_TASK_STATUS');

        if (taskList && taskList.length > 0) {
            template = taskList.map((task, index) => {
                const actionButtons = (<React.Fragment>
                    {
                        (hasPrivilage && task.status.code !== STATUS_COMPLETED) && <CardActionButton
                            title="Change Status"
                            className="btn-submit"
                            onClick={this.handleStatusDialog(task)}
                        >double_arrow</CardActionButton>
                    }
                </React.Fragment>);

                return <AnnouncementTaskTile
                    key={task.id}
                    actionButtons={actionButtons}
                    theme={`type${(index % 3) + 1}`}
                    task={task}
                    onSelect={this.click}
                />
            });
        }

        return template;
    };

    handleStatusDialog = (task) => (event) => {
        event.stopPropagation();
        this.handleChangeStatusDialog(task);
    }

    onProblemRemove = () => {
        this.setState({ selectedProblem: null });
    }
    handleProblemDialogClose = () => {
        this.setState({ problemDialogOpen: false });
    }
    onSingleProblemSelect = (selectedProblem) => {
        this.setState({ selectedProblem });
        this.setState({ problemDialogOpen: false });
    }

    createDockOpen = () => {
        this.setState({ createDockOpen: true });
    }

    createDockClose = () => {
        this.setState({ createDockOpen: false });
    }

    handleTaskUpdateDialogOpen = () => {
        this.setState({ updateDialogOpen: true });
    }

    handlupdatDialogClose = () => {
        this.setState({ updateDialogOpen: false });
    }

    handleStatusUpdateDialogOpen = () => {
        this.setState({ statusupdateDialogOpen: true });
    }

    handleStatusUpdateDialogClose = () => {
        this.setState({ statusupdateDialogOpen: false });
    }

    handleChangeStatusDialog = (element) => {
        AnnouncementService.getTaskDetail(element.id)
            .then(
                announcementsdetail => {
                    this.setState({ statusupdateDialogOpen: true });
                    this.setState({ statusDetail: announcementsdetail });
                }
            ).catch(
                error => {
                    this.setState({ statusupdateDialogOpen: false });
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    click = (element) => {
        this.loadAnnouncementDetails(element);
        this.handleAnnouncementDetails(element);
    }

    handleAnnouncementDetails = (element) => {
        AnnouncementService.getTaskDetail(element.id)
            .then(
                announcementsdetail => {
                    this.setState({ isWhatsHappeningDetailDockLoading: false });
                    this.setState({ detail: announcementsdetail });
                }
            ).catch(
                error => {
                    this.setState({ isWhatsHappeningDetailDockLoading: false });
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }

    loadAnnouncementDetails = () => {
        this.setState({ isWhatsHappeningDetailDockLoading: true });
        this.setState({ announcementDockOpen: true });
    }

    showProblemDetailDockClose = () => {
        this.setState({ showProblemDetailDock: false });
    }

    loadProblemDetails = () => {
        this.setState({ isWhatsHappeningDetailDockLoading: true });
        this.setState({ showProblemDetailDock: true });
    }

    handleAnnouncementTaskDelete = () => {
        this.handleTaskDelete(this.state.detail);
        this.setState({ alert: false });
    }

    handleTaskDeleteDialogOpen = () => {
        this.setState({ alert: true });
    }

    handleTaskDeleteDialogClose = () => {
        this.setState({ alert: false });
    }

    handleproblemSelect = () => {
        AnnouncementService.getCreateAnnouncementProblemList("", this.state.problemStatus, "")
            .then(
                problemList => {
                    this.setState({ problemDialogOpen: true });
                    this.setState({ problemListDetail: problemList });
                }
            ).catch(
                error => {
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    handleProblemFilterChange = (problemSearch) => {
        AnnouncementService.getCreateAnnouncementProblemList(problemSearch, this.state.problemStatus, "")
            .then(
                problemList => {
                    this.setState({ problemListDetail: problemList });
                }
            ).catch(
                error => {
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    handleAnnouncementCreate = (request) => {
        return AnnouncementService.postCreateAnnouncement(request)
            .then(() => {
                this.createDockClose();
                this.filterListReset();
                this.getAnnouncementWhatsHappeningList();
                riverToast.show("Announcement created sucessfully");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating Announcement.");
                throw "announcement create error"
            });
    }

    handleTaskDelete = (taskDetail) => {
        return AnnouncementService.doTaskDelete(taskDetail.id)

            .then(() => {
                riverToast.show("your task is been deleted");
                this.setState({ announcementDockOpen: false });
                this.filterListReset();
                this.getAnnouncementWhatsHappeningList();
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while deleting the Announcement.");
                throw "task delete error"
            });
    }

    onStatusUpdateSubmission = (request, taskId, status) => {
        let myReturn;
        switch (status) {

            case "UC":
                myReturn = this.handleUpdateStatusUpcoming(request, taskId);
                break;
            case "IP":
                myReturn = this.handleUpdateStatusStartProgress(request, taskId);
                break;
            case "CO":
                myReturn = this.handleUpdateStatusCompleted(request, taskId);
                break;
        }
        return myReturn;
    }

    handleUpdateStatusUpcoming = (request, taskId) => {
        return AnnouncementService.handleUpdateStatusUpcoming(request, taskId)
            .then(() => {
                riverToast.show("your have been updated your status to upcoming");
                this.handleStatusUpdateDialogClose();
                this.filterListReset();
                this.getAnnouncementWhatsHappeningList();
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating status to upcoming.");
                throw "task status update error"
            });
    }

    handleUpdateStatusStartProgress = (request, taskId) => {
        return AnnouncementService.handleUpdateStatusStartProgress(request, taskId)
            .then(() => {
                riverToast.show("your have been updated your status to start progress");
                this.handleStatusUpdateDialogClose();
                this.filterListReset();
                this.getAnnouncementWhatsHappeningList();
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating status to start progress.");
                throw "task status update error"
            });
    }

    handleUpdateStatusCompleted = (request, taskId) => {
        return AnnouncementService.handleUpdateStatusCompleted(request, taskId)

            .then(() => {
                riverToast.show("your have been updated your status to completed");
                this.handleStatusUpdateDialogClose();
                this.filterListReset();
                this.getAnnouncementWhatsHappeningList();
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating status to completed.");
                throw "task status update error"
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
    handleTaskAttachmentSelect = (file) => {
        this.setState({ isLoading: true });
        CommonService.downloadFromUrl(file.path, 'announcement/task/attachment/{?}')
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

    loadClubList = () => {
        AnnouncementService.getClubList()
            .then(clubs => {
                let tempClubs = [];
                clubs.map((club) => {
                    tempClubs.push({
                        title: club.clubName,
                        value: club.clubId
                    });
                });
                this.setState({
                    clubList: [{ title: "ALL", value: "ALL" }, ...tempClubs],
                    clubListArray: [...tempClubs]
                });
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while loading club list.");
            });
    }

    handleTaskUpdate = (request, taskId, taskDetail) => {
        return AnnouncementService.handleTaskUpdate(request, taskId)
            .then(() => {
                riverToast.show("task have been updated successfully");
                this.handleAnnouncementDetails(taskDetail);
                this.filterListReset();
                this.getAnnouncementWhatsHappeningList();
                this.setState({ updateDialogOpen: false });
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating task.");
                throw "task update error"
            });
    }

    handleShowProblemDetail = (element) => {
        AnnouncementService.getProblemDetails(element.id)
            .then(
                announcementsdetail => {
                    this.loadAnnouncementProblemDetails();
                    this.setState({ isLoading: false });
                    this.setState({ Problemdetail: announcementsdetail });
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

    loadAnnouncementProblemDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ showProblemDetailDock: true });
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
    solutionDockClose = () => {
        this.setState({ solutionDockOpen: false });
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(AdminWhatsHappening);