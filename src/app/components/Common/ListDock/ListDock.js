import React, {Component} from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';

// custom component
import {Util} from "../../../Util/util";

// css
import "./ListDock.scss";

class ListDock extends Component{
    constructor(props){
        super(props);
        this.state = {

        };
        this.renderChildren = this.renderChildren.bind(this);
    }

    render(){
        let data = this.props;
        return (
            <div className="listdock-wrapper">
                {this.renderChildren()}
            </div>
        );
    }

    renderChildren(){
        return React.Children.map(this.props.children, child => {
            if(child.type && child.type.name === "ListDockListing"){
                return React.cloneElement(child, {open: this.props.open});
            }
            else{
                return React.cloneElement(child, {open: this.props.open, onClose: this.props.onClose});
            }
            return false;
        });
    }

}

ListDock.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

//*******************************************************************
let ListDockListing = function (props) {
    const statusClass = props.open ? "open" : "closed";
    return (
        <div className={`listdock-list-wrapper ${statusClass}`}>{props.children}</div>
    );
}
let ListDockDetail = function (props) {
    const statusClass = props.open ? "open" : "closed";
    return (
        <div className={`listdock-dock-wrapper ${statusClass}`}>
            {props.children}
            <Button className="btn-expand-horizontal"
                onClick={props.onClose}
                fab
                ><Icon>keyboard_arrow_right</Icon>
            </Button>
        </div>
    );
}

export {ListDock, ListDockListing, ListDockDetail};