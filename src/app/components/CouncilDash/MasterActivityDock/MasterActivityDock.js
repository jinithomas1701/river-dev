import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

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
                            /> 
                        </Tooltip>
                    </div>
                    {
                        this.state.customize ?
                            <TextField
                                value={this.state.customTitle}
                                onChange={(event) => {this.setState({ customTitle: event.target.value })}}
                                placeholder="Custom Title"
                                className="customize-field"
                                margin="none"
                                autoFocus
                            />
                        :
                            <div className="value">{this.props.activity.shortlisted ? this.props.activity.shortlisted.title : this.props.activity.title}</div>
                    }
                    
                </div>
                <div className="fy">
                    <span className="label">Effective on </span>
                    <span className="value">{this.props.activity.year} - {this.props.activity.year + 1}</span>                    
                </div>
                <div className="customize-activity" onClick={this.toggleCustomize.bind(this)}>Customize</div>
                <div className="description">
                    <div className="label">Description</div>
                    {
                        this.state.customize ?
                            <TextField
                                value={this.state.customDescripiton}
                                onChange={(event) => {this.setState({ customDescripiton: event.target.value })}}
                                placeholder="Custom Descripiton"
                                className="customize-field"
                                multiline
                            />
                        :
                            <div className="value">{this.props.activity.shortlisted ? this.props.activity.shortlisted.description : this.props.activity.description}</div>
                    }
                </div>
                {
                    this.state.customize &&
                        <div className="customize-fields">
                            <Button className="field btn" raised color="primary" onClick={this.updateActivity.bind(this)}>Update</Button>
                        </div>
                }
                <div className="infos">
                    <div className="item">
                        <div className="label">Panel</div>
                        <div className="value">{this.props.activity.council ? this.props.activity.council.name : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Focus Area</div>
                        <div className="value">{this.props.activity.focusArea ? this.props.activity.focusArea.title : ""}</div>
                    </div>
                    <div className="item">
                        <div className="label">Club Points</div>
                        <div className="value">{this.props.activity.clubPoint}</div>
                    </div>
                    <div className="item">
                        <div className="label">Member Points</div>
                        <div className="value">{this.props.activity.memberPoint}</div>
                    </div>
                </div>
            </div>
        );
    }

    handleCheck() {
        this.props.handleMasterCheckBoxChange(this.props.activity.id)
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

    updateActivity() {
        this.props.onCustomizeActivity(this.props.index, this.state.customTitle, this.state.customDescripiton, this.props.activity.id, this.props.activity.shortlisted ? (this.props.activity.shortlisted.clubActivityId ? this.props.activity.shortlisted.clubActivityId : '') : '');
    }

    onCloseDock() {
        this.props.closeDock()
    }
}

export default MasterActivityDock;