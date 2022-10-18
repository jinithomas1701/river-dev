import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import List, { ListItem, ListItemText, ListItemAvatar } from 'material-ui/List';
import ClearIcon from 'material-ui-icons/Clear';
import HighlightOffIcon from 'material-ui-icons/HighlightOff';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Datetime from 'react-datetime';
import moment from 'moment';

//root component
import { Root } from "../../../Layout/Root";
import {ContactCard} from "../../../Common/ContactCard/ContactCard";

// custom component
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import { ContactList } from '../../../Common/ContactList/ContactList';
import { StarRating } from '../../../Common/StarRating/StarRating';
import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {SelectBox} from "../../../Common/SelectBox/SelectBox";
import {Util} from "../../../../Util/util";
import { Toast, riverToast } from '../../../Common/Toast/Toast';

import { setLocationList,
        setOverallRating,
        setAbsenteesList,
        setAttendeesList,
        fieldChange,
        setUserSearchResult,
        setUsersSelectedResult,
        setGuestList,
        setMeetingType,
        setAllFields,
        clearField } from "./MeetingDetail.actions"
import {MeetingService} from "../meetings.service";
import './MeetingDetail.scss';

const mapStateToProps = (state) => {
    return {
        meeting: state.MeetingDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLocationList: (locationList) => {
            dispatch(setLocationList(locationList));
        },
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
        },
        setUserSearchResult: (result) => {
            dispatch(setUserSearchResult(result));
        },
        setUsersSelectedResult: (result) => {
            dispatch(setUsersSelectedResult(result));
        },
        setMeetingType: (types) => {
            dispatch(setMeetingType(types));
        },
        setAllFields: (fields) => {
            dispatch(setAllFields(fields));
        },
        setGuestList: (list) => {
            dispatch(setGuestList(list));
        },
        setAbsenteesList: (list) => {
            dispatch(setAbsenteesList(list));
        },
        setAttendeesList: (list) => {
            dispatch(setAttendeesList(list));
        },
        setOverallRating: (rating) => {
            dispatch(setOverallRating(rating));
        },
        clearField: () => {
            dispatch(clearField());
        }
    };
};

const PRIVILEGE_UPDATE_MEETING = "UPDATE_MEETING";
const PRIVILEGE_MARK_ATTENDANCE = "MARK_MEETING_ATTENDANCE";

class MeetingDetail extends React.Component {
    locations = [];
state = {
    circularPreLoadeder: false,
    meetingInviteesPreloader: false,
    meetingAttendeesPreloader: false,
    showSearchPreloader: false,
    selectedMembers: []        
};

constructor(props) {
    super(props);
}

componentDidMount() {
    this.getMeetingTypes();
    if (this.props.match.params.meetingId) {
        this.getMeetingDetails(this.props.match.params.meetingId);
    } else {
        this.props.clearField();
        this.getClubLocation();
        this.props.fieldChange("to", Math.round((new Date()).getTime() / 1000));
        this.props.fieldChange("from", Math.round((new Date()).getTime() / 1000));
    }
}

yesterday = Datetime.moment().subtract(1, 'day');

render() {

    const guestList = this.props.meeting.guestList.map((guest, index) => {
        return (
            <ListItem key={index} classes={{root: "guest-list-item"}}>
                <Avatar>{guest.name.charAt(0).toUpperCase()}</Avatar>
                <ListItemText
                    primary={guest.name}
                    secondary={guest.details}
                    >
                </ListItemText>
                <Button size="small" classes={{root: "btn-delete"}} onClick={this.onGuestRemove.bind(this, guest, index)}>
                    <HighlightOffIcon />
                </Button>
            </ListItem>
        );
    });

    const meetingTypeList = this.props.meeting.meetingTypeList.map(item => {
        return <FormControlLabel
                   key={item.value}
                   value={`${item.value}`}
                   control={<Radio />}
                   label={item.title}
                   />
    });

    return ( 
        <Root role="admin">
            <MainContainer>
                <PageTitle title="Meetings" />
                <div className="row meeting-details">
                    <div className="col-md-12">
                        <div className="content-container extra-margin-b">
                            <div className="page-title-section">
                                <h5>Meeting</h5>
                            </div>
                            <div className="page-content-section">
                                {/*-------------------------------------------------------------------*/}
                                <div className="row">
                                    <div className="col-md-12 padded-content">
                                        <hr className="hr-blind" />
                                        <div className="section-title new-section-title">Basic Info</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12  input-container">
                                        <RadioGroup
                                            aria-label="Meeting Type"
                                            name="meetingType"
                                            value={this.props.meeting.meetingFields.type}
                                            onChange={this.onSelectMeetingType.bind(this)}
                                            row
                                            >
                                            {meetingTypeList}
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <div className="datetime-picker-wrapper">
                                            <label htmlFor="from-date">From</label>
                                            <Datetime
                                                inputProps={{placeholder: 'From', id:"from-date", className:"datetime-input"}}
                                                isValidDate={this.isDateValid.bind(this)}
                                                className="datetime-picker"
                                                onChange={(value)=>{this.props.fieldChange("from", Math.round((new Date(value)).getTime() / 1000));}}
                                                value={new Date(this.props.meeting.meetingFields.from * 1000)}
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <div className="datetime-picker-wrapper">
                                            <label htmlFor="to-date">To</label>
                                            <Datetime inputProps={{placeholder: 'To', id:"to-date", className:"datetime-input"}}
                                                isValidDate={ this.isDateValid.bind(this) }
                                                className="datetime-picker"
                                                onChange={(value)=>{this.props.fieldChange("to", Math.round((new Date(value)).getTime() / 1000));}}
                                                value={new Date(this.props.meeting.meetingFields.to * 1000)}
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="location"
                                            label="Location"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.meeting.meetingFields.location}
                                            onChange={(e)=>{this.props.fieldChange("location", e.target.value);}}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 input-container">
                                        <TextField
                                            id="title"
                                            label="Title"
                                            className="input-field"
                                            margin="normal"
                                            inputProps={{maxLength: 80}}
                                            value={this.props.meeting.meetingFields.title}
                                            onChange={(e)=>{this.props.fieldChange("title", e.target.value);}}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 input-container">
                                        <TextField
                                            id="desc"
                                            label="Description"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.meeting.meetingFields.desc}
                                            onChange={(e)=>{this.props.fieldChange("desc", e.target.value);}}
                                            rowsMax="8"
                                            multiline
                                            />
                                    </div>
                                    <div className="col-md-6 input-container">
                                        <TextField
                                            id="agenda"
                                            label="Agenda"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.meeting.meetingFields.agenda}
                                            onChange={(e)=>{this.props.fieldChange("agenda", e.target.value);}}
                                            rowsMax="8"
                                            multiline
                                            />
                                    </div>
                                </div>
                                <div className="col-md-4 text-center">
                                    {this.props.meeting.overallRating > 0 && 
                                        <div className="rating-container">
                                            <div className="title">Overall rating</div>
                                            <StarRating rating={this.props.meeting.overallRating} color="#3f51b5" size="2rem"/>
                                        </div>
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-md-12 padded-content">
                                        <hr className="hr-blind" />
                                        <div className="section-title new-section-title">Invitees</div>
                                        {(this.props.meeting.meetingFields.type === "1") && <p className="text-small">All Club members will be invited automatically.</p>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8  input-container">
                                        <UserChipMultiSelect
                                            showPreloader={this.state.showSearchPreloader}
                                            onTextChange={this.onInviteesSearch.bind(this)}
                                            resultChips={this.props.meeting.chipSearchResult}
                                            selectedChips={this.props.meeting.selectedChips}
                                            onItemSelect={this.onUserSearchItemSelect.bind(this)}
                                            onDeleteChip={this.onDeleteItem.bind(this)}
                                            classes={{avatar: "chip-avatar", deleteIcon: "chip-delete", label: "chip-label"}}
                                            placeholder="Search and add additional Invitees"
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 padded-content">
                                        <hr className="hr-blind" />
                                        <div className="section-title new-section-title">Guest</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="guestName"
                                            label="Guest Name"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.meeting.meetingFields.guestName}
                                            onChange={(e)=>{this.props.fieldChange("guestName", e.target.value);}}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="guestDesc"
                                            label="Guest Description"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.meeting.meetingFields.guestDesc}
                                            onChange={(e)=>{this.props.fieldChange("guestDesc", e.target.value);}}
                                            />
                                    </div>
                                    <div className="col-md-2">
                                        <div className="textwrap-btn-container">
                                            <Button color="primary" raised aria-label="ADD GUEST" onClick={this.onAddGuest.bind(this)}>
                                                ADD GUEST
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 padded-content">
                                        <div className="selected-chips-container">
                                            <List classes={{root: "guest-list"}}>
                                                {guestList}
                                            </List>
                                        </div>
                                    </div>
                                </div>

                                {/*-------------------------------------------------------------------*/}


                                {this.props.match.params.meetingId && 
                                    <div>
                                        { Util.hasPrivilage(PRIVILEGE_MARK_ATTENDANCE) &&
                                            <div>
                                                <div className="section-title new-section-title">Attendance</div>
                                                <div className="row flex-container">
                                                    <div className="col-md-5">
                                                        <div className="section-title new-section-title text-center">
                                                            Attendees
                                                        </div>
                                                        {this.state.meetingAttendeesPreloader &&
                                                            <LinearProgress />
                                                        }
                                                        <ContactList
                                                            className="club-contact-list"
                                                            contactList={this.props.meeting.meetingAttendees}
                                                            height="500px"
                                                            searchFilterKey="name"
                                                            canRemove={true}
                                                            onRemoveCallback={this.onRemoveAttendee.bind(this)}/>
                                                    </div>
                                                    <div className="col-md-2 center-button-container">
                                                        <Button className="center-button" fab color="primary"
                                                            aria-label="Add"
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
                                                        {this.state.meetingInviteesPreloader &&
                                                            <LinearProgress />
                                                        }
                                                        <ContactList 
                                                            contactList={this.props.meeting.meetingAbsentees}
                                                            height="500px"
                                                            hasCheckbox={true}
                                                            checkboxChange={this.onCheckboxClicked.bind(this)}
                                                            searchFilterKey="name"
                                                            canRemove={false}
                                                            selectedMembers={this.state.selectedMembers}/>
                                                    </div>
                                                </div>
                                            </div> 
                                        }
                                        {/* <div className="section-title new-section-title">Minutes</div> */}
                                        <div className="row flex-container input-container">
                                            <TextField
                                                id="multiline-flexible-mom"
                                                label="Minutes"
                                                multiline
                                                rows="4"
                                                value={this.props.meeting.meetingFields.mom}
                                                onChange={(e)=>{
                                                    this.props.fieldChange("mom", e.target.value);
                                                }}
                                                className="w-qtr"
                                                margin="normal"
                                                />
                                        </div>
                                        {/* <div className="section-title new-section-title">Notes</div> */}
                                        <div className="row flex-container input-container">
                                            <TextField
                                                id="multiline-flexible-notes"
                                                label="Notes"
                                                multiline
                                                rows="4"
                                                value={this.props.meeting.meetingFields.notes}
                                                onChange={(e)=>{
                                                    this.props.fieldChange("notes", e.target.value);
                                                }}
                                                className="w-qtr"
                                                margin="normal"
                                                />
                                        </div>
                                    </div>
                                }

                                <div className="floating-bottom-control">
                                    {Util.hasPrivilage(PRIVILEGE_UPDATE_MEETING) &&
                                        <div>
                                            <Button onClick={this.onCancelClick.bind(this)}>Cancel</Button>
                                            <Button color="primary" onClick={this.onSaveClick.bind(this)}>
                                                Save
                                            </Button>
                                        </div>
                                    }
                                    {!Util.hasPrivilage(PRIVILEGE_UPDATE_MEETING) &&
                                        <Button onClick={this.onCancelClick.bind(this)}>OK</Button>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainContainer>
        </Root>
    );
}

onGuestRemove(guest, index) {
    const guestList = this.props.meeting.guestList;
    guestList.splice(index, 1);
    this.props.setGuestList(guestList);
}

onAddGuest() {
    if (this.props.meeting.meetingFields.guestName) {
        const guestList = this.props.meeting.guestList;
        guestList.push({
            name: this.props.meeting.meetingFields.guestName,
            details: this.props.meeting.meetingFields.guestDesc
        });
        this.props.fieldChange("guestName", "");
        this.props.fieldChange("guestDesc", "");
        this.props.setGuestList(guestList);
    }
}

/*onSelectMeetingType(selectedType) {
    this.props.fieldChange("type", selectedType);
}*/

onSelectMeetingType(event) {
    this.props.fieldChange("type", event.target.value);
}

onCheckboxClicked(selectedElementsArray, selectedContact, isChecked) {
    const contactList = this.props.meeting.meetingAbsentees;
    this.setState({ selectedMembers: selectedElementsArray });      
    contactList.forEach((contact) => {
        this.props.meeting.meetingAbsentees
        if (contact.id == selectedContact.id) {
            contact.checked = isChecked;
        }
    }, this);
    this.props.setAbsenteesList(contactList);
}

isDateValid = function( current ){
    return current.isAfter( this.yesterday );
};

onCancelClick() {
    this.props.history.push("/admin/meetings");
}

onMarkAttendance() {
    this.state.selectedMembers.forEach((element) => {
        this.removeFromList(element, this.props.meeting.meetingAbsentees, this.props.setAbsenteesList);
        this.addToList(element, this.props.meeting.meetingAttendees, this.props.setAttendeesList);
    }, this);
    this.setState({ selectedMembers: [] });
}

onRemoveAttendee(attendee) {
    attendee.checked = false;
    this.removeFromList(attendee, this.props.meeting.meetingAttendees, this.props.setAttendeesList);
    this.addToList(attendee, this.props.meeting.meetingAbsentees, this.props.setAbsenteesList);
}

removeFromList(item, list, reducerCall) {
    const finalList = list || [];
    let isPresent = false;
    list.forEach((element, index) => {
        if (item.id === element.id) {
            finalList.splice(index, 1);
        }
    }, this);
    reducerCall(finalList);
}

addToList(item, list, reducerCall) {
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
    reducerCall(finalList);
}

getSelectedInviteesIds() {
    const ids = [];
    this.props.meeting.selectedChips.forEach((element) => {
        if (element.id) {
            ids.push(element.id);
        }
    }, this);

    return ids;
}

getStringToDate(dateString) {
    let timestamp = "";
    if (dateString) {
        timestamp = new Date(dateString).getTime();
    }

    return timestamp
}

getMeetingCreateRequest() {
    const meetingRequest = {
        "title":this.props.meeting.meetingFields.title,
        "description":this.props.meeting.meetingFields.desc,
        "location":this.props.meeting.meetingFields.location,
        "fromDate":this.getStringToDate(this.props.meeting.meetingFields.from * 1000),
        "toDate":this.getStringToDate(this.props.meeting.meetingFields.to * 1000),
        "type":this.props.meeting.meetingFields.type,
        "agenda":this.props.meeting.meetingFields.agenda,
        "invitees":this.props.meeting.selectedChips || [], // list of user id
        "guest":this.props.meeting.guestList,
        "attendees":this.props.meeting.meetingAttendees
    };
    if (this.props.match.params.meetingId) {
        meetingRequest.isStarted = false;
        meetingRequest.isEnded = false;
        meetingRequest.mom = this.props.meeting.meetingFields.mom;
        meetingRequest.notes = this.props.meeting.meetingFields.notes;
    }

    return meetingRequest;
}

isFormValid() {
    let isValid = true;
    if(!this.props.meeting.meetingFields.type){
        isValid = false;
        riverToast.show("Please enter meeting type.");
    }
    if(!this.props.meeting.meetingFields.title) {
        isValid = false;
        riverToast.show("Please enter meeting title.");
    }
    if(this.props.meeting.meetingFields.from > this.props.meeting.meetingFields.to) {
        isValid = false;
        riverToast.show("Meeting 'From' date should be earlier that 'To' date.");
    }

    return isValid;
}

onSaveClick() {
    if(this.isFormValid()){
        const request = this.getMeetingCreateRequest();
        if (this.props.match.params.meetingId) {
            MeetingService.updateMeetingTask(this.props.match.params.meetingId, request)
                .then(data => {
                riverToast.show("Meeting has been created successfully");
                this.props.history.push("/admin/meetings");
            })
                .catch((error) => {
                riverToast.show(error.status_message);
            });
        } else {
            MeetingService.createMeetingTask(request)
                .then(data => {
                riverToast.show("Meeting has been created successfully");
                this.props.history.push("/admin/meetings");
            })
                .catch((error) => {
                riverToast.show(error.status_message);
            });
        }
    }

}

onDeleteItem(item) {
    if (item) {
        const selectedUsers = this.props.meeting.selectedChips;
        this.props.meeting.selectedChips.forEach((element, index) => {
            if (element.id === item.id) {
                selectedUsers.splice(index, 1);
            }
        }, this);
        this.props.setUsersSelectedResult(selectedUsers);
    }
}

onUserSearchItemSelect(item) {
    const selectedUsers = this.props.meeting.selectedChips;
    let isChipExists = false;
    this.props.setUserSearchResult([]);
    selectedUsers.forEach((element) => {
        if (element.id === item.id) {
            isChipExists = true;
        }
    }, this);

    if (!isChipExists) {
        selectedUsers.push(item);
        this.props.setUsersSelectedResult(selectedUsers);
    }
}

onInviteesSearch(searchText) {
    if (searchText.length >= 3) {
        const searchType = this.props.meeting.meetingFields.type == 1 ? "club-meeting" : "users";
        this.setState({showSearchPreloader: true});
        MeetingService.searchInvitees(searchType, searchText)
            .then((data) => {
            this.setState({showSearchPreloader: false});
            if (data) {
                this.props.setUserSearchResult(data);
            }
        })
            .catch((error) => {
            this.setState({showSearchPreloader: false});
            riverToast.show(error.status_message);
        });
    } else if (searchText.length < 3){
        this.props.setUserSearchResult([]);
    }
}

getClubLocation() {
    MeetingService.getClubLocation(Util.getMyClubDetails().id)
        .then(data => {
        this.props.fieldChange("location", data);            
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching club location");
    });
}

getMeetingTypes() {
    MeetingService.getMeetingTypes()
        .then((data) => {
        const meetingTypes = data.meetingTypes || [];
        const parsedMeetingTypes = [];
        meetingTypes.forEach(function(element) {
            const meetingObj = {
                title: element.type,
                value: element.meetingTypeId
            };
            parsedMeetingTypes.push(meetingObj);
        }, this);
        this.props.setMeetingType(parsedMeetingTypes);
    })
        .catch((error) => {
        riverToast.show(error.status_message);
    });
}

processMeetingResponse(meetingResponse) {
    if (meetingResponse) {
        const meetingFields = {
            "title": meetingResponse.title || "",
            "desc": meetingResponse.description || "",
            "location": meetingResponse.location || "",
            "from": meetingResponse.fromDate/1000,
            "to": meetingResponse.toDate/1000,
            "agenda": meetingResponse.agenda,
            "type": meetingResponse.type.meetingTypeId || 1,
            "guestName": "",
            "guestDesc": "",
            "mom": meetingResponse.mom || "",
            "notes": meetingResponse.notes || ""
        };
        this.props.setGuestList(meetingResponse.guestDetail);
        this.props.setAllFields(meetingFields);
        this.props.setUsersSelectedResult(meetingResponse.inviteesList);
        const attendeesList = this.parseArrayForContactListComponent(meetingResponse.attendeesList);
        const absenteesList = this.getAbsenteesList(attendeesList, meetingResponse.inviteesList)
        this.props.setAttendeesList(attendeesList);
        this.props.setAbsenteesList(absenteesList);
        this.props.setOverallRating(meetingResponse.overAllRating);
    }
}

getAbsenteesList(attendeesList, inviteesList) {
    let absenteesList = 
        this.parseArrayForContactListComponent(inviteesList);
    let parsedInvitees = 
        this.parseArrayForContactListComponent(inviteesList);
    if (attendeesList && attendeesList.length > 0) {
        parsedInvitees.forEach((invitee, inviteeIndex) => {
            attendeesList.forEach((attendee, attendeeIndex) => {
                if (attendee.id === invitee.id) {
                    const deleteIndex = Util.getIndexOfItem(absenteesList, "id", attendee.id);
                    absenteesList.splice(deleteIndex, 1);
                }
            }, this);
        }, this);
    } else {
        absenteesList = parsedInvitees;
    }

    return absenteesList;
}

parseArrayForContactListComponent(detailArray) {
    const parsedArray = [];
    detailArray = detailArray || [];
    if (detailArray && detailArray.length > 0) {
        detailArray.forEach(function(element) {
            const tempObj = {
                id: element.id,
                checked: false,
                type: element.type,
                name: element.fullname,
                image: element.avatar || "../../../../../resources/images/img/user-avatar.png",
                email: element.username
            };
            parsedArray.push(tempObj);
        }, this);
    }

    return parsedArray;
}

getMeetingDetails(meetingId) {
    if (meetingId) {
        MeetingService.getMeetingTask(meetingId)
            .then(data => {
            this.processMeetingResponse(data);
        })
            .catch(error => {
            riverToast.show(error.status_message);
        });
    }
}
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetail);