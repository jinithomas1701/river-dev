import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';

// custom component
import { Util } from '../../../Util/util';
import EditableInput from '../../Common/EditableInput/EditableInput';

// css
import './ClubBox.scss';
class ClubBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            menuOpenStatus: false
        };
        this.handleOpenActionMenu = this.handleOpenActionMenu.bind(this);
        this.handleActionMenuClose = this.handleActionMenuClose.bind(this);
    }

    render() {
        const props = this.props;
        const imgUrl = (props.avatar) ? Util.getFullImageUrl(props.avatar) : "";

        return (
            <figure className="clubbox-wrapper">
                <Avatar src={imgUrl} className="avatar-img">{!imgUrl && props.title.charAt(0)}</Avatar>
                <figcaption className="info-col">
                    <strong className="title">{props.title}</strong>
                    <EditableInput
                        editable={props.pointEditable}
                        value={props.points}
                        strikedValue={props.defaultPoints}
                        onChange={props.onPointChange}
                        />
                    {
                        props.menuItem && <div className="action-menu-wrapper">
                                <IconButton className="action-menu" onClick={this.handleOpenActionMenu}>
                                    <Icon>more_vert</Icon>
                                </IconButton>
                                <Menu
                                    open={this.state.menuOpenStatus}
                                    anchorEl={this.state.anchorEl}
                                    onRequestClose={this.handleActionMenuClose}
                                    >
                                    {this.getMenuItemTemplate(props.menuItem)}
                                </Menu>
                            </div>
                    }
                </figcaption>
            </figure>
        );
    }

    handleOpenActionMenu(event) {
        this.setState({
            anchorEl: event.currentTarget,
            menuOpenStatus: true
        });
    }

    handleMenuItemClick(parentOnClick) {
        this.setState({
            anchorEl: null,
            menuOpenStatus: false
        });
        parentOnClick();
    }

    handleActionMenuClose() {
        this.setState({
            anchorEl: null,
            menuOpenStatus: false
        });
    }

    getMenuItemTemplate(menu) {
        return React.Children.map(menu.props.children, child => {
            const clickFunc = child.props.onClick;
            return React.cloneElement(child, { onClick: this.handleMenuItemClick.bind(this, clickFunc) })
        });
    }
}

ClubBox.defaultProps = {
    pointEditable: false
};

ClubBox.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    menuItem: PropTypes.element,
    pointEditable: PropTypes.bool,
    points: PropTypes.number.isRequired,
    defaultPoints: PropTypes.number.isRequired,
    onPointChange: PropTypes.func
}

export default ClubBox;