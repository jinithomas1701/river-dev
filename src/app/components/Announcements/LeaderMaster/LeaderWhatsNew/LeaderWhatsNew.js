import React, { Component } from 'react';
import { connect } from "react-redux";
import Slide from 'material-ui/transitions/Slide';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Dock from 'react-dock';
import Button from 'material-ui/Button';
import Pagination from '../../../Common/Pagination/Pagination';
import { riverToast } from "../../../Common/Toast/Toast";
import Filters from '../../CommonComponents/Filters';
import AnnouncementService from '../../AnnouncementService';
import { CommonService } from '../../../Layout/Common.service';
import AnnouncementWhatsNewDetails from '../../CommonComponents/AnnouncementWhatsNewDetails';
import AnnouncementProblemDetails from '../../CommonComponents/AnnouncementProblemDetails';
import AnnouncementSolutionDetails from "../../CommonComponents/AnnouncementSolutionDetails";
import AnnouncementTaskTile from "../../CommonComponents/AnnouncementTaskTile/AnnouncementTaskTile";

//css
import './LeaderWhatsNew.scss';

const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
const STATUS_PENDING_APPROVAL = "AP";
const themeList = ["type1", "type2", "type3"];
const TASK_COUNT = 12;
const mapStateToProps = (state) => {
    return {
        LeaderWhatsNewStore: state.LeaderWhatsNewReducer
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

class LeaderWhatsNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            announcementDockOpen: false,
            showProblemDetailDock: false,
            solutionDockOpen: false,
            showMore: false,
            solutionDetails: "",
            detail: "",
            searchText: "",
            Problemdetail: "",
            userDetails: "",
            page: 0,
        }
    }

    componentDidMount() {
        this.userDetails();
        this.getAnnouncementWhatsNewList();
    }
    getAnnouncementWhatsNewList = (
        searchText = this.state.searchText,
        page = this.state.page,
        count = TASK_COUNT,
        filter = "PR"
    ) => {
        AnnouncementService.getAnnouncementWhatsNewList(searchText, filter, page, count)
            .then(
                announcementsList => {
                    let filterList = [...this.props.LeaderWhatsNewStore.filterList, ...announcementsList];
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
        const showProblemDetails = typeof this.state.Problemdetail === "object" && this.state.showProblemDetailDock;
        return (
            <div className="leader-WhatsNew-wrapper">
                <Filters
                    filterStatusList={[]}
                    filterClubByList={[]}
                    onFilterChange={this.handleFilterChange}
                />

                <div className="announcment-list-wrapper">
                    {
                        this.getTileListTemplate(this.props.LeaderWhatsNewStore.filterList)
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
                        leader={this.props.leader}
                        userDetails={this.state.userDetails}
                        announcementDetail={this.state.detail}
                        isLoading={this.state.isLoading}
                        handleTaskAttachmentSelect={this.handleTaskAttachmentSelect}
                        dockClose={this.announcementDockClose}
                        handleShowProblemDetail={this.handleShowProblemDetail}

                    />
                </Dock>
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
                                userDetails={this.state.userDetails}
                                onAttachmentSelect={this.handleAttachmentSelect}
                                dockClose={this.solutionDockClose}
                                solutionDetails={this.state.solutionDetails}
                                isLoading={this.state.isWhatsHappeningDetailDockLoading}
                            //onUpdateSolutionClick={this.onUpdateSolutionOpen}
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

    loadAnnouncementProblemDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ showProblemDetailDock: true });
    }
    showProblemDetailDockClose = () => {
        this.setState({ showProblemDetailDock: false });
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


    userDetails = () => {
        AnnouncementService.userDetails()
            .then(userDetails => {
                this.setState({ userDetails: userDetails })
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong");

            });
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
    loadAnnouncementDetails = () => {
        this.setState({ isLoading: true });
        this.setState({ announcementDockOpen: true });
    }
    announcementDockClose = () => {
        this.setState({ announcementDockOpen: false });
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeaderWhatsNew);