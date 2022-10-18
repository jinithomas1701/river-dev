import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import {connect} from "react-redux";
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { LinearProgress } from 'material-ui/Progress';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from '../../../Util/util';
import {FeedsService} from '../Feed.service';
import {addAttachment, addImage, clearAll, removeAttachment, fieldChange} from "./StatusDialog.actions";

import "./StatusDialog.scss";

const mapStateToProps = (state) => {
    return {
        status: state.StatusDialogReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAttachment: (attachmentFiles) => {
            dispatch(addAttachment(attachmentFiles));
        },
        addImage: (image) => {
            dispatch(addImage(image));
        },
        clearAll: () => {
            dispatch(clearAll());
        },
        removeAttachment: (index) => {
            dispatch(removeAttachment(index));
        },
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
        }
    }
};

class StatusDialog extends React.Component {
    state = {
        showProgress: false
    };
    render() {

        const attachmentFiles = this.props.status.attachmentFiles ? this.props.status.attachmentFiles.map((attachment, index) => {
            let className;
            if (attachment.type.split("/")[0] == "image") {
                className = "attachment "+attachment.type.split("/")[0];
                const imgId = "img-"+index;
                Util.displayImageFromFile(attachment, imgId);
                return  <div key={index} className={className} alt={attachment.name}>
                            <img className="attachment-image" id={imgId} src="" />
                            <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                                <Icon>clear</Icon>
                            </div>
                        </div>;
            } else {
                className = "attachment "+attachment.type.split("/")[1];
                return  <div key={index} className={className} alt={attachment.name}>
                            {attachment.type.split("/")[1]}
                            <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                                <Icon>clear</Icon>
                            </div>
                        </div>;
            }
            
        }) : false;
  
        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="status-dialog-container">
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>Status</DialogTitle>
                <DialogContent>
                    <div className="status-content-container">
                        <div>
                            <input
                                type="text"
                                className="river-text-field"
                                placeholder="Title"
                                maxlength = "80"
                                value={this.props.status.statusFields.title}
                                onChange={(e) => {
                                    this.props.fieldChange('title', e.target.value);
                                }}
                            />
                        </div>
                        <textarea className="river-text-area" placeholder="Update your current status here"
                                value={this.props.status.statusFields.content}
                                onChange={(e) => {
                                    this.props.fieldChange('content', e.target.value);
                                }}>
                        </textarea>
                        <div className="extras-holder status-image-holder">
                            <div className="btn-close status-image" onClick={this.onRemoveStatusImage.bind(this)}>
                                <Icon>clear</Icon>
                            </div>
                            <img id="status-image" className="status-image" src="" />
                        </div>
                        <div className="extras-holder">
                            <input accept="jpg,jpeg,JPG,JPEG" onChange={(e) => {
                                this.onStatusImageChange(e);
                            }} id="file-image" type="file" />
                            <label htmlFor="file-image">
                                <IconButton component="span" aria-label="Upload Image">
                                    <Icon>photo</Icon>
                                </IconButton>
                            </label>
                            

                            {/* <input id="file-attachment" multiple type="file" onChange={(e) => {
                                    this.onAttachmentFileChange(e);
                            }}/>
                            <label htmlFor="file-attachment">
                                <IconButton component="span" aria-label="Upload attchments">
                                    <Icon>add</Icon>
                                </IconButton>
                            </label> */}
                            {/* <div className="chip-container">
                                <Chip
                                    avatar={<Avatar>U</Avatar>}
                                    label="Username"
                                    onRequestDelete={this.onRemovetagedUser.bind(this)}
                                />
                                <input type="text" className="chip-input" placeholder="Search users" />
                            </div> */}
                        </div>
                        <div className="extras-holder attachments-holder">
                            {attachmentFiles}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.onPostStatus.bind(this)} color="primary">
                        Post
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    onRemovetagedUser() {
        
    }

    onRemoveAttachment(attachment, index) {
        this.props.removeAttachment(index);
    }

    handleRequestClose() {
        this.props.clearAll();
        this.props.onRequestClose(false);
    }

    onStatusImageChange(event) {
        const imageFile = event.target.files[0];
        this.props.addImage(imageFile);
        document.querySelector(".status-image-holder").style.display = "block";
        Util.displayImageFromFile(imageFile, "status-image");
        Util.base64ImageFromFile(imageFile)
            .then(result => {
                this.props.fieldChange("images", [{
                    name: imageFile.name,
                    content: result
                }]);
            });
    }

    onAttachmentFileChange(event) {
        const attachmentFiles = Array.from(event.target.files);
        this.props.addAttachment(attachmentFiles);
    }

    onRemoveStatusImage() {
        this.props.addImage({});
        Util.displayImageFromFile(null, "status-image");
        document.querySelector(".status-image-holder").style.display = "none";
        document.getElementById("file-image").value = "";
        this.props.fieldChange("images", []);
    }

    onPostStatus() {
        if (this.props.status.statusFields.content) {
            this.setState({showProgress: true});
            FeedsService.postStatusTask(this.props.status.statusFields)
                .then(data => {
                    this.setState({showProgress: false});
                    this.props.clearAll();
                    this.props.onRequestClose(false, true);
                })
                .catch(error => {
                    this.setState({showProgress: false});
                    riverToast.show(error.status_message);
                });
        } else {
            riverToast.show("Please write any content to post status.");
        }
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(StatusDialog);
