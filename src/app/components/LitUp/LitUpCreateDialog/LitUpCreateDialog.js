import React, { Component } from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

// css
import './LitUpCreateDialog.scss';

// service layer
import { LitUpService } from "../LitUp.service";
import { riverToast } from '../../Common/Toast/Toast';


class LitUpCreateDialog extends Component {

    state = {
        topic: ""
    }

    render() {
        return (
            <Dialog open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="create-litup-topic-dialog-container">
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogContent>
                    <div className="content-container">
                        <div className="input-container">
                            <TextField
                                multiline
                                id="topic"
                                label="Topic"
                                className="text-field"
                                value={this.state.topic}
                                onChange={this.handleChange('topic')}
                                margin="normal"
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                        <Button
                            disabled = {(!this.state.topic) ? true: false}
                            onClick={this.onSubmit.bind(this)}
                            color="primary"
                        >
                            Submit
                        </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.setState({ topic : "" });
        this.props.onRequestClose();
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    onSubmit() {
        if (this.state.topic) {
            const topicObj = {
                "title":this.state.topic,/*Mandatory field*/
                "description":""
            };
    
            LitUpService.createTopic(topicObj)
            .then(data => {
                riverToast.show("Successfully created topic");
                this.handleRequestClose();
                location.reload(); 
            })
            .catch(error => {
                riverToast.show( error.status_message || "Something went wrong while creating topic");
            });
        } else {
            riverToast.show("Please enter a topic");
        }
        
    }
}

export default LitUpCreateDialog;