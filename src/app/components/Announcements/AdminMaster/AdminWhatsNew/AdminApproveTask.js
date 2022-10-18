import React, { Component } from 'react';
import Datetime from 'react-datetime';
import moment, { now } from 'moment';
import Icon from 'material-ui/Icon';
import Chip from 'material-ui/Chip';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { riverToast } from '../../../Common/Toast/Toast';
import { Util } from "../../../../Util/util";
import './AdminApproveTask.scss';
const STATUS_COMPLETED = "CO";
const STATUS_INPROGRESS = "IP";
const STATUS_UPCOMING = "UC";
const STATUS_PENDING_APPROVAL = "AP";
const classes = Util.overrideCommonDialogClasses();
class AdminApproveTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "",
            deadline: "",
            taskId: "",
            selectedClubs: []
        }
        this.StatusList = this.getStatusList();
        this.dateOptions = {
            placeholder: 'Claim Period',
            className: "claim-input"
        };
    }

    componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps) {
        const currProps = this.props;
        if (!prevProps.open && currProps.open) {
            this.init();
        }
    }
    init() {
        let selectedClubs = [...this.props.taskApproveDetail.clubs];
        let status = "UC";
        this.setState({status});
        this.setState({ selectedClubs });
        this.setState({ deadline: this.props.taskApproveDetail.deadline });
        this.setState({ taskId: this.props.taskApproveDetail.id });
    }
    render() {
        //const now = moment();
        return (
            <Dialog classes={classes} className='task-approve-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>Approve Task</p>
                </DialogTitle>
                <DialogContent className='content'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <SelectBox
                                label="Choose Clubs:"
                                classes="input-select"
                                fullWidth
                                selectedValue={this.state.selectedClubs}
                                selectArray={this.props.clubListing}
                                onSelect={this.handleClubChange}
                            />
                        </div>
                        <div className='col-md-6 date-wrap'>
                            <div className='row'>
                                <div className="date-time">
                                    <span className="label">Expires On:</span>
                                    <Datetime
                                        //defaultValue={now}
                                        isValidDate={this.isDateValid}
                                        dateFormat="DD-MM-YYYY"
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

                    <div className='club-chip'>
                        {(this.state.selectedClubs.length !== 0) && this.state.selectedClubs.map((item, id) =>
                            <Chip
                                key={item.id}
                                label={item.name}
                                onRequestDelete={item.id === this.props.taskApproveDetail.clubs.id ? undefined : this.handleDelete(item)}
                                className="chip"
                                color="primary"
                            />

                        )}
                    </div>
                    <div className='status'>
                        <SelectBox
                            label="Status"
                            classes="input-select"
                            fullWidth
                            selectedValue={this.state.status}
                            selectArray={this.StatusList}
                            onSelect={this.handleStatusTypeChange}
                        />

                    </div>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                    <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleTaskApproveDialog}>Submit</LoadedButton>

                </DialogActions>
            </Dialog>
        )
    }
    handleClubValue = () => {
        let myClubs = [...this.state.clubs];
        let selectedClub = this.props.taskApproveDetail.clubs.id;
        myClubs.push(selectedClub);
        this.setState({ clubs: myClubs });
        this.setState({ selectedClub: selectedClub });
    }
    handleTaskApproveDialog = () => {
        const clubs = this.state.selectedClubs.map(club => club.id)
        let request = {
            clubs: clubs,
            status: this.state.status,
            deadline: this.state.deadline
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        let taskId = this.state.taskId;
        console.log(request, taskId);
        this.props.onCreate(request, taskId)
            .then(() => {
                this.resetForm();
            })
            .catch(() => {
            });
    }
    validateForm(request) {
        let isValid = true;
        if (!request.clubs.length) {
            isValid = false;
            riverToast.show("Clubs are mandatory");
        }
        else if (!request.status.length) {
            isValid = false;
            riverToast.show("Status is mandatory");
        }
        else if (request.status === STATUS_UPCOMING && request.clubs.length && request.deadline === "") {
            isValid = false;
            riverToast.show("Please add a deadline.");
        }
        return isValid;
    }
    resetForm() {
        this.setState({
            status: "",
            deadline: "",
            taskId: "",
            clubs: [],
            selectedClub: []
        })
    }

    getStatusList() {
        return [
            { title: "UPCOMING", value: "UC" },
            { title: "IN-PROGRESS", value: "IP" },
            { title: "COMPLETED", value: "CO" },
        ];
    }
    handleStatusTypeChange = (statusType) => {
        this.setState({ status: statusType });
    }
    handleClose = () => {
        this.resetForm();
        this.props.onClose();
    }
    handleDelete = (selectedClub) => (event) => {
        let selectedClubs = [...this.state.selectedClubs];
        if (selectedClub.id === this.props.taskApproveDetail.clubs.id) {
            return;
        }
        const index = selectedClubs.findIndex(club => (club.id === selectedClub.id));
        if (index > -1) {
            selectedClubs.splice(index, 1);
            this.setState({ selectedClubs });
        }
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

    isDateValid = (current) => {
        return true;
    }
    onDateChange = (date) => {
        this.setState({ deadline: date });
    }
}
export default AdminApproveTask