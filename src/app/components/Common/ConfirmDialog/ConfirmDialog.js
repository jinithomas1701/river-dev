import React from "react";
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';

export const makeConfirmDialog = (conf) => {
    let dialog = new ConfirmDialog();
    return {
        show: () => {

        },
        hide: () => {

        }
    }
};
export class ConfirmDialog extends React.Component {

    render() {
        return (
            <Dialog
                ignoreBackdropClick
                ignoreEscapeKeyUp
                maxWidth="xs"
                open={this.props.open}
            >
            <DialogTitle>{this.props.title}</DialogTitle>
            <DialogContent>
                <p>{this.props.message}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleOk} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        )
    }

    handleCancel = () => {
        this.props.onRequestClose(false);
    };

    handleOk = () => {
        this.props.onRequestClose(true);
    };
}
