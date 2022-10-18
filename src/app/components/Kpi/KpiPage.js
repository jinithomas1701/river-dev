import React, {Component} from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

// root component
import {Root} from "../Layout/Root";

// custom component
import {Util} from "../../Util/util";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {riverToast} from '../Common/Toast/Toast';
import KpiMaster from './KpiMaster/KpiMaster';

// css
import "./KpiPage.scss";


class KpiPage extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (<Root role="admin">
                <MainContainer>
                    <PageTitle title="Line Items" />
                    <div className="kpipage-wrapper">
                        <KpiMaster />
                    </div>
                </MainContainer>
            </Root>);
    }
}

export default KpiPage;