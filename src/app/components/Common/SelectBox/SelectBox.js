import React from "react";
import { render } from 'react-dom';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import './SelectBox.scss';

export class SelectBox extends React.Component {
    state = {
        category: ""
    };
    constructor(props) {
        super(props);
    }

    render() {
        const selectedvalue = this.props.selectedValue || this.state.category;
        const menuItems = this.props.selectArray.map((item, index) => {
            return <MenuItem 
                        key={index}
                        value={item.value}
                        title={(this.props.valueDescription && item.description) ? item.description: item.title}
                    >
                            {item.title}
                    </MenuItem>
        });

        /*return (
            <FormControl className={((this.props.classes) ? this.props.classes : "") + (!this.props.disableSysClasses ? " form-control" : "")} classes={{'select': 'aa'}}>
                {
                    (this.props.label) &&
                        <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                }
                <Select
                    disableUnderline = {(this.props.underline == "no-underline") ? true: false}
                    disabled = {this.props.isDisabled || false}
                    value={selectedvalue}
                    onChange={this.handleChange('category')}
                    input={<Input id={this.props.id} />}
                >
                    {menuItems}
                </Select>
            </FormControl>
        )*/
        return (
            <FormControl className={((this.props.classes) ? this.props.classes : "") + (!this.props.disableSysClasses ? " form-control" : "")}>
                {
                    (this.props.label) &&
                        <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                }
                <Select
                  autoWidth
                  placeholder={this.props.placeholder || "Select"}
                   MenuProps={{style: {"width": "10rem"}}}
                    disableUnderline = {(this.props.underline == "no-underline") ? true: false}
                    disabled = {this.props.isDisabled || false}
                    value={selectedvalue}
                    onChange={this.handleChange('category')}
                    input={<Input id={this.props.id} />}
                >
                    {menuItems}
                </Select>
            </FormControl>
        )
    }

    handleChange = name => event => {
        this.setState({category:event.target.value});
        let autoload= false;
        if(this.props.autoload){
            autoload=true;
        } 
        this.props.onSelect(event.target.value,autoload);

        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    };
}