import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import teal from 'material-ui/colors/teal';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

// custom component
import { Util } from '../../../Util/util';
import { riverToast } from '../../Common/Toast/Toast';
import AvatarInfo from '../../Common/AvatarInfo/AvatarInfo';

// css
import './AutoComplete.scss';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
        display: 'flex',
        paselectRefing: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700]
    },
    noOptionsMessage: {
        paselectRefing: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        marginTop: theme.spacing.unit,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

const NoOptionsMessage = (props) => {
    return (<div className={props.selectProps.classes.noOptionsMessage}>{props.emptyMessage || props.children}</div>);
};

const inputComponent = ({ inputRef, ...props }) => {
    return <div ref={inputRef} {...props} />;
};

const Control = (props) => {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps
                }
            }}
            {...props.selectProps.textFieldProps}
        />
    );
};

const Placeholder = (props) => {
    return <div className={props.selectProps.classes.placeholder} {...props.innerProps}>{props.children}</div>;
};

const SingleValue = (props) => {
    return <div className={props.selectProps.classes.singleValue} {...props.innerProps}>{props.children}</div>;
};

const ValueContainer = (props) => {
    return <div className={`${props.selectProps.classes.valueContainer}  valcontainer`}>{props.children}</div>;
};

const Menu = (props) => {
    return <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>{props.children}</Paper>;
};

class AutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null

        };
        this.components = this.customiseTemplate(props);
        this.inputValueLength = undefined;
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    render() {
        const props = this.props;
        const { classes, theme } = this.props;
        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
            }),
        };

        const classList = `autocomplete-component ${props.className || ""}`;

        this.select = <Select
            ref={"selectRef"}
            classes={classes}
            className={classList}
            styles={selectStyles}
            options={props.options}
            components={this.components}
            placeholder={props.placeholder}
            value={this.state.value}
            inputValue={this.state.inputValue}
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
        />;

        return (
            <div className="autocomplete-wrapper">
                {this.select}
                <div className="autocomplete-placeholder">{props.placeholder}</div>
            </div>
        );
    }

    handleChange(value) {
        this.setState({ value: { ...value }, inputValue: value.value });
        this.refs.selectRef.blur();
        this.props.onChange(value);
    }

    handleInputChange(inputValue) {
        if (inputValue.length !== this.inputValueLength) {
            this.inputValueLength = inputValue.length;

            this.props.onInputChange(inputValue);
        }
    }

    customiseTemplate(mainProps) {
        const optionsTemplate = mainProps.optionsTemplate;

        //@DESC: Customise individual option item
        const Option = (props) => {
            return (
                <MenuItem
                    className="menuitem"
                    selected={props.isFocused}
                    component="div"
                    style={{ fontWeight: props.isSelected ? 500 : 400 }}
                    {...props.innerProps}
                >
                    {optionsTemplate ? React.cloneElement(optionsTemplate, { ...props.data, deletable: false }) : props.children}
                </MenuItem>
            );
        };

        const components = {
            Option,
            Control,
            NoOptionsMessage,
            Placeholder,
            SingleValue,
            ValueContainer,
            Menu
        };
        return components;
    }
}

let theme = createMuiTheme({
    palette: {
        primary: teal,
        secondary: grey,
    },
    typography: {
        //Use the system font instead of the default Roboto font.
        fontFamily: [
            'Oswald',
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 10,
        htmlFontSize: 8
    },
    appBar: {
        height: 10
    },
    overrides: {
        MuiButton: {
            root: {
                background: "#000",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 300,
                letterSpacing: "0.3rem"
            }
        }
    }
});

AutoComplete.defaultProps = {
    className: "",
    classes: { root: "classer", placeholder: "placeholder-autoc" },
    theme: theme,
    optionsTemplate: <AvatarInfo deletable={false} />,
    emptyMessage: ""
};

AutoComplete.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    optionsTemplate: PropTypes.element,
    placeholder: PropTypes.string,
    emptyMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(AutoComplete);