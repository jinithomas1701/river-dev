import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import {SelectBox} from '../../../Common/SelectBox/SelectBox';
import Chip from 'material-ui/Chip';

// custom component
import { Util } from '../../../../Util/util';
import { riverToast } from '../../../Common/Toast/Toast';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';

// css
import './EditVoiceDialog.scss';

const VOICE_TYPE_COMPLAINT = "C";

class EditVoiceDialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            descriptionText: "",
            solutionText: "",
            attachments: [],
            removedAttachments: []
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleEditVoice = this.handleEditVoice.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAddAttachment = this.handleAddAttachment.bind(this);
        this.handleDeleteAttachment = this.handleDeleteAttachment.bind(this);
    }

    componentDidUpdate(prevProps){
        const props = this.props;
        const voice = props.voice;

        if(!prevProps.open && props.open){
            //@DESC: populating input fields with original voice data.

            this.setState({
                descriptionText: voice.description,
                solutionText: voice.solution,
                attachments: voice.attachments,
                removedAttachments: []
            });
        }
    }

    render(){
        const props = this.props;
        const voice = props.voice;
        const showSolution = voice.type.code === VOICE_TYPE_COMPLAINT;
        const disableInputs = props.loading;

        return (
            <Dialog className="editvoice-dialog-wrapper" open={props.open} size="md" onRequestClose={this.handleClose}>
                <DialogTitle className="header">Edit Voice</DialogTitle>
                <DialogContent className="content">
                    <div className="row">
                        <div className="col-md-12">
                            <TextField
                                multiline
                                rowsMax={4}
                                disabled={disableInputs}
                                label="Description*"
                                name="descriptionText"
                                className="input-text"
                                value={this.state.descriptionText}
                                onChange={this.handleTextChange}
                                />
                        </div>
                    </div>
                    {
                        showSolution && <div className="row">
                                <div className="col-md-12">
                                    <TextField
                                        multiline
                                        rowsMax={4}
                                        disabled={disableInputs}
                                        label="Solution*"
                                        name="solutionText"
                                        className="input-text"
                                        value={this.state.solutionText}
                                        onChange={this.handleTextChange}
                                        />
                                </div>
                            </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <FieldHeader title="Attachments" />
                            <AttachmentInput
                                editable={!disableInputs}
                                attachments={this.state.attachments}
                                onAddAttachment={this.handleAddAttachment}
                                onDeleteAttachment={this.handleDeleteAttachment}
                                />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton loading={props.loading} className="btn-default btn-cancel" onClick={this.handleClose}>Cancel</LoadedButton>
                    <LoadedButton loading={props.loading} className="btn-primary btn-cancel" onClick={this.handleEditVoice}>ReSubmit</LoadedButton>
                </DialogActions>
            </Dialog>
        );
    }

    handleTextChange(event){
        const field = event.target.name;
        const value = event.target.value;
        this.setState({[field]: value});
    }

    handleClose(){
        this.resetForm();
        this.props.onClose();
    }

    handleAddAttachment(file){
        const attachments = [...this.state.attachments];
        attachments.push(file);
        this.setState({ attachments });
    }

    handleDeleteAttachment(file){
        let attachments = [...this.state.attachments];
        const index = attachments.findIndex(attachment => (attachment.name === file.name));
        if(index > -1){
            const [deletedFile] = attachments.splice(index, 1);
            if(deletedFile.hasOwnProperty('path')){
                //@DESC: add to removal list if attachment already exists
                let tempAttachments = [...this.state.removedAttachments];
                const removedAttachments = [...tempAttachments, deletedFile];
                console.log(removedAttachments);
                this.setState({removedAttachments});
            }
        }
        this.setState({ attachments });
    }

    handleEditVoice(){
        const voice = this.props.voice;

        let request = {
            description: this.state.descriptionText,
            removedAttachments: this.state.removedAttachments.map(file => file.path),
            addedAttachments: this.state.attachments.filter(file => file.hasOwnProperty('content'))
        };

        if(voice.type.code === VOICE_TYPE_COMPLAINT){
            request.solution = this.state.solutionText
        }

        const isValid = this.validateForm(request);
        if(!isValid){
            return;
        }
        this.props.onEdit(request)
            .then(() => {
            this.resetForm();
        })
            .catch(() => {
        });
    }

    validateForm(request){
        let isValid = true;

        if(!request.description){
            isValid = false;
            riverToast.show("Please add a description.");
        }
        else if(request.hasOwnProperty("solution") && !request.solution){
            isValid = false;
            riverToast.show("Please add your Solution to this complaint.");
        }

        return isValid;
    }

    resetForm(){
        this.setState({
            descriptionText: "",
            solutionText: "",
            attachments: [],
            removedAttachments: []
        });
    }
}

EditVoiceDialog.propTypes = {
    open: PropTypes.bool,
    loading: PropTypes.bool,
    voice: PropTypes.object,
    onEdit: PropTypes.func,
    onClose: PropTypes.func
};

export default EditVoiceDialog;