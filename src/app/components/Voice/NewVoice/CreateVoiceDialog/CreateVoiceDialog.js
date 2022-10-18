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

// css
import './CreateVoiceDialog.scss';

const VOICE_TYPE_COMPLAINT = "C";

class CreateVoiceDialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            voiceTypeId: undefined,
            departmentIds: [],
            titleText: "",
            descriptionText: "",
            solutionText: "",
            attachments: []
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleVoiceTypeChange = this.handleVoiceTypeChange.bind(this);
        this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
        this.handleCreateVoice = this.handleCreateVoice.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAddAttachment = this.handleAddAttachment.bind(this);
        this.handleDeleteAttachment = this.handleDeleteAttachment.bind(this);
    }

    render(){
        const props = this.props;
        const solutionShow = (this.state.voiceTypeId === VOICE_TYPE_COMPLAINT);
        const chipLabelClass = this.state.departmentIds.length ? "fill" : "empty";

        return (
            <Dialog className="createvoice-dialog-wrapper" open={props.open} size="md" onRequestClose={this.handleClose}>
                <DialogTitle className="header">Create Voice</DialogTitle>
                <DialogContent className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <SelectBox
                                label="Voice Type*" 
                                classes="input-select"
                                disableSysClasses
                                selectedValue = {this.state.voiceTypeId}
                                selectArray={props.voiceTypeList}
                                onSelect={this.handleVoiceTypeChange}
                                />
                        </div>
                        <div className="col-md-6">
                            <SelectBox
                                label="Select Departments*" 
                                classes="input-select"
                                disableSysClasses
                                selectedValue = {""}
                                selectArray={props.departmentList}
                                onSelect={this.handleDepartmentChange}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <TextField
                                label="Title*"
                                name="titleText"
                                className="input-text"
                                value={this.state.title}
                                onChange={this.handleTextChange}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <TextField
                                multiline
                                rowsMax={4}
                                label="Description*"
                                name="descriptionText"
                                className="input-text"
                                value={this.state.description}
                                onChange={this.handleTextChange}
                                />
                        </div>
                    </div>
                    {
                        solutionShow && <div className="row">
                                <div className="col-md-12">
                                    <TextField
                                        multiline
                                        rowsMax={4}
                                        label="Solution*"
                                        name="solutionText"
                                        className="input-text"
                                        value={this.state.solution}
                                        onChange={this.handleTextChange}
                                        />
                                </div>
                            </div>
                    }
                    <div className="row">
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
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <Button className="btn-default btn-cancel" color="default" onClick={this.handleClose} raised>Cancel</Button>
                    <Button className="btn-primary btn-create" color="primary" onClick={this.handleCreateVoice} raised>Create</Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleVoiceTypeChange(voiceTypeId){
        this.setState({voiceTypeId});
    }

    handleDepartmentChange(deptCode){
        this.setState({departmentIds: [deptCode]});

    }

    handleDepartmentDelete(deptCode){
        let tempDept = new Set(this.state.departmentIds);
        tempDept.delete(deptCode);
        this.setState({departmentIds: [...tempDept]});
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

    resetForm(){
        this.setState({
            voiceTypeId: undefined,
            departmentIds: [],
            titleText: "",
            descriptionText: "",
            solutionText: "",
            attachments: []
        });
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
            attachments.splice(index, 1);
        }
        this.setState({ attachments });
    }

    handleCreateVoice(){
        let request = {
            title: this.state.titleText,
            description: this.state.descriptionText,
            departments: this.state.departmentIds,
            type: this.state.voiceTypeId,
            attachments: this.state.attachments
        };

        if(this.state.voiceTypeId === VOICE_TYPE_COMPLAINT){
            request.solution = this.state.solutionText;
        }
        const isValid = this.validateForm(request);
        if(!isValid){
            return;
        }
        this.props.onCreate(request)
            .then(() => {
            this.resetForm();
        })
            .catch(() => {
        });
    }

    validateForm(request){
        let isValid = true;
        if(!request.type){
            isValid = false;
            riverToast.show("Please select the Voice type.");
        }
        else if(!request.departments.length){
            isValid = false;
            riverToast.show("Please select the Department.");
        }
        else if(!request.title){
            isValid = false;
            riverToast.show("Please add a title for this Voice.");
        }
        else if(!request.description){
            isValid = false;
            riverToast.show("Please add a description.");
        }
        else if(request.hasOwnProperty("solution") && !request.solution){
            isValid = false;
            riverToast.show("Please add your Solution to this complaint.");
        }

        return isValid;
    }
}

CreateVoiceDialog.propTypes = {
    open: PropTypes.bool,
    voiceTypeList: PropTypes.array,
    departmentList: PropTypes.array,
    onCreate: PropTypes.func,
    onClose: PropTypes.func
};

export default CreateVoiceDialog;