import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import { riverToast } from '../../../Common/Toast/Toast';
import './FinanceTeamApproveDialog.scss';
import { Util } from '../../../../Util/util';

const classes = Util.overrideCommonDialogClasses();

class FinanceTeamApproveDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ""
        }
    }

    render() {
        return (
            <Dialog className="approve-transaction-dialog-wrapper" classes={classes} open={this.props.isDialogOpen} size="md" onRequestClose={this.handleCancel}>
                <DialogTitle className="header">Approve Transaction</DialogTitle>
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
                                        <td>Requested Budget:</td>
                                        <td className="transaction-value">{this.props.transaction.amountType} {this.props.transaction.amount}</td>
                                    </tr>
                                    <tr>
                                        <td>Required to pay:</td>
                                        <td className="transaction-value">{this.props.transaction.amountType} {this.props.transaction.requiredAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }

                    <div className="row">
                        <div className="col-md-12">
                            <TextField
                                label="Comments*"
                                name="comment"
                                className="input-text"
                                value={this.state.comment}
                                onChange={this.handleTextChange}
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
                        children="Approve"
                        onClick={this.handleApproveSubmit}
                    />
                </DialogActions>
            </Dialog>
        );
    }

    handleTextChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        this.setState({ [field]: value });
    }

    handleCancel = () => {
        this.resetForm();
        this.props.cancelHandler();
    }

    resetForm() {
        this.setState({
            comment: ""
        });
    }

    validateForm = (request) => {
        let isValid = true;
        if (request.comment.length === 0) {
            isValid = false;
            riverToast.show("Please add a comment.");
        }

        return isValid;
    }

    handleApproveSubmit = () => {
        let request = {
            comment: this.state.comment
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.approveTransactionHandler(this.props.transaction.referenceCode, request)
            .then(() => {
                this.handleCancel();
            }
            )
            .catch();
    }
}

export default FinanceTeamApproveDialog;