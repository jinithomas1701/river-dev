import React, { Component } from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton/IconButton';
import Button from 'material-ui/Button';
import { LoaderOverlay, DateDisplay } from '../../../Common/MinorComponents/MinorComponents';
import AvatarInfo from '../../../Common/AvatarInfo/AvatarInfo';
import DiscussionDock from '../../CommonUtils/DiscussionDock/DiscussionDock';
import DiscussionMaster from '../../CommonUtils/DiscussionMaster/DiscussionMaster';
import './FinanceTeamListItemDockDetails.scss';
import { riverToast } from '../../../Common/Toast/Toast';


class FinanceTeamListItemDockDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDiscussionDockOpen: false
        };
    }

    render() {

        const showMainTemplate = (this.props.transaction && typeof this.props.transaction === "object");

        return (
            <section className="finance-team-list-item-dock-details-wrapper">
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
                status = "submited";
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

    handleApproveBtnClick = () => {
        this.props.approveTransactionHandler();
    }

    handleCreditBtnClick = () => {
        this.props.creditTransactionHandler();
    }

    handleCompleteBtnClick = () => {
        this.props.completeTransactionHandler();
    }

    handleRejectBtnClick = () => {
        this.props.rejectTransactionHandler();
    }

    handleDeescalateBtnClick = () => {
        this.props.deescalateTransactionHandler();
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


    getHeaderToolsTemplate(props) {
        let showApproveBtn, showRejectBtn, showCreditedBtn, showDeescalateBtn, showCompleteBtn, showArchiveBtn;

        if (typeof props.transaction === 'object' && props.privileges) {
            showApproveBtn = props.privileges.canApproveTransaction && props.transaction.transactionType.code === 'MA' && props.transaction.status === 'RE';
            showRejectBtn = props.privileges.canRejectTransaction && props.transaction.transactionType.code === 'MA' && props.transaction.status === 'RE';
            showCreditedBtn = props.privileges.canCreditTransaction && props.transaction.status === 'AP';
            showCompleteBtn = props.privileges.canCloseTransaction && props.transaction.status === 'SU';
            showDeescalateBtn = props.privileges.canDeescalateTransaction && props.transaction.status === 'SU';
            showArchiveBtn = (props.isArchivePossible && ((props.transaction.status === 'CL') || (props.transaction.status === 'DE')))
        }

        return (
            <aside className="tools-header">
                <div className="cols-1">
                    {
                        showApproveBtn && <Button className="btn-primary" title="Approve" onClick={this.handleApproveBtnClick} >Approve</Button>
                    }
                    {
                        showCreditedBtn && <Button className="btn-primary" title="Credit" onClick={this.handleCreditBtnClick} >Credit</Button>
                    }
                    {
                        showCompleteBtn && <Button className="btn-primary" title="Close transaction" onClick={this.handleCompleteBtnClick} >Close Transaction</Button>
                    }
                    {
                        showRejectBtn && <Button className="btn-complimentary" title="Decline" onClick={this.handleRejectBtnClick} >Decline</Button>
                    }
                    {
                        showDeescalateBtn && <Button className="btn-icon-bordered" title="Deescalate" onClick={this.handleDeescalateBtnClick} ><Icon>reply</Icon></Button>
                    }
                </div>
                <div className="cols-2">
                    {
                        showArchiveBtn && <Button className="btn-icon-bordered" title="Archive" onClick={this.handleArchiveBtnClick}>Archive</Button>
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
                                    <th>Escalation In: </th>
                                    <td><DateDisplay date={props.transaction.reminderDate} /></td>
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
                    <h2 className="title">Required to pay : {this.getCurrency(props.transaction.amountType)}{props.transaction.requiredAmount}</h2>
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

export default FinanceTeamListItemDockDetails;