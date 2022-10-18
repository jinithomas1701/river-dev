import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Dialog, { DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';

// custom component
import KpiMaster from "../KpiMaster/KpiMaster";

// css
import "./KpiDialog.scss";

class KpiDialog extends Component{
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);        
    }

    render(){
        const props = this.props;

        return (
            <Dialog
                className="kpidetailsdialog-wrapper"
                open={props.open}
                onRequestClose={this.handleClose}
                maxWidth="md"
                >
                <DialogTitle className="header" disableTypography={true}>
                    <div className="tools-wrapper">
                        <IconButton className="btn-rounded-icon-bordered" color="primary" onClick={this.handleGoBack}>arrow_back</IconButton>
                        { props.editable && <Button className="btn-prmary" color="primary"><Icon>edit</Icon></Button> }
                    </div>
                    <div className="title-wrapper">
                        <h1 className="title">Line Item Details</h1>
                    </div>
                </DialogTitle>
                <DialogContent className="content">
                    <KpiMaster />
                </DialogContent>
            </Dialog>
        );
    }

    handleClose(){
        this.props.onClose();
    }

    handleGoBack(){
        const props = this.props;
        if(typeof props.onBack === "function"){
            props.onBack();
        }
        else{
            props.onClose();
        }
    }
}

KpiDialog.defaultProps = {
    loading: false,
    editable: false
}

KpiDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onBack: PropTypes.func,
    onClose: PropTypes.func.isRequired
};

export default KpiDialog;