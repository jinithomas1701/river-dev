import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import "./AvatarBox.scss";
class AvatarBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: this.props.selected
        }
    }

    componentDidUpdate(prevProps) {
        const currProps = this.props;
        if (prevProps.selected !== currProps.selected) {
            this.setState({ clicked: currProps.selected });
        }
    }

    render() {
        let props = this.props;
        return (
            <div className={props.disabled  ?  "avatar-each-button-wrapper-disabled":"avatar-each-button-wrapper" } contentEditable='false' onClick={this.onButtonClick.bind(this, props.input)} >
                <Avatar
                    className={this.state.clicked ? "avatar-style-onclick" : "avatar-style"}
                >
                    {props.input.charAt(0)}
                </Avatar>
            </div>
        )
    }
    onButtonClick = (input) => {
        this.setState({ clicked: !this.state.clicked });
        this.props.onClick(input);
    }
}
export default AvatarBox