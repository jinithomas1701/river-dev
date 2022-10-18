import React, { Component } from 'react';
import { Root } from '../Layout/Root';
import { MainContainer } from '../Common/MainContainer/MainContainer';
import { PageTitle } from '../Common/PageTitle/PageTitle';
import ListMeetingsMaster from './ListMeetingsMaster/ListMeetingsMaster';

class ListMeetingsPage extends Component {
    render() {
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Meetings" />
                    <ListMeetingsMaster />
                </MainContainer>
            </Root>
        );
    }
}

export default ListMeetingsPage;