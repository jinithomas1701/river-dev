import React from "react";
import { render } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import {connect} from "react-redux";
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText, FormControlLabel  } from 'material-ui/Form';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import {SelectBox} from "../../../Common/SelectBox/SelectBox";

import { Toast, riverToast } from '../../../Common/Toast/Toast';
import {Util} from '../../../../Util/util';
import { loadCategoryList, fieldChange, clearFields, loadCouncilList, disableCouncilApprove } from "./ActivityMasterDetailDialog.actions";

import { ActivityMasterDetailDialogService } from "./ActivityMasterDetailDialog.service"
import "./ActivityMasterDetailDialog.scss";

import InfoIcon from "../../../Common/InfoIcon";


const mapStateToProps = (state) => {
    return {
        activityMasterDialog: state.ActivityMasterDetailDialogReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadCategoryList: (list) => {
            dispatch(loadCategoryList(list));
        },
        loadCouncilList: (list) => {
            dispatch(loadCouncilList(list));
        },
        fieldChange: (fieldName, value) => {
            dispatch(fieldChange(fieldName, value));
        },
        onDialogClose: () => {
            dispatch(clearFields());
        },
        disableCouncilApprove: (value) => {
            dispatch(disableCouncilApprove(value));
        }
    }
};

class ActivityMasterDetailDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.getCategoryList();
            this.getCouncilList();
            if(this.props.activityMaster){
                this.loadActivityMaster(this.props.activityMaster);
            }
        }
    }

    render() {

        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="activity-master-dialog-container">
                <DialogTitle>
                    {
                        this.props.activityMaster ?
                            "Edit Master"
                        :
                            "Create New"
                    }
                </DialogTitle>
                <DialogContent>
                    <div className="content-container">
                        <div className="detail-container">
                            <div className="input-wrapper">
                                <div className="input-field selectBox">
                                    <SelectBox 
                                        id="activity-cat-select" 
                                        label="Focus Area"
                                        selectedValue = {this.props.activityMasterDialog.detailFormFields.focusArea}
                                        selectArray={this.props.activityMasterDialog.activityMasterCategoryList}
                                        onSelect={this.handleSelect('focusArea')}/>
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <TextField
                                    id="title" 
                                    label="Title" 
                                    margin="normal"
                                    className="input-field"
                                    inputProps={{
                                        maxLength: 80,
                                      }}
                                    value= {this.props.activityMasterDialog.detailFormFields.title}
                                    onChange = {this.handleChange('title')}
                                />
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="input-wrapper w-full">
                                <TextField
                                    id="description" 
                                    label="Description" 
                                    margin="normal"
                                    multiline
                                    className="input-field w-full"
                                    value= {this.props.activityMasterDialog.detailFormFields.description}
                                    onChange = {this.handleChange('description')}
                                />
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="input-wrapper">
                                <TextField
                                    type="number"
                                    id="member-points"
                                    label="Member points"
                                    className="input-field"
                                    margin="normal"
                                    value= {this.props.activityMasterDialog.detailFormFields.memberPoint}
                                    onChange = {this.handleChange('memberPoint')}
                                />
                            </div>
                            <div className="input-wrapper">
                                <TextField
                                    type="number"
                                    id="club-points"
                                    label="Club points"
                                    className="input-field"
                                    margin="normal"
                                    value= {this.props.activityMasterDialog.detailFormFields.clubPoint}
                                    onChange = {this.handleChange('clubPoint')}
                                />
                            </div>
                        </div>
                        <div className="detail-container">
                            <div className="input-wrapper" style={{position:"relative"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="self-assign-checkbox"
                                            checked= {this.props.activityMasterDialog.detailFormFields.isSelfAssign}
                                            onClick={this.onClickCheckbox.bind(this, "isSelfAssign")}
                                        />
                                    }
                                    label="Self assignable"
                                />
                               <InfoIcon tooltip="act_mst_slf_assgn"/>
                            </div>
                            <div className="input-wrapper" style={{position:"relative"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="self-assign-checkbox"
                                            checked= {this.props.activityMasterDialog.detailFormFields.isRewards}
                                            onClick={this.onClickCheckbox.bind(this, "isRewards")}
                                        />
                                    }
                                    label="is Reward"
                                />
                                <InfoIcon tooltip="act_mst_rwrd"/>
                                
                            </div>
                        </div>
                        <div className="detail-container">
                            {/* <div className="input-wrapper" style={{position:"relative"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="self-assign-checkbox"
                                            disabled={this.props.activityMasterDialog.isCouncilApproveDisabled}
                                            checked= {this.props.activityMasterDialog.detailFormFields.isCouncilApprove}
                                            onClick={this.onClickCheckbox.bind(this, "isCouncilApprove")}
                                        />
                                    }
                                    label="Council approvable"
                                    />
                                <InfoIcon tooltip="act_mst_cncl_appr"/>
                                
                            </div> */}
                            <div className="input-wrapper">
                                <div className="input-field">
                                    <SelectBox 
                                        id="activity-cat-select" 
                                        label="Council"
                                        selectedValue = {this.props.activityMasterDialog.detailFormFields.council}
                                        selectArray={this.props.activityMasterDialog.activityMasterCouncilList || []}
                                        onSelect={this.handleSelect('council')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Cancel
                    </Button>
                    {
                        (this.props.activityMaster) ? (
                            <Button onClick={this.onUpdate.bind(this)} color="primary">
                                Update
                            </Button>
                        ) : (
                            <Button onClick={this.onSubmit.bind(this)} color="primary">
                                Submit
                            </Button>
                        )
                    }
                </DialogActions>
            </Dialog>
        );
    }

    handleChange = name => event => {
        this.props.fieldChange(name, event.target.value);
    };

    handleSelect = name => value => {
        this.props.fieldChange(name, value);
    }

    handleRequestClose() {
        this.props.onRequestClose(false)
        this.props.onDialogClose();
    }

    onClickCheckbox(fieldName, event) {
        if (fieldName === "isRewards") {
            if (event.target.checked) {
                this.props.fieldChange("isCouncilApprove", event.target.checked);
                this.props.disableCouncilApprove(true);            
            } else {
                this.props.disableCouncilApprove(false);
            }
            
            
        }
        this.props.fieldChange(fieldName, event.target.checked)
    }

    getCategoryList() {
        ActivityMasterDetailDialogService.getActivityCategoryList()
        .then((data) => {
            const catList = this.generateCategorySelectList(data);
            this.props.loadCategoryList(catList);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching categories")
        });
    }

    getCouncilList() {
        ActivityMasterDetailDialogService.getActivityCouncilList()
        .then((data) => {
            const councilList = this.generateCouncilSelectList(data);
            this.props.loadCouncilList(councilList);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching councils")
        });
    }

    generateCategorySelectList(list) {
        return list.map(item => {
            return {
                title: item.title,
                value: item.code
            };
        });
    }

    generateCouncilSelectList(list) {
        return list.map(item => {
            return {
                title: item.name,
                value: item.username
            };
        });
    }

    loadActivityMaster(activityMaster) {
        this.props.fieldChange("isSelfAssign", activityMaster.isSelfAssign);
        this.props.fieldChange("isRewards", activityMaster.isRewards);
        this.props.fieldChange("council", (activityMaster.council) ? activityMaster.council.username : "");
        this.props.fieldChange("description", activityMaster.description);
        this.props.fieldChange("isCouncilApprove", activityMaster.isCouncilApprove);
        this.props.fieldChange("focusArea", (activityMaster.focusArea) ? activityMaster.focusArea.code : "");
        this.props.fieldChange("title", activityMaster.title);
        this.props.fieldChange("memberPoint", activityMaster.memberPoint);
        this.props.fieldChange("clubPoint", activityMaster.clubPoint);
        this.props.fieldChange("id", activityMaster.id);
    }

    validateMaster() {
        let isValid = true;
        let msg = "";
        if (!this.props.activityMasterDialog.detailFormFields.focusArea) {
            msg = "Please select a focus area";
        } else if (!this.props.activityMasterDialog.detailFormFields.title) {
            msg = "Please enter a title";
        } else if (!this.props.activityMasterDialog.detailFormFields.council) {
            msg = "Please select a council";
        }
        

        if (msg) {
            isValid = false;
            riverToast.show(msg);
        }

        return isValid;
    }

    onSubmit() {
        if (this.validateMaster()) {
            const activityMasterObj = {
                title: this.props.activityMasterDialog.detailFormFields.title,
                description: this.props.activityMasterDialog.detailFormFields.description,
                focusArea: this.props.activityMasterDialog.detailFormFields.focusArea,
                clubPoint: this.props.activityMasterDialog.detailFormFields.clubPoint,
                memberPoint: this.props.activityMasterDialog.detailFormFields.memberPoint,
                isSelfAssign: this.props.activityMasterDialog.detailFormFields.isSelfAssign,
                isCouncilApprove: this.props.activityMasterDialog.detailFormFields.isCouncilApprove,
                council: this.props.activityMasterDialog.detailFormFields.council,
                isRewards: this.props.activityMasterDialog.detailFormFields.isRewards,
                year: Util.getCurrentFinancialYear()
            }
    
            ActivityMasterDetailDialogService.createActivityMaster(activityMasterObj)
            .then((data) => {
                riverToast.show("Successfully Created");
                this.handleRequestClose();
                this.props.onSuccess();
            })
            .catch((error) => {
                riverToast.show("Something went wrong while creating");            
            })
        }
    }

    onUpdate() {
        if (this.validateMaster()) {
            const activityMasterObj = {
                title: this.props.activityMasterDialog.detailFormFields.title,
                description: this.props.activityMasterDialog.detailFormFields.description, 
                focusArea: this.props.activityMasterDialog.detailFormFields.focusArea,
                clubPoint: this.props.activityMasterDialog.detailFormFields.clubPoint,
                memberPoint: this.props.activityMasterDialog.detailFormFields.memberPoint,
                isSelfAssign: this.props.activityMasterDialog.detailFormFields.isSelfAssign,
                isCouncilApprove: this.props.activityMasterDialog.detailFormFields.isCouncilApprove,
                council: this.props.activityMasterDialog.detailFormFields.council,
                isRewards: this.props.activityMasterDialog.detailFormFields.isRewards,
                year: Util.getCurrentFinancialYear()                
            }
    
            ActivityMasterDetailDialogService.updateActivityMaster(activityMasterObj, this.props.activityMasterDialog.detailFormFields.id)
            .then((data) => {
                riverToast.show("Successfully Updated");
                this.handleRequestClose();
                this.props.onSuccess();
            })
            .catch((error) => {
                riverToast.show("Something went wrong while updating");            
            })
        }
    }
}

  export default connect(mapStateToProps, mapDispatchToProps)(ActivityMasterDetailDialog);