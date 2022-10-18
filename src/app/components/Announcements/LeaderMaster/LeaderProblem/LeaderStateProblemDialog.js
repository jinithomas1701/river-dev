import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import AutoComplete from '../../../Common/AutoComplete/AutoComplete';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import { riverToast } from "../../../Common/Toast/Toast";
import { Util } from "../../../../Util/util";
//css
import './LeaderStateProblemDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class LeaderStateProblemDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            tag: {},
            attachments: [],
            selectedTagList: []

        }
    }
    render() {
        return (
            <Dialog classes={classes} className='state-problem-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>Create a Problem</p>
                </DialogTitle>
                <DialogContent className='content'>
                    <div className='create-body'>
                        <div className='title-wrap'>
                            <TextField
                                label='Title*'
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

                        <div className='row'>
                            <div className='col-md-12'>
                                <AutoComplete
                                    options={this.props.tagList}
                                    placeholder="Select Tags"
                                    emptyMessage="No Tags"
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
                            <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleStateProblem}>Submit</LoadedButton>

                        </DialogActions>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
    handleStateProblem = () => {
        let codes = this.state.selectedTagList.map(tag => tag.value);
        let request = {
            title: this.state.title,
            description: this.state.description,
            attachments: this.state.attachments,
            tags: { names: [], codes }
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
            riverToast.show("please add a title for your problem");
        }
        else if (!request.description.length) {
            isValid = false;
            riverToast.show(" please add a description for your problem");
        }
        return isValid;
    }
    resetForm = () => {
        this.setState({
            title: "",
            description: "",
            tag: {},
            attachments: [],
            selectedTagList: []
        })
    }
    handleClose = () => {
        this.resetForm();
        this.props.onClose();
    }
    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
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
    handleTagDelete = (selectedTagList) => (event) => {
        let selectedTagList = [...this.state.selectedTagList];
        const index = selectedTagList.findIndex(TagList => (TagList.id === selectedTagList.value));
        if (index > -1) {
            selectedTagList.splice(index, 1);
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
export default LeaderStateProblemDialog