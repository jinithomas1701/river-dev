import React from "react";
import { render } from 'react-dom';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from "moment";
import Linkify from 'react-linkify';
import {PopOverName} from '../../../Common/PopOverName/PopOverName';
import {Emojione} from 'react-emoji-render';

import { Util } from "../../../../Util/util";

import './MessageItem.scss';

export class MessageItem extends React.Component {
    state = {

    };
constructor(props) {
    super(props);
}

render() {
    return (
        <div className="message-item-component-parent">
            {this.props.type === "others" &&
                <div className="message-item-component">
                    <div className="image-holder">
                        <img src={(this.props.messageObj.postedBy && this.props.messageObj.postedBy.avatar) ? Util.getFullImageUrl(this.props.messageObj.postedBy.avatar) : "../../../../../resources/images/img/user-avatar.png"} className="user-image"/>
                    </div>
                    <div className="message-holder">
                        <div className="head-container">
                            {
                                (this.props.userPopOver && this.props.messageObj.postedBy) ?
                                    <PopOverName
                                        title="User"
                                        avatar={this.props.messageObj.postedBy.avatar}
                                        name={this.props.messageObj.postedBy.name}
                                        userId={this.props.messageObj.postedBy.userId}
                                        />
                                    :
                                    <div style={{fontSize:'0.75rem'}} className="name-container">{(this.props.messageObj.postedBy) ? this.props.messageObj.postedBy.name : ""}</div>
                            }
                            <div className="time-container">On {this.getFormattedMeetingTiming(this.props.messageObj.postedOn)}</div>
                        </div>
                        <div className="message-wrapper">
                            <Linkify properties={ { target: '_blank' } }>
                                <Emojione text={this.props.messageObj.value}/>
                            </Linkify>
                        </div>
                    </div>
                </div>
            }

            {this.props.type === "self" &&
                <div className="message-item-component self">
                    <div className="message-holder self">
                        <div className="head-container">
                            <div className="name-container">You</div>
                            <div className="time-container">On {this.getFormattedMeetingTiming(this.props.messageObj.postedOn)}</div>
                        </div>
                        <div className="message-wrapper self">
                            <Linkify properties={ { target: '_blank' } }>
                                <Emojione text={this.props.messageObj.value}/>
                            </Linkify>
                        </div>
                    </div>
                </div>
            }

            {this.props.type === "info" &&
                <div className="message-item-component info">
                    <div className="message-item-info">
                        <div className="info-message">
                            <Emojione text={this.props.messageObj.value}/>
                        </div>
                        <div className="info-time">
                            On {this.getFormattedMeetingTiming(this.props.messageObj.postedOn)}
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}

onSubmitText() {

}

getFormattedMeetingTiming(time) {
    // 27 Oct 2018 8.00AM to 9.15AM
    const timeString = moment.unix(time/1000).format("DD MMM YYYY hh:mm A");
    return timeString;
}
}