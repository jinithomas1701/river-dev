import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Autosuggest from 'react-autosuggest';
import Menu, { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import './SelectAutoComplete.scss';

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
});

class SelectAutoComplete extends Component{
    constructor(props){
        super(props);
        this.state = {
            suggestionValue: ''
        };
    }

    getSuggestionValue(suggestion){
        return suggestion.title;
    }

    renderInput(inputProps) {
        const { classes, ref, ...other } = inputProps;

        return (
            <TextField
                fullWidth
                InputProps={{
                    inputRef: ref,
                        ...other,
                }}
                />
        );
    }

    renderSuggestion(suggestion, { query, isHighlighted }){
        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {suggestion.title}
                </div>
            </MenuItem>
        );
    }

    renderSuggestionsContainer(options) {
        const { containerProps, children } = options;

        return (
            <Paper {...containerProps} square>
                {children}
            </Paper>
        );
    }

    onChange(event, {newValue}){
        this.setState({suggestionValue: newValue});
    }

    render(){
        const inputProps = {
            placeholder: this.props.placeholder || "Select",
            value: this.state.suggestionValue,
            onChange: this.onChange.bind(this)
        };

        const { classes } = this.props;

        return (
            <div className="select-autocomplete-wrapper">
                <Icon className="icon-dropdown">arrow_drop_down</Icon>
                <input type="hidden" value="prayer" />
                <Autosuggest
                    theme={{
                        container: classes.container,
                            suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                suggestionsList: classes.suggestionsList,
                                    suggestion: classes.suggestion,
                    }}
                    suggestions={this.props.selectList}
                    onSuggestionsFetchRequested={this.props.onSelectListChange}
                    onSuggestionsClearRequested={this.props.onResetList}
                    onSuggestionSelected={this.props.onSelect}
                    getSuggestionValue={this.getSuggestionValue.bind(this)}
                    renderSuggestion={this.renderSuggestion.bind(this)}
                    renderSuggestionsContainer={this.renderSuggestionsContainer.bind(this)}
                    renderInputComponent={this.renderInput.bind(this)}
                    inputProps={inputProps}
                    />
            </div>
        );
    }
}

export default withStyles(styles)(SelectAutoComplete);