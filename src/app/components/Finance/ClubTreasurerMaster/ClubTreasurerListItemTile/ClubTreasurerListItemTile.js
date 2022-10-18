import React, {Component} from 'react';
import FileUploadIcon from 'material-ui-icons/FileUpload';
import { UserAvatar } from '../../../Common/MinorComponents/MinorComponents';
import moment from 'moment';
import './ClubTreasurerListItemTile.scss';

const CREDITED_CODE = "CR"

class ClubTreasurerListItemTile extends Component {

    constructor(props){
        super(props);
    }

    handleCssClass=()=>{
        let status, statusClass, amountClass;
        switch(this.props.status){
            case "RE":
                status = "requested";
                statusClass = "requested";
                amountClass = "";
                break;
            case "DE":
                status = "declined";
                statusClass = "declined";
                amountClass = "amount-declined";
                break;
            case "AP":
                status = "approved";
                statusClass = "approved";
                amountClass = "";
                break;
            case "CR":
                status = "credited";
                statusClass = "approved";
                amountClass = "";
                break;
            case "SU":
                status = "submitted";
                statusClass = "submitted";
                amountClass = "";
                break;
            case "CL":
                status = "closed";
                statusClass = "normal";
                amountClass = "";
                break;
        }
        return {status, statusClass, amountClass};
    }

    handleOnClick=()=>{
        let transactionItem = {
            referenceCode: this.props.referenceCode
        }
        this.props.onItemClick(transactionItem);
    }

    render(){
        const subTitles = ['Ref#:','Type:','Created On:','Modified On:'];
        let {status, statusClass, amountClass} = this.handleCssClass();
        //const currency = this.props.amountType === "INR" ? "₹":"$";
        const currency = this.props.amountType;

        return(
            <div className="club-treasurer-list-item-tile-wrapper" onClick={this.handleOnClick}>
                <div className="col-xs-1 img-wrapper">
                    <UserAvatar src={this.props.club.avatar} name={this.props.club.name} />
                </div>
                <div className="col-lg-9 item-details-wrapper">
                    <h1 className="title">{this.props.title}</h1>
                    <div className="sub-details">
                        <div className="row">
                            <dl className="col-lg-3 label-term-group">
                                <dt>{subTitles[0]}</dt>
                                <dd>{this.props.referenceCode}</dd>
                            </dl>
                            <dl className="col-lg-3 label-term-group">
                                <dt>{subTitles[1]}</dt>
                                <dd>{this.props.transactionType.name}</dd>
                            </dl>
                            <dl className="col-lg-3 label-term-group">
                                <dt>{subTitles[2]}</dt>
                                <dd>{moment.unix(this.props.createdOn/1000).format("DD MMM YYYY")}</dd>
                            </dl>
                            <dl className="col-lg-3 label-term-group">
                                <dt>{subTitles[3]}</dt>
                                <dd>{moment.unix(this.props.updatedOn/1000).format("DD MMM YYYY")}</dd>
                            </dl>
                        </div>     
                    </div>
                </div>
                <div className="col-lg-1 item-action">
                    {this.props.status == CREDITED_CODE &&
                        <FileUploadIcon />     
                    }
                </div>
                <div className="col-lg-2">
                    <h4 className={`amount ${amountClass}`}>{currency} {this.props.amount}</h4>
                    <div className="row" >
                        <div className={`${statusClass}`}>
                            <span className="dot" />
                            <h6 className="status">{status}</h6>
                        </div>
                    </div>              
                </div>
            </div>
        );    
    }
}

export default ClubTreasurerListItemTile;