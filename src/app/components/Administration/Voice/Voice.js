import React from "react";
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { VoiceAdminCard} from './VoiceCard/VoiceCard';
import { Toast, riverToast } from '../../Common/Toast/Toast';

import {VoiceAdminService} from "./Voice.service";
import {setVoiceList} from "./Voice.actions";

import './Voice.scss';

const mapStateToProps = (state) => {
    return {
        voice: state.VoiceAdminReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setVoiceList: (list) => {
            dispatch(setVoiceList(list))
        }
    };
};

class VoiceAdmin extends React.Component {

    state = {
        tabValue: 0
    };

    voiceList = [];
    
    componentDidMount() {
        this.loadCurrentTabList();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.tabValue != this.state.tabValue) {
            this.loadCurrentTabList();
        }
    }

    render() {

        const voiceList = this.props.voice.voiceList.map((voice, index) => {
            return <VoiceAdminCard onVoiceClick={this.onVoiceClick.bind(this, voice)} key={index} voice={voice}  deleteCallback={this.onVoiceDelete.bind(this)}/>
        });

        return ( 
			<Root role="admin"> 
				<MainContainer>
                    <PageTitle title="Voices" />
                    <div className="row voices-admin">
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
                            <div className="row">
                                <div className="col-md-12 listing-extras">
                                    <SearchWidget withButton={false} onClear={this.onClearSearch.bind(this)} onSearch={this.onSearch.bind(this)}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 flex-container voices-tabs-container">
                                    {   
                                        this.state.tabValue === 0 && 
                                            <div className="voices-tab-body voices-inprogress flex-container w-full">
                                                {
                                                    (voiceList.length > 0) ?
                                                        voiceList :
                                                        <div className="empty-content-container">No voices found</div>
                                                }
                                            </div>
                                    }
                                    {
                                        this.state.tabValue === 1 && 
                                            <div className="voices-tab-body voices-completed flex-container w-full">
                                                {
                                                    (voiceList.length > 0) ?
                                                    voiceList :
                                                        <div className="empty-content-container">No voices found</div>
                                                }
                                            </div>
                                    }
                                    {
                                        this.state.tabValue === 2 && 
                                            <div className="voices-tab-body voices-rejected flex-container w-full">
                                                {
                                                    (voiceList.length > 0) ?
                                                        voiceList :
                                                        <div className="empty-content-container">No voices found</div>
                                                }
                                            </div>
                                    }
                                </div>
                            </div>                            
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    filterItems(query, array) {
        return array.filter((el) => {
            return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
    }

    onSearch(searchKey) {
        const filteredVoices = this.filterItems(searchKey, this.props.voice.voiceList);
        this.props.setVoiceList(filteredVoices);
    } 

    onClearSearch() {
        this.props.setVoiceList(this.voiceList);
    }
    
    onVoiceClick(voice) {
        this.props.history.push("/admin/voices/detail/"+voice.voiceId+"/"+voice.voiceHash);
    }

    onVoiceDelete() {
        riverToast.show("To be implemented");
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
        this.getVoiceList("inProgress", pageNo, size);
    }

    loadResolvedList(pageNo, size) {
        this.getVoiceList("resolved", pageNo, size);
    }

    loadCompletedList(pageNo, size) {
        this.getVoiceList("acceptedOrRejected", pageNo, size);
    }

    getVoiceList(status, pageNo, size) {
        const urlTail = ("?status=" + status) + (pageNo ? (("&&page=" + pageNo) + (size ? ("&&size=" + size) : "")) : "");        
        VoiceAdminService.getVoices(urlTail)
            .then(data => {
                this.voiceList = data;
                this.props.setVoiceList(data);
            })
            .catch(error => {
                riverToast.show(error.status_message);
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceAdmin);