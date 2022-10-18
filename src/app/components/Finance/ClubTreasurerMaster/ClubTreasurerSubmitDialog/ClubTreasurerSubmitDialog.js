import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import AttachmentInput from '../../../Common/AttachmentInput/AttachmentInput';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import TextField from 'material-ui/TextField';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import { riverToast } from '../../../Common/Toast/Toast';
import './ClubTreasurerSubmitDialog.scss';
import { Util } from '../../../../Util/util';

const classes = Util.overrideCommonDialogClasses();

class ClubTreasurerSubmitDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receiptAmount: "",
            billAmount: "",
            attachments: []
        }
    }

    render() {
        return (
            <Dialog className="submit-bills-dialog-wrapper" classes={classes} open={this.props.isDialogOpen} size="md" onRequestClose={this.handleCancel}>
                <DialogTitle className="header">Submit Receipt</DialogTitle>
                <DialogContent className="content">
                    {
                        this.props.transaction && typeof this.props.transaction === 'object' &&
                        <div className="transaction-teaser">
                            <label>{this.props.transaction.title}</label>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Transaction Type:</td>
                                        <td className="transaction-value">{this.props.transaction.transactionType.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Budget Allotted:</td>
                                        <td className="transaction-value">{this.props.transaction.amountType} {this.props.transaction.amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }

                    <div className="row">
                        <div className="col-md-6">
                            <TextField
                                label="Total Cash in Receipt*"
                                name="receiptAmount"
                                className="input-text"
                                type="number"
                                value={this.state.receiptAmount}
                                onChange={this.handleTextChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                label="Balance Cash in Hand*"
                                name="unspentAmount"
                                className="input-text"
                                type="number"
                                value={this.state.unspentAmount}
                                onChange={this.handleTextChange}
                            />
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
                        onClick={this.handleCancel}
                    />
                    <LoadedButton
                        disabled={this.props.isLoading}
                        loading={this.props.isLoading}
                        className="btn-primary btn-create submit-bills-button-wrapper"
                        type={"button"}
                        children="Submit"
                        onClick={this.handleBillSubmit}
                    />
                </DialogActions>
            </Dialog>
        );
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
        if ((!Number.isNaN(Number(value))) && (Number(value) >= 0)) {
            this.setState({ [field]: value });
        }
        //this.setState({[field]: value});
    }

    handleCancel = () => {
        this.resetForm();
        this.props.cancelHandler();
    }

    resetForm() {
        this.setState({
            receiptAmount: "",
            unspentAmount: "",
            attachments: [],
        });
    }

    validateForm = (request) => {
        let isValid = true;
        if ((!request.spent && request.spent != 0) || request.spent < 0 || Number.isNaN(request.spent)) {
            isValid = false;
            riverToast.show("Please enter a valid receipt amount.");
        }
        else if ((!request.unSpent && request.unSpent != 0) || request.unSpent < 0 || Number.isNaN(request.unSpent)) {
            isValid = false;
            riverToast.show("Please enter a valid balance in-hand amount.");
        }
        else if ((Number(request.unSpent) + Number(request.spent)) != this.props.transaction.amount) {
            isValid = false;
            riverToast.show("Amount mismatch with the budget alloted. Please verify!!!");
        }
        else if (!request.attachments.length) {
            isValid = false;
            riverToast.show("Please add an attachment.");
        }

        return isValid;
    }

    handleBillSubmit = () => {
        let request = {
            spent: Number(this.state.receiptAmount),
            unSpent: Number(this.state.unspentAmount),
            attachments: this.state.attachments
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.submitHandler(this.props.transaction.referenceCode, request)
            .then(() => {
                this.handleCancel();
            }
            )
            .catch();
    }
}

export default ClubTreasurerSubmitDialog;