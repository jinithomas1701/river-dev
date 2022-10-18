import React, { Component } from 'react';
import { Root } from "../Layout/Root";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import PresidentMaster from './PresidentMaster/PresidentMaster';

class AnnouncementsClubMember extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Club Initiatives" />
                    <div>
                        <PresidentMaster president={false} />
                    </div>
                </MainContainer>
            </Root>

        )

    }
}
export default AnnouncementsClubMember
