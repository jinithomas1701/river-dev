import React, { Component } from 'react';
import AdminMaster from "./AdminMaster/AdminMaster";

import './AnnouncementsAdmin.scss';
class AnnouncementsAdmin extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="admin-wrap">
                <AdminMaster admin={this.props.admin} />
            </div>
        )
    }
}
export default AnnouncementsAdmin
