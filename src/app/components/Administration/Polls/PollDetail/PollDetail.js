import React from "react";
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import {connect} from "react-redux";
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import { Util } from '../../../../Util/util';
import moment from 'moment';
import Datetime from 'react-datetime';

//root component
import { Root } from "../../../Layout/Root";
import {ContactCard} from "../../../Common/ContactCard/ContactCard";

// custom component
import { MainContainer } from "../../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../../Common/PageTitle/PageTitle';
import {SelectBox} from '../../../Common/SelectBox/SelectBox';
import ResultOptionComponent from './ResultOptionComponent/ResultOptionComponent';

import { PollDetailService } from './PollDetail.service'
import { setField,
        clearFields,
        loadPollDetails,
        changeClubList } from './PollDetail.action';
import './PollDetail.scss';
import { error } from "util";

const mapStateToProps = (state) => {
    return {
        pollDetails: state.PollDetailReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fieldChange: (fieldName, payload) => {
            dispatch(setField(fieldName, payload));
        },
        clearFields: () => {
            dispatch(clearFields());
        },
        loadPollDetails: (poll) => {
            dispatch(loadPollDetails(poll));
        },
        changeClubList: (clubList) => {
            dispatch(changeClubList(clubList));
        }
    }
}
const PRIVILEGE_UPDATE_POLL = "UPDATE_POLL";
class PollDetail extends React.Component {

    state ={
        pollUpdate: false
    }

    constructor(props){
        super(props);
        this.getParticipantsList();

        if (this.props.match.params.pollId){
            this.getPollDetails(this.props.match.params.pollId);
        } else {
            this.props.clearFields();
            this.state.pollUpdate = true;
        }
    }

    componentDidMount() {
        if (!this.props.match.params.pollId){
            this.props.fieldChange("electionEndDate", Math.round((new Date()).getTime() / 1000));            
            this.props.fieldChange("electionStartDate", Math.round((new Date()).getTime() / 1000));            
            this.props.fieldChange("nominationEndDate", Math.round((new Date()).getTime() / 1000));            
            this.props.fieldChange("nominationStartDate", Math.round((new Date()).getTime() / 1000));                        
        }
        
    }

    yesterday = Datetime.moment().subtract(1, 'day');

    render() {
        const nomineesList = this.props.pollDetails.pollDetailsFields.nominees.map((nominee, index) => {
            return <div className="nominee-container">
                        <ContactCard
                            key={index}
                            name={nominee.user.fullName}
                            email={nominee.user.username}
                            image={ (nominee.user.avatar) ? nominee.user.avatar : "../../../../../resources/images/img/user-avatar.png"}
                        />
                    </div>
        });


        const voteStatus = (this.props.poll && this.props.poll.nominees) ? this.props.pollDetails.pollDetailsFields.nominees.map((nominee, index) => {
            return <ResultOptionComponent 
                        nominee = {nominee}
                        progress = {Math.round(nominee.voteCount * 100 / this.props.pollDetails.pollDetailsFields.totalVotes)}                        
                    />
        }) : "No Nominees";

        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Poll" />
                    <div className="row poll-details">
                        <div className="col-md-12">
                            <div className="content-container extra-margin-b">
                                <div className="page-title-section">
                                    <h5>Create New</h5>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <img src="../../../../../resources/images/img/club.png" className="polldetail-img"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="page-content-section">
                                    <div className="section-title">Poll Details</div>
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <TextField
                                                id="title"
                                                label="Title"
                                                className="input-field"
                                                margin="normal"
                                                inputProps={{
                                                    maxLength: 80,
                                                  }}
                                                onChange = {this.handleChange('title')}
                                                value = {this.props.pollDetails.pollDetailsFields.title}
                                            />
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <TextField
                                                id="description"
                                                label="Description"
                                                className="input-field"
                                                margin="normal"
                                                onChange = {this.handleChange('description')}
                                                value = {this.props.pollDetails.pollDetailsFields.description}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <div className="datetime-picker-wrapper">
                                                <label
                                                    htmlFor="nomination-start-date"
                                                >
                                                    Nomination Start Date
                                                </label>
                                                <Datetime
                                                    inputProps={
                                                            { 
                                                                disabled: (this.validatePollStatus('WN')),
                                                                placeholder: 'Nomination Start Date',
                                                                id:"nomination-start-date",
                                                                className:"datetime-input"
                                                            }
                                                        }
                                                    isValidDate={ this.isDateValid.bind(this) }
                                                    className="datetime-picker"
                                                    onChange={(value)=>{
                                                        this.props.fieldChange("nominationStartDate", Math.round((new Date(value)).getTime() / 1000));
                                                    }}

                                                    value={new Date(this.props.pollDetails.pollDetailsFields.nominationStartDate * 1000)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <div className="datetime-picker-wrapper">
                                                <label
                                                    htmlFor="nomination-end-date"
                                                >
                                                    Nomination End Date
                                                </label>
                                                <Datetime
                                                    inputProps={
                                                            { 
                                                                disabled: (this.validatePollStatus('AN')),
                                                                placeholder: 'Nomination End Date',
                                                                id:"nomination-end-date",
                                                                className:"datetime-input"
                                                            }
                                                        }
                                                    isValidDate={ this.isDateValid.bind(this) }
                                                    className="datetime-picker"
                                                    onChange={(value)=>{
                                                        this.props.fieldChange("nominationEndDate", Math.round((new Date(value)).getTime() / 1000));
                                                    }}
                                                    value={new Date(this.props.pollDetails.pollDetailsFields.nominationEndDate * 1000)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 input-container">
                                            <div className="datetime-picker-wrapper">
                                                <label
                                                    htmlFor="election-start-date"
                                                >
                                                    Election Start Date
                                                </label>
                                                <Datetime
                                                    inputProps={
                                                            { 
                                                                disabled: (this.validatePollStatus('WE')),
                                                                placeholder: 'Election Start Date',
                                                                id:"election-start-date",
                                                                className:"datetime-input"
                                                            }
                                                        }
                                                    isValidDate={ this.isDateValid.bind(this) }
                                                    className="datetime-picker"
                                                    onChange={(value)=>{
                                                        this.props.fieldChange("electionStartDate", Math.round((new Date(value)).getTime() / 1000));
                                                    }}
                                                    value={new Date(this.props.pollDetails.pollDetailsFields.electionStartDate * 1000)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 input-container">
                                            <div className="datetime-picker-wrapper">
                                                <label
                                                    htmlFor="election-end-date"
                                                >
                                                    Election End Date
                                                </label>
                                                <Datetime
                                                    inputProps={
                                                            { 
                                                                disabled: (this.validatePollStatus('AE')),
                                                                placeholder: 'Election End Date',
                                                                id:"election-end-date",
                                                                className:"datetime-input"
                                                            }
                                                        }
                                                    isValidDate={ this.isDateValid.bind(this) }
                                                    className="datetime-picker"
                                                    onChange={(value)=>{
                                                        this.props.fieldChange("electionEndDate", Math.round((new Date(value)).getTime() / 1000));
                                                    }}
                                                    value={new Date(this.props.pollDetails.pollDetailsFields.electionEndDate * 1000)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="full-line"/>
                                    <div className="section-title">Participants</div>
                                    <div className="row">
                                        <div className="col-md-4 input-container" title="Those who can view and participate in this poll">
                                            <SelectBox 
                                                id="visibility" 
                                                label="Visibility*" 
                                                selectedValue = {this.props.pollDetails.pollDetailsFields.visibility}
                                                selectArray={this.props.pollDetails.clubsList || []}
                                                onSelect={this.handleSelect('visibility')}/>
                                        </div>
                                    </div>
                                    {
                                        (this.validatePollStatus('WN')) &&
                                            <div>
                                                <hr className="full-line"/>
                                                <div className="section-title">Nominees</div>
                                                <div className="row">
                                                    <div className="col-md-12 nominees-container">
                                                        {nomineesList}
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                    {
                                        (this.props.pollDetails.pollDetailsFields.electionStatus == "Election over" &&
                                            this.props.pollDetails.pollDetailsFields.winner) &&
                                            <div>
                                                <hr className="full-line"/>
                                                <div className="section-title">Votes</div>
                                                <div className="row">
                                                    <div className="col-md-12 winner-container">
                                                        {voteStatus}
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className="floating-bottom-control">
                                    {
                                    (Util.hasPrivilage(PRIVILEGE_UPDATE_POLL) || 
                                        this.props.pollDetails.pollDetailsFields.electionStatus != 'Election Over') ?
                                        <div>
                                            <Button
                                                    onClick = {this.onCancel.bind(this)}
                                            >
                                            Cancel
                                            </Button>
                                            {
                                                (this.state.pollUpdate) ? (
                                                    <Button
                                                        onClick = {this.onSubmitCreate.bind(this)}
                                                        color="primary">
                                                        Create
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick = {this.onSubmitUpdate.bind(this)}
                                                        color="primary">
                                                        Update
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    :
                                    !Util.hasPrivilage(PRIVILEGE_UPDATE_POLL) &&
                                        <div>
                                            <Button
                                                    onClick = {this.onCancel.bind(this)}
                                            >
                                            OK
                                            </Button>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    handleChange = name => event => {
        this.props.fieldChange(name, event.target.value);
    };

    handleSelect = name => value => {
        this.props.fieldChange(name, value);
    }

    onCancel() {
        this.props.history.push("/admin/polls");        
    }

    isDateValid = function( current ){
        return current.isAfter( this.yesterday );
    };

    validatePollStatus(statusCode) {
        let statusArray = [];
        switch (statusCode) {
            case 'BN':
                statusArray = ['Nomination not started'];
                break;
            case 'WN':
                statusArray = ['Nomination is active', 'Nomination over', 'Election not started', 'Election is active', 'Election over'];
                break;
            case 'AN':
                statusArray = ['Nomination over', 'Election not started', 'Election is active', 'Election over'];
                break;
            case 'BE':
                statusArray = ['Election not started', 'Election is active', 'Election over'];
                break;
            case 'WE':
                statusArray = ['Election is active', 'Election over'];
                break;
            case 'AE':
                statusArray = ['Election over'];
                break;
            default:
                statusArray = [];
                break;
        }
        return statusArray.includes(this.props.pollDetails.pollDetailsFields.electionStatus)
    }

    isFormValid(){
        const fieldValues = this.props.pollDetails.pollDetailsFields;
        if(
            !fieldValues.title || 
            !fieldValues.description ||
            !fieldValues.nominationStartDate ||
            !fieldValues.nominationEndDate ||
            !fieldValues.electionStartDate ||
            !fieldValues.electionEndDate ||
            !fieldValues.visibility
        ){
            return false;
        }
        return true;
    }

    getPollDetails(pollId) {
        PollDetailService.getPoll(pollId).
        then((data) => {
            this.props.loadPollDetails(this.getPollMeta(data));      
        }).
        catch ((error) => {
            riverToast.show(error.status_message);
        })
    }

    getPollMeta(poll){
        return {
            title: poll.title,
            description: poll.description,
            nominationStartDate: poll.nominationStartDate/1000,
            nominationEndDate: poll.nominationEndDate/1000,
            electionStartDate: poll.electionStartDate/1000,
            electionEndDate: poll.electionEndDate/1000,
            nominees: poll.nominees,
            electionStatus: poll.electionStatus,
            winner: poll.winner,
            visibility: poll.visibility,
            totalVotes: poll.totalVotes
        }
    }

    getParticipantsList() {
        PollDetailService.getClubsList()
        .then((data) => {
            this.props.changeClubList(this.getClubNameListMeta(data));
        })
        .catch((error) => {
            riverToast.show("Something went wrong while getting club names.");
        });
    }

    getClubNameListMeta(clubsList) {
        let resultList = []

        if(clubsList.length != 0){
            resultList = Object.keys(clubsList).map(key =>
                 { return {"title": clubsList[key], "value": "@club_" + key} }
            );
        }

        if(resultList.length != 0){
            resultList.unshift(
                {
                    title: "All",
                    value: "@all"
                }
            );
        }
        
        return resultList;
    }

    getStringToDate(dateString) {
        let timestamp = "";
        if (dateString) {
            timestamp = new Date(dateString).getTime();
        }

        return timestamp
    }

    onSubmitCreate() {
        if(this.isFormValid()) {
            const poll = {
                "title": this.props.pollDetails.pollDetailsFields.title,
                "description": this.props.pollDetails.pollDetailsFields.description,
                "nominationStartDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.nominationStartDate * 1000),
                "nominationEndDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.nominationEndDate * 1000),
                "electionStartDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.electionStartDate * 1000),
                "electionEndDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.electionEndDate * 1000),
                "visibility": this.props.pollDetails.pollDetailsFields.visibility
            };

            PollDetailService.createPoll(poll).
            then( (data) => {
                this.props.clearFields();
                this.props.history.push("/admin/polls");
                riverToast.show("Poll created successfully");
            }).
            catch( (error) => {
                riverToast.show(error.status_message);              
            });
        } else {
            riverToast.show("Please fill all fields");                            
        }
    }

    onSubmitUpdate() {
        if(this.isFormValid()) {
            const poll = {
                "title": this.props.pollDetails.pollDetailsFields.title,
                "description": this.props.pollDetails.pollDetailsFields.description,
                "nominationStartDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.nominationStartDate * 1000),
                "nominationEndDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.nominationEndDate * 1000),
                "electionStartDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.electionStartDate * 1000),
                "electionEndDate": this.getStringToDate(this.props.pollDetails.pollDetailsFields.electionEndDate * 1000),
                "visibility": this.props.pollDetails.pollDetailsFields.visibility
            };

            PollDetailService.updatePoll(poll, this.props.match.params.pollId).
            then( (data) => {
                this.props.clearFields();
                this.props.history.push("/admin/polls");
                riverToast.show("Poll updated successfully");
            }).
            catch( (error) => {
                riverToast.show(error.status_message);                
            });
        } else {
            riverToast.show("Please fill all fields");                            
        }
    }
   
}

export default connect(mapStateToProps, mapDispatchToProps)(PollDetail);