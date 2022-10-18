import React, {Component} from 'react';
import {connect} from "react-redux";
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import moment from 'moment';

import {Root} from "../../../../Layout/Root";
import {MainContainer} from "../../../../Common/MainContainer/MainContainer";
import {PageTitle} from "../../../../Common/PageTitle/PageTitle";
import {Util} from "../../../../../Util/util";
import {riverToast} from "../../../../Common/Toast/Toast";
import FieldHeader from "../../../../Common/FieldHeader/FieldHeader";
import LoadedButton from "../../../../Common/LoadedButton/LoadedButton";
import { LoaderOverlay } from "../../../../Common/MinorComponents/MinorComponents";
import AvatarChips from "../../../../Common/AvatarChips/AvatarChips";
import AutoComplete from "../../../../Common/AutoComplete/AutoComplete";
import VoiceDepartmentMain from "./VoiceDepartmentMain/VoiceDepartmentMain";
import VoiceDepartmentPanel from "./VoiceDepartmentPanel/VoiceDepartmentPanel";

import AdminVoicePageService from "../AdminVoiceDetails.service";
import { setDepartmentDetails, setMemberList } from "./AdminVoiceDetails.actions";
import "./AdminVoiceDetails.scss";

const mapStateToProps = (state) => {
    return {
        voiceData: state.AdminVoiceDetailsReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDepartmentDetails: (departmentDetails) => {
            dispatch(setDepartmentDetails(departmentDetails))
        },
        setMemberList: (unAssignedMemberList) => {
            dispatch(setMemberList(unAssignedMemberList))
        }
    };
};

class AdminVoiceDetails extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            departmentState: [{editing: false, escalationDays: 99, membersNow: [], membersToBeAdded: [], membersToBeRemoved: []}]
        };
        this.departmentId = undefined;
    }

    componentDidMount(){
        this.departmentId = this.props.match.params.departmentId;
        this.init();
    }

    render(){
        const props = this.props;
        const state = this.state;
        const departmentDetails = props.voiceData.departmentDetails;
        const departmentState = state.departmentState;
        const unAssignedMemberList = props.voiceData.unAssignedMemberList;
        const escalationLevels = departmentDetails ? departmentDetails.escalationLevels : [];

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Voice Department Details"/>
                    <div className="adminvoice-details-wrapper">
                        <div className="row">
                            <div className="col-md-12">
                                <VoiceDepartmentMain
                                    loading={state.loading}
                                    departmentDetails={departmentDetails}
                                    unAssignedMemberList={unAssignedMemberList}
                                    departmentState={departmentState}
                                    onStartEdit={this.handleStartEdit}
                                    onEscalationChange={this.handleEscalationChange}
                                    onMemberSelect={this.handleMemberSelect}
                                    onMemberDelete={this.handleMemberDelete}
                                    onDepartmentSave={this.handleDepartmentSave}
                                    onCancelEdit={this.handleEditCancel}
                                    />
                                { (escalationLevels.length > 0) && <h2 className="page-heading-lvl2">Escalation Levels</h2> }
                                {
                                    escalationLevels.map((panel, index) => <VoiceDepartmentPanel
                                                                               loading={state.loading}
                                                                               key={escalationLevels[index].escalationLevel}
                                                                               departmentDetails={escalationLevels[index]}
                                                                               unAssignedMemberList={unAssignedMemberList}
                                                                               departmentState={departmentState[index + 1]}
                                                                               onStartEdit={this.handleStartEdit}
                                                                               onEscalationChange={this.handleEscalationChange}
                                                                               onMemberSelect={this.handleMemberSelect}
                                                                               onMemberDelete={this.handleMemberDelete}
                                                                               onDepartmentSave={this.handleDepartmentSave}
                                                                               onCancelEdit={this.handleEditCancel}
                                                                               />)
                                                         }
                            </div>
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    resetForm = (level) => {
    }

    handleStartEdit = (level) => () => {
        const departmentState = [...this.state.departmentState];
        let departmentDetails = this.props.voiceData.departmentDetails;
        const selectedDept = (level === 0) ? departmentDetails : departmentDetails.escalationLevels[level - 1];
        const escalationDays = selectedDept.escalationDays;
        const membersNow = selectedDept.members.map(member => ({avatar: member.avatar, title: member.name, id: member.id}));

        this.resetForm(level);
        departmentState[level] = {editing: true, escalationDays, membersNow, membersToBeAdded: [], membersToBeRemoved: []};
        this.setState({departmentState});
    }

    handleEditCancel = (level) => () => {
        const departmentState = [...this.state.departmentState];

        this.resetForm(level);
        departmentState[level] = {editing: false, escalationDays: 0, membersNow: [], membersToBeAdded: [], membersToBeRemoved: []};
        this.setState({departmentState});
    }

    handleEscalationChange = (level) => (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const departmentState = [...this.state.departmentState];
        departmentState[level].escalationDays = Math.max(value, 1);
        this.setState({departmentState});
    }

    handleMemberSelect = (level) => (member) => {
        let departmentState = [...this.state.departmentState];
        let selectedDept = {...departmentState[level]};
        selectedDept.membersNow = [...selectedDept.membersNow, {...member}];
        selectedDept.membersToBeAdded = [...selectedDept.membersToBeAdded, {...member}];
        departmentState[level] = selectedDept;
        this.setState({departmentState});
    }

    handleMemberDelete = (level) => (memberId) => {
        let departmentState = [...this.state.departmentState];
        let selectedDept = {...departmentState[level]};
        selectedDept.membersNow = [...selectedDept.membersNow];
        selectedDept.membersToBeAdded = [...selectedDept.membersToBeAdded];
        selectedDept.membersToBeRemoved = [...selectedDept.membersToBeRemoved];
        let deletedMember;

        //@DESC: remove from current list
        let index = selectedDept.membersNow.findIndex(member => member.id === memberId);
        if(index > -1){
            deletedMember = selectedDept.membersNow.splice(index, 1);
        }
        index = selectedDept.membersToBeAdded.findIndex(member => member.id === memberId);
        if(index > -1){
            //@DESC: remove from added list
            selectedDept.membersToBeAdded.splice(index, 1);
        }
        else{
            selectedDept.membersToBeRemoved = [...selectedDept.membersToBeRemoved, {...deletedMember[0]}];
        }

        departmentState[level] = selectedDept;
        this.setState({departmentState});
    }

    handleDepartmentSave = (level) => (department) => {
        const deptId = this.props.voiceData.departmentDetails.code;
        let selectedDept = {...this.state.departmentState[level]};
        const membersToBeAdded = selectedDept.membersToBeAdded.map(member => member.id);
        const membersToBeRemoved = selectedDept.membersToBeRemoved.map(member => member.id);
        let deptObj = {
            escalationDays: selectedDept.escalationDays,
            membersToBeAdded,
            membersToBeRemoved
        };
        this.setState({loading: true});

        AdminVoicePageService.updateDepartmentDetails(deptId, level, deptObj)
            .then(departmentDetails => {
            const selectedDept = (level === 0) ? departmentDetails : departmentDetails.escalationLevels[level - 1];
            const departmentState = [...this.state.departmentState];
            departmentState[level] = {editing: false, escalationDays: selectedDept.escalationDays, membersNow: [], membersToBeAdded: [], membersToBeRemoved: []};
            this.setState({departmentState, loading: false});
            this.props.setDepartmentDetails(departmentDetails);
        })
            .catch(error => {
            this.setState({loading: false});
            riverToast.show(error.status_message || "Something went wrong while updating voice department.");
        });
    }

    init = () => {
        this.loadDepartmentDetails(this.departmentId);
        this.loadMemberList();
    }

    loadMemberList = () => {
        AdminVoicePageService.getMemberList()
            .then(memberData => {
            const unAssignedMemberList = memberData.map(member => ({id: member.id, avatar: member.avatar, title: member.name}));
            this.props.setMemberList(unAssignedMemberList);
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while loading member list.");
        });
    }

    loadDepartmentDetails = (departmentId) => {
        AdminVoicePageService.getDepartmentDetails(departmentId)
            .then(departmentDetails => {
            let departmentState = [...this.state.departmentState];
            let levelArray = departmentDetails.escalationLevels.map(level => {
                return {
                    editing: false,
                    escalationDays: level.escalationDays,
                    membersNow: [],
                    membersToBeAdded: [],
                    membersToBeRemoved: []
                };
            });
            departmentState = [...departmentState, ...levelArray];
            this.setState({departmentState});
            this.props.setDepartmentDetails(departmentDetails);
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while loading voice departments details.");
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminVoiceDetails);