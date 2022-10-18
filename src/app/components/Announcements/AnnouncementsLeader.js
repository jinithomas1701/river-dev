import React, { Component } from 'react';

import LeaderMaster from './LeaderMaster/LeaderMaster';
class AnnouncementsLeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="leader-wrapper">
                <LeaderMaster leader={this.props.leader}/>
            </div>
        )
    }
}
export default AnnouncementsLeader
