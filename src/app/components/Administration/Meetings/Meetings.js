import React from "react";
import {connect} from "react-redux";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { MeetingCard, MeetingActionSources } from './MeetingCard/MeetingCard';
import { Toast, riverToast } from '../../Common/Toast/Toast';

import MeetingMarkAttendanceDialog from "./MeetingMarkAttendanceDialog/MeetingMarkAttendanceDialog";
import MeetingAddMinutesDialog from "./MeetingAddMinutesDialog/MeetingAddMinutesDialog";
import MeetingViewDialog from "./MeetingViewDialog/MeetingViewDialog";
import {MeetingService} from "./meetings.service";
import {setMeetingList, setMeetingDetails, pushComment, pushMeetingList} from "./Meetings.actions";
import {Util} from "../../../Util/util";

import './Meetings.scss';

const PRIVILEGE_CREATE_MEETING = "CREATE_MEETING";

const mapStateToProps = (state) => {
    return {
        meetings: state.MeetingsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMeetingList: (list) => {
            dispatch(setMeetingList(list))
        },
        setMeetingDetails: (details) => {
            dispatch(setMeetingDetails(details));
        },
        pushMeetingList: (list) => {
            dispatch(pushMeetingList(list));
        },
        pushComment: (index, comment) => {
            dispatch(pushComment(index, comment));
        }
    };
};

const PRIVILEGE_MEETING_CREATE = "CREATE_MEETING";
class Meetings extends React.Component {

    state = {
        attendaceDealogOpen: false,
        minutesDialogOpen: false,
        viewDialogOpen: false,
        pageNo: 0,
        isReachedBottom: false
    };
    
    componentDidMount() {
        this.getAllMeetings();
        // window.onscroll = (ev) => {
        //     if (window.location.hash === "#/admin/meetings") {
        //         if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        //             if (!this.state.isReachedBottom) {
        //                 this.getAllMeetings();
        //             }
        //         }
        //     }
        // };
    }

    meetingsList = [];

    render() {

        const meetingList = this.props.meetings.meetingList.map((meeting, index) => {
            return <MeetingCard key={index} side="front" meeting={meeting}  actionCallback={this.onMeetingItemAction.bind(this)}/>
        });

        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Meetings" />
                    <div className="row">
                        <div className="col-md-12 listing-extras">
                            {Util.hasPrivilage(PRIVILEGE_MEETING_CREATE) &&
                                <AddNewBtn title="Create Meeting" callback={this.onAddnewClick.bind(this)}/>
                            }
                            <SearchWidget withButton={true}
                                onSearch={this.onSearch.bind(this)}
                                onClear={this.onClearSearch.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="row meetings-admin">
                        <div className="col-md-12 flex-container">
                            {meetingList}
                        </div>
                        {this.props.meetings.meetingList.length <= 0 &&
                            <div className="col-md-12 flex-container user-polls-listing">
                                    <div className="empty-content-container">No meetings found</div>
                            </div> 
                        }
                        
                    </div>
                </MainContainer>
                <MeetingMarkAttendanceDialog
                    open={this.state.attendaceDealogOpen}
                    meetingDetails={this.props.meetings.meetingDetails}
                    onRequestClose={this.attendanceDialogVisibility.bind(this)}
                />
                <MeetingAddMinutesDialog
                    open={this.state.minutesDialogOpen}
                    meetingDetails={this.props.meetings.meetingDetails}
                    onRequestClose={this.minutesDialogVisibility.bind(this)}
                />
                <MeetingViewDialog
                    open={this.state.viewDialogOpen}
                    meetingDetail={this.props.meetings.meetingDetails}
                    onRequestClose={this.viewDialogVisibility.bind(this)}
                    pushCommentCallBack={this.pushComment.bind(this)}
                />
			</Root>
        );
    }

    /**Search widget */
    onSearch(searchKey) {
        const filteredMeetings = this.filterItems(searchKey, this.meetingsList);
        this.props.setMeetingList(filteredMeetings);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
      }
          
    viewDialogVisibility(value) {
        this.setState({
            ...this.state,
            viewDialogOpen: value
        });
    }

    pushComment(comment, meetingId){
        const index = this.props.meetings.meetingList.filter((meeting, index) => {
            (meeting.meetingId == meetingId) ? 
                this.props.pushComment(index, comment)
                : false;
        });
    }

    onClearSearch() {
        this.props.setMeetingList(this.meetingsList);
    }
    /**Search widget */

    getAllMeetings(pageNo) {
        let currentPage = pageNo || this.state.pageNo;
        MeetingService.getAllMeetings(currentPage)
            .then(data => {
                // this.meetingsList = this.meetingsList.concat(data);
                this.meetingsList = data             
                // if(data.length <= 0 ) {
                //     this.setState({ 
                //         ...this.state,
                //         isReachedBottom: true,
                //         pageNo : currentPage + 1 
                //     });
                // } else {
                //     this.setState({ pageNo : currentPage + 1 });
                // }
                // if(currentPage == 0) {
                    this.props.setMeetingList(data);
                // } else {
                //     this.props.pushMeetingList(data);                    
                // }
            })
            .catch(error => {
                riverToast.show(error.status_message);
            });
    }

    onMeetingItemAction(source, meetingItem) {
        let message = "";
        switch (source) {
            case MeetingActionSources.MARK_ATTENDACE:
                if (meetingItem.started && meetingItem.ended) {
                    this.props.setMeetingDetails(meetingItem);
                    this.setState({
                        ...this.state,
                        attendaceDealogOpen: true
                    });    
                } else {
                    message = "Meeting is not over";
                }
                break;
            case MeetingActionSources.ADD_NOTES:
                if (meetingItem.started && meetingItem.ended) {
                    this.props.setMeetingDetails(meetingItem);
                    this.setState({
                        ...this.state,
                        minutesDialogOpen: true
                    });
                } else {
                    message = "Meeting is not over";
                }
                break;
            case MeetingActionSources.MEETING_UPDATE:
                this.props.history.push("/admin/meetings/detail/"+meetingItem.meetingId);
                break;
            case MeetingActionSources.MEETING_DELETE:
                this.onMeetingDelete(meetingItem);
                break;
            case MeetingActionSources.MEETING_START_STOP:
                if (meetingItem.started && meetingItem.ended) {
                    message = "Meeting once ended can't be restarted";
                } else {
                    this.onMeetingStartStop(meetingItem);
                }
                break;
            case MeetingActionSources.VIEW_MEETING:
                this.props.setMeetingDetails(meetingItem);        
                this.setState({
                    ...this.state,
                    viewDialogOpen: true
                });
            break;
            default:
                break;
        }

        if (message) {
            riverToast.show(message);
        }
    }

    attendanceDialogVisibility(value, needReload) {
        if (!value) {
            this.props.setMeetingDetails(null)
        }

        this.setState({
            ...this.state,
            attendaceDealogOpen: value
        });
    }

    minutesDialogVisibility(value, needReload) {
        if (!value) {
            this.props.setMeetingDetails(null)
        }
        this.setState({
            ...this.state,
            minutesDialogOpen: value
        });
    }

    onAddnewClick() {
        this.props.history.push("/admin/meetings/detail");
    };

    onMeetingDelete(meeting) {
        if(confirm("Are you sure, you want to delete this meeting?")) {
            if (meeting && meeting.meetingId) {
                MeetingService.deleteMeeting(meeting.meetingId)
                    .then(data => {
                        riverToast.show("Meeting has been deleted successfully.");
                        this.getAllMeetings(0);
                    })
                    .catch(error => {
                        riverToast.show(error.status_message);
                    });
            }
        }
    }

    onMeetingStartStop(meeting) {
        if (meeting) {
            const request = {
                isStarted:false,
                isEnded:false
            };
            if (!meeting.started) {
                request.isStarted = true;
                request.isEnded = false;
            } else {
                request.isStarted = true;
                request.isEnded = true;
            }

            MeetingService.startStopMeetingTask(meeting.meetingId, request)
                .then(data => {
                    this.getAllMeetings(0);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);