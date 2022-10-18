import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
//css
import './InputBox.scss';
import { riverToast } from '../../../Common/Toast/Toast';

class InputBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }

    componentDidMount() {
        this.setState({ text: this.props.text });
    }
    render() {
        const props = this.props;
        const state = this.state;
        return (
            <div className={`input-box-wrapper ${props.className}`} >
                {
                    props.title &&
                    <p className="title">{props.title}</p>
                }
                < textarea
                    className="input-comment"
                    placeholder={props.placeholder}
                    rows={props.rows}
                    value={state.text}
                    onChange={this.onChangeHandler}
                />
                <div className="submit-wrapper">
                    <Button className={`${props.actionClass} btn-submit`} type="button" onClick={this.onSubmitHandler}>{props.actionTitle}</Button>
                </div>
            </div >
        );
    }

    onChangeHandler = (event) => {
        const value = event.target.value;
        this.setState({ text: value })
    }

    onSubmitHandler = () => {
        const isValid = this.validateForm(this.state.text);
        if (!isValid) {
            return;
        }
        this.props.onSubmit(this.state.text)
            .then(() => {
                this.setState({ text: "" });
            })
            .catch(error => {
                riverToast.show(error.status_message.stringify());
            });
    }

    validateForm = (inputText) => {
        let isValid = true;
        if (inputText === "") {
            isValid = false;
            riverToast.show("Please enter a text");
        }
        return isValid;
    }
}

InputBox.propTypes = {
    className: PropTypes.string,
    actionClass: PropTypes.string,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    actionTitle: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
};

InputBox.defaultProps = {
    title: "Untitled",
    className: "",
    actionClass: "btn-primary",
    text: "",
    placeholder: "Enter your text here",
    rows: 3,
    actionTitle: "Submit",
    onChange: () => { console.log("Please include onChange() function") },
    onSubmit: () => { console.log("Please include onSubmit() function") },

};

export default InputBox;