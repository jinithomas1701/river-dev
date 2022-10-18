import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import moment from 'moment';

import { Util } from '../../../../Util/util';
import AvatarInfo from '../../../Common/AvatarInfo/AvatarInfo'
import DiscussionInput from '../DiscussionMaster/DiscussionInput/DiscussionInput';

import { riverToast } from '../../../Common/Toast/Toast';
import { DateDisplay } from '../../../Common/MinorComponents/MinorComponents';

import './DiscussionMaster.scss';

//**********************************************************

const UserDiscussion = (props) => {
    const discussion = props.discussion;
    const authorClass = (props.userId === discussion.postedBy.userId) ? "discussion-self" : "discussion-others";
    const date = moment(discussion.postedOn).format("DD-MM-YYYY hh:mm a");

    return (
        <li className={`discussion-item discussion-user ${authorClass}`}>
            <div className="user-details">
                <AvatarInfo
                    id={discussion.postedBy.userId}
                    avatar={discussion.postedBy.avatar}
                    title={discussion.postedBy.name}
                    subText={date}
                    />
            </div>
            <div className="discussion-matter">
                <div className="align">{discussion.value}</div>
                
            </div>
        </li>
    );
};

//**********************************************************

const TransactionNotification = (props) => {
    const discussion = props.discussion;
    return (
        <li className="discussion-item discussion-notification">
            {discussion.value} on {<DateDisplay date={discussion.postedOn} />}
        </li>
    );
}

//**********************************************************

class DiscussionMaster extends Component{
    constructor(props){
        super(props);
        this.state = {
            discussionText: ''
        };

        this.userId = Util.getLoggedInUserDetails().userId;

        this.handleDiscussionTextChange = this.handleDiscussionTextChange.bind(this);
        this.handleDiscussionSubmit = this.handleDiscussionSubmit.bind(this);
    }

    render(){
        const props = this.props;
        const discussion = props.discussion;

        return(
            <article className="discussion-wrapper">
                {
                    props.showSubmit && <DiscussionInput
                                            discussionText={this.state.discussionText}
                                            onChange={this.handleDiscussionTextChange}
                                            onSubmit={this.handleDiscussionSubmit}
                                            />
                }
                {
                    props.showMoreBtn && <div className="showmore-wrapper">
                            <Button className="btn-default" onClick={this.handleShowMoreOpen.bind(this)}>Show All Comments</Button>
                        </div>
                }
                {
                    props.showDiscussion && <div className="discussion-body">
                            { this.getDiscussionListTemplate(discussion) }
                        </div>
                }
            </article>
        );
    }

    getDiscussionListTemplate(discussion){
        let templateItem;
        const templateList = discussion.length > 0 ? discussion.map(item => {
            switch(item.type) {
                case "FINANCE_TRANSACTION":
                    templateItem = <TransactionNotification key={item.id} discussion={item} />;
                    break;
                case null:
                    templateItem = <UserDiscussion key={item.id} discussion={item} userId={this.userId} />;
                    break;
                default:
                    templateItem = false;
                    break;
            }
            return templateItem;
        }) : <li className="empty">No discussions added yet.</li>;

        return ( <ol className="discussion-list">{templateList}</ol> );
    }

    handleDiscussionTextChange(event){
        this.setState({discussionText: event.target.value});
    }

    handleShowMoreOpen(){
        const props = this.props;
        if(props.onShowMore){
            props.onShowMore();
        }
    }

    handleDiscussionSubmit(){
        const value = this.state.discussionText;

        if(!value.trim()){
            riverToast.show("Please enter your comment.");
            return;
        }

        this.setState({discussionText: ""});
        this.props.onSubmit(value);
    }

    isValidForm(requestObj){
        let isValid = true;


        return isValid;
    }
}

DiscussionMaster.defaultProps = {
    showSubmit: true,
    showDiscussion: true,
    showMoreBtn: false,
    discussionCount: Infinity,
};

DiscussionMaster.propTypes = {
    discussion: PropTypes.array,
    showDiscussion: PropTypes.bool,
    showMoreBtn: PropTypes.bool,
    showSubmit: PropTypes.bool,
    discussionCount: PropTypes.number,
    onShowMore: PropTypes.func,
    onSubmit: PropTypes.func
};

export default DiscussionMaster;