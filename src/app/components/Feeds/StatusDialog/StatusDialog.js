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
import Tooltip from 'material-ui/Tooltip';

import { Toast, riverToast } from '../../Common/Toast/Toast';
import {SelectBox} from "../../Common/SelectBox/SelectBox";
import {Util} from '../../../Util/util';
import {FeedsService} from '../Feeds.service';
import {addAttachment, addImage, clearAll, removeAttachment, fieldChange, setVisibilityList, setVisibilityValue} from "./StatusDialog.actions";

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
        },
        setVisibilityList: (list) => {
            dispatch(setVisibilityList(list));
        },
        setVisibilityValue: (value) => {
            dispatch(setVisibilityValue(value));
        }
    }
};

class StatusDialog extends React.Component {
    state = {
        showProgress: false,
        embedVideo: false,
        embedUrl: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.onSelectVisibility("all");
            this.loadVisibilityList();
        }
    }

    render() {

        const attachmentFiles = this.props.status.attachmentFiles.map((attachment, index) => {
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
            
        });
  
        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="status-dialog-container">
                {this.state.showProgress &&
                    <LinearProgress />
                }
                <DialogTitle>
                    <div className="status-title-container">
                        <div className="status-title">
                            Status
                        </div>
                        <div className="visibility-box" title="Set visibility of this status">
                            <Icon className="visibility-icon">visibility</Icon>
                            <SelectBox
                                underline = "no-underline"
                                classes="visibility-select-box"
                                id="feed-visibility-select"
                                selectedValue={this.props.status.visibilityValue}
                                selectArray={this.props.status.visibilityList || []}
                                onSelect={this.onSelectVisibility.bind(this)}/>
                        </div>
                    </div>
                </DialogTitle>
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
                                <Tooltip title="Upload Image">
                                    <IconButton component="span" aria-label="Upload Image">
                                        <Icon>photo</Icon>
                                    </IconButton>
                                </Tooltip>
                            </label>
                            {
                                !this.props.status.statusFields.link &&
                                    (!this.state.embedVideo ?
                                        <Tooltip title="Embed Youtube Video">
                                            <IconButton component="span" className="embed-icon" aria-label="Embed Video" onClick={this.onEmbedVideoToggle.bind(this)}>
                                                <Icon>theaters</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    :
                                        <div className="embed-video-link-container">
                                            <input type="text" className="river-text-field embed-video-link" placeholder="Youtube Video Url"
                                                value={this.state.embedUrl}
                                                onChange={this.handleEmbedLinkChange.bind(this)}/>
                                            <IconButton
                                                component="span"
                                                className="embed-add-icon"
                                                aria-label="Embed Video"
                                                onClick={this.onRemoveEmbedVideo.bind(this)}
                                            >
                                                <Icon>delete_forever</Icon>
                                            </IconButton>
                                        </div>)
                            }
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

    onSelectVisibility(selectedValue) {
        this.props.setVisibilityValue(selectedValue);
        let visibilityValue
        if (selectedValue === "all") {
            visibilityValue = selectedValue;
        } else {
            visibilityValue = "club_"+selectedValue;
        }


        this.props.fieldChange('visibility', visibilityValue);
    }

    onEmbedVideoToggle() {
        const flag = !this.state.embedVideo
        this.setState({ embedVideo: flag });
        if(!flag) {
            this.setState({
                ...this.state,
                embedUrl: "",
                embedVideo: false
            })
        }
    }

    handleEmbedLinkChange(event) {
        this.setState({embedUrl: event.target.value});
    }
 
    onRemoveAttachment(attachment, index) {
        this.props.removeAttachment(index);
    }

    onRemoveEmbedVideo(){
        this.onEmbedVideoToggle();
        this.props.fieldChange("link", "");
    }

    handleRequestClose() {
        if(this.state.embedVideo) this.setState({ embedVideo: false });

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

    onEmbedVideoAdd() {
        const urlRegEx = this.state.embedUrl.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/);
        if(urlRegEx) {
            this.props.fieldChange("link", urlRegEx[1]);
            return true;
        }
        riverToast.show("Invalid Video Url, Please try with a correct youtube URL");
        return false;
    }

    onRemoveStatusImage() {
        this.props.addImage({});
        Util.displayImageFromFile(null, "status-image");
        document.querySelector(".status-image-holder").style.display = "none";
        document.getElementById("file-image").value = "";
        this.props.fieldChange("images", []);
    }

    processClubNameList(clubListMap) {
        const clubList = [{
            title: "All",
            value: "all"
        }];

        for (let clubId in clubListMap) {
            if (clubListMap.hasOwnProperty(clubId)) {
                let clubName = clubListMap[clubId];
                clubList.push({
                    title: clubName,
                    value: clubId
                });  
            }
        }
        this.props.setVisibilityList(clubList);
    }

    loadVisibilityList() {
        FeedsService.getClubNames()
            .then(data => {
                this.setState({showProgress: false});
                this.processClubNameList(data);
            })
            .catch(error => {
                this.processClubNameList([]);
                this.setState({showProgress: false});
                riverToast.show(error.status_message);
            });
    }

    onPostStatus() {
        if (this.props.status.statusFields.content || (this.props.status.statusFields.images && this.props.status.statusFields.images.length > 0)) {
            if((this.state.embedUrl && this.onEmbedVideoAdd()) || !this.state.embedUrl){
                this.setState({showProgress: true});
                FeedsService.postStatusTask(this.props.status.statusFields)
                    .then(data => {
                        this.setState({showProgress: false});
                        this.onEmbedVideoToggle();
                        this.props.clearAll();
                        this.props.onRequestClose(false, true);
                    })
                    .catch(error => {
                        this.setState({showProgress: false});
                        riverToast.show(error.status_message);
                    });
            }
        } else {
            riverToast.show("Please write any content or add image to post status.");
        }
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(StatusDialog);
