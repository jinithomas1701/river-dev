import React from "react";
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom'

// css
import './AddNewBtn.scss';


class AddNewBtn extends React.Component {
    riverBtnStyle = {
        color: '#ffffff',
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#22BCAC'
    };

    handleClick() {
        this.props.callback();
    }
    render() {
        const props = this.props;
        
        return (
            <div className="btn-add-new">
                <Button style={this.riverBtnStyle} title={props.title} onClick={this.handleClick.bind(this)} >
                    <Icon>{props.icon}</Icon>
                    { props.iconOnly? "" : props.title }
                </Button>
            </div>
        )
    }
}

AddNewBtn.defaultProps = {
    title: "Add New",
    icon: "add",
    iconOnly: false,
};

AddNewBtn.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    iconOnly: PropTypes.bool,
    callback: PropTypes.func.isRequired
}

export {AddNewBtn};