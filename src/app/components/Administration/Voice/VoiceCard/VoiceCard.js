import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Tooltip from 'material-ui/Tooltip';
import moment from 'moment';

// css
import './VoiceCard.scss';

export class VoiceAdminCard extends React.Component {

    state = {};

    render() {
        return(
            <div className="voiceAdminCard" onClick={this.handleVoiceClick.bind(this)}>
                <div className="title-container">
                    <div className="title">
                        {this.props.voice.title}
                    </div>
                    <div className="time-container">
                        On {this.getFormattedMeetingTiming(this.props.voice.createdOn)}
                    </div>
                </div>
                <div className="voice-infos">
                    {
                        this.props.voice.voiceCouncils &&
                            <Tooltip title={"Panel: " + this.props.voice.voiceCouncils.name}>
                                <Icon className="info-icon">group</Icon>
                            </Tooltip>
                    }
                    {
                        this.props.voice.description &&
                            <Tooltip title={"Description: " + this.props.voice.description}>
                                <Icon className="info-icon">description</Icon>
                            </Tooltip>
                    }
                </div>
                
                {/* <div className="action-container">
                    <Tooltip id="tooltip-icon1" className="w-full" title="Mark attendance" placement="bottom">
                        <Button className="w-full" onClick={(e) => {this.handleDeleteClick(e);}}>
                            <Icon className="gen-icon">delete</Icon>
                        </Button>
                    </Tooltip>
                </div> */}
            </div>
        )
    }

    getFormattedMeetingTiming(time) {
        // 27 Oct 2018 8.00AM to 9.15AM
        const timeString = moment.unix(time/1000).format("DD MMM YYYY hh:mm A");
        return timeString;
    }

    handleDeleteClick(e) {
        this.props.deleteCallback(this.props.voice);
        e.stopPropagation();
    }

    handleVoiceClick() {
        this.props.onVoiceClick(this.props.voice);
    }
}