import React from "react";
import {connect} from "react-redux";

//root component
import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../Common/SearchWidget/SearchWidget';
import { MeetingCard, MeetingActionSources } from './MeetingCard/MeetingCard';
import MeetingRatingDialog from "./MeetingRatingDialog/MeetingRatingDialog";
import MeetingViewDialog from "./MeetingViewDialog/MeetingViewDialog";
import {MeetingService} from "./meetings.service";
import { Toast, riverToast } from '../Common/Toast/Toast';

import {
    setMeetingList,
    setMeetingDetail,
    pushComment,
    pushMeetingList
} from './PublicMeetings.actions';
import './Meetings.scss';

const mapStateToProps = (state) => {
    return {
        userMeetings: state.PublicMeetingsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMeetingList: (username) => {
            dispatch(setMeetingList(username));
        },
        pushMeetingList: (username) => {
            dispatch(pushMeetingList(username));
        },
        setMeetingDetail: (detail) => {
            dispatch(setMeetingDetail(detail));
        },
        pushComment: (index, comment) => {
            dispatch(pushComment(index, comment));
        }
    }
};

class UserMeetings extends React.Component {

    state = {
        rateDialogOpen: false,
        viewDialogOpen: false,
        pageNo: 0,
        isReachedBottom: false
    };
    
    componentDidMount() {
        this.getMeetingList();
        window.onscroll = (ev) => {
            if (window.location.hash === "#/meetings") {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    if (!this.state.isReachedBottom) {
                        this.getMeetingList();
                    }
                }
            }
        };
    }

    meetingsList = [];

    render() {

        let upcomingLabel =  true;
        let completedLabel = true;
        let onGoingLabel = true;

        const meetingList = this.props.userMeetings.meetingList.map((meeting, index) => {
            let meetingCard = <MeetingCard
                        key={index}
                        side="front"
                        meeting={meeting}
                        actionCallback={this.onMeetingItemAction.bind(this)}
                    />
            if(upcomingLabel && meeting.toDate >= new Date().getTime()) {
                upcomingLabel = false;
                return <div className="with-label-card">
                    <span className="meeting-type-label">Upcoming</span>
                    {meetingCard}
                </div>
            }  else if (onGoingLabel && (meeting.fromDate < new Date().getTime() && meeting.toDate > new Date().getTime())){
                onGoingLabel = false;
                return <div className="with-label-card">
                    <span className="meeting-type-label">OnGoing</span>
                    {meetingCard}
                </div>
            } else if (completedLabel && meeting.toDate < new Date().getTime()){
                completedLabel = false;
                return <div className="with-label-card">
                    <span className="meeting-type-label">Completed</span>
                    {meetingCard}
                </div>
            } else {
                return meetingCard;
            }
            
        });

        return ( 
			<Root role="user">
				<MainContainer>
                    <PageTitle title="Meetings" />
                    <div className="row">
                        <div className="col-md-12 listing-extras">
                            <SearchWidget
                                withButton={false}
                                onSearch={this.onSearch.bind(this)}
                                onClear={this.onClearSearch.bind(this)}/>
                        </div>
                    </div>
                    <div className="row meetings-admin">
                        <div className="col-md-12 flex-container meetings-container">
                            {meetingList}
                        </div>
                        {this.props.userMeetings.meetingList.length <= 0 &&
                            <div className="col-md-12 flex-container user-polls-listing">
                                    <div className="empty-content-container">No meetings found</div>
                            </div> 
                        }
                    </div>
                </MainContainer>
                <MeetingRatingDialog
                    open={this.state.rateDialogOpen}
                    meetingDetail={this.props.userMeetings.meetingDetail}
                    onRequestClose={this.rateDialogVisibility.bind(this)}
                />
                <MeetingViewDialog
                    open={this.state.viewDialogOpen}
                    meetingDetail={this.props.userMeetings.meetingDetail}
                    onRequestClose={this.viewDialogVisibility.bind(this)}
                    pushCommentCallBack={this.pushComment.bind(this)}
                />
			</Root>
        );
    }

    /**Search widget */
    onSearch(searchKey){
        const filteredMeetings = this.filterItems(searchKey, this.meetingsList);
        this.props.setMeetingList(filteredMeetings);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
    }

    onClearSearch() {
        this.props.setMeetingList(this.meetingsList);
    }
    /**Search widget */

    onMeetingItemAction(source, meetingItem) {
        this.props.setMeetingDetail(meetingItem);
        switch (source) {
            case MeetingActionSources.RATE_MEETING:
                if (meetingItem.ended || true) {
                    this.setState({ rateDialogOpen: true });
                } else {
                    riverToast.show("Meeting is not over yet");
                }
                break;
            case MeetingActionSources.VIEW_MEETING:
                    this.setState({
                        ...this.state,
                        viewDialogOpen: true
                    });
                break;
        
            default:
                break;
        }
    }

    viewDialogVisibility(value) {
        this.setState({
            ...this.state,
            viewDialogOpen: value
        });
    }

    rateDialogVisibility(value, needReload) {
        if (!value) {
            this.props.setMeetingDetail({});
        }
        this.setState({
            ...this.state,
            rateDialogOpen: value
        });
    }

    onAddnewClick() {
        this.props.history.push("/admin/meetings/detail");
    };

    getMeetingList(pageNo) {
        let currentPage = pageNo || this.state.pageNo;
        MeetingService.getAllMeetings(currentPage)
            .then(data => {
                this.meetingsList = this.meetingsList.concat(data);
                if(data.length <= 0 ) {
                    this.setState({ 
                        ...this.state,
                        isReachedBottom: true,
                        pageNo : currentPage + 1 
                    });
                } else {
                    this.setState({ pageNo : currentPage + 1 });
                }
                if(currentPage == 0) {
                    this.props.setMeetingList(data);
                } else {
                    this.props.pushMeetingList(data);                    
                }
            })
            .catch(error => {
                riverToast.show(error.status_message);
            });
    }

    pushComment(comment, meetingId){
        const index = this.props.userMeetings.meetingList.filter((meeting, index) => {
            (meeting.meetingId == meetingId) ? 
                this.props.pushComment(index, comment)
                : false;
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMeetings);