import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import { Util } from '../../../../Util/util';
import { riverToast } from '../../../Common/Toast/Toast';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Pagination from '../../../Common/Pagination/Pagination';
import Filters from '../../CommonComponents/Filters';
import AnnouncementService from '../../AnnouncementService';
import AnnouncementWhatsNewDetails from '../../CommonComponents/AnnouncementWhatsNewDetails';
import PresidentTaskInterestedDialog from './PresidentTaskInterestedDialog';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails'
import { CommonService } from '../../../Layout/Common.service';
import AnnouncementSolutionDetails from "../../CommonComponents/AnnouncementSolutionDetails";
import AnnouncementTaskTile from "../../CommonComponents/AnnouncementTaskTile/AnnouncementTaskTile";
import CardActionButton from "../../CommonComponents/CardActionButton/CardActionButton";
import UpdateSolutionDialog from "../../CommonComponents/UpdateSolutionDialog";
//css
import './PresidentWhatsNew.scss';

const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
const STATUS_PENDING_APPROVAL = "AP";
const themeList = ["type1", "type2", "type3"];
const TASK_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        PresidentWhatsNewStore: state.PresidentWhatsNewReducer
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

class PresidentWhatsNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            announcementDockOpen: false,
            handleTaskInterestedDialog: false,
            showProblemDetailDock: false,
            solutionDockOpen: false,
            updateSolutionDialog: false,
            showMore: false,
            solutionDetails: "",
            Problemdetail: "",
            taskId: "",
            clubList: [],
            detail: "",
            searchText: "",
            page: 0,
        };
        this.userDetails = Util.getLoggedInUserDetails();
    }

    componentDidMount() {
        this.getAnnouncementWhatsNewList();
    }
    getAnnouncementWhatsNewList = (
        searchText = this.state.searchText,
        page = this.state.page,
        count = TASK_COUNT,
        filter = "PR"
    ) => {
        AnnouncementService.getAnnouncementWhatsNewList(searchText, filter, page, count)
            .then((announcementsList) => {
                let filterList = [...this.props.PresidentWhatsNewStore.filterList, ...announcementsList];
                this.props.filterListChange(filterList);
                const showMore = TASK_COUNT <= announcementsList.length;
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
        const filterListTile = this.props.PresidentWhatsNewStore.filterList;
        const showProblemDetails = typeof this.state.Problemdetail === "object" && this.state.showProblemDetailDock;
        return (
            <div className="president-WhatsNew-wrapper">
                <Filters
                    filterStatusList={[]}
                    filterClubByList={[]}
                    onFilterChange={this.handleFilterChange}
                />

                <div className="announcment-list-wrapper">
                    {
                        this.getTileListTemplate(filterListTile)
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
                        admin={false}
                        leader={false}
                        announcementDetail={this.state.detail}
                        isLoading={this.state.isLoading}
                        handleInterestedDialog={this.handleInterestedDialog}
                        handleTaskAttachmentSelect={this.handleTaskAttachmentSelect}
                        userDetails={this.userDetails}
                        dockClose={this.announcementDockClose}
                        handleShowProblemDetail={this.handleShowProblemDetail}
                    />
                </Dock>

                {this.state.taskId &&
                    <PresidentTaskInterestedDialog
                        taskId={this.state.taskId}
                        clubListing={this.state.clubList}
                        open={this.state.handleTaskInterestedDialog}
                        userClub={this.userDetails.myClub}
                        onCreate={this.handleTaskInterestedDialog}
                        onClose={this.handleTaskInterestedDialogClose}
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
                                    admin={false}
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
                    //fullScreen
                    className="problem-detail-dialog-wrapper"
                >
                    <DialogContent className="content">
                        {

                            (this.state.solutionDockOpen) && <AnnouncementSolutionDetails
                                userDetails={this.userDetails}
                                solutionDetails={this.state.solutionDetails}
                                isLoading={this.state.isWhatsHappeningDetailDockLoading}
                                onAttachmentSelect={this.handleAttachmentSelect}
                                dockClose={this.solutionDockClose}
                                onUpdateSolutionClick={this.onUpdateSolutionOpen}
                            />

                        }
                    </DialogContent>
                </Dialog>
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
        this.getAnnouncementWhatsNewList(
            this.state.searchText,
            page,
            TASK_COUNT
        );
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
                this.getAnnouncementproblemList();
                this.setState({ updateSolutionDialog: false });
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating solution.");
                throw "task update error"
            });

    }

    getTileListTemplate = (taskList) => {
        let template = (<div className='no-input'>No Announcements Found</div>);
        const showInterestedPrivilage = Util.hasPrivilage('TAKE_TASK_OWNERSHIP');

        if (taskList && taskList.length > 0) {
            template = taskList.map((task, index) => {
                const actionButtons = (<React.Fragment>
                    {
                        (showInterestedPrivilage && task.clubs && !task.clubs.length && task.status.code === STATUS_UPCOMING) && <CardActionButton
                            title="Interested"
                            className="btn-submit"
                            onClick={this.handleInterestedDialog(task)}
                        >emoji_people</CardActionButton>
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

    handleInterestedDialog = (task) => (event) => {
        event.stopPropagation();
        this.handleTaskInterestedDialogOpen(task);
    }

    onSolutionTileSelect = (solutionDetail) => {
        this.loadSolutionDetail();
        this.updateSolution(solutionDetail.id);
    }
    updateSolution = (solutionId) => {
        AnnouncementService.getSolutionDetails(solutionId)
            .then(
                solutiondetail => {
                    this.setState({ isWhatsHappeningDetailDockLoading: false });
                    this.setState({ solutionDetails: solutiondetail });
                }
            ).catch(
                error => {
                    riverToast.show(error.status_message || "error");
                }
            )
    }

    loadSolutionDetail = () => {
        this.setState({ isWhatsHappeningDetailDockLoading: true });
        this.setState({ solutionDockOpen: true });
    }
    solutionDockClose = () => {
        this.setState({ solutionDockOpen: false });
    }
    handleTaskInterestedDialog = (request, taskId) => {
        return AnnouncementService.handleTaskInterested(request, taskId)
            .then(() => {
                this.handleTaskInterestedDialogClose();
                this.filterListReset();
                this.getAnnouncementWhatsNewList();
                return true;
            }
            )
            .catch(
                error => {
                    riverToast.show(error.status_message || "error on problem detail");
                    throw "Task Interested error"
                }
            )
    }
    loadClubList = () => {
        AnnouncementService.getClubList()
            .then(clubList => {
                let clubArrayList = [];
                clubList.map((club) => {
                    clubArrayList.push({
                        title: club.clubName,
                        value: club.clubId
                    });
                });

                this.setState({ clubList: clubArrayList });
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

    loadAnnouncementProblemDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ showProblemDetailDock: true });
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

    click = (element) => {
        this.loadAnnouncementDetails(element.id);
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
        this.loadAnnouncementProblemDetails();
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

    loadAnnouncementDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ announcementDockOpen: true });
    }
    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
    handleTaskInterestedDialogOpen = (taskDetail) => {
        this.setState({ taskId: taskDetail.id });
        this.setState({ handleTaskInterestedDialog: true });
        this.loadClubList();
    }
    handleTaskInterestedDialogClose = () => {
        this.setState({ handleTaskInterestedDialog: false });
    }
    showProblemDetailDockClose = () => {
        this.setState({ showProblemDetailDock: false });
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PresidentWhatsNew);