import React, { Component } from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

// css
import "./SimpleListDialog.scss";

class SimpleListDialog extends Component {
    state = {

    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {

        }
    }

    render() {
        const list = this.props.list ? this.props.list.map((item, index) => {
            return <div className="simple-list-item" key={index}>{item}</div>
        }) : false;
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
            >
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>
                    <div className="simple-list-dialog-container">
                        {
                            (this.props.list && this.props.list.length > 0) ?
                                <div className="simple-list">
                                    {list}
                                </div>
                            :
                                <div>
                                    No Item In List
                                </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRequestClose.bind(this)} color="default">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestClose();
    }
}

export default SimpleListDialog;