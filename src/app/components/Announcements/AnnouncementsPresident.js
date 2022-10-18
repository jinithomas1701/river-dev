import React, { Component } from 'react';

import { Root } from "../Layout/Root";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import PresidentMaster from './PresidentMaster/PresidentMaster';
import { Util } from '../../Util/util';

const PRIVILEGE_PRESIDENT_ANNOUNCEMENT = "VIEW_CLUB_PRESIDENT_ANNOUNCEMENT";

class AnnouncementsPresident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPresident: false
        };
    }

    componentDidMount() {
        const isPresident = Util.hasPrivilage(PRIVILEGE_PRESIDENT_ANNOUNCEMENT);
        this.setState({ isPresident });
    }

    componentDidUpdate(prevProps, prevState) {
        const currState = this.state;
        const isPresident = Util.hasPrivilage(PRIVILEGE_PRESIDENT_ANNOUNCEMENT);
        if (prevState.isPresident !== isPresident) {
            this.setState({ isPresident });
        }
    }

    render() {

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Club Initiatives" />
                    <div>
                        <PresidentMaster president={this.state.isPresident} />
                    </div>
                </MainContainer>
            </Root>
        )
    }
}
export default AnnouncementsPresident
