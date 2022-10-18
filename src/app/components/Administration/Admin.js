import React from "react";

import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";

import AdminPage from "./AdminPage";

export class Admin extends React.Component {

    render() {
        return (
			<Root role="admin">
				<MainContainer>
                  <AdminPage/>
                </MainContainer>
			</Root>
        );
    }
}