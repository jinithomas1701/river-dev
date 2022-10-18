import React, { Component } from 'react';
import { IconButton } from 'material-ui';
import Chip from 'material-ui/Chip';
import Button from 'material-ui/Button';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';
import SolutionTile from './SolutionTile';
import moment from 'moment';
import { Util } from '../../../Util/util';
import AvatarInfo from '../../Common/AvatarInfo/AvatarInfo';
//css
import './AnnouncementProblemDetails.scss';
class AnnouncementProblemDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const problemDetail = this.props.problemDetail;
        const showUpdateProblem = this.props.leader === true && this.props.userDetails && Util.hasPrivilage('UPDATE_PROBLEM');
        const isMyProblem = this.props.userDetails && problemDetail && this.props.userDetails.userId === problemDetail.createdBy.id;
        const showCloseProblem = this.props.leader === true && problemDetail.noOfSolutions >= 1 && problemDetail.noOfApprovedSolutions > 0 && this.props.userDetails && Util.hasPrivilage('UPDATE_PROBLEM_STATUS');
        const isActionsDisplayed = problemDetail.status && problemDetail.status.code == 'OP';
        const createTask = this.props.admin === true && problemDetail.announced === false && problemDetail.status && problemDetail.status.code === "CL" && Util.hasPrivilage("CREATE_TASK");
        const showAddSolution = this.props.president === true && problemDetail && problemDetail.status.name === "open" && problemDetail.problemType === "L";
        return (
            <div className='problem-detail'>
                <LoaderOverlay show={this.props.isLoading} />
                <div className="detail-page-card">
                    <div className="row">
                        <div className='col-md-11'>
                            {
                                showAddSolution && <Button className="btn-add-solution btn-default" onClick={this.addSolutionButton}>PROPOSE SOLUTION</Button>
                            }
                            {
                                createTask && <Button className="btn-create-task btn-default" title="Create Task" onClick={this.createTaskButton}>Create Task</Button>
                            }
                            {
                                (isActionsDisplayed && showUpdateProblem && isMyProblem) && <div className='update-button'>
                                    <Button className="btn-primary" onClick={this.handleProblemIdSend}>UPDATE PROBLEM</Button>
                                </div>
                            }
                            {
                                (isActionsDisplayed && showCloseProblem && isMyProblem) && <div className='close-problem'>
                                    <Button className="btn-complimentary" onClick={this.handleProblemClosing}>CLOSE PROBLEM</Button>
                                </div>
                            }
                        </div>
                        <div className="col-md-1">
                            <IconButton onClick={this.props.dockClose}>close</IconButton>
                        </div>
                    </div>
                </div>
                <div className='detail-display'>
                    <div className="meta-info">
                        <div className='row'>
                            <div className='col-md-7 created-by-details'>
                                {
                                    problemDetail && <AvatarInfo
                                        avatar={problemDetail.createdBy.avatar}
                                        title={problemDetail.createdBy.name}
                                        subText={problemDetail.createdBy.role}
                                    />
                                }
                                <div className='row'>
                                    <div className='col-md-12'>
                                        {problemDetail.tags &&
                                            problemDetail.tags.length > 0 &&
                                            <div className='tagspecific-wrapper'>
                                                <p className='tag'>Tags:</p>
                                                <div className="tag-wrap">
                                                    {problemDetail.tags.map(item =>
                                                        <Chip
                                                            key={item.id}
                                                            label={item.name}
                                                            className="chip-item"
                                                            color="primary"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-5'>
                                <table className="table-meta">
                                    <tbody>
                                        <tr>
                                            {/* <th>Created:</th> */}
                                            <td title="Created Date">{moment(problemDetail.createdOn).format("DD-MM-YYYY")}</td>
                                        </tr>
                                        {/* <tr>
                                            <th>Last Update:</th>
                                            <td>{moment(problemDetail.updatedOn).format("DD-MM-YYYY")}</td>
                                        </tr> */}
                                        <tr>
                                            {/* <th>Solutions:</th> */}
                                            <td title="Claimed/Total Solutions">{problemDetail.noOfClaimed}/{problemDetail.noOfSolutions}</td>
                                        </tr>
                                        <tr>
                                            {/* <th>Id:  </th> */}
                                            <td title="Reference Code">{problemDetail.id}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='body-detail'>
                        <h1 className='title'>Title:</h1>
                        <p>{problemDetail.title}</p>

                        <h1 className='title'>Description:</h1>
                        <p>{problemDetail.description}</p>
                        <div className='attachment-wrapper'>
                            {
                                problemDetail.attachments &&
                                problemDetail.attachments.length > 0 &&
                                <div className='attachment-map'>
                                    <FieldHeader title="Attachments" />
                                    <div className='attachment-display'>
                                        {problemDetail.attachments.map((attachment, index) =>
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

                    {problemDetail.solutions &&
                        problemDetail.solutions.length > 0 &&
                        <div className='complete-solution-wrapper'>
                            <div className='common-solution-wrap'>
                                <FieldHeader title="Solutions" />
                            </div>
                            {problemDetail.solutions.map(item =>
                                <SolutionTile
                                    admin={this.props.admin}
                                    key={item.id}
                                    isMyProblem={isMyProblem}
                                    userDetails={this.props.userDetails}
                                    checkedB={this.props.checkedB}
                                    solutionApproveDialogOpen={this.handleSolutionApproveDialogOpen}
                                    solutionobject={item}
                                    onSelect={this.props.onSolutionTileSelect}
                                    onAttachmentSelect={this.props.onAttachmentSelect}
                                />
                            )}
                        </div>
                    }
                </div>

            </div>
        )
    }
    createTaskButton = () => {
        this.props.createDockOpen(this.props.problemDetail);
    }
    addSolutionButton = () => {
        this.props.handleAddSolutionDialog(this.props.problemDetail);
    }
    handleDetailAttachment = (attachment) => {
        this.props.handleDetailAttachment(attachment);
    }
    handleSolutionApproveDialogOpen = (id) => {
        let problemDetail = this.props.problemDetail;
        this.props.solutionApproveDialogOpen(id, problemDetail);
    }

    handleProblemIdSend = () => {
        this.props.updateProblemDialogOpen();
    }
    handleProblemClosing = () => {
        this.props.problemClosingDialogOpen(this.props.problemDetail);
    }

    delete() {
        alert('You Have No Previlage To Delete The Attachment ');
    }
}
export default AnnouncementProblemDetails