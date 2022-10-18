import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import TextField from 'material-ui/TextField';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import { riverToast } from '../../../Common/Toast/Toast';
import './CreateTransactionDialog.scss';
import { Util } from '../../../../Util/util';

const classes = Util.overrideCommonDialogClasses();

class CreateTransactionDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactionType: "",
            budgetAmount: "",
            title: "",
            description: "",
            attachments: []
        };

        this.transactionTypeList = this.getTransactionTypeList();
    }

    componentDidMount() {
        this.state = {
            transactionType: "",
            budgetAmount: "",
            title: "",
            description: "",
            attachments: []
        };
    }

    getTransactionTypeList = () => {
        return [
            { title: "MEETING ALLOWANCE", value: 'MA' },
            { title: "EVENT ALLOWANCE", value: 'EA' },
            { title: "OTHER ALLOWANCE", value: 'OA' }
        ];
    }


    handleAddAttachment = (file) => {
        const attachments = [...this.state.attachments];
        attachments.push(file);
        this.setState({ attachments: attachments });
    }

    handleDeleteAttachment = (file) => {
        let attachments = [...this.state.attachments];
        const index = attachments.findIndex(attachment => (attachment.name === file.name));
        if (index > -1) {
            attachments.splice(index, 1);
        }
        this.setState({ attachments });
    }

    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    handleTransactionTypeChange = (transactionType) => {
        this.setState({ transactionType: transactionType });
    }

    handleCloseButton = () => {
        this.resetForm();
        this.props.closeDialogHandler();
    }

    handleCreateTransactionButton = () => {
        let request = {
            title: this.state.title.trim(),
            description: this.state.description.trim(),
            amount: Number(this.state.budgetAmount),
            transactionType: this.state.transactionType,
            attachments: this.state.attachments
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.createTransactionHandler(request)
            .then(() => {
                this.handleCloseButton();
            }
            )
            .catch();
    }

    validateForm(request) {
        let isValid = true;
        if (!request.transactionType) {
            isValid = false;
            riverToast.show("Please select the Allowance type.");
        }
        else if (!request.title) {
            isValid = false;
            riverToast.show("Please add a title for this transaction.");
        }
        else if (request.title.length > 100) {
            isValid = false;
            riverToast.show("Title needs to be less than 100 characters");
        }
        else if (!Number.isInteger(request.amount)) {
            isValid = false;
            riverToast.show("Please do not use a decimal digit for Budget amount.");
        }
        else if (request.amount <= 0 || Number.isNaN(request.amount)) {
            isValid = false;
            riverToast.show("Please enter a valid Budget amount.");
        }
        else if (request.amount >= 100000000 || Number.isNaN(request.amount)) {
            isValid = false;
            riverToast.show("Exceeded allowance limit");
        }
        else if (!request.description) {
            isValid = false;
            riverToast.show("Please add a description.");
        }

        return isValid;
    }

    resetForm() {
        this.setState({
            transactionType: "",
            budgetAmount: "",
            title: "",
            description: "",
            attachments: [],
        });
    }

    render() {
        return (
            <Dialog className="create-transaction-dialog-wrapper" classes={classes} open={this.props.isDialogOpen} size="md" onRequestClose={this.handleCloseButton}>
                <DialogTitle className="header">Create Transaction</DialogTitle>
                <DialogContent className="content">
                    <div className="row">
                        <div className="col-md-6">
                            <SelectBox
                                label="Transaction Type*"
                                classes="input-select"
                                disableSysClasses
                                selectedValue={this.state.transactionType}
                                selectArray={this.transactionTypeList}
                                onSelect={this.handleTransactionTypeChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                label="Budget Amount*"
                                name="budgetAmount"
                                className="input-text"
                                type="number"
                                value={this.state.budgetAmount}
                                onChange={this.handleTextChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <TextField
                                label="Title*"
                                name="title"
                                className="input-text"
                                value={this.state.title}
                                onChange={this.handleTextChange}
                                autoFocus={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <TextField
                                multiline={true}
                                rowsMax={4}
                                label="Description*"
                                name="description"
                                className="input-text"
                                value={this.state.description}
                                onChange={this.handleTextChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <p className="note"><strong>*NOTE</strong>:-  The allowance amount to be credited will be considered according to your balance in-hand amount.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <FieldHeader title="Attachments" />
                            <AttachmentInput
                                editable={true}
                                attachments={this.state.attachments}
                                onAddAttachment={this.handleAddAttachment}
                                onDeleteAttachment={this.handleDeleteAttachment}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton
                        disabled={this.props.isLoading}
                        className="btn-default btn-cancel"
                        type={"button"}
                        children="Cancel"
                        onClick={this.handleCloseButton}
                    />
                    <LoadedButton
                        disabled={this.props.isLoading}
                        loading={this.props.isLoading}
                        className="btn-primary btn-create create-transaction-button-wrapper"
                        type={"button"}
                        children="Create"
                        onClick={this.handleCreateTransactionButton}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

CreateTransactionDialog.defaultProps = {
    isDialogOpen: false
};

CreateTransactionDialog.propTypes = {
    isDialogOpen: PropTypes.bool,
    closeDialogHandler: PropTypes.func,
    createTransactionHandler: PropTypes.func
};

export default CreateTransactionDialog;