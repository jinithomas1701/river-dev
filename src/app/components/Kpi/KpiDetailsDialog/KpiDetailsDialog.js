import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Dialog, { DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

// custom component
import KpiDetails from "../KpiDetails/KpiDetails";

// css
import "./KpiDetailsDialog.scss";

class KpiDetailsDialog extends Component{
    constructor(props){
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);        
    }

    render(){
        const props = this.props;
        const kpi = props.kpi;

        return (
            <Slide in={props.open} direction="left" unmountOnExit>
                <Dialog
                    fullScreen
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
                        {
                            (kpi !== undefined && kpi !== null)? <KpiDetails kpi={kpi} editable={props.editable} loading={props.loading} /> : null
                        }

                    </DialogContent>
                </Dialog>
            </Slide>
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

KpiDetailsDialog.defaultProps = {
    kpi: {},
    loading: false,
    editable: false
}

KpiDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    editable: PropTypes.bool,
    kpi: PropTypes.object,
    onBack: PropTypes.func,
    onClose: PropTypes.func
};

export default KpiDetailsDialog;