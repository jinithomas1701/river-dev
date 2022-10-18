import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';
import { CircularProgress } from 'material-ui/Progress';

import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import { CommonDashboardService } from '../CommonDashboard.service';
import {riverToast} from '../../Common/Toast/Toast';

import { Util } from '../../../Util/util';

// css
import './VoiceItem.scss';

class VoiceItem extends Component {

    state = {
        currentCouncil: ''
    }

    componentDidMount() {
        if (this.props.voice && this.props.voice.voiceCouncils) {
            this.setState({ currentCouncil: this.props.voice.voiceCouncils.tagId })
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.voice != this.props.voice) {
            this.setState({ currentCouncil: this.props.voice.voiceCouncils.tagId })            
        }
    }

    render() {

        const voiceType = this.props.voiceTypes.map((itm, indx) => {

            if (itm.value == this.props.voice.type) {
                return <span key={indx}>{itm.title}</span>;
            }
        });

        return (
            <div className="voice-tile">
                <img className="user-avatar" src={ "../../../../../resources/images/img/user-avatar.png" || Util.getFullImageUrl(this.props.voice.postedBy.avatar)}/>
                <div className="datas">
                    <div className="title-date">
                        <div className="title" onClick={this.onVoiceClick.bind(this, this.props.voice, this.props.index)}>{this.props.voice.title}</div>
                        <div className="created-on">{Util.getDateStringFromTimestamp(this.props.voice.createdOn)}</div>
                    </div>
                    <div className="infos">
                        <div className="status tag" title="Status">{this.props.voice.actionStatus ? this.props.voice.actionStatus.status : 'In Progress'}</div>
                        <div className="council tag" title="Panel">{this.props.voice.voiceCouncils ? this.props.voice.voiceCouncils.name : ''}</div>
                        <div className="type tag" title="Type">{voiceType}</div>                        
                    </div>
                </div>
                {
                    this.props.voice.voiceLevel == "PRESIDENT" &&
                        <div className="forward-action">
                            <SelectBox
                                id="club-location-select"
                                classes="council-select"
                                disableSysClasses
                                selectedValue={this.state.currentCouncil}
                                selectArray={this.props.councils}
                                onSelect={this.onSelectCouncil.bind(this)} />
                            <div className="forward-action-button-wrapper">
                                <div className="fwd-btn" onClick={this.onForwardClick.bind(this)}>
                                    {this.state.showForwardPreloader &&
                                        <CircularProgress size={18} className="fab-progress" />
                                    }
                                    {!this.state.showForwardPreloader &&
                                        <div>FORWARD</div>
                                    }
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }

    onSelectCouncil(item) {
        this.setState({ currentCouncil: item });
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

    onForwardClick() {
        if (this.state.currentCouncil) {
            const forwardRequest = {
                "tagId": this.state.currentCouncil,
                "tagType": "COUNCIL",
                "hash": this.getCouncilHash(this.state.currentCouncil)
            };
            CommonDashboardService.forwardToCouncil(forwardRequest, this.props.voice.voiceId, this.props.voice.voiceHash)
                .then(data => {
                    riverToast.show("Voice has been forwarded to selected Panel");
                    this.props.onVoiceChangeSuccess(data, this.props.index);
                })
                .catch(error => {
                    ;
                    riverToast.show(error.status_message);
                });
        }
    }

    onVoiceClick(voice, index) {
        this.props.onVoiceClick(voice, index);
    }
}

export default VoiceItem;