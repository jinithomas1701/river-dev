import React, { Component } from 'react';
import { Root } from '../Layout/Root';
import { MainContainer } from '../Common/MainContainer/MainContainer';
import { PageTitle } from '../Common/PageTitle/PageTitle';
import ViewMeetingsMaster from './ViewMeetingsMaster/ViewMeetingsMaster';

class ViewMeetingsPage extends Component {
    render() {
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Meeting Details" />
                    <ViewMeetingsMaster />
                </MainContainer>
            </Root>
        );
    }
}

export default ViewMeetingsPage;