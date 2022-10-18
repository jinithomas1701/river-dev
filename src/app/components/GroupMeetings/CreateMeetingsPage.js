import React, { Component } from 'react';
import { Root } from '../Layout/Root';
import { MainContainer } from '../Common/MainContainer/MainContainer';
import { PageTitle } from '../Common/PageTitle/PageTitle';
import CreateMeetingsMaster from './CreateMeetingsMaster/CreateMeetingsMaster';

class CreateMeetingsPage extends Component {
    render() {
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Schedule Meeting" />
                    <CreateMeetingsMaster />
                </MainContainer>
            </Root>
        );
    }
}

export default CreateMeetingsPage;