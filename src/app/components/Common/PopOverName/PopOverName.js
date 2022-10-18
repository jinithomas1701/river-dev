import React from "react";
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import Icon from 'material-ui/Icon';
import { CircularProgress } from 'material-ui/Progress';
import Popover from 'react-simple-popover';

import { CommonService } from "../../Layout/Common.service";

import './PopOverName.scss';

export class PopOverName extends React.Component {
    state = {
        popOverVisible: false,
        preloader: false,
        userDetails: {},
        isError: false
    };

    style = {
        minWidth: '16rem',
        position: 'relative',
        zIndex: '8',
        width:'100%'
    }

    constructor(props) {
        super(props);
        
    }

    handleClick(e) {
        if (!this.state.popOverVisible) {
            this.loadUserDetails(this.props.userId);
        }
        this.setState({popOverVisible: !this.state.popOverVisible});
        
    }
     
    handleClose(e) {
        this.setState({popOverVisible: false});
    }

    render() {
        return (
            <div className="popover-component">
                <div className="user-name" ref="target" onClick={this.handleClick.bind(this)}>
                    {this.props.name}
                </div>
                <Popover
                    placement='bottom'
                    style={this.style}
                    target={this.refs.target}
                    show={this.state.popOverVisible}
                    onHide={this.handleClose.bind(this)} >
                    <div className="popover-container">
                        {this.state.preloader &&
                            <div className="progress">
                                <CircularProgress />
                            </div>
                        }
                        {this.state.isError &&
                            <div className="progress">
                                <div>Count not load data</div>
                            </div>
                        }
                        <div className="head-container">
                            <div className="image-container">
                                <img src={this.props.avatar || "../../../../../resources/images/img/user-avatar.png"} className="user-image"/>
                            </div>
                            <div className="head-content">
                                <div className="main">{this.state.userDetails.firstName+" "+this.state.userDetails.middleName+" "+this.state.userDetails.lastName}</div>
                                <div className="sub">{this.state.userDetails.email}</div>
                            </div>
                        </div>
                        <div className="content-container">
                            <div className="content-row" title="Club">
                                <div className="icon-holder">
                                    <Icon>store</Icon>
                                </div>
                                <div className="text">
                                    {this.state.userDetails.clubName}
                                </div>
                            </div>
                            <div className="content-row" title="Designation">
                                <div className="icon-holder">
                                    <Icon>event_seat</Icon>
                                </div>
                                <div className="text">
                                    {this.state.userDetails.designation ? this.state.userDetails.designation.name : ""}
                                </div>
                            </div>
                            <div className="content-row" title="Location">
                                <div className="icon-holder">
                                    <Icon>location_on</Icon>
                                </div>
                                <div className="text">
                                    {this.state.userDetails.currentLocation ? this.state.userDetails.currentLocation.name : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </Popover>

                {/* {this.state.popOverVisible &&
                    <div className="popover-container">
                        popover
                        <div className="popover-arrow"></div>
                    </div>
                    
                } */}
            </div>

        )
    }

    loadUserDetails(userId) {
        this.setState({preloader: true});
        CommonService.getUserDetails(userId)
            .then(data => {
                this.setState({
                    ...this.state,
                    userDetails: data,
                    isError: false,
                    preloader: false
                });                
            })
            .catch(error => {
                this.setState({
                    ...this.state,
                    userDetails: {},
                    isError: true,
                    preloader: false
                });
            })
    }
}

PopOverName.propTypes = {
    name: PropTypes.string.isRequired
}