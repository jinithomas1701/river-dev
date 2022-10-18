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
import DownladableFileList from '../../Common/DownladableFileList/DownladableFileList';

// css
import './MemberBox.scss';
class MemberBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            menuOpenStatus: false,
        };
        this.handleOpenActionMenu = this.handleOpenActionMenu.bind(this);
        this.handleActionMenuClose = this.handleActionMenuClose.bind(this);
    }

    render() {
        const props = this.props;
        const imgUrl = (props.avatar) ? Util.getFullImageUrl(props.avatar) : "";
        const statusClass = Util.getStatusFullText(props.status).toLowerCase().replace(" ", "-");
        const statusText = Util.getStatusFullText(props.status).toUpperCase();

        return (
            <figure className="memberbox-wrapper">
                <div className="avatar-col">
                    <Avatar src={imgUrl} className="avatar-img">{!imgUrl && props.title.charAt(0)}</Avatar>
                </div>
                <figcaption className="info-col">
                    <strong className="title">{props.title}</strong>
                    <p className="sub-title">{props.subTitle}</p>
                    {props.status && <p className={`status ${statusClass}`}>{statusText}</p>}
                    <EditableInput
                        editable={props.pointEditable}
                        strikedValue={props.defaultPoints}
                        value={props.points}
                        onChange={this.props.onPointChange}
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
                    {
                        props.attachments.length !==0 && <DownladableFileList
                                                             attachments={props.attachments}
                                                             onSelect={props.onAttachmentDownload}
                                                             />
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

MemberBox.defaultProps = {
    pointEditable: false,
    attachments: []
};

MemberBox.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    avatar: PropTypes.string,
    status: PropTypes.string,
    menuItem: PropTypes.element,
    pointEditable: PropTypes.bool,
    points: PropTypes.number.isRequired,
    defaultPoints: PropTypes.number.isRequired,
    attachments: PropTypes.array,
    onPointChange: PropTypes.func,
    onAttachmentDownload: PropTypes.func
}

export default MemberBox;