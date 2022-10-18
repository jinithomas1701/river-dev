import React, { Component } from 'react';
import moment from 'moment';

class Timer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //interval:null,
            startTime: moment(),
            currentTime: moment()
        }
    }

    componentDidMount() {
        
        this.tick();

    }

    render() {
        //let interval;
        let duration;
        
        if (this.props.startTime && !this.props.stopTimer) {
            //interval = setInterval(() => this.tick(), 1000);
            const state = this.state;
            
            const startTime = moment(this.props.startTime);
            let diff = state.currentTime.diff(startTime);
            duration = moment.duration(diff);
            
        }
        if (this.props.stopTimer && this.props.startTime) {
            clearTimeout(this.interval);
            const startTime = moment(this.props.startTime);
            const stopTime = moment(this.props.stopTimer);
            let diff = stopTime.diff(startTime);
            duration = moment.duration(diff);
        }

        const days = duration._data.days ? `${duration._data.days} days: ` : '';
        const hours = duration._data.hours ? `${duration._data.hours} hr: ` : '';
        const minutes = `${duration._data.minutes} min: `;
        const seconds = `${duration._data.seconds} sec`;

        return (
            <div>
                <span>{days}{hours}{minutes}{seconds}</span>
            </div>
        );
    }

    tick = () => {
        this.setState({ currentTime: moment() });

        this.interval = setTimeout(() => this.tick(), 1000);
    }


}

export default Timer;