import React, { Component } from 'react';
import { connect } from "react-redux";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import { Util } from "../../../Util/util";
import Avatar from 'material-ui/Avatar';
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

// root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import { Discussion } from "../../Common/Discussion/Discussion";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import CustomAvatar from '../../Common/Avatar/Avatar';
import InfoIcon from "../../Common/InfoIcon";

// page dependency
import { VoiceDetailService } from "./VoiceDetail.Service";
import {
    fieldChange,
    setVoiceUserTagSearchResult,
    setVoiceUserTagsSelectedResult,
    removeAttachment,
    removeRefineAttachment,
    setAttachements,
    setRefineAttachements,
    loadVoiceTypesList,
    loadVoiceCouncilsList,
    changeSelectedCouncilValue,
    pushAttachement,
    changeLoadedVoiceDetails,
    clearFields
} from "./VoiceDetail.action";

// css
import "./VoiceDetail.scss"

const mapStateToProps = (state) => {
    return {
        voiceDetail: state.VoiceDetailReducer
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
        },
        setVoiceUserTagSearchResult: (result) => {
            dispatch(setVoiceUserTagSearchResult(result))
        },
        setVoiceUserTagsSelectedResult: (result) => {
            dispatch(setVoiceUserTagsSelectedResult(result))
        },
        removeAttachment: (index, isRefine) => {
            dispatch(removeAttachment(index, isRefine))
        },
        removeRefineAttachment: (index) => {
            dispatch(removeRefineAttachment(index))
        },
        setAttachements: (list, isRefine) => {
            dispatch(setAttachements(list, isRefine))
        },
        setRefineAttachements: (list) => {
            dispatch(setRefineAttachements(list))
        },
        loadVoiceTypesList: (list) => {
            dispatch(loadVoiceTypesList(list))
        },
        loadVoiceCouncilsList: (list) => {
            dispatch(loadVoiceCouncilsList(list))
        },
        changeSelectedCouncilValue: (value) => {
            dispatch(changeSelectedCouncilValue(value))
        },
        pushAttachement: (image, isRefine) => {
            dispatch(pushAttachement(image, isRefine))
        },
        changeLoadedVoiceDetails: (voice) => {
            dispatch(changeLoadedVoiceDetails(voice))
        },
        clearFields: () => {
            dispatch(clearFields())
        }
    }
}

class VoiceDetail extends React.Component {

    voiceId = null;
    username = null;
    clubId = null;

    voiceHash = null;
    state = {
        showVoiceCouncilSearchPreloader: false,
        showVoiceUserTagSearchPreloader: false,
        editMode: true,
        voiceLevel: null,
        disscussionSubmitProgress: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadVoiceTypes();
        this.loadVoiceCouncils();
        let club = Util.getMyClubDetails();
        this.clubId = (club.id != 0) ? club.id : null;

        if (this.props.match.params.voiceId && this.props.match.params.username) {
            this.props.clearFields();
            this.voiceId = this.props.match.params.voiceId;
            this.username = this.props.match.params.username;
            this.loadVoiceDetails(this.voiceId, this.username);
            this.setState({ editMode: false });
        } else {
            this.props.clearFields();
            if(!this.clubId) {
                this.fieldChange("includePresident", false);
            }
        }
    }


    render() {

        const voiceType = this.props.voiceDetail.voiceTypesList.map((itm, indx) => {

            if (itm.value == this.props.voiceDetail.voiceDetailFields.type) {
                return <span key={indx}>{itm.title}</span>;
            }
        });
        let attachmentFiles;
        let oldAttachments;
        let refineAttachments;
        if (this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED") {
            oldAttachments = this.props.voiceDetail.voiceDetailFields.images.map((attachment, index) => {
                let className;
                if (attachment.type.split("/")[0] == "image" && !attachment.path) {
                    className = "attachment " + attachment.type.split("/")[0];
                    const imgId = "img-" + index;
                    Util.displayImageFromFile(attachment, imgId);
                    return <div key={index} className={className} alt={attachment.name}>
                        <img className="attachment-image" id={imgId} src="" />
                        <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                            <Icon>clear</Icon>
                        </div>
                    </div>;
                } else if (attachment.type == "image" && attachment.path) {
                    className = "attachment image";
                    const imgId = "img-" + index;
                    const url = Util.getFullImageUrl(attachment.path);
                    return <div key={index} className={className} alt={"attachement-" + index}>
                        <img className="attachment-image thumb-view" id={imgId} src={url} onClick={this.onImageClick.bind(this, attachment.path)} />
                        {this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED" &&
                            <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                                <Icon>clear</Icon>
                            </div>    
                        }
                    </div>;
                }
            });
            if (this.props.voiceDetail.refinedAttachments) {
                refineAttachments = this.props.voiceDetail.refinedAttachments.map((attachment, index) => {
                    let className;
                    if (attachment.content && !attachment.path) {
                        className = "attachment image";
                        const imgId = "img-" + index;
                        // Util.displayImageFromFile(attachment, imgId);
                        return <div key={index} className={className} alt={attachment.name}>
                            <img className="attachment-image" id={imgId} src={"data:image/jpeg;base64,"+attachment.content} />
                            <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                                <Icon>clear</Icon>
                            </div>
                        </div>;
                    } else if (attachment.type == "image" && attachment.path) {
                        className = "attachment image";
                        const imgId = "img-" + index;
                        const url = Util.getFullImageUrl(attachment.path);
                        return <div key={index} className={className} alt={"attachement-" + index}>
                            <img className="attachment-image thumb-view" id={imgId} src={url} onClick={this.onImageClick.bind(this, attachment.path)} />
                            {this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED" &&
                                <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                                    <Icon>clear</Icon>
                                </div>    
                            }
                        </div>;
                    }
                });
            }
        } else {
            attachmentFiles = this.props.voiceDetail.imageAttachements.map((attachment, index) => {
                let className;
                if (attachment.type.split("/")[0] == "image" && !attachment.path) {
                    className = "attachment " + attachment.type.split("/")[0];
                    const imgId = "img-" + index;
                    Util.displayImageFromFile(attachment, imgId);
                    return <div key={index} className={className} alt={attachment.name}>
                        <img className="attachment-image" id={imgId} src="" />
                        <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                            <Icon>clear</Icon>
                        </div>
                    </div>;
                } else if (attachment.type == "image" && attachment.path) {
                    className = "attachment image";
                    const imgId = "img-" + index;
                    const url = Util.getFullImageUrl(attachment.path);
                    return <div key={index} className={className} alt={"attachement-" + index}>
                        <img className="attachment-image thumb-view" id={imgId} src={url} onClick={this.onImageClick.bind(this, attachment.path)} />
                        {this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED" &&
                            <div className="remove-button" onClick={this.onRemoveAttachment.bind(this, attachment, index)}>
                                <Icon>clear</Icon>
                            </div>    
                        }
                    </div>;
                }
            });
        }
        let taggedUsers;
        if (this.props.voiceDetail.voiceDetails.voiceTags) {
            taggedUsers = this.props.voiceDetail.voiceDetails.voiceTags.map((tag, index) => {
                let avatarUrl = tag.avatar ? Util.getFullImageUrl(tag.avatar) : "../../../../../resources/images/img/user-avatar.png";
                return <div className="chip-container">
                            {avatarUrl ?
                                (
                                    <Chip
                                        avatar={<Avatar src={avatarUrl} />}
                                        label={tag.name}
                                    />
                                ):(
                                    <Chip
                                        avatar={<Avatar>{tag.name.charAt(0)}</Avatar>}
                                        label={tag.name}
                                    />
                                )
                            }
                        </div>
            });
        }
        

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Voice Details" />
                    <div className="row voice-details">
                        <div className="content-container page-content-section ">
                            <div className="row ">
                                <div className="col-md-4" style={{ borderRight: "1px solid #efef" }}>
                                    <div className="row">
                                        {
                                            (!this.props.match.params.voiceId) &&
                                            <h5>Create New</h5>
                                        }

                                        <div className="col-md-12 ">
                                            <div className="large-icon-container">
                                                <Icon className="large-icon">record_voice_over</Icon>
                                            </div>
                                        </div>


                                        <div className="col-md-6  text-center">
                                            {
                                                (this.props.match.params.voiceId) &&
                                                <div className="status-container" title="Currently Under Council">
                                                    <h6 style={{ "color": "#3A539B" }}>
                                                        PANEL
                                                       <span className="badge vtype">{this.props.voiceDetail.voiceDetailFields.voiceCouncil.name}</span>
                                                    </h6>

                                                </div>
                                            }
                                        </div>

                                        <div className="col-md-6  text-center">
                                            {
                                                (this.voiceId && this.props.voiceDetail.voiceDetails.actionStatus) &&
                                                <div className="status-container">
                                                    <h6 style={{ "color": "rgb(21, 45, 110)" }}>
                                                        STATUS
                                                        <span className="badge vtype">{this.props.voiceDetail.voiceDetails.actionStatus.status}</span>
                                                    </h6>
                                                </div>
                                            }
                                        </div>
                                        {this.state.editMode && <div className="col-md-12  input-container">
                                            <div className="input-field selectBox">
                                                <SelectBox
                                                    isDisabled={!this.state.editMode}
                                                    id="voice-type-select"
                                                    label="Voice Type"
                                                    selectedValue={this.props.voiceDetail.voiceDetailFields.type}
                                                    selectArray={this.props.voiceDetail.voiceTypesList}
                                                    onSelect={this.onSelectVoiceType.bind(this)} />

                                            </div>
                                        </div>}
                                        {!this.state.editMode && 
                                            <div className="col-md-6  text-center status-container">
                                                <h6 style={{ "color": "rgb(21, 45, 110)" }}>
                                                    TYPE
                                                    <span className="badge vtype">{voiceType}</span>
                                                </h6>
                                            </div>
                                        }
                                        {!this.voiceId &&
                                            < div className="col-md-12 input-container">
                                                <div className="input-field selectBox">
                                                    <SelectBox
                                                        isDisabled={!this.state.editMode}
                                                        id="voice-council-select"
                                                        label="Voice Panel"
                                                        selectedValue={this.props.voiceDetail.selectedCouncil}
                                                        selectArray={this.props.voiceDetail.voiceCouncilsList}
                                                        onSelect={this.onSelectVoiceCouncil.bind(this)} />
                                                </div>
                                            </div>
                                        }
                                        <div className="col-md-6 ">
                                            {this.voiceId && this.props.voiceDetail.voiceDetailFields.includePresident &&
                                                <strong style={{ color: "#f03434" }}>CLUB PRESIDENT is included <small>in this VOICE</small></strong>
                                            }

                                            {this.voiceId && !this.props.voiceDetail.voiceDetailFields.includePresident &&
                                                <strong style={{ color: "#947CB0" }}>DIRECT VOICE TO PANEL</strong>
                                            }

                                        </div>
                                        <div className="col-md-12 input-container">
                                            {
                                                (!this.voiceId && this.clubId) && 
                                                <FormGroup style={{ position: "relative" }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={this.props.voiceDetail.voiceDetailFields.includePresident}
                                                                onChange={(e) => {
                                                                    this.props.fieldChange("includePresident", e.target.checked);
                                                                }}
                                                                value="true"
                                                            />
                                                        }
                                                        label="Forward through club president"
                                                    />

                                                    <InfoIcon tooltip="act_need_president" />
                                                </FormGroup>
                                        }
                                        </div>
                                        {this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED" &&
                                            <div className="col-md-12">
                                                <div className="section-title">
                                                    Message From Admin
                                                </div>
                                                <div className="message-container">
                                                    {this.props.voiceDetail.voiceDetails.actionStatus.message}
                                                </div>
                                            </div>
                                        }
                                        {this.props.voiceDetail.voiceDetails.voiceTags.length > 0 &&
                                            <div className="col-md-12">
                                                <div className="section-title">
                                                    Tagged Users
                                                </div>
                                                <div className="tagged-users-container">
                                                    {taggedUsers}
                                                </div>
                                            </div>
                                        }
                                        <div className="col-md-12 input-container attachments-wrapper">
                                            {this.props.voiceDetail.imageAttachements.length > 0 &&
                                                <div className="section-title">Attachements</div>
                                            }
                                            {(this.state.editMode || this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED") && 
                                                <div className="attachements-container input-field">
                                                    <input
                                                        id="file-attachment"
                                                        multiple type="file"
                                                        onChange={(e) => {
                                                            this.onAttachementImageChange(e);
                                                        }}
                                                    />
                                                    <label htmlFor="file-attachment">
                                                        <IconButton component="span" aria-label="Upload attachments">
                                                            <Icon>attach_file</Icon>
                                                        </IconButton>
                                                    </label>
                                                </div>
                                            }
                                            {this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED" ?
                                                (
                                                    <div className="extras-holder attachments-holder">
                                                        {oldAttachments}
                                                        {refineAttachments}
                                                    </div>
                                                ):(
                                                    <div className="extras-holder attachments-holder">
                                                        {attachmentFiles}
                                                    </div>
                                                )
                                            }
                                        </div>

                                       {this.voiceId &&   
                                            <div className="col-md-12">
                                                <div className="extra-info-wrapper">
                                                    <div className="section-title">Raised By</div>
                                                    <div className="user-info-container">
                                                        <div className="user-details">      
                                                            <CustomAvatar
                                                                className="big-avatar"
                                                                imgUrl = {Util.getFullImageUrl(this.props.voiceDetail.voiceDetails.postedBy.avatar)}
                                                                badges = {this.props.voiceDetail.voiceDetails.postedBy.badges}
                                                            />
                                                            {/* <Avatar className="big-avatar">
                                                                {this.props.voiceDetail.voiceDetails.postedBy.avatar &&
                                                                    <img src={Util.getFullImageUrl(this.props.voiceDetail.voiceDetails.postedBy.avatar)} />
                                                                }
                                                                {!this.props.voiceDetail.voiceDetails.postedBy &&
                                                                    <div>
                                                                        {this.props.voiceDetail.voiceDetails.postedBy.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                }
                                                            </Avatar> */}
                                                            <div className="basic-detail-container">
                                                                <div className="name">{this.props.voiceDetail.voiceDetails.postedBy.name}</div>
                                                                <div className="email">{this.props.voiceDetail.voiceDetails.postedBy.username}</div>
                                                                <div className="club">{this.props.voiceDetail.voiceDetails.clubName || ""}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="page-content-section">

                                        <div className="row">
                                            <div className="col-md-10 input-container">
                                                {this.state.editMode &&
                                                    <TextField
                                                        id="title"
                                                        label="Title"
                                                        className="input-field"
                                                        margin="normal"
                                                        inputProps={{
                                                            maxLength: 80,
                                                          }}
                                                        value={this.props.voiceDetail.voiceDetailFields.title}
                                                        onChange={(e) => {
                                                            this.props.fieldChange("title", e.target.value);
                                                        }}
                                                        disabled={!this.state.editMode}
                                                    />
                                                }

                                                {!this.state.editMode &&
                                                    <div className="section-title main-title">{this.props.voiceDetail.voiceDetailFields.title}</div>}
                                            </div>
                                            {this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED" &&
                                                <div className="col-md-2">
                                                    <Button raised color="primary" onClick={this.onVoiceUpdate.bind(this)}>UPDATE</Button>
                                                </div>
                                            }
                                        </div>
                                        {this.voiceId && 
                                            <div className="row pull-right">
                                                <span className="postedon">RAISED ON {Util.getDateStringFromTimestamp(this.props.voiceDetail.voiceDetails.createdOn)} </span>
                                            </div>
                                        }

                                        <div className="row">
                                            <div className="col-md-10 input-container">
                                                {(this.state.editMode || this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED") &&
                                                    <TextField
                                                        id="description"
                                                        label="Description"
                                                        className="input-field voice-description"
                                                        margin="normal"
                                                        value={this.props.voiceDetail.voiceDetailFields.description}
                                                        onChange={(e) => {
                                                            this.props.fieldChange("description", e.target.value);
                                                        }}
                                                        multiline={true}
                                                        rows={5}
                                                    />
                                                }

                                                {(!this.state.editMode && this.props.voiceDetail.voiceDetails.actionStatus.status != "REFINED") && 
                                                    <p id="description"><hr />
                                                        {this.props.voiceDetail.voiceDetailFields.description.length > 0 && <span className="first-char-desc">{(this.props.voiceDetail.voiceDetailFields.description + '').substring(0, 1).toUpperCase() + ''}</span>}
                                                        {this.props.voiceDetail.voiceDetailFields.description.length > 1 && this.props.voiceDetail.voiceDetailFields.description.substring(1, this.props.voiceDetail.voiceDetailFields.description.length)}
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row" style={{ borderTop: "1px solid #efef", marginTop: 10 + 'px' }}>
                                {
                                    (!this.state.editMode) &&
                                    <div className="col-md-12">
                                        <div className="section-title">Discussions</div>
                                        <div className="row">
                                            <div className="col-md-12 discussions-container">
                                                <Discussion
                                                    height="auto"
                                                    submitInprogress={this.state.disscussionSubmitProgress}
                                                    height="auto"
                                                    discussions={this.props.voiceDetail.voiceDetails.discussion}
                                                    onSubmitMessage={this.onSubmitMessage.bind(this)} />
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    (this.state.editMode) &&
                                    <div className="floating-bottom-control">
                                        <Button onClick={this.onCancelClick.bind(this)}>Cancel</Button>
                                        <Button
                                            color="primary"
                                            onClick={this.onSaveClick.bind(this)}>
                                            Save
                                            </Button>
                                    </div>
                                }
                            </div>
                        </div>


                    </div>
                </MainContainer>
            </Root >
        );
    }

    handlePresidentSupportSelect() {
        
    }

    discussionScrollToBottom() {
        document.querySelector(".message-container").scrollTo(0, document.querySelector(".message-container").scrollHeight);
    }

    onSelectVoiceType(selectedType) {
        this.props.fieldChange("type", selectedType);
    }

    onImageClick(imageUrl) {
        const url = Util.getFullImageUrl(imageUrl, false)
        window.open(url, "_blank")
    }

    loadVoiceTypes() {
        VoiceDetailService.getVoiceTypes()
            .then((data) => {
                const voiceTypeMeta = this.getVoiceTypesMeta(data);
                this.props.loadVoiceTypesList(voiceTypeMeta);
            })
            .catch((error) => {
                riverToast.show("something went wrong on fetching types");
            })
    }

    getVoiceTypesMeta(voiceTypes) {
        return voiceTypes.map(type => {
            return {
                value: type.id,
                title: type.voiceType
            }
        })
    }

    loadVoiceCouncils() {
        VoiceDetailService.getVoiceCouncils()
            .then((data) => {
                const councilsList = this.getVoiceCouncilsMeta(data);
                this.props.loadVoiceCouncilsList(councilsList);
            })
            .catch((error) => {
                riverToast.show("Something went wrong on fetching panels")
            })
    }

    getVoiceCouncilsMeta(list) {
        return list.map(item => {
            return {
                title: item.name,
                value: {
                    tagId: item.tagId,
                    hash: item.hash
                }
            }
        })
    }

    onSubmitMessage(message) {
        if (message.trim()) {
            const messageRequest = {
                value: message,
                commentId: this.props.voiceDetail.voiceDetails.discussionId
            };
            this.setState({ disscussionSubmitProgress: true });
            VoiceDetailService.postDiscussionMessage(messageRequest)
                .then(data => {
                    const userDetail = Util.getLoggedInUserDetails();
                    this.setState({ disscussionSubmitProgress: false });
                    const voiceDetail = this.props.voiceDetail.voiceDetails;
                    const currentDiscussionObj = {
                        postedBy: {
                            avatar: userDetail.avatar,
                            name: userDetail.fullName,
                            userId: userDetail.userId,
                            username: userDetail.username
                        },
                        postedOn: new Date().getTime(),
                        type: null,
                        value: message
                    };
                    voiceDetail.discussion.push(currentDiscussionObj);
                    this.props.changeLoadedVoiceDetails(voiceDetail);
                    this.discussionScrollToBottom();
                })
                .catch(error => {
                    this.setState({ disscussionSubmitProgress: false });
                    riverToast.show(error.status_message);
                });
        }
    }

    onSelectVoiceCouncil(value) {
        this.props.changeSelectedCouncilValue(value);
        this.props.fieldChange("voiceCouncil", { ...value, tagType: "COUNCIL" });
    }

    onVoiceUserTagSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({ showVoiceUserTagSearchPreloader: true });
            VoiceDetailService.searchVoiceUserTags(searchText)
                .then((data) => {
                    this.setState({ showVoiceUserTagSearchPreloader: false });
                    if (data) {
                        this.props.setVoiceUserTagSearchResult(data);
                    }
                })
                .catch((error) => {
                    this.setState({ showVoiceUserTagSearchPreloader: false });
                    riverToast.show(error.status_message);
                });
        } else if (searchText.length <= 0) {
            this.setState({ showVoiceUserTagSearchPreloader: false });
            this.props.setVoiceUserTagSearchResult([]);
        }
    }

    onVoiceUserTagSearchItemSelect(item) {
        const selectedUsers = this.props.voiceDetail.selectedVoiceUserTagChips;
        let isChipExists = false;
        this.props.setVoiceUserTagSearchResult([]);
        selectedUsers.forEach((element) => {
            if (element.id === item.id) {
                isChipExists = true;
            }
        }, this);

        if (!isChipExists) {
            selectedUsers.push(item);
        }
        this.setSelectedVoiceUserTags(selectedUsers);
    }

    onDeleteVoiceUserTag(item) {
        if (item) {
            const selectedUsers = this.props.voiceDetail.selectedVoiceUserTagChips;
            this.props.voiceDetail.selectedVoiceUserTagChips.forEach((element, index) => {
                if (element.id === item.id) {
                    selectedUsers.splice(index, 1);
                }
            }, this);
            this.setSelectedVoiceUserTags(selectedUsers);
        }
    }

    setSelectedVoiceUserTags(selectedUsers) {
        this.props.setVoiceUserTagsSelectedResult(selectedUsers);
        const voiceTagsList = selectedUsers.map(element => {
            return {
                tagId: element.id,
                tagType: "USER"
            }
        });
        this.props.fieldChange("voiceTags", voiceTagsList)
    }

    onAttachementImageChange(e) {
        const attachmentFiles = Array.from(e.target.files);
        if (Util.validateImageFiles(attachmentFiles)) {
            let attachementsList;
            if (this.props.voiceDetail.voiceDetails.actionStatus.status === "REFINED") {
                attachementsList = this.getAttachementMeta(attachmentFiles, true);
            } else {
                attachementsList = this.getAttachementMeta(attachmentFiles);
            }
            this.props.setAttachements(attachmentFiles);
        } else {
            riverToast.show("Please select image file");
        }

    }

    getAttachementMeta(list, refine = false) {
        var meta = list.map(image => {
            Util.base64ImageFromFile(image).
                then(result => {
                    this.props.pushAttachement({
                        name: image.name,
                        content: result
                    }, refine)
                }).
                catch(error => {
                    return false
                });
        })
        return meta;
    }

    onRemoveAttachment(attachment, index) {
        let isRefined = false;
        if (attachment.type !== "image") {
            isRefined = true;
        }
        this.props.removeAttachment(index, isRefined);
    }

    onCancelClick() {
        this.props.history.push("/voices");
    }

    getOldImagesIds(images) {
        const imageIds = [];
        images.forEach((image) => {
            imageIds.push(image.path);
        }, this);
        return imageIds;
    }

    onVoiceUpdate() {
        const voiceUpdateRequest = {
            "description":this.props.voiceDetail.voiceDetailFields.description,
            "oldImages": this.getOldImagesIds(this.props.voiceDetail.voiceDetailFields.images),
            "newImages": this.props.voiceDetail.refinedAttachments,
        };

        VoiceDetailService.refineVoice(voiceUpdateRequest, this.voiceId, this.voiceHash)
            .then((data) => {
                riverToast.show("Voice refined successfully");
                this.props.history.push("/voices");
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong on making voice");
            });

    }

    isFormValid() {
        const voiceFields = this.props.voiceDetail.voiceDetailFields;

        if(!voiceFields.type ||
            !voiceFields.title ||
            !voiceFields.description ||
            !voiceFields.voiceCouncil
        ) {
            riverToast.show("Please fill all fields");
            return false;
        }
        return true;
    }

    onSaveClick() {
        const voice = this.props.voiceDetail.voiceDetailFields;
        if(this.isFormValid()){
            VoiceDetailService.makeVoice(voice)
                .then((data) => {
                    riverToast.show("Successfully made a voice");
                    this.props.history.push("/voices");
                })
                .catch((error) => {
                    riverToast.show(error.status_message || "Something went wrong on making voice");
                });
        }
    }

    processVoiceDetailsResponse(voice) {
        this.props.changeLoadedVoiceDetails(voice);
        this.voiceHash = voice.voiceHash;
        this.setState({ voiceLevel: voice.voiceLevel });
        this.props.fieldChange("type", parseInt(voice.type));
        this.props.fieldChange("title", voice.title);
        this.props.fieldChange("description", voice.description);
        this.props.fieldChange("voiceCouncil", voice.voiceCouncils);
        this.props.fieldChange("includePresident", voice.includePresident);
        this.props.changeSelectedCouncilValue({ tagId: voice.voiceCouncils.tagId, hash: voice.voiceCouncils.hash });
        const attachements = this.getAttachementsMeta(voice.images);
        this.props.setAttachements(attachements, true);
        this.setState({ voiceLevel: voice.voiceLevel });
    }

    getAttachementsMeta(attachements) {
        return attachements.map(item => {
            return {
                type: "image",
                path: item
            }
        })
    }

    loadVoiceDetails(voiceId, username) {
        VoiceDetailService.getVoiceDetails(voiceId, username)
            .then((data) => {
                this.processVoiceDetailsResponse(data);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong on loading voice");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceDetail);