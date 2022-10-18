import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import moment from "moment";
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import {Util} from '../../../Util/util';

// css
import './GoForGrowthItem.scss'


const GFG_CHANGE_STATUS = "GFG_CHANGE_STATUS";
const GFG_ADMINISTRATIONS = "GFG_ADMINISTRATIONS";

class GoForGrowthItem extends Component {
    state = {
        addGFGDialog: false,
        currentGfg: '',
        menuOpen: false,
        anchorEl: ''
    }

    render() {
        return (
            <div className="gfg-tile">
                <div className="gfg-tile-head">
                    <div className="gfg-status-container">
                        <a className="opportunity" >
                        {
                                    Util.hasPrivilage(GFG_CHANGE_STATUS) &&
                                        
                                            <Checkbox
                                                checked={this.props.selectedItems.includes(this.props.gfgItem.id)}
                                                onChange={this.props.handleCheckBoxChange.bind(this, this.props.gfgItem.id)}
                                                value="checkedB"
                                                color="accent"
                                                className="checkbox"
                                            />
                        }
                
                        <u onClick={this.onTitleClick.bind(this)}>{this.props.gfgItem.opportunity}</u></a>
                        {
                            (Util.hasPrivilage(GFG_ADMINISTRATIONS) && this.props.gfgItem.recent )&&
                                <div className="recent-flag">
                                    <Icon className="recent-flag-icon">fiber_new</Icon>
                                </div>
                        }
                        {
                            (this.props.gfgItem.status && this.props.gfgItem.status.code != "CRTD") &&
                                <div className="gfg-status">
                                    {
                                        this.props.gfgItem.status.code == "SHRT" &&
                                            <Icon className="gfg-status-icon">favorite</Icon>                                    
                                    }
                                    {
                                        this.props.gfgItem.status.code == "ACC" &&
                                            <Icon className="gfg-status-icon">thumb_up</Icon>                                    
                                    }
                                    {
                                        this.props.gfgItem.status.code == "RJT" &&
                                            <Icon className="gfg-status-icon">thumb_down</Icon>                                    
                                    }
                                    {this.props.gfgItem.status ? this.props.gfgItem.status.status : ''}
                                </div>
                        }
                       

                    </div>
                    
                    <div className="gfg-metas">
                        {
                            Util.hasPrivilage(GFG_ADMINISTRATIONS) &&
                                <div className="gfg-created-status">
                                    Created by {this.props.gfgItem.createdBy.fullname} on {moment.unix(this.props.gfgItem.createdOn/1000).format("DD MMM YYYY hh:mm a")}
                                </div>
                        }
                        <div className="reference-id">
                            Reference id: {this.props.gfgItem.referenceId}
                        </div>
                        {/* {
                            Util.hasPrivilage(GFG_CHANGE_STATUS) &&
                            <Tooltip title="Select this entry">
                            <Checkbox
                            checked={this.props.selectedItems.includes(this.props.gfgItem.id)}
                            onChange={this.props.handleCheckBoxChange.bind(this, this.props.gfgItem.id)}
                            value="checkedB"
                            color="accent"
                            className="checkbox"
                            />
                            </Tooltip>
                        } */}
                    </div>
                    {
                        this.checkCurrentUser(this.props.gfgItem.createdBy) &&
                            <div className="gfg-tile-menu">
                                <IconButton
                                    title="Menu"
                                    onClick={this.handleMenuClick.bind(this)}
                                >
                                    <Icon className="menu-icon">more_vert</Icon>
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.anchorEl}
                                    open={this.state.menuOpen}
                                    className="gfg-menu"
                                    onRequestClose={this.handleMenuClose.bind(this)}
                                >
                                    <MenuItem onClick={this.onUpdateClick.bind(this)}>Update</MenuItem>
                                    <MenuItem onClick={this.onDeleteClick.bind(this)}>Delete</MenuItem>
                                </Menu>
                            </div>
                    }
                </div>
                
                
               
            </div>
        );
    }

    onTitleClick=()=>{
        this.props.onTitleClick(this.props.gfgItem);
    }

    handleMenuClick = event => {
        this.setState({ menuOpen: true, anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ menuOpen: false });
    };

    onUpdateClick(){
        this.handleMenuClose();
        this.props.onUpdateClick(this.props.gfgItem.id)
    }

    onDeleteClick(){
        if(confirm('Are you sure about deleting this entry?')){
            this.handleMenuClose();
            this.props.onDeleteGfg(this.props.gfgItem.id, this.props.index)
        }
    }

    checkCurrentUser(createdBy) {
        const userDetail = Util.getLoggedInUserDetails();
        let isCurrentUser = false;
        if (createdBy.userId == userDetail.userId) {
            isCurrentUser = true
        }

        return isCurrentUser;
    }
}

export default GoForGrowthItem;