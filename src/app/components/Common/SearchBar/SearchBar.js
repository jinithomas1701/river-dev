import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import ReactTooltip from 'react-tooltip'

// custom component
import { Util } from "../../../Util/util";

// css
import "./SearchBar.scss";

class SearchBar extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const props = this.props;
        const classess = `searchbar-wrapper ${props.theme.toString()} ${props.className}`;
        return (
            <form className={classess} onSubmit={this.handleSubmit}>
                <TextField
                    placeholder={props.placeholder}
                    margin="normal"
                    className="input-searchbar"
                    value={props.value}
                    onChange={this.handleTextChange}
                />
                {
                    props.showClearButton && <Button className="btn-default btn-clear" type="button" onClick={this.handleClearText}><Icon>close</Icon></Button>
                }
                <Button className="btn-default btn-search" type="submit"><Icon>search</Icon></Button>
            </form>
        );
    }

    handleClearText = () => {
        //this.props.onChange("");
        this.props.onSubmit("");
    }

    handleTextChange = (event) => {
        const text = event.target.value;
        this.props.onChange(text);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const props = this.props;
        props.onSubmit(props.value);
    }
}

SearchBar.defaultProps = {
    value: "",
    className: "",
    theme: "light",
    placeholder: "Search",
    showClearButton: true
};

SearchBar.propTypes = {
    value: PropTypes.string.isRequired,
    showClearButton: PropTypes.bool,
    className: PropTypes.string,
    theme: PropTypes.oneOf(["light", "minimal", "dark"]),
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;