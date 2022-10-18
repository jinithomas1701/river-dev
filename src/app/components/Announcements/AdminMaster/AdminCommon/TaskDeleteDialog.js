import React, { Component } from 'react';
import { Button } from 'material-ui';
import { Dialog } from 'material-ui';
import { DialogTitle } from 'material-ui';
import { DialogContent } from 'material-ui';
import { Util } from "../../../../Util/util";
// CSS
import './TaskDeleteDialog.scss';
const classes = Util.overrideCommonDialogClasses();
class TaskDeleteDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const props = this.props;
        return (
            <Dialog classes={classes} className='task-delete-alert-wrap' size="md" open={props.open} onRequestClose={this.handleClose}>
                <DialogTitle className='header'>
                    <h5>Alert</h5>
                </DialogTitle>
                <DialogContent className='content'>
                    <div className='message'>
                        <p>Are you sure you have to delete the task</p>
                    </div>
                    <div className='sure-button'>
                        <Button className='btn-primary' onClick={this.handleAnnouncementTaskDelete}>SURE</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
    handleClose = () => {
        this.props.onClose();
    }
    handleAnnouncementTaskDelete = () => {
        this.props.handleAnnouncementTaskDelete
    }
}
export default TaskDeleteDialog