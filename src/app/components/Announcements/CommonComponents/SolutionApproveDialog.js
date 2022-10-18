import React, { Component } from 'react';

import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { riverToast } from '../../Common/Toast/Toast';
import LoadedButton from "../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../Util/util";
import './SolutionApproveDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class SolutionApproveDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ""
        }
    }

    componentDidMount() {
        this.resetForm();
    }

    render() {
        return (
            <Dialog classes={classes} className='solution-approve-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    Confirm Approval
                </DialogTitle>
                <DialogContent className='content'>
                    <p>Please give a reason for approving this solution</p>
                    <TextField
                        label='Comment*'
                        name='comment'
                        fullWidth
                        multiline
                        className='input-text'
                        margin='normal'
                        value={this.state.comment}
                        onChange={this.handleTextChange}
                    />
                    <DialogActions className="submit-wrapper">
                        <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                        <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleSolutionApprove}>Submit</LoadedButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
    handleSolutionApprove = () => {
        let comment = this.state.comment;
        let solutionId = this.props.solutionId;
        let problemdetail = this.props.problemdetail;
        const isValid = this.validateForm(comment);
        if (!isValid) {
            return;
        }

        this.props.onCreate({ comment }, solutionId, problemdetail);
        // this.props.onCreate({ comment }, solutionId, problemdetail)
        //     .then(() => {
        //         this.resetForm();
        //     })
        //     .catch((err) => {
        //         console.log("errr", err);

        //     });
    }
    validateForm(comment) {
        let isValid = true;
        if (!comment.length) {
            isValid = false;
            riverToast.show("please enter a comment for closing the problem");
        }
        return isValid;
    }
    resetForm = () => {
        this.setState({
            comment: ""
        })
    }
    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }
    handleClose = () => {
        this.props.onClose();
        this.resetForm();
    }
}
export default SolutionApproveDialog