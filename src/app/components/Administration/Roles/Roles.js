import React from "react";
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import moment from "moment";


//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { SelectBox } from "../../Common/SelectBox/SelectBox";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';

import { RolesService } from "./Roles.service";

import "./Roles.scss";

export default class Roles extends React.Component {
    state = {
        roleList: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadAllRoles();
    }

    render() {
        const roleList = this.state.roleList.map((role, index) => {
            return <div key={index} className="role-comp">
                        <div className="role-title">{role.name}</div>
                        <div className="role-desc">{role.description}</div>
                    </div>;
        });
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="What does each role mean ?" />
                    <div className="row">
                        <div className="col-md-12 title-action">
                            <Button color="primary" onClick={this.onBackClick.bind(this)}>Back</Button>
                        </div>
                    </div>
                    <div className="row roles">
                            <div className="col-md-12">
                                <div className="role-container">
                                    {roleList}
                                </div>
                            </div>
                            {this.state.roleList.length <= 0 &&
                                <div className="col-md-12 flex-container user-polls-listing">
                                    <div className="empty-content-container">No roles found</div>
                                </div> 
                            }
                    </div>
                </MainContainer>
            </Root>
        );
    }

    onBackClick() {
        window.history.back();
    }

    loadAllRoles() {
        RolesService.getRoles()
            .then(data => {
                this.setState({roleList: data});
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while getting roles");
            })
    }

}