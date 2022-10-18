import React, { Component } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';
import './ClubTreasurerDeleteDialog.scss';
import { Util } from '../../../../Util/util';

const classes = Util.overrideCommonDialogClasses();

class ClubTreasurerDeleteDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog className="delete-transaction-dialog-wrapper" classes={classes} open={this.props.isDialogOpen} size="md" onRequestClose={this.handleCancel}>
                <DialogTitle className="header">Delete Transaction</DialogTitle>
                <DialogContent className="content">
                    {
                        this.props.transaction && typeof this.props.transaction === 'object' &&
                        <div className="transaction-teaser">
                            <label>Are you sure to delete this transaction?</label>
                        </div>
                    }
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
                        className="btn-complimentary"
                        type={"button"}
                        children="Delete"
                        onClick={this.handleDeleteSubmit}
                    />
                </DialogActions>
            </Dialog>
        );
    }

    handleCancel = () => {
        this.props.cancelHandler();
    }

    handleDeleteSubmit = () => {
        this.props.deleteTransactionHandler(this.props.transaction.referenceCode)
            .then(() => {
                this.handleCancel();
            }
            )
            .catch();
    }
}

export default ClubTreasurerDeleteDialog;