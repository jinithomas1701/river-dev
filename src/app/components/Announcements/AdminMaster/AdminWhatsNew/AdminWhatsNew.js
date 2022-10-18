import React, { Component } from 'react';
import { connect } from "react-redux";
import Slide from 'material-ui/transitions/Slide';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { Util } from "../../../../Util/util";
import { riverToast } from '../../../Common/Toast/Toast';
import Filters from '../../CommonComponents/Filters';
import AnnouncementService from '../../AnnouncementService';
import Dock from 'react-dock';
import AnnouncementWhatsNewDetails from '../../CommonComponents/AnnouncementWhatsNewDetails';
import { CommonService } from '../../../Layout/Common.service';
import AdminAnnouncementTaskUpdateDialog from '../AdminCommon/AdminAnnouncementTaskUpdateDialog';
import Pagination from '../../../Common/Pagination/Pagination';
import TaskDeleteDialog from '../AdminCommon/TaskDeleteDialog';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import AdminApproveTask from '../AdminWhatsNew/AdminApproveTask';
import AnnouncementSolutionDetails from "../../CommonComponents/AnnouncementSolutionDetails";
import UpdateSolutionDialog from "../../CommonComponents/UpdateSolutionDialog";
import AnnouncementTaskTile from "../../CommonComponents/AnnouncementTaskTile/AnnouncementTaskTile";
import CardActionButton from "../../CommonComponents/CardActionButton/CardActionButton";

//css
import './AdminWhatsNew.scss';

const STATUS_PENDING_APPROVAL = "AP";
const TASK_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        AdminWhatsNewStore: state.AdminWhatsNewReducer
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
        filterGroupByChange: (filterGroupBy) => {
            dispatch({
                type: "ON-FILTERGROUPBY-CHANGE",
                payload: filterGroupBy
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

class AdminWhatsNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            createDockOpen: false,
            updateDialogOpen: false,
            handleTaskApprove: false,
            announcementDockOpen: false,
            showProblemDetailDock: false,
            solutionDockOpen: false,
            updateSolutionDialog: false,
            showMore: false,
            alert: false,
            alert: false,
            solutionDetails: "",
            taskApproveDetail: "",
            detail: "",
            searchText: "",
            Problemdetail: "",
            userDetails: "",
            clubBy: "ALL",
            statusBy: "ALL",
            clubListArray: [],
            page: 0
        }
    }
    componentDidMount() {
        this.userDetails();
        this.loadClubListArray();
        this.getAnnouncementWhatsNewList();
    }
    getAnnouncementWhatsNewList = (
        searchText = this.state.searchText,
        page = this.state.page,
        count = TASK_COUNT,
        filter = "AD"
    ) => {
        AnnouncementService.getAnnouncementWhatsNewList(searchText, filter, page, count)
            .then((announcementsList) => {
                let filterList = [...this.props.AdminWhatsNewStore.filterList, ...announcementsList];
                this.props.filterListChange(filterList);
                const showMore = TASK_COUNT <= announcementsList.length;
                this.setState({
                    showMore
                });
            })
            .catch(
                error => {
                    riverToast.show(error.status_message || "error");
                })
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
        this.getAnnouncementWhatsNewList(search, page, count);
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
            <div className="whatsNew-wrapper">
                <div clubName="filter-wrap">
                    <div className="row">
                        <div className="col-md-10">
                            <Filters
                                filterStatusList={[]}
                                filterClubByList={[]}
                                onFilterChange={this.handleFilterChange}
                            />
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                </div>

                <div className="announcment-list-wrapper">
                    {
                        this.getTileListTemplate(this.props.AdminWhatsNewStore.filterList)
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
                    <AnnouncementWhatsNewDetails
                        admin={this.props.admin}
                        userDetails={this.state.userDetails}
                        announcementDetail={this.state.detail}
                        isLoading={this.state.isLoading}
                        handleApproveDialog={this.handleApproveDialog}
                        handleTaskAttachmentSelect={this.handleTaskAttachmentSelect}
                        handleTaskDelete={this.handleTaskDelete}
                        dockClose={this.announcementDockClose}
                        handleTaskUpdateDialog={this.handleTaskUpdateDialog}
                        handleTaskDeleteDialogOpen={this.handleTaskDeleteDialogOpen}
                        handleShowProblemDetail={this.handleShowProblemDetail}
                    />
                </Dock>
                <TaskDeleteDialog
                    handleAnnouncementTaskDelete={this.handleAnnouncementTaskDelete}
                    open={this.state.alert}
                    onClose={this.handleTaskDeleteDialogClose}
                />
                {
                    this.state.taskDetail &&
                    <AdminAnnouncementTaskUpdateDialog
                        clubListing={this.state.clubListArray}
                        open={this.state.updateDialogOpen}
                        taskDetail={this.state.taskDetail}
                        onClose={this.handlupdatDialogClose}
                        handleAnnouncementUpdate={this.handleTaskUpdate}
                    />
                }
                <Slide in={showProblemDetails} direction="left" unmountOnExit>
                    <Dialog
                        open={showProblemDetails}
                        fullScreen
                        className="problem-detail-dialog-wrapper whatsnew-problem"
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
                {this.state.taskApproveDetail &&
                    <AdminApproveTask
                        clubListing={this.state.clubListArray}
                        open={this.state.handleTaskApprove}
                        taskApproveDetail={this.state.taskApproveDetail}
                        onClose={this.handleTaskApproveClose}
                        onCreate={this.handleTaskApprove}
                    />
                }
                <Dialog
                    open={this.state.solutionDockOpen}
                    onRequestClose={this.solutionDockClose}
                    fullWidth={true}
                    maxWidth="md"
                    className="problem-detail-dialog-wrapper"
                >
                    <DialogContent className="content">
                        {
                            (this.state.solutionDockOpen) && <AnnouncementSolutionDetails
                                userDetails={this.state.userDetails}
                                solutionDetails={this.state.solutionDetails}
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
        this.getAnnouncementWhatsNewList(
            this.state.searchText,
            page,
            TASK_COUNT
        );
    }
    

    getTileListTemplate = (taskList) => {
        let template = (<div className='no-input'>No Announcements Found</div>);
        const hasPrivilage = this.props.admin && Util.hasPrivilage('APPROVE_TASK');

        if (taskList && taskList.length > 0) {
            template = taskList.map((task, index) => {
                const actionButtons = (<React.Fragment>
                    {
                        (hasPrivilage && task.status.code === STATUS_PENDING_APPROVAL) && <CardActionButton
                            title="Approve"
                            className="btn-submit"
                            onClick={this.handleApproveDialog(task)}
                        > check_circle</CardActionButton>
                    }
                </React.Fragment >);

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

    handleApproveDialog = (task) => (event) => {
        event.stopPropagation();
        this.handleTaskApproveDetail(task);
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

    handleTaskApprove = (request, taskId) => {
        return AnnouncementService.handleTaskApprove(request, taskId)
            .then(() => {
                this.handleTaskApproveClose();
                this.filterListReset();
                this.getAnnouncementWhatsNewList();
                riverToast.show("Task is Approved sucessfully");
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while approving task.");
                throw "approve task error"
            });
    }
    handleAnnouncementTaskDelete = () => {
        this.handleTaskDelete(this.state.detail.id);
        this.setState({ alert: false });
    }

    handleTaskDeleteDialogOpen = () => {
        this.setState({ alert: true });
    }
    handleTaskDeleteDialogClose = () => {
        this.setState({ alert: false });
    }
    handleTaskDelete = (taskId) => {
        return AnnouncementService.doTaskDelete(taskId)

            .then(() => {
                riverToast.show("your task is been deleted");
                this.setState({ announcementDialogOpen: false });
                this.filterListReset();
                this.getAnnouncementWhatsNewList();
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while deleting the Announcement.");
                throw "task delete error"
            });

    }

    handleTaskApproveDetail = (element) => {
        AnnouncementService.getTaskDetail(element.id)
            .then(
                announcementsdetail => {
                    this.handleTaskApproveOpen();
                    this.setState({ isLoading: false });
                    this.setState({ taskApproveDetail: announcementsdetail });
                }
            )
            .catch(
                error => {
                    riverToast.show(error.status_message || "error in approve click");
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



    click = (element) => {
        this.loadAnnouncementDetails();
        this.AnnouncementTaskDetail(element);
    }

    AnnouncementTaskDetail = (element) => {
        AnnouncementService.getTaskDetail(element.id)
            .then(
                announcementsdetail => {
                    this.setState({ isLoading: false });
                    this.setState({ detail: announcementsdetail });
                }
            )
            .catch(
                error => {
                    riverToast.show(error.status_message || "error in whatsnew tile click");
                }
            )
    }
    handleShowProblemDetail = (element) => {
        this.loadAnnouncementProblemDetails(element.id);
        AnnouncementService.getProblemDetails(element.id)
            .then(
                announcementsdetail => {
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

    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
    showProblemDetailDockClose = () => {
        this.setState({ showProblemDetailDock: false });
    }


    loadAnnouncementDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ announcementDockOpen: true });
    }
    handleAnnouncementSelect = (element) => {
        this.loadAnnouncementDetails(element.id);
    }
    handleTaskDelete = (taskId) => {
        return AnnouncementService.doTaskDelete(taskId)

            .then(() => {
                riverToast.show("your task is been deleted");
                this.setState({ announcementDockOpen: false });

                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "something went wrong while deleting task.");
                throw "task delete error"
            });

    }
    handleTaskUpdateDialogOpen = () => {
        this.setState({ updateDialogOpen: true });

    }
    handlupdatDialogClose = () => {
        this.setState({ updateDialogOpen: false });
    }
    handleTaskUpdateDialog = (element) => {

        AnnouncementService.getTaskDetail(element.id)
            .then(
                announcementsdetail => {
                    this.handleTaskUpdateDialogOpen();
                    this.setState({ taskDetail: announcementsdetail });
                }
            ).catch(
                error => {
                    this.setState({ updateDialogOpen: false });
                    riverToast.show(error.status_message || "error");
                }
            )
    }
    handleTaskUpdate = (request, taskId, taskDetail) => {
        return AnnouncementService.handleTaskUpdate(request, taskId)

            .then(() => {
                riverToast.show("task updated successfully");
                this.AnnouncementTaskDetail(taskDetail);
                this.filterListReset();
                this.getAnnouncementWhatsNewList();
                this.setState({ updateDialogOpen: false });
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating task.");
                throw "task update error"
            });

    }
    handleTaskApproveOpen = () => {
        this.setState({ handleTaskApprove: true });

    }
    handleTaskApproveClose = () => {
        this.setState({ handleTaskApprove: false });
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
export default connect(mapStateToProps, mapDispatchToProps)(AdminWhatsNew);