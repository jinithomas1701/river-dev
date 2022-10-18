import React from "react";
import PropTypes from 'prop-types';
import { render } from 'react-dom';

export class WhiteContainer extends React.Component {
    render() {
        return (
            <div style={{"backgroundColor": "#ffffff", "padding": "20px"}}>
                {this.props.children}
            </div>
        )
    }
}