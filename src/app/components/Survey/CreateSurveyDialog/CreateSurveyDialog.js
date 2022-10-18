import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import moment from 'moment';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import InfoIcon from "../../Common/InfoIcon";
import { UserChipMultiSelect } from '../../Common/UserChipMultiSelect/UserChipMultiSelect';
import Datetime from 'react-datetime';

// custom component
import {Util} from "../../../Util/util";
import OptionComponent from './OptionComponent/OptionComponent';

import {SurveyService} from "../Survey.service";
import {
            fieldChange,
            addNewOptionField,
            removeOption,
            changeOption,
            setUserSearchResult,
            clearField,
            setUsersSelectedResult,
            loadSurvey } from './CreateSurveyDialog.actions';

import './CreateSurveyDialog.scss';

const mapStateToProps = (state) => {
    return {
        surveyDetails: state.CreateSurveyDialogReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fieldChange: (fieldName, payload) => {
            dispatch(fieldChange(fieldName, payload))
        },
        addNewOptionField: () => {
            dispatch(addNewOptionField())
        },
        removeOption: (index) => {
            dispatch(removeOption(index))
        },
        changeOption: (index, value) => {
            dispatch(changeOption(index, value))
        },
        setUserSearchResult: (result) => {
            dispatch(setUserSearchResult(result))
        },
        clearField: () => {
            dispatch(clearField())
        },
        setUsersSelectedResult: (result) => {
            dispatch(setUsersSelectedResult(result))
        },
        loadSurvey: (survey) => {
            dispatch(loadSurvey(survey));
        }
    }
}

class CreateSurveyDialog extends React.Component {

    state = {
        showSearchPreloader: false
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            if(this.props.editMode) {
                this.loadSurvey(this.props.editSurvey);
            } else {
                this.props.clearField();
                this.props.fieldChange("endDate", Math.round((new Date()).getTime() / 1000));                
            }
        }
    }

    componentDidMount() {
    }

    dialogInit() {
        
    }

    yesterday = Datetime.moment().subtract(1, 'day');

    render() {

        const optionsList = this.props.surveyDetails.detailFormFields.options ? this.props.surveyDetails.detailFormFields.options.map((option, index) => {
            const value = this.props.surveyDetails.detailFormFields.options[index].value;
            return <OptionComponent
                        key = {index}
                        optionData = {
                            {
                                "index": index,
                                "value": value
                            }
                        }
                        disableRemove = {(this.props.surveyDetails.detailFormFields.options.length < 2) ? true : false}
                        handleOptionFieldCallback = {this.handleOptionChange.bind(this, index)}
                        handleremoveOptionField = {this.handleRemoveOption.bind(this)}
                    />
        }) : false;

        return ( 
			<Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="create-survey-dialog-container">
                <DialogTitle>Create A Survey</DialogTitle>
                <DialogContent>
                    <div className="content-container">
                        <div className="detail-container">
                            <div className="input-wrapper w-full">
                                <TextField
                                    id="title" 
                                    label="Title" 
                                    margin="normal"
                                    inputProps={{
                                        maxLength: 80,
                                      }}
                                    className="input-field w-full"
                                    value= {this.props.surveyDetails.detailFormFields.title}
                                    onChange = {this.handleFieldChange('title')}
                                />
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="input-wrapper w-full">
                                <TextField
                                    id="description" 
                                    label="Description" 
                                    margin="normal"
                                    className="input-field w-full"
                                    value= {this.props.surveyDetails.detailFormFields.description}
                                    onChange = {this.handleFieldChange('description')}
                                />
                            </div>
                        </div>
                        <div className="section-title">Options</div>
                        <div className="option-components">
                            {optionsList}
                            <div className="add-option-btn-container">
                                <Button
                                    raised
                                    color="primary"
                                    className="add-option-btn"
                                    onClick = {this.addOptionHandler.bind(this)}
                                >
                                    Add New Option
                                </Button>
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="input-wrapper w-half" style={{position:"relative"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="include-others-checkbox"
                                            checked= {this.props.surveyDetails.detailFormFields.includeOthers}
                                            onClick={this.onClickCheckbox.bind(this, "includeOthers")}
                                        />
                                    }
                                    label="Ask More Opinions"
                                />
                               <InfoIcon tooltip="crt_srvy_incld_othr"/>
                            </div>
                            <div className="input-wrapper w-half" style={{position:"relative"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="publish-result-checkbox"
                                            checked= {this.props.surveyDetails.detailFormFields.publishResult}
                                            onClick={this.onClickCheckbox.bind(this, "publishResult")}
                                        />
                                    }
                                    label="Publish Result Public"
                                />
                                <InfoIcon tooltip="crt_srvy_pblsh_rslt"/>
                                
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="input-wrapper w-half" style={{position:"relative"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="all-visibility-checkbox"
                                            checked= {this.props.surveyDetails.detailFormFields.visibleToAll}
                                            onClick={this.onClickCheckbox.bind(this, "visibleToAll")}
                                        />
                                    }
                                    label="Visible To All"
                                />
                                <InfoIcon tooltip="crt_srvy_vsble_all"/>
                                
                            </div>
                            <div className="input-wrapper w-half" style={{position:"relative"}}>
                                <div className="input-container">
                                    <div className="datetime-picker-wrapper">
                                        <label
                                            htmlFor="survey-end-date"
                                        >
                                            Survey End Date
                                        </label>
                                        <Datetime
                                            inputProps={
                                                    { 
                                                        placeholder: 'Survey Date',
                                                        id:"survey-end-date",
                                                        className:"datetime-input"
                                                    }
                                                }
                                            isValidDate={ this.isDateValid.bind(this) }
                                            className="datetime-picker"
                                            onChange={(value)=>{
                                                this.props.fieldChange("endDate", Math.round((new Date(value)).getTime() / 1000));
                                            }}
                                            value={new Date(this.props.surveyDetails.detailFormFields.endDate * 1000)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (!this.props.surveyDetails.detailFormFields.visibleToAll) &&
                                <div className="detail-container">
                                    <div className="w-full">
                                        <UserChipMultiSelect
                                            customStyle = {{width : "50%"}}
                                            showPreloader={this.state.showSearchPreloader}
                                            onTextChange={this.onInviteesSearch.bind(this)}
                                            resultChips={this.props.surveyDetails.chipSearchResult}
                                            selectedChips={this.props.surveyDetails.detailFormFields.visibility}
                                            onItemSelect={this.onUserSearchItemSelect.bind(this)}
                                            onDeleteChip={this.onDeleteItem.bind(this)}/>
                                    </div>
                                </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onSubmit.bind(this, true)} color="primary">
                        {
                            (this.props.editSurvey) ? (
                                "Update And Publish"
                            ) : (
                                "Create And Publish"
                            )
                        }
                    </Button>
                    <Button onClick={this.onSubmit.bind(this, false)} color="primary">
                        {
                            (this.props.editSurvey) ? (
                                "Update"
                            ) : (
                                "Create"
                            )
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleFieldChange = name => event => {
        this.props.fieldChange(name, event.target.value);
    };

    onClickCheckbox(fieldName, event) {
        this.props.fieldChange(fieldName, event.target.checked)
    }

    handleRequestClose() {
        this.props.onRequestClose(false);
    }

    handleTextChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    handleRemoveOption(index) {
        this.props.removeOption(index);
    }

    handleOptionChange(index, value) {
        this.props.changeOption(index, value)
    }

    addOptionHandler() {
        this.props.addNewOptionField();
    }

    loadSurvey(survey) {
        const surveyObj = {
            id: survey.id,
            title: survey.title,
            description: survey.description,
            options: survey.options,
            visibility: survey.visibility,
            includeOthers: survey.isOtherOptionPresent,
            publishResult: survey.publishResult || true,
            visibleToAll: survey.visibleToAll || false,
            endDate: survey.endDate/1000
        }

        this.props.loadSurvey(surveyObj);
    }

    onInviteesSearch(searchText) {
        if (searchText.length >= 3) {
            this.setState({showSearchPreloader: true});
            SurveyService.searchInvitees(searchText)
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

    onUserSearchItemSelect(item) {
        const selectedUsers = this.props.surveyDetails.detailFormFields.visibility;
        let isChipExists = false;
        this.props.setUserSearchResult([]);
        selectedUsers.forEach((element) => {
            if (element.id === item.id) {
                isChipExists = true;
            }
        }, this);

        if (!isChipExists) {
            selectedUsers.push(item);
            this.props.fieldChange("visibility", selectedUsers);
        }
    }

    onDeleteItem(item) {
        if (item) {
            const selectedUsers = this.props.surveyDetails.detailFormFields.visibility;
            this.props.surveyDetails.detailFormFields.visibility.forEach((element, index) => {
                if (element.id === item.id) {
                    selectedUsers.splice(index, 1);
                }
            }, this);
            this.props.fieldChange("visibility", selectedUsers);
        }
    }

    isFormValid(){
        if( !this.props.surveyDetails.detailFormFields.title ||
            !this.props.surveyDetails.detailFormFields.description 
        ){
            riverToast.show("Please fill Title and Description.");
            return false;
        } else if (this.props.surveyDetails.detailFormFields.options.length < 2 && 
                    !this.props.surveyDetails.detailFormFields.includeOthers) {
            riverToast.show("Please enter more than one options, or choose for Ask More Opinions.");
            return false;
        } else if (this.props.surveyDetails.detailFormFields.options.length >= 2
                    && !this.props.surveyDetails.detailFormFields.includeOthers) {
            let count = 0;

            this.props.surveyDetails.detailFormFields.options.forEach((option, index) => {
                if(option.value) {
                    count++;
                }
            });

            if(count < 2) {
                riverToast.show("Please enter more than one options, or choose for Ask More Opinions.");
                return false;
            }
        } else if(!this.props.surveyDetails.detailFormFields.visibleToAll &&
                    this.props.surveyDetails.detailFormFields.visibility.length < 1) {
            riverToast.show("No visibility set, nobody can view this survey");
            return false;
        } else if(!this.props.surveyDetails.detailFormFields.endDate) {
            riverToast.show("Please provide an end date");
            return false;
        }

        return true;
    }

    getStringToDate(dateString) {
        let timestamp = "";
        if (dateString) {
            timestamp = new Date(dateString).getTime();
        }

        return timestamp
    }

    getSurveyObject(surveyTempObj, doPublish) {
        const optionsList = surveyTempObj.options.filter(option => (option.value) ? option : false);
        const visibility = (surveyTempObj.visibleToAll) ? [{type: "ALL", id:""}] : surveyTempObj.visibility;

        return {
            "title": surveyTempObj.title,
            "description": surveyTempObj.description,
            "options": optionsList,
            "includeOthers": surveyTempObj.includeOthers,
            "publishResult": surveyTempObj.publishResult,
            "endDate": this.getStringToDate(surveyTempObj.endDate * 1000),
            "visibility": visibility,
            "doPublish": doPublish
        }
    }

    onSubmit(doPublish = false){
        if(this.isFormValid()) {
            const surveyObject = this.getSurveyObject(this.props.surveyDetails.detailFormFields, doPublish);
            if(!this.props.editMode){
                SurveyService.createSurvey(surveyObject)
                .then((data) => {
                    riverToast.show("Survey Created SuccessFully");
                    this.handleRequestClose();
                    this.props.onSuccess();
                })
                .catch((error) => {
                    riverToast.show(error.status_message || "Something went wrong while creating survey.");
                });
            } else {
                SurveyService.updateSurvey(surveyObject, this.props.editSurvey.id)
                .then((data) => {
                    riverToast.show("Survey Updated SuccessFully");
                    this.handleRequestClose();
                    this.props.onSuccess();
                })
                .catch((error) => {
                    riverToast.show(error.status_message || "Something went wrong while updating survey.");
                });
            }
        }
    }

    isDateValid = function( current ){
        return current.isAfter( this.yesterday );
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSurveyDialog);