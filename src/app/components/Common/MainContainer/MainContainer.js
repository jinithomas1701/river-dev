import React from "react";
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Toast, riverToast } from '../Toast/Toast';
import { CommonService } from "../../Layout/Common.service";
import {Util} from "../../../Util/util";

import {SelectBox} from "../../Common/SelectBox/SelectBox";

import './MainContainer.scss';

export class MainContainer extends React.Component {
    render() {
        return (
            <div className="col-md-12">
                {this.props.children}
            </div>
        )
    }
}