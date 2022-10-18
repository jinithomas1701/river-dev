import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import CreateIcon from 'material-ui-icons/Create';
import DescriptionIcon from 'material-ui-icons/Description';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Collapse from 'material-ui/transitions/Collapse';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Tabs, { Tab } from 'material-ui/Tabs';

import Datetime from 'react-datetime';
import moment from 'moment';

// root component
import { Root } from "../../Layout/Root";

// custom component
import { Util } from "../../../Util/util";
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from "../../Common/PageTitle/PageTitle";
import { riverToast } from "../../Common/Toast/Toast";
import SimpleListDialog from "../../Common/SimpleListDialog/SimpleListDialog";
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { AddNewBtn } from "../../Common/AddNewBtn/AddNewBtn";
import { SearchWidget } from "../../Common/SearchWidget/SearchWidget";
import { BookingMasterService } from "./BookingMaster.service";

// css
import "./BookingMaster.scss";

const HALL_MODE_ADD = "HALL_ADD";
const HALL_MODE_EDIT = "HALL_EDIT";
const STATUS_LIST = [{title: "All", value: "all"}, {title: "Booked", value: "booked"}, {title: "Cancelled", value: "cancelled"}, ];

const PRIVILEGE_CREATE_MEETING_ROOM = "CREATE_MEETING_ROOM";
const PRIVILEGE_GET_MEETING_ROOMS = "GET_MEETING_ROOMS";
const PRIVILEGE_UPDATE_MEETING_ROOM = "UPDATE_MEETING_ROOM";
const PRIVILEGE_DISABLE_MEETING_ROOM = "DISABLE_MEETING_ROOM";
const PRIVILEGE_GET_ALL_BOOKING_FOR_ADMIN = "GET_ALL_BOOKING_FOR_ADMIN";
const PRIVILEGE_DISABLE_BOOKING_BY_ADMIN = "DISABLE_BOOKING_BY_ADMIN";

class BookingMaster extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedTab: 0,
            bookingStatusList: [],
            hallList: [],
            selectedLocation: "",
            locationList: [],
            selectedRoom: "",
            roomList: [],
            isHallAddEditDialogOpen: false,
            hallAddTitle: "",
            hallAddDescription: "",
            selectedHall: "",
            isHallDeleteDialogOpen: false,
            hallMode: "",
            selectedStatus: "all",
            isBookingStatusDeleteDialogOpen: false
        };
        this.handleHallLocationSelect = this.handleHallLocationSelect.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    render(){
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Booking Master" />
                    <div className="booking-master-wrapper">
                        <div className="row">
                            <div className="col-md-12 flex-container">
                                <Paper>
                                    <Tabs
                                        value={this.state.selectedTab}
                                        onChange={this.handleTabChange.bind(this)}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        >
                                        <Tab label="BOOKINGS" />
                                        <Tab label="HALLS" />
                                    </Tabs>
                                </Paper>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                {this.state.selectedTab === 0 && this.getBookingTabTemplate()}
                                {this.state.selectedTab === 1 && this.getHallTabTemplate()}
                            </div>
                        </div>
                        <Dialog open={this.state.isHallAddEditDialogOpen} fullWidth="true" maxWidth="sm" className="booking-master-dialog">
                            <DialogTitle>
                                {this.state.hallMode === HALL_MODE_ADD? "Create Hall" : "Update Hall"}
                            </DialogTitle>
                            <DialogContent>
                                <div className="row">
                                    <div className="col-md-12">
                                        <TextField
                                            name="hallAddTitle"
                                            id="inputHallAddTitle"
                                            label="Title"
                                            required
                                            margin="normal"
                                            value={this.state.hallAddTitle}
                                            onChange={this.handleInputChange}
                                            className="edit-target-field full-width"
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 input-container">
                                        <TextField
                                            name="hallAddDescription"
                                            id="inputHallAddDescription"
                                            label="Description"
                                            required
                                            margin="normal"
                                            multiline
                                            value={this.state.hallAddDescription}
                                            onChange={this.handleInputChange}
                                            className="edit-target-field full-width"
                                            />
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button color="primary" onClick={this.toggleHallAddDialog.bind(this, false)}>Cancel</Button>
                                <Button color="primary" onClick={this.createEditHall.bind(this)}>Ok</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={this.state.isHallDeleteDialogOpen} fullWidth="true" maxWidth="sm" className="booking-master-dialog">
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                                <p>Are you sure you want to delete this Hall?</p>
                            </DialogContent>
                            <DialogActions>
                                <Button color="primary" onClick={this.toggleHallDeleteDialog.bind(this, false)}>Cancel</Button>
                                <Button color="primary" onClick={this.deleteHall.bind(this)}>Ok</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={this.state.isBookingStatusDeleteDialogOpen} fullWidth="true" maxWidth="sm" className="booking-master-dialog">
                            <DialogTitle>Confirm Delete</DialogTitle>
                            <DialogContent>
                                <p>Are you sure you want to delete this Scheduled Booking?</p>
                            </DialogContent>
                            <DialogActions>
                                <Button color="primary" onClick={this.toggleBookingStatusDeleteDialog.bind(this, false)}>Cancel</Button>
                                <Button color="primary" onClick={this.deleteBookingStatus.bind(this)}>Ok</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    componentDidMount(){
        this.loadLocationList();
        //this.loadAllUserBookings();
    }

    isDatePast(time){
        return  moment().valueOf() > time;
    }

    getbookingStatusList(){
        return this.state.bookingStatusList.map((item) => {
            const fromDate = moment.unix(item.fromDate / 1000);
            const endDate = moment.unix(item.endDate / 1000);
            const cardClass = item.isExpanded? 'expanded' : 'collapsed';
            const avatarImage = (item.room.createdBy.avatar)? Util.getFullImageUrl(item.room.createdBy.avatar) : "/resources/images/img/user-avatar.png";

            return (
                <article className={`bookcard ${cardClass}`} key={item.id}>
                    <header className="bookcard-header">
                        <div className="bookcard-info">
                            <h1 className="bookcard-title">{item.room.title} <span className="bookcard-subtitle">{`(${item.room.bookingLocation.title})`}</span></h1>
                            <p className="bookcard-short">{item.shortDescription}</p>
                            <span className="bookcard-time">
                                [<time>{fromDate.format("DD MMM YYYY : HH:mm")}</time> to <time>{endDate.format("DD MMM YYYY : HH:mm")}</time>]
                            </span>
                        </div>
                        <div className="actions">
                            <Button size="small" onClick={this.toggleBookingDetails.bind(this, item.id)}>
                                { item.isExpanded? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                            </Button>
                            {Util.hasPrivilage(PRIVILEGE_DISABLE_BOOKING_BY_ADMIN) && <Button size="small" onClick={this.onBookingStatusDeleteSelect.bind(this, item)} disabled={this.isDatePast(item.fromDate)}>
                                <DeleteIcon />
                            </Button>}
                        </div>
                    </header>
                    <Collapse in={item.isExpanded}>
                        <div className="bookcard-body">
                            <Paper className="paper-common">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Table className="table-common">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Meeting Type</TableCell>
                                                    <TableCell>{item.meetingType.title}</TableCell>
                                                    <TableCell component="th" scope="row">Participants(#)</TableCell>
                                                    <TableCell numeric>{item.participantsCount}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Description</TableCell>
                                                    <TableCell colSpan="3" className="text-multiline">{item.longDescription}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Created by</TableCell>
                                                    <TableCell colSpan="3" style={{display: "flex", "alignItems": "center"}}>
                                                        <Avatar src={avatarImage}></Avatar>
                                                        <span>{item.room.createdBy.name}</span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </Collapse>
                </article>
            );
        });
    }

    getBookingTabTemplate(){
        return (
            <div className="content-container extra-margin-b">
                <div className="page-content-section">
                    <div className="booking-container">
                        <div className="row">
                            <div className="col-md-4 input-container">
                                <SelectBox 
                                    name="selectedLocation"
                                    id="inputLocation2" 
                                    label="Location"
                                    selectedValue={this.state.selectedLocation}
                                    selectArray={this.state.locationList}
                                    onSelect={this.handleHallLocationSelect}
                                    />
                            </div>
                            <div className="col-md-4 input-container">
                                <SelectBox 
                                    name="selectedRoom"
                                    id="inputRoom" 
                                    label="Room"
                                    selectedValue={this.state.selectedRoom}
                                    selectArray={this.state.roomList}
                                    onSelect={e => this.handleSelectChange(e, "selectedRoom")}
                                    />
                            </div>
                            <div className="col-md-2 input-container">
                                <SelectBox 
                                    name="selectedStatus"
                                    id="inputStatus" 
                                    label="Room"
                                    selectedValue={this.state.selectedStatus}
                                    selectArray={STATUS_LIST}
                                    onSelect={e => this.handleSelectChange(e, "selectedStatus")}
                                    />
                            </div>
                            <div className="col-md-2">
                                <Button color="primary" size="large" raised onClick={this.onBookingStatusSearch.bind(this)}>Search</Button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                {    
                                    this.state.bookingStatusList.length > 0 ?
                                        <div className="booking-body">
                                            {this.getbookingStatusList()}
                                        </div>
                                        : 
                                        <div className="empty-content-container">No halls have been booked yet.</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onBookingStatusSearch(){
        this.loadBookingStatus();
    }

    toggleBookingDetails(itemId){
        let tempList = [...this.state.bookingStatusList];
        let delta = tempList.find(item => itemId === item.id);
        delta.isExpanded = !delta.isExpanded;
        this.setState({bookingStatusList: tempList});
    }

    getHallTabTemplate(){
        return (
            <div className="content-container extra-margin-b">
                <div className="page-content-section">
                    <div className="content-container extra-margin-b">
                        <div className="hall-container">
                            <div className="row booking-controls">
                                <div className="col-md-4 input-container">
                                    <SelectBox 
                                        name="selectedLocation"
                                        id="inputLocation" 
                                        label="Location"
                                        selectedValue={this.state.selectedLocation}
                                        selectArray={this.state.locationList}
                                        onSelect={this.handleHallLocationSelect}
                                        />
                                </div>
                                <div className="col-md-4">
                                    {
                                        Util.hasPrivilage(PRIVILEGE_CREATE_MEETING_ROOM) && <Button color="primary" raised size="large" onClick={this.onAddHall.bind(this)}>Add a Hall</Button>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    {    
                                        this.state.hallList.length > 0 ?
                                            <div className="hall-body">
                                                {this.getHallList()}
                                            </div>
                                            : 
                                            <div className="empty-content-container">
                                            {
                                                !this.state.selectedLocation ?  "Please select a location." : "There are no Halls added yet."
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getHallList(){
        return this.state.hallList.map((item) => {
            return (
                <article className="bookcard" key={item.code}>
                    <header className="bookcard-header">
                        <div className="bookcard-info">
                            <h1 className="bookcard-title">{item.title} <span className="bookcard-subtitle">{item.bookingLocation.title}</span></h1>
                            <p className="bookcard-short">Code: {item.bookingLocation.title}</p>
                        </div>
                        <div className="actions">
                            {Util.hasPrivilage(PRIVILEGE_UPDATE_MEETING_ROOM) && <Button size="small" onClick={this.onHallEditSelect.bind(this, item)}>
                                <CreateIcon />
                            </Button>}
                            {Util.hasPrivilage(PRIVILEGE_DISABLE_MEETING_ROOM) && <Button size="small" onClick={this.onHallDeleteSelect.bind(this, item.code)}>
                                <DeleteIcon />
                            </Button>}
                        </div>
                    </header>
                </article>
            );
        });
    }

    clearTabs(){
        this.setState({
            ...this.state,
            bookingStatusList: [],
            hallList: [],
            selectedLocation: ""
        });
    }

    loadBookingStatus(){
        const dataStamp = moment().startOf("day").valueOf();
        const roomcode = this.state.selectedRoom;
        const bookingStatus = this.state.selectedStatus;

        BookingMasterService.getBookingStatus(dataStamp, roomcode, bookingStatus)
            .then( data => {
            const bookingStatusList = data.map(item => ({...item,isExpanded: false}));
            //console.log(bookingStatusList);
            this.setState({...this.state, bookingStatusList});
        })
            .catch( error => {
            riverToast.show(error.status_message || "Something went wrong while fetching Booking status.");
        });
    }

    loadLocationList(){
        BookingMasterService.getBookingLocations()
            .then( data => {
            let locationList = data.map(item => ({...item, value: item.code}));
            locationList = [{title: "Select Location", value: ""}, ...locationList];
            this.setState({...this.state, locationList});
        })
            .catch( error => {
            riverToast.show(error.status_message || "Something went wrong while fetching Room locations.");
        });
    }

    loadHallList(locationCode){
        return BookingMasterService.getBookingRoomList(locationCode)
            .then( hallList => {
            //console.log(hallList);
            const roomList = hallList.map(item => ({title: item.title, value: item.code}));
            this.setState({...this.state, hallList, roomList});
        })
            .catch( error => {
            riverToast.show(error.status_message || "Something went wrong while fetching Room list.");
        });
    }

    loadAllUserBookings(){
        BookingMasterService.getAllUserBookings()
            .then(data => {
            const bookingStatusList = data.map(item => ({...item,isExpanded: false}));
            this.setState({bookingStatusList});
        })
            .catch(error => {
            riverToast.show("Something went wrong while loading booking schedules.");
        });
    }

    handleTabChange(e, selectedTab){
        this.clearTabs();
        this.setState({
            ...this.state,
            selectedTab
        });
        switch(selectedTab) {
            case 0:
                break;
            default:
                break;
        }
    }

    handleHallLocationSelect(locationCode){
        const selectedLocation = this.state.locationList.find(item => item.value === locationCode);
        if(locationCode !== ""){
            this.setState({...this.state, selectedLocation: selectedLocation.value});
            this.loadHallList(locationCode);
        }
        else{
            this.setState({...this.state, selectedLocation: "", hallList: []});
        }
    }

    handleInputChange (event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSelectChange(selectedItem, name){
        this.setState({
            [name]: selectedItem
        });
    }

    onBookingStatusDeleteSelect(item){
        this.setState({selectedHash: item.hash});
        this.setState({...this.state, isBookingStatusDeleteDialogOpen: !this.state.isBookingStatusDeleteDialogOpen});
    }

    toggleBookingStatusDeleteDialog(openState){
        const isBookingStatusDeleteDialogOpen = (typeof openState === "undefined")? !this.state.isBookingStatusDeleteDialogOpen : openState;
        this.setState({isBookingStatusDeleteDialogOpen});
    }

    deleteBookingStatus(){
        if(!this.state.selectedHash){
            riverToast.show("Please select a Location & Room.");
            return;
        }
        const selectedHash = this.state.selectedHash;
        BookingMasterService.cancelBookingStatus(selectedHash)
            .then(data => {
            this.setState({isBookingStatusDeleteDialogOpen: false});
            riverToast.show("Booking cancelled successfully");
            this.loadBookingStatus();

        })
            .catch(error => {
            this.setState({isBookingStatusDeleteDialogOpen: false});
            riverToast.show(error.status_message || "Something went wrong while deleting the booked schedule.");
        });
    }

    onAddHall(){
        this.setState({
            ...this.state,
            isHallAddEditDialogOpen: true,
            hallAddTitle: "",
            hallAddDescription: "",
            hallMode: HALL_MODE_ADD
        });
    }

    createEditHall(){
        if(this.state.hallMode && this.state.hallMode === HALL_MODE_ADD){
            this.createHall();
        }
        else if(this.state.hallMode && this.state.hallMode === HALL_MODE_EDIT){
            this.editHall();
        }
    }

    createHall(){
        const requestParams = {
            "title": this.state.hallAddTitle,
            "bookingLocation": this.state.selectedLocation,
            "description": this.state.hallAddDescription
        };
        BookingMasterService.createHall(requestParams)
            .then(data => {
            //console.log(data);
            this.setState({
                ...this.state,
                isHallAddEditDialogOpen: false,
                hallAddTitle: "",
                hallAddDescription: "",
                hallMode: ""
            });
            this.loadHallList(this.state.selectedLocation);
            riverToast.show("Hall added successfully.");
        })
            .catch(error => {
            this.setState({
                ...this.state,
                isHallAddEditDialogOpen: false,
                hallAddTitle: "",
                hallAddDescription: "",
                hallMode: ""
            });
            riverToast.show(error.status_message || "Something went wrong while adding the hall.");
        });
    }

    toggleHallAddDialog(openState){
        if(openState){
            this.setState({
                ...this.state,
                hallAddTitle: "",
                hallAddDescription: ""
            });
        }
        const isHallAddEditDialogOpen = (typeof openState === "undefined")? !this.state.isHallAddEditDialogOpen : openState;
        this.setState({isHallAddEditDialogOpen});
    }

    onHallDeleteSelect(hallCode){
        if(hallCode){
            this.setState({
                ...this.state,
                selectedHall: hallCode,
                isHallDeleteDialogOpen: true
            })
        }
        this.toggleHallDeleteDialog(true);
    }

    deleteHall(){
        const code = this.state.selectedHall;
        BookingMasterService.deleteHall(code)
            .then(data => {
            this.setState({...this.state,
                           selectedHall: "",
                           isHallDeleteDialogOpen: false
                          });
            this.loadHallList(this.state.selectedLocation);
            riverToast.show(`Hall deleted.`);

        })
            .catch(error => {
            this.setState({...this.state,
                           selectedHall: "",
                           isHallDeleteDialogOpen: false
                          });
            riverToast.show(error.status_message || "Something went wrong while deleting the Hall.");
        });
    }

    onHallEditSelect(hall){
        this.setState({
            ...this.state,
            isHallAddEditDialogOpen: true,
            selectedHall: hall.code,
            hallAddTitle: hall.title,
            hallAddDescription: hall.description,
            hallMode: HALL_MODE_EDIT
        });
    }

    editHall(){
        const requestParams = {
            "title": this.state.hallAddTitle,
            "bookingLocation": this.state.selectedLocation,
            "description": this.state.hallAddDescription
        };
        BookingMasterService.editHall(requestParams, this.state.selectedHall)
            .then(data => {
            this.setState({
                ...this.state,
                isHallAddEditDialogOpen: false,
                hallAddTitle: "",
                hallAddDescription: "",
                hallMode: ""
            });
            this.loadHallList(this.state.selectedLocation);
            riverToast.show("Hall updated successfully.");
        })
            .catch(error => {
            this.setState({
                ...this.state,
                isHallAddEditDialogOpen: false,
                hallAddTitle: "",
                hallAddDescription: "",
                hallMode: ""
            });
            riverToast.show(error.status_message || "Something went wrong while updating the hall.");
        });
    }

    toggleHallDeleteDialog(openState){
        const isHallDeleteDialogOpen = (typeof openState === "undefined")? !this.state.isHallDeleteDialogOpen : openState;
        this.setState({isHallDeleteDialogOpen});
    }
}

export default BookingMaster;