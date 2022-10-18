import React, {Component} from 'react';
import {connect} from "react-redux";
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Tooltip from 'material-ui/Tooltip';
import {SearchWidget} from '../Common/SearchWidget/SearchWidget';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
//root component
import {Root} from "../Layout/Root";

// custom component
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {Util} from '../../Util/util';
import {Toast, riverToast} from '../Common/Toast/Toast';
import LitUpCreateDialog from './LitUpCreateDialog/LitUpCreateDialog';
import {UserChipMultiSelect} from '../Common/UserChipMultiSelect/UserChipMultiSelect';

import LitUpSuggestDialog from './LitUpSuggestDialog/LitUpSuggestDialog';
import LitUpSuggestionViewDialog from './LitUpSuggestionViewDialog/LitUpSuggestionViewDialog';
import LitUpWorkshopDialogDialog from './LitUpWorkshopDialog/LitUpWorkshopDialog';
import LitUpVerifyDialog from './LitUpVerifyDialog/LitUpVerifyDialog';
import LitUpVoteDialog from './LitUpVoteDialog/LitUpVoteDialog';

import {
    setLitUpTopics,
    setLitUpTopicDetails,
    setUserSearchResult,
    setUserSelectedResult,
    setVoteData,
    clearPanelData
} from './LitUp.actions';

//service
import {LitUpService} from "./LitUp.service";

//css
import './LitUp.scss';
import IconButton from 'material-ui/IconButton/IconButton';

const mapStateToProps = (state, ownProps) => {
    return {litup: state.LitUpReducer}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLitUpTopics: (list) => {
            dispatch(setLitUpTopics(list))
        },
        setLitUpTopicDetails: (details) => {
            dispatch(setLitUpTopicDetails(details))
        },
        setUserSearchResult: (result, scope) => {
            dispatch(setUserSearchResult(result, scope))
        },
        setUserSelectedResult: (result, scope) => {
            dispatch(setUserSelectedResult(result, scope))
        },
        clearPanelData: () => {
            dispatch(clearPanelData())
        },
        setVoteData: (type, data) => {
            dispatch(setVoteData(type, data));
        }
    }
}

const PRIVILEGE_ILITUP_ADMIN = "ILITUP_ADMIN";
const PRIVILEGE_ILITUP_VOTER = "ILITUP_VOTER";
const PRIVILEGE_ILITUP_CLIENT="LITUP_CLIENT_USER";

class LitUp extends Component {
    state = {
        tabValue: 0,
        createDialog: false,
        litUpSuggestDialogOpen: false,
        showSuggestionList: false,
        litUpViewSuggestionDialogOpen: false,
        litUpSuggetionObject: {},
        litUpTopicObject: {},
        showAdminSearchPreloader: false,
        showVotersSearchPreloader: false,
        showSuggestionList: false,
        topicId: '',
        cardMenuAnchorEl: null,
        selectedSuggestion: {},
        isVerificationDialogVisible: false,
        isVoteDialogVisible: false,
        myVote: {},
        allVotes: {},
        anchorMenuEl: null,
        classifyMenuItem:null,
        workFlowMenuItem:{code:'CRTD'},
        selectedItems:[],
        poper:{
            open:false,
            anchorEL:null
        },
        poperAnchorEl:null,
        clientEmailField:{
            mail:"",
            name:"",
            desig:""
        }
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.match.params.topicId && !isNaN(this.props.match.params.topicId)) {
            this.loadAllTopics(this.props.match.params.topicId);
        } else {
            this.loadAllTopics();
        }

    }

    componentDidUpdate(prevProps, prevState) {}

    render() {
        let ideaSuggestions;
        let uniqueUsers = [];
        let uniqueUsersName = [];
        let ideaSuggestionsCount;
        let classifyMenuList;
        let workFlowMenuList;
        let workFlowTimeLineList;
        const litupTopicList = this
            .props
            .litup
            .litUpTopicsList            
            .map((item, index) => {
                return <div key={index} className="litup-list-item">
                    <Icon className="item-icon" color="primary">lightbulb_outline</Icon>
                    <div className="list-item-content">
                        <div
                            className="litup-idea-text"
                            onClick={this
                            .onVoteIdeaTopicClick
                            .bind(this, item.id)}>
                            {item.title}
                        </div>
                        <div className="action-container">
                            {/* {Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && <Button
                                raised
                                color="primary"
                                onClick={this
                                .onWorkshopClick
                                .bind(this, item)}>WORKSHOP</Button> */}

                            <div className="footer-container">
                                by {item.createdBy.name}
                                on {this.getTimeString(item.createdDate)}
                            </div>
                        </div>

                    </div>
                </div>
            });
        if (this.props.litup.ideaTopicDetails) {
            
            
            let obj=this
            .props
            .litup
            .ideaTopicDetails
            .ideaClassifications.find(function (obj) { return obj.id === -1; });
            if(!obj){
                this
                    .props
                    .litup
                    .ideaTopicDetails
                    .ideaClassifications.unshift({id:-1,code:'ALL',label:'ALL'});
            }

            classifyMenuList = this
            .props
            .litup
            .ideaTopicDetails
            .ideaClassifications
            .map((menuItem, index) => {

                let wrapClassName="item-wrap ";

                if(this.state.classifyMenuItem && this.state.classifyMenuItem.id==menuItem.id){
                    wrapClassName+=" active"
                }

            const itemscount= this
            .props
            .litup
            .ideaTopicDetails
            .suggestions.filter((ideaItem)=>{return menuItem.id==-1 || (ideaItem.classification && menuItem.id==ideaItem.classification.id);}).length;


                return (
                    <div
                        className={wrapClassName}
                        onClick={this
                        .handleClassifyMenuClick
                        .bind(this, menuItem)}>
                        <div className="item">{menuItem.label + ' ('+itemscount+')'} </div>
                    </div>
                );
            });

            if(this.state.classifyMenuItem){
                workFlowMenuList=this
                .props
                .litup
                .ideaTopicDetails
                .ideaTimelineStatus
                .map((menuItem, index) => {

                    let wrapClassName="item-wrap ";

                    if(this.state.workFlowMenuItem && this.state.workFlowMenuItem.code==menuItem.code){
                        wrapClassName+=" active"
                    }

                    let itemscount= this
                            .props
                            .litup
                            .ideaTopicDetails
                            .suggestions.filter((ideaItem)=>{

                                let check1=this.state.classifyMenuItem && (this.state.classifyMenuItem.id ==-1 || (ideaItem.classification && this.state.classifyMenuItem.id==ideaItem.classification.id));
                                return (check1 && 
                                    ideaItem.level.levelCode==menuItem.code); }
                            
                            ).length;

                    return (
                        <div
                            className={wrapClassName}
                            onClick={this
                            .handleWorkFlowMenuClick
                            .bind(this, menuItem)}>
                            <div className="item">{menuItem.label + ' ('+itemscount+')'}</div>
                        </div>
                    );
                });
        }


            workFlowTimeLineList=this
                .props
                .litup
                .ideaTopicDetails
                .ideaTimelineStatus
                .map((menuItem, index) => {

                let wrapClassName="";

                if(this.state.workFlowMenuItem && this.state.workFlowMenuItem.code==menuItem.code){
                    wrapClassName+=" passed"
                }

                const itemscount= this
                        .props
                        .litup
                        .ideaTopicDetails
                        .suggestions.filter((ideaItem)=>{
                            let check1=this.state.classifyMenuItem && (this.state.classifyMenuItem.id ==-1 || (ideaItem.classification && this.state.classifyMenuItem.id==ideaItem.classification.id));
                                return (check1 && 
                                    ideaItem.level.levelCode==menuItem.code); }
                        
                        ).length;


                return (

                    <div className="node-container"
                        onClick={this
                        .handleWorkFlowMenuClick
                        .bind(this, menuItem)}>
                        <div className={"milestone "+wrapClassName}>
                            <div className={"text "+wrapClassName}>{menuItem.label + ' ('+itemscount+')'}</div>
                        </div>
                        <div className={"line "+wrapClassName}></div>
                    </div>

                    // <div
                    //     className={wrapClassName}
                    //     onClick={this
                    //     .handleWorkFlowMenuClick
                    //     .bind(this, menuItem)}>
                    //     <div className="item">{menuItem.label + ' ('+itemscount+')'}</div>
                    // </div>
                );
            });

            ideaSuggestionsCount = this.props.litup.ideaTopicDetails.suggestions.length;
            this
                .props
                .litup
                .ideaTopicDetails
                .suggestions.forEach((item)=>{
                    if (!uniqueUsers.includes(item.createdBy.userId)) {
                        uniqueUsers.push(item.createdBy.userId)
                        uniqueUsersName.push(item.createdBy.name);
                    }
                })
            ideaSuggestions = this
                .props
                .litup
                .ideaTopicDetails
                .suggestions
                .filter((item)=>{ 

                    if(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)){

                        const isInClassify=this.state.classifyMenuItem && (this.state.classifyMenuItem.id==-1 || (item.classification && item.classification.id==this.state.classifyMenuItem.id));  
                        const isInWorkFlow=this.state.workFlowMenuItem && item.level.levelCode==this.state.workFlowMenuItem.code;                 
                        if(isInClassify && isInWorkFlow){
                            return true;
                        }
                    }else{
                        return true;
                    }
                })
                .map((item, index) => {

                    let upVoteSelectedClass = 'action-button';
                    let downVoteSelectedClass = 'action-button';
                    let descriptionSelectionClassName = 'card-details-container no-action';
                    let canVote = true;
                    const userDetails = Util.getLoggedInUserDetails();
                    if ( !Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && !Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) && !Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) {
                        canVote = false;
                        descriptionSelectionClassName += 'no-action';
                    }
                    if (item.downVotes.voters) {
                        item
                            .downVotes
                            .voters
                            .forEach((voteObj, index) => {
                                if (voteObj.userId == userDetails.userId) {
                                    downVoteSelectedClass += ' active';
                                }canVote
                            });
                        item
                            .upVotes
                            .voters
                            .forEach((voteObj, index) => {
                                if (voteObj.userId == userDetails.userId) {
                                    upVoteSelectedClass += ' active';
                                }
                            });
                    }
                    return <div key={index} className="litup-list-card">
                        {/* {
                                item.isWinner &&
                                    <Tooltip title="WINNER">
                                        <div className="winner-badge">
                                            <img src="../../../../resources/images/winner-ribbon.png" className="winner-badge-img"/>
                                        </div>
                                    </Tooltip>
                            } */}
                        {Util
                            .getLoggedInUserDetails()
                            .userId == item.createdBy.userId && !this.props.litup.ideaTopicDetails.hasStopped && <div className="card-title-menu-container">
                                <IconButton
                                    aria-owns={this.state.cardMenuAnchorEl
                                    ? 'simple-menu'
                                    : null}
                                    aria-haspopup="true"
                                    onClick={(event) => this.onCardMenuClick(event, item)}>
                                    <Icon color="action">
                                        more_vert
                                    </Icon>
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.cardMenuAnchorEl}
                                    open={Boolean(this.state.cardMenuAnchorEl)}
                                    onClose={this
                                    .onCardMenuClose
                                    .bind(this)}
                                    onRequestClose={this
                                    .onCardMenuClose
                                    .bind(this)}>
                                    <MenuItem
                                        onClick={this
                                        .onSuggestionEdit
                                        .bind(this, item)}>Edit</MenuItem>
                                    <MenuItem
                                        onClick={this
                                        .onSuggestionDelete
                                        .bind(this, item)}>Delete</MenuItem>
                                </Menu>

                            </div>
}
                        <div className="user-details">
                            {this.getAvatar(item.createdBy)}
                            <div className="user-info">
                                <div className="name">{this.formatName(item.createdBy.name)}</div>
                                <div className="date">Posted on {this.getTimeString(item.createdOn)}</div>
                            </div>
                            {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) &&<div className="shortlist-checkbox">
                            <Checkbox
                                checked={this.state.selectedItems.includes(item.id)}
                                onChange={this.handleCheckBoxChange.bind(this,item.id)}
                                value="checkedB"
                                color="primary"
                                />
                            </div>}
                        </div>
                        <div className={descriptionSelectionClassName}>
                            <div className="litup-card-title">
                                {item.title}
                            </div>
                            <div className="litup-card-text">
                                <p>{item.description}
                                </p>
                                {item.popUpEnabled && <span
                                    onClick={this
                                    .toggleViewSuggestionDialog
                                    .bind(this, true, item,false)}>
                                    quick view
                                </span>
}
                            </div>

                        </div>
                        {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) && <div className="litup-card-workflow-status">
                            <span>Status:&nbsp;</span>
                            <span>{item.level.label}</span>
                        </div>}
                        {(item.attachedDoc && item.attachedDoc.filename) && <div className="litup-card-attachmnt">
                            <Tooltip title="Has an attachment">
                                <Icon>attachment</Icon>
                            </Tooltip>
                        </div>
                        }

                        <div className="litup-card-actions">
                            {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER))
                                ? <Button
                                        className={upVoteSelectedClass}
                                        onClick={this
                                        .onVoteIdeaClick
                                        .bind(this, item)}>

                                        <div className="action-wrap">
                                            <div className="action-wrap-count">{item.upVotes.count}
                                                <Icon>thumb_up</Icon>
                                            </div>
                                            <div className="action-wrap-count">
                                                <Icon>thumb_down</Icon>
                                                {item.downVotes.count}
                                            </div>
                                        </div>

                                    </Button>
                                : <div className="action-wrap">
                                    <div className="action-wrap-count">{item.upVotes.count}
                                        <Icon>thumb_up</Icon>
                                    </div>
                                    <div className="action-wrap-count">
                                        <Icon>thumb_down</Icon>
                                        {item.downVotes.count}
                                    </div>
                                </div>
}
                            {/* {item.popUpEnabled &&
                                    <Button onClick={this.toggleViewSuggestionDialog.bind(this, true, item)}>
                                        <Icon>remove_red_eye</Icon>
                                    </Button>
                                } */}
                            {canVote && <Button
                                color="primary"
                                onClick={this
                                .onViewSuggestionDetail
                                .bind(this, item)}>
                                view Details
                                {/* <Icon>assignment</Icon> */}
                            </Button>
}

                            {/* {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) &&
                                    <Button className={downVoteSelectedClass} onClick={this.onVoteIdeaClick.bind(this, 'downVote', item)}>
                                        <Icon>thumb_down</Icon>
                                        {item.downVotes.count > 0 &&
                                            <div className="action-count">{item.downVotes.count}</div>
                                        }
                                    </Button>
                                } */}

                        </div>

                    </div>;
                });
        }

        

        const {anchorMenuEl} = this.state;

        let userNameList=uniqueUsersName.map((item)=>{
            return (<div style={{padding:'0.6rem',fontSize:'1rem'}}>
                {item}
            </div>);
        });

        let emailTextValue=this.state.clientEmailField;


        let clientParticipants;
        if(this.props.litup.ideaTopicDetails){
            clientParticipants=this.props.litup.ideaTopicDetails.workshopParticipants.map((item,index)=>{

               return ( <div className="entry">
                    <label><b>{item.name}</b><br/>{item.username}</label> &nbsp; 
                    
                    {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) && <Button onClick={this.removeParticipants.bind(this,item.username)} color="primary">X</Button>}
                </div>);

            });
        }
        
       

        
        return (
            <Root role="user">
                <MainContainer>

                    <div className="row litup-page">
                        <div className="col-md-12 litup-page-container">
                            <div className="logo-container">                                
                                <img className="litup_logo" src="../../../resources/images/ideaLitup.png"/>
                                { (Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT) && (this.props.litup.ideaTopicDetails && this.props.litup.ideaTopicDetails.collaborator == 'PETCO')) &&
                                    <img className="client_logo" src="../../../resources/images/client/petco.png"/>}
                                 {Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && <div className="add-new-btn-container">
                                    <Button
                                        className="add-new-btn"
                                        raised
                                        color="primary"
                                        onClick={this
                                        .createDialogToggle
                                        .bind(this)}>
                                        Add New Topic
                                    </Button>
                                </div>
}
                            </div>
                            {Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT) &&
                            <div className="welcome_container">
                                <span><small>Welcome </small><strong>{Util.getLoggedInUserDetails().fullName}, {Util.getLoggedInUserDetails().designation}</strong></span>
                            </div> }

                            {Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && <AppBar className="page-tabs-appbar" position="static" color="default">
                                <Tabs
                                    value={this.state.tabValue}
                                    onChange={this.handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary">
                                    <Tab label="Topics"/> {Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && <Tab label="Settings"/>
}
                                </Tabs>
                            </AppBar>
}
                            {this.state.tabValue === 0 && <div className="litup-tab-body litup-vote">
                                {!this.state.showSuggestionList && <div className="litup-idea-list-container">
                                    {litupTopicList}
                                    {(litupTopicList.length <= 0 && !this.props.match.params.topicId) && <div className="empty-content-container">No topics found</div>
}
                                </div>
}
                                {/* {this.props.match.params.topicId && !this.props.litup.ideaTopicDetails &&
                                            <div className="empty-holder">
                                                <span>No Data Available</span>
                                                <Button raised color="primary" onClick={this.onBackToTopicsClick.bind(this)}>BACK TO TOPICS</Button>
                                            </div>
                                        } */}
                                {(this.state.showSuggestionList && this.props.litup.ideaTopicDetails) && <div className="litup-idea-list-container">
                                    <div className="list-common-action-container">
                                        <div>
                                            <Button
                                                color="secondary"
                                                onClick={this
                                                .onBackToTopicsClick
                                                .bind(this)}>
                                                <Icon>keyboard_backspace</Icon>&nbsp;BACK TO TOPICS</Button>
                                        </div>


                                        <div>
                                            {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) && <Button
                                                aria-owns={anchorMenuEl
                                                ? 'simple-settings-menu'
                                                : null}
                                                aria-haspopup="true"
                                                onClick={this.handleMenuClick}>
                                                <Icon>settings_input_component</Icon>&nbsp; EXTRA OPTIONS
                                            </Button>}
                                            <Menu
                                                id="simple-settings-menu"
                                                anchorEl={anchorMenuEl}
                                                open={Boolean(anchorMenuEl)}
                                                onClose={this
                                                .handleMenuClose
                                                .bind(this)}
                                                onRequestClose={this
                                                .handleMenuClose
                                                .bind(this)}
                                                className="top-menu-container">
                                                {Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && <div>
                                                    {!this.props.litup.ideaTopicDetails.hasStopped
                                                        ? (
                                                            <MenuItem
                                                                className="top-menu-container-item"
                                                                onClick={this
                                                                .onStopResumeSuggestion
                                                                .bind(this, 'stop')}>
                                                                <span
                                                                    style={{
                                                                    display: "flex"
                                                                }}>
                                                                    <Icon>stop</Icon>&nbsp;STOP RECEIVING SUGGESTIONS</span>
                                                            </MenuItem>
                                                        )
                                                        : (
                                                            <MenuItem
                                                                onClick={this
                                                                .onStopResumeSuggestion
                                                                .bind(this, 'resume')}>
                                                                <span
                                                                    style={{
                                                                    display: "flex"
                                                                }}>
                                                                    <Icon>play_arrow</Icon>&nbsp; RESUME RECEIVING SUGGESTIONS</span>
                                                            </MenuItem>
                                                        )}
                                                </div>
                                                }
}
                                                {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) && <div>
                                                    <MenuItem
                                                        onClick={this
                                                        .onExportToExcel
                                                        .bind(this)}>
                                                        <span
                                                            style={{
                                                            display: "flex"
                                                        }}>
                                                            <Icon>cloud_download</Icon>&nbsp; EXPORT TO EXCEL</span>
                                                    </MenuItem>
                                                </div>}

                                                {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN)) && <div>
                                                    <MenuItem
                                                        raised
                                                        color="primary"
                                                        onClick={this
                                                        .onSendVotingInvite
                                                        .bind(this)}>
                                                        <span
                                                            style={{
                                                            display: "flex"
                                                        }}>
                                                            <Icon>send</Icon>&nbsp;SEND VOTING INVITATION</span>
                                                    </MenuItem>
                                                </div>}
}
                                            </Menu>

                                        </div>

                                    </div>
                                    <div className="list-header">
                                        {this.props.litup.ideaTopicDetails.title}
                                    </div>
                                    {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) &&
                                    <div className="client-tile-wrap">                                    
                                        <div className="card">
                                            <div className="data-wrap">
                                                <h2>{ideaSuggestionsCount}</h2>
                                                <label>Ideas</label>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="data-wrap">
                                                <h2>{uniqueUsers.length}</h2>
                                                <label>Ideators</label>
                                                <Button 
                                                buttonRef={node => {
                                                    this.setState({poperAnchorEl : node});
                                                  }}
                                                onClick={this.handleClickPoperButton.bind(this)} color="primary">view Ideators</Button>
                                            </div>
                                            <Popover
                                                open={this.state.poper.open}
                                                anchorEl={this.state.poperApoperApoperAnchorEl}
                                                onClose={this.handlePoperClose.bind(this)}
                                                onRequestClose={this.handlePoperClose.bind(this)}
                                                anchorReference={'anchorEl'}

                                                >
                                                <div style={{maxHeight:'500px',overflow:'auto'}} >
                                                     {userNameList}
                                                </div>
                                        </Popover>
                                        </div>
                                        
                                        
                                        <div className="card-side">
                                        {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER)) && <div className="row_head">
                                            <TextField id="time" type="email" value={emailTextValue.mail} onChange={(event)=>{this.addClientEmailChange('mail',event.target)}} placeholder="Enter Email" />
                                            <TextField id="time" type="text" value={emailTextValue.name} onChange={(event)=>{this.addClientEmailChange('name',event.target)}} placeholder="Enter Full Name" />
                                            <TextField id="time" type="text" value={emailTextValue.desig} onChange={(event)=>{this.addClientEmailChange('desig',event.target)}} placeholder="Enter Designation" />
                                            <Button raised color="primary" onClick={this.handleAddClient.bind(this)}>ADD Client</Button>&nbsp;
                                            <Button title="Reset All Participant's password" raised color="primary" onClick={this.resetClientPassword.bind(this)}>Reset Password</Button>
                                            
                                        </div>   }
                                        <label><u>Participants</u></label>
                                        <div className="row_bottom">                                            
                                            {clientParticipants}                                        
                                        </div>
                                        </div>
                                      

                                    </div>
                                    }
                                    {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) &&
                                    <div><label className="label-wrap">Choose a Category</label>
                                    <div className="client-classify-wrap">                                    
                                        {classifyMenuList}
                                    </div></div>}

                                   {/* {this.state.classifyMenuItem && <div><label className="label-wrap">Choose worflow status</label>
                                    <div className="client-workflow-wrap">
                                         {workFlowMenuList}
                                    </div>
                                    </div>{(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) &&
                                    } */}

                                   {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) && <div> {this.state.classifyMenuItem && <div><label className="label-wrap">Choose worflow status</label>
                                    <div className="litup-timeline-container">
                                    <div className="timeline-wrapper">
                                         {workFlowTimeLineList}
                                    </div>
                                    </div>
                                    </div>
                                    }
                                    </div>}

                                    {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) || Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) && <div>{this.state.selectedItems.length>0 && <div className="client-workflow-level-wrap">
                                        {this.state.workFlowMenuItem.code=='CRTD' &&
                                             <Button onClick={this.handleWorkflowLevelChange.bind(this,'PSSD')} raised color="primary">Move to 'Passed' list</Button>
                                        }
                                        {this.state.workFlowMenuItem.code=='PSSD' &&
                                             <Button onClick={this.handleWorkflowLevelChange.bind(this,'CRTD')} raised color="primary">Move back to 'Created' list</Button>
                                        }
                                    </div>
                                    }</div>}

                                    <div className="litup-idea-card-container">
                                      {(!Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) && <div> {!this.props.litup.ideaTopicDetails.hasStopped && <Button
                                            className="litup-list-card"
                                            onClick={this
                                            .toggleSuggestDialog
                                            .bind(this, true, false, true)}>
                                            <div className="add-item">
                                                <Icon className="add-icon">add_circle_outline</Icon>
                                                <div className="add-text">Add your suggestion</div>
                                            </div>
                                        </Button>}
                                       </div>}

                                        {ideaSuggestions}
                                    </div>

                                </div>
}
                            </div>
}
                            {(Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) && this.state.tabValue === 1) && <div className="litup-tab-body litup-settings">
                                <div className="litup-settings-title">
                                    Admins
                                </div>
                                <div className="litup-settings-box admins-list">
                                    <div className="chip-selector">
                                        <UserChipMultiSelect
                                            showPreloader={this.state.showAdminSearchPreloader}
                                            onTextChange={this
                                            .onAdminsSearch
                                            .bind(this)}
                                            resultChips={this.props.litup.adminsChipsResult}
                                            selectedChips={this.props.litup.selectedAdminsChips}
                                            onItemSelect={this
                                            .onAdminsSearchItemSelect
                                            .bind(this)}
                                            onDeleteChip={this
                                            .onDeleteAdminItem
                                            .bind(this)}/>
                                    </div>
                                </div>

                                <div className="litup-settings-title">
                                    Voters
                                </div>
                                <div className="litup-settings-box voters-list">
                                    <div className="chip-selector">
                                        <UserChipMultiSelect
                                            showPreloader={this.state.showVotersSearchPreloader}
                                            onTextChange={this
                                            .onVotersSearch
                                            .bind(this)}
                                            resultChips={this.props.litup.votersChipsResult}
                                            selectedChips={this.props.litup.selectedVotersChips}
                                            onItemSelect={this
                                            .onVotersSearchItemSelect
                                            .bind(this)}
                                            onDeleteChip={this
                                            .onDeleteVoterItem
                                            .bind(this)}/>
                                    </div>
                                </div>

                                <div className="actions-container">
                                    <Button
                                        raised
                                        className="action-btn"
                                        color="primary"
                                        onClick={this
                                        .onPanelUpdate
                                        .bind(this)}>
                                        Update
                                    </Button>
                                </div>
                            </div>
}
                        </div>
                    </div>
                </MainContainer>
                <LitUpCreateDialog
                    open={this.state.createDialog}
                    onRequestClose={this
                    .createDialogToggle
                    .bind(this)}/>
                <LitUpSuggestDialog
                    litUpTopic={this.state.litUpTopicObject}
                    suggestion={this.state.selectedSuggestion}
                    open={this.state.litUpSuggestDialogOpen}
                    onRequestClose={this
                    .toggleSuggestDialog
                    .bind(this)}/>
                <LitUpSuggestionViewDialog
                    litUpSuggetion={this.state.litUpSuggetionObject}
                    open={this.state.litUpViewSuggestionDialogOpen}
                    onRequestClose={this
                    .toggleViewSuggestionDialog
                    .bind(this)}/>
                <LitUpWorkshopDialogDialog
                    litUpTopic={this.state.litUpSelectedTopic}
                    open={this.state.isWorkshopDialogVisible}
                    onRequestClose={this
                    .onCloseWorkshoDalog
                    .bind(this)}/>
                <LitUpVerifyDialog
                    suggestion={this.state.selectedSuggestion}
                    open={this.state.isVerificationDialogVisible}
                    onRequestClose={this
                    .onCloseVerifyDalog
                    .bind(this)}/>
                <LitUpVoteDialog
                    suggestion={this.state.selectedSuggestion}
                    open={this.state.isVoteDialogVisible}
                    myVote={this.props.litup.myVote}
                    allVotes={this.props.litup.allVotes}
                    onVoteCast={this
                    .onVoteCast
                    .bind(this)}
                    onRequestClose={this
                    .onCloseVoteDialog
                    .bind(this)}/>

            </Root>
        );
    }

    addClientEmailChange(field, target){
        let clientData=this.state.clientEmailField;
        clientData[field]=target.value;
        this.setState({clientEmailField:clientData});
    }

    handleAddClient(){        

        let clientData=this.state.clientEmailField;
        
        if(clientData && clientData.mail.trim() && clientData.name.trim() ){
            if(!confirm("Are you sure, Add participant?, This will sent mail to the participant with login credentials")){
                return;
            }
                        
            let request={
                topicId:this.state.topicId,
                isAdd:true,
                email:clientData.mail,
                name:clientData.name,
                designation:clientData.desig
            }            
            LitUpService.addRemoveIdeaLitupClient(request).then(data => {
                riverToast.show("Participant added succesfully and Mail Sent with Credentials");   
                this.setState({clientEmailField:{name:"",mail:"",desig:""}});         
                this.onVoteIdeaTopicClick(this.state.topicId);  
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while adding participant');
            });


        }else{
            riverToast.show("Email Id and Name are mandatory fields");
        }
    }
    removeParticipants(emailId){

        if(!confirm("Are you sure, remove participant?")){
            return;
        }

        let request={
            topicId:this.state.topicId,
            isAdd:false,
            email:emailId
        }            
        LitUpService.addRemoveIdeaLitupClient(request).then(data => {
            riverToast.show("Participant removed succesfully");   
            this.setState({clientEmailField:""});   
            this.onVoteIdeaTopicClick(this.state.topicId);        
        })
        .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while removing participant');
        });
    }

    resetClientPassword(){  
        if(!confirm("Are you sure, reset participant password?")){
            return;
        }      
        LitUpService.resetClientPassword(this.state.topicId).then(data => {
            riverToast.show("Participant password reset and mail sent succesfully");    
            this.onVoteIdeaTopicClick(this.state.topicId);        
        })
        .catch(error => {
            console.log(error);
            riverToast.show(error.status_message || 'Something went wrong while resetting participant password');
        });
    }

    handleWorkflowLevelChange(level){

        if(this.state.selectedItems.length>0){
            let request={
                ideaIds:this.state.selectedItems,
                levelCode:level
            };

            LitUpService.changeMultipleLevel(request).then(data => {
                riverToast.show("Idea(s) moved succesfully");
                this.setState({selectedItems:[]});
                this.onVoteIdeaTopicClick(this.state.topicId);               
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while moving ideas');
            });


        }


    }

    handleCheckBoxChange(itemId){
        let selectedItems=this.state.selectedItems;
        if(selectedItems.includes(itemId)){
            selectedItems.splice(selectedItems.indexOf(itemId),1);
        }else{
            selectedItems.push(itemId);
        }

        this.setState({selectedItems:selectedItems});
    }

    handleMenuClick = event => {
        this.setState({anchorMenuEl: event.currentTarget});
    };

    handleMenuClose = () => {
        this.setState({anchorMenuEl: null});
    };

    handleClickPoperButton = () => {
        this.setState({
            poper:{open: true}
          });
      };
    
      handlePoperClose = () => {
        this.setState({
          poper:{open: false}
        });
      };

    onVoteCast(type, myVote, suggestionId) {

        myVote.voteType = type;

        LitUpService
            .postMyVote(suggestionId, myVote)
            .then(data => {
                riverToast.show("Vote Casted Successfully");
                this.onCloseVoteDialog();
                this.onVoteIdeaTopicClick(this.state.topicId);
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while Casting Vote');
            });

    }

    onSendVotingInvite() {
        if (confirm('Do you want to send invitation ?')) {
            LitUpService
                .sentInvitation(this.state.topicId)
                .then(data => {
                    riverToast.show('Invitation has been sent successfully');
                })
                .catch(error => {
                    console.log(error);
                    riverToast.show(error.status_message || 'Something went wrong while exporting excel');
                });
        }

    }

    onExportToExcel() {
        LitUpService
            .generateExcel(this.state.topicId)
            .then(data => {
                Util.downloadFile(data, 'suggestion', 'xls');
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while exporting excel');
            });
    }

    onViewSuggestionDetail(suggestion) {
        if ( Util.hasPrivilage(PRIVILEGE_ILITUP_ADMIN) || Util.hasPrivilage(PRIVILEGE_ILITUP_VOTER) ||  Util.hasPrivilage(PRIVILEGE_ILITUP_CLIENT)) {

            LitUpService
                .isVerifiedLitupUser(suggestion.id)
                .then(isVerified => {
                    if (isVerified) {
                        this
                            .props
                            .history
                            .push("/litup/suggestion/" + suggestion.id);PRIVILEGE_ILITUP_VOTER
                    } else {
                        this.setState({selectedSuggestion: suggestion});
                        this.setState({isVerificationDialogVisible: true});
                    }
                })
                .catch(error => {
                    console.log(error);
                    riverToast.show(error.status_message || 'Something went wrong while verifying user');
                });
        }
    }

    onCardMenuClose() {
        this.setState({cardMenuAnchorEl: null});
    }

    onCardMenuClick(event, suggestion) {
        this.setState({selectedSuggestion: suggestion});
        this.setState({cardMenuAnchorEl: event.currentTarget});
    }

    onSuggestionEdit(suggestion) {
        this.toggleSuggestDialog(true);
        this.onCardMenuClose();
    }

    getTimeString(timestamp) {
        // 14 Feb 2018, 4:34 PM
        return Util.getDateInFormat(timestamp, 'DD MMM YYYY, hh:mm A');
    }

    formatName(name) {
        return name
            .split(".")
            .map(name => name.charAt(0).toUpperCase() + name.slice(1))
            .join(" ");
    }

    getAvatar(user) {
        let avatarElement;
        if (user.avatar) {
            avatarElement = <img
                src={Util.getFullImageUrl(user.avatar)}
                alt="dp"
                className="profile-avatar"/>;
        } else {
            avatarElement = <Avatar>U</Avatar>;
            if (user.name) {
                avatarElement = <Avatar>{user
                        .name
                        .toUpperCase()
                        .charAt(0)}</Avatar>;
            }
        }

        return avatarElement;
    }

    handleTabChange = (event, value) => {
        this.setState({tabValue: value});
        if (value == 1) {
            this.getPanel();
        } else if (this.props.litup.selectedAdminsChips || this.props.litup.selectedVotersChips) {
            this.clearPanelData();
        }
    };

    onSuggestionDelete(suggestion) {
        if (this.state.selectedSuggestion && this.state.selectedSuggestion.id) {
            if (confirm('Do you want to delete this suggestion ?')) {
                this.onCardMenuClose();
                LitUpService
                    .deleteSuggestion(this.state.selectedSuggestion.id)
                    .then(data => {
                        riverToast.show('Suggestion has been deleted successfully');
                        this.onVoteIdeaTopicClick(this.state.topicId);
                    })
                    .catch(error => {
                        riverToast.show(error.status_message || 'Something went wrong while declaring winner');
                    });
            }
        }
    }

    onStopResumeSuggestion(action) {

        if (!confirm("Are you sure, want to " + action + " receiving suggestions?")) {
            return;
        }

        const request = {
            'action': action
        };
        LitUpService
            .startStopTopicSuggestions(this.state.topicId, request)
            .then(data => {
                if (action === 'stop') {
                    riverToast.show('Suggestions on this topic has been stopped');
                } else {
                    riverToast.show('Suggestions on this topic has been resumed');
                }

                this.onVoteIdeaTopicClick(this.state.topicId);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while declaring winner');
            });
    }

    onDeclareWinnerClick() {
        LitUpService
            .declareWinner(this.state.topicId)
            .then(data => {
                riverToast.show('Winner has been declared for the topic');
                this.onVoteIdeaTopicClick(this.state.topicId);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while declaring winner');
            });
    }

    onBackToTopicsClick() {
        this.setState({showSuggestionList: false});
        this
            .props
            .history
            .push("/litup");
    }

    onVoteIdeaTopicClick(topicId) {
        this.setState({topicId: topicId});
        LitUpService
            .getLitUpTopicDetails(topicId)
            .then(data => {
                this
                    .props
                    .setLitUpTopicDetails(data);
                this.setState({showSuggestionList: true});
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || "Something went wrong while getting topic details");
            });

    }

    createDialogToggle() {
        let flag = !this.state.createDialog;
        this.setState({createDialog: flag});
    }

    toggleSuggestDialog(isClose = false, isReload = false, isAddClick = false) {
        if (isAddClick) {
            this.setState({selectedSuggestion: null});
        }
        if (isClose) {
            this.setState({litUpTopicObject: this.props.litup.ideaTopicDetails});
        }
        this.setState({litUpSuggestDialogOpen: isClose});
        if (isReload) {
            this.onVoteIdeaTopicClick(this.state.topicId);
        }
    }

    onVoteIdeaClick(suggestion) {

        this.setState({selectedSuggestion: suggestion});

        LitUpService
            .getAllVotes(suggestion.id)
            .then(data => {
                this.setVoteData('all', data);
                LitUpService
                    .getMyVote(suggestion.id)
                    .then(data => {
                        this.setVoteData('my', data);
                        this.setState({isVoteDialogVisible: true});
                    })
                    .catch(error => {
                        console.log(error);
                        riverToast.show(error.status_message || 'Something went wrong while fetching all-votes');
                    });
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while fetching my vote');
            });

        // LitUpService.voteIdea(source, this.state.topicId, suggestion.id) .then(data
        // => {         riverToast.show('Your vote has been pLitUpServicelaced
        // successfully'); this.onVoteIdeaTopicClick(this.state.topicId);     })
        // .catch(error => {       riverToast.show(error.status_message || 'Something
        // went wrong while voting');     });
    }

    handleClassifyMenuClick(item) {
        this.setState({classifyMenuItem:item,selectedItems:[]});
    }

    handleWorkFlowMenuClick(item){
        this.setState({workFlowMenuItem:item,selectedItems:[]});
    }

    onWorkshopClick(topic) {
        this.setState({litUpSelectedTopic: topic});
        this.setState({isWorkshopDialogVisible: true});
    }

    onCloseVerifyDalog(isVerified) {
        this.setState({isVerificationDialogVisible: false});
        if (isVerified) {
            this
                .props
                .history
                .push("/litup/suggestion/" + this.state.selectedSuggestion.id);
        }
    }
    onCloseVoteDialog() {
        this.setState({isVoteDialogVisible: false});
    }
    onCloseWorkshoDalog(isReload) {
        if (isReload) {
            this.loadAllTopics();
        }
        this.setState({isWorkshopDialogVisible: false});
    }

    toggleViewSuggestionDialog(isClose = false, suggestion, isReload = false) {
        if (isClose) {
            this.setState({
                litUpSuggetionObject: {
                    topic: this.props.litup.ideaTopicDetails,
                    suggestion: suggestion
                }
            });
        }
        this.setState({litUpViewSuggestionDialogOpen: isClose});
        if (isReload) {
            this.onVoteIdeaTopicClick(this.state.topicId);
        }
    }

    onAdminsSearch(searchText) {
        this.onUserSearch(searchText, "admins");
    }

    onVotersSearch(searchText) {
        this.onUserSearch(searchText, "voters")
    }

    onAdminsSearchItemSelect(item) {
        this.onUserSearchItemSelect(item, "admins");
    }

    onVotersSearchItemSelect(item) {
        this.onUserSearchItemSelect(item, "voters");
    }

    onDeleteAdminItem(item) {
        this.onDeleteItem(item, "admins");
    }

    onDeleteVoterItem(item) {
        this.onDeleteItem(item, "voters");
    }

    onUserSearch(searchText, scope) {
        let scopeValue = (scope == "admins")
            ? "ADMINS"
            : "VOTERS"
        let showSearchPreloader = (scope == "admins")
            ? "showAdminSearchPreloader"
            : "showVotersSearchPreloader";
        if (searchText.length >= 3) {
            this.setState({[showSearchPreloader]: true});
            LitUpService
                .searchUser(searchText, scope)
                .then((data) => {
                    this.setState({[showSearchPreloader]: false});
                    if (data) {
                        this
                            .props
                            .setUserSearchResult(data, scopeValue);
                    }
                })
                .catch((error) => {
                    this.setState({[showSearchPreloader]: false});
                    riverToast.show(error.status_message);
                });
        } else if (searchText.length <= 0) {
            this
                .props
                .setUserSearchResult([], scopeValue);
        }
    }

    onUserSearchItemSelect(item, scope) {
        let scopeValue = (scope == "admins")
            ? "ADMINS"
            : "VOTERS";
        const selectedUsers = (scope == "admins")
            ? this.props.litup.selectedAdminsChips
            : this.props.litup.selectedVotersChips;
        let isChipExists = false;
        this
            .props
            .setUserSearchResult([], scopeValue);
        selectedUsers.forEach((element) => {
            if (element.id === item.id) {
                isChipExists = true;
            }
        }, this);

        if (!isChipExists) {
            selectedUsers.push(item);
            this
                .props
                .setUserSelectedResult(selectedUsers, scopeValue);
        }
    }

    onDeleteItem(item, scope) {
        let scopeValue = (scope == "admins")
            ? "ADMINS"
            : "VOTERS";
        if (item) {
            const selectedUsers = (scope == "admins")
                ? this.props.litup.selectedAdminsChips
                : this.props.litup.selectedVotersChips;
            switch (scope) {
                case "admins":
                    this
                        .props
                        .litup
                        .selectedAdminsChips
                        .forEach((element, index) => {
                            if (element.id === item.id) {
                                selectedUsers.splice(index, 1);
                            }
                        }, this);
                    break;
                case "voters":
                    this
                        .props
                        .litup
                        .selectedVotersChips
                        .forEach((element, index) => {
                            if (element.id === item.id) {
                                selectedUsers.splice(index, 1);
                            }
                        }, this);
                    break;

                default:
                    break;
            }
            this
                .props
                .setUserSelectedResult(selectedUsers, scopeValue);
        }
    }

    loadAllTopics(topicId = null) {
        LitUpService
            .getLitUpTopics()
            .then(data => {
                this
                    .props
                    .setLitUpTopics(data);
                if (topicId) {
                    this.onVoteIdeaTopicClick(topicId);
                }
            })
            .catch(error => {
                console.log(error);

                riverToast.show(error.status_message || "Something went wrong while getting topics");
            });

    }

    clearPanelData() {
        this
            .props
            .clearPanelData();
    }

    setVoteData(type, data) {
        this
            .props
            .setVoteData(type, data);
    }

    processPanelLoading(panel) {
        const adminsList = panel
            .admins
            .map(admin => {
                return {avatar: admin.avatar, fullname: admin.name, id: admin.userId, type: "USER", username: admin.username}
            });

        const votersList = panel
            .voters
            .map(voter => {
                return {avatar: voter.avatar, fullname: voter.name, id: voter.userId, type: "USER", username: voter.username}
            });

        this
            .props
            .setUserSelectedResult(adminsList, "ADMINS");
        this
            .props
            .setUserSelectedResult(votersList, "VOTERS");
    }

    processPanelUpdate() {
        const adminsList = this
            .props
            .litup
            .selectedAdminsChips
            .map(admin => {
                return admin.id;
            });

        const votersList = this
            .props
            .litup
            .selectedVotersChips
            .map(voter => {
                return voter.id;
            });

        return {"admins": adminsList, "voters": votersList}
    }

    getPanel() {
        LitUpService
            .getPanel()
            .then(data => {
                this.processPanelLoading(data);
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while getting panel");
            });
    }

    onPanelUpdate() {
        let settingsObj = this.processPanelUpdate();

        LitUpService
            .updatePanel(settingsObj)
            .then(data => {
                riverToast.show("Panel updated successfully");
            })
            .catch(error => {
                riverToast.show(error.status_message || "Something went wrong while updating panel");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LitUp);