import React from 'react';
import Dialog, {
    DialogContent,
    DialogContentText,
} from 'material-ui/Dialog';

import "./ImageDialog.scss";

class ImageDialog extends React.Component {
    state = {}

    render() {

        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                id="image-dialog"
            >
                <DialogContent
                    id="image-dialog-content"
                >
                    <img src={this.props.imageSrc} alt="no image selected"/>
                </DialogContent>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestCloseImageDialog();
    }
}

export default ImageDialog;