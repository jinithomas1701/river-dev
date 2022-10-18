import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Datetime from 'react-datetime';

import ClubButton from '../../Common/ClubButton/ClubButton';
import ClubSelect from '../../Common/ClubSelect/ClubSelect';
import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import { SelfAssignUserChipMultiSelect } from '../../Common/SelfAssignUserChipMultiSelect/SelfAssignUserChipMultiSelect';
import SelfAssignActivityTileService from './SelfAssignActivityTile.service';

import './SelfAssignActivityTile.scss';
import index from 'react-dock';
import { riverToast } from '../../Common/Toast/Toast';
import { nominalTypeHack } from 'prop-types';

export default class SelfAssignActivityTile extends Component {
    constructor(props){
        super(props);
        this.state = {
            isTitleFieldVisible: false,
            isDescFieldVisible: false,
            TitleAndDescFieldVisible:true,
            isTitleAndDescFieldVisible: true,
            isAssignFieldVisible: false,
            title: '',
            desc: '',
            assign:'',
            showSearchPreloader: false,
            resultChips: [],
            selectedChips: [],
            selectedCategory: '',
            claimPeriod: Math.round((new Date()).getTime() / 1000),
            multiplier: 1
        };
    }

    componentDidMount() {
        this.unique = moment().format("x");
        this.startDay = moment("20181001T000000");
        this.dateOptions = { 
            placeholder: 'Target Date',
            className: "datetime-input",
            id: `date${this.unique}`
        }
    }

    render() {
        const { masterActivity, activity } = this.props;
        const seletedAssignees = this.state.selectedChips.map((user, index) => {
            return <div className="assignee-chip" key={index}>
                <div className="head">
                    <Icon>check</Icon>
                </div>
                <div className="body">{user.name}</div>
                <div className="chip-action" onClick={() => this.onDeleteItem(user)}>
                    <Icon>cancel</Icon>
                </div>
            </div>
        });

        const maxNum = this.props.masterActivity.maximumNumberOfAssignees === -1? 100 : this.props.masterActivity.maximumNumberOfAssignees;

        return (
            <div className={"self-assign-activity-tile "+(this.props.className || '')}>
                <div className="self-assign-activity-close-button" style={{textAlign:"right",width:"100%"}} onClick={this.onSelfAssignActivityTileDelete.bind(this)}>
                    <Icon>cancel</Icon>
                </div>
                {/*this.state.TitleAndDescFieldVisible &&                
                    <div className="title-container">
                        <Button className="add-details-btn" onClick={() => {this.setState({"isTitleAndDescFieldVisible": true ,"TitleAndDescFieldVisible":false })}}>Customise TITLE and DESCRIPTION</Button>
                    </div>*/
                }
                {this.state.isTitleAndDescFieldVisible &&
                    <div className="TitleAndDescField" style={{width:"100%"}}>
                        <div className="title-container">
                            <input type="text" placeholder="Title" className="title-field"
                                value={this.state.title}
                                onChange = {(e) => {this.setState({title: e.target.value})}} />
                        </div>
                        <div className="desc-wrapper">
                            <textarea placeholder="Description" className="desc-field" value={this.state.desc} onChange={(e) => {this.setState({'desc': e.target.value})}}></textarea>
                        </div>
                    </div>
                }
                {/* {!this.state.isDescFieldVisible &&                
                    <div className="title-container">
                        <Button className="add-details-btn" onClick={() => {this.setState({"isDescFieldVisible": true})}}>ADD DESCRIPTION</Button>
                    </div>
                }
                {this.state.isDescFieldVisible &&
                    <div className="desc-wrapper">
                        <textarea placeholder="Description" className="desc-field" value={this.state.desc} onChange={(e) => {this.setState({'desc': e.target.value})}}></textarea>
                    </div>
                } */}
                <div className="select-container">
                    {masterActivity && masterActivity.categories && masterActivity.categories.length > 0 && masterActivity.activityRatingType !== 'S' ?
                        <ClubSelect labelText={masterActivity.categoryLabel} placeholder="Select category" source={this.normalizeForClubSelect(masterActivity.categories)} onSelect={(value) => {
                                this.setState({selectedCategory: value});
                            }}/>:''
                    }
                    {/* <SelectBox 
                        id="activity-cat-select" 
                        label="Category"
                        selectedValue=''
                        selectArray={[{title: 'demo', value: 'demo'}, {title: 'demo', value: 'demo'}, {title: 'demo', value: 'demo'}]}
                        onSelect={() => {}}
                    /> */}
                </div>
                {!this.state.isAssignFieldVisible &&                
                    <div className="assign-container">
                        <Button className="add-assign-btn" onClick={() => {this.setState({"isAssignFieldVisible": true})}}>ADD MORE ASSIGNEES</Button>
                    </div>
                }
                {/* {

                   <div className="assignee-input">
                        <div className="upload-btn-wrapper">
                            <button className="btn">Attachment<Icon>attach_file</Icon></button>
                            <input type="file" name="myfile" />
                        </div>
                    </div>
                } */}
                {this.state.isAssignFieldVisible &&
                    <div className="assign-container">
                        <div className="assignees-wrapper">
                            <SelfAssignUserChipMultiSelect
                                fullWidth={true}
                                isIconEnabled={false}
                                customStyle={{width: '100%'}}
                                showPreloader={this.state.showSearchPreloader}
                                placeholder="Additional Assignees"
                                onTextChange={this.onAssigneesSearch.bind(this)}
                                resultChips={this.state.resultChips}
                                selectedChips={[]}
                                onItemSelect={this.onUserSearchItemSelect.bind(this)}
                                onDeleteChip={this.onDeleteItem.bind(this)}/>
                            <div className="chip-container">
                                {seletedAssignees}
                            </div>
                        </div>
                    </div>
                }
                {
                    (masterActivity.hasMultiplier) && <div className="multiplier-control-wrapper">
                            <label className="label" htmlFor={`activity${masterActivity.id}`}>Multipler</label>
                            <div className="control">
                                <Button className="btn" onClick={this.changeMultiplier.bind(this, "subtract")} disabled={this.state.multiplier <= 1} raised><Icon>remove</Icon></Button>
                                <input id={`activity${masterActivity.id}`} className="textbox" name="multiplier" value={this.state.multiplier} onChange={this.handleMultiplierChange.bind(this)} pattern="[0-9]+" />
                                <Button className="btn" onClick={this.changeMultiplier.bind(this, "add")} raised><Icon>add</Icon></Button>
                            </div>
                        </div>
                }
                <div className="activity-date" title="Date/Period on which the activity is actually happened">
                    <div className="label">Claim period</div>
                    <Datetime
                        defaultValue={moment()}
                        isValidDate={this.isDateValid.bind(this)}
                        dateFormat="YYYY-MM"
                        timeFormat={false}
                        inputProps={this.dateOptions}
                        onChange={this.onClaimPeriodChange.bind(this)}
                        value={new Date(this.state.claimPeriod * 1000)}
                        />
                    <label className="datelable" htmlFor={`date${this.unique}`}><Icon>calendar_today</Icon></label>
                </div>
                <div className="action-container">
                    <ClubButton className="action-btn" title="ASSIGN" color="#4E4E4F" textColor="#FFFFFF" onClick={this.onAssignActivity.bind(this)}/>
                </div>
            </div>
        );
    }

    isDateValid( current ){
        const nextMonth = moment().add(1, "month").startOf("month");
        return (current.isAfter(this.startDay) && current.isBefore(nextMonth));
    };

    onClaimPeriodChange(value){
        this.setState({claimPeriod: Math.round((new Date(value)).getTime() / 1000)});
    }

    normalizeForClubSelect(apiArray=[]) {
        const normalizedArray = [];
        if(apiArray==null || apiArray == 'undefined'){
            return [];
        }
        apiArray.forEach((cat, index) => {
            normalizedArray.push({
                label: cat.label,
                value: cat.code
            });
        });

        return normalizedArray;
    }
    onSelfAssignActivityTileDelete(){
        this.props.onClose();
    }
    onAssigneesSearch(query) {
        const { masterActivity } = this.props;
        if (query && query.length >= 3) {
            SelfAssignActivityTileService.searchAssignees(masterActivity.id, query)
                .then(data => {
                this.setState({resultChips: data});
            })
                .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while searching assignees');
            });
        }
        else if(!query || query.length < 3){
            //this.setState({resultChips: [], showSearchPreloader: false});
            this.setState({resultChips: []});
        }

    }

    onUserSearchItemSelect(item) {
        const selectedUsers = this.state.selectedChips;
        let isChipExists = false;
        this.setState({resultChips: []});
        selectedUsers.forEach((element) => {
            if (element.email === item.email) {
                isChipExists = true;
            }
        }, this);

        if (!isChipExists) {
            selectedUsers.push(item);
            this.setState({selectedChips: selectedUsers});
        }
    }

    onDeleteItem(item) {
        if (item) {
            const selectedUsers = this.state.selectedChips;
            this.state.selectedChips.forEach((element, index) => {
                if (element.email === item.email) {
                    selectedUsers.splice(index, 1);
                }
            }, this);
            this.setState({selectedChips: selectedUsers});
        }
    }

    getEmailOfAssignees(users) {
        const emailList = [];
        if (users && users.length > 0) {
            users.forEach((user, index) => {
                emailList.push(user.email);
            });
        }

        return emailList;
    }

    onAssignActivity() {
        const {masterActivity, activity} = this.props;
        //const newdate = this.state.claimPeriod*1000 + (2*24*60*60*1000);
        const newdate = (moment(this.state.claimPeriod*1000).startOf("month").add(2, "days"));

        const request = {
            "title": this.state.title,
            "description": this.state.desc,
            "category": this.state.selectedCategory,
            "assignees": this.getEmailOfAssignees(this.state.selectedChips),
            "claimPeriod": newdate
        };

        if(masterActivity.hasMultiplier){
            request.multiplier = this.state.multiplier;
        }
        if(!moment(this.state.claimPeriod).isValid()){
            riverToast.show('Please select a time period');
            return;
        }
        SelfAssignActivityTileService.createAssignedActivityFromMaster(request, masterActivity.id)
            .then(data => {
            this.props.onSuccess(data);
        })
            .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || "Something went wrong while assigning activity");
        });
    }

    handleMultiplierChange(event){
        let multiplier = isNaN(parseInt(event.target.value))? 1 : parseInt(event.target.value);
        multiplier = multiplier || 1;
        const name = event.target.name;
        this.setState({multiplier});
    }

    changeMultiplier(operation){
        let multiplier = parseInt(this.state.multiplier, 10);
        (operation === "add")? multiplier++ : multiplier--;
        this.setState({multiplier});
    }
}