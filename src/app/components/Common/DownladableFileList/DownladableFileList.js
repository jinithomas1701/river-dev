import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';

// custom component
import {Util} from '../../../Util/util';

// css
import './DownladableFileList.scss';

class DownladableFileList extends Component{
    constructor(props){
        super(props);
        this.state = {
            menuAnchor: null
        };
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
    }

    render(){
        const attachments = this.props.attachments;
        const menuAnchor = this.state.menuAnchor;
        const template = attachments.length > 1 ? this.getMultipleFileTemplate(attachments, menuAnchor) : this.getSingleFileTemplate(attachments);

        return template;
    }

    getMultipleFileTemplate(attachments, menuAnchor){
        return (
            <div className="downloadablefilelist-wrapper">
                <Button className="btn-downlaod-file multiple-file" onClick={this.handleMenuOpen}>Attachments <Icon>keyboard_arrow_down</Icon></Button>
                <Menu className="downloadablefilelist-list" open={Boolean(menuAnchor)} anchorEl={menuAnchor} onRequestClose={this.handleMenuClose}>
                    {
                        attachments.map((file, index) => {
                            return (<MenuItem
                                        key={file.name + index}
                                        className="item-file"
                                        value=""
                                        onClick={this.handleMenuSelect.bind(this, file)}
                                        >{file.name}<Icon className="icon-download">get_app</Icon>
                                </MenuItem>)
                        })
                    }
                </Menu>
            </div>
        );
    }

    getSingleFileTemplate(attachments){
        const file = attachments[0];
        return (
            <div className="downloadablefilelist-wrapper">
                <Button className="btn-downlaod-file single-file" title={file.name} onClick={this.handleMenuSelect.bind(this, file)}><span className="textbtn">{file.name}</span> <Icon>get_app</Icon></Button>
            </div>
        );
    }

    handleMenuOpen(event){
        const menuAnchor = event.currentTarget;
        this.setState({menuAnchor});
    }

    handleMenuSelect(file){
        this.setState({menuAnchor: null});
        this.props.onSelect(file);
    }
    
    handleMenuClose(){
        this.setState({menuAnchor: null});
    }
}

DownladableFileList.propTypes = {
    attachments: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default DownladableFileList;