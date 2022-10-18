/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

class NominateDialog extends React.Component {

    render() {
        return (
            <div>
                <Dialog open={this.props.open} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>{"Confirm nominating yourself for this poll"}</DialogTitle>
                    <DialogContent>
                        {this.props.description}
                        <DialogContentText>
                            You cant undo after nominating.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.confirmNomination} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    confirmNomination = () => {
        this.props.confirmNominateCallBack();
    };

    handleRequestClose = () => {
        this.props.closeDialogCallback("Nominate");
    };

}

export default NominateDialog;