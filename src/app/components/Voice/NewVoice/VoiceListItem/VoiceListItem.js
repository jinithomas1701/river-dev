import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';

// custom component
import { Util } from '../../../../Util/util';
import { DateDisplay, UserAvatar } from '../../../Common/MinorComponents/MinorComponents';

// css
import './VoiceListItem.scss';

const VOICE_STATUS_UNASSIGNED = "UA";
const VOICE_STATUS_ASSIGNED = "AS";
const VOICE_STATUS_APPROVED = "IP";
const VOICE_STATUS_REJECTED = "RJ";
const VOICE_STATUS_ESCALATED = "ES";

const VoiceListItem = (props) => {
    const activeClass = (props.id === props.selectedVoiceId) ? "active" : "";
    const unassigned = props.status === VOICE_STATUS_UNASSIGNED;
    let voiceLevel = "";
    let badgeContent = "";
    if (props.status === VOICE_STATUS_ESCALATED) {
        voiceLevel = (props.escalatedToCeo) ? "(CEO)" : `(LVL${props.escalationLevel})`;
        badgeContent = (props.escalatedToCeo) ? "C" : props.escalationLevel;
    }

    return (
        <article className={`voicelist-item ${activeClass}`} onClick={e => { props.onSelect(props.id) }}>
            <UserAvatar src={props.createdBy.avatar} name={props.createdBy.name} />
            <div className="infoarea-wrapper">
                <div className="info-area">
                    <h1 className="title" title={props.title}>{props.title}</h1>
                    <h2 className="description" title={props.description}>{props.description}</h2>
                    <table className="table-stats">
                        <tbody>
                            <tr>
                                <th>RefCode:</th>
                                <td>{props.id}</td>
                                <th>Type:</th>
                                <td>{props.type}</td>
                                <th>Status:</th>
                                <td>{Util.getVoiceStatusText(props.status)}</td>
                                <th>Created On:</th>
                                <td><DateDisplay date={props.createdOn} /></td>
                                <th>Departments:</th>
                                <td>{props.departments.join(', ')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="action-area">
                    {unassigned && <Icon className="unassigned-icon" title="Re Submit">notification_important</Icon>}
                    {
                        props.escalated &&
                        <IconButton className="escalation-wrapper" title={`Escalated ${voiceLevel}`}>
                            <Badge
                                className="escalation-badge"
                                classes={{badge: "badge-icon"}}
                                badgeContent={badgeContent}
                                color="primary"
                            >
                                <Icon className="escalate-icon" title={`Escalated ${voiceLevel}`}>error</Icon>
                            </Badge>
                        </IconButton>
                    }
                </div>
            </div>
        </article>
    );
}

export default VoiceListItem;