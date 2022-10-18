import React from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { Toast, riverToast } from '../../../Common/Toast/Toast';
import { PointsService } from "../Points.service";


class PasswordDialog extends React.Component {
    state = {
        passwordValue: ""
    }

    render() {

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                className="actions-dialog-container"
            >
                <DialogTitle>Password</DialogTitle>
                <DialogContent className="custom-scroll">
                    <TextField type="password" onChange={(e) => {
                        this.setState({passwordValue: e.target.value});    
                    }}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        CANCEL
                    </Button>
                    <Button onClick={this.onPostPoint.bind(this)} color="primary">
                        SUBMIT
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestClosePassword();
    }

    onPostPoint() {
        if (this.state.passwordValue) {
            const pointRequest = this.props.pointRequest;
            pointRequest.cred = this.state.passwordValue;
            PointsService.pointUpdate(this.props.pointRequest)
                .then(data => {
                    riverToast.show("Point has updated successfully");
                    this.props.onRequestClosePassword(true);
                })
                .catch(error => {
                    this.props.onRequestClosePassword();
                    riverToast.show(error.status_message || "Something went wrong while updating points");

                });
        } else {
            riverToast.show("Please enter password");
        }
        
    }
}

export default PasswordDialog;