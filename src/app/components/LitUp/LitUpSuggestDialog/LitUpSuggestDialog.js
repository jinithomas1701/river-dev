import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import moment from 'moment';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

// custom component
import {Util} from "../../../Util/util";
import './LitUpSuggestDialog.scss';
import { LitUpService } from "../LitUp.service";

export default class LitUpSuggestDialog extends React.Component {

    state = {
        ideaTitle: '',
        ideaContent: '',
        fileList: [],
        isRemoved: false
    };
    imageBase64FileList = [];

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            let fileList = [];
            if (this.props.suggestion) {
                if (this.props.suggestion.attachedDoc && this.props.suggestion.attachedDoc.fileContents) {
                    fileList.push({
                        name: this.props.suggestion.attachedDoc.filename
                    });
                }
                this.setState({
                    isRemoved: false,
                    fileList: fileList,
                    ideaTitle: this.props.suggestion.title,
                    ideaContent: this.props.suggestion.description
                });
            } else {
                this.setState({
                    isRemoved: false,
                    fileList: fileList,
                    ideaTitle: '',
                    ideaContent: ''
                });
            }
        }
    }

    render() {

        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="litup-suggest-dialog-container">
                <DialogTitle className="dialog-topic-heading">{this.props.litUpTopic.title}</DialogTitle>
                <DialogContent>
                    <div className="content-container">
                        <TextField
                            id="suggest-idea-topic"
                            label="Idea Title"
                            margin="normal"
                            value={this.state.ideaTitle}
                            onChange={(e) => {
                                this.setState({ideaTitle: e.target.value});
                            }}
                        />
                        <textarea className="club-textarea" rows="10" placeholder="Suggest your idea" value={this.state.ideaContent}
                            onChange={(e) => {
                                this.setState({ideaContent: e.target.value});
                            }}></textarea>
                        <div className="club-textarea-line"></div>
                        {/* <TextField
                            id="suggest-idea"
                            label="Suggest your idea"
                            multiline
                            margin="normal"
                            value={this.state.ideaContent}
                            onChange={(e) => {
                                this.setState({ideaContent: e.target.value});
                            }}
                        /> */}
                        <div className="file-upload-container">
                            <input id="file-upload" type="file" onChange={(e) => {
                                    this.onAttachmentFileChange(e);
                            }}/>
                            <label htmlFor="file-upload">
                                { !this.state.fileList || this.state.fileList.length <= 0 && 
                                    <div className="select-file-tile">
                                        <Icon>attach_file</Icon>
                                    </div>
                                    
                                }
                                
                            </label>
                            { this.state.fileList && this.state.fileList.length > 0 && 
                                <div className="selected-file-container">
                                    <div className="file-name">{this.state.fileList[0].name}</div>
                                    <div className="file-action" onClick={this.onFileRemove.bind(this)}>
                                        <Icon>clear</Icon>
                                    </div>
                                </div>
                            }
                            
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)}>
                        Cancel 
                    </Button>
                    <Button onClick={this.onSubmit.bind(this, false)} color="primary">
                        {
                            (this.props.suggestion) ? (
                                "Update"
                            ) : (
                                "Submit"
                            )
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    onFileRemove() {
        this.imageBase64FileList = [];
        document.getElementById('file-upload').value = null;
        this.setState({
            ...this.state,
            isRemoved: true,
            fileList: []
        });
    }

    handleRequestClose() {
        this.props.onRequestClose();
    }

    setBase64ImageArray(imageArray) {
        const imageStringArray = [];
        this.imageBase64FileList = [];
        imageArray.forEach((image, index) => {
            Util.base64ImageFromFile(image)
            .then(result => {
                this.imageBase64FileList.push(result);
            });
        }, this);
    }

    validateFile(fileList) {
        let isValid = true;
        let msg = '';
        if (fileList[0].type != 'image/png' 
            && fileList[0].type != 'image/jpeg' 
            && fileList[0].type != 'application/pdf' 
            && fileList[0].type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            && fileList[0].type != 'application/msword'
            && fileList[0].name.split('.')[1] != 'docx' 
            && fileList[0].name.split('.')[1] != 'doc') {
            msg = 'Please attach only image, pdf and docx files';
        }

        if (msg) {
            isValid = false;
            riverToast.show(msg);
        }

        return isValid;
    }

    onAttachmentFileChange(event) {
        if (this.validateFile(event.target.files)) {
            const attachmentFiles = Array.from(event.target.files);
            let selectedImageFiles = this.state.fileList;
            selectedImageFiles = selectedImageFiles.concat(attachmentFiles);
            this.setBase64ImageArray(selectedImageFiles);
            this.setState({fileList: selectedImageFiles});
        }
    }

    onSubmit(){
        if (this.state.ideaTitle && this.state.ideaContent) {
            const suggestionRequest = {
                "title": this.state.ideaTitle,
                "description" :this.state.ideaContent,
                "attachments":{
                    "filename":"",
                    "fileContents":""
                }
            };
            if (this.state.fileList && this.state.fileList.length > 0) {
                if (this.props.suggestion && this.props.suggestion.attachedDoc && this.props.suggestion.attachedDoc.fileContents) {
                    if (this.state.isRemoved) {
                        suggestionRequest.attachments.isRemoved = this.state.isRemoved;
                        suggestionRequest.attachments.filename = this.state.fileList[0].name;
                        suggestionRequest.attachments.fileContents = this.imageBase64FileList[0];
                    } else {
                        suggestionRequest.attachments.isRemoved = this.state.isRemoved;
                        suggestionRequest.attachments.filename = null;
                        suggestionRequest.attachments.fileContents = null;
                    }
                    
                } else {
                    suggestionRequest.attachments.filename = this.state.fileList[0].name;
                    suggestionRequest.attachments.fileContents = this.imageBase64FileList[0];
                }
            } else {
                if (this.props.suggestion && this.props.suggestion.attachedDoc && this.props.suggestion.attachedDoc.fileContents) {
                    suggestionRequest.attachments.isRemoved = this.state.isRemoved;
                    suggestionRequest.attachments.filename = null;
                    suggestionRequest.attachments.fileContents = null;
                }
            }

            // If we are updating sugestion
            if (this.props.suggestion) {
                suggestionRequest.ideaId = this.props.suggestion.id;
                LitUpService.updateIdeaSuggestion(this.props.litUpTopic.id, suggestionRequest)
                .then(data => {
                    riverToast.show('Your suggestion has been updated successfully');
                    this.props.onRequestClose(false, true);
                })
                .catch(error => {
                    riverToast.show(error.status_message || 'Something went wring while adding suggestion');
                });
            } else {
                LitUpService.postIdeaSuggestion(this.props.litUpTopic.id, suggestionRequest)
                .then(data => {
                    riverToast.show('Your suggestion has been added successfully');
                    this.props.onRequestClose(false, true);
                })
                .catch(error => {
                    riverToast.show(error.status_message || 'Something went wring while adding suggestion');
                });
            }
        } else {
            riverToast.show('Please add title and description for your idea');
        }
    }

}