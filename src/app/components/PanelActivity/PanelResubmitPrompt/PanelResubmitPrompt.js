import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';

// custom component
import { Util } from "../../../Util/util";
import { SelectBox } from '../../Common/SelectBox/SelectBox';
// css
import "./PanelResubmitPrompt.scss";
import { riverToast } from '../../Common/Toast/Toast';

const ROLE_PRESIDENT = 'PR';
const ROLE_USER = 'US';


class PanelResubmitPrompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reassignTo: ""
        };
        this.assigneeList = [
            {
                title: "President",
                value: ROLE_PRESIDENT
            }, {
                title: "Assignee",
                value: ROLE_USER
            }
        ];
    }

    render = () => {
        const props = this.props;
        const state = this.state;
        const activity = props.activity;

        return (
            <Dialog
                open={this.props.open}
                maxWidth="md"
                className="panel-activityresubmit-wrapper"
            >
                <DialogTitle>Reassign Activity</DialogTitle>
                <DialogContent>
                    <section className="resubmit-activity-wrapper">
                        <p>Select who this activity resubmits to.</p>
                        <div className="row">
                            <div className="col-md-10">
                                <SelectBox
                                    label="Select Level"
                                    classes="input-select"
                                    selectedValue={state.reassignTo}
                                    selectArray={this.assigneeList}
                                    onSelect={this.handleAssigneeChange}
                                />
                            </div>
                        </div>
                    </section>
                </DialogContent>
                <DialogActions>
                    <Button className="btn-default" onClick={props.onCancel}>Cancel</Button>
                    <Button className="btn-complimentary" onClick={this.handleSubmit}>Reassign</Button>
                </DialogActions>
            </Dialog>
        );
    };

    validateForm = (request) => {
        let isValid = !!request.reAssignTo;
        if (!isValid) {
            riverToast.show("Please select an assignee");
        }
        return isValid;
    };

    handleAssigneeChange = (reAssignTo) => {
        this.setState({reAssignTo});
    };

    handleSubmit = () => {
        const props = this.props;
        const request = {
            reAssignTo: this.state.reAssignTo
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        props.onReassign(props.activity.id, request);
    };
}

PanelResubmitPrompt.defaultProps = {
    PanelResubmitPrompt: null
};

PanelResubmitPrompt.propTypes = {
    open: PropTypes.bool.isRequired,
    activity: PropTypes.object,
    onReassign: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default PanelResubmitPrompt;