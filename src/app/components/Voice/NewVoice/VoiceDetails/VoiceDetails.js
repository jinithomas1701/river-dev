import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton/IconButton';
import Dock from 'react-dock';
import Tooltip from 'material-ui/Tooltip';

// custom component
import { Util } from '../../../../Util/util';
import { riverToast } from '../../../Common/Toast/Toast';
import { LoaderOverlay, DateDisplay, UserAvatar } from '../../../Common/MinorComponents/MinorComponents';
import VoiceForwardPrompt from '../VoiceForwardPrompt/VoiceForwardPrompt';
import TextInputDialog from '../TextInputDialog/TextInputDialog';
import EditVoiceDialog from '../EditVoiceDialog/EditVoiceDialog';
import DiscussionMaster from '../../../Common/DiscussionMaster/DiscussionMaster';
import DiscussionDock from '../DiscussionDock/DiscussionDock';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';

// css
import './VoiceDetails.scss';

const VOICE_TYPE_COMPLAINT = "C";
const VOICE_TYPE_SUGGESTION = "S";

const ROLE_USER = "US";
const ROLE_PANEL = "PA";
const ROLE_CEO = "CEO";

const ACTION_APPROVE = "APPROVE";
const ACTION_RESOLVE = "RESOLVE";
const ACTION_DEESCALATE = "DEESCALATE";
const ACTION_REJET = "REJET";
const ACTION_REPLY = "REPLY";
const ACTION_EDIT_DESC = "EDIT_DESC";
const ACTION_EDIT_SOLUTION = "EDIT_SOLUTION";

const VOICE_STATUS_UNASSIGNED = "UA";
const VOICE_STATUS_ASSIGNED = "AS";
const VOICE_STATUS_APPROVED = "IP";
const VOICE_STATUS_REJECTED = "RJ";
const VOICE_STATUS_ESCALATED = "ES";

class VoiceDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            isCommentoryDialogOpen: false,
            commentoryAction: "",
            commentorytDialogTitle: "",
            commantoryText: "",
            commentoryDialogDescription: "",
            commentoryDialogSubmitText: "",
            isForwardPromptOpen: false,
            isEditDialogOpen: false,
            isDiscussionDockOpen: false
        };

        this.commentoryDialogClose = this.commentoryDialogClose.bind(this);
        this.submitCommentoryDialog = this.submitCommentoryDialog.bind(this);

        this.approveDialogOpen = this.approveDialogOpen.bind(this);
        this.submitApprove = this.submitApprove.bind(this);

        this.resolveDialogOpen = this.resolveDialogOpen.bind(this);
        this.submitResolve = this.submitResolve.bind(this);

        this.rejectDialogOpen = this.rejectDialogOpen.bind(this);
        this.submitReject = this.submitReject.bind(this);

        this.replyDialogOpen = this.replyDialogOpen.bind(this);
        this.submitReply = this.submitReply.bind(this);

        this.deescalateDialogOpen = this.deescalateDialogOpen.bind(this);
        this.submitDeescalate = this.submitDeescalate.bind(this);

        this.forwardPromptOpen = this.forwardPromptOpen.bind(this);
        this.forwardPromptClose = this.forwardPromptClose.bind(this);
        this.submitForward = this.submitForward.bind(this);

        this.editDialogOpen = this.editDialogOpen.bind(this);
        this.editDialogClose = this.editDialogClose.bind(this);
        this.submitEdit = this.submitEdit.bind(this);

        this.showMoreDiscussionOpen = this.showMoreDiscussionOpen.bind(this);
        this.showMoreDiscussionClose = this.showMoreDiscussionClose.bind(this);
        this.handleDiscussionSubmit = this.handleDiscussionSubmit.bind(this);
    }

    render(){
        const props = this.props;
        const voice = props.voice;
        const showMainTemplate = (voice && typeof voice === "object");

        return (
            <section className="voicedetails-wrapper">
                { this.getHeaderToolsTemplate(props, voice) }
                { showMainTemplate ? this.getMainTemplate(props) : this.getEmptyTemplate() }
                <LoaderOverlay show={props.loading} />
                <DiscussionDock
                    open={this.state.isDiscussionDockOpen}
                    discussion={props.discussion}
                    onSubmit={this.handleDiscussionSubmit}
                    onClose={this.showMoreDiscussionClose}
                    />
            </section>
        );
    }

    getNotificationsTemplate(){
        return <p className="notifications">Please resubmit this voice with requested clarifications.</p>
    }

    getHeaderToolsTemplate(props, voice){
        let editable, showApproveBtn, showRejectBtn, showResolveBtn, showReplyBtn, showForwardBtn, showDeescalationtBtn;

        if(voice){
            editable = props.mode === ROLE_USER && voice.status === VOICE_STATUS_UNASSIGNED && voice.creator;
            showApproveBtn = props.mode === ROLE_PANEL && voice.panel && voice.status === VOICE_STATUS_ASSIGNED;
            showRejectBtn = props.mode === ROLE_PANEL && voice.panel && voice.status === VOICE_STATUS_ASSIGNED;
            showResolveBtn = props.mode === ROLE_PANEL && voice.panel && voice.status === VOICE_STATUS_APPROVED;
            showReplyBtn = props.mode === ROLE_PANEL && voice.panel && voice.status === VOICE_STATUS_ASSIGNED;
            showForwardBtn = (props.mode === ROLE_PANEL && voice.panel) && (voice.status === VOICE_STATUS_ASSIGNED || voice.status === VOICE_STATUS_APPROVED);
            showDeescalationtBtn = ((props.mode === ROLE_PANEL && voice.escalationPanel) || (props.mode === ROLE_CEO && voice.escalatedToCeo)) && voice.status === VOICE_STATUS_ESCALATED;
        }

        return (
            <aside className="tools-header">
                <div className="cols-1">
                    { 
                        showApproveBtn && <LoadedButton loading={props.loading} className="btn-primary btn-approve" title="Approve Voice" onClick={this.approveDialogOpen} >Approve</LoadedButton>
                    }
                    {
                        showResolveBtn && <LoadedButton loading={props.loading} className="btn-primary btn-resolve" color="primary" title="Resolve Voice" onClick={this.resolveDialogOpen} raised>Resolve</LoadedButton>
                    }
                    {
                        showDeescalationtBtn && <LoadedButton loading={props.loading} className="btn-complimentary-alt btn-deescalate" color="primary" title="De-escalate Voice" onClick={this.deescalateDialogOpen} raised>Deescalate</LoadedButton>
                    }
                    {
                        showRejectBtn && <LoadedButton loading={props.loading} className="btn-bordered btn-reject" color="default" title="Reject Voice" onClick={this.rejectDialogOpen}>Reject</LoadedButton>
                    }
                    {
                        showReplyBtn && <LoadedButton loading={props.loading} className="btn-icon-bordered btn-review" color="default" title="Ask for Clarification" onClick={this.replyDialogOpen}><Icon>contact_support</Icon></LoadedButton>
                    }
                    {
                        editable && <LoadedButton loading={props.loading} className="btn-primary btn-edit" color="default" title="Resubmit Voice" onClick={this.editDialogOpen}>Re Submit</LoadedButton>
                    }
                </div>
                <div className="cols-2">
                    {
                        showForwardBtn && <LoadedButton loading={props.loading} className="btn-icon-bordered btn-forward" color="default" title="Forward Voice" onClick={this.forwardPromptOpen}><Icon>forward</Icon></LoadedButton>
                    }
                </div>
                <IconButton onClick={props.onClose}>close</IconButton>
            </aside>
        );
    }

    getMainTemplate(props){
        let showNotifications;
        let escalationClass = "";
        let voiceLevel = "";
        const voice = props.voice;
        const isSolutionVisible = (voice.type.code === VOICE_TYPE_COMPLAINT);
        if(voice.status === VOICE_STATUS_ESCALATED){
            escalationClass = "escalated";
            voiceLevel = (voice.escalatedToCeo) ? " (CEO)" : ` (LVL${voice.escalationLevel})`;
        }

        if(voice){
            showNotifications = props.mode === ROLE_USER && voice && voice.status === VOICE_STATUS_UNASSIGNED;
        }

        return (
            <article className="content">
                { showNotifications && this.getNotificationsTemplate() }
                <header className="details-header">
                    <div className="cols-1">
                        <div className="user-details">
                            <UserAvatar src={voice.createdBy.avatar} name={voice.createdBy.name} />
                            <div className="user-text">
                                <h1 className="title">{voice.createdBy.name}</h1>
                                <strong className="subtitle">{voice.createdBy.email}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="cols-3">
                        <table className="table-stats">
                            <tbody>
                                <tr>
                                    <th>Ref#: </th>
                                    <td>{voice.id}</td>
                                </tr>
                                <tr>
                                    <th>Status: </th>
                                    <td className={`stats ${escalationClass}`}>{Util.getVoiceStatusText(voice.status) + voiceLevel}</td>
                                </tr>
                                <tr>
                                    <th>Created: </th>
                                    <td><DateDisplay date={voice.createdOn} /></td>
                                </tr>
                                <tr>
                                    <th>Modified: </th>
                                    <td><DateDisplay date={voice.updatedOn} /></td>
                                </tr>
                                <tr>
                                    <th>Type: </th>
                                    <td>
                                        <div className="centered">
                                            { this.getVoiceTypeIcon(voice.type.code) }
                                            <span className="text">{voice.type.name}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="voice-departments">
                        { this.getDepartmentListTemplate(voice.departments)}
                    </div>
                </header>
                <div className="details-body">
                    <h1 className="title">Title:</h1>
                    <div className="sub-text">{voice.title}</div>
                    <h2 className="title">Description:</h2>
                    <div className="description">{voice.description}</div>
                    { 
                        isSolutionVisible && <div className="solution">
                                <h3 className="title">Solution:</h3>
                                <div className="sub-text">{voice.solution}</div>
                            </div>
                    }
                    {
                        (voice.attachments.length > 0) && <div className="attachment-wrapper">
                                <h2 className="title">Attachment: </h2>
                                <ul className="attachent-list">
                                    { this.getAttachmentListTemplate(voice.attachments) }
                                </ul>
                            </div>
                    }
                </div>
                <div className="discussion-teaser">
                    <header className="header">
                        <h1 className="title">Discussion</h1>
                    </header>
                    <DiscussionMaster
                        discussion={props.discussion}
                        showMoreBtn={true}
                        onShowMore={this.showMoreDiscussionOpen}
                        onSubmit={this.handleDiscussionSubmit}
                        />
                </div>
                <TextInputDialog
                    open={this.state.isCommentoryDialogOpen}
                    action={this.state.commentoryAction}
                    comment={this.state.commantoryText}
                    title={this.state.commentorytDialogTitle}
                    description={this.state.commentoryDialogDescription}
                    SubmitBtnText={this.state.commentoryDialogSubmitText}
                    onSubmit={this.submitCommentoryDialog}
                    onClose={this.commentoryDialogClose}
                    />
                <VoiceForwardPrompt
                    open={this.state.isForwardPromptOpen}
                    currentDepartments={voice.departments}
                    departmentList={props.departmentList}
                    onSubmit={this.submitForward}
                    onClose={this.forwardPromptClose}
                    />
                <EditVoiceDialog
                    open={this.state.isEditDialogOpen}
                    loading={props.loading}
                    voice={voice}
                    onEdit={this.submitEdit}
                    onClose={this.editDialogClose}
                    />
            </article>
        );
    }

    getEmptyTemplate(){
        return (
            <div className="content loading">
                loading...
            </div>
        );
    }

    getAttachmentListTemplate(attachments){
        const template = attachments.map((file) => {
            return <li key={file.path} className="item"><a onClick={this.handleAttachmentSelect.bind(this, file)}>{file.name}</a></li>
        });

        return template;
    }

    getVoiceTypeIcon(voiceCode){
        return <Icon className="icon-type">{ voiceCode === VOICE_TYPE_COMPLAINT ? "warning" : "announcement"}</Icon>
    }

    getDepartmentListTemplate(departments){
        const template = departments.map(dept => {
            return <strong key={dept.name} className="label" title="Function">{dept.name}</strong>;
        });

        return template;
    }

    handleAttachmentSelect(file){
        this.props.onAttachmentSelect(file);
    }

    editDialogOpen(){
        this.setState({isEditDialogOpen: true});
    }

    editDialogClose(){
        this.setState({isEditDialogOpen: false});
    }

    submitEdit(editObj){
        const props = this.props;
        return props.onEdit(props.voice.id, editObj)
            .then(() => {
            this.editDialogClose();
            return true
        })
            .catch((error) => {
            throw error;
        });
    }

    commentoryDialogClose(){
        this.setState({
            isCommentoryDialogOpen: false,
            commentoryAction: "",
            commentorytDialogTitle: "",
            commantoryText: "",
            commentoryDialogDescription: "",
            commentoryDialogSubmitText: "",
        });
    }

    submitCommentoryDialog(action, commentObj, contractDays){
        this.commentoryDialogClose();

        switch(action) {
            case ACTION_APPROVE:
                this.submitApprove(commentObj, contractDays);
                break;
            case ACTION_RESOLVE:
                this.submitResolve(commentObj);
                break;
            case ACTION_DEESCALATE:
                this.submitDeescalate(commentObj);
                break;
            case ACTION_REJET:
                this.submitReject(commentObj);
                break;
            case ACTION_REPLY:
                this.submitReply(commentObj);
                break;
            default:
                break;
        }
    }

    approveDialogOpen(){
        this.setState({
            isCommentoryDialogOpen: true,
            commentoryAction: ACTION_APPROVE,
            commentorytDialogTitle: "Approve Voice",
            commantoryText: "",
            commentoryDialogDescription: "Please add a comment for Approving this voice.",
            commentoryDialogSubmitText: "Approve"
        });
    }

    submitApprove(comment, contractDays){
        const props = this.props;
        const approveObj = {comment, contractDays};
        props.onApprove(props.voice.id, approveObj);
    }

    resolveDialogOpen(){
        this.setState({
            isCommentoryDialogOpen: true,
            commentoryAction: ACTION_RESOLVE,
            commentorytDialogTitle: "Resolve Voice",
            commantoryText: "",
            commentoryDialogDescription: "Please add a comment for resolving this voice.",
            commentoryDialogSubmitText: "Resolve",
        });
    }

    submitResolve(comment){
        const props = this.props;
        const resolveObj = {comment};
        props.onResolve(props.voice.id, resolveObj);
    }

    rejectDialogOpen(){
        this.setState({
            isCommentoryDialogOpen: true,
            commentoryAction: ACTION_REJET,
            commentorytDialogTitle: "Reject Voice",
            commantoryText: "",
            commentoryDialogDescription: "Please add a comment for Rejecting this voice.",
            commentoryDialogSubmitText: "Reject",
        });
    }

    submitReject(comment){
        const props = this.props;
        const rejectObj = {comment};
        props.onReject(props.voice.id, rejectObj);
    }

    forwardPromptOpen(){
        this.setState({isForwardPromptOpen: true});
    }

    forwardPromptClose(){
        this.setState({isForwardPromptOpen: false});
    }

    submitForward(forwardObj){
        const props = this.props;

        props.onForward(props.voice.id, forwardObj)
            .then(() => {
            this.forwardPromptClose();
        })
            .catch(() => {
        });
    }

    deescalateDialogOpen(){
        this.setState({
            isCommentoryDialogOpen: true,
            commentoryAction: ACTION_DEESCALATE,
            commentorytDialogTitle: "De-escalate Voice",
            commantoryText: "",
            commentoryDialogDescription: "Please add a comment for De-escalateing this voice.",
            commentoryDialogSubmitText: "De Escalate",
        });
    }

    submitDeescalate(comment){
        const props = this.props;
        const deescalateObj = {comment};
        props.onDeescalate(props.voice.id, deescalateObj);
    }

    replyDialogOpen(){
        this.setState({
            isCommentoryDialogOpen: true,
            commentoryAction: ACTION_REPLY,
            commentorytDialogTitle: "Ask for Clarification",
            commantoryText: "",
            commentoryDialogDescription: "Please ask the user for more clarifications needed by the panel for moving forward.",
            commentoryDialogDescription: "Mention the details that you require as clarification from the voice requestor",
            commentoryDialogSubmitText: "Reply",
        });
    }

    submitReply(comment){
        const props = this.props;
        const replyObj = {comment};
        props.onReply(props.voice.id, replyObj);
    }

    showMoreDiscussionOpen(){
        this.setState({isDiscussionDockOpen: true});
    }

    showMoreDiscussionClose(){
        this.setState({isDiscussionDockOpen: false});
    }

    handleDiscussionSubmit(value){
        const discussionObj = {
            commentId: this.props.voice.discussionId,
            value
        };

        this.props.onDiscussionSubmit(discussionObj);
    }
}

VoiceDetails.propTypes = {
    voice: PropTypes.object,
    discussion: PropTypes.array,
    mode: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    departmentList: PropTypes.array,
    onApprove: PropTypes.func,
    onResolve: PropTypes.func,
    onReject: PropTypes.func,
    onReply: PropTypes.func,
    onForward: PropTypes.func,
    onDeescalate: PropTypes.func,
    onEdit: PropTypes.func,
    onDiscussionSubmit: PropTypes.func,
    onClose: PropTypes.func,
    onAttachmentSelect: PropTypes.func
};

export default VoiceDetails;