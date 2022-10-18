import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import { Icon } from "material-ui";
import moment from "moment";

import { riverToast } from "../../../../Common/Toast/Toast";
import LoadedButton from '../../../../Common/LoadedButton/LoadedButton';

import "./FinanceAdminSummary.scss";

class FinanceAdminSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditingOverallBudget: false,
            overallBudget: 0
        };
    }

    render() {
        const state = this.state;
        const props = this.props;

        return (
            <form className="finadmin-summary-budget">
                <p className="year">Financial Year: <span>{this.props.financialYear}</span></p>
                <h1 className="title">{props.title}</h1>
                <div className="budget">
                    {
                        props.location &&
                            <table>
                                <tbody>
                                    <tr>
                                        <th><p className="budget-label">Allocated Budget:</p></th>
                                        <td>
                                            {
                                                !state.isEditingOverallBudget && <span className="budget-coins">{props.currency} {props.totalBudget}</span>
                                            }
                                            {
                                                state.isEditingOverallBudget && <TextField
                                                    name="overallBudget"
                                                    margin="normal"
                                                    className="input-field"
                                                    type="number"
                                                    value={this.state.overallBudget}
                                                    onChange={this.handleNumberChange}
                                                />
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><p className="budget-label">Amount Spent:</p></th>
                                        <td><span className="budget-coins">{props.currency} {props.spent}</span></td>
                                    </tr>
                                    <tr>
                                        <th><p className="budget-label">Balance:</p></th>
                                        <td><span className="budget-coins">{props.currency} {props.balance}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                    }
                            <div className="submit-wrapper">
                                {
                                    (!state.isEditingOverallBudget && props.editable) && 
                                        <LoadedButton color="default" className="btn btn-default btn-edit" title="Edit" onClick={this.toggleOverallBudgetEdit}><Icon>edit</Icon></LoadedButton>
                                }
                                {
                                    state.isEditingOverallBudget &&
                                        <React.Fragment>
                                            <LoadedButton color="primary" className="btn btn-primary" title="Submit"><Icon>check</Icon></LoadedButton>
                                            <LoadedButton color="default" className="btn btn-default" title="Cancel" onClick={this.toggleOverallBudgetEdit}><Icon>close</Icon></LoadedButton>
                                        </React.Fragment>
                                }
                            </div>
                </div>
            </form>
        );
    }

    handleNumberChange = (event) => {
        const name = event.target.name;
        let value = parseInt(event.target.value, 10);
        if (isNaN(value)) {
            return;
        }
        value = value < 0 ? 0 : value;

        this.setState({ [name]: value });
    }

    toggleOverallBudgetEdit = () => {
        const isEditingOverallBudget = this.state.isEditingOverallBudget;
        if (isEditingOverallBudget) {
            this.setState({ isEditingOverallBudget: !isEditingOverallBudget });
        }
        else {
            this.setState({ isEditingOverallBudget: !isEditingOverallBudget, overallBudget: this.props.totalBudget });
        }
    }
}

FinanceAdminSummary.defaultProps = {
    title: "Summary",
    editable: false,
    location: undefined,
    totalBudget: 0,
    spent:0 ,
    balance: 0,
    currency: "INR",
    financialYear: new Date().getMonth()<=2 ? 
                    `${new Date().getFullYear()-1} - ${new Date().getFullYear()}` : 
                    `${new Date().getFullYear()} - ${new Date().getFullYear()+1}`
};

FinanceAdminSummary.propTypes = {
    title: PropTypes.string,
    editable: PropTypes.bool,
    location: PropTypes.object,
    totalBudget: PropTypes.number,
    spent: PropTypes.number,
    balance: PropTypes.number,
    currency: PropTypes.string,
    financialYear: PropTypes.string,
};

export default FinanceAdminSummary;