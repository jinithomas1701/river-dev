import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Done from 'material-ui-icons/Done';
import Replay from 'material-ui-icons/Replay';
import Clear from 'material-ui-icons/Clear';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import { FloatingMenu, MainButton, ChildButton } from 'react-floating-button-menu';


//root component
import { Root } from "../../../Layout/Root";

// custom component
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';
import {SelectBox} from "../../../Common/SelectBox/SelectBox";
import {Util} from "../../../../Util/util";
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import { Discussion } from '../../../Common/Discussion/Discussion';
import CustomAvatar from '../../../Common/Avatar/Avatar';


import { setVoiceDetail, setVoiceStatus, loadVoiceTypesList, setVoiceTagList, setVoiceCouncilList, setVoiceCouncil, setUsersSearchResult } from "./VoiceDetail.actions"
import {VoiceAdminService} from "../Voice.service";
import VoiceStatusModal from "./VoiceStatusModal/VoiceStatusModal";
import './VoiceDetail.scss';

const mapStateToProps = (state) => {
    return {
        voice: state.VoiceAdminDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setVoiceDetail: (detail) => {
            dispatch(setVoiceDetail(detail));
        },
        setVoiceTagList: (list) => {
            dispatch(setVoiceTagList(list));
        },
        setVoiceCouncilList: (list) => {
            dispatch(setVoiceCouncilList(list));
        },
        setVoiceCouncil: (council) => {
            dispatch(setVoiceCouncil(council));
        },
        loadVoiceTypesList: (list) => {
            dispatch(loadVoiceTypesList(list))
        },
        setUsersSearchResult: (list) => {
            dispatch(setUsersSearchResult(list));
        },
        setVoiceStatus: (status) => {
            dispatch(setVoiceStatus(status));
        }
    };
};

const PRIVILEGE_APPROVE_REJECT_REFINE = "APPROVE_REJECT_REFINE_VOICE";
const PRIVILEGE_FORWARD = "FORWARD_VOICE";

class VoiceAdminDetail extends React.Component {
    state = {
        disscussionSubmitProgress : false,
        showSearchPreloader: false,
        showForwardPreloader: false,
        statusModal: false
    };
    voiceId = null;
    voiceHash = null;
    voiceCouncilList = [];
    

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.match.params.voiceId) {
            this.voiceId = this.props.match.params.voiceId;
            this.voiceHash = this.props.match.params.voiceHash;
            this.discussionScrollToBottom();
            this.getCouncils();
            this.loadVoiceTypes();
        }
    }
 
    render() {

        const attachedImages = this.props.voice.voiceDetail.images.map((image, index) => {
            const imgUrl = Util.getFullImageUrl(image);
            return <div key={index} className="attachement image" alt={"attachement-" + index}>
                        <img key={index} src={imgUrl} className="attachment-image thumb-view" onClick={this.onImgClick.bind(this, image)}/>
                    </div>
        });

        const voiceType = this.props.voice.voiceTypesList.map((itm, indx) => {

            if (itm.value == this.props.voice.voiceDetail.type) {
                return <span key={indx}>{itm.title}</span>;
            }
        });

        const taggedUsers = this.props.voice.voiceDetail.voiceTags.map((tag, index) => {
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

        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Voices" />
                    <div className="row voice-admin-details">
                        <div className="content-container page-content-section">
                            <div className="row">
                                <div className="col-md-4" style={{"borderRight": "1px solid rgb(238, 255, 238)"}}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="large-icon-container">
                                                <Icon className="large-icon">record_voice_over</Icon>                                                
                                            </div>
                                        </div>
                                        <div className="col-md-6  text-center">
                                            <div className="status-container" title="Currently Under Council">
                                                <h6 style={{ "color": "#3A539B" }}>
                                                    COUNCIL
                                                    <span className="badge vtype">{this.props.voice.voiceDetail ? this.props.voice.voiceDetail.voiceCouncils.name : "---"}</span>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6  text-center">
                                            <div className="status-container">
                                                <h6 style={{ "color": "rgb(21, 45, 110)" }}>
                                                    STATUS
                                                    <span className="badge vtype">{this.props.voice.voiceDetail ? this.props.voice.voiceDetail.actionStatus.status : "IN PROGRESS"}</span>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-md-6  text-center status-container">
                                            <h6 style={{ "color": "rgb(21, 45, 110)" }}>
                                                TYPE
                                                <span className="badge vtype">{voiceType}</span>
                                            </h6>
                                        </div>
                                        <div className="col-md-6 ">
                                            {this.props.voice.voiceDetail.includePresident ?
                                                <strong style={{ color: "#f03434" }}>CLUB PRESIDENT is included <small>in this VOICE</small></strong>
                                            :
                                                <strong style={{ color: "#947CB0" }}>DIRECT VOICE TO COUNCIL</strong>
                                            }

                                        </div>
                                        {this.props.voice.voiceDetail.voiceTags.length > 0 &&
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
                                            {(this.props.voice.voiceDetail && this.props.voice.voiceDetail.images && this.props.voice.voiceDetail.images.length > 0) &&
                                                <div>
                                                    <div className="section-title">Attachements</div>
                                                    <div className="extras-holder attachments-holder">
                                                        {attachedImages}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="col-md-12">
                                            <div className="extra-info-wrapper">
                                                <div className="section-title">Raised By</div>
                                                <div className="user-info-container">
                                                    <div className="user-details">      
                                                        <CustomAvatar
                                                            className="big-avatar"
                                                            imgUrl = {Util.getFullImageUrl(this.props.voice.voiceDetail.postedBy.avatar)}
                                                            badges = {this.props.voice.voiceDetail.postedBy.badges}
                                                        />
                                                        {/* <Avatar className="big-avatar">
                                                            {this.props.voice.voiceDetail.postedBy.avatar &&
                                                                <img src={Util.getFullImageUrl(this.props.voice.voiceDetail.postedBy.avatar)} />
                                                            }
                                                            {!this.props.voice.voiceDetail.postedBy &&
                                                                <div>
                                                                    {this.props.voice.voiceDetail.postedBy.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            }
                                                        </Avatar> */}
                                                        <div className="basic-detail-container">
                                                            <div className="name">{this.props.voice.voiceDetail.postedBy.name}</div>
                                                            <div className="email">{this.props.voice.voiceDetail.postedBy.username}</div>
                                                            <div className="club">{this.props.voice.voiceDetail.clubName || ""}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {((this.props.voice.voiceDetail.voiceLevel == "COUNCIL" && this.props.voice.voiceDetail.why == "COUNCIL_MEMBER") || 
                                        (this.props.voice.voiceDetail.voiceLevel == "PRESIDENT" && this.props.voice.voiceDetail.why == "CLUB_PRESIDENT")) &&
                                            <div className="col-md-12">
                                                {(Util.hasPrivilage(PRIVILEGE_FORWARD) && this.props.voice.voiceDetail.actionStatus.status != "ACCEPTED")&&
                                                    <div>
                                                        <div className="section-heading">
                                                            Actions
                                                        </div>
                                                        <div className="section-flex-h">
                                                            <SelectBox 
                                                                id="club-location-select" 
                                                                label="Select Council" 
                                                                selectedValue={this.props.voice.selectedCouncil}
                                                                selectArray={this.props.voice.councilList}
                                                                onSelect={this.onSelectCouncil.bind(this)}/>
                                                            <div className="forward-action-button-wrapper">
                                                                <Button raised color="primary" onClick={this.onForwardClick.bind(this)}>
                                                                    {this.state.showForwardPreloader &&
                                                                        <CircularProgress size={18} className="fab-progress"/>
                                                                    }
                                                                    {!this.state.showForwardPreloader &&
                                                                        <div>FORWARD</div>
                                                                    }
                                                                </Button>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {(this.props.voice.voiceDetail.voiceLevel == "COUNCIL" && this.props.voice.voiceDetail.why == "COUNCIL_MEMBER" && this.props.voice.voiceDetail.actionStatus.status != "ACCEPTED")&&
                                            <div className="col-md-12">
                                                <div className="user-chip-container">
                                                    <UserChipMultiSelect
                                                        placeholder="Search Users"
                                                        showPreloader={this.state.showSearchPreloader}
                                                        onTextChange={this.onTagUserSearch.bind(this)}
                                                        resultChips={this.props.voice.userSearchResult}
                                                        selectedChips={this.props.voice.voiceTagList}
                                                        onItemSelect={this.onTagUserSearchItemSelect.bind(this)}
                                                        onDeleteChip={this.onDeleteItem.bind(this)}/>
                                                </div>
                                            </div>
                                        }
                                        
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="page-content-section">
                                        <div className="row">
                                            <div className="col-md-10 input-container">
                                                <div className="section-title main-title">{this.props.voice.voiceDetail.title}</div>
                                            </div>
                                        </div>
                                        <div className="row pull-right">
                                            <span className="postedon">RAISED ON {Util.getDateStringFromTimestamp(this.props.voice.voiceDetail.createdOn)} </span>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-10 input-container">
                                                <p id="description"> <hr />
                                                    {this.props.voice.voiceDetail.description.length > 0 && <span className="first-char-desc">{(this.props.voice.voiceDetail.description + '').substring(0, 1).toUpperCase() + ''}</span>}
                                                    {this.props.voice.voiceDetail.description.length > 1 && this.props.voice.voiceDetail.description.substring(1, this.props.voice.voiceDetail.description.length)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ borderTop: "1px solid #efef", marginTop: 10 + 'px' }}>
                                <div className="col-md-12">
                                    <div className="section-title">Discussions</div>
                                    <div className="row">
                                        <div className="col-md-11 input-container">
                                            <div className="discussion-wrapper">
                                                <Discussion 
                                                    submitInprogress={this.state.disscussionSubmitProgress}
                                                    height="45rem"
                                                    discussions={this.props.voice.voiceDetail.discussion}
                                                    onSubmitMessage={this.onSubmitMessage.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.props.voice.voiceDetail.voiceLevel == "COUNCIL" && this.props.voice.voiceDetail.why == "COUNCIL_MEMBER" &&
                                <div className="row">
                                    <div className="floating-bottom-control">
                                        {((Util.hasPrivilage(PRIVILEGE_APPROVE_REJECT_REFINE) &&
                                        this.props.voice.voiceDetail.actionStatus.status != "ACCEPTED" && 
                                        this.props.voice.voiceDetail.actionStatus.status != "RESOLVED")) ? 
                                            (<div  className="status-action-container">
                                                <Button
                                                    raised
                                                    className="status-btn"
                                                    color="primary"
                                                    onClick={this.onApprove.bind(this)}
                                                >
                                                    ACCEPT
                                                </Button>
                                                <Button
                                                    raised
                                                    className="status-btn"
                                                    color="accent"
                                                    onClick={this.onReject.bind(this)}
                                                >
                                                    REJECT
                                                </Button>
                                                <Button
                                                    raised
                                                    className="status-btn"
                                                    onClick={this.onRefine.bind(this)}
                                                    title="Ask assigner to refine their thoughts"
                                                >
                                                    REFINE
                                                </Button>
                                                {
                                                    (this.props.voice.voiceDetail.actionStatus &&
                                                        this.props.voice.voiceDetail.actionStatus.status != "ACKNOWLEDGED") &&
                                                            <Button
                                                                raised
                                                                title= "Inform assigner that you have started working on it"
                                                                className="status-btn green-btn"
                                                                onClick={this.onAcknowledge.bind(this)}
                                                            >
                                                                ACKNOWLEDGE
                                                            </Button>
                                                }
                                            </div>) :(
                                                <div  className="status-action-container">
                                                    <Button
                                                        raised
                                                        className="status-btn"
                                                        color="primary"
                                                        onClick={this.onResolve.bind(this)}
                                                    >
                                                        Resolve
                                                    </Button>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            }
                            {/* <div className="page-title-section">
                                <h5>Detail</h5>
                                <div className="row">
                                    <div className="col-md-4 text-center">
                                        <span className="screen-badge-text"></span>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="large-icon-container">
                                            <Icon className="large-icon">record_voice_over</Icon>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                            <div className="status-container">
                                                <div className="title">Status</div>
                                                <div className="status-text">
                                                    {this.props.voice.voiceDetail ? ((this.props.voice.voiceDetail.actionStatus.status == "ACKNOWLEDGED") ? "IN PROGRESS/ACKNOWLEDGED" : this.props.voice.voiceDetail.actionStatus.status ) : ""}
                                                </div>
                                            </div>
                                            {this.props.voice.voiceDetail.voiceLevel == "COUNCIL" && this.props.voice.voiceDetail.why == "COUNCIL_MEMBER" &&
                                                <div className="status-action-container">
                                                    {((Util.hasPrivilage(PRIVILEGE_APPROVE_REJECT_REFINE) &&
                                                    this.props.voice.voiceDetail.actionStatus.status != "ACCEPTED" && 
                                                    this.props.voice.voiceDetail.actionStatus.status != "RESOLVED")) ? 
                                                        (<div>
                                                            <Button
                                                                raised
                                                                className="status-btn"
                                                                color="primary"
                                                                onClick={this.onApprove.bind(this)}
                                                            >
                                                                ACCEPT
                                                            </Button>
                                                            <Button
                                                                raised
                                                                className="status-btn"
                                                                color="accent"
                                                                onClick={this.onReject.bind(this)}
                                                            >
                                                                REJECT
                                                            </Button>
                                                            <Button
                                                                raised
                                                                className="status-btn"
                                                                onClick={this.onRefine.bind(this)}
                                                                title="Ask assigner to refine their thoughts"
                                                            >
                                                                REFINE
                                                            </Button>
                                                            {
                                                                (this.props.voice.voiceDetail.actionStatus &&
                                                                    this.props.voice.voiceDetail.actionStatus.status != "ACKNOWLEDGED") &&
                                                                        <Button
                                                                            raised
                                                                            title= "Inform assigner that you have started working on it"
                                                                            className="status-btn green-btn"
                                                                            onClick={this.onAcknowledge.bind(this)}
                                                                        >
                                                                            ACKNOWLEDGE
                                                                        </Button>
                                                            }
                                                        </div>) :(
                                                            <div>
                                                                <Button
                                                                    raised
                                                                    className="status-btn"
                                                                    color="primary"
                                                                    onClick={this.onResolve.bind(this)}
                                                                >
                                                                    Resolve
                                                                </Button>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            }
                                            </div>
                                            </div>
                                        </div> */}
                            
                        </div>
                    </div>
                </MainContainer>
                <VoiceStatusModal 
                    open={this.state.statusModal}
                    status={this.props.voice.clickedStatus}
                    voiceDetails={this.props.voice.voiceDetail} 
                    onRequestClose={this.statusDialogVisibility.bind(this)}/>
			</Root>
        );
    }

    statusDialogVisibility(value, needReload) {
        if (!value) {
            this.props.setVoiceStatus("");
        }
        this.setState({statusModal: false});
        if (needReload) {
            this.props.history.push("/admin/voices");
        }
    }

    discussionScrollToBottom() {
        document.querySelector(".message-container").scrollTo(0,document.querySelector(".message-container").scrollHeight);
    }

    onApprove() {
        this.props.setVoiceStatus("ACCEPT");
        this.setState({statusModal: true});
    }

    onResolve() {
        this.props.setVoiceStatus("RESOLVE");
        this.setState({statusModal: true});
    }

    onReject() {
        this.props.setVoiceStatus("REJECT");
        this.setState({statusModal: true});
    }

    onRefine() {
        this.props.setVoiceStatus("REFINE");
        this.setState({statusModal: true});
    }

    onAcknowledge() {
        this.props.setVoiceStatus("ACKNOWLEDGE");
        this.setState({statusModal: true});
    }

    onImgClick(imageHash) {
        const win = window.open(Util.getFullImageUrl(imageHash, false), '_blank');
        win.focus();
    }

    onSelectCouncil(item) {
        this.props.setVoiceCouncil(item);
    }

    onTagUserSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showSearchPreloader: true});
            VoiceAdminService.searchUsers(searchText)
                .then((data) => {
                    this.setState({showSearchPreloader: false});
                    if (data) {
                        this.props.setUsersSearchResult(data);
                    }
                })
                .catch((error) => {
                    this.setState({showSearchPreloader: false});
                    riverToast.show(error.status_message);
                });
        } else if (searchText.length < 3){
            this.props.setUsersSearchResult([]);
        }
    }

    onTagUserSearchItemSelect(item) {
        if (item) {
            this.setState({showSearchPreloader: true});
            const tagRequest = {
                "tagId":item.id,
                "tagType":"USER"
            };
            VoiceAdminService.tagUser(tagRequest, this.voiceId, this.voiceHash)
                .then(data => {
                    this.setState({showSearchPreloader: false});
                    const voiceTagList = this.props.voice.voiceTagList;
                    voiceTagList.push(item);
                    this.props.setVoiceTagList(voiceTagList);
                    this.props.setUsersSearchResult([]);
                })
                .catch(error => {
                    this.setState({showSearchPreloader: false});
                    riverToast.show(error.status_message);
                });
        }
        
    }

    onDeleteItem(item) {
        if (item) {
            this.setState({showSearchPreloader: true});
            const tagRequest = {
                "tagId":item.id,
                "tagType":item.type,
                "hash":item.hash || ""
            };
            VoiceAdminService.removeTaggedUser(tagRequest, this.voiceId, this.voiceHash)
                .then(data => {
                    this.setState({showSearchPreloader: false});
                    this.getVoiceDetails(this.voiceId, this.voiceHash);
                })
                .catch(error => {
                    this.setState({showSearchPreloader: false});
                    riverToast.show(error.status_message);
                });
        }
    }

    getCouncilHash(id) {
        let councilHash = "";
        if (id) {
            this.voiceCouncilList.forEach(function(council) {
                if (id == council.tagId) {
                    councilHash = council.hash;
                }
            }, this);
        }
        return councilHash;
    }

    onForwardClick() {
        if (this.props.voice.selectedCouncil) {
            const forwardRequest = {
                "tagId":this.props.voice.selectedCouncil,
                "tagType":"COUNCIL",
                "hash":this.getCouncilHash(this.props.voice.selectedCouncil)
            };
            VoiceAdminService.forwardToCouncil(forwardRequest, this.voiceId, this.voiceHash)
            .then(data => {
                riverToast.show("Voice has been forwarded to selected council");
                this.props.history.push("/admin/voices");
            })
            .catch(error => {;
                riverToast.show(error.status_message);
            });
        }
    }

    onSubmitMessage(message) {
        if (message.trim()) {
            const messageRequest = {
                value: message,
                commentId: this.props.voice.voiceDetail.discussionId
            };
            this.setState({disscussionSubmitProgress: true});
            VoiceAdminService.postDiscussionMessage(messageRequest)
                .then(data => {
                    const userDetail = Util.getLoggedInUserDetails();
                    this.setState({disscussionSubmitProgress: false});
                    const voiceDetail = this.props.voice.voiceDetail;
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
                    this.props.setVoiceDetail(voiceDetail);
                    this.discussionScrollToBottom();
                })
                .catch(error => {
                    this.setState({disscussionSubmitProgress: false});;
                    riverToast.show(error.status_message);
                });
        }
    }

    getParsedVoiceTagList(tagList) {
        const parsedList = []
        tagList.forEach(function(tag) {
            parsedList.push({
                image: tag.avatar || "",
                fullname: tag.name,
                id: tag.tagId,
                type: tag.type
            });
        }, this);
        return parsedList;
    }

    loadVoiceTypes() {
        VoiceAdminService.getVoiceTypes()
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

    processGetVoiceDetailResponse(response) {
        this.props.setVoiceDetail(response);
        this.props.setVoiceTagList(this.getParsedVoiceTagList(response.voiceTags));
        this.props.setVoiceCouncil(response.voiceCouncils.tagId);
    }

    getVoiceDetails(voiceId, voiceHash) {
        VoiceAdminService.getVoiceDetails(voiceId, voiceHash)
            .then(data => {
                this.processGetVoiceDetailResponse(data);
            })
            .catch(error => {;
                riverToast.show(error.status_message || "Something went wrong");
            })
    }

    getCouncils() {
        VoiceAdminService.getCouncils()
            .then(data => {
                if (data) {
                    this.voiceCouncilList = data;
                    const parsedCouncilArray = [];
                    data.forEach(function(element)   {
                        parsedCouncilArray.push({
                            title: element.name,
                            value: element.tagId
                        });
                    }, this);
                    this.props.setVoiceCouncilList(parsedCouncilArray);
                    this.getVoiceDetails(this.voiceId, this.voiceHash);
                }
            })
            .catch(error => {;
                riverToast.show(error.status_message);
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceAdminDetail);