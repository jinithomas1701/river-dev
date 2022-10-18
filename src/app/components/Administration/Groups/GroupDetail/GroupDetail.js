import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

//root component
import { Root } from "../../../Layout/Root";
import {ContactCard} from "../../../Common/ContactCard/ContactCard";

// custom component
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import { ContactList } from '../../../Common/ContactList/ContactList';
import {SelectBox} from "../../../Common/SelectBox/SelectBox";
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import {ConfirmDialog, makeConfirmDialog} from '../../../Common/ConfirmDialog/ConfirmDialog';
import { UserChipMultiSelect } from '../../../Common/UserChipMultiSelect/UserChipMultiSelect';

import { fieldChange, resetForm, setGroupMembers, setUserSearchResult,setMembersSelectedResult , toggleConfirmBox} from "./GroupDetail.actions"
import {GroupsService} from "../Groups.service";
import './GroupDetail.scss';

const mapStateToProps = (state) => {
    return {
        groupDetail: state.GroupDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
        },
        setGroupMembers: (memberList) => {
            dispatch(setGroupMembers(memberList));
        },
        resetForm: () => {
            dispatch(resetForm());
        },
        toggleConfirmBox: (visible, options = {}) => {
            dispatch(toggleConfirmBox(visible, options));
        },
        setUserSearchResult: (list) => {
            dispatch(setUserSearchResult(list))
        },
        setMembersSelectedResult: (list) => {
            dispatch(setMembersSelectedResult(list));
        }
    }
};

class GroupDetail extends React.Component {
    groupId = null;
    username = null;
    state = {
        circularPreLoadeder: false,
        groupMembersPreloader: false,
        nonGroupMembersPreloader: false
    };

    constructor(props) {
        super(props);
        this.clearFields();
    }

    componentDidMount() {
        if (this.props.match.params.groupId && this.props.match.params.username) {
            this.groupId = this.props.match.params.groupId;
            this.username = this.props.match.params.username;
            this.loadGroupDetails(this.groupId, this.username);
        } else {
            this.props.resetForm();
        }
    }
 
    render() {
        return ( 
			<Root role="admin">
				<MainContainer>
                    <ConfirmDialog
                        open={this.props.groupDetail.confirmBoxVisibility}
                        title={this.props.groupDetail.confirmBoxTitle}
                        message={this.props.groupDetail.confirmBoxContent}
                        onRequestClose={this.handleConfirmBox}
                    />
                    <PageTitle title="Panel" />
                    <div className="row group-details">
                        <div className="col-md-12">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <h5>
                                        {
                                            (this.props.match.params.groupId && this.props.match.params.username) ? 
                                                "Details" :
                                                "Create New"
                                        }
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-4 text-center">
                                            <span className="screen-badge-text">{this.props.groupDetail.groupMembers.length} Members</span>
                                        </div>
                                        <div className="col-md-4">
                                            <img src="../../../../../resources/images/img/club.png" className="groupdetail-img"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-content-section">
                                    <div className="section-title">Panel Details</div>
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <TextField
                                                id="councilName"
                                                label="Panel Name"
                                                className="input-field"
                                                margin="normal"
                                                inputProps={{
                                                    maxLength: 80,
                                                  }}
                                                value={this.props.groupDetail.groupFields.groupName}
                                                onChange={(e)=>{
                                                    this.props.fieldChange("groupName", e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <TextField
                                                id="councilDesc"
                                                label="Panel Description"
                                                className="input-field"
                                                margin="normal"
                                                value={this.props.groupDetail.groupFields.groupDescription}
                                                onChange={(e)=>{
                                                    this.props.fieldChange("groupDescription", e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 input-container">
                                            <UserChipMultiSelect 
                                                    placeholder = "Members"
                                                    customStyle = {{width: "17rem"}}
                                                    showPreloader={this.state.showSearchPreloader}
                                                    onTextChange={this.onMembersSearch.bind(this)}
                                                    resultChips={this.props.groupDetail.membersChipSearchResult}
                                                    selectedChips={this.props.groupDetail.groupMembers}
                                                    onItemSelect={this.onMembersSearchItemSelect.bind(this)}
                                                    onDeleteChip={this.onDeleteMember.bind(this)}
                                            />
                                        </div>
                                    </div>

                                    
                                    <div className="floating-bottom-control">
                                        <Button onClick={this.onCancelClick.bind(this)}>Cancel</Button>
                                        <Button color="primary" onClick={this.onSaveClick.bind(this)}>
                                            {
                                                (this.props.match.params.groupId && this.props.match.params.username) ?
                                                    "Update":
                                                    "Save"
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    handleConfirmBox(result) {
        console.log(result);
    }

    onCancelClick() {
        this.props.history.push("/admin/councils");
    }

    clearFields() {
        this.props.resetForm();
    }

    isFormValid() {
        const group = this.props.groupDetail.groupFields;

        if(
            !group.groupName ||
            !group.groupDescription 
        ) {
            riverToast.show("Please fill all required fields");
            return false;
        } else {
            if( this.groupId && !(group.id || group.username)) {
                riverToast.show("Something went wrong");
                return false;
            }
            if( !group.groupMembers.length > 0 ) {
                riverToast.show("Group must contain atleast a member");
                return false;
            }
            return true;
        }
    }

    getGroupMeta(method) {
        var groupMeta = {
            name: this.props.groupDetail.groupFields.groupName,
            description: this.props.groupDetail.groupFields.groupDescription,
            members: this.props.groupDetail.groupFields.groupMembers
        }
        if (method == "update") {
            return {
                ...groupMeta,
                id: this.props.groupDetail.groupFields.id                
            }
        } else {
            return groupMeta;
        }
    }

    onSaveClick() {
        if (this.isFormValid()) {
            if (this.groupId) {
                GroupsService.updateGroupTask(this.groupId, this.username, this.getGroupMeta("update"))
                .then((data) => {
                    riverToast.show("Group has been updated successfully");
                    this.props.history.push("/admin/councils");
                })
                .catch((error) => {
                    riverToast.show("Something went wrong while updating council");
                });
            } else {

                GroupsService.createGroupTask(this.getGroupMeta())
                .then((data) => {
                    riverToast.show("Group has been created successfully");
                    this.props.history.push("/admin/councils");
                })
                .catch((error) => {
                    riverToast.show("Something went wrong while creating council");                    
                });
            }
        }
    }

    onMembersSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showSearchPreloader: true});
            GroupsService.searchMembers(searchText)
                .then((data) => {
                    this.setState({showSearchPreloader: false});
                    if (data) {
                        this.props.setUserSearchResult(data);
                    }
                })
                .catch((error) => {
                    this.setState({showSearchPreloader: false});
                    riverToast.show(error.status_message);
                });
        } else if (searchText.length < 3){
            this.props.setUserSearchResult([]);
        }
    }

    onMembersSearchItemSelect(item) {
        const groupMembers = this.props.groupDetail.groupMembers;
        let isChipExists = false;
        this.props.setUserSearchResult([]);
        groupMembers.forEach((element) => {
            if (element.id === item.id) {
                isChipExists = true;
            }
        }, this);

        if (!isChipExists) {
            groupMembers.push(item);
        }
        this.props.setMembersSelectedResult(groupMembers);
        this.updateSelectedMembers(groupMembers);
    }

    onDeleteMember(item) {
        if (item) {
            const groupMembers = this.props.groupDetail.groupMembers;
            this.props.groupDetail.groupMembers.forEach((element, index) => {
                if (element.id === item.id) {
                    groupMembers.splice(index, 1);
                }
            }, this);
            this.props.setMembersSelectedResult(groupMembers);
            this.updateSelectedMembers(groupMembers);
        }
    }

    updateSelectedMembers(memberList) {
        const selectedMembersId = memberList.map(obj => obj.id);
        this.props.fieldChange("groupMembers", selectedMembersId);
    }

    processGroupDetailResponse(groupDetail) {
        if (groupDetail && groupDetail.id) {
            this.props.fieldChange("groupDescription", groupDetail.description);
            this.props.fieldChange("groupName", groupDetail.name);
            this.props.fieldChange("id", groupDetail.id);
            this.props.fieldChange("username", groupDetail.username);

            const groupMembers = [];
            if (groupDetail) {
                groupDetail.members.forEach(function(member, index) {
                    const firstName = member.firstName || "";
                    const middleName = member.middleName || "";
                    const lastName = member.lastName || "";
                    const memberObj = {
                        type: "USER",
                        fullname: firstName + " " + middleName + " " + lastName,
                        username: member.email,
                        avatar: member.avatar || "resources/images/img/user-avatar.png",
                        id: member.id
                    };
                    groupMembers.push(memberObj);
                }, this);
            }
            this.props.setMembersSelectedResult(groupMembers);
            this.updateSelectedMembers(groupMembers);
        }
    }

    loadGroupDetails(groupId, username) {
        if (groupId && groupId > 0) {
            GroupsService.getGroupDetailTask(groupId, username)
                .then((data) => {
                    this.processGroupDetailResponse(data);
                })
                .catch((error) => {
                    riverToast.show("Something went wrong while loading council");
                });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);