import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Badge from 'material-ui/Badge';
import moment from 'moment';
import { CircularProgress } from 'material-ui/Progress';
import { Util } from "../../../Util/util";
import Menu, { MenuItem } from 'material-ui/Menu';
import Linkify from 'react-linkify';
import { Emojione } from 'react-emoji-render';
import Tooltip from 'material-ui/Tooltip';

import { CommentItem } from '../../Common/CommentItem/CommentItem';
import { PopOverName } from '../../Common/PopOverName/PopOverName';
import Avatar from '../../Common/Avatar/Avatar';
import { feedCommentChange, setFeedCommentList } from './FeedElement.actions';
import Popover from 'react-simple-popover';
import Button from 'material-ui/Button';
// css
import './FeedElement.scss';


const mapStateToProps = (state) => {
    return {
        feedElement: state.FeedElementReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        feedCommentChange: (value) => {
            dispatch(feedCommentChange(value));
        }
    }
};

const DELETE_FEED = "DELETE_FEED";

class FeedElement extends React.Component {
    state = {
        comment: "",
        fullContent: false,
        menuOpen: false,
        anchorEl: null,
        popVisible: false,
    };

    style = {
        position: 'relative',
        zIndex: '8'
    }

    getActionButtons(feedData) {
        let userActionButtons;
        return feedData.actions.map((action, index) => {
            if (action.type === "LIKE") {
                userActionButtons = <IconButton key={index} title="Like" aria-label="Like" onClick={() => { this.onActionClick(action, feedData); }} className={action.checked ? "primary" : "default"}>
                    {action.count > 0 &&
                        <div className="count">{action.count}</div>
                    }
                    <Icon className="action-icon">thumb_up</Icon>
                </IconButton>;
            } else if (action.type === "UNLIKE") {
                userActionButtons = <IconButton key={index} title="Respond" onClick={() => { this.onActionClick(action, feedData); }} aria-label="Unlike" className={action.checked ? "primary" : "default"}>
                    {action.count > 0 &&
                        <div className="count">{action.count}</div>
                    }
                    <Icon className="action-icon">thumb_down</Icon>
                </IconButton>;
            } else if (action.type === "CONGRATS") {
                userActionButtons = <IconButton key={index} title="Congrats" onClick={() => { this.onActionClick(action, feedData); }} aria-label="Congrats" className={action.checked ? "primary" : "default"}>
                    {action.count > 0 &&
                        <div className="count">{action.count}</div>
                    }
                    <Icon className="action-icon">local_bar</Icon>
                </IconButton>;
            }

            return userActionButtons;
        });
    }

    render() {

        const feedAttachemntFiles = (this.props.feedData.attachmentFiles) ? this.props.feedData.attachmentFiles.map((file, index) => {
            const classNames = "attachment-file color-" + file.type;
            return <div key={index} className={classNames} title={file.name}>{file.type}</div>;
        }) : false;

        const comments = this.props.feedData.comments.map((comment, index) => {
            return <CommentItem key={index} commentItem={comment} />
        });

        const actionButtons = this.getActionButtons(this.props.feedData);

        const actionsList = this.getActionsList(this.props.feedData);

        return (
            <div className="feed-element" onClick={this.handleClose.bind(this)}>
                {(Util.hasPrivilage(DELETE_FEED) || this.checkCurrentUser(this.props.feedData.postedBy)) &&
                    <div className="feed-element-extras">
                        <IconButton
                            title="Menu"
                            onClick={this.handleMenuClick.bind(this)}
                        >
                            <Icon>more_vert</Icon>
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={this.state.anchorEl}
                            open={this.state.menuOpen}
                            onRequestClose={this.handleMenuClose.bind(this)}
                        >
                            {(Util.hasPrivilage(DELETE_FEED) || this.checkCurrentUser(this.props.feedData.postedBy)) &&
                                <MenuItem onClick={this.handleDeleteFeedClick.bind(this, this.props.feedData.feedId)}>Delete</MenuItem>
                            }
                        </Menu>
                    </div>
                }
                {this.props.feedData.type == "GEN" &&
                    <div>
                        {
                            this.props.feedData.visibility == 'club' &&
                            <Tooltip id="visibility-icon" title="PRIVATE TO CLUB">
                                <div className="visibility-ribbon">
                                    <Icon className="visibility-ribbon-icon">store</Icon>
                                </div>
                            </Tooltip>
                        }
                        <div className="feed-header">
                            <Avatar
                                className="user-image"
                                imgUrl={this.props.feedData.postedBy.image}
                                badges={this.props.feedData.postedBy.badges || ['council']}
                            />
                            {/* <img src={this.props.feedData.postedBy.image} className="user-image"/> */}
                            <div className="title-section">
                                <PopOverName
                                    title="User"
                                    avatar={this.props.feedData.postedBy.image}
                                    name={this.props.feedData.postedBy.name}
                                    userId={this.props.feedData.postedBy.userId}
                                />
                                {/* <div className="user-name">
                                    {this.props.feedData.postedBy.name}
                                </div> */}
                                <Tooltip title={"Posted on " + moment.unix(this.props.feedData.postedOn / 1000).format("DD MMM YYYY, hh:mm A")}>
                                    <div className="posted-date">
                                        {this.props.feedData.crtdBfr} ago
                                    </div>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Only present if any content image is there */}
                        {(this.props.feedData.contentImage) &&
                            <div className="feed-image-section">
                                <div className="feed-image-blur-bg"
                                    style={{ "backgroundImage": "url(" + this.props.feedData.contentImage + ")" }}
                                ></div>
                                <img
                                    title="Click To View"
                                    onClick={this.handleImageClick.bind(this, this.props.feedData.contentImage)}
                                    className="feed-image"
                                    src={this.props.feedData.contentImage} />
                            </div>
                        }
                        {
                            this.props.feedData.link &&
                            <div className="video-container">
                                <iframe width="854" height="480" src={("https://www.youtube.com/embed/") + this.props.feedData.link + ("?autoplay=0&showinfo=0&rel=0&fs=1")} frameBorder="0"></iframe>
                            </div>
                        }
                        <div className="feed-content">
                            <h5><Emojione text={this.props.feedData.title} /></h5>
                            <Linkify properties={{ target: '_blank' }}>
                                {(this.props.feedData.content.length > 400 && !this.state.fullContent) ?
                                    (
                                        <p>
                                            {this.props.feedData.content.substring(0, 400)}
                                            <span>... <a onClick={this.onReadMoreClick.bind(this)} className="read-more">Read More</a></span>
                                        </p>
                                    ) : (
                                        <p>
                                            {this.props.feedData.content}
                                        </p>
                                    )
                                }
                            </Linkify>
                        </div>

                        {/* Only present if any attachment file is there */}
                        {(feedAttachemntFiles && feedAttachemntFiles.length > 0) &&
                            <div className="feed-attachments">
                                {feedAttachemntFiles}
                            </div>
                        }
                    </div>
                }
                {this.props.feedData.type == "PNT" &&
                    <div className="point-feed-container">
                        <img className="image-bg left" src="../../../../../resources/images/cracker1.png" />
                        <img className="image-bg right" src="../../../../../resources/images/cracker2.png" />
                        <div className="user">
                            <img src={this.props.feedData.postedBy.image} className="user-image" />
                            <div className="user-name">{this.props.feedData.postedBy.name}</div>
                        </div>
                        <div className="action">
                            Earned
                        </div>
                        <div className="point-details">
                            <div className="point-count">{this.props.feedData.content}</div>
                            <div className="point-text">
                                points for the club
                            </div>
                        </div>
                    </div>
                }


                <div className="feed-action-section-container">
                    <div className="action-section">
                        <div className="action-btn">
                            {actionButtons}
                        </div>
                        <div className="action-comment-box">
                            <input type="text" placeholder="Say something about this"
                                value={this.state.comment}
                                onChange={(e) => {
                                    this.feedCommentChange(e.target.value)
                                }}
                                onKeyPress={this.handleOnComment.bind(this)}
                                className="comment-text" />
                            {/* <Icon ref="trgt" onClick={this.handlePopover2Open.bind(this)}>arrow_drop_down</Icon>
                           
                            <Popover show={this.state.popVisible}
                                onHide={this.handleClose.bind(this)}
                                target={this.refs.trgt}
                                style={this.style}>
                                <div style={{width:100+'%'}}><EmojiPicker onEmojiClick={this.emojiCallback.bind(this)} />
                               
                                </div>
                            </Popover> */}
                        </div>
                    </div>
                    <div className="action-list-container">
                        {actionsList}
                    </div>
                    {(comments && comments.length > 0) &&
                        <div>
                            <div className="feed-comment-list-container">
                                {comments}
                            </div>
                            {(this.props.feedData.commentsCount > 2 && !this.props.feedData.fullCommentLoaded) &&
                                <div className="comment-action-container">
                                    {this.props.feedData.isCommentLoading &&
                                        <CircularProgress size={18} />
                                    }
                                    <a onClick={this.handleLoadMoreComments.bind(this)}>Load more comments</a>

                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }

    emojiCallback = (emj, data) => {
        this.setState({ comment: this.state.comment + " :" + data.name + ": ", popVisible: false });
    }

    handlePopover2Open = event => {
        this.setState({ popVisible: !this.state.popOverVisible });
    };

    handleClose(e) {
        this.setState({ popOverVisible: false });
    }


    handleMenuClick = event => {
        this.setState({ menuOpen: true, anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ menuOpen: false });
    };

    onReadMoreClick() {
        this.setState({ fullContent: true });
    }

    checkCurrentUser(postedBy) {
        const userDetail = Util.getLoggedInUserDetails();
        let isCurrentUser = false;
        if (postedBy.userId == userDetail.userId) {
            isCurrentUser = true
        }

        return isCurrentUser;
    }

    onActionClick(action, feedData) {
        this.props.onActionClick(action, feedData);
    }

    handleLoadMoreComments() {
        this.props.onLoadMoreComments(this.props.feedData);
    }

    handleImageClick(imageSrc) {
        this.props.onImageClick(imageSrc);
    }

    feedCommentChange(comment) {
        this.setState({ comment: comment });
    }

    handleOnComment(event) {
        if (event.key == 'Enter') {
            this.props.onComment(this.state.comment, this.props.feedData);
            this.feedCommentChange("");
        }
    }

    handleDeleteFeedClick(feedId) {
        this.props.onDeleteFeed(feedId);
    }

    isMe(user) {
        const me = Util.getLoggedInUserDetails();
        const myId = me.userId;

        return user.id === myId;
    }


    getActionsList(feed) {
        const me = Util.getLoggedInUserDetails();
        const myId = me.userId;

        let actionListString = "";
        const likes = (feed.actions[0]) ? feed.actions[0].actionBy : false;


        if (likes && likes.length != 0) {
            if (likes.find(this.isMe)) {

                if (likes.length == 1) {
                    actionListString = "You responded to this";
                } else if (likes.length == 2) {
                    const secondUser = (likes[1].id == myId) ? likes[0].fullname : likes[1].fullname;
                    actionListString = "You and " + secondUser + " responded to this";
                } else if (likes.length > 2) {
                    const secondUser = (likes[0].id == myId) ? likes[1].fullname : likes[0].fullname;
                    actionListString = "You, " + secondUser + " and " + (likes.length - 2) + " responded to this"
                }
            } else {
                const firstUser = (likes[0].id == myId) ? "You" : likes[0].fullname;

                if (likes.length == 1) {
                    actionListString = likes[0].fullname + " responded to this";
                } else if (likes.length == 2) {
                    actionListString = likes[0].fullname + " and " + likes[1].fullname + " responded to this";
                } else if (likes.length > 2) {
                    actionListString = likes[0].fullname + ", " + likes[1].fullname + " and " + (likes.length - 2) + " responded to this"
                }
            }
        }


        return (actionListString != "") ? <div
            className="action-list"
            onClick={this.props.onActionsListClick(likes)}>
            {actionListString}
        </div> : <div></div>



    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedElement);