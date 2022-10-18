import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';

// page dependency
// css
import "./MyProfileCards.scss"

class MyProfileCards extends Component {
    render() {
        return (
            <div className="my-profile-card">
                <div className="my-profile-card-title">
                    <div className="title">
                        {this.props.title}
                    </div>
                    {
                        (this.props.icon) &&
                            <Icon className="my-profile-card-icon">
                                {this.props.icon}
                            </Icon>
                    }
                    {
                        (this.props.linkTo) &&
                                <Link to={this.props.linkTo} className="redirect-icon-link" title={this.props.linkTitle || "Click to redirect"}>
                                    <Icon className="redirect-icon">input</Icon>
                                </Link>
                    }
                </div>
                <div className="my-profile-card-children">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default MyProfileCards;