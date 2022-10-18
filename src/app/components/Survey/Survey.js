import React, { Component } from 'react';
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { SearchWidget } from '../Common/SearchWidget/SearchWidget';

//root component
import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { Util } from '../../Util/util';
import { Toast, riverToast } from '../Common/Toast/Toast';
import SurveyCard from './SurveyCard/SurveyCard';
import CastSurveyDialog from './CastSurveyDialog/CastSurveyDialog';
import CreateSurveyDialog from './CreateSurveyDialog/CreateSurveyDialog';
import ViewSurveyResultDialog from './ViewSurveyResultDialog/ViewSurveyResultDialog';
import { loadSurveyList } from './Survey.actions';

//service
import { SurveyService } from "./Survey.service";

//css
import './Survey.scss';

const mapStateToProps = (state, ownProps) => {
    return {
        surveys: state.SurveyReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSurveyList: (type, list) => {
            dispatch(loadSurveyList(type, list))
        }
    }
}

class Survey extends Component {
    state = {
        tabValue: 0,
        castSurveyDialog: false,
        createSurveyDialog: false,
        currentSurvey: "",
        editSurveyMode: false,
        finishedSurveyDialog: false,
        submitted: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.match.params.tabId){
            this.setState({ tabValue: parseInt(this.props.match.params.tabId) })
            if(this.props.match.params.surveyId){
                this.getSurvey(this.props.match.params.surveyId, true);
            }
        }
        this.loadCurrentTabList();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.tabValue != this.state.tabValue) {
            this.loadCurrentTabList();
        }
        if(this.state.castSurveyDialog || 
           this.state.createSurveyDialog ||
           this.state.finishedSurveyDialog) {
                this.handleDialogToggles();
        }
    }

    handleDialogToggles() {
        // handle opening two dialoges at a time
    }
    
    render() {
        const activeSurveysList = this.props.surveys.activeSurveysList.map((survey, index) => {
            return <SurveyCard
                        key = {index}
                        survey = {survey}
                        openSurveyDialogCallback= {this.openCastSurveyDialog.bind(this)}
                    />
        });

        const finishedSurveysList = this.props.surveys.finishedSurveysList.map((survey, index) => {
            return <SurveyCard
                        key = {index}
                        survey = {survey}
                        openSurveyDialogCallback= {this.openFinishedSurveyDialog.bind(this)}
                    />
        });

        const mySurveysList = this.props.surveys.mySurveysList.map((survey, index) => {
            return <SurveyCard
                        key = {index}
                        survey = {survey}
                        editable = {(survey.status == "inactive") ? true : false}
                        editSurveyCallback = {this.editSurvey.bind(this)}
                        openSurveyDialogCallback= {this.openCastSurveyDialog.bind(this)}
                    />
        });

        return (
            <Root role="user">
				<MainContainer>
                    <PageTitle title="Survey" />
                    <div className="row surveys-page">
                        <div className="col-md-12 surveys-page-container">
                            <AppBar
                                className="page-tabs-appbar"
                                position="static"
                                color="default"
                            >
                                <Tabs
                                    value={this.state.tabValue}
                                    onChange={this.handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label="Active" />
                                    <Tab label="My Surveys" />
                                    <Tab label="Finished" />
                                </Tabs>
                            </AppBar>
                            {/* <div className="row">
                                <div className="col-md-12 listing-extras">
                                    <SearchWidget onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)} />
                                </div>
                            </div> */}
                            {   
                                this.state.tabValue === 0 &&
                                (
                                    this.props.surveys.activeSurveysList.length > 0 ?
                                        <div className="surveys-tab-body surveys-active">
                                            {activeSurveysList}
                                        </div>
                                    : 
                                        <div className="empty-content-container">No surveys found</div>
                                )
                            }
                            {
                                this.state.tabValue === 1 &&
                                (
                                    this.props.surveys.mySurveysList.length > 0 ?
                                        <div className="surveys-tab-body surveys-mine">
                                            {mySurveysList}
                                        </div>
                                    : 
                                        <div className="empty-content-container">No surveys found</div>
                                )
                            }
                            {
                                this.state.tabValue === 2 &&
                                (
                                    this.props.surveys.finishedSurveysList.length > 0 ?
                                        <div className="surveys-tab-body surveys-finished">
                                            {finishedSurveysList}
                                        </div>
                                    : 
                                        <div className="empty-content-container">No surveys found</div>
                                )
                            }
                        </div>
                    </div>
                </MainContainer>
                <div className="bottom-fab-container create-survey-btn">
                    <Button 
                        title="Create A Survey"
                        fab
                        color="primary"
                        aria-label="add"
                        onClick={this.createSurveyDialogToggle.bind(this)}
                    >
                        <Icon>add</Icon>
                    </Button>
                </div>
                <CastSurveyDialog 
                    open = {this.state.castSurveyDialog}
                    onRequestClose = {this.castSurveyDialogToggle.bind(this)}
                    survey = {this.state.currentSurvey}
                    onSurveySubmitCallBack = {this.onSurveySubmit.bind(this)}
                />
                <CreateSurveyDialog
                    open = {this.state.createSurveyDialog}
                    onRequestClose = {this.createSurveyDialogToggle.bind(this)}
                    onSuccess = {this.loadCurrentTabList.bind(this)}
                    editMode = {this.state.editSurveyMode}
                    editSurvey = {this.state.editSurveyMode ? this.state.currentSurvey: false}
                />
                <ViewSurveyResultDialog
                    open = {this.state.finishedSurveyDialog}
                    onRequestClose = {this.finishedSurveyDialogToggle.bind(this)}
                    survey = {this.state.currentSurvey}
                />
			</Root>
        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    castSurveyDialogToggle() {
        var flag = !this.state.castSurveyDialog;
        this.setState({ castSurveyDialog: flag });
        if (!flag || this.state.submitted) {
            this.clearSurveyDialogState();
            this.setState({ submitted: false});
        }
    }

    createSurveyDialogToggle() {
        this.setState({ createSurveyDialog: !this.state.createSurveyDialog });
        if(this.state.editSurveyMode){
            this.setState({ editSurveyMode: false });
            this.clearSurveyDialogState();
        }
    }

    finishedSurveyDialogToggle() {
        this.setState({ finishedSurveyDialog: !this.state.finishedSurveyDialog })
        if (this.state.finishedSurveyDialog) {
            this.clearSurveyDialogState();
        }
    }

    editSurvey(survey) {
        this.setState({ 
            ...this.state,
            currentSurvey: survey,
            editSurveyMode: true
        })
        this.createSurveyDialogToggle();
    }

    clearSurveyDialogState(){
        this.setState({ currentSurvey: "" });
    }

    openCastSurveyDialog(survey) {
        this.setState({ currentSurvey: survey })
        this.castSurveyDialogToggle();
    }

    openFinishedSurveyDialog(survey) {
        this.setState({ currentSurvey: survey });
        this.finishedSurveyDialogToggle();
    }

    openSurveyDialog(survey) {
        switch (survey.status) {
            case "active":
                this.castSurveyDialogToggle();
                break;
            case "inactive":
                this.createSurveyDialogToggle();
                break;
            case "completed":
                this.finishedSurveyDialogToggle();
                break;
            default:
                this.clearSurveyDialogState();
                break;
        }
    }

    loadCurrentTabList(){
        const tabValue = this.state.tabValue;

        switch (tabValue) {
            case 0:
                this.loadActiveList();
                break;
            case 1:
                this.loadMyList();
                break;
            case 2:
                this.loadFinishedList();
                break;
            default:
                this.setState({ tabValue: 0 });
                break;
        }
    }
    
    loadActiveList() {
        SurveyService.getSurveys("user", "active", 0, 50)
        .then((data) => {
            this.props.loadSurveyList("ACTIVE", data);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching active surveys.");
        })
    }

    loadMyList() {
        SurveyService.getSurveys("user", "created", 0, 50)
        .then((data) => {
            this.props.loadSurveyList("MY", data);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching created surveys.");
        })
    }

    loadFinishedList() {
        SurveyService.getSurveys("user", "finished", 0, 50)
        .then((data) => {
            this.props.loadSurveyList("FINISHED", data);
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching finished surveys.");
        })
    }

    onSearch() {

    }

    onClearSearch() {
        
    }

    getSurvey(surveyId, openInDialog = false) {
        SurveyService.getSurvey(surveyId)
        .then((data) => {
            this.setState({ currentSurvey: data });

            if(openInDialog) {
                this.openSurveyDialog(data);
            }
        })
        .catch((error) => {
            riverToast.show(error.status_message || "Something went wrong while fetching survey");
            this.handleRequestClose();
        });
    }

    onSurveySubmit(surveyId, surveyObj) {
        this.castSurveyDialogToggle();
        this.loadCurrentTabList();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);