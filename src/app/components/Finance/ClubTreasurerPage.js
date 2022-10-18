import React, { Component } from 'react';
import { Root } from "../Layout/Root";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import ClubTreasurerMaster from './ClubTreasurerMaster/ClubTreasurerMaster';

class ClubTreasurerPage extends Component {
    render() {
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Club Finance" />
                    <ClubTreasurerMaster />
                </MainContainer>
            </Root>
        )
    }
}

export default ClubTreasurerPage;