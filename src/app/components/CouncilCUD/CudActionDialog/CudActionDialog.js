import React, { Component } from 'react';
import {connect} from "react-redux";
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

// CUSTOM
import {SelectBox} from "../../Common/SelectBox/SelectBox";
import { riverToast } from '../../Common/Toast/Toast';

// css
import "./CudActionDialog.scss";

// action
import {  } from '../CouncilCUD.actions';

import { CouncilCUDService } from '../CouncilCUD.service';


const mapStateToProps = (state, ownProps) => {
    return {
        councilCUD: state.CouncilCUDReducer
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    }
}

class CudActionDialog extends Component {
    state = {
        bucketType: "0"
    }
    render() {
        return (
            <div>
                <Dialog open={this.props.open} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>Take action on {this.props.cud ? this.props.cud.title : ""}</DialogTitle>
                    <DialogContent className="cud-action-dialog">
                        <SelectBox 
                            id="cud-bucket-select" 
                            label="Bucket Type"
                            selectedValue={this.state.bucketType}
                            selectArray={this.props.councilCUD.bucketTypes}
                            onSelect={this.onSelectBucketType.bind(this)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Close
                        </Button>
                        <Button onClick={this.onRejectCud.bind(this)} color="primary">
                            Reject
                        </Button>
                        <Button onClick={this.onApproveCud.bind(this)} color="primary">
                            Accept
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    handleRequestClose = (success = false) => {
        this.props.onRequestClose(success);
    };

    onApproveCud() {
        if(this.state.bucketType) {
            const cudId = this.props.cud.id;
            const bucket = {
                bucketType: this.state.bucketType
            }
            CouncilCUDService.approveCud(cudId, bucket)
            .then((data) => {
                this.handleRequestClose(true);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while approving cud");
            });
        } else {
            riverToast.show("Please select any bucket type");
        }
    }

    onRejectCud() {
        const cudId = this.props.cud.id;        
        CouncilCUDService.rejectCud(cudId)
        .then((data) => {
            this.handleRequestClose(true);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while approving cud");
        });
    }

    onSelectBucketType(selectedType) {
        this.setState({ bucketType: selectedType });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CudActionDialog);