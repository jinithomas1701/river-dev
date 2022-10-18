import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button/Button';
import Icon from 'material-ui/Icon';

// css
import './OptionComponent.scss';

class OptionComponent extends Component {
    render() {
        return (
            <div className="option-component">
                <div className="option-text-field-container">
                    <TextField
                        id={("option-") + (this.props.optionData.index + 1)} 
                        label={("Option #") + (this.props.optionData.index + 1)} 
                        margin="normal"
                        className="input-field option-text-field"
                        value= {this.props.optionData.value}
                        onChange = {this.handleOptionFieldChange.bind(this)}
                    />
                </div>
                {
                    (!this.props.disableRemove) &&
                        <div className="remove-option-btn-container">
                            <Button
                                className="remove-option-btn"
                                raised
                                color="default"
                                aria-label="add"
                                onClick={this.removeOptionField.bind(this)}
                            >
                                <Icon>delete</Icon>
                            </Button>
                        </div>
                }
            </div>
        );
    }

    handleOptionFieldChange= (event) => {
        this.props.handleOptionFieldCallback(event.target.value, this.props.optionData.index);
    }

    removeOptionField(){
        this.props.handleremoveOptionField(this.props.optionData.index);
    }
}

export default OptionComponent;