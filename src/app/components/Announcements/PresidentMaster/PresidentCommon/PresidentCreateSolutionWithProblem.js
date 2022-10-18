import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import AutoComplete from '../../../Common/AutoComplete/AutoComplete';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { riverToast } from '../../../Common/Toast/Toast';
import { Util } from "../../../../Util/util";
//css
import './PresidentCreateSolutionWithProblem.scss';
const classes = Util.overrideCommonDialogClasses();
class PresidentCreateSolutionWithProblem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solutiontitle: "",
            problemtitle: "",
            solutiondescription: "",
            problemdescription: "",
            attachments: [],
            selectedTagList: [],
            value: "true",
            BoolValue: true
        }
    }
    render() {

        return (
            <Dialog classes={classes} className='createsolution-with-problem-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>Create a solution for your problem</p>
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
                        <div className='problem'>
                            <div className='problem-title-wrap'>
                                <TextField
                                    label="Title of Problem i'm trying to solve "
                                    name='problemtitle'
                                    fullWidth
                                    multiline
                                    className='input-text'
                                    margin='normal'
                                    value={this.state.problemtitle}
                                    onChange={this.handleTextChange}
                                />
                            </div>

                            <div className='problem-description-wrap'>
                                <TextField
                                    label='Problem Description*'
                                    name='problemdescription'
                                    fullWidth
                                    className='input-text'
                                    margin='normal'
                                    multiline
                                    rowsMax="4"
                                    value={this.state.problemdescription}
                                    onChange={this.handleTextChange}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <AutoComplete
                                        options={this.props.tagList}
                                        placeholder="Select Tags"
                                        onChange={this.handletagSelect}
                                        onInputChange={this.handleTagSearch}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="chip-container">
                                        {this.state.selectedTagList &&
                                            this.state.selectedTagList.map(item =>
                                                <Chip
                                                    key={item.code}
                                                    label={item.title}
                                                    onRequestDelete={this.handleTagDelete(item)}
                                                    className="solution-chip"
                                                    color="primary"
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>
                            <DialogActions className="submit-wrapper">
                                <LoadedButton loading={this.props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                                <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleCreateSolution}>Submit</LoadedButton>

                            </DialogActions>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
    handleCreateSolution = () => {
        let codes = this.state.selectedTagList.map(tag => tag.value);
        let request = {
            title: this.state.solutiontitle,
            description: this.state.solutiondescription,

            attachments: this.state.attachments,
            takingOwnership: this.state.BoolValue,

            problem: {
                title: this.state.problemtitle,
                description: this.state.problemdescription,
                tags: { names: [], codes },
            }
        };

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
        if (!request.title.length) {
            isValid = false;
            riverToast.show("Please add a title for the solution.");
        }
        else if (!request.description.length) {
            isValid = false;
            riverToast.show("Please add a discription for the solution.");
        }
        else if (request.takingOwnership === true && !request.problem.title.length) {
            isValid = false;
            riverToast.show("Please add a problem title for the solution.");
        }
        else if (request.takingOwnership === true && !request.problem.description.length) {
            isValid = false;
            riverToast.show("Please add a problem description for the solution.");
        }
        return isValid;
    }
    resetForm() {
        this.setState({
            solutiontitle: "",
            problemtitle: "",
            solutiondescription: "",
            problemdescription: "",
            attachments: [],
            selectedTagList: [],
            value: "true",
            BoolValue: true
        })
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
    handleChange = event => {
        this.setState({ value: event.target.value });
        var boolValue = event.target.value.toLowerCase() == 'true' ? true : false;
        this.setState({ BoolValue: boolValue });
    }

    handleTagDelete = (selectedTagList) => (event) => {
        let selectedTagList = [...this.state.selectedTagList];
        const index = selectedTagList.findIndex(TagList => (TagList.id === selectedTagList.value));
        if (index > -1) {
            selectedTagList.splice(index, 1);
            this.setState({ selectedTagList });
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
    handletagSelect = (tag) => {
        let selectedTagList = [...this.state.selectedTagList];
        const index = selectedTagList.findIndex(item => item.value === tag.value);
        if (index < 0) {
            selectedTagList.push({ ...tag });
            this.setState({ selectedTagList });
        }
    }
    handleTagSearch = (search) => {
        if(search.length > 1) {
            this.props.tagListCall(search);
        }
        else if(search.length === 0){
            this.props.tagListCall();
        }
    }
}
export default PresidentCreateSolutionWithProblem