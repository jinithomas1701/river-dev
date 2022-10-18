import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

// custom component
import { Util } from '../../../../Util/util';
import { riverToast } from '../../../Common/Toast/Toast';

// css
import './TextInputDialog.scss';

const ACTION_APPROVE = "APPROVE";

class TextInputDialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            contractDays: '',
            commentText: ""
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleDaysChange = this.handleDaysChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate(prevProps){
        const props = this.props;

        if(!prevProps.open && props.open){
            this.setState({commentText: props.comment});
        }
    }

    render(){
        const props = this.props;
        const showDaysInput = props.action === ACTION_APPROVE;
        return (
            <Dialog className="textinput-dialog-wrapper" open={props.open} size="md">
                <DialogTitle className="header">{props.title}</DialogTitle>
                <DialogContent className="content">
                    <p>{props.description}</p>
                    {
                        showDaysInput && <div className="row">
                                <div className="col-md-6">
                                    <TextField
                                        type="number"
                                        label="Contract Days"
                                        name="days"
                                        className="input-text"
                                        value={this.state.contractDays}
                                        onChange={this.handleDaysChange}
                                        />
                                </div>
                            </div>
                    }
                    <textarea
                        rows="4"
                        className="input-comment"
                        placeholder="Your Comment"
                        value={this.state.commentText}
                        onChange={this.handleCommentChange}
                        />
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <Button
                        raised
                        className="btn-default btn-cancel"
                        color="default"
                        onClick={this.handleClose}
                        >
                        {props.cancelBtnText}
                    </Button>
                    <Button
                        className="btn-primary btn-forward"
                        color="primary"
                        onClick={this.handleSubmit}
                        raised
                        >
                        {props.SubmitBtnText}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleCommentChange(event){
        this.setState({commentText: event.target.value});
    }

    handleDaysChange(event){
        this.setState({contractDays: event.target.value});
    }

    handleSubmit(){
        const comment = this.state.commentText;
        const contractDays = this.state.contractDays;
        if(!this.validate(comment, contractDays)){
            return;
        }
        
        this.setState({commentText: "", contractDays: ''});
        this.props.onSubmit(this.props.action ,comment, contractDays);
    }

    validate(comment, contractDays){
        let isValid = true;

        if(!comment.trim()){
            riverToast.show("Please fill in the form.");
            isValid = false;
        }
        else if(this.props.action === ACTION_APPROVE && !contractDays){
            riverToast.show("Please fill in approval days.");
            isValid = false;
        }

        return isValid;
    }

    handleClose(){
        this.setState({commentText: "", contractDays: ''});
        this.props.onClose();
    }
}

TextInputDialog.defaultProps = {
    title: "Confirm",
    description: "Please provide details.",
    cancelBtnText: "Cancel",
    SubmitBtnText: "Submit"
}

TextInputDialog.propTypes = {
    open: PropTypes.bool,
    action: PropTypes.string,
    title: PropTypes.string,
    comment: PropTypes.string,
    description: PropTypes.string,
    cancelBtnText: PropTypes.string,
    SubmitBtnText: PropTypes.string,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func
};

export default TextInputDialog;