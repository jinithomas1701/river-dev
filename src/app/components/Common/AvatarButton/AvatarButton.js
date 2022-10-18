import React, { Component } from 'react';
import AvatarBox from "./AvatarBox";
import "./AvatarButton.scss";
class AvatarButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ["NONE"],
            dayOfWeek: [],
            disabled: this.props.disabled && this.props.disabled === true ? this.props.disabled : false
        }
    }
    componentDidMount() {
        let input = this.props.inputArray;

        if (this.props.selectedInput) {
            this.setState({ dayOfWeek: this.props.selectedInput });
        }
    }
    componentDidUpdate(prevProps) {
        const currProps = this.props;
        if (prevProps.selectedInput.length !== currProps.selectedInput.length) {
            if (currProps.selectedInput) {
                this.setState({ dayOfWeek: currProps.selectedInput });
            }
        }
    }
    render() {
        return (
            <div className="avatar-button-wrapper">
                {this.props.inputArray && this.props.inputArray.map((input, index) =>
                    <AvatarBox
                        disabled={this.props.disabled}
                        input={input}
                        selected={!(Array.isArray(this.props.selectedInput) && this.props.selectedInput.indexOf(input) == -1)}
                        onClick={this.handleOnClicked}
                    />
                )}
            </div>
        )
    }
    handleOnClicked = (days) => {
        let dayOfWeek = [...this.state.dayOfWeek];
        let index = dayOfWeek.indexOf(days);
        index > -1 ? dayOfWeek.splice(index, 1) : dayOfWeek.push(days);
        this.setState({ dayOfWeek: dayOfWeek });
        this.props.onClick(dayOfWeek);
    }

}
export default AvatarButton