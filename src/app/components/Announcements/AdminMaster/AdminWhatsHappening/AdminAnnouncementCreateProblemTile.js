import React, { Component } from 'react';
import moment from 'moment';
//css
import './AdminAnnouncementCreateProblemTile.scss';

class AdminAnnouncementCreateProblemTile extends Component {
    constructor(props) {
        super(props);
    }
    onClick = () => {
        this.props.onSelect(this.props.values);
    }
    render() {
        return (
            <article className="container announcementproblem-item-wrapper" onClick={this.onClick}>
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="title">{this.props.values.title}</h1>
                        <p className='description'>
                            {this.props.values.description}
                        </p>
                    </div>
                </div>
            </article>
        )
    }
}
export default AdminAnnouncementCreateProblemTile;