import React, { Component } from 'react';

import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { riverToast } from '../../../Common/Toast/Toast';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { Util } from "../../../../Util/util";
//css
import './LeaderProblemClosingDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class LeaderProblemClosingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ""
        }
    }

    render() {
        return (
            <Dialog classes={classes} className='problem-closing-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>Why Closing The Problem</p>
                </DialogTitle>
                <DialogContent className='content'>
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
                        <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleProblemClose}>Submit</LoadedButton>

                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
    handleProblemClose = () => {
        let comment = this.state.comment;
        let closingProblemId = this.props.closingProblemId;
        let problemDetail = this.props.problemDetail;
        const isValid = this.validateForm(comment);
        if (!isValid) {
            return;
        }

        this.props.onCreate({ comment }, closingProblemId, problemDetail)
            .then(() => {
                this.resetForm();
            })
            .catch(() => {

            });
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
export default LeaderProblemClosingDialog