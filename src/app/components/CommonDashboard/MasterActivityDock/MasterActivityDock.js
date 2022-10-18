import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import moment from 'moment';

// css
import './MasterActivityDock.scss';

class MasterActivityDock extends Component {
    state = {
        customize: false
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.activity && this.props.activity) {
            if(this.state.customize) this.setState({ customize: false });
        }
    }

    render() {
        const masterActivityDetails=this.props.activity
        console.log(masterActivityDetails);
        return (
            <div className="master-activity-dock">
                <div className="dock-actions" onClick={this.onCloseDock.bind(this)}><Icon>close</Icon> Close</div>
                <div className="title">
                    <div className="selector">
                        <Tooltip title="Select this entry">    
                            <Checkbox
                                checked={this.props.selectedMasters.includes(this.props.activity.id)}
                                onChange={this.handleCheck.bind(this)}
                                value="checkedB"
                                color="accent"
                                className="checkbox"
                                style={{display:"none"}}
                            /> 
                        </Tooltip>
                    </div>
                    {
                        this.state.customize ?
                            <TextField
                                value={this.state.customTitle}
                                onChange={this.handleCustomize('customTitle')}
                                placeholder="Custom Title"
                                className="customize-field"
                                margin="none"
                                autoFocus
                            />
                        :
                            <div className="value">{this.props.activity.shortlisted ? this.props.activity.shortlisted.title : this.props.activity.title}</div>
                    }
                    
                </div>
                <div className="fy" style={{display:"none"}}>
                    <span className="label">Effective on </span>
                    <span className="value">{this.props.activity.year} - {this.props.activity.year + 1}</span>                    
                </div>
                <div className="customize-activity" onClick={this.toggleCustomize.bind(this)} style={{display:"none"}}>Customize</div>
                <div className="masteractivity-dock-content-wrapper">
                        <div className="content-container">
                            {masterActivityDetails.description &&
                                <div className="dock-details-content">
                                    <h6>Description</h6>
                                    <div className="description-textbox" disabled>{masterActivityDetails.description || ''}</div>
                                </div>
                            }
                            {masterActivityDetails.rules &&
                                <div className="dock-details-content">
                                    <h6>Rules</h6>
                                    <div className="description-textbox" disabled>{masterActivityDetails.rules || ''}</div>
                                </div>
                            }
                                <div className="dock-list-content-container">
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">MANDATORY</b>
                                            <p className="dock-detail">{!masterActivityDetails.mandatory ? "NO" : "YES"}</p>
                                        </div>
                                        <div className="dock-list-content">
                                            <b className="dock-header">INTER CLUB COLLABORATION</b>
                                            <p className="dock-detail">{!masterActivityDetails.interClub ? "NO" : "YES"}</p>
                                        </div>
                                    </div>
                                    <div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">SELF ASSIGNABLE</b>
                                            <p className="dock-detail">{!masterActivityDetails.selfAssignable ? "NO" : "YES"}</p>
                                        </div>
                                        {/*<div className="dock-list-content">
                                            <b className="dock-header">MAX MEMBER POINT</b>
                                            <p className="dock-detail">{masterActivityDetails.maxMemberPoint}</p>
                                        </div>*/}
                                    </div>
                                    {/*<div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">VALID FROM</b>
                                            <p className="dock-detail">{moment.unix(masterActivityDetails.validFrom/1000).format("DD MMM YYYY")}</p>
                                        </div>
                                        <div className="dock-list-content">
                                            <b className="dock-header">VALID TILL</b>
                                            <p className="dock-detail">{moment.unix(masterActivityDetails.validTo/1000).format("DD MMM YYYY")}</p>
                                        </div>
                                    </div>*/}
                                    {/*<div className="dock-list-container">
                                        <div className="dock-list-content">
                                            <b className="dock-header">CLUB POINT</b>
                                            <p className="dock-detail">{masterActivityDetails.clubPoint}</p>
                                        </div>
                                    </div>*/}
                                </div>
                            {/* {(myActivity && myActivity.length) && (
                                <table className="table-container">
                                <thead>
                                    <tr className="table-heading">
                                        <th>Key</th>
                                        <th>Value</th>
                                        <th>Key</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        
                                        myActivity[0].assignees.map(item => {
                                            return (
                                                <tr className="table-content">
                                                    <td className="table-date">{item.index}</td>
                                                    <td className="table-name">{item.name}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                                </table>
                                )
                            } */}
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
                </div>
        );
    }

    handleCheck() {
        this.props.handleMasterCheckBoxChange(this.props.activity.id)
    }

    handleCustomize = (name) => (event) => {
        this.setState({ [name]: event.target.value }, () => {this.props.onCustomizeActivity(this.props.index, this.state.customTitle, this.state.customDescripiton, this.props.activity.id, this.props.activity.shortlisted ? (this.props.activity.shortlisted.clubActivityId ? this.props.activity.shortlisted.clubActivityId : '') : '')})
    }

    toggleCustomize() {
        const flag = !this.state.customize;
        if(flag) {
            this.setState({
                ...this.state,
                customize: flag,
                customTitle: this.props.activity.shortlisted ? this.props.activity.shortlisted.title : this.props.activity.title,
                customDescripiton: this.props.activity.shortlisted ? this.props.activity.shortlisted.description : this.props.activity.description
            });
        } else {
            this.setState({
                ...this.state,
                customize: flag,
                customTitle: '',
                customDescripiton: ''
            })
        }

    }

    resetTitles() {
        this.setState({
            ...this.state,
            customTitle: this.props.activity.title,
            customDescripiton: this.props.activity.description
        })
    }

    updateActivity() {
        this.props.onCustomizeActivity(this.props.index, this.state.customTitle, this.state.customDescripiton, this.props.activity.id, this.props.activity.shortlisted ? (this.props.activity.shortlisted.clubActivityId ? this.props.activity.shortlisted.clubActivityId : '') : '');
    }

    onCloseDock() {
        this.props.closeDock()
    }
}

export default MasterActivityDock;