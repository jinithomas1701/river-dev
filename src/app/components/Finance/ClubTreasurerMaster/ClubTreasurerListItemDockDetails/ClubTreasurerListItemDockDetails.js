import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton/IconButton';
import Icon from 'material-ui/Icon/Icon';
import Button from 'material-ui/Button';
import { LoaderOverlay, DateDisplay } from '../../../Common/MinorComponents/MinorComponents';
import AvatarInfo from '../../../Common/AvatarInfo/AvatarInfo';
import DiscussionDock from '../../CommonUtils/DiscussionDock/DiscussionDock';
import DiscussionMaster from '../../CommonUtils/DiscussionMaster/DiscussionMaster';
import './ClubTreasurerListItemDockDetails.scss';
import { riverToast } from '../../../Common/Toast/Toast';


class ClubTreasurerListItemDockDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDiscussionDockOpen: false
        };
    }

    render() {

        const showMainTemplate = (this.props.transaction && typeof this.props.transaction === "object");

        return (
            <section className="club-treasurer-list-item-dock-details-wrapper">
                {this.getHeaderToolsTemplate(this.props)}
                {showMainTemplate ? this.getMainTemplate(this.props) : this.getEmptyTemplate()}
                <LoaderOverlay show={this.props.isLoading} />
                <DiscussionDock
                    open={this.state.isDiscussionDockOpen}
                    discussion={this.props.discussion}
                    onSubmit={this.handleDiscussionSubmit}
                    onClose={this.showMoreDiscussionClose}
                    isLoading={this.props.isDiscussionDockLoading}
                />
            </section>
        );
    }

    getStatus = (statusCode) => {
        let status;
        switch (statusCode) {
            case "RE":
                status = "requested";
                break;
            case "DE":
                status = "declined";
                break;
            case "AP":
                status = "approved";
                break;
            case "CR":
                status = "credited";
                break;
            case "SU":
                status = "submitted";
                break;
            case "CL":
                status = "closed";
                break;
        }
        return status;
    }

    getCurrency = (currencyCode) => {
        let currency;
        switch (currencyCode) {
            case "INR":
                currency = "Rs. ";
                break;
            case "USD":
                currency = "$ ";
                break;
        }
        return currency;
    }

    handleSubmitBtnClick = () => {
        this.props.submitBillDialogHandler();
    }

    handleArchiveBtnClick = () => {
        this.props.onArchiveBtnClick(this.props.transaction.referenceCode);
    }

    handleAttachmentSelect(file) {
        if(this.props.privileges.canDownloadAttachment)
        {
            this.props.onAttachmentSelect(file);
        }else{
            riverToast.show("You do not have the previlege to download attachments.")
        }
    }

    handleDeleteBtnClick = () => {
        this.props.deleteTransactionDialogHandler(this.props.transaction.referenceCode);
    }

    getHeaderToolsTemplate(props) {
        let showSubmitBtn, showArchiveBtn, showDeleteBtn;

        if (props.transaction && props.privileges) {
            showSubmitBtn = props.privileges.canSubmitReceipts && props.transaction.status === 'CR';
            showArchiveBtn = props.privileges.canArchiveTransaction && (props.isArchivePossible && ((props.transaction.status === 'CL') || (props.transaction.status === 'DE')))
            showDeleteBtn = props.privileges.canDeleteTransaction && props.transaction.status === 'RE';
        }

        return (
            <aside className="tools-header">
                <div className="cols-1">
                    {
                        showSubmitBtn && <Button className="btn-primary" title="Submit" onClick={this.handleSubmitBtnClick} >Submit</Button>
                    }
                </div>
                <div className="cols-2">
                    {
                        showArchiveBtn && <Button className="btn-icon-bordered" title="Archive" onClick={this.handleArchiveBtnClick}>Archive</Button>
                    }
                    {
                        showDeleteBtn && <Button className="btn-bordered btn-complimentary" title="Delete" onClick={this.handleDeleteBtnClick}><Icon>delete</Icon>Delete</Button>
                    }
                </div>
                <IconButton onClick={props.dockCloseHandler}>close</IconButton>
            </aside>
        );
    }

    getMainTemplate(props) {
        const { attachmentTemplate, billTemplate } = this.getAttachmentTemplate(props.transaction.attachments)
        return (
            <article className="content">
                <header className="details-header">
                    <div className="left-col">
                        <AvatarInfo
                            avatar={props.transaction.club.avatar}
                            title={props.transaction.club.name}
                        />
                    </div>
                    <div className="right-col">
                        <table className="table-stats">
                            <tbody>
                                <tr>
                                    <th>Ref#: </th>
                                    <td>{props.transaction.referenceCode}</td>
                                </tr>
                                <tr>
                                    <th>Status: </th>
                                    <td className="stats">{this.getStatus(props.transaction.status)}</td>
                                </tr>
                                <tr>
                                    <th>Created: </th>
                                    <td><DateDisplay date={props.transaction.createdOn} /></td>
                                </tr>
                                <tr>
                                    <th>Modified: </th>
                                    <td><DateDisplay date={props.transaction.updatedOn} /></td>
                                </tr>
                                <tr>
                                    <th>Type: </th>
                                    <td>{props.transaction.transactionType.name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </header>
                <div className="details-body">
                    <h6>{props.transaction.title}</h6>
                    <h2 className="title">Requested Amount : {this.getCurrency(props.transaction.amountType)}{props.transaction.amount}</h2>
                    <h2 className="title">Crediting Amount : {this.getCurrency(props.transaction.amountType)}{props.transaction.requiredAmount}</h2>
                    <div className="description">{props.transaction.description}</div>

                    {attachmentTemplate}
                    {billTemplate}

                </div>
                <div className="discussion-teaser">
                    <header className="header">
                        <h1 className="title">Discussion</h1>
                    </header>
                    <DiscussionMaster
                        discussion={props.discussion}
                        showMoreBtn={true}
                        showDiscussion={false}
                        onShowMore={this.showMoreDiscussionOpen}
                        onSubmit={this.handleDiscussionSubmit}
                    />
                </div>
            </article>
        );
    }

    getEmptyTemplate() {
        return (
            <div className="content loading">
                loading...
            </div>
        );
    }

    getAttachmentListTemplate(attachments) {
        const template = attachments.map((file) => {
            return <li key={file.path} className="item"><a onClick={this.handleAttachmentSelect.bind(this, file)}>{file.name}</a></li>
        });

        return template;
    }


    groupAttachmentList(attachments) {
        let attachmentList = [];
        let billList = [];

        if (attachments.length > 0) {
            attachments.map((file) => {
                if (file.type === "NR") {
                    attachmentList.push(file);
                } else if (file.type === "BL") {
                    billList.push(file);
                }
            })
        }

        return { attachmentList, billList };
    }

    getAttachmentTemplate(attachments) {
        let list = this.groupAttachmentList(attachments);
        let attachmentTemplate, billTemplate;

        if (list.attachmentList.length > 0) {
            attachmentTemplate = <div className="attachment-wrapper">
                <h2 className="title">Attachments: </h2>
                <ul className="attachment-list">
                    {
                        this.getAttachmentListTemplate(list.attachmentList)
                    }
                </ul>
            </div>
        }
        if (list.billList.length > 0) {
            billTemplate = <div className="attachment-wrapper">
                <h2 className="title">Bills: </h2>
                <ul className="attachment-list">
                    {
                        this.getAttachmentListTemplate(list.billList)
                    }
                </ul>
            </div>
        }


        return { attachmentTemplate, billTemplate };
    }

    showMoreDiscussionOpen = () => {
        this.setState({ isDiscussionDockOpen: true });
    }

    showMoreDiscussionClose = () => {
        this.setState({ isDiscussionDockOpen: false });
    }

    handleDiscussionSubmit = (value) => {
        let discussionObj = {
            commentId: this.props.transaction.discussionId,
            value: value
        };
        this.props.onDiscussionSubmit(discussionObj);
    }


}

export default ClubTreasurerListItemDockDetails;