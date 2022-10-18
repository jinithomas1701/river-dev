import React, { Component } from "react";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { riverToast } from '../../../Common/Toast/Toast';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import { Util } from "../../../../Util/util";
//css
import './AdminAnnouncementStatusUpdateDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class AdminAnnouncementStatusUpdateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            status: "",
            taskId: "",
        };
        this.StatusList = this.getStatusList();
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
        this.setState({ status: this.props.taskDetail.status })
        this.setState({ taskId: this.props.taskDetail.id });
    }

    render() {
        const props = this.props;
        return (
            <Dialog classes={classes} className='statusupdate-dialog-wrap' open={props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    UPDATE STATUS
                </DialogTitle>
                {
                    typeof props.taskDetail === 'object' &&
                    <DialogContent className='content'>
                        <div className="col-md-3">
                            <div className='status-wrap'>
                                <SelectBox
                                    label="Status"
                                    classes="input-select"
                                    selectedValue={this.state.status.code}
                                    selectArray={this.StatusList}
                                    onSelect={this.handleStatusTypeChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
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
                        </div>
                        <DialogActions className="submit-wrapper">
                            <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                            <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.onUpdateStatusSubmission}>Update</LoadedButton>
                        </DialogActions>
                    </DialogContent>
                }
            </Dialog>
        )
    }

    onUpdateStatusSubmission = () => {
        let request = {
            comment: this.state.comment
        };
        let taskId = this.state.taskId;
        let status = this.state.status;
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.onStatusUpdateSubmission(request, taskId, status)
            .then((response) => {
                this.resetForm();
            })
            .catch((error) => {
            });
    }

    validateForm(request) {
        let isValid = true;
        if (!request.comment.length) {
            isValid = false;
            riverToast.show("Please enter a comment for the change.");
        }
        return isValid;
    }

    resetForm() {
        this.setState({
            comment: "",
            status: "",
            taskId: ""
        })
    }

    getStatusList = () => {
        return [
            { title: "UPCOMING", value: "UC" },
            { title: "IN-PROGRESS", value: "IP" },
            { title: "COMPLETED", value: "CO" }

        ];
    }

    handleStatusTypeChange = (statusType) => {
        this.setState({ status: statusType });
    }

    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    handleClose = () => {
        this.resetForm();
        this.props.onClose();
    }
}
export default AdminAnnouncementStatusUpdateDialog