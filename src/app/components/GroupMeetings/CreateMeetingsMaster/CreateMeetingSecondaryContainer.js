//---------------------------External components-------------------
import React, { Component } from 'react';
import { Button } from 'material-ui';
//---------------------------Internal Components----------------------
import AutoComplete from "../../Common/AutoComplete/AutoComplete";
import AvatarChips from "../../Common/AvatarChips/AvatarChips";
import FieldHeader from "../../Common/FieldHeader/FieldHeader";
import AddGuestDialog from "./AddGuestDialog";
import ChipListInput from "../../Common/ChipListInput/ChipListInput";
//-----------------------------css----------------------------------
import "./CreateMeetingSecondaryContainer.scss";
class CreateMeetingSecondaryContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let props = this.props;
        return (
            <div className="invitees-details-wrap">
                <h1 className="people-head">People</h1>
                <p className="inviting-line">All club members are invited by default on club meetings.</p>
                <div className="row">
                    <div className="col-md-6">
                        <AutoComplete
                            options={props.inviteesArrayList}
                            placeholder="Add Invitees"
                            onChange={props.handleInviteesSelect}
                            onInputChange={props.handleInviteesSearch}
                        />
                    </div>
                </div>

                <AvatarChips
                    list={[...props.selectedInviteesList]}
                    deletable={true}
                    onDelete={props.handleInviteesRemove}
                />

                <div className="row guestList-wrap">
                    <div className="col-md-12">
                        <FieldHeader backgroundColor="#ededed" title="Add Guest" />
                        <ChipListInput
                            editable={true}
                            chipList={props.guest}
                            chipTitle="Add guest"
                            handleAddChip={props.handleGuestDialogOpen}
                            onChipDelete={props.handleDeleteGuest}
                        />
                    </div>
                </div>
                <AddGuestDialog
                    open={props.addGuestDialog}
                    onClose={props.handleAddGuestDialogClose}
                    onGuestSubmit={props.handleAddGuest}
                />
                <div className="buttons-wrap">
                    <div className="row">
                        {!props.meeting &&
                            <div className="create-button">
                                <Button className="btn-primary" onClick={props.handleMeetingCreate}>CREATE</Button>
                            </div>
                        }
                        {props.meeting &&
                            <div className="create-button">
                                <Button className="btn-primary" onClick={props.handleMeetingUpdate}>UPDATE</Button>
                            </div>
                        }
                        <div className="close-button">
                            <Button className="btn-close" onClick={props.handleCreateMeetingClose}>CANCEL</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default CreateMeetingSecondaryContainer