import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import {connect} from "react-redux";
import { Toast, riverToast } from '../Common/Toast/Toast';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

// root component
import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { SearchWidget } from '../Common/SearchWidget/SearchWidget';
import { VoiceCard } from "./VoiceCard/VoiceCard.js"

// page dependency
import { storeVoiceList } from "./Voice.actions"
import { VoiceService } from "./Voice.service"
import {Util} from "../../Util/util";
// CSS
import './Voice.scss'

const mapStateToProps = (state) => {
    return {
        voice: state.VoiceReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeVoiceList: (list) => {
            dispatch(storeVoiceList(list))
        }
    }
}

const PRIVILAGE_CREATE_VOICE = "CREATE_VOICE";

class Voice extends React.Component {

    state = {
        tabValue: 0
    }

    voiceList = [];

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadCurrentTabList();
    }


    componentDidUpdate(prevProps, prevState){
        if(prevState.tabValue != this.state.tabValue) {
            this.loadCurrentTabList();
        }
    }

    render() {

        const voiceCards = this.props.voice.voiceList.map((voice, index) => {
            return <VoiceCard key={index} voice={voice} deleteCallback={this.onDeleteVoice.bind(this)} voiceClickCallback={this.onVoiceClick.bind(this, voice)}/>;
        });

        return ( 
			<Root role="user">
				<MainContainer>
                    <PageTitle title="Voice" />
                    <div className="row">
                        <div className="col-md-12">
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
                                    <Tab label="In Progress" />
                                    <Tab label="Accepted or rejected" />
                                    <Tab label="Resolved" />
                                </Tabs>
                            </AppBar>
                            <div className="row margin-top-1">
                                <div className="col-md-12 listing-extras">
                                    <SearchWidget withButton={false} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 flex-container voices-tabs-container">
                                    {   
                                        this.state.tabValue === 0 && 
                                            <div className="voices-tab-body voices-inprogress flex-container w-full">
                                                {
                                                    (voiceCards.length > 0) ?
                                                        voiceCards :
                                                        <div className="empty-content-container">No voices found</div>
                                                }
                                            </div>
                                    }
                                    {
                                        this.state.tabValue === 1 && 
                                            <div className="voices-tab-body voices-rejected flex-container w-full">
                                                {
                                                    (voiceCards.length > 0) ?
                                                        voiceCards :
                                                        <div className="empty-content-container">No voices found</div>
                                                }
                                            </div>
                                    }
                                    {
                                        this.state.tabValue === 2 && 
                                            <div className="voices-tab-body voices-completed flex-container w-full">
                                                {
                                                    (voiceCards.length > 0) ?
                                                        voiceCards :
                                                        <div className="empty-content-container">No voices found</div>
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                        {Util.hasPrivilage(PRIVILAGE_CREATE_VOICE) &&
                            <div className="bottom-fab-container make-voice-fab">
                                <Button title="Make A Voice" fab color="primary" aria-label="add" onClick={this.handleMakeVoice.bind(this)}>
                                    <Icon>record_voice_over</Icon>
                                </Button>
                            </div>
                        }
                    </div>
                </MainContainer>
			</Root>
        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    onSearch(searchKey) {
        const filteredVoices = this.filterItems(searchKey, this.voiceList);
        this.props.storeVoiceList(filteredVoices);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
    }

    onClearSearch() {
        this.props.storeVoiceList(this.voiceList);
    }

    handleMakeVoice(){
        this.props.history.push("/voices/detail");
    }

    processVoiceListResponse(voiceList) {
        this.props.storeVoiceList(voiceList);
    }

    onDeleteVoice(voice) {
        if(confirm("Are you sure?")){
            VoiceService.deleteVoice(voice.voiceId, voice.voiceHash)
            .then((data) => {
                riverToast.show("Deleted successfully");
                this.loadVoiceList();
            })
        }
    }

    onVoiceClick(voice) {
        this.props.history.push("voices/detail/" + voice.voiceId + "/" + voice.voiceHash);        
    }

    loadCurrentTabList(){
        const tabValue = this.state.tabValue;

        switch (tabValue) {
            case 0:
                this.loadInProgressList();
                break;
            case 2:
                this.loadResolvedList();
                break;
            case 1:
                this.loadCompletedList();
                break;
            default:
                this.setState({ tabValue: 0 });
                break;
        }
    }

    loadInProgressList(pageNo, size) {
        this.loadVoiceList("inProgress", pageNo, size);
    }

    loadResolvedList(pageNo, size) {
        this.loadVoiceList("resolved", pageNo, size);
    }

    loadCompletedList(pageNo, size) {
        this.loadVoiceList("acceptedOrRejected", pageNo, size);
    }

    loadVoiceList = (status, pageNo, size) => {
        const urlTail = ("?status=" + status) + (pageNo ? (("&&page=" + pageNo) + (size ? ("&&size=" + size) : "")) : "");
        VoiceService.getVoices(urlTail).
        then((data) => {
            if(data) {
                this.voiceList = data;
                this.processVoiceListResponse(data);
            }
        }).
        catch((error) => {
            riverToast.show("Something went wrong", error);
        })
    }

    processDeleteVoice(voice) {
        const voicesList = this.props.voice.voiceList;

        let deletedIndex = -1;
        this.props.voices.voicesList.forEach(function(voiceObj, index) {
            if(voiceObj.id == voice.id) {
                deletedIndex = index;
            }
        }, this);
        voicesList.splice(deletedIndex, 1);
        this.props.storeVoicesList(voicesList);
        riverToast.show("Voice deleted successfully");
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Voice);