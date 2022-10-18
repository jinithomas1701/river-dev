import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

import './DiscussionInput.scss';

const DiscussionInput = (props) => {

    return(
        <form className="discussion-input-wrapper" onSubmit={props.onSubmit}>
            <textarea
                className="input-comment"
                placeholder="Enter Your Comments"
                rows="3"
                value={props.discussionText}
                onChange={props.onChange}
                />
            <div className="submit-wrapper">
                <Button className="btn-primary btn-submit" type="submit">Post</Button>
            </div>
        </form>
    );
}

DiscussionInput.propTypes = {
    discussionText: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default DiscussionInput;