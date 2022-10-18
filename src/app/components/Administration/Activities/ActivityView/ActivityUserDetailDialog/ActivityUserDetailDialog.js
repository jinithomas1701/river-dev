import React from 'react';
import Dialog, {
    DialogContent,
    DialogContentText,
    DialogTitle 
} from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';

import { Util } from "../../../../../Util/util";

import "./ActivityUserDetailDialog.scss";

class ActivityUserDetailDialog extends React.Component {
    state = {
        imagePreview: false,
        imagePreviewSrc: ""
    }

    render() {
        const proofImages = (this.props.activityUserDetail.images) ? (
                                this.props.activityUserDetail.images.map((image, index) => {
                                    const imgSrc = Util.getFullImageUrl(image);
                                    return <div
                                            key={index}
                                            className="proof-images-thumb-container">
                                                <img className="proof-images-thumb" src={ imgSrc } onClick={this.onProofClick.bind(this, image)}/>
                                            </div>
                                })
                            ) : (
                                false
                            );
                            
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.handleRequestClose.bind(this)}
                id="activity-detail-dialog"
            >
                {
                    (this.props.activityUserDetail && this.props.activityUserDetail.userComment) &&
                        <DialogTitle id="activity-detail-dialog-title">{this.props.activityUserDetail.userComment}</DialogTitle>
                }
                <DialogContent
                    id="activity-detail-dialog-content"
                >
                    {
                        (this.props.activityUserDetail) ? (
                            <div className="detail">
                                {
                                    (!this.state.imagePreview) ? (
                                        <div className="proof-images">
                                            {proofImages}
                                        </div>
                                    ) : (
                                        <div className="image-preview">
                                            <div className="close-btn">
                                                <Icon onClick={this.onClosePreview.bind(this)}>highlight_off</Icon>
                                            </div>
                                            <img className="image-preview-image" src={Util.getFullImageUrl(this.state.imagePreviewSrc, false)} alt="No image Selected" />
                                        </div>
                                    )
                                }
                            </div>
                        ) : (
                            <div style={{"textAlign":"center","color":"#999"}}>
                                Please Try Again
                            </div>
                        )
                    }
                </DialogContent>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.onClosePreview();
        this.props.onRequestCloseDetailDialog();
    }

    onProofClick(imageSrc) {
        this.setState({
            imagePreview: true,
            imagePreviewSrc: imageSrc
        });
    }

    onClosePreview() {
        this.setState({
            imagePreview: false,
            imagePreviewSrc: ""
        });
    }
}

export default ActivityUserDetailDialog;