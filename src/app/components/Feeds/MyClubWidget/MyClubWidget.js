import React, { Component } from 'react';
import { Util } from "../../../Util/util";
import Icon from 'material-ui/Icon';

import "./MyClubWidget.scss";

class MyClubWidget extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        clubName: "Club Not Assigned Yet",
        clubCount: ""
    }

    componentDidMount() {
        this.getClubDetails();
    }


    render() {
        return (
            <div className="my-club-widget">
                <div className="my-club-widget-icon">
                <Icon>store</Icon>
                </div>
                <div className="my-club-widget-data">
                    <Icon className="helper-icon">navigate_next</Icon>
                    <div className="clubname">{this.state.clubName || "Club Not Assigned Yet"}</div>
                    <div className="count">
                            {this.state.clubCount || "--"} Members
                    </div>
                </div>
            </div>
        );
    }

    getClubDetails() {
        const myClub = Util.getMyClubDetails();

        if (myClub) {
            this.setState({
                clubName: myClub.name,
                clubCount: myClub.memberCount
            });
        }
    }

}

export default MyClubWidget;