import React, { Component } from 'react';
import { connect } from "react-redux";
import Dock from 'react-dock';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import AnnouncementService from '../../AnnouncementService';
import Filters from '../../CommonComponents/Filters';
import { riverToast } from '../../../Common/Toast/Toast';
import { CommonService } from '../../../Layout/Common.service';
import AnnouncementWhatsHappeningDetails from '../../CommonComponents/AnnouncementWhatsHappeningDetails';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import AnnouncementSolutionDetails from "../../CommonComponents/AnnouncementSolutionDetails";
import AnnouncementTaskTile from "../../CommonComponents/AnnouncementTaskTile/AnnouncementTaskTile";
import UpdateSolutionDialog from "../../CommonComponents/UpdateSolutionDialog";
//css
import './PresidentWhatsHappening.scss';

const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
const STATUS_PENDING_APPROVAL = "AP";
const themeList = ["type1", "type2", "type3"];
const TASK_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        PresidentWhatsHappeningStore: state.PresidentWhatsHappeningReducer
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

class PresidentWhatsHappening extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            clubBy: "ALL",
            detail: "",
            userDetails: "",
            Problemdetail: "",
            solutionDetails: "",
            solutionDockOpen: false,
            updateSolutionDialog: false,
            announcementDockOpen: false,
            problemdockOpen: false,
            showMore: false,
            isWhatsHappeningDetailDockLoading: false,
            statusBy: "ALL",
            clubList: [],
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
            .then(
                announcementsList => {
                    let filterList = [...this.props.PresidentWhatsHappeningStore.filterList, ...announcementsList];
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
        const showProblemDetails = this.state.problemdockOpen && typeof this.state.Problemdetail === "object";

        return (
            <div className="president-whatshappening-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <Filters
                            input="Club"
                            filterStatusList={this.filterStatusList}
                            filterClubByList={this.state.clubList}
                            selectedStatus={this.state.statusBy}
                            selectedClubBy={this.state.clubBy}
                            onFilterChange={this.handleFilterChange}
                        />
                    </div>

                </div>

                <div className="announcment-list-wrapper">
                    {
                        this.getTileListTemplate(this.props.PresidentWhatsHappeningStore.filterList)
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
                    <AnnouncementWhatsHappeningDetails
                        admin={false}
                        handleTaskAttachmentSelect={this.handleTaskAttachmentSelect}
                        userDetails={this.state.userDetails}
                        isLoading={this.state.isWhatsHappeningDetailDockLoading}
                        dockClose={this.announcementDockClose}
                        announcementDetail={this.state.detail}
                        handleShowProblemDetail={this.handleShowProblemDetail}

                    />
                </Dock>

                <Slide in={showProblemDetails} direction="left" unmountOnExit>
                    <Dialog
                        open={showProblemDetails}
                        fullScreen
                        className="problem-detail-dialog-wrapper task-problem"
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
                                    dockClose={this.problemdDockClose}
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
                                userDetails={this.state.userDetails}
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
        this.getAnnouncementWhatsHappeningList(
            this.state.clubBy,
            this.state.statusBy,
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

        if (taskList && taskList.length > 0) {
            template = taskList.map((task, index) => {
                return <AnnouncementTaskTile
                    key={task.id}
                    theme={`type${(index % 3) + 1}`}
                    task={task}
                    onSelect={this.click}
                />
            });
        }

        return template;
    };

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
        this.setState({ problemdockOpen: true });
    }
    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
    problemdDockClose = () => {
        this.setState({ problemdockOpen: false });
    }
    loadAnnouncementDetails = () => {
        this.setState({ isWhatsHappeningDetailDockLoading: true });
        this.setState({ announcementDockOpen: true });
    }

    click = (element) => {
        this.loadAnnouncementDetails(element.id);
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
                clubArrayList.unshift({ title: "ALL", value: "ALL" });
                this.setState({ clubList: clubArrayList });
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

}
export default connect(mapStateToProps, mapDispatchToProps)(PresidentWhatsHappening);