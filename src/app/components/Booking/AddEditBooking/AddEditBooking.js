import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import { FormGroup, FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Checkbox from 'material-ui/Checkbox';
import Datetime from 'react-datetime';

import moment from 'moment';
import Timeline from 'react-calendar-timeline';

// root component
import { Root } from "../../Layout/Root";

// custom component
import { Util } from "../../../Util/util";
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from "../../Common/PageTitle/PageTitle";
import { riverToast } from "../../Common/Toast/Toast";
import SimpleListDialog from "../../Common/SimpleListDialog/SimpleListDialog";
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { AddEditBookingService } from "./AddEditBooking.service";

// css
import "./AddEditBooking.scss";
import 'react-calendar-timeline/lib/Timeline.css';

const MODE_ADD = "ADD";
const MODE_EDIT = "EDIT";

class AddEditBooking extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bookingListGroup: [],
            bookingListItems: [],
            chartDate: moment().startOf("day"),
            chartStartDate: moment().startOf("day"),
            chartEndDate: moment().endOf("day"),
            chartSelectedItem: "",
            selectedLocation: "",
            locationList: [],
            selectedRoom: "",
            roomList: [],
            meetingTypeList: [],
            selectedMeetingType:"",
            fromDate: "",
            toDate: "",
            participantsCount: "",
            shortDescription: "",
            longDescription: "",
            facilitiesList: [],            
            selectedFacilities: new Set()
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleLocationSelect = this.handleLocationSelect.bind(this);
        this.handleRoomSelect = this.handleRoomSelect.bind(this);
        this.handleFacilitiesChange = this.handleFacilitiesChange.bind(this);
        this.onBookingSubmit = this.onBookingSubmit.bind(this);
        this.onBookingCancel = this.onBookingCancel.bind(this);
        this.isDateValid = this.isDateValid.bind(this);
        this.onChartDateChange = this.onChartDateChange.bind(this);
    }

    widgetMode= (this.props.location.state && this.props.location.state.bookingItem) ? MODE_EDIT : MODE_ADD;
selectedBookingItem= this.props.location.state && this.props.location.state.bookingItem;

yesterday = Datetime.moment().subtract(1, 'day');
fromDateOptions = { 
    placeholder: 'From',
    id:"inputFromDate",
    className:"datetime-input"
};
toDateOptions = { 
    placeholder: 'To',
    id:"inputToDate",
    className:"datetime-input"
};
chartDateOptions = { 
    placeholder: 'Select Date',
    id:"inputChartDate",
    className:"datetime-input"
};

render(){
    const meetingTypeOptions = this.state.meetingTypeList.map((option, index) => {
        return <FormControlLabel 
                   key = {option.id}
                   value={option.code}
                   checked={this.state.selectedMeetingType === option.value}
                   control={<Radio />}
                   label={option.title}
                   className="radio-list-option"
                   />
    });

    const facilitiesOptions = this.state.facilitiesList.map((option, index) => {
        //console.log(this.state.selectedFacilities.has(option.value));
        //console.log([...this.state.selectedFacilities], option.value);
        return <FormControlLabel 
                   key = {option.id}
                   value={option.code}
                   checked={this.state.selectedFacilities.has(option.value)}
                   control={<Checkbox />}
                   label={option.title}
                   className="checkbox-list-option"
                   onChange={this.handleFacilitiesChange}
                   />
    });

    return (
        <Root role="user">
            <MainContainer>
                <PageTitle title="Book a Hall" />
                <div className="row booking-add-edit-wrapper">
                    <div className="col-md-12">
                        <div className="content-container extra-margin-b">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="section-title">Current Booking Schedules</div>
                                </div>
                                <div className="col-md-6 input-container">
                                    <div className="chart-form">
                                        <Datetime
                                            inputProps={this.chartDateOptions}
                                            onChange={this.onChartDateChange}
                                            value={this.state.chartDate}
                                            />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="timeline-container">
                                    {(this.state.bookingListItems.length>0) && <Timeline
                                            groups={this.state.bookingListGroup}
                                            items={this.state.bookingListItems}
                                            visibleTimeStart={this.state.chartStartDate.valueOf()}
                                            visibleTimeEnd={this.state.chartEndDate.valueOf()}
                                            minZoom={1000 * 60 * 60 * 12}
                                            maxZoom={1000 * 60 * 60 * 24}
                                            // itemHeightRatio="0.90"
                                            canZoom={false}
                                            canResize={false}
                                            onTimeChange={this.lockTimelineScroll.bind(this)}
                                            onItemSelect={this.onChartItemSelect.bind(this)}
                                            onCanvasClick={this.onChartItemDeselect.bind(this)}
                                            />}
                                        {
                                            (this.state.chartSelectedItem)?
                                                (<div className="chart-info">
                                                    <div className="label">Selected Item : </div>
                                                    <div className="title">{this.state.chartSelectedItem.label}</div>
                                                    <div className="time">({moment(this.state.chartSelectedItem.start_time).format("YYYY MM DD:HH MM")}) - ({moment(this.state.chartSelectedItem.end_time).format("YYYY MM DD:HH MM")})</div>
                                                </div>)
                                            :
                                            (<div className="chart-info">&nbsp;</div> )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content-container extra-margin-b">
                            <div className="page-content-section">
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <h2 className="section-title">Book a Hall</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <SelectBox 
                                            name="selectedLocation"
                                            id="inputLocation" 
                                            label="Location"
                                            selectedValue={this.state.selectedLocation}
                                            selectArray={this.state.locationList}
                                            onSelect={this.handleLocationSelect}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <SelectBox 
                                            name="selectedRoom"
                                            id="inputRoom" 
                                            label="Room"
                                            selectedValue={this.state.selectedRoom}
                                            selectArray={this.state.roomList}
                                            onSelect={this.handleRoomSelect}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 input-container">
                                        <RadioGroup
                                            name="selectedMeetingType"
                                            aria-label="meeting type"
                                            value={this.state.selectedMeetingType}
                                            onChange={this.handleInputChange}
                                            className="radio-list"
                                            row
                                            >
                                            {meetingTypeOptions}
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <div className="datetime-picker-wrapper">
                                            <label htmlFor="inputFromDate">From Date</label>
                                            <Datetime
                                                inputProps={this.fromDateOptions}
                                                isValidDate={this.isDateValid}
                                                className="datetime-picker"
                                                onChange={ e => this.handleDateChange(e, "fromDate")}
                                                value={this.state.fromDate * 1000}
                                                defaultValue={moment()}
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <div className="datetime-picker-wrapper">
                                            <label htmlFor="inputToDate">To Date</label>
                                            <Datetime
                                                inputProps={this.toDateOptions}
                                                isValidDate={this.isDateValid}
                                                className="datetime-picker"
                                                onChange={ e => this.handleDateChange(e, "toDate")}
                                                value={this.state.toDate * 1000}
                                                defaultValue={moment()}
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            name="participantsCount"
                                            id="inputCount"
                                            label="No. of Participants"
                                            type="number"
                                            inputProps={{min:0}}
                                            className="input-field full-width"
                                            margin="normal"
                                            value={this.state.participantsCount}
                                            onChange={this.handleInputChange}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <TextField
                                            name="shortDescription"
                                            id="inputShortDescription"
                                            label="Purpose"
                                            required
                                            margin="normal"
                                            multiline
                                            value={this.state.shortDescription}
                                            onChange={this.handleInputChange}
                                            className="edit-target-field full-width"
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 input-container">
                                        <TextField
                                            name="longDescription"
                                            id="inputLongDescription"
                                            label="Description"
                                            required
                                            margin="normal"
                                            multiline
                                            value={this.state.longDescription}
                                            onChange={this.handleInputChange}
                                            className="edit-target-field full-width"
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 input-container">
                                        <FormGroup
                                            name="selectedFacilities"
                                            aria-label="facilities list"
                                            className="radio-list"
                                            row
                                            >
                                            {facilitiesOptions}
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="floating-bottom-control">
                                    <Button color="default" onClick={this.onBookingCancel}>Cancel</Button>
                                    <Button color="primary" onClick={this.onBookingSubmit}>
                                        {this.widgetMode === MODE_ADD ? "Save" : "Update"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainContainer>
        </Root>
    );
}

componentDidMount(){
    
    this.loadLocationList();
    this.loadMeetingTypes();
    this.loadFacilities();
    this.loadAllBookings();
    if(this.widgetMode === MODE_EDIT){
        //console.log(this.selectedBookingItem.room.bookingLocation.code);
        this.loadRoomList(this.selectedBookingItem.room.bookingLocation.code)
            .then(() => {
            AddEditBookingService.getSingleBookingDetail(this.selectedBookingItem.hash)
                .then(data => {
                //console.log(data);
                const selectedFacilities = data.facilities.map(item => item.code);
                this.setState({
                    ...this.state,
                    selectedLocation: data.room.bookingLocation.code,
                    selectedRoom: data.room.code,
                    selectedMeetingType: data.meetingType.code,
                    fromDate: data.fromDate / 1000,
                    toDate: data.endDate / 1000,
                    participantsCount: data.participantsCount,
                    shortDescription: data.shortDescription,
                    longDescription: data.longDescription,
                    selectedFacilities: new Set(selectedFacilities),
                });
            })
                .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while fetching booking detail.");
            });
        });

    }
}

loadLocationList(){
    AddEditBookingService.getBookingLocations()
        .then( data => {
        let locationList = data.map(item => ({...item, value: item.code}));
        locationList = [{title: "Select Location", value: ""}, ...locationList];
        this.setState({...this.state, locationList});
    })
        .catch( error => {
        riverToast.show(error.status_message || "Something went wrong while fetching Room locations.");
    });
}

loadRoomList(locationCode){
    return AddEditBookingService.getBookingRoomList(locationCode)
        .then( data => {
        let roomList = data.map(item => ({...item, value: item.code}));
        roomList = [{title: "Select Room", value: ""}, ...roomList];
        this.setState({...this.state, roomList, selectedRoom: ""});
    })
        .catch( error => {
        riverToast.show(error.status_message || "Something went wrong while fetching Room list.");
    });
}

loadMeetingTypes(){
    AddEditBookingService.getBookingMeetingTypes()
        .then(meetingTypeList => {
        this.setState({...this.state, meetingTypeList})
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while fetching Meeting types.");
    });
}

loadFacilities(){
    AddEditBookingService.getBookingFacilities()
        .then( data => {
        const facilitiesList = data.map(item => ({...item, value: item.code, status: false}));
        this.setState({...this.state, facilitiesList});
    })
        .catch( error => {
        riverToast.show(error.status_message || "Something went wrong while fetching Room facilities.");
    });
}

loadAllBookings(){
    AddEditBookingService.getAllBookings(this.state.chartDate.valueOf())
        .then(data => {
        this.prepareBookingList(data);
    })
        .catch(error => {
            console.log(error);
        riverToast.show(error.status_message || "Something went wrong while fetching all bookings.");
    });
}

prepareBookingList(data){
    const bookingListGroup = data.map(item => {
        return {
            id: item.roomName,
            title: item.roomName
        }
    });

    let bookingListItems=[];
    data.map(item => {
        return item.bookingDetails.map(bookItem => {
            const startTime = moment(bookItem.fromDate).format("HH:mm");
            const endTime = moment(bookItem.endDate).format("HH:mm");
            bookingListItems.push( {
                id: bookItem.id,
                group: item.roomName,
                title: `${bookItem.shortDescription} (${startTime} - ${endTime})`,
                start_time: bookItem.fromDate,
                end_time: bookItem.endDate,
                hash: bookItem.hash,
                label: bookItem.shortDescription
            })
        });
    })
    // let bookingListItems=[];
    // console.log(bookingListItemsInit);
    // if(bookingListItemsInit){
    //     bookingListItems=bookingListItemsInit.flat(2);
    // }

    this.setState({...this.state,
                   bookingListGroup,
                   bookingListItems
                  });
}

handleLocationSelect(locationCode){
    const selectedLocation = this.state.locationList.find(item => item.value === locationCode);
    if(locationCode !== ""){
        this.setState({...this.state, selectedLocation: selectedLocation.value, selectedRoom: ""});
        this.loadRoomList(locationCode);
    }
    else{
        this.setState({...this.state, selectedLocation: "", selectedRoom: "", roomList: [{title: "Select Room", value:""}]});
    }
}

handleRoomSelect(roomCode){
    this.setState({...this.state, selectedRoom: roomCode});
}

isDateValid (current){
    return current.isAfter( this.yesterday );
}

onBookingSubmit(){
    if(this.isBookingDataValid()){
        const requestObj = this.prepareBookingData();
        if(this.widgetMode === MODE_ADD){
            this.submitNewBooking(requestObj);
        }
        else{
            this.submitUpdateBooking(requestObj, this.selectedBookingItem.hash);
        }
    }
}

submitNewBooking(requestObj){
    AddEditBookingService.requestBooking(requestObj)
        .then(data => {
        this.resetForm();
        riverToast.show("Meeting booked successfully");
        this.props.history.push("/booking");
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while booking the hall.");
    });
}

submitUpdateBooking(requestObj, hash){
    AddEditBookingService.updateBooking(requestObj, hash)
        .then(data => {
        this.resetForm();
        riverToast.show("Meeting updated successfully");
        this.props.history.push("/booking");
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while updating the booking.");
    });
}

onChartDateChange(date){
    const chartStartDate = moment(date).startOf("day");
    const chartEndDate = moment(date).endOf("day");
    this.setState({...this.state,
                   chartDate: moment(date).startOf("day"),
                   chartStartDate,
                   chartEndDate
                  }, () => {
        this.loadAllBookings();
    });

}

resetForm(){
    this.setState({...this.state,
                   bookingListGroup: [],
                   bookingListItems: [],
                   selectedLocation: "",
                   selectedRoom: "",
                   selectedMeetingType:"",
                   fromDate: "",
                   toDate: "",
                   participantsCount: "",
                   shortDescription: "",
                   longDescription: "",
                   selectedFacilities: new Set()
                  });
}

onBookingCancel(){
    this.props.history.push("/booking");
}

prepareBookingData(){
    const state = this.state;
    let requestObj = {
        location: state.selectedLocation,
        meetingType: state.selectedMeetingType,
        room: state.selectedRoom,
        shortDescription: state.shortDescription,
        longDescription: state.longDescription,
        participantsCount: parseInt(state.participantsCount, 10),
        startTime: state.fromDate * 1000,
        endTime: state.toDate * 1000,
        facilities: [...state.selectedFacilities]
    };
    return requestObj;
}

isBookingDataValid(){
    const state = this.state;
    let isValid = true;
    if(!state.longDescription){
        riverToast.show("Please fill in a description for the meeting.");
        isValid = false;
    }
    if(!state.shortDescription){
        riverToast.show("Please fill in a purpose for the meeting.");
        isValid = false;
    }
    if(!state.participantsCount){
        riverToast.show("Please select number of participants.");
        isValid = false;
    }
    if(!state.toDate){
        riverToast.show("Please select Meeting end time.");
        isValid = false;
    }
    if(!state.fromDate){
        riverToast.show("Please select Meeting begining time.");
        isValid = false;
    }
    if(!state.selectedMeetingType){
        riverToast.show("Please select a Meeting type.");
        isValid = false;
    }
    if(!state.selectedRoom){
        riverToast.show("Please select a Room.");
        isValid = false;
    }
    if(!state.selectedLocation){
        riverToast.show("Please select a Location.");
        isValid = false;
    }

    return isValid
}

onChartItemSelect(itemId){
    const chartSelectedItem = this.state.bookingListItems.find(item => item.id === itemId);
    this.setState({...this.state, chartSelectedItem});
}

onChartItemDeselect(){
    this.setState({...this.state, chartSelectedItem: ""});
}

handleDateChange(date, name){
    const value = Math.round((new Date(date)).getTime() / 1000);
    this.setState({
        ...this.state,
        [name]: value
    });
}

handleSelectChange(selectedItem, name){
    this.setState({
        ...this.state,
        [name]: selectedItem
    });
}

handleInputChange (event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({...this.state, [name]: value});
}

handleFacilitiesChange(event){
    const value = event.target.value;
    this.state.selectedFacilities.has(value)? this.state.selectedFacilities.delete(value): this.state.selectedFacilities.add(value)
    this.setState({...this.state, selectedFacilities: this.state.selectedFacilities})
}

lockTimelineScroll(visibleTimeStart, visibleTimeEnd, updateScrollCanvas){
    //updateScrollCanvas(moment().startOf("day"), moment().endOf("day"));
    const minTime = this.state.chartStartDate.valueOf();
    const maxTime = this.state.chartEndDate.valueOf();

    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
        updateScrollCanvas(minTime, maxTime)
    } else if (visibleTimeStart < minTime) {
        updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
    } else if (visibleTimeEnd > maxTime) {
        updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
    } else {
        updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
    }
}

}

export default AddEditBooking;