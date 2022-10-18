import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom'

// css
import './ClubInput.scss';


export default class ClubInput extends React.Component {

    render() {
        const {className, onChange, value, placeholder} = this.props;
        return (
            <div className={"club-input "+className}>
                <input type="text" placeholder={placeholder || "Enter text here"} className="title-field"
                    value={value}
                    onChange = {(e) => {onChange(e);}}
                    disabled={this.props.disabled || false}
                    />
            </div>
        )
    }
}