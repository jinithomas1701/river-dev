import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import moment from 'moment';

import {Util} from "../../../Util/util";
import { riverToast } from '../../Common/Toast/Toast';
import { SelectBox } from '../../Common/SelectBox/SelectBox';
import LoadedButton from '../../Common/LoadedButton/LoadedButton';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import AutoComplete from '../../Common/AutoComplete/AutoComplete';
import AvatarChips from '../../Common/AvatarChips/AvatarChips';

import "./ClubSettingsStage1.scss";

const STAGE_OFFICIALS = 1;

class ClubSettingsStage1 extends Component{
    constructor(props){
        super(props);
        this.state = {
            secretary: "",
            treasurer: "",
            sergentAtArms: "",
            defaultMembers: [],
            boardMembers: [],
        };

        this.isCouncilPopulated = false;

        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount = () => {
        const currProps = this.props;
        if(currProps.members.length){
            const defaultMembers = currProps.members.map(member => ({...member, value: member.title}));
            this.setState({defaultMembers});
        }

        if(currProps.settings){
            const {secretary, treasurer, sergentAtArms} = currProps.settings;
            this.setState({secretary, treasurer, sergentAtArms})
        }

        if(currProps.members.length && currProps.settings && !this.isCouncilPopulated && this.state.defaultMembers.length){
            const boardMemberList = currProps.settings.boardMembers.map(member => member.id);
            let boardMembers = [];
            let defaultMembers = [...this.state.defaultMembers];
            if(boardMemberList.length && !this.isCouncilPopulated){
                boardMemberList.forEach(memberId => {
                    let index = defaultMembers.findIndex(member => member.id == memberId);
                    if(index > -1){
                        const user = defaultMembers.splice(index, 1);
                        boardMembers.push({...user[0]});
                    }
                });
                this.isCouncilPopulated = true;
            }
            this.setState({defaultMembers, boardMembers});
        }
    }

    componentDidUpdate = (prevProps) => {
        const currProps = this.props;
        if(!prevProps.members.length && currProps.members.length){
            const defaultMembers = currProps.members.map(member => ({...member, value: member.title}));
            this.setState({defaultMembers});
        }

        if(!prevProps.settings && currProps.settings){
            const {secretary, treasurer, sergentAtArms} = currProps.settings;
            this.setState({secretary, treasurer, sergentAtArms})
        }

        if(currProps.members.length && currProps.settings && !this.isCouncilPopulated && this.state.defaultMembers.length){
            const boardMemberList = currProps.settings.boardMembers.map(member => member.id);
            let boardMembers = [];
            let defaultMembers = [...this.state.defaultMembers];
            if(boardMemberList.length && !this.isCouncilPopulated){
                boardMemberList.forEach(memberId => {
                    let index = defaultMembers.findIndex(member => member.id == memberId);
                    if(index > -1){
                        const user = defaultMembers.splice(index, 1);
                        boardMembers.push({...user[0]});
                    }
                });
                this.isCouncilPopulated = true;
            }
            else{
                this.isCouncilPopulated = true;
            }
            this.setState({defaultMembers, boardMembers});
        }
    }

    render = () => {
        const props = this.props;
        const state = this.state;
        return (
            <div className="settings-stage1-wrapper">
                <div className="row">
                    <div className="col-md-6">
                        <SelectBox
                            label="Secretary"
                            classes="input-select"
                            placeholder="Select Secretary"
                            selectedValue = {state.secretary}
                            selectArray={props.members}
                            onSelect={this.handleSelectChange("secretary")}
                            />
                    </div>
                    <div className="col-md-6">
                        <SelectBox
                            label="Treasurer"
                            classes="input-select"
                            placeholder="Select Treasurer"
                            selectedValue = {state.treasurer}
                            selectArray={props.members}
                            onSelect={this.handleSelectChange("treasurer")}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <SelectBox
                            label="Sergent at arms"
                            classes="input-select"
                            placeholder="Select Sergent at arms"
                            selectedValue = {state.sergentAtArms}
                            selectArray={props.members}
                            onSelect={this.handleSelectChange("sergentAtArms")}
                            />
                    </div>
                </div>
                <FieldHeader title="Council members" />
                <div className="row">
                    <div className="col-md-6">
                        <AutoComplete
                            options={state.defaultMembers}
                            placeholder="Select Council members"
                            onChange={this.handleMemberSelect}
                            onInputChange={this.handleMemberSearch}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <AvatarChips
                            list={[...state.boardMembers]}
                            deletable={true}
                            onDelete={this.handleMemberRemove}
                            />
                    </div>
                </div>
                <div className="submit-wrapper">
                    <LoadedButton color="default" className="btn-default" onClick={this.handlePrev}>Exit Setup</LoadedButton>
                    <LoadedButton color="primary" className="btn-primary" onClick={this.handleNext}>Next</LoadedButton>
                </div>
            </div>
        );
    }

    validateForm = (request) => {
        let isValid = true;
        if(!request.secretary){
            isValid = false;
            riverToast.show("Please select Secretary.");
        }
        else if(!request.treasurer){
            isValid = false;
            riverToast.show("Please select Treasurer.");
        }
        else if(!request.sergentAtArms){
            isValid = false;
            riverToast.show("Please select Sergent.");
        }
        else if(!request.boardMembers.length){
            isValid = false;
            riverToast.show("Please select atleast one Council member.");
        }

        return isValid;
    }

    handleSelectChange = (name) => (value) =>{
        this.setState({[name]: value});
    }

    handleMemberSearch = (text) => {
    }

    handleMemberSelect = (selectedMember) => {
        let defaultMembers = [...this.state.defaultMembers];
        let boardMembers = [...this.state.boardMembers];
        let index = defaultMembers.findIndex(member => member.id == selectedMember.id);
        defaultMembers.splice(index, 1);
        boardMembers.push({...selectedMember});
        this.setState({defaultMembers, boardMembers});
    }

    handleMemberRemove = (memberId) => {
        let defaultMembers = [...this.state.defaultMembers];
        let boardMembers = [...this.state.boardMembers];
        let index = boardMembers.findIndex(member => member.id == memberId);
        const selectedMember = boardMembers.splice(index, 1);
        defaultMembers.push({...selectedMember[0]});
        this.setState({defaultMembers, boardMembers});
    }

    handlePrev = () => {
        this.props.goToLastPage(STAGE_OFFICIALS);
    }

    handleNext = () => {
        const request = {
            secretary: this.state.secretary,
            treasurer: this.state.treasurer,
            sergentAtArms: this.state.sergentAtArms,
            boardMembers: this.state.boardMembers.map(member => member.id),
        };
        const isValid = this.validateForm(request);
        if(!isValid){
            return;
        }
        this.props.onSubmit(STAGE_OFFICIALS, request);
    }

}

ClubSettingsStage1.defaultProps = {
    members: [],
    settings: null,
};

ClubSettingsStage1.propTypes = {
    members: PropTypes.array.isRequired,
    settings: PropTypes.object,
    goToLastPage: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ClubSettingsStage1;