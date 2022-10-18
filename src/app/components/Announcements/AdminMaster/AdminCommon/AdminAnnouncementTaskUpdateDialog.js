import React, { Component } from 'react';

import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Datetime from 'react-datetime';
import Icon from 'material-ui/Icon';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../../Util/util";
//css

import './AdminAnnouncementTaskUpdateDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class AdminAnnouncementTaskUpdateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            title: '',
            description: '',
            taskDetail: "",
            deadline: "",
            clubs: [],
            selectedClubs: [],
            attachments: [],
            newAttachments: [],
            deletedAttachment: []
        }
        this.StatusList = this.getStatusList();
        this.dateOptions = {
            placeholder: 'Claim Period',
            className: "claim-input"
        };
    }

    componentDidMount() {
        this.init();
        this.populateSelectedClubs();
    }
    componentDidUpdate(prevProps) {
        const currProps = this.props;
        if (!prevProps.open && currProps.open) {
            this.init();
            this.populateSelectedClubs();
        }
    }

    init() {
        this.setState({ deadline: this.props.taskDetail.deadline });
        this.setState({ title: this.props.taskDetail.title });
        this.setState({ description: this.props.taskDetail.description });
        this.setState({ attachments: this.props.taskDetail.attachments });
        this.setState({ taskDetail: this.props.taskDetail });
        this.setState({ status: this.props.taskDetail.status.code });
    }

    populateSelectedClubs = () => {
        let selectedClubs = [...this.props.taskDetail.clubs];
        this.setState({ selectedClubs });
    }

    render() {

        const props = this.props;
        const deadline = this.state.deadline === null ? "" : this.state.deadline;
        return (
            <Dialog classes={classes} className='taskupdate-dialog-wrap' size="md" open={props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>UPDATE TASK</p>
                </DialogTitle>
                <DialogContent className='content'>
                    <div className='create-body'>
                        <div className='title-wrap'>
                            <TextField
                                label='Announcement Title*'
                                name='title'
                                fullWidth
                                multiline
                                className='input-text'
                                margin='normal'
                                value={this.state.title}
                                onChange={this.handleTextChange}
                            />
                        </div>
                        <div className='description-wrap'>
                            <TextField
                                label='Description*'
                                name='description'
                                fullWidth
                                className='input-text'
                                margin='normal'
                                multiline
                                rowsMax="4"
                                value={this.state.description}
                                onChange={this.handleTextChange}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <SelectBox
                                    label='Status'
                                    classes='input-select'
                                    selectedValue={this.state.status}
                                    selectArray={this.StatusList}
                                    onSelect={this.handleStatusTypeChange}
                                />
                            </div>
                            <div className="col-md-6 date-wrap">
                                <div className='row'>
                                    <div className="activity-date">
                                        <span className="label">Target Date:</span>
                                        <Datetime
                                            defaultValue={deadline}
                                            isValidDate={this.isDateValid}
                                            dateFormat="YYYY-MM-DD"
                                            timeFormat={false}
                                            closeOnSelect={true}
                                            inputProps={this.dateOptions}
                                            onChange={this.onDateChange}
                                            value={this.state.deadline}
                                        />
                                        <Icon className="calender-icon">today</Icon>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <SelectBox
                            label='Club'
                            classes='input-select'
                            selectedValue={this.state.selectedClubs}
                            selectArray={props.clubListing}
                            onSelect={this.handleClubTypeChange}
                        />
                        <div className='club-chip'>
                            {this.state.selectedClubs.map((item, id) =>
                                <Chip
                                    key={item.id}
                                    label={item.name}
                                    onRequestDelete={this.handleDelete(item)}
                                    className="chip"
                                    color="primary"
                                />
                            )}
                        </div>
                        <div className='row attachment-wrap'>
                            <div className='col-md-12'>
                                <FieldHeader title="Attachments" />
                                <AttachmentInput
                                    editable={true}
                                    attachments={this.state.attachments}
                                    onAddAttachment={this.handleAddAttachment}
                                    onDeleteAttachment={this.handleDeleteAttachment}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogActions className="submit-wrapper">
                        <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                        <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleAnnouncementUpdate}>Update</LoadedButton>
                    </DialogActions>
                </DialogContent>
            </Dialog >
        )
    }
    getStatusList() {
        return [
            { title: "UPCOMING", value: "UC" },
            { title: "IN-PROGRESS", value: "IP" },
            { title: "COMPLETED", value: "CO" }
        ];
    }
    handleAnnouncementUpdate = () => {
        const clubs = this.state.selectedClubs.map(club => club.id)
        let request = {
            title: this.state.title,
            description: this.state.description,
            status: this.state.status,
            clubs: clubs,
            deadline: this.state.deadline,
            removedAttachments: this.state.deletedAttachment,
            addedAttachments: this.state.newAttachments
        };
        let taskDetail = this.state.taskDetail;
        let taskId = this.state.taskDetail.id;
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.handleAnnouncementUpdate(request, taskId, taskDetail)
            .then(() => {
                this.resetForm();
            })
            .catch(() => {
            });
    }

    validateForm(request) {
        let isValid = true;
        if (!request.title.length) {
            isValid = false;
            riverToast.show("Please enter a title.");
        }
        else if (!request.description.length) {
            isValid = false;
            riverToast.show("Please enter a description.");
        }
        else if (!request.status.length) {
            isValid = false;
            riverToast.show("Please enter a status.");
        }
        return isValid;
    }

    resetForm() {
        this.setState({
            deadline: "",
            status: "",
            title: '',
            description: '',
            taskDetail: "",
            clubs: [],
            selectedClubs: [],
            attachments: [],
            newAttachments: [],
            deletedAttachment: []
        })
    }

    delete = (file) => {
        console.log(file);
    }
    isDateValid = (current) => {
        return true;
    };

    onDateChange = (date) => {
        this.setState({ deadline: date });
    }

    handleStatusTypeChange = (statusType) => {
        this.setState({ status: statusType });
    }
    handleClubTypeChange = (clubCode) => {
        let selectedClubs = [...this.state.selectedClubs];
        const newClub = this.props.clubListing.find(club => (clubCode === club.value));
        let index = selectedClubs.findIndex(item => (item.id === clubCode));
        if (index === -1 && newClub) {
            selectedClubs.push({ id: newClub.value, name: newClub.title });
            this.setState({ selectedClubs });
        }
    }

    isDateValid(current) {
        const nextMonth = moment().add(1, "month").startOf("month");
        return (current.isAfter(this.startDay) && current.isBefore(nextMonth));
    };
    onClaimPeriodChange(value) {
        this.setState({ claimPeriod: Math.round((new Date(value)).getTime() / 1000) });
    }

    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    handleAddAttachment = (file) => {
        let attachments = [...this.state.attachments];
        let newAttachments = [...this.state.newAttachments];
        attachments.push(file);
        newAttachments.push(file);
        this.setState({ newAttachments });
        this.setState({ attachments });
    }

    handleDeleteAttachment = (file) => {
        let attachments = [...this.state.attachments];
        let deletedAttachment = [...this.state.deletedAttachment];
        const index = attachments.findIndex(attachment => (attachment.name === file.name));
        if (index > -1) {
            deletedAttachment.push(attachments[index]);
            attachments.splice(index, 1);
        }
        this.setState({ deletedAttachment });
        this.setState({ attachments });
    }
    handleClose = () => {
        this.resetForm();
        this.props.onClose();
    }
    handleDelete = (selectedClub) => (event) => {
        let selectedClubs = [...this.state.selectedClubs];
        const index = selectedClubs.findIndex(club => (club.id === selectedClub.id));
        if (index > -1) {
            selectedClubs.splice(index, 1);
            this.setState({ selectedClubs });
        }
    }
}
export default AdminAnnouncementTaskUpdateDialog