import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';

// custom component
import { Util } from '../../../../Util/util';
import {SelectBox} from '../../../Common/SelectBox/SelectBox';
import { riverToast } from '../../../Common/Toast/Toast';

// css
import './VoiceForwardPrompt.scss';

const SUBMIT_FORWARD_ONLY ="F";
const SUBMIT_OPTOUT_ONLY ="O";
const SUBMIT_BOTH ="B";

class VoiceForwardPrompt extends Component{
    constructor(props){
        super(props);
        this.state = {
            forwardDepartments: undefined,
            commentText: "",
            optOut: undefined,
            optOutDepartment: undefined
        };

        this.panelIds = this.getPanelIds();

        this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
        this.handleOptOutChange = this.handleOptOutChange.bind(this);
        this.handleOptOutSelect = this.handleOptOutSelect.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render(){
        const props = this.props;
        const allDepartments = [{title: "Select", value: ""}, ...props.departmentList];
        const optOutList = this.getOptoutList(props.currentDepartments);
        const showForwardControl = this.state.optOut === SUBMIT_FORWARD_ONLY || this.state.optOut === SUBMIT_BOTH;
        const showOptoutControl = this.state.optOut === SUBMIT_OPTOUT_ONLY || this.state.optOut === SUBMIT_BOTH;

        return (
            <Dialog className="voiceforward-prompt-wrapper" open={props.open} size="md" onRequestClose={this.handleClose}>
                <DialogTitle className="header">Forward Voice</DialogTitle>
                <DialogContent className="content">
                    <p>If this voice seems more appropriate to be taken up by another function, you can forward it to them here.</p>
                    <div className="row">
                        <div className="col-md-12">
                            { this.getRadioGroupTemplate() }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            {
                                showForwardControl && <SelectBox
                                                          label="Function"
                                                          classes="input-forward"
                                                          disableSysClasses
                                                          selectedValue = {this.state.forwardDepartments}
                                                          selectArray={allDepartments}
                                                          onSelect={this.handleDepartmentChange}
                                                          />
                            }
                        </div>
                        <div className="col-md-6">
                            {
                                showOptoutControl && <SelectBox
                                                         label="OptOut from Function"
                                                         classes="input-optout"
                                                         disableSysClasses
                                                         selectedValue = {this.state.optOutDepartment}
                                                         selectArray={optOutList}
                                                         onSelect={this.handleOptOutSelect}
                                                         />
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <textarea
                                rows="4"
                                className="input-comment"
                                placeholder="Your Comment"
                                value={this.state.commentText}
                                onChange={this.handleCommentChange}
                                />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <Button className="btn-default btn-cancel" color="default" onClick={this.handleClose} raised>Cancel</Button>
                    <Button className="btn-primary btn-forward" color="primary" onClick={this.handleSubmit} raised>Forward</Button>
                </DialogActions>
            </Dialog>
        );
    }

    getPanelIds(){
        return Util.getLoggedInUserDetails().voiceDepartments.map(dept => dept.code);
    }

    getOptoutList(departments){
        const props = this.props;
        const panelIds = new Set(this.panelIds);
        const deptIds = new Set(departments.map(dept => dept.code));
        const intersectionIds = [...this.intersectDepartmentIds(panelIds, deptIds)];

        const newDepts = [];
        intersectionIds.forEach(dept => {
            const tempDept = props.departmentList.find(item => {
                return item.value === dept;
            });
            if(tempDept){
                newDepts.push(tempDept);
            }
        });

        return [{title: "Select", value: ""}, ...newDepts];
    }

    intersectDepartmentIds(setA, setB) {
        var _intersection = new Set();
        for (var elem of setB) {
            if (setA.has(elem)) {
                _intersection.add(elem);
            }
        }
        return _intersection;
    }

    getRadioGroupTemplate(){
        const template = <RadioGroup
                             row
                             value={this.state.optOut}
                             onChange={this.handleOptOutChange}
                             >
                  <FormControlLabel value={SUBMIT_FORWARD_ONLY} control={<Radio />} label="Forward" />
                  <FormControlLabel value={SUBMIT_OPTOUT_ONLY} control={<Radio />} label="Optout" />
                  <FormControlLabel value={SUBMIT_BOTH} control={<Radio />} label="Forward and Optout" />
              </RadioGroup>;
        return template;
    }

    handleDepartmentChange(deptCode){
        this.setState({forwardDepartments: deptCode});
    }

    handleOptOutChange(event){
        this.setState({optOut: event.target.value});
    }

    handleOptOutSelect(deptCode){
        this.setState({optOutDepartment: deptCode});
    }

    handleCommentChange(event){
        this.setState({commentText: event.target.value});
    }

    handleClose(){
        this.resetForm();
        this.props.onClose();
    }

    handleSubmit(){
        const optOut = this.state.optOut;
        let request = {
            comment: this.state.commentText,
        };
        request.forwardDepartments = optOut === SUBMIT_FORWARD_ONLY || optOut === SUBMIT_BOTH? [this.state.forwardDepartments] : [];
        request.optOutDepartments = optOut === SUBMIT_OPTOUT_ONLY || optOut === SUBMIT_BOTH? [this.state.optOutDepartment] : [];

        if(!this.validator(request, optOut)){
            return;
        }
        this.resetForm();
        this.props.onSubmit(request);
    }

    validator(request, optOut){
        let isValid = true;
        if(!request.comment.trim()){
            isValid = false;
            riverToast.show("Please add a reason for forwarding the voice.");
        }
        else if(!optOut){
            isValid = false;
            riverToast.show("Please select a forwading option");
        }
        else if(optOut === SUBMIT_FORWARD_ONLY && (request.forwardDepartments.length === 0 || !request.forwardDepartments[0])){
            isValid = false;
            riverToast.show("You haven't selected the forwarding function.");
        }
        else if(optOut === SUBMIT_OPTOUT_ONLY && (request.optOutDepartments.length === 0 || !request.optOutDepartments[0])){
            isValid = false;
            riverToast.show("You haven't selected optout functions.");
        }
        else if(optOut === SUBMIT_BOTH && (request.optOutDepartments.length === 0 || !request.optOutDepartments[0] || request.forwardDepartments.length === 0 || !request.forwardDepartments[0])){
            isValid = false;
            riverToast.show("You haven't selected forwarding and optingout function.");
        }

        return isValid;
    }

    resetForm(){
        this.setState({
            forwardDepartments: undefined,
            commentText: "",
            optOut: undefined,
            optOutDepartment: undefined
        });
    }
}

VoiceForwardPrompt.propTypes = {
    open: PropTypes.bool,
    currentDepartments: PropTypes.array,
    departmentList: PropTypes.array,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func
};

export default VoiceForwardPrompt;