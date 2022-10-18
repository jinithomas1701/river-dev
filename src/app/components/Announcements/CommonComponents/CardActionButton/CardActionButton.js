import React, { Component } from "react";
import IconButton from "material-ui/IconButton";

const buttonClasses = {
    root: "btn-card-action",
    label: "btn-label"
};

const rippleStyle = {
    style: {
        bottom: "0 !important",
        right: "0 !important",
        width: "200%",
        height: "200%"
    }
};

const CardActionButton = (props) => {
    return (
        <IconButton {...props} classes={buttonClasses} touchrippleprops={rippleStyle}></IconButton>
    );
};

export default CardActionButton;