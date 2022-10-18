import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Checkbox from 'material-ui/Checkbox';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import {ContactList} from "../../../Common/ContactList/ContactList";

import { Toast, riverToast } from '../../../Common/Toast/Toast';
import {Util} from '../../../../Util/util';
import {MeetingService} from '../meetings.service';

import "./MeetingMarkAttendanceDialog.scss";

const mapStateToProps = (state) => {
    return {
        activityMasterDialog: state.ActivityMasterDetailDialogReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        categoryChange: (value) => {
            dispatch(categoryChange(value));
        },
        clubPointChange: (value) => {
            dispatch(clubPointChange(value));
        },
        selfAssignChange: (value) => {
            dispatch(selfAssignChange(value));
        },
        memberPointChange: (value) => {
            dispatch(memberPointChange(value));
        },
        subCategoryChange: (value) => {
            dispatch(subCategoryChange(value));
        }
    }
};

export default class MeetingMarkAttendanceDialog extends React.Component {
    state = {
        showProgress: false,
        circularPreLoadeder: false,
        absenteesList: [],
        attendeesList: [],
        selectedAbsentees: []
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            const meetingDetail = this.props.meetingDetails;
            const inviteesList = this.parseArrayForContactListComponent(meetingDetail.inviteesList);
            const attendeesList = this.parseArrayForContactListComponent(meetingDetail.attendeesList);
            const absenteesList = this.getAbsenteesList(attendeesList, inviteesList);
            this.setState({
                attendeesList: attendeesList,
                absenteesList: absenteesList
            });
        }
    }

    parseArrayForContactListComponent(detailArray) {
        let parsedArray = [];
        detailArray = detailArray || [];
        if (detailArray && detailArray.length > 0) {
            parsedArray = detailArray.map( (element) => {
                return {
                    id: element.id,
                    checked: false,
                    name: element.fullname,
                    image: element.avatar || "../../../../../resources/images/img/user-avatar.png",
                    email: element.username
                };
            }, this);
        }

        return parsedArray;
    }

    render() {
        return (
            <Dialog maxWidth={'md'} open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="attendance-mark-dialog-container">
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>Mark Attendance</DialogTitle>
                <DialogContent>
                    <div className="content-container mark-attendance-container">
                        <div className="row flex-container">
                            <div className="col-md-5">
                                <div className="section-title new-section-title text-center">
                                    Attendees
                                </div>
                                
                                <ContactList
                                    className="club-contact-list"
                                    contactList={this.state.attendeesList}
                                    height="350px"
                                    searchFilterKey="name"
                                    canRemove={true}
                                    onRemoveCallback={this.onRemoveAttendee.bind(this)}/>
                            </div>
                            <div className="col-md-2 center-button-container">
                                <Button className="center-button" fab color="primary"
                                    aria-label="Mark"
                                    title="Mark Attendance"
                                    onClick={this.onMarkAttendance.bind(this)}>
                                    {
                                        this.state.circularPreLoadeder
                                            ? <CircularProgress size={32} className="fab-progress"/>
                                            : <Icon className="badge-icon">keyboard_arrow_left</Icon>
                                    }
                                    
                                </Button>
                            </div>
                            <div className="col-md-5">
                                <div className="section-title new-section-title text-center">
                                    Absentees
                                </div>
                                
                                <ContactList 
                                    contactList={this.state.absenteesList}
                                    height="350px"
                                    hasCheckbox={true}
                                    checkboxChange={this.onCheckboxClicked.bind(this)}
                                    searchFilterKey="name"
                                    canRemove={false}
                                    selectedMembers={this.state.selectedAbsentees}/>
                            </div>
                        </div> 
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.onSubmit.bind(this)} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    getAbsenteesList(attendeesList, inviteesList) {
        let absenteesList = inviteesList.slice(0); // deep copy of array

        if (attendeesList && attendeesList.length > 0) {
            inviteesList.forEach((invitee, inviteeIndex) => {
                attendeesList.forEach((attendee, attendeeIndex) => {
                    if (attendee.id === invitee.id) {
                        const deleteIndex = Util.getIndexOfItem(absenteesList, "id", attendee.id);
                        absenteesList.splice(deleteIndex, 1);
                    }
                }, this);
            }, this);
        } else {
            absenteesList = inviteesList;
        }

        return absenteesList;
    }

    onCheckboxClicked(selectedElementsArray, selectedContact, isChecked) {
        const contactList = this.state.absenteesList.slice(0); // deep copy of array
        this.setState({ selectedAbsentees: selectedElementsArray});
        contactList.forEach((contact) => {
            if (contact.id == selectedContact.id) {
                contact.checked = isChecked;
            }
        }, this);
        this.setState({absenteesList: contactList});
    }

    onMarkAttendance() {
        this.state.selectedAbsentees.forEach((element) => {
            this.removeFromList(element, this.state.absenteesList, "absenteesList");
            this.addToList(element, this.state.attendeesList, "attendeesList");
        }, this);

        this.setState({ selectedAbsentees: [] });
    }

    removeFromList(item, list, listName) {
        const finalList = list || [];
        let isPresent = false;
        list.forEach((element, index) => {
            if (item.id === element.id) {
                finalList.splice(index, 1);
            }
        }, this);
        const state = this.state;
        state[listName] = finalList;
        this.setState(state);
    }

    addToList(item, list, listName) {
        const finalList = list || [];
        let isPresent = false;
        list.forEach((element) => {
            if (item.id === element.id) {
                isPresent = true;
            }
        }, this);
        if (!isPresent) {
            finalList.push(item);
        }

        const state = this.state;
        state[listName] = finalList;
        this.setState(state);
    }

    onRemoveAttendee(item) {
        item.checked = false;
        this.removeFromList(item, this.state.attendeesList, "attendeesList");
        this.addToList(item, this.state.absenteesList, "absenteesList");
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
    }

    getmarkAttendanceRequest() {
        const request = {
            objectList: []
        };
        this.state.attendeesList.forEach((markedItem) => {
            this.props.meetingDetails.inviteesList.forEach(invitee => {
                if (invitee.id === markedItem.id) {
                    request.objectList.push(invitee);
                }
            });
        }, this);

        return request;
    }

    onSubmit() {
        this.setState({showProgress: true});
        const request = this.getmarkAttendanceRequest();
        MeetingService.markMeetingAttendanceTask(this.props.meetingDetails.meetingId, request)
        .then(data => {
            this.setState({showProgress: false});
            riverToast.show("Attendance has been marked successfully");
            this.props.onRequestClose(false, true);
        })
        .catch(error => {
            this.setState({showProgress: false});
            riverToast.show(error.status_message);
        });
    }
  }

//   export default connect(mapStateToProps, mapDispatchToProps)(ActivityMasterDetailDialog);