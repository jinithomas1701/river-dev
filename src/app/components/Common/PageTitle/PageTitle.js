import React from "react";
import PropTypes from 'prop-types';
import { render } from 'react-dom';

import './PageTitle.scss';

export class PageTitle extends React.Component {
    render() {
        return (
            <h4 className="river-theme page-title">{this.props.title}</h4>
        )
    }
}

PageTitle.propTypes = {
    title: PropTypes.string.isRequired
}