import React from "react";
import { render } from 'react-dom';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

import {MessageItem} from './MessageItem/MessageItem';
import {Util} from '../../../Util/util';
import './Discussion.scss';

export class Discussion extends React.Component {
    state = {
        inputMessage: ""
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
      
        let userDetails = Util.getLoggedInUserDetails();
        let messageItems = this.props.discussions.map((discussion, index) => {
            let type = "others";
            if (discussion.type && discussion.type != "CLUB_DISCUSSION") {
                type = "info";
            } else {
                if (discussion.postedBy && userDetails.userId === discussion.postedBy.userId) {
                    type = "self";
                } else {
                    type = "others";
                }
            }
            return <MessageItem key={index} type={type} userPopOver={this.props.userPopOver} messageObj={discussion}/>
        });
        return (
            <div className="discussion-component" >
                <div className="message-container">
                    {
                        this.props.loadMore ?
                            <div className="read-older-messages">
                                <div onClick={this.onLoadMore.bind(this)} className="load-more-btn">Load Earlier Messages</div>
                            </div>
                        :
                            this.props.onLoadMore &&
                                <div className="read-older-messages no-more">
                                    <div>No More Older Messages</div>
                                </div>
                    }
                    {messageItems}
                </div>      
                {!this.props.noSubmit &&
                    <div className="action-container">
                    <textarea placeholder="Enter text here" value={this.state.inputMessage} className="discussion-textarea"
                        onChange={(e) => {
                            this.setState({
                                ...this.state,
                                inputMessage: e.target.value
                            });
                        }}></textarea>
                    <Button raised color="primary" onClick={this.onSubmitText.bind(this)}>
                        {this.props.submitInprogress &&
                            <CircularProgress size={18} className="fab-progress"/>
                        }
                        {!this.props.submitInprogress &&
                            <div>POST</div>
                        }
                        
                    </Button>
                </div>
                }
            </div>
        )
    }

    onSubmitText() {
        this.props.onSubmitMessage(this.state.inputMessage);
        this.setState({inputMessage: ""});
    }

    onLoadMore() {
        this.props.onLoadMore();
    }
}