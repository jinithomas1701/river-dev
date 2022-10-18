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

import './VoiceDepartmentMain.scss';

class VoiceDepartmentMain extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const props = this.props;
        const departmentState = props.departmentState;
        const departmentDetails = props.departmentDetails;

        return (
            <Paper className="voice-main-wrapper" elevation={4}>
                {
                    (departmentState[0].editing === true) ? this.getFormTemplate(departmentDetails, departmentState) : this.getDisplayTemplate(departmentDetails, departmentState)
                }
            </Paper>
        );
    }

    getDisplayTemplate = (departmentDetails, departmentState) => {
        const props = this.props;
        const memberList = departmentDetails ? departmentDetails.members.map(member => ({avatar: member.avatar, title: member.name, id: member.id})) : [];
        const level = 0;

        const template = departmentDetails ? <div className="voice-main-detail">
                  <dl className="title-descriptor-wrapper">
                      <dt>Title:</dt>
                      <dd>{departmentDetails.name}</dd>
                      <dt>Code:</dt>
                      <dd>{departmentDetails.code}</dd>
                      <dt>Escalation Days:</dt>
                      <dd>{departmentDetails.escalationDays} Days</dd>
                  </dl>
                  <FieldHeader title="Members" />
                  <div className="member-list-wrapper">
                      { (memberList.length > 0) && <AvatarChips list={memberList} /> }
                  </div>
                  <IconButton
                      className="btn-rounded-icon-bordered btn-edit"
                      onClick={props.onStartEdit(level)}
                      >edit
                  </IconButton>
              </div> : <LoaderOverlay show={true} />
        return template;
    }

    getFormTemplate = (departmentDetails, departmentState) => {
        const props = this.props;
        const level = 0;
        const memberList = departmentState[level].membersNow.map(member => ({...member, deletable: true}));

        const template = departmentDetails ? <div className="voice-main-form">
                  <div className="row">
                      <div className="col-md-12">
                          <dl className="title-descriptor-wrapper">
                              <dt>Title:</dt>
                              <dd>{departmentDetails.name}</dd>
                              <dt>Code:</dt>
                              <dd>{departmentDetails.code}</dd>
                          </dl>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-md-12">
                          <TextField
                              margin="normal"
                              type="number"
                              min={1}
                              step={1}
                              label="Escalation Days:" 
                              className="input-field"
                              value={departmentState[0].escalationDays}
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
              </div> : <LoaderOverlay show={true} />
        return template;
    }

    handleMemberSearch = () => {

    }
}

VoiceDepartmentMain.defaultProps = {
    loading: false
};

VoiceDepartmentMain.propTypes = {
    loading: PropTypes.bool,
    departmentDetails: PropTypes.object,
    unAssignedMemberList: PropTypes.array,
    departmentState: PropTypes.array,
    onStartEdit: PropTypes.func,
    onMemberSelect: PropTypes.func,
    onMemberDelete: PropTypes.func,
    onEscalationChange: PropTypes.func,
    onDepartmentSave: PropTypes.func,
    onCancelEdit: PropTypes.func
};

export default VoiceDepartmentMain;