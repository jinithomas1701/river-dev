import React, { Component } from 'react';

import Chip from 'material-ui/Chip';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import LoadedButton from "../../../Common/LoadedButton/LoadedButton";
import AutoComplete from '../../../Common/AutoComplete/AutoComplete';
import { riverToast } from '../../../Common/Toast/Toast';
import { Util } from "../../../../Util/util";
//css
import './LeaderUpdateProblemDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class LeaderUpdateProblemDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachments: [],
            selectedTagList: [],
            title: '',
            description: '',
            clubs: [],
            tag: {},
            newAttachments: [],
            deletedAttachment: []
        }
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
        this.setState({ title: this.props.problemdetail.title });
        this.setState({ description: this.props.problemdetail.description });
        this.setState({ attachments: this.props.problemdetail.attachments });
        this.setState({ selectedTagList: this.props.problemdetail.tags });
    }
    render() {
        return (
            <Dialog classes={classes} className='problem-update-dialog-wrap' size="md" open={this.props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <p>UPDATE TASK</p>
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
                            <LoadedButton loading={this.props.loading} className="btn-primary btn-cancel" onClick={this.handleUpdateProblem}>Submit</LoadedButton>

                        </DialogActions>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
    handleUpdateProblem = () => {

        let codes = this.state.selectedTagList.map(tag => tag.value);
        let request = {
            title: this.state.title,
            description: this.state.description,
            removedAttachments: this.state.deletedAttachment,
            newAttachments: this.state.newAttachments,
            tags: { names: [], codes }
        };
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        let problemId = this.props.problemdetail.id;
        let problemDetail = this.props.problemdetail;
        this.props.onCreate(request, problemId, problemDetail)
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
            riverToast.show("please add a title to the problem");
        }
        else if (!request.description.length) {
            isValid = false;
            riverToast.show("please add a description to the problem");
        }
        return isValid;
    }
    resetForm = () => {
        this.setState({
            attachments: [],
            selectedTagList: [],
            title: '',
            description: '',

            clubs: [],
            tag: {},
            newAttachments: [],
            deletedAttachment: []
        })
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
    handleTagDelete = (selectedTagList) => (event) => {
        let selectedTagsList = [...this.state.selectedTagsList];
        const index = selectedTagsList.findIndex(TagList => (TagList.id === selectedTagList.value));
        if (index > -1) {
            selectedTagsList.splice(index, 1);
            this.setState({ selectedTagList: selectedTagsList });
        }
    }

    handleClose = () => {
        this.resetForm();
        this.props.onClose();
    }
}
export default LeaderUpdateProblemDialog