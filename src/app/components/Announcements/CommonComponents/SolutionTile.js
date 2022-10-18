import React, { Component } from 'react';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import moment from 'moment';
import AvatarInfo from '../../Common/AvatarInfo/AvatarInfo';
//css
import './SolutionTile.scss';
class SolutionTile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleChange = name => event => {
        this.props.solutionApproveDialogOpen(this.props.solutionobject.id);
        this.setState({ [name]: event.target.checked });
    };
    render() {
        const showApproveButton = this.props.admin === false && this.props.isMyProblem &&
        this.props.userDetails && this.props.userDetails.currentPrivileges.indexOf('APPROVE_SOLUTION') != -1 ;
        return (
            <div className='solutiontile-wrapper'>
                <div className='solution-card' onClick={this.onSolutionTileSelect}>

                    <label className='title'>
                        {this.props.solutionobject.title}
                    </label>
                    <div className='row'>
                        <div className="col-md-7">
                            {
                                this.props.solutionobject && <AvatarInfo
                                    avatar={this.props.solutionobject.suggestedClubs.avatar}
                                    title={this.props.solutionobject.suggestedClubs.name}
                                />
                            }
                        </div>
                        <div className="col-md-5">
                            <table className="table-meta">
                                <tbody>
                                    <tr>
                                        <th>Claimed:</th>
                                        {this.props.solutionobject.takingOwnership === true ?
                                            <td>YES</td> :
                                            <td>No</td>
                                        }

                                    </tr>
                                    <tr>
                                        <th>Claimed On:</th>
                                        <td>
                                            {moment(this.props.solutionobject.createdOn).format("DD/MM/YYYY")}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='description-wrap'>
                        <dt className="description-title">
                            Description:
                        </dt>
                        <label className='description'>
                            {this.props.solutionobject.description}
                        </label>
                    </div>
                    {this.props.solutionobject.attachments &&
                        this.props.solutionobject.attachments > 0 &&
                        <div className='attachment-wrapper'>
                            <div className='row'>
                                <dt>
                                    Attachemts:
                                    </dt>
                                <ul className='attachment-list'>
                                    {this.props.solutionobject.attachments.map(file =>
                                        <li className='item' key={file.path}>
                                            <a onClick={this.handleAttachmentSelect.bind(this, file)}>{file.name}</a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    }
                </div>
                <div className='base-border'>
                    { showApproveButton &&
                        <div className='switch'>
                            {this.props.solutionobject.status.name == "approved" ?
                                <p className='Solution-approve'>APPROVED</p> :
                                <FormControlLabel
                                    className="approve-switch"
                                    label="Approve Solution"
                                    control={
                                        <Switch
                                            checked={this.props.checkedB}
                                            onChange={this.handleChange('checkedB')}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    }
                                />
                            }
                        </div> 
                       
                    }
                </div>

            </div>
        )
    }
    onSolutionTileSelect = () => {
        this.props.onSelect(this.props.solutionobject);
    }
    handleAttachmentSelect = (file) => {
        this.props.onAttachmentSelect(file);
    }
}
export default SolutionTile