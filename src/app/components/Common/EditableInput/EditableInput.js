import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';

// custom component
import {Util} from '../../../Util/util';

// css
import './EditableInput.scss';
class EditableInput extends Component{

    constructor(props){
        super(props);
        this.state = {
            focused: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    render(){
        const props = this.props;
        const focusClass = this.state.focused ? "focused" : "";
        const editableClass = props.editable ? "editable" : "locked";

        return (
            <label className={`editable-input-wrapper ${focusClass} ${editableClass}`}>
                <Icon className="lable-icon">stars</Icon>
                <TextField
                    className="textfield-input"
                    value={props.value}
                    disabled={!props.editable}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    />
                { (props.value !== props.strikedValue) && <span className="striked-value">{this.props.strikedValue}</span>}
                <Icon className="edit-icon">create</Icon>
            </label>
        );
    }
    
    handleChange(event){
        const value = parseInt(event.target.value, 10);
        this.props.onChange(value);
    }

    handleFocus(){
        this.setState({focused: true});
    }

    handleBlur(){
        this.setState({focused: false});
    }
}

EditableInput.defaultProps = {
    editable: true
};

EditableInput.propTypes = {
    editable: PropTypes.bool,
    value: PropTypes.number,
    strikedValue: PropTypes.number,
    onChange: PropTypes.func
};

export default EditableInput;