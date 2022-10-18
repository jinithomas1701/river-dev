import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import { riverToast } from '../../../Common/Toast/Toast';
import './FinanceTeamDeescalateDialog.scss';
import { Util } from '../../../../Util/util';

const classes = Util.overrideCommonDialogClasses();

class FinanceTeamDeescalateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ""
        }
    }

    render() {
        return (
            <Dialog className="deescalate-transaction-dialog-wrapper" classes={classes} open={this.props.isDialogOpen} size="md" onRequestClose={this.handleCancel}>
                <DialogTitle className="header">Clarify Transaction Request</DialogTitle>
                <DialogContent className="content">
                    {
                        this.props.transaction && typeof this.props.transaction === 'object' &&
                        <div className="transaction-teaser">
                            <p>You can request the assignee to provide additional information if you need more clarification on this transaction. Please ask your query below.</p>
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
                                        <td>Spent Amount:</td>
                                        <td className="transaction-value">{this.props.transaction.amountType} {this.props.transaction.spent}</td>
                                    </tr>
                                    <tr>
                                        <td>Balance In-hand:</td>
                                        <td className="transaction-value">{this.props.transaction.amountType} {this.props.transaction.unSpent}</td>
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
                        children="Clarify"
                        onClick={this.handleDeescalateSubmit}
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

    handleDeescalateSubmit = () => {
        let request = {
            comment: this.state.comment
        }
        const isValid = this.validateForm(request);
        if (!isValid) {
            return;
        }
        this.props.deescalateTransactionHandler(this.props.transaction.referenceCode, request)
            .then(() => {
                this.handleCancel();
            }
            )
            .catch();
    }
}

export default FinanceTeamDeescalateDialog;