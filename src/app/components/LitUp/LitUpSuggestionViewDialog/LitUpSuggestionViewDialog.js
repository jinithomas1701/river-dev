import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
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
import { LitUpService } from "../LitUp.service";
import {Util} from "../../../Util/util";
import './LitUpSuggestionViewDialog.scss';
import IconButton from "material-ui/IconButton/IconButton";

const PRIVILEGE_ILITUP_ADMIN = "ILITUP_ADMIN";
const PRIVILEGE_ILITUP_VOTER = "ILITUP_VOTER";

export default class LitUpSuggestionViewDialog extends React.Component {

    state = {
        ideaContent: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            console.log(this.props.litUpSuggetion);
        }
    }

    render() {
        let upVoteButtonClassName = 'action-button';
        let downVoteButtonClassName = 'action-button';
        const userDetails = Util.getLoggedInUserDetails();
        if (this.props.litUpSuggetion.suggestion && this.props.litUpSuggetion.suggestion.downVotes.voters) {
            this.props.litUpSuggetion.suggestion.downVotes.voters.forEach((voteObj, index) => {
                if (voteObj.userId == userDetails.userId) {
                    downVoteButtonClassName += ' active'; 
                }
            });
            this.props.litUpSuggetion.suggestion.upVotes.voters.forEach((voteObj, index) => {
                if (voteObj.userId == userDetails.userId) {
                    upVoteButtonClassName += ' active'; 
                }
            });
        }
        
        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="litup-suggest-view-dialog-container">
                <DialogTitle>{this.props.litUpSuggetion.topic ? this.props.litUpSuggetion.topic.title : ''}</DialogTitle>
                <DialogContent>
                    {this.props.litUpSuggetion.suggestion && 
                        <div className="content-container">
                            <div className="head-section">
                                <div className="user-details">
                                    {this.getAvatar(this.props.litUpSuggetion.suggestion.createdBy)}
                                    <div className="user-info">
                                        <div className="name">
                                            {this.props.litUpSuggetion.suggestion ? this.props.litUpSuggetion.suggestion.createdBy.name : ''}
                                        </div>
                                        <div className="email">
                                        {this.props.litUpSuggetion.suggestion ? this.props.litUpSuggetion.suggestion.createdBy.username : ''}
                                        </div>
                                        {this.props.litUpSuggetion.suggestion && 
                                            <div className="date">
                                                Posted on {this.getTimeString(this.props.litUpSuggetion.suggestion.createdOn)}
                                            </div>
                                        }
                                    </div>
                                </div>
                                {((Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) || this.props.litUpSuggetion.topic.hasDeclared) &&
                                    <div className="vote-count-container">
                                        <div className="vote-section">
                                            <Icon>thumb_up</Icon>
                                            <div className="vote-count">{this.props.litUpSuggetion.suggestion.upVotes.count}</div>
                                        </div>
                                        <div className="vote-section">
                                            <Icon>thumb_down</Icon>
                                            <div className="vote-count">{this.props.litUpSuggetion.suggestion.downVotes.count}</div>
                                        </div>
                                    </div>
                                }
                                
                            </div>
                            <div className="title">
                                {this.props.litUpSuggetion.suggestion.title}
                            </div>
                            <div className="text">
                                {this.props.litUpSuggetion.suggestion.description}
                            </div>
                            {
                                (this.props.litUpSuggetion.suggestion.attachedDoc && this.props.litUpSuggetion.suggestion.attachedDoc.filename) &&
                                    <div className="extra-actions">
                                        <div className="file-name">
                                            Attachment
                                        </div>
                                        <IconButton onClick={this.onDownloadClick.bind(this, this.props.litUpSuggetion.suggestion)}>
                                            <Icon>get_app</Icon>
                                        </IconButton>
                                    </div>
                            }
                        </div>
                    }
                </DialogContent>
                {/* {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) ? (
                    <DialogActions>
                        <Button className={upVoteButtonClassName} onClick={this.onVoteIdeaClick.bind(this, 'upVote', this.props.litUpSuggetion.suggestion)}>
                            <Icon>thumb_up</Icon>
                        </Button>
                        <Button className={downVoteButtonClassName} onClick={this.onVoteIdeaClick.bind(this, 'downVote', this.props.litUpSuggetion.suggestion)}>
                            <Icon>thumb_down</Icon>
                        </Button>
                    </DialogActions>
                ) : ( */}
                    <DialogActions>
                        <Button className='action-button' onClick={() => {this.props.onRequestClose();}}>
                            CLOSE
                        </Button>
                        
                    </DialogActions>
                
            </Dialog>
        );
    }

    onVoteIdeaClick(source, suggestion) {
        LitUpService.voteIdea(source, this.props.litUpSuggetion.topic.id, suggestion.id)
            .then(data => {
                riverToast.show('Your vote has been placed successfully');
                this.props.onRequestClose(false, {}, true);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wring while voting');
            });
    }

    onDownloadClick(suggestion) {
        LitUpService.downloadAttachment(suggestion.id)
            .then(fileData => {
                console.log(fileData);
                this.onDownloadFile(fileData);
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wring while downloading attachment');
            })
    }

    onDownloadFile(attachedDoc) {

        if(attachedDoc.filename){
            
            let extn=attachedDoc.filename.split(".");
            let extNm=extn[extn.length-1];
            switch(extNm){
                case "pdf":
                    attachedDoc.mimeType="application/pdf";
                    break;
                case "docx":
                    attachedDoc.mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                case "doc":
                    attachedDoc.mimeType="application/msword";
                    break;
                default:
                    break;
            }


        }

        if(!attachedDoc.mimeType){
            attachedDoc.mimeType=attachedDoc.mimeType?attachedDoc.mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        if(!attachedDoc.filename){
            switch(attachedDoc.mimeType){
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    attachedDoc.fileName="attachment.docx";
                    break;
                case "application/pdf":
                    attachedDoc.filename="attachment.pdf";
                    break;
                case "image/jpeg":
                    attachedDoc.filename="attachment.jpg";
                    break;
                case "image/png":
                    attachedDoc.filename="attachment.png";
                    break;
                default:
                    attachedDoc.filename="attachment"
            }
        }
        
        Util.downloadMimeTypeFile(attachedDoc.fileContents, attachedDoc.filename, attachedDoc.mimeType);
    }

    getTimeString(timestamp) {
        // 14 Feb 2018, 4:34 PM
        return Util.getDateInFormat(timestamp, 'DD MMM YYYY, hh:mm A');
    }

    



    getAvatar(user) {
        let avatarElement;
        if (user.avatar) {
            avatarElement = <img src={Util.getFullImageUrl(user.avatar)} alt="dp" className="profile-avatar"/>;
        } else {
            avatarElement = <Avatar>U</Avatar>;
            if(user.name){
                avatarElement = <Avatar>{user.name.toUpperCase().charAt(0)}</Avatar>;
            }
        }

        return avatarElement;
    }

    handleRequestClose() {
        this.props.onRequestClose();
    }

    onSubmit(){
        
    }

}