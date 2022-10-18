import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Tooltip from 'material-ui/Tooltip';

const getColor = (className) => {
    let color = "default";
    switch(className) {
        case "btn-primary":
            color = "primary"
            break;
        default:
            break;
    }
    const expression = new RegExp(/\bbtn-primary\b/);
    if(expression.test(className)){
        color = "primary";
    }
    return color;
};

const LoadedButton = props => {
    const {loading, className, type, children, title, onClick, tooltip} = props;
    const color = getColor(className);
    const disabled = props.disabled || loading;
    const btnContent = loading? <CircularProgress size={18} /> : children;
    const displayTitle = (!tooltip && title) ? title : null;
    const buttonTemplate = (<Button
                                className={className}
                                title={displayTitle}
                                type={type}
                                onClick={onClick}
                                color={color}
                                disabled={disabled}
                                >
            {btnContent}
        </Button>);
    const loadedTemplte = tooltip? <Tooltip title={title}>{buttonTemplate}</Tooltip> : buttonTemplate;
    return loadedTemplte;
}

LoadedButton.defaultProps = {
    disabled: false,
    loading: false,
    className: "btn",
    title: "",
    type: "button",
    tooltip: false
}

LoadedButton.propTypes = {
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    tooltip: PropTypes.bool,
    onClick: PropTypes.func
};

export default LoadedButton;