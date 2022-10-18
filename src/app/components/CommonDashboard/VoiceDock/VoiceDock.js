import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';
import { CircularProgress } from 'material-ui/Progress';

import {riverToast} from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';
import { Discussion } from '../../Common/Discussion/Discussion';
import { SelectBox } from "../../Common/SelectBox/SelectBox";

import { CommonDashboardService } from '../CommonDashboard.service';
// css
import './VoiceDock.scss';
import { TextField } from 'material-ui';

const PRIVILEGE_APPROVE_REJECT_REFINE = "APPROVE_REJECT_REFINE_VOICE";

class VoiceDock extends Component {

    state = {
        disscussionSubmitProgress: false,
        currentCouncil: '',
        showForwardPreloader: false,
        councilAction: '',
        councilActionCommentBox: false,
        councilActionComment: ''
    }
    
    componentDidMount() {
        this.discussionScrollToBottom();        
        if (this.props.voice && this.props.voice.voiceCouncils) {
            this.setState({ currentCouncil: this.props.voice.voiceCouncils.tagId })
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.voice != this.props.voice) {
            this.setState({ 
                ...this.state,
                currentCouncil: this.props.voice.voiceCouncils.tagId
            });
        }
    }

    render() {

        const voiceType = this.props.voiceTypes.map((itm, indx) => {

            if (itm.value == this.props.voice.type) {
                return <span key={indx}>{itm.title}</span>;
            }
        });

        return (
            <div className="voice-view-dock">
                <div className="dock-actions" onClick={this.onCloseDock.bind(this)}><Icon>close</Icon> Close</div>
                <div className="title">
                    <div className="value">{this.props.voice.title}</div>
                </div>
                <div className="fy">
                    <span className="label">Created on </span>
                    <span className="value">{moment.unix(this.props.voice.createdOn / 1000).format("DD. MMM . YY HH:mm")}</span>                    
                </div>
                <div className="description">
                    <div className="label">Voice Description</div>
                    <div className="value">{this.props.voice.description}</div>
                </div>
                <div className="infos">
                    <div className="item">
                        <div className="label">Posted By</div>
                        <div className="value">{this.props.voice.postedBy ? this.props.voice.postedBy.name : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Voice Council</div>
                        <div className="value">{this.props.voice.voiceCouncils ? this.props.voice.voiceCouncils.name : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Voice Level</div>
                        <div className="value">{this.props.voice.voiceLevel}</div>
                    </div>
                    <div className="item">
                        <div className="label">Action Status</div>
                        <div className="value">{this.props.voice.actionStatus ? this.props.voice.actionStatus.status : 'IN_PROGRESS'}</div>
                    </div>
                    <div className="item">
                        <div className="label">Voice Type</div>
                        <div className="value">{voiceType}</div>
                    </div>
                    {
                        (this.props.voice.images && this.props.voice.images.length > 0) &&
                            <div className="item full-width">
                                <div className="label">Attachements</div>
                                <div className="value">
                                    {
                                        this.props.voice.images.map((image, index) => {
                                            return <div className="attachement" key={index} onClick={this.onImgClick.bind(this, image)}>
                                                <img src={Util.getFullImageUrl(image)}/>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                    }
                </div>
                {
                    (this.props.voice.voiceLevel == "PRESIDENT" && Util.getActiveRole().value == 'ROLE_CLUB_PRESIDENT') &&
                        <div className="forward">
                            <div className="label">Forward to council</div>
                            <div className="value">
                                <SelectBox
                                    id="club-location-select"
                                    classes="council-select"
                                    disableSysClasses
                                    selectedValue={this.state.currentCouncil}
                                    selectArray={this.props.councils}
                                    onSelect={this.onSelectCouncil.bind(this)} />
                                <div className="forward-action-button-wrapper">
                                    <Button raised color="primary" className="fwd-btn" onClick={this.onForwardClick.bind(this)}>
                                        {this.state.showForwardPreloader &&
                                            <CircularProgress size={18} className="fab-progress" />
                                        }
                                        {!this.state.showForwardPreloader &&
                                            <div>FORWARD</div>
                                        }
                                    </Button>
                                </div>
                            </div>
                        </div>
                }
                {
                    (this.props.voice.voiceLevel == "COUNCIL" && Util.getActiveRole().value == 'ROLE_RIVER_COUNCIL') &&
                        <div className="council-actions">
                            {
                                this.state.councilActionCommentBox &&
                                    <div className="action-comment">
                                        <div className="title">Comment</div>
                                        <div className="text-box">
                                            <TextField
                                                value={this.state.councilActionComment}
                                                onChange={this.handleChange('councilActionComment')}
                                                className="action-commentbox"
                                                multiline
                                            />
                                        </div>
                                        <div className="comment-action-btns">
                                            <Button
                                                onClick={this.onActionSubmit.bind(this)}
                                                className="comment-action-btn"
                                            >
                                                Submit
                                            </Button>
                                            <Button
                                                onClick={this.onCloseCouncilAction.bind(this)}
                                                className="council-action-btn"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                            }
                            {((Util.hasPrivilage(PRIVILEGE_APPROVE_REJECT_REFINE) &&
                                this.props.voice.actionStatus.status != "ACCEPTED" &&
                                    this.props.voice.actionStatus.status != "RESOLVED")) && 
                                        !this.state.councilActionCommentBox ?
                                        (<div className="status-action-container">
                                            <Button
                                                raised
                                                className="status-btn"
                                                onClick={this.onCouncilAction.bind(this, 'ACCEPT')}
                                            >
                                                ACCEPT
                                            </Button>
                                            <Button
                                                raised
                                                className="status-btn"
                                                onClick={this.onCouncilAction.bind(this, 'REJECT')}
                                            >
                                                REJECT
                                            </Button>
                                            <Button
                                                raised
                                                className="status-btn"
                                                onClick={this.onCouncilAction.bind(this, 'REFINE')}
                                                title="Ask assigner to refine their thoughts"
                                            >
                                                REFINE
                                            </Button>
                                            {
                                                (this.props.voice.actionStatus &&
                                                    this.props.voice.actionStatus.status != "ACKNOWLEDGED") &&
                                                        <Button
                                                            raised
                                                            title="Inform assigner that you have started working on it"
                                                            className="status-btn green-btn"
                                                            onClick={this.onCouncilAction.bind(this, 'ACKNOWLEDGE')}
                                                        >
                                                            ACKNOWLEDGE
                                                        </Button>
                                            }
                                        </div>) 
                                        : (
                                            !this.state.councilActionCommentBox &&
                                                <div className="status-action-container">
                                                    <Button
                                                        raised
                                                        className="status-btn"
                                                        onClick={this.onCouncilAction.bind(this, 'RESOLVE')}
                                                    >
                                                        Resolve
                                                    </Button>
                                                </div>
                                        )
                            }
                        </div>
                }
                <div className="discussions-container">
                    <div className="label">Discussions</div>
                    <div>
                        <Discussion
                            submitInprogress={this.state.disscussionSubmitProgress}
                            discussions={this.props.voice.discussion}
                            onSubmitMessage={this.onSubmitMessage.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }

    handleChange = (name) => (event) => {
        this.setState({ [name]: event.target.value });
    }

    onSelectCouncil(item) {
        this.setState({ currentCouncil: item });
    }

    discussionScrollToBottom() {
        document.querySelector(".message-container").scrollTo(0, document.querySelector(".message-container").scrollHeight);
    }

    getCouncilHash(value) {
        let councilHash = "";
        if (value) {
            this.props.councils.forEach(function (council) {
                if (value == council.value) {
                    councilHash = council.hash;
                }
            }, this);
        }
        return councilHash;
    }

    onCouncilAction(actionType) {
        this.setState({
            ...this.state,
            councilAction: actionType,
            councilActionCommentBox: true
        });
    }

    onCloseCouncilAction() {
        this.setState({
            ...this.state,
            councilAction: '',
            councilActionCommentBox: false,
            councilActionComment: ''
        });
    }

    onActionSubmit() {
        if (this.state.councilActionComment) {
            
            const request = {
                action: this.state.councilAction,
                message: this.state.councilActionComment
            };

            CommonDashboardService.changeVoiceStatus(request, this.props.voice.voiceId, this.props.voice.voiceHash)
                .then(data => {
                    this.onCloseCouncilAction();
                    this.props.onVoiceChangeSuccess(data, this.props.index);
                })
                .catch(error => {
                    riverToast.show(error.status_message);
                });
        } else {
            riverToast.show('Please enter a comment');
        }
    }

    onForwardClick() {
        if (this.state.currentCouncil) {
            const forwardRequest = {
                "tagId": this.state.currentCouncil,
                "tagType": "COUNCIL",
                "hash": this.getCouncilHash(this.state.currentCouncil)
            };
            CommonDashboardService.forwardToCouncil(forwardRequest, this.props.voice.voiceId, this.props.voice.voiceHash)
                .then(data => {
                    riverToast.show("Voice has been forwarded to selected council");
                    this.props.onVoiceChangeSuccess(data, this.props.index);
                })
                .catch(error => {
                    ;
                    riverToast.show(error.status_message);
                });
        }
    }

    onSubmitMessage(message) {
        if (message.trim()) {
            const messageRequest = {
                value: message,
                commentId: this.props.voice.discussionId
            };
            this.setState({ disscussionSubmitProgress: true });
            CommonDashboardService.postDiscussionMessage(messageRequest)
                .then(data => {
                    const userDetail = Util.getLoggedInUserDetails();
                    this.setState({ disscussionSubmitProgress: false });
                    const voiceDetail = this.props.voice;
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
                    // this.props.onVoiceChange(voiceDetail, this.props.index);
                    this.props.voice = voiceDetail;
                    this.discussionScrollToBottom();
                })
                .catch(error => {
                    this.setState({ disscussionSubmitProgress: false });
                    riverToast.show(error.status_message);
                });
        }
    }

    onImgClick(imageHash) {
        const win = window.open(Util.getFullImageUrl(imageHash, false), '_blank');
        win.focus();
    }

    onCloseDock() {
        this.props.closeDock()
    }
}

export default VoiceDock;