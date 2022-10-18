import React, { Component } from 'react';
import Datetime from 'react-datetime';
import Icon from 'material-ui/Icon';
import Chip from 'material-ui/Chip';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { riverToast } from '../../../Common/Toast/Toast';
import { Util } from "../../../../Util/util";
//css
import './PresidentTaskInterestedDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class PresidentTaskInterestedDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedClubs: [],
            deadline: "",
            comment: ""
        }
        this.dateOptions = {
            placeholder: 'Claim Period',
            className: "claim-input"
        };
    }
    componentDidMount() {
        this.populateSelectedClubs();
    }

    componentDidUpdate(prevProps) {
        const currProps = this.props;
        if (!prevProps.open && currProps.open) {
            this.populateSelectedClubs();
        }
    }

    populateSelectedClubs = () => {
        let selectedClubs = [{ ...this.props.userClub }];
        this.setState({ selectedClubs });
    }

    render() {
        return (
            <Dialog classes={classes} className='task-interested-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>Submit For Approval</p>
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
                                        defaultValue=""
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
                        {
                            (this.state.selectedClubs.length !== 0) && this.state.selectedClubs.map((item, id) =>
                                <Chip
                                    key={item.id}
                                    label={item.name}
                                    onRequestDelete={item.id === this.props.userClub.id ? undefined : this.handleDelete(item)}
                                    className="chip"
                                    color="primary"
                                />
                            )}
                    </div>

                    <div className='comment-wrap'>
                        <TextField
                            label='Comment*'
                            name='comment'
                            fullWidth
                            rows={2}
                            multiline={true}
                            className='input-text'
                            margin='normal'
                            value={this.state.comment}
                            onChange={this.handleTextChange}
                        />
                    </div>

                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                    <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleTaskInterestedDialog}>Submit</LoadedButton>

                </DialogActions>
            </Dialog>
        )
    }

    handleTaskInterestedDialog = () => {
        const clubs = this.state.selectedClubs.map(club => club.id)
        let request = {
            comment: this.state.comment,
            clubs: clubs,
            deadline: this.state.deadline
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        let taskId = this.props.taskId;
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
            riverToast.show("Please add a club to the task.");
        }
        else if (!request.comment.length) {
            isValid = false;
            riverToast.show("Please enter a comment.");
        }
        return isValid;
    }

    resetForm() {
        this.setState({
            selectedClubs: [],
            comment: "",
            deadline: ""
        });
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
    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }
    handleDelete = (selectedClub) => (event) => {

        let selectedClubs = [...this.state.selectedClubs];
        if (selectedClub.id === this.props.userClub.id) {
            return;
        }
        const index = selectedClubs.findIndex(club => (club.id === selectedClub.id));
        if (index > -1) {
            selectedClubs.splice(index, 1);
            this.setState({ selectedClubs });
        }
    }

    isDateValid = (current) => {
        return true;
    }

    onDateChange = (date) => {
        this.setState({ deadline: date });
    }
    handleClose = () => {
        this.resetForm();
        this.props.onClose();
    }
}

PresidentTaskInterestedDialog.defaultProps = {
    selectedClubs: [],
    deadline: ""
};

PresidentTaskInterestedDialog.propTypes = {
    selectedClubs: PropTypes.array,
    deadline: PropTypes.object
}
export default PresidentTaskInterestedDialog