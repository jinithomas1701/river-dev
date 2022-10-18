import React, { Component } from 'react';
import {connect} from "react-redux";

// root component
import { Root } from '../../Layout/Root';

// custom component
import { Util } from '../../../Util/util';
import { MainContainer } from '../../Common/MainContainer/MainContainer';
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import VoiceMaster from './VoiceMaster/VoiceMaster';



// css
import './VoicePage.scss';

const ROLE_USER = "US";
const ROLE_PANEL = "PA";

class VoicePage extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.init();
    }

    render(){
        const voice = this.props.voice;

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Voice Your Noice" />
                    <div className="voicepage-wrapper">
                        <VoiceMaster mode={ROLE_USER} />
                    </div>
                </MainContainer>
            </Root>
        );
    }

    init(){
        //load user info here...
    }

}

export default VoicePage;