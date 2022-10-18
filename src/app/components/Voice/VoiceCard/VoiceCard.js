import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import moment from 'moment';

// css
import './VoiceCard.scss';

export class VoiceCard extends React.Component {

    state = {

    };

    render() {
        return(
            <div className="voiceCard" onClick={this.handleVoiceClick.bind(this)}>
                <div className="title-container" title={this.props.voice.title}>
                    <div className="title">
                        {this.props.voice.title}
                    </div>
                    <div className="date-container">
                        <span>On </span>{moment.unix(this.props.voice.createdOn/1000).format("DD MMM YYYY hh:mm A")}
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
                            <Tooltip title={"Desciption: " + this.props.voice.description}>
                                <Icon className="info-icon">description</Icon>
                            </Tooltip>
                    }
                </div>
                
                {/* 
                <div className="action-container">
                    <Tooltip id="tooltip-icon2" className="w-full" title="Delete Voice" placement="bottom">
                        <Button
                            disabled
                            className="w-full"
                            onClick={this.handleDeleteClick.bind(this, this.props.voice)}>
                            <Icon className="gen-icon">delete</Icon>
                        </Button>
                    </Tooltip>
                </div> */}
            </div>
        )
    }
    

    handleDeleteClick(voice, event) {
        this.props.deleteCallback(voice);
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleVoiceClick(voice) {
        this.props.voiceClickCallback(voice);
    }
}