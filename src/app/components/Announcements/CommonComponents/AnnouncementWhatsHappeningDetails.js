import React, { Component } from 'react';

import { IconButton } from 'material-ui';
import Icon from 'material-ui/Icon/Icon';
import { Button } from 'material-ui';
import moment from 'moment';
import Chip from 'material-ui/Chip';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import { UserAvatar } from '../../Common/MinorComponents/MinorComponents';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';
import { Util } from '../../../Util/util';
//css
import './AnnouncementWhatsHappeningDetails.scss';

const STATUS_COMPLETED = "CO";
class AnnouncementWhatsHappeningDetails extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const whatshappeningitem = this.props.announcementDetail;
        const showUpdateAction = Util.hasPrivilage('UPDATE_TASK');
        const showDeleteAction = Util.hasPrivilage('DELETE_TASK');
        const userDetails = this.props.userDetails;
        return (
            <div className='whatshappening-wrapper'>
                <LoaderOverlay show={this.props.isLoading} />
                <div className="detail-page-card">
                    <div className="row">
                        <div className='col-md-12'>
                            <div className="action-wrapper">
                                <div className="front-buttons">
                                    {this.props.admin === true &&
                                        userDetails &&
                                        showUpdateAction && <Button className="btn-change-status btn-primary" onClick={this.handleUpdateTask}>UPDATE TASK</Button>
                                    }
                                </div>
                                <div className="back-buttons">
                                    {this.props.admin === true &&
                                        userDetails &&
                                        showDeleteAction && <Button className='btn-taskdelete btn-bordered btn-complimentary' onClick={this.props.handleTaskDeleteDialogOpen}><Icon>delete</Icon>DELETE</Button>
                                    }
                                    <IconButton onClick={this.props.dockClose}>close</IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='detail-display'>
                    <div className="meta-info">
                        <div className='row'>
                            <div className='col-md-6'>
                                {
                                    whatshappeningitem.clubs &&
                                    <div className='created-by-detail-wrapper'>
                                        <p>Assigned To:</p>
                                        <div className='list-avatar'>
                                            {
                                                (whatshappeningitem.clubs.length !== 0) && whatshappeningitem.clubs.map(item =>
                                                    <UserAvatar
                                                        key={item.id}
                                                        src={item.avatar}
                                                        name={item.name}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                }
                                <div className='row'>
                                    <div className='col-md-12'>
                                        {whatshappeningitem.tags &&
                                            whatshappeningitem.tags.length > 0 &&
                                            <div className='tagspecific-wrapper'>
                                                <p className='tag'>Tags:</p>
                                                {
                                                    whatshappeningitem.tags.map((item, index) =>
                                                        <Chip
                                                            key={index}
                                                            label={item.name}
                                                            className="chip-item"
                                                            color="primary"
                                                        />
                                                    )}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <table className="table-meta">
                                    <tbody>
                                        <tr>
                                            {/* <th>Created:  </th> */}
                                            <td title="Created On">{moment(whatshappeningitem.createdOn).format("DD-MM-YYYY")}</td>
                                        </tr>
                                        {whatshappeningitem.status && whatshappeningitem.status.code === "CO" ?
                                            <tr>
                                                {/* <th>Completed On:  </th> */}
                                                <td title="Completed On">{whatshappeningitem.deadline === null ?
                                                    <div>NA</div> :
                                                    <div>
                                                        {moment(whatshappeningitem.deadline).format("DD-MM-YYYY")}
                                                    </div>
                                                }
                                                </td>

                                            </tr> :
                                            <tr>
                                                {/* <th>DeadLine:  </th> */}
                                                <td title="Deadline">{whatshappeningitem.deadline === null ?
                                                    <p>NA</p> :
                                                    <div>
                                                        {moment(whatshappeningitem.deadline).format("DD-MM-YYYY")}
                                                    </div>
                                                }
                                                </td>
                                            </tr>

                                        }
                                        {whatshappeningitem.status &&
                                            <tr>
                                                {/* <th>Status:  </th> */}
                                                <td title="Status">{whatshappeningitem.status.name}</td>
                                            </tr>
                                        }
                                        <tr>
                                            {/* <th>Id:  </th> */}
                                            <td title="Reference Id">{whatshappeningitem.id}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='body-detail'>
                        <h1 className='title'>
                            Title:
                        </h1>
                        <p>
                            {whatshappeningitem.title}
                        </p>
                        <h1 className='title'>

                            Description:
                        </h1>
                        <p>
                            {whatshappeningitem.description}
                        </p>

                        <div className='attachment-wrapper'>
                            {whatshappeningitem.attachments &&
                                whatshappeningitem.attachments.length > 0 &&
                                <div className='attachment-map'>
                                    <FieldHeader title="Attachments" />
                                    <div className='attachment-display'>
                                        {whatshappeningitem.attachments.map((attachment, index) =>
                                            <Chip
                                                key={index}
                                                onClick={this.handleDetailAttachments.bind(this, attachment)}
                                                label={attachment.name}
                                                className="chip-item"
                                                color="primary"
                                            />
                                        )}
                                    </div>

                                </div>

                            }
                        </div>
                    </div>

                    {
                        whatshappeningitem.problem &&
                        <div className='problem-wrapper'>
                            <FieldHeader title="Problem:" />
                            <div className='problemwrap-body'>
                                <h1 className='title'>
                                    {whatshappeningitem.problem.title}
                                </h1>
                                <p className='description'>
                                    {whatshappeningitem.problem.description}
                                </p>
                                <p className="subtitle">Created By:</p>
                                <div className='row'>
                                    <div className='col-md-7'>
                                        <div className='created-by-detail-wrapper'>
                                            {typeof whatshappeningitem.problem.createdBy == 'object' &&
                                                <div className='row'>
                                                    <div className='col-md-2'>
                                                        <UserAvatar
                                                            src={
                                                                whatshappeningitem.problem.createdBy.avatar
                                                            }
                                                            name={
                                                                whatshappeningitem.problem.createdBy.name
                                                            }
                                                            key={
                                                                whatshappeningitem.problem.createdBy.id
                                                            } />
                                                    </div>

                                                    <div className='col-md-10'>
                                                        <p className='createdby-name'>
                                                            {whatshappeningitem.problem.createdBy.name}
                                                        </p>
                                                        <p className='createdby-role'>
                                                            {whatshappeningitem.problem.createdBy.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-5 table-wrap'>
                                        <table className="table-meta">
                                            <tbody>
                                                <tr>
                                                    <th>Created:  </th>
                                                    <td>
                                                        {moment(whatshappeningitem.problem.createdOn).format("DD-MM-YYYY")}
                                                    </td>
                                                </tr>
                                                {whatshappeningitem.problem.status &&
                                                    <tr>
                                                        <th>Status:  </th>
                                                        <td>
                                                            {whatshappeningitem.problem.status.name}
                                                        </td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <th>Id:  </th>
                                                    <td>
                                                        {whatshappeningitem.problem.id}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <Button className='btn-default' onClick={this.handleProblemShowButtonClick}>SHOW PROBLEM</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

    handleDetailAttachments = (attachment) => {
        this.props.handleTaskAttachmentSelect(attachment);
    }

    handleUpdateTask = () => {
        this.props.handleTaskUpdateDialog();
    }


    handleProblemShowButtonClick = () => {
        this.props.handleShowProblemDetail(this.props.announcementDetail.problem);
    }
}

export default AnnouncementWhatsHappeningDetails