import React, { Component} from 'react';
import {Root} from "../Layout/Root";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import CfoMaster from './CfoMaster/CfoMaster';

class CfoPage extends Component{
    render(){
        return (          
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Club Finance"/>
                        <CfoMaster />
                </MainContainer>
            </Root>
        )
    }
}

export default CfoPage;