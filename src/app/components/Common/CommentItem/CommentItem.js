import React from "react";
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Util } from "../../../Util/util";
import Avatar from '../../Common/Avatar/Avatar';

// css
import './CommentItem.scss';
import {Emojione} from 'react-emoji-render';


export class CommentItem extends React.Component {

    render() {
        const imgSrc = (this.props.commentItem.postedBy && this.props.commentItem.postedBy.avatar) ? (Util.getFullImageUrl(this.props.commentItem.postedBy.avatar)) : "../../../../../resources/images/img/user-avatar.png";
        const normalComment=(<div className="comment-item-container">
        {
            this.props.commentItem.postedBy &&
                <div className="avatar-container">
                    <Avatar 
                        className="user-image"
                        imgUrl = {imgSrc}
                        badges = {this.props.commentItem.postedBy.badges}
                    />
                    {/* <img src={ imgSrc } className="user-image"/> */}
                </div>
        }
                        
        <div className="comment-container">
            {this.props.commentItem.postedBy &&
                <div className="comment-user">{this.props.commentItem.postedBy.name || this.props.commentItem.postedBy.username}</div>
            }
            <div className="comment-date">
                Posted on &nbsp;
                {moment.unix(this.props.commentItem.postedOn/1000).format("DD MMM YYYY, hh:mm A")}
            </div>
            <div className="comment">
                <p><Emojione text={this.props.commentItem.value || ''}/></p>
            </div>
        </div>
    </div>);
    const activityComment=(<div className="comment-item-container">
        <div className="flow-status">
            <div className="value">
            {this.props.commentItem.value}
                <div className="time"> on {moment.unix(this.props.commentItem.postedOn/1000).format("DD MMM YYYY, hh:mm A")}</div>
            </div>
        </div>
    </div>)
        return (

(this.props.commentItem && this.props.commentItem.type=='ACTIVITY') ? activityComment : normalComment

        )
    }
}