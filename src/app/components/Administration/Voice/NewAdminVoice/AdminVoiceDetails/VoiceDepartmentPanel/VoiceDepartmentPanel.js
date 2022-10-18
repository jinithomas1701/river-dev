import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import FieldHeader from "../../../../../Common/FieldHeader/FieldHeader";
import LoadedButton from "../../../../../Common/LoadedButton/LoadedButton";
import { LoaderOverlay } from "../../../../../Common/MinorComponents/MinorComponents";
import AvatarChips from "../../../../../Common/AvatarChips/AvatarChips";
import AutoComplete from "../../../../../Common/AutoComplete/AutoComplete";

import './VoiceDepartmentPanel.scss';

class VoiceDepartmentPanel extends Component{
    render(){
        const props = this.props;
        const departmentState = props.departmentState;
        const departmentDetails = props.departmentDetails;
        const level = departmentDetails.escalationLevel;

        return (
            <Paper className="voice-panel-wrapper" elevation={4}>
                <h3 className="page-heading-lvl3">Level {level}</h3>
                {
                    (departmentState.editing === true) ? this.getFormTemplate(departmentDetails, departmentState) : this.getMainTemplate(departmentDetails, departmentState)
                }
            </Paper>
        );
    }

    getMainTemplate = (departmentDetails, departmentState) => {
        const props = this.props;
        const memberList = departmentDetails ? departmentDetails.members.map(member => ({avatar: member.avatar, title: member.name, id: member.id})) : [];
        const level = departmentDetails.escalationLevel;

        return (
            <div className="escalation-item">
                <div className="escalation-detail">
                    <dl className="title-descriptor-wrapper">
                        <dt>Escalation Days:</dt>
                        <dd>{departmentDetails.escalationDays}</dd>
                    </dl>
                    <FieldHeader title="Members" />
                    <div className="member-list-wrapper">
                        { (memberList.length > 0) && <AvatarChips list={memberList} /> }
                    </div>
                </div>
                <IconButton
                    className="btn-rounded-icon-bordered btn-edit"
                    onClick={props.onStartEdit(level)}
                    >edit</IconButton>
            </div>
        );
    }

    getFormTemplate = (departmentDetails, departmentState) => {
        const props = this.props;
        const memberList = departmentState.membersNow.map(member => ({...member, deletable: true}));
        const level = departmentDetails.escalationLevel;
        
        return (
            <div className="escalation-item">
                <div className="row">
                    <div className="col-md-12">
                        <TextField
                            margin="normal"
                            type="number"
                            min={1}
                            step={1}
                            label="Escalation Days:" 
                            className="input-field"
                            value={departmentState.escalationDays}
                            onChange={props.onEscalationChange(level)}
                            />
                    </div>
                </div>
                <FieldHeader title="Members" />
                <AutoComplete
                    placeholder="Add Members"
                    options={props.unAssignedMemberList}
                    onChange={props.onMemberSelect(level)}
                    onInputChange={this.handleMemberSearch}
                    />
                <div className="member-list-wrapper">
                    {
                        (memberList.length > 0) && <AvatarChips
                                                       deletable={true}
                                                       list={memberList}
                                                       onDelete={props.onMemberDelete(level)}
                                                       />
                    }
                </div>
                <div className="submit-wrapper">
                    <LoadedButton loading={props.loading} color="primary" className="btn-primary" onClick={props.onDepartmentSave(level)}>Save</LoadedButton>
                    <LoadedButton loading={props.loading} color="default" className="btn-default" onClick={props.onCancelEdit(level)}>Cancel</LoadedButton>
                </div>
            </div>
        );
    }

    handleMemberSearch = () => {

    }
}

VoiceDepartmentPanel.defaultProps = {
    loading: false
};

VoiceDepartmentPanel.propTypes = {
    loading: PropTypes.bool,
    departmentDetails: PropTypes.object,
    unAssignedMemberList: PropTypes.array,
    departmentState: PropTypes.object,
    onStartEdit: PropTypes.func,
    onMemberSelect: PropTypes.func,
    onMemberDelete: PropTypes.func,
    onEscalationChange: PropTypes.func,
    onDepartmentSave: PropTypes.func,
    onCancelEdit: PropTypes.func
};

export default VoiceDepartmentPanel;