import React from 'react';
import PropTypes from 'prop-types';

// css
import "./FieldHeader.scss";

const FieldHeader = (props) => {

    const titleStyle = {backgroundColor: props.backgroundColor};

    return (
        <header className="fieldheader-wrapper">
            <h1 className="title" style={titleStyle}>{props.title}</h1>
        </header>
    );
};

FieldHeader.defaultProps = {
    backgroundColor: '#fff'
};

FieldHeader.propsTypes = {
    title: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string
};

export default FieldHeader;