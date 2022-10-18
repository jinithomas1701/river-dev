import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Datetime from 'react-datetime';

import Icon from 'material-ui/Icon';
import { FormControlLabel } from 'material-ui/Form';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import { riverToast } from '../../../Common/Toast/Toast';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
//css
import './AdminAnnouncementCreate.scss';
const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
class AdminAnnouncementCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            status: "",
            clubs: [],
            selectedClubs: [],
            deadline: "",
            attachments: [],
            checkedB: false
        };

        this.dateOptions = {
            placeholder: 'Claim Period',
            className: "claim-input"
        };
        this.StatusList = this.getStatusList();
        this.updated = false;
    }

    componentDidMount() {
        const claimedClubs = this.props.selectedProblem ? this.props.selectedProblem.claimedClubs : null;
        if (claimedClubs && claimedClubs.length && !this.updated) {
            if (!this.updated) {
                this.updated = true;
                let selectedClubs = [...claimedClubs];
                this.setState({ selectedClubs });
            }
            else {
                this.setState({ selectedClubs: [] });
            }
        }
        else {
            this.updated = false;
        }
        this.populateSelectedStatus();
    }

    componentDidUpdate(prevProps) {
        const currProps = this.props;
        const prevClubs = prevProps.selectedProblem ? prevProps.selectedProblem.claimedClubs : null;
        const claimedClubs = currProps.selectedProblem ? currProps.selectedProblem.claimedClubs : null;

        if (claimedClubs && claimedClubs.length && prevClubs && !this.updated) {
            if (!this.updated) {
                this.updated = true;
                let selectedClubs = [...claimedClubs];
                this.setState({ selectedClubs });
            }
            else {
                this.setState({ selectedClubs: [] });
            }
        }
        if (!prevProps.open && currProps.open) {
            this.updated = false;
            this.populateSelectedStatus();
        }
    }

    populateSelectedStatus = () => {
        let status = "UC";
        this.setState({status});
    }

    render() {
        const problemDetail = this.props.selectedProblem;
        return (
            <div className='create-announcement-wrap'>
                <div className="create-page-card">
                    <PageTitle title="Create Task" />
                    <div className="content">
                        <div className="row">
                            <div className="col-md-8">
                                <TextField
                                    label="Title"
                                    name="title"
                                    fullWidth
                                    className="input-text"
                                    value={this.state.title}
                                    onChange={this.handleTextChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectBox
                                    label="Status"
                                    classes="input-select"
                                    fullWidth
                                    selectedValue={this.state.status}
                                    selectArray={this.StatusList}
                                    onSelect={this.handleStatusTypeChange}
                                />
                            </div>
                        </div>
                        <div className="row form-align-bottom">
                            <div className="col-md-8 description-wrapper">
                                <TextField
                                    rows={4}
                                    multiline={true}
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    className="input-text"
                                    margin="normal"
                                    value={this.state.description}
                                    onChange={this.handleTextChange}
                                />
                            </div>
                            <div className="col-md-4 column">
                                <div className="switch">
                                    <FormControlLabel
                                        className="deadline-switch"
                                        control={
                                            <Switch
                                                checked={this.state.checkedB}
                                                onChange={this.handleChange('checkedB')}
                                                value="checkedB"
                                                color="primary"
                                            />
                                        }
                                        label="Has Expiry Date:"
                                    />
                                </div>

                                {
                                    this.state.checkedB &&
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="date-time">
                                                <span className="label">Expires On:</span>
                                                <Datetime
                                                    defaultValue=""
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
                                }
                            </div>
                        </div>

                        <div className="row club-wrap">
                            <div className="col-md-4 club-listing">

                                <SelectBox
                                    label="Choose Clubs:"
                                    classes="input-select"
                                    fullWidth
                                    selectedValue={this.state.selectedClub}
                                    selectArray={this.props.clubListing}
                                    onSelect={this.handleClubChange}
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
                            </div>
                            <div className='col-md-8'>
                            </div>
                        </div>

                        <div className="row attachment-wrap">
                            <div className="col-md-12">
                                <FieldHeader title="Attachments" />
                                <AttachmentInput
                                    editable={true}
                                    attachments={this.state.attachments}
                                    onAddAttachment={this.handleAddAttachment}
                                    onDeleteAttachment={this.handleDeleteAttachment}
                                />
                            </div>
                        </div>
                        <div className='problemis-wrap'>
                            <FieldHeader title="Select Problem" />
                            <div className='row'>
                                {
                                    problemDetail !== null &&
                                    <div className='col-md-9'>

                                        <div className='selected-problem-display'>
                                            <div className='body'>
                                                <div className='problem-title'>
                                                    {problemDetail.title}
                                                </div>
                                                <div className='problem-code'>
                                                    {problemDetail.id}
                                                </div>
                                            </div>
                                            {this.props.showProblemDeleteButton ===true&&
                                            <div className='action-area'>
                                                <IconButton onClick={this.handleRemoveProblem}>delete</IconButton>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                }
                                <div className='col-md-3'>
                                    {problemDetail === null && this.props.showProblemButton === true &&
                                        <div className='select-problem-button'>
                                            <Button className="btn-default " color="default" onClick={this.handleOpenproblemdialog}>SELECT A PROBLEM</Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-12">
                                <div className="submit-wrapper">
                                    <Button className="btn-primary btn-submit" color="primary" onClick={this.handleAnnouncementCreate}>SUBMIT</Button>
                                    <Button className="btn-default btn-draft" color="default" onClick={this.handleClose}>close</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleOpenproblemdialog = () => {
        this.props.onProblemSelect();
    }

    handleRemoveProblem = () => {
        this.props.onProblemRemove();
    }

    onDateChange = (date) => {
        this.setState({ deadline: date });
    }

    handleChange = (name) => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleClose = () => {
        this.resetForm();
        this.props.closecreatedock();
    }

    resetForm() {
        this.setState({
            title: "",
            description: "",
            status: "",
            clubs: [],
            deadline: "",
            attachments: [],
            selectedProblem: null,
            checkedB: false
        });
    }

    isDateValid = (current) => {
        return true;
    }

    handleAnnouncementCreate = () => {
        const clubs = this.state.selectedClubs.map(club => club.id)
        let request = {
            title: this.state.title,
            description: this.state.description,
            clubs: clubs,
            status: this.state.status,
            attachments: this.state.attachments,
            deadline: this.state.deadline,
            problemId: this.props.selectedProblem ? this.props.selectedProblem.id : null

        };
        console.log(request);
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.onCreate(request)
            .then(() => {
                this.resetForm();
            })
            .catch(() => {
            });
    }

    validateForm(request) {
        let isValid = true;
        if (!request.status.length) {
            isValid = false;
            riverToast.show("Please add a status for this Announcement.");
        }
        else if (!request.title) {
            isValid = false;
            riverToast.show("Please add a title for this Announcement.");
        }
        else if (!request.description) {
            isValid = false;
            riverToast.show("Please add a description for this Announcement.");
        }
        else if (request.status === STATUS_UPCOMING && request.clubs.length && request.deadline === "") {
            isValid = false;
            riverToast.show("Please add a deadline for this Announcement.");
        }
        else if (request.status === STATUS_INPROGRESS) {
            if (!request.clubs.length) {
                isValid = false;
                riverToast.show("Please add a club for this Announcement.");
            }
            else if (request.deadline === "") {
                isValid = false;
                riverToast.show("Please add a deadline for this Announcement.");
            }
        }
        else if (request.status === STATUS_COMPLETED && !request.clubs.length) {
            isValid = false;
            riverToast.show("Please add a club for this Announcement.");
        }
        return isValid;
    }

    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    handleStatusTypeChange = (statusType) => {
        this.setState({ status: statusType });
    }

    handleClubChange = (clubCode) => {
        let selectedClubs = [...this.state.selectedClubs];
        const newClub = this.props.clubListing.find(club => (clubCode === club.value));
        let index = selectedClubs.findIndex(item => (item.id === clubCode));
        if (index === -1 && newClub) {
            selectedClubs.push({ id: newClub.value, name: newClub.title });
            this.setState({ selectedClubs });
        }
    }

    handleDelete = (selectedClub) => (event) => {

        let selectedClubs = [...this.state.selectedClubs];
        const index = selectedClubs.findIndex(club => (club.id === selectedClub.id));
        if (index > -1) {
            selectedClubs.splice(index, 1);
            this.setState({ selectedClubs });
        }
    }

    handleAddAttachment = (file) => {
        const attachments = [...this.state.attachments];
        attachments.push(file);
        this.setState({ attachments });
    }

    handleDeleteAttachment = (file) => {
        let attachments = [...this.state.attachments];
        const index = attachments.findIndex(attachment => (attachment.name === file.name));
        if (index > -1) {
            attachments.splice(index, 1);
        }
        this.setState({ attachments });
    }

    getStatusList() {
        return [
            { title: "UPCOMING", value: "UC" },
            { title: "IN-PROGRESS", value: "IP" },
            { title: "COMPLETED", value: "CO" }
        ];
    }
}


export default AdminAnnouncementCreate