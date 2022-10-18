import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import moment from 'moment';
import Datetime from 'react-datetime';

// custom component
import {Util} from "../../../Util/util";

// css
import "./ClaimPeriodInput.scss";

class ClaimPeriodInput extends Component{
    constructor(props){
        super(props);
        this.state = {};
        this.dateOptions = {
            placeholder: 'Claim Period',
            className:"claim-input"
        };
        this.startDay = this.getStartDate();

        this.isDateValid = this.isDateValid.bind(this);
    }

    render(){
        const props = this.props;
        const now = moment();
        return (
            <div className="input-claimperiod">
                <span className="label">{props.label || "\u00A0"}</span>
                <Datetime
                    defaultValue={now}
                    isValidDate={this.isDateValid}
                    dateFormat="YYYY-MM"
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={this.dateOptions}
                    onChange={props.onChange}
                    value={props.value}
                    />
                    <Icon className="calender-icon">today</Icon>
            </div>
        );
    }

    isDateValid( current ){
        const nextMonth = moment().add(1, "month").startOf("month");
        return (current.isSameOrAfter(this.startDay) && current.isBefore(nextMonth));
    }

    getStartDate(){
        const today = moment();
        const financialStart = moment(0, "HH").month(2).startOf("month");
        let startDate;
        if(today.isSameOrAfter(financialStart)){
            startDate = financialStart;
        }
        else if(today.isBefore(financialStart)){
            startDate = moment(0, "HH").subtract(1, "year").month(2).startOf("month");
        }

        return startDate;
    }
}

ClaimPeriodInput.defaultProps = {
    label: "Claim Period"
};

ClaimPeriodInput.propTypes = {
    value: PropTypes.number,
    label: PropTypes.string,
    onChange: PropTypes.func,
};

export default ClaimPeriodInput;