import React from "react";

import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";

export class Home extends React.Component {

    render() {
        return (
			<Root role="user">
				<MainContainer>
                    <h4>Home</h4>
                </MainContainer>
			</Root>
        );
    }
}