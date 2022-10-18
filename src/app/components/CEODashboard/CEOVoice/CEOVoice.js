import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import moment from 'moment';

// custom component
import { Util } from "../../../Util/util";
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { riverToast } from "../../Common/Toast/Toast";
import CEOStackedChart from "../CEOStackedChart/CEOStackedChart";
import CEOVoiceSummary from "../CEOVoiceSummary/CEOVoiceSummary";
import VoiceMaster from "../../Voice/NewVoice/VoiceMaster/VoiceMaster";

// css
import "./CEOVoice.scss";

import { setCEOVoiceDetails, setCEOVoiceChart, resetCEOVoiceDetails, resetCEOVoiceChart } from "./CEOVoice.actions";
import { CEOVoiceService } from "./CEOVoice.service";

const mapStateToProps = (state, ownProps) => {
    return {
        ceoVoice: state.CEOVoiceReducer
    }
};

const mapDispatchTpProps = (dispatch, ownProps) => {
    return {
        setCEOVoiceDetails: (summary) => { dispatch(setCEOVoiceDetails(summary)) },
        setCEOVoiceChart: (chart) => { dispatch(setCEOVoiceChart(chart)) },
        resetCEOVoiceDetails: (summary) => { dispatch(resetCEOVoiceDetails()) },
        resetCEOVoiceChart: (chart) => { dispatch(resetCEOVoiceChart()) }
    };
};

const ROLE_CEO = "CEO";

const GROUPBY_YEAR = "Y";
const GROUPBY_MONTH = "M";
const GROUPBY_WEEK = "W";
const GROUPBY_DAY = "D";

class CEOVoice extends Component{
    constructor(props){
        super(props);
        this.state = {
            apiLoading: false,
            currentInterval: 1,
            filter: this.setInitialFilter()
        };

        this.intervalList = this.getIntervalList();

        this.handleIntervalChange = this.handleIntervalChange.bind(this);
    }

    componentDidMount(){
        this.init();
    }

    render(){
        const props = this.props;
        const ceoVoice = props.ceoVoice;

        return (
            <div className="ceo-voice-wrapper">
                <div className="row">
                    <div className="col-md-3">
                        <SelectBox
                            classes="input-filter"
                            label="Filter"
                            selectedValue = {this.state.currentInterval}
                            selectArray={this.intervalList}
                            onSelect={this.handleIntervalChange}
                            />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <CEOStackedChart chart={ceoVoice.chart} loading={this.state.apiLoading} />
                    </div>
                    <div className="col-md-4">
                        <CEOVoiceSummary {...ceoVoice.summary} loading={this.state.apiLoading} />
                    </div>
                </div>
                <div className="voice-list">
                    <VoiceMaster mode={ROLE_CEO} />
                </div>
            </div>
        );
    }

    init(){
        this.loadVoiceStats(this.state.filter);
    }

    setInitialFilter(){
        const today = moment();
        const startDate = moment(today).startOf('year');
        const endDate = moment(today);
        const grouping = GROUPBY_MONTH;

        return {startDate, endDate, grouping};
    }

    getIntervalList(){
        const today = moment();
        const thisMonth = today.month();
        const thisYear = today.year();
        let interval = [];
        const optionThisYear = {
            title: `This Year (${thisYear})`,
            value: 1,
            startDate: moment(today).startOf("year"),
            endDate: today,
            grouping: GROUPBY_MONTH
        };
        const optionLast12Months = {
            title: `Last 1 Year`,
            value: 0,
            startDate: moment(today).subtract(1, "year"),
            endDate: today,
            grouping: GROUPBY_MONTH
        };
        interval = [optionLast12Months, optionThisYear];

        return interval;
    }

    getFilter(filterListvalue){
        const today = moment();
        const thisMonth = today.month();
        const thisYear = today.year();
        let temp = this.intervalList.find(item => item.value === filterListvalue);

        const startDate = temp.startDate;
        const endDate = temp.endDate;
        const grouping = temp.grouping;

        return {startDate, endDate, grouping};
    }

    processChartData(breakDowns){
        let chartData = [['Director (Year)', 'ESCALATED', 'PENDING', 'IN-PROGRESS', 'REJECTED', 'RESOLVED']];
        const tempList = breakDowns.map(item => {
            return [item.label, item.escalated, item.pending, item.inProgress, item.rejected, item.resolved];
        });
        chartData = [...chartData, ...tempList];
        return chartData;
    }

    handleIntervalChange(currentInterval){
        const filter = this.getFilter(currentInterval);
        this.setState({currentInterval, filter});
        this.loadVoiceStats(filter);
    }

    loadVoiceStats({grouping, startDate, endDate}){
        const props = this.props;

        props.resetCEOVoiceDetails();
        props.resetCEOVoiceChart();
        this.setState({apiLoading: true});

        CEOVoiceService.getVoiceStats(grouping, startDate, endDate)
            .then(details => {
            let breakDowns = [], summary, chart;
            if(details){
                ({breakDowns, ...summary} = details);
                chart = this.processChartData(breakDowns);
                props.setCEOVoiceChart(chart);
                props.setCEOVoiceDetails(summary);
            }
            this.setState({apiLoading: false});
        })
            .catch(error => {
            this.setState({apiLoading: false});
            riverToast.show(error.status_message || 'Something went wrong while loading CEO voice stats.');
        });
    }
}

export default connect(mapStateToProps, mapDispatchTpProps)(CEOVoice);