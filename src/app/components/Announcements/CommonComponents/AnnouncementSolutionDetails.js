import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import { IconButton } from 'material-ui';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';
import moment from 'moment';
import AvatarInfo from '../../Common/AvatarInfo/AvatarInfo';
import { Button } from 'material-ui';
import { Util } from '../../../Util/util';
//css
import './AnnouncementSolutionDetails.scss';
const PROBLEM_OPEN = "OP";
class AnnouncementSolutionDetails extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const solutionDetails = this.props.solutionDetails;
        const solutionUpdateDisplay = this.props.problemStatus && this.props.problemStatus.code === PROBLEM_OPEN && solutionDetails.suggestedClubs && solutionDetails.suggestedClubs.id === this.props.userClub && Util.hasPrivilage('UPDATE_SOLUTION');
        return (
            <div className='solutiondetail-wrap'>
                <LoaderOverlay show={this.props.isLoading} />
                <div className="detail-page-card">

                    {solutionUpdateDisplay &&
                        <Button className='btn-primary' onClick={this.onUpdateSolution}> Update Solution</Button>
                    }
                    <div className="action-wrapper">
                        <IconButton className="btn-close" onClick={this.props.dockClose}>close</IconButton>
                    </div>

                </div>

                <div className='detail-display'>
                    <div className="meta-info">
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="created-by-detail-wrapper">
                                    <p>Suggested By:</p>
                                    {
                                        solutionDetails && <AvatarInfo
                                            avatar={solutionDetails.suggestedClubs.avatar}
                                            title={solutionDetails.suggestedClubs.name}
                                        />
                                    }
                                </div>

                            </div>
                            <div className='col-md-6'>
                                <table className="table-meta">
                                    <tbody>
                                        <tr>
                                            {/* <th>Created On:  </th> */}
                                            <td title="Created On">{moment(solutionDetails.createdOn).format("DD/MM/YYYY")}</td>
                                        </tr>
                                        {/* <tr>
                                            <th>Modified On:  </th>
                                            <td>{moment(solutionDetails.updatedOn).format("DD/MM/YYYY")}</td>
                                        </tr> */}
                                        <tr>
                                            {/* <th>Id:  </th> */}
                                            <td title="Reference Id">{solutionDetails.id}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='body-detail'>
                    <h1 className='title'>Title:</h1>
                    <p>
                        {solutionDetails.title}
                    </p>
                    <h1 className='title'>Description:</h1>
                    <p>
                        {solutionDetails.description}
                    </p>
                    <div className='attachment-wrapper'>
                        {solutionDetails.attachments &&
                            solutionDetails.attachments.length > 0 &&
                            <div className='attachment-map'>
                                <FieldHeader title="Attachments" />
                                <div className='attachment-display'>

                                    {solutionDetails.attachments.map((attachment, index) =>
                                        <Chip
                                            key={index}
                                            onClick={this.handleAttachmentSelect.bind(this, attachment)}
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
            </div>
        )
    }
    onUpdateSolution = () => {
        this.props.onUpdateSolutionClick();
    }
    handleAttachmentSelect = (attachment) => {
        this.props.onAttachmentSelect(attachment)
    }
}
export default AnnouncementSolutionDetails