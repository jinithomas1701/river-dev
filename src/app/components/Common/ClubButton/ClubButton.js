import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom'

// css
import './ClubButton.scss';


export default class ClubButton extends React.Component {
    riverBtnStyle = {
        backgroundColor: this.props.color,
        color: this.props.textColor,
        fontWeight: 'bold',
        fontSize: '11px',
        padding: '13px'
    };

    handleClick() {
        this.props.onClick();
    }
    render() {
        return (
            <div className={this.props.className}>
                <Button style={this.riverBtnStyle} onClick={this.handleClick.bind(this)}>
                    {this.props.title || '' }
                </Button>
            </div>
        )
    }
}