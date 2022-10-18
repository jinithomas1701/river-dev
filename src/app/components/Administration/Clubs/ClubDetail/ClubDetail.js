import React from "react";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

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
import {Util} from '../../../../Util/util';

import { setLocationList,
        fieldChange,
        setNonClubMembers,
        resetForm,
        setClubMembers,
        toggleConfirmBox,
        setClubRoles,
        changeClubImage } from "./ClubDetail.actions"

import {ClubsService} from "../Clubs.service";
import './ClubDetail.scss';

const PRIVILEGE_UPDATE_CLUB = "UPDATE_CLUB";
const PRIVILEGE_ADD_CLUB_MEMBER = "ADD_CLUB_MEMBER";
const PRIVILEGE_REMOVE_CLUB_MEMBER = "REMOVE_CLUB_MEMBER";

const mapStateToProps = (state) => {
    return {
        clubDetail: state.ClubDetailReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLocationList: (locationList) => {
            dispatch(setLocationList(locationList));
        },
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
        },
        setNonClubMembers: (memberList) => {
            dispatch(setNonClubMembers(memberList));
        },
        setClubMembers: (memberList) => {
            dispatch(setClubMembers(memberList));
        },
        resetForm: () => {
            dispatch(resetForm());
        },
        toggleConfirmBox: (visible, options = {}) => {
            dispatch(toggleConfirmBox(visible, options));
        },
        setClubRoles: (list) => {
            dispatch(setClubRoles(list));
        },
        changeClubImage: (image) => {
            dispatch(changeClubImage(image));
        }
    }
};

class ClubDetail extends React.Component {
    clubId = null;
locations = [];
state = {
    avatar: "",
    circularPreLoadeder: false,
    clubMembersPreloader: false,
    nonClubMembersPreloader: false,
    selectedMembers: []
};

constructor(props) {
    super(props);
}

componentWillMount(){
    this.getClubRoles();
}
componentDidMount() {
    this.getClubRoles();
    if (this.props.match.params.clubId) {
        this.clubId = this.props.match.params.clubId;
        this.getUnassignedMembers();
    } else {
        this.props.resetForm();
    }
    this.getLocations();

}

render() {

    const boardMembersList = this.props.clubDetail.clubFields.clubBoardMembers.map((member, index) => {
        return <div key={index} className="contact-card-wrapper">
            <div className="board-title">
                {member.boardMemberTitle}
            </div>
            <ContactCard
                name={member.boardMemberObj.firstName + member.boardMemberObj.lastName}
                email={member.boardMemberObj.lastName}
                image={member.boardMemberObj.avatar || "../../../../../resources/images/img/user-avatar.png"}
                />
        </div>
    })

    const IS_CREATE_MODE = !this.props.match.params.clubId? true : false;

    return ( 
        <Root role="admin">
            <MainContainer>
                <ConfirmDialog
                    open={this.props.clubDetail.confirmBoxVisibility}
                    title={this.props.clubDetail.confirmBoxTitle}
                    message={this.props.clubDetail.confirmBoxContent}
                    onRequestClose={this.handleConfirmBox}
                    />
                <PageTitle title="Club" />
                <div className="row club-details">
                    <div className="col-md-12">
                        <div className="content-container extra-margin-b">
                            <div className="page-title-section">
                                {
                                    (IS_CREATE_MODE) && <h5>Create New</h5>
                                }
                                <div className="row">
                                    <div className="col-md-4 text-center">
                                        <span className="screen-badge-text">{this.props.clubDetail.clubMembers.length} Members</span>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <input accept="jpg,jpeg,JPG,JPEG" onChange={(e) => {
                                                this.onClubImageChange(e);
                                            }} id="club-image-input" type="file" />
                                        <label htmlFor="club-image-input">
                                            <a className="c_c-dp" >
                                                <img src={this.state.avatar ? 
                                                        Util.getFullImageUrl(this.state.avatar) 
                                                    : "../../../../../resources/images/img/club.png"
                                                         } className="c_c-dp-img" id="club-image"/>
                                                <p className="c_c-dp-change">Change</p>
                                            </a>
                                        </label>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        {this.props.clubDetail.clubFields.clubPoint > 0 &&
                                            <span className="screen-badge-text">
                                                <Icon className="badge-icon">local_play</Icon>
                                                <span className="badge-text">{this.props.clubDetail.clubFields.clubPoint}</span>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="page-content-section">
                                <div className="section-title">Club Details</div>
                                <div className="row">
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="clubName"
                                            label="Club Name"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.clubDetail.clubFields.clubName}
                                            onChange={(e)=>{
                                                this.props.fieldChange("clubName", e.target.value);
                                            }}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="clubName"
                                            label="Club Description"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.clubDetail.clubFields.clubDescription}
                                            onChange={(e)=>{
                                                this.props.fieldChange("clubDescription", e.target.value);
                                            }}
                                            />
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="clubName"
                                            label="Club Slogan"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.clubDetail.clubFields.clubSlogan}
                                            onChange={(e)=>{
                                                this.props.fieldChange("clubSlogan", e.target.value);
                                            }}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container input-select">
                                        <SelectBox 
                                            id="club-location-select" 
                                            label="Club Location" 
                                            selectedValue={this.props.clubDetail.clubFields.clubLocation}
                                            selectArray={this.props.clubDetail.locationList}
                                            onSelect={this.onSelectClubLocation.bind(this)}/>
                                    </div>
                                    <div className="col-md-4 input-container">
                                        <TextField
                                            id="clubCode"
                                            label="Club Code"
                                            className="input-field"
                                            margin="normal"
                                            value={this.props.clubDetail.clubFields.code||''}
                                            disabled={!IS_CREATE_MODE}
                                            onChange={this.handleClubCodeChange.bind(this)}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 input-container input-switch">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={this.props.clubDetail.clubFields.displayInLandingPage}
                                                    onChange={this.handleDisplayLandingChange.bind(this)}
                                                    value={this.props.clubDetail.clubFields.displayInLandingPage}
                                                    color="primary"
                                                    />
                                            }
                                            label="Display Landing Page"
                                            />
                                    </div>
                                </div>

                                {this.clubId && 
                                    <div>
                                        <hr className="full-line"/>
                                        <h5>Manage Members</h5>
                                        <div className="row flex-container">
                                            <div className="col-md-6">
                                                <div className="section-title new-section-title text-center">
                                                    Club Members
                                                </div>
                                                {this.state.clubMembersPreloader &&
                                                    <LinearProgress />
                                                }
                                                <ContactList
                                                    className="club-contact-list"
                                                    contactList={this.props.clubDetail.clubMembers}
                                                    height="500px"
                                                    searchFilterKey="name"
                                                    hasSelectBox={true}
                                                    selectArray={this.props.clubDetail.clubRoles}
                                                    selectLabel={"Role"}
                                                    selectBoxChange={this.selectBoxChange.bind(this)}
                                                    canRemove={Util.hasPrivilage(PRIVILEGE_REMOVE_CLUB_MEMBER)}
                                                    onRemoveCallback={this.onRemoveClubMember.bind(this)}/>
                                            </div>
                                            <div className="col-md-1 center-button-container">
                                                {Util.hasPrivilage(PRIVILEGE_ADD_CLUB_MEMBER) &&
                                                    <Button className="center-button" fab color="primary"
                                                        aria-label="Add"
                                                        onClick={this.onAssignMembers.bind(this)}>
                                                        {
                                                            this.state.circularPreLoadeder
                                                                ? <CircularProgress size={32} className="fab-progress"/>
                                                                : <Icon className="badge-icon">keyboard_arrow_left</Icon>
                                                        }

                                                    </Button>
                                                }
                                            </div>
                                            <div className="col-md-5">
                                                <div className="section-title new-section-title text-center">
                                                    Unassigned Members
                                                </div>
                                                {this.state.nonClubMembersPreloader &&
                                                    <LinearProgress />
                                                }
                                                <ContactList
                                                    contactList={this.props.clubDetail.nonClubMembers}
                                                    height="500px"
                                                    hasCheckbox={true}
                                                    checkboxChange={this.onCheckboxClicked.bind(this)}
                                                    searchFilterKey="name"
                                                    canRemove={false}
                                                    selectedMembers={this.state.selectedMembers}/>
                                            </div>
                                        </div> 
                                    </div>
                                }

                                <div className="floating-bottom-control">
                                    {
                                        this.props.match.params.clubId &&
                                            Util.getActiveRole().value == 'ROLE_SUPER_ADMIN' &&
                                            <div>
                                                <Button
                                                    title="Reset club president dashboard to initial state"
                                                    onClick={this.resetClubSettings.bind(this, this.props.clubDetail.clubFields.id)}
                                                    >
                                                    Reset
                                                </Button>
                                            </div>
                                    }
                                    {Util.hasPrivilage(PRIVILEGE_UPDATE_CLUB) &&
                                        <div>
                                            <Button onClick={this.onCancelClick.bind(this)}>Cancel</Button>
                                            <Button color="primary" onClick={this.onSaveClick.bind(this)}>
                                                Save
                                            </Button>
                                        </div>
                                    }
                                    {!Util.hasPrivilage(PRIVILEGE_UPDATE_CLUB) &&
                                        <div>
                                            <Button onClick={this.onCancelClick.bind(this)}>OK</Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainContainer>
        </Root>
    );
}

handleClubCodeChange(e){
    let code = e.target.value.trim().match(/[a-zA-Z\-_]/g);
    if(code){
        code = code.join('').toUpperCase();
        this.props.fieldChange("code", code);
    }
}

handleDisplayLandingChange(e){
    this.props.fieldChange("displayInLandingPage", !this.props.clubDetail.clubFields.displayInLandingPage);
}

handleConfirmBox(result) {
    console.log(result);
}

onSelectClubLocation(selectedLocation) {
    this.props.fieldChange("clubLocation", selectedLocation);
}

onCheckboxClicked(selectedElementsArray, selectedContact, isChecked) {
    const contactList = this.props.clubDetail.nonClubMembers;
    this.setState({ selectedMembers: selectedElementsArray });
    contactList.forEach((contact) => {
        if (contact.id == selectedContact.id) {
            contact.checked = isChecked;
        }
    }, this);
    this.props.setNonClubMembers(contactList);
}

validateClubDetails() {
    let isValid = true;
    let msg = "";
    const clubDetails = this.props.clubDetail.clubFields;
    if (!clubDetails.clubName) {
        msg = "Please enter a club name";
    } else if (!clubDetails.clubDescription) {
        msg = "Please enter club description";
    } else if (!clubDetails.clubLocation) {
        msg = "Please select club location";
    }
    else if(!clubDetails.code && !this.props.match.params.clubId){
        msg = "Please select club code";
    }

    if (msg) {
        isValid = false;
        riverToast.show(msg);
    }

    return isValid;
}

onCancelClick() {
    this.props.history.push("/admin/clubs");
}

onClubImageChange(event) {
    const imageFile = event.target.files[0];
    this.props.changeClubImage(imageFile);
    Util.displayImageFromFile(imageFile, "club-image");
    Util.base64ImageFromFile(imageFile).
    then( result => {
        this.props.fieldChange("avatar", result);
    }).
    catch(error => {
        riverToast.show(error.status_message || "Something went wrong while changing image");                        
    });
}

processRemoveClubMemberResponse(removedMember) {
    const clubMembers = this.props.clubDetail.clubMembers;
    const unAssignedMembers = this.props.clubDetail.nonClubMembers;
    // Removing from club members
    this.props.clubDetail.clubMembers.forEach((member, index) => {
        if (member.id === removedMember.id) {
            clubMembers.splice(index, 1);
        }
    });

    this.props.setClubMembers(clubMembers);
    // Adding to non club members
    removedMember.checked = false;
    unAssignedMembers.push(removedMember);
    this.props.setNonClubMembers(unAssignedMembers);
}

selectBoxChange(selectedRole, userObj) {
    if (selectedRole) {

        if(selectedRole === userObj.selectorId){
            return;
        }

        const roleChangeRequest = {
            clubId: this.clubId,
            roleId: selectedRole,
            userId: userObj.id
        };

        ClubsService.switchUserClubRole(roleChangeRequest)
            .then(data => {
            if (data) {
                riverToast.show("Role has been switched successfully");
                this.props.setClubMembers([]);
                this.getUnassignedMembers();
                // this.loadClubDetails(this.clubId);
            } else {
                riverToast.show("Role change failed");
            }

        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while switching club role");
        })

    }
}

onRemoveClubMember(member) {
    makeConfirmDialog({});
    if (member && member.id) {
        this.setState({clubMembersPreloader: true});
        const removeRequest = {
            members: [member.id]
        }
        ClubsService.removeClubMemberTask(this.clubId, removeRequest)
            .then(data => {
            this.setState({clubMembersPreloader: false});
            this.processRemoveClubMemberResponse(member);
        })
            .catch((error) => {
            this.setState({clubMembersPreloader: false});
            riverToast.show(error.status_message || "Something went wrong on removing members");
        });
    }
}

onSaveClick() {
    if (this.validateClubDetails()) {
        if (this.clubId) {
            ClubsService.updateClubTask(this.clubId, this.props.clubDetail.clubFields)
                .then((data) => {
                riverToast.show("Club has been updated successfully");
                this.props.history.push("/admin/clubs");
            })
                .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while updating club.");
                if(error.status_code == "R-CUF403") {
                    this.props.history.push("/dashboard");
                }
            });
        } else {
            ClubsService.createClubTask(this.props.clubDetail.clubFields)
                .then((data) => {
                riverToast.show("Club has been created successfully");
                this.props.history.push("/admin/clubs");
            })
                .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating club.");
                if(error.status_code == "R-CUF403") {
                    this.props.history.push("/dashboard");
                }
            });
        }
    }
}

getMemberAssignRequest() {
    const membersIdList = [];
    this.state.selectedMembers.forEach(function(member) {
        membersIdList.push(member.id);
    }, this);

    return {
        members: membersIdList
    };
}

processAssignMembersResponse(assignedMembers) {
    this.setState({ selectedMembers: []});

    if (this.props.match.params.clubId) {
        this.getUnassignedMembers();
        // this.loadClubDetails(this.clubId);

    }
}

onAssignMembers() {
    if (this.state.selectedMembers.length > 0) {
        this.setState({circularPreLoadeder: true});
        const assignMembersRequest = this.getMemberAssignRequest();
        ClubsService.assignMemberTask(this.clubId, assignMembersRequest)
            .then((data) => {
            this.setState({circularPreLoadeder: false});
            this.processAssignMembersResponse(this.state.selectedMembers);
        })
            .catch((error) => {
            this.setState({circularPreLoadeder: false});
            riverToast.show(error.status_message || "Something went wrong while ")
        });
    } else {
        riverToast.show("Please select members to assign");
    }
}

processUnassignedMembersResponse(data) {
    const nonClubMembers = [];
    if (data) {
        data.forEach(function(member, index) {
            const firstName = member.firstName || "";
            const middleName = member.middleName || "";
            const lastName = member.lastName || "";
            const memberObj = {
                name: firstName + " " + middleName + " " + lastName,
                email: member.email,
                image: member.avatar || "../../../../../resources/images/img/user-avatar.png",
                checked: false,
                id: member.id
            };
            nonClubMembers.push(memberObj);
        }, this);
    }
    this.props.setNonClubMembers(nonClubMembers);
    this.loadClubDetails(this.clubId);
}

getUnassignedMembers() {
    this.setState({nonClubMembersPreloader: true});
    ClubsService.getUnassignedMembersTask()
        .then((data) => {
        this.setState({nonClubMembersPreloader: false});
        this.processUnassignedMembersResponse(data);
    })
        .catch((error) => {
        this.setState({nonClubMembersPreloader: false});
        riverToast.show(error.status_message || "Something went wrong while fetching unassigned users.");
    });
}

processClubDetailResponse(clubDetail) {
    if (clubDetail && clubDetail.id) {
        this.props.fieldChange("clubLocation", clubDetail.clubLocation.id);
        this.props.fieldChange("clubDescription", clubDetail.clubDescription);
        this.props.fieldChange("clubName", clubDetail.clubName);
        this.props.fieldChange("clubPoint", clubDetail.clubPoint);
        this.props.fieldChange("id", clubDetail.id);
        this.props.fieldChange("clubMembers", clubDetail.clubMembers);
        this.props.fieldChange("clubSlogan", clubDetail.clubSlogan);
        this.props.fieldChange("clubPresident", clubDetail.clubPresident);
        this.props.fieldChange("clubBoardMembers", clubDetail.clubBoardMembers || []);
        this.props.fieldChange("displayInLandingPage", clubDetail.displayInLandingPage);
        this.props.fieldChange("code", clubDetail.code);
        if(clubDetail.avatar){
            this.props.fieldChange("avatar", "");
        }

        const clubMembers = [];
        if (clubDetail) {
            clubDetail.clubMembers.forEach(function(member, index) {
                const firstName = member.firstName || "";
                const middleName = member.middleName || "";
                const lastName = member.lastName || "";
                const memberObj = {
                    selectorId: member.clubRole ? member.clubRole.id : 2,
                    name: firstName + " " + middleName + " " + lastName,
                    email: member.email,
                    image: member.avatar || "../../../../../resources/images/img/user-avatar.png",
                    id: member.id
                };
                clubMembers.push(memberObj);
            }, this);
        }
        this.props.setClubMembers(clubMembers);
    }
}

loadClubDetails(clubId) {
    if (clubId && clubId > 0) {
        ClubsService.getClubDetailTask(clubId)
            .then((data) => {
            this.processClubDetailResponse(data);
            this.setState({clubCode: data.code})
            this.setState({avatar : data.avatar });
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while loading club.");
            if(error.status_code == "R-CUF403") {
                this.props.history.push("/dashboard");
            }
        });
    }
}

getLocations() {
    ClubsService.getLocationsTask()
        .then((data) => {
        this.locations = [];
        data.forEach((location, index) => {
            const tempLocObj = {
                title: location.name,
                value: location.id
            };
            this.locations.push(tempLocObj);
        }, this);
        this.props.setLocationList(this.locations);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching locations.");
    });
}

resetClubSettings(clubId) {
    if(confirm('Are you sure about restting settings of this club?')){
        ClubsService.resetClubSetting(clubId)
            .then((data) => {
            riverToast.show("Succesfully reset club settings.");
            this.getClubRoles();
            this.loadClubDetails(this.clubId);        
        })
            .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching locations.");
        });
    }
}

getClubRoles() {
    ClubsService.getClubRolesTask()
        .then((data) => {
        const clubRoles = [];
        data.forEach((role, index) => {
            clubRoles.push({title: role.title, value: role.id});
        }, this);
        this.props.setClubRoles(clubRoles);
    })
        .catch((error) => {
        riverToast.show(error.status_message || "Something went wrong while fetching roles.");
    });
}
}

export default connect(mapStateToProps, mapDispatchToProps)(ClubDetail);