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

import Datetime from 'react-datetime';
import moment from 'moment';

// root component
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from "../Common/PageTitle/PageTitle";
import { riverToast } from "../Common/Toast/Toast";
import SimpleListDialog from "../Common/SimpleListDialog/SimpleListDialog";
import { SelectBox } from "../Common/SelectBox/SelectBox";
import { AddNewBtn } from "../Common/AddNewBtn/AddNewBtn";
import { SearchWidget } from "../Common/SearchWidget/SearchWidget";
import { BookingService } from "./Booking.service";

// css
import "./Booking.scss";

class Booking extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bookingList: [],
            isDeleteDialogOpen: false,
            selectedScheduleHash: ''
        };
    }

    render(){

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Booking" />
                    <div className="row">
                        <div className="col-md-12">
                            <AddNewBtn title="New Booking" callback={this.onAddBooking.bind(this)} />
                        </div>
                    </div>
                    <div className="row booking-wrapper">
                        <div className="col-md-12">
                            <div className="content-container extra-margin-b">
                                <div className="page-content-section">
                                    <div className="booking-container">
                                        {    
                                            this.state.bookingList.length > 0 ?
                                                <div className="booking-body">
                                                    {this.getBookingList()}
                                                </div>
                                                : 
                                                <div className="empty-content-container">You can book a conference/Meeting Room in any of Litmus7 Locations by refering to the available slots.</div>
                                        }
                                    </div>
                                    <Dialog open={this.state.isDeleteDialogOpen}>
                                        <DialogTitle>Confirm Delete</DialogTitle>
                                        <DialogContent>
                                            <p>Are you sure you want to delete this booking entry?</p>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button color="primary" onClick={this.toggleDeleteDialog.bind(this, false)}>Cancel</Button>
                                            <Button color="primary" onClick={this.deleteBooking.bind(this)}>Ok</Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    componentDidMount(){
        this.loadAllUserBookings();
    }

    loadAllUserBookings(){
        BookingService.getAllUserBookings()
            .then(data => {
            const bookingList = data.map(item => ({...item,isExpanded: false}));
            //console.log(bookingList);
            this.setState({bookingList});
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while loading booking schedules.");
        });
    }
    
    isDatePast(time){
        return (moment().valueOf() > time);
    }

    getBookingList(){
        return this.state.bookingList.map((item) => {
            const fromDate = moment.unix(item.fromDate / 1000);
            const endDate = moment.unix(item.endDate / 1000);
            const cardClass = item.isExpanded? 'expanded' : 'collapsed';
            const avatarImage = (item.createdBy.avatar)? Util.getFullImageUrl(item.createdBy.avatar) : "/resources/images/img/user-avatar.png";

            return (
                <article className={`bookcard ${cardClass} ${item.status}`} key={item.id}>
                    <header className="bookcard-header">
                        <div className="bookcard-info">
                            <h1 className="bookcard-title">{item.room.title} <span className="bookcard-subtitle">{`(${item.room.bookingLocation.title})`}</span></h1>
                            {item.status === "cancelled" && <span className="bookcard-status">(Event Cancelled)</span>}
                            <p className="bookcard-short">{item.shortDescription}</p>
                            <span className="bookcard-time">
                                [<time>{fromDate.format("DD MMM YYYY : HH:mm")}</time> to <time>{endDate.format("DD MMM YYYY : HH:mm")}</time>]
                            </span>
                        </div>
                        <div className="actions">
                            <Button size="small" onClick={this.toggleBookingDetails.bind(this, item.id)}>
                                { item.isExpanded? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                            </Button>
                            <Button size="small" onClick={this.onEditBookingSelect.bind(this, item)} disabled={this.isDatePast(item.fromDate)}>
                                <CreateIcon />
                            </Button>
                            <Button size="small" onClick={this.onDeleteSelect.bind(this, item.hash)} disabled={this.isDatePast(item.fromDate)}>
                                <DeleteIcon />
                            </Button>
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
                                                        <span>{item.createdBy.name}</span>
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

    toggleBookingDetails(itemId){
        let tempList = [...this.state.bookingList];
        let delta = tempList.find(item => itemId === item.id);
        delta.isExpanded = !delta.isExpanded;
        this.setState({bookingList: tempList});
    }

    onAddBooking(){
        this.props.history.push("/booking/config");
    }

    onDeleteSelect(hash){
        this.setState({selectedScheduleHash: hash});
        this.toggleDeleteDialog(true);
    }

    toggleDeleteDialog(openState){
        const isDeleteDialogOpen = (typeof openState === "undefined")? !this.state.isDeleteDialogOpen : openState;
        this.setState({isDeleteDialogOpen});
    }

    deleteBooking(){
        const hash = this.state.selectedScheduleHash;
        BookingService.deleteBooking(hash)
            .then(data => {
            this.setState({selectedScheduleHash: ""});
            this.setState({isDeleteDialogOpen: false});
            this.loadAllUserBookings();

        })
            .catch(error => {
            this.setState({selectedScheduleHash: ""});
            this.setState({isDeleteDialogOpen: false});
            riverToast.show(error.status_message || "Something went wrong while deleting the booked schedule.");
        });
    }

    onEditBookingSelect(item){
        if(item.hash){
            this.setState({selectedScheduleHash: item.hash});
            this.props.history.push({pathname: "/booking/config", state: {bookingItem: item}});
        }
    }
}

export default Booking;