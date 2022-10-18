import React from 'react';
import { connect } from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

// root component
import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { Toast, riverToast } from '../Common/Toast/Toast';
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { SearchWidget } from '../Common/SearchWidget/SearchWidget';
import { Util } from "../../Util/util";

// page dependency
import NominateDialog from "./Dialogs/NominateDialog";
import PollingDialog from "./Dialogs/PollingDialog";
import ResultDialog from "./Dialogs/ResultDialog";
import PollContainer from "./Components/PollContainer/PollContainer";
import { PollsServices } from "./Polls.service";
import { loadPollsList,
         loadNominationActivePolls,
         loadElectionActivePolls, 
         loadCompletedPolls,
         clearPollsList } from "./Polls.action";
// css
import "./Polls.scss"

const mapStateToProps = (state, ownProps) => {
    return {
        polls: state.UserPollsReducer
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadPollsList: (list) => {
            dispatch(loadPollsList(list))
        },
        loadNominationActivePolls: (list) => {
            dispatch(loadNominationActivePolls(list))
        },
        loadElectionActivePolls: (list) => {
            dispatch(loadElectionActivePolls(list))
        },
        loadCompletedPolls: (list) => {
            dispatch(loadCompletedPolls(list))
        },
        clearPollsList: () => {
            dispatch(clearPollsList())
        }
    }
}

class Polls extends React.Component {

    emptyPoll = {
        allMemberFlag:"",
        clubId:"",
        createdDate:"",
        description:"",
        electionEndDate:"",
        electionStartDate:"",
        electionStatus:"",
        id:"",
        isNominated:"",
        nominationEndDate:"",
        nominationStartDate:"",
        nominationStatus:"",
        nominees:[],
        resultPublished:"",
        title:"",
        visibility:"",
        voters:[],
        winner:{}
    }

    state = {
        poll: "",
        nominateDialogueState: false,
        pollDialogueState: false,
        ResultDialogueState: false,
        tabValue: 0
    }

    pollsList = [];

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.match.params.tabId){
            this.setState({ tabValue: parseInt(this.props.match.params.tabId) })
        }
        this.loadCurrentTabList();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.tabValue != this.state.tabValue) {
            this.loadCurrentTabList();
        }
    }

    render() {
        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Polls" />
                    
                    <div className="row">
                        <div className="col-md-12 polls-page-container">
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
                                    <Tab label="Nominations Open" />
                                    <Tab label="Polling Open" />
                                    <Tab label="Winner Declared" />
                                </Tabs>
                            </AppBar>
                            {/* <div className="row">
                                <div className="col-md-12 listing-extras">
                                    <SearchWidget withButton={false} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)} />
                                </div>
                            </div> */}
                            {   
                                this.state.tabValue === 0 && 
                                <div className="polls-tab-body nominations">
                                        <PollContainer
                                            type="nominations"
                                            title="Nominations Open"
                                            polls={this.props.polls.pollsList}
                                            doActionCallback={this.doNominateMe.bind(this )}/>
                                    </div>
                            }
                            {
                                this.state.tabValue === 1 && 
                                    <div className="polls-tab-body election">
                                        <PollContainer
                                            type="elections"
                                            title="Polling Open"
                                            polls={this.props.polls.pollsList}
                                            doActionCallback={this.doVote.bind(this )}/>
                                    </div>
                            }
                            {
                                this.state.tabValue === 2 && 
                                <div className="polls-tab-body result-declared">
                                        <PollContainer
                                            type="elected"
                                            title="Election Closed"
                                            polls={this.props.polls.pollsList}
                                            doActionCallback={this.viewResult.bind(this )}/>
                                    </div>
                            }
                        </div>
                    </div>
                </MainContainer>
                <NominateDialog
                    open={this.state.nominateDialogueState}
                    closeDialogCallback={this.closeDialog.bind(this)}
                    confirmNominateCallBack={this.confirmNominate.bind(this)}
                    description={this.state.poll.description}/>
                <PollingDialog 
                    open={this.state.pollDialogueState}
                    closeDialogCallback={this.closeDialog.bind(this)}
                    onVoteCallBack={this.markVote.bind(this)}
                    poll={this.state.poll}/>
                <ResultDialog
                    open={this.state.ResultDialogueState}
                    closeDialogCallback={this.closeDialog.bind(this)}
                    onVoteCallBack={this.markVote.bind(this)}
                    poll={this.state.poll}/>  
            </Root>
        );
    }

    handleTabChange = (event, value) => {
        this.props.clearPollsList();
        this.setState({ tabValue: value });
    };

    closeDialog(dialogType){
        this.setState({ poll: "" });        
        switch(dialogType){
            case "Nominate":
                this.setState({ nominateDialogueState: false });
                break;
            case "Poll":
                this.setState({ pollDialogueState: false });
                break;
            case "Result":
                this.setState({ ResultDialogueState: false });
                break;
        }
    }
    
    doNominateMe(poll){
        this.setState({ poll: poll });
        this.setState({ nominateDialogueState: true });
    }

    doVote(poll){
        this.setState({ poll: poll });
        this.setState({ pollDialogueState: true });
    }

    viewResult(poll){
        this.setState({ poll: poll });
        this.setState({ ResultDialogueState: true });
    }

    loadCurrentTabList(){
        const tabValue = this.state.tabValue;

        switch (tabValue) {
            case 0:
                this.loadNominationsList();
                break;
            case 1:
                this.loadElectionList();
                break;
            case 2:
                this.loadDeclaredList();
                break;
            default:
                this.setState({ tabValue: 0 });
                break;
        }
    }

    onSearch(searchKey) {
        const filteredPolls = this.filterItems(searchKey, this.pollsList);
        this.props.loadPollsList(filteredPolls);
    }

    onClearSearch() {
        this.props.loadPollsList(this.pollsList);
    }

    loadNominationsList() {
        this.getPolls("nomination");
    }

    loadElectionList() {
        this.getPolls("election");
    }
    
    loadDeclaredList() {
        this.getPolls("winner");
    }

    getPolls(type) {
        PollsServices.getPollsList(type)
            .then((data) => {
                this.props.loadPollsList(data);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching polls");
            });
    }

    processResponsePollsList(polls) {
        this.props.loadPollsList(polls);
        const onNominationPollsList = [];
        const onElectionPollsList = [];
        const completedPolls = [];
        polls.forEach(function(poll) {
            if (poll.nominationStatus == "Nomination is active") {
                onNominationPollsList.push(poll);
            } else if (poll.electionStatus == "Election is active" && poll.nominees.length > 0) {
                onElectionPollsList.push(poll);
            } else if (poll.electionStatus == "Election over") {
                completedPolls.push(poll);
            }
        }, this);
        this.props.loadNominationActivePolls(onNominationPollsList);
        this.props.loadElectionActivePolls(onElectionPollsList);
        this.props.loadCompletedPolls(completedPolls);
    }

    getPollsList() {
        PollsServices.getPollsList()
            .then((data) => {
                this.processResponsePollsList(data);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching polls");
            })
    }

    confirmNominate(){
        if(this.state.poll){
            PollsServices.doNominate(this.state.poll.id)
            .then((data) => {
                riverToast.show("Nomination success");
                this.closeDialog("Nominate");
                this.getPollsList();            
            })
            .catch((error) => {
                riverToast.show("Something went wrong while nominating")
            })
        } else {
            riverToast.show("Please try again");
        }
    }

    markVote(candidateId){
        const candidate = {
            candidateId: candidateId
        }
        PollsServices.markVote(this.state.poll.id, candidate)
        .then((data) => {
            riverToast.show("Your vote done successfully.");
            this.closeDialog("Poll")
            this.getPollsList();
        })
        .catch((error) => {
            riverToast.show("Something went wrong while voting")
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Polls);