import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';

// css
import './ExpandableWrapper.scss';

let wrapperContext;
export default class ExpandableWrapper extends React.Component {
    state = {
        isExpanded: this.props.isExpanded
    };

    componentDidMount() {
        if (this.props.isExpanded) {
            // this.props.isExpandClick();    
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.isExpanded && this.props.isExpanded) {  
            // this.props.isExpandClick();
        }
    }

    handleExpandClick() {
        this.props.onArrowClick();
        if (!this.props.isExpanded) {
            this.props.isExpandClick();
        }
    }

    render() {
        const { isExpanded } = this.props;
        return (
            <div className={"expandable-wrapper "+this.props.className}>
                <HeadWrapper>{this.props.head}</HeadWrapper>
                {isExpanded &&
                    <BodyWrapper>{this.props.body}</BodyWrapper>
                }
                <div className="expand-btn" onClick={this.handleExpandClick.bind(this)}>
                    {isExpanded ?
                        <Icon>expand_less</Icon>:
                        <Icon>expand_more</Icon>
                    }
                </div>
            </div>
        )
    }
}

class HeadWrapper extends React.Component {

    render() {
        return (
            <div className="expandable-wrapper-head">
                {this.props.children}
            </div>
        )
    }
}

class BodyWrapper extends React.Component {

    render() {
        return (
            <div className="expandable-wrapper-body">
                {this.props.children}
            </div>
        )
    }
}