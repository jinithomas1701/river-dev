import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Util} from '../../../Util/util';

import './ActivityListTemplate.scss';

class ActivityListTemplate extends Component{
    constructor(props){
        super(props);

        this.state = {
        };
    }

    render = () => {
        const props = this.props;

        return (
            <div className="list-item-i">
                {props.id}
            </div>
        );
    }

    myClick = () => {
        console.log(this.props.id);
    }
}

ActivityListTemplate.defaultProps = {
};

ActivityListTemplate.propTypes = {
}

export default ActivityListTemplate;