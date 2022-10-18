import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

// custom component
import { Util } from '../../../Util/util';
import { riverToast } from '../../Common/Toast/Toast';

// css
import './CommentPrompt.scss';

const ACTION_APPROVE = "APPROVE";

class CommentPrompt extends Component{
    constructor(props){
        super(props);
        this.state = {
            commentText: ""
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
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
        
        
        return (
            <Dialog className="comment-prompt-wrapper" open={props.open} size="md">
                <DialogTitle className="header">{props.title}</DialogTitle>
                <DialogContent className="content">
                    {props.children}
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
                        className={`btn-${props.theme}`}
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

    handleSubmit(){
        const comment = this.state.commentText;
        if(!this.validate(comment)){
            return;
        }
        
        this.setState({commentText: ""});
        this.props.onSubmit(comment);
    }

    validate(comment){
        let isValid = true;

        if(!comment.trim()){
            riverToast.show("Please fill in the form.");
            isValid = false;
        }

        return isValid;
    }

    handleClose(){
        this.resetForm();
        this.props.onClose();
    }
    
    resetForm(){
        this.setState({commentText: ""});
    }
}

CommentPrompt.defaultProps = {
    title: "Confirm",
    theme: "primary",
    loading: false,
    children: <p>"Please provide details."</p>,
    cancelBtnText: "Cancel",
    SubmitBtnText: "Submit"
}

CommentPrompt.propTypes = {
    open: PropTypes.bool,
    loading: PropTypes.bool,
    theme: PropTypes.string,
    action: PropTypes.string,
    title: PropTypes.string,
    comment: PropTypes.string,
    children: PropTypes.element,
    cancelBtnText: PropTypes.string,
    SubmitBtnText: PropTypes.string,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func
};

export default CommentPrompt;