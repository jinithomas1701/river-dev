import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { riverToast } from '../../../Common/Toast/Toast';
import { Util } from "../../../../Util/util";
//css
import './PresidentAddSolutionDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class PresidentAddSolutionDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solutiontitle: "",
            solutiondescription: "",
            attachments: [],
            value: "true",
            BoolValue: true
        }
    }
    render() {
        return (
            <Dialog classes={classes} className='addsolution-without-problem-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>Add Solution for this problem</p>
                </DialogTitle>
                <DialogContent className='content'>
                    <div className='create-body'>
                        <div className='title-wrap'>
                            <TextField
                                label='Solution Title*'
                                name='solutiontitle'
                                fullWidth
                                multiline
                                className='input-text'
                                margin='normal'
                                value={this.state.solutiontitle}
                                onChange={this.handleTextChange}
                            />
                        </div>
                        <div className='description-wrap'>
                            <TextField
                                label='Solution Description*'
                                name='solutiondescription'
                                fullWidth
                                className='input-text'
                                margin='normal'
                                multiline
                                rowsMax="4"
                                value={this.state.solutiondescription}
                                onChange={this.handleTextChange}
                            />
                        </div>
                        <p className='solution-accept-line'>Do you want to work on the solution or just suggest a solution?</p>
                        <div className='row interested-button '>
                            <FormControl component="fieldset" className='interested-button'>

                                <RadioGroup
                                    aria-label="Interested"
                                    name="value"
                                    className='interested-radio-button'
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                >
                                    <FormControlLabel classes={{ label: "radio-text" }} className='radio-label' value="true" control={<Radio />} label="Yes,We want to work on this" />
                                    <FormControlLabel classes={{ label: "radio-text" }} className='radio-label' value="false" control={<Radio />} label="No,We are only giving our suggestion" />
                                </RadioGroup>
                            </FormControl>
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
                        <DialogActions className="submit-wrapper">
                            <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                            <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleAddSolution}>Submit</LoadedButton>

                        </DialogActions>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
    handleAddSolution = () => {
        let request = {
            title: this.state.solutiontitle,
            description: this.state.solutiondescription,
            attachments: this.state.attachments,
            problem: {},
            takingOwnership: this.state.BoolValue

        };

        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }

        this.props.onCreate(request, this.props.problemDetail)
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
            riverToast.show("Please add a title for this solution.");
        }
        else if (!request.description.length) {
            isValid = false;
            riverToast.show("Please add a description for this solution.");
        }
        return isValid;
    }
    resetForm() {
        this.setState({
            solutiontitle: "",
            solutiondescription: "",
            attachments: [],
            value: "true",
            BoolValue: true

        });
    }
    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }
    handleClose = () => {
        this.props.onClose();
    }
    handleChange = event => {
        this.setState({ value: event.target.value });
        var boolValue = event.target.value.toLowerCase() == "true" ? true : false;
        this.setState({ BoolValue: boolValue });
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
}
export default PresidentAddSolutionDialog