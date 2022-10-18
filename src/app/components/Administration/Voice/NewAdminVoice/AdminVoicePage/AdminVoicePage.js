import React, {Component} from 'react';
import {connect} from "react-redux";
import moment from 'moment';

import {Root} from "../../../../Layout/Root";
import {MainContainer} from "../../../../Common/MainContainer/MainContainer";
import {PageTitle} from "../../../../Common/PageTitle/PageTitle";
import {Util} from "../../../../../Util/util";
import {riverToast} from "../../../../Common/Toast/Toast";
import {SearchWidget} from "../../../../Common/SearchWidget/SearchWidget";
import VoiceTile from "../VoiceTile/VoiceTile";

import AdminVoicePageService from "../AdminVoiceDetails.service";
import "./AdminVoicePage.scss";

const mapStateToProps = (state) => {
    return {
        voiceData: state.AdminVoiceDetailsReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDepartmentDetails: () => {
            dispatch({
                type: "ADMIN_VOICE_DETAILS_DEPARTMENT_DETAILS_CHANGE",
                payload: null
            })
        }
    };
};

class AdminVoicePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            searchText: "",
            departmentList: []
        };
    }

    componentDidMount(){
        this.init();
        this.props.setDepartmentDetails();
    }

    render(){
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Voice Settings"/>
                    <div className="adminvoice-page-wrapper">
                        <div className="row">
                            <div className="col-md-12">
                                <SearchWidget
                                    withButton={true}
                                    onClear={this.onClearSearch.bind(this)}
                                    onSearch={this.onSearch.bind(this)}
                                    />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="voice-list-wrapper">
                                    { this.state.departmentList.map(department => <VoiceTile key={department.code} department={department} />) }
                                </div>
                            </div>
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    onClearSearch = () => {
        this.setState({searchText: ""});
    }

    onSearch = (searchText) => {
        this.setState({searchText: searchText});
    }

    init = () => {
        this.loadVoiceDepartmentList();
    }

    loadVoiceDepartmentList = () => {
        AdminVoicePageService.getVoiceDepartments()
            .then(departmentList => {
            this.setState({departmentList});
        })
            .catch(error => {
            riverToast.show(error.status_message || "Something went wrong while loading voice departments.");
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminVoicePage);