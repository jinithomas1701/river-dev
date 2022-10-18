import React, { Component } from 'react';
import { connect } from "react-redux";
import TextField from 'material-ui/TextField';
import { Button } from 'material-ui';
import { Icon } from 'material-ui';
import Paper from 'material-ui/Paper';
import PropTypes from "prop-types";

import { riverToast } from "../../../../Common/Toast/Toast";
import LoadedButton from '../../../../Common/LoadedButton/LoadedButton';
import AvatarInfo from "../../../../Common/AvatarInfo/AvatarInfo";

import "./FinAdminClubCard.scss";

class FinAdminClubCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const state = this.state;
        const props = this.props;

        return (
            <Paper className="finadmin-clubcard-wrapper">
                <AvatarInfo
                title={props.details.club.name}
                avatar={props.details.club.avatar}
                />
                <Icon onClick={this.onClickHandler} className="edit-icon-wrapper">edit</Icon>
                {
                    props.showTeaser &&
                        <div className="finadmin-clubcard-body">
                            <table className="allowance-detail-wrapper">
                                <tbody>
                                    <tr>
                                        <td className="bold">Meeting Allowance:</td>
                                        <td className="amount bold">{props.details.amountType} {props.details.meetingAllowance.limit}</td>
                                    </tr>
                                    <tr>
                                        <td className="sub-title">Spent:</td>
                                        <td className="amount">{props.details.amountType} {props.details.meetingAllowance.spent}</td>
                                    </tr>
                                    <tr>
                                        <td className="sub-title">Balance:</td>
                                        <td className="amount">{props.details.amountType} {props.details.meetingAllowance.balance}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold">Event Allowance:</td>
                                        <td className="amount bold">{props.details.amountType} {props.details.eventAllowance.limit}</td>
                                    </tr>
                                    <tr>
                                        <td className="sub-title">Spent:</td>
                                        <td className="amount">{props.details.amountType} {props.details.eventAllowance.spent}</td>
                                    </tr>
                                    <tr>
                                        <td className="sub-title">Balance:</td>
                                        <td className="amount">{props.details.amountType} {props.details.eventAllowance.balance}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold">Other Expenses:</td>
                                        <td className="amount bold">{props.details.amountType} {props.details.otherExpenseSpent}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold">Amount In-Hand:</td>
                                        <td className="amount bold">{props.details.amountType} {props.details.inHand}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                }
            </Paper>
        );
    }

    onClickHandler = () =>{
        this.props.onClick(this.props.details);
    }
}

export default FinAdminClubCard;