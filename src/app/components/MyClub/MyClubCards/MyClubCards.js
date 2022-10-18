import React, { Component } from 'react';
import Icon from 'material-ui/Icon';

// page dependency
// css
import "./MyClubCards.scss"

class MyClubCards extends Component {
    render() {
        return (
            <div className="my-club-card">
                <div className="my-club-card-title">
                    <div className="title">
                        {this.props.title}
                    </div>
                    {
                        (this.props.icon) &&
                            <Icon className="my-club-card-icon">
                                {this.props.icon}
                            </Icon>
                    }
                </div>
                <div className="my-club-card-children">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default MyClubCards;