import React, {Component} from 'react';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import PropTypes from 'prop-types';

// custom component
import {Util} from "../../../Util/util";
import LoadedButton from "../../Common/LoadedButton/LoadedButton";

// css
import "./PromptDialog.scss";

class PromptDialog extends Component{
    constructor(props){
        super(props);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.okHandler = this.okHandler.bind(this);
    }

    render(){
        let props = this.props;
        return (
            <Dialog open={props.open}
                maxWidth={props.maxWidth}
                className="promptdialog-wrapper"
                >
                <DialogTitle className="header">{props.title}</DialogTitle>
                <DialogContent className="content">{props.children}</DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton loading={props.loading} className="btn-default" color="default" onClick={this.cancelHandler}>{props.cancelLabel}</LoadedButton>
                    <LoadedButton loading={props.loading} className={`btn-${props.theme}`} color={`${props.theme}`} onClick={this.okHandler}>{props.okLabel}</LoadedButton>
                </DialogActions>
            </Dialog>
        );
    }
    cancelHandler(){
        this.props.cancelHandler();
    }
    okHandler(){
        this.props.okHandler();
    }

}

PromptDialog.defaultProps = {
    cancelLabel: "Cancel",
    maxWidth: "md",
    okLabel: "Ok",
    loading: false,
    theme: "primary"
};

PromptDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    maxWidth: PropTypes.string,
    theme: PropTypes.oneOf(["primary", "complimentary"]),
    children: PropTypes.node,
    cancelLabel: PropTypes.string,
    okLabel: PropTypes.string,
    cancelHandler: PropTypes.func,
    okHandler: PropTypes.func,
};

export default PromptDialog;