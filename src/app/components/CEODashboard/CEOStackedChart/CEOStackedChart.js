import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import moment from 'moment';

// custom component
import { Util } from "../../../Util/util";
import { riverToast } from '../../Common/Toast/Toast';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';

// css
import "./CEOStackedChart.scss";

const chartOptions = {
    vAxis: {
        title: 'Voices',
        titleTextStyle: {
            color: '#666',
            fontSize: 12 ,
            italic: false
        },
        textStyle: {
            color: '#666',
            fontSize: 11 ,
        }
    },
    hAxis: {
        textStyle: {
            color: '#666',
            fontSize: 10
        }
    },
    legend: {
        alignment: 'end',
        textStyle: {
            color: '#666',
            fontSize: 11 ,
        }
    },
    chartArea: {
        width: '60%'
    },
    isStacked: true,
    connectSteps: false,
    backgroundColor: 'transparent',
    areaOpacity: 1,
    colors: ['#D40000', '#E27100', '#71E37A', '#FF9E9E', '#59997D']
};

const CEOStackedChart = (props) => {
    return (
        <div className="stackedchart-wrapper">
            <Chart
                width={"100%"}
                height={'300px'}
                chartType="SteppedAreaChart"
                loader={<div>Loading Chart</div>}
                data={props.chart}
                options={chartOptions}
                rootProps={{ 'data-testid': '1' }}
                />
            <LoaderOverlay show={props.loading} />
        </div>
    );
};

CEOStackedChart.defaulProps = {
    chart: [],
    bool: false
};

CEOStackedChart.propTypes = {
    chart: PropTypes.array.isRequired,
    loading: PropTypes.bool
};

export default CEOStackedChart;