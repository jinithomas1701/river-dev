import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import Chip from 'material-ui/Chip';
import { Button } from 'material-ui';
import Icon from 'material-ui/Icon/Icon';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import moment from 'moment';

import AvatarInfo from '../../Common/AvatarInfo/AvatarInfo';
import { UserAvatar } from '../../Common/MinorComponents/MinorComponents';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';
import { Util } from '../../../Util/util';
//css
import './AnnouncementWhatsNewDetails.scss';
const STATUS_PENDING_APPROVAL = "AP";
const STATUS_UPCOMING = "UC";
class AnnouncementWhatsNewDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const announcementDetail = this.props.announcementDetail;
        const showChangeTask = this.props.admin === true && Util.hasPrivilage('UPDATE_TASK');
        const showDeleteTask = this.props.admin === true && Util.hasPrivilage('DELETE_TASK');
        const showApproveTask = this.props.admin === true && Util.hasPrivilage('APPROVE_TASK') && announcementDetail && announcementDetail.status.code === STATUS_PENDING_APPROVAL;
        const showTaskInterested = this.props.admin === false && this.props.leader === false && Util.hasPrivilage('TAKE_TASK_OWNERSHIP') && announcementDetail.clubs && !announcementDetail.clubs.length && announcementDetail.status.code === STATUS_UPCOMING;
        return (

            <div className='whatsnewdetail-wrap'>
                <LoaderOverlay show={this.props.isLoading} />
                <div className="detail-page-card">
                    <div className="action-wrapper">
                        <div className="front-buttons">
                            {
                                showTaskInterested && <Button className="btn-task-interested btn-primary" onClick={this.props.handleInterestedDialog(announcementDetail)}>TASK INTERESTED</Button>
                            }
                            {
                                showApproveTask && <Button className="btn-approve-task btn-primary" onClick={this.props.handleApproveDialog(announcementDetail)}>APPROVE TASK</Button>
                            }
                            {
                                showChangeTask && <Button className="btn-change-status btn-default " onClick={this.handleUpdateTask}>UPDATE TASK</Button>
                            }
                        </div>
                        <div className="back-buttons">
                            {
                                showDeleteTask && <Button className='btn-taskdelete btn-bordered btn-complimentary' onClick={this.props.handleTaskDeleteDialogOpen}><Icon>delete</Icon>DELETE</Button>
                            }
                            <IconButton onClick={this.props.dockClose}>close</IconButton>
                        </div>
                    </div>
                </div>
                <div className='detail-display'>
                    <div className="meta-info">
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="created-by-detail-wrapper">
                                    <p>Created By:</p>
                                    {/* {
                                        announcementDetail &&

                                        <div className='row'>
                                            <div className='col-md-2'>
                                                <UserAvatar
                                                    src={
                                                        announcementDetail.createdBy.avatar
                                                    }
                                                    name={
                                                        announcementDetail.createdBy.name
                                                    }
                                                    key={
                                                        announcementDetail.createdBy.id
                                                    } />
                                            </div>

                                            <div className='col-md-10'>
                                                <p className='createdby-name'>
                                                    {announcementDetail.createdBy.name}
                                                </p>
                                                <p className='createdby-role'>
                                                    {announcementDetail.createdBy.email}
                                                </p>
                                            </div>
                                        </div>
                                    } */}
                                    {
                                        announcementDetail && <AvatarInfo
                                            avatar={announcementDetail.createdBy.avatar}
                                            title={announcementDetail.createdBy.name}
                                            status={announcementDetail.createdBy.email}
                                        />
                                    }
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        {
                                            announcementDetail.tags &&
                                            announcementDetail.tags.length > 0 &&
                                            <div className='tagspecific-wrapper'>
                                                <p className='tag'>Tags:</p>
                                                {announcementDetail.tags.map(item =>
                                                    <Chip
                                                        key={item.id}
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
                                            <th>Created On:  </th>
                                            <td>{moment(announcementDetail.createdOn).format("DD/MM/YYYY")}</td>
                                        </tr>
                                        <tr>
                                            <th>Modified On:  </th>
                                            <td>{moment(announcementDetail.updatedOn).format("DD/MM/YYYY")}</td>
                                        </tr>
                                        <tr>
                                            <th>Id:  </th>
                                            <td>{announcementDetail.id}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='body-detail'>
                        <h1 className='title'>Title:</h1>
                        <p>
                            {announcementDetail.title}
                        </p>
                        <h1 className='title'>Description:</h1>
                        <p>
                            {announcementDetail.description}
                        </p>
                        <div className='attachment-wrapper'>
                            {announcementDetail.attachments &&
                                announcementDetail.attachments.length > 0 &&
                                <div className='attachment-map'>
                                    <FieldHeader title="Attachments" />
                                    <div className='attachment-display'>

                                        {announcementDetail.attachments.map((attachment, index) =>
                                            <Chip
                                                key={index}
                                                onClick={this.handleDetailAttachment.bind(this, attachment)}
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

                    {announcementDetail.problem &&
                        <div className='problem-wrapper'>
                            <FieldHeader title="Problem:" />
                            <div className='problemwrap-body'>
                                <h1 className='title'>
                                    {announcementDetail.problem.title}
                                </h1>
                                <p className='description'>
                                    {announcementDetail.problem.description}
                                </p>
                                <p className="subtitle">Created By:</p>
                                <div className='row'>
                                    <div className='col-md-7'>
                                        <div className='created-by-detail-wrapper'>
                                            {typeof announcementDetail.problem.createdBy == 'object' &&
                                                <div className='row'>
                                                    <div className='col-md-2'>
                                                        <UserAvatar
                                                            src={
                                                                announcementDetail.problem.createdBy.avatar
                                                            }
                                                            name={
                                                                announcementDetail.problem.createdBy.name
                                                            }
                                                            key={
                                                                announcementDetail.problem.createdBy.id
                                                            } />
                                                    </div>

                                                    <div className='col-md-10'>
                                                        <p className='createdby-name'>
                                                            {announcementDetail.problem.createdBy.name}
                                                        </p>
                                                        <p className='createdby-role'>
                                                            {announcementDetail.problem.createdBy.email}
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
                                                    <th>Created On:  </th>
                                                    <td>
                                                        {moment(announcementDetail.problem.createdOn).format("DD/MM/YYYY")}
                                                    </td>
                                                </tr>
                                                {announcementDetail.problem.status &&
                                                    <tr>
                                                        <th>Status:  </th>
                                                        <td>
                                                            {announcementDetail.problem.status.name}
                                                        </td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <th>Id:  </th>
                                                    <td>
                                                        {announcementDetail.problem.id}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <Button className='btn-default' onClick={this.handleShowProblemDetail}>SHOW PROBLEM</Button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }

    handleDetailAttachment = (attachment) => {
        this.props.handleTaskAttachmentSelect(attachment)
    }
    handleUpdateTask = () => {
        this.props.handleTaskUpdateDialog(this.props.announcementDetail)
    }
    handleShowProblemDetail = () => {
        this.props.handleShowProblemDetail(this.props.announcementDetail.problem);
    }
}
export default AnnouncementWhatsNewDetails