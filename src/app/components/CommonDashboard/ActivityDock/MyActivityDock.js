import React, { Component } from 'react';
import Icon from 'material-ui/Icon';

import './MyActivityDock.scss';

export class MyActivityDock extends React.Component {
    render() {
        return (
        <div className="dock-content-wrapper">
            <div className="progress-container">
                <div className="status-progress-wrapper">
                        <div className="status-circle completed">
                            <Icon>check</Icon>
                            <div className="status-text small-text">Assigned</div>
                        </div>
                        <div className="status-line"></div>
                        <div className="status-circle completed">
                            <Icon>more_horiz</Icon>
                            <div className="status-text small-text">Completed</div>
                        </div>
                        <div className="status-circle">
                            <div className="status-text small-text">President Approved</div>
                        </div>
                        <div className="status-circle">
                        <   div className="status-text small-text">Panel Approved</div>
                        </div>
                        <div className="status-circle">
                            <div className="status-text small-text">Point Credited</div>
                        </div>

                </div>
        </div>
            <div className="content-container">
                <h4>{masterActivity.title || ''}</h4>
                <div className="description-textbox" disabled>{masterActivity.description || ''}</div>
                <table className="table-container">
                    <tr className="table-heading">
                        <th>Date</th>
                        <th>Name</th>
                        <th>Status</th>
                    </tr>
                    <tr className="table-content">
                        <td>Test</td>
                        <td>test</td>
                        <td>test</td>
                    </tr>
                </table>
                {/* <div className="assignee-tab">
                    <div className="assignee-data">
                        <Icon>person</Icon>
                        <b>Assignee name</b>
                        <b>Status:<p>Panel rated</p></b>
                    </div>
                    <div className="assignee-input">
                        <div className="upload-btn-wrapper">
                            <button className="btn"><Icon>attach_file</Icon> Attachment</button>
                            <input type="file" name="myfile" />
                        </div>
                        <div className="upload-btn-wrapper" style={{marginLeft:"2px"}}>
                            <button className="btn" style={{backgroundColor:"#E8F8F6", color:"#0D9485"}}><Icon>attach_file</Icon> Attachment</button>
                            <input type="file" name="myfile" />
                        </div>
                        <textarea className="description-textbox"/>
                    </div>
                </div> */}
            </div>
        </div>
        );
    }        
}
