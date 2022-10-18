import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import PhoneIcon from 'material-ui-icons/Phone';
import FavoriteIcon from 'material-ui-icons/Favorite';
import PersonPinIcon from 'material-ui-icons/PersonPin';
import ButtonBase from 'material-ui/ButtonBase';
import Avatar from 'material-ui/Avatar';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';
import PasswordDialog from './PasswordDialog/PasswordDialog';
import moment from 'moment';

// root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import {SelectBox} from "../../Common/SelectBox/SelectBox";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import SelectAutoComplete from '../../Common/SelectAutoComplete/SelectAutoComplete';

// page dependency
import { setClubListList } from "./Points.actions";
import { PointsService } from "./Points.service";
// CSS
import './Points.scss';

const HISTORY_COUNT = 15;

const mapStateToProps = (state) => {
    return {
        points: state.PointsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setClubListList: (list) => {
            dispatch(setClubListList(list));
        }
    }
}


class Points extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        selectedTab: 0,
        pointValue: 0,
        passwordDialogState: false,
        pointChangeRequest: {},
        pointText: "",
        selectedClubId: null,
        selectedMemberId: null,
        selectClubList: [],
        selectMemberList: [],
        filteredMemberList: [],
        clubList: [],
        memberList: [],
        avatar: null,
        id: "",
        name: "",
        primarySubTitle: "",
        secondarySubTitle: "",
        points: "",
        pointComVisible: false,
        detailContainerVisible: false,
        pointHistoryList: [],
        pageNo: 1,
        loadmoreVisible: false,
        selectedItemId: ""
    };

componentDidMount() {
    this.loadClubList();
    this.loadMemberList();
}

handleChange = (event, value) => {
    this.clearAll();
    this.setState({
        ...this.state,
        selectedTab: value,
        detailContainerVisible: false,
        pointComVisible: false,
        selectedClubId: null,
        selectedMemberId: null,
        pointHistoryList: [],
        pageNo: 1,
        loadmoreVisible: false,
        selectedItemId: ""
        
    });
};

render() {

    return ( 
        <Root role="admin">
            <MainContainer>
                <PageTitle title="Points" />
                {/* <div className="row">
                        <div className="col-md-12 listing-extras">
                            <SearchWidget withButton={false} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                        </div>
                    </div> */}
                <div className="row points">
                    <div className="col-md-12 flex-container">
                        <Paper>
                            <Tabs
                                value={this.state.selectedTab}
                                onChange={this.handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                >
                                <Tab label="CLUBS" />
                                <Tab label="MEMBERS" />
                            </Tabs>
                        </Paper>
                    </div>
                    <div className="col-md-12 flex-container">
                        <div className="select-container">
                            {this.state.selectedTab == 0 &&
                                <SelectBox 
                                    id="club-list-select" 
                                    label="Clubs" 
                                    selectedValue={this.state.selectedClubId}
                                    selectArray={this.state.selectClubList || []}
                                    onSelect={this.onSelect.bind(this, "club")}/>
                            }
                            {/*this.state.selectedTab == 1 &&
                                <SelectBox 
                                    id="member-list-select" 
                                    label="Members" 
                                    selectedValue={this.state.selectedMemberId}
                                    selectArray={this.state.selectMemberList || []}
                                    onSelect={this.onSelect.bind(this, "member")}/>
                            */}
                            {this.state.selectedTab == 1 &&
                                <SelectAutoComplete
                                    selectList={this.state.filteredMemberList}
                                    onSelectListChange={this.onSuggestionsFetchRequested.bind(this)}
                                    onResetList={this.onSuggestionsClearRequested.bind(this)}
                                    onSelect={this.onSuggestionSelected.bind(this)}
                                    inputProps={this.inputProps}
                                    />
                            }

                        </div>

                    </div>
                    <div className="col-md-12 flex-container">
                        {this.state.detailContainerVisible &&
                            <div className="point-detail-section">
                                <div className="detail-card-container">
                                    {/* Club/Member Card */}
                                    <div className="detail-card">
                                        <Avatar className="big-avatar">
                                            {this.state.avatar &&
                                                <img src={this.state.avatar} />
                                            }
                                            {!this.state.avatar &&
                                                <div>
                                                    {this.state.name.charAt(0)}
                                                </div>
                                            }   
                                        </Avatar>
                                        <div className="basic-detail-container">
                                            <div className="name">{this.state.name}</div>
                                            <div className="email">{this.state.primarySubTitle}</div>
                                            <div className="club">{this.state.secondarySubTitle}</div>
                                        </div>
                                        <div className="point-container">
                                            {this.state.points}
                                        </div>
                                    </div>
                                </div>
                                <div className="action-container">
                                    <div className="manage-button-container">
                                        <Button raised color="primary" onClick={this.onManagePointClick.bind(this)}>MANAGE POINTS</Button>
                                    </div>
                                    {this.state.pointComVisible &&
                                        <div>
                                            <div className="change-point-wrapper">
                                                <div className="point-action-com">
                                                    <div className="input-container" title="Enter the point">
                                                        <input type="number" placeholder="Point" className="no-border-input" value={this.state.pointValue} onChange={(e) => {
                                                                this.setState({pointValue: e.target.value});
                                                            }}/>
                                                    </div>
                                                </div>
                                                <div className="reason-text">
                                                    <TextField
                                                        id="multiline-flexible"
                                                        label="Comment"
                                                        style={{width: "100%"}}
                                                        multiline
                                                        rowsMax="2"
                                                        value={this.state.multiline}
                                                        onChange={(e) => {
                                                            this.setState({pointText: e.target.value});
                                                        }}
                                                        margin="normal"
                                                        />
                                                </div>
                                            </div>
                                            <div className="btn-group">
                                                <Button raised onClick={this.onPointChangeClick.bind(this, "remove")}>
                                                    <Icon>remove</Icon> Subtract Points
                                                </Button>
                                                <Button raised onClick={this.onPointChangeClick.bind(this, "add")}>
                                                    <Icon>add</Icon> Add Points
                                                </Button>
                                                {/*<div className="negative" title="Click To Deduct Point">
                                                    <ButtonBase
                                                        focusRipple
                                                        onClick={this.onPointChangeClick.bind(this, "remove")}
                                                        >
                                                        <div className="flat-button">
                                                            <Icon>remove</Icon>
                                                        </div>
                                                    </ButtonBase>
                                                </div>
                                                <div className="positive" title="Click To Add Point">
                                                    <ButtonBase
                                                        focusRipple
                                                        onClick={this.onPointChangeClick.bind(this, "add")}
                                                        >
                                                        <div className="flat-button">
                                                            <Icon>add</Icon>
                                                        </div>
                                                    </ButtonBase>
                                                </div>*/}
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        }

                        {
                            (this.state.pointHistoryList.length > 0) && <div className="point-history-wrapper">
                                    <h2 className="title">Point History</h2>
                                    { this.getPointHistoryTemplate(this.state.pointHistoryList) }
                                    <Button className="btn-loadmore" onClick={this.handleLoadMore.bind(this)}>Load More</Button>
                                </div>
                        }
                    </div>
                </div>
            </MainContainer>
            <PasswordDialog
                open={this.state.passwordDialogState}
                pointRequest={this.state.pointChangeRequest}
                onRequestClosePassword={this.onPasswordDialogueClose.bind(this)}/>
        </Root>
    );
}

handleLoadMore(){
    const type = this.state.selectedTab === 0 ? "CLUB" : "USER";
    const id = this.state.selectedItemId;
    const count = (this.state.pageNo + 1) * HISTORY_COUNT;
    this.setState({pageNo: this.state.pageNo + 1});
    this.loadPointHistory(type, id, 0, count);
}

loadPointHistory(type, id, page = 0, _count = HISTORY_COUNT){
    const count = (page + 1) * _count;
    PointsService.getPointHistory(type, id, page, count)
        .then(data => {
        const pointHistoryList = data.length > 0 ? data : [{description: "No data found."}];
        this.setState({
            pointHistoryList});
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something went wrong while loading point histoty");
    });
}

getPointHistoryTemplate(pointHistory){
    let template = pointHistory.map((point, index) => {
        return <tr key={index}>
            <td>{point.createdDate && moment.unix(point.createdDate / 1000).format("DD MMM YYYY hh:mm A")}</td>
            <td>{point.description}</td>
            <td className="rt">{point.point}</td>
        </tr>
    });
    const tableTemplate = <table className="table">
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th className="rt">Points</th>
                  </tr>
              </thead>
              <tbody>
                  {template}
              </tbody>
          </table>;
    return tableTemplate;
}

onSuggestionsFetchRequested(selected){
    //console.log('fetching', selected);
    const filteredMemberList = this.state.selectMemberList.filter(item => item.title.toUpperCase().indexOf(selected.value.toUpperCase()) > -1 );
    this.setState({filteredMemberList});
}

onSuggestionsClearRequested(){
    //console.log('clearing');
    this.setState({filteredMemberList: [this.state.selectMemberList]})
}

onSuggestionSelected(event, {suggestion}){
    //console.log('selected', suggestion);
    const selectedItemDetails = this.getItemDetails("member", suggestion.value);
    this.setState({
        ...this.state,
        avatar: selectedItemDetails.avatar ? Util.getFullImageUrl(selectedItemDetails.avatar) : null,
        name: selectedItemDetails.name,
        id: selectedItemDetails.id,
        primarySubTitle: selectedItemDetails.email,
        secondarySubTitle: selectedItemDetails.club,
        points: selectedItemDetails.points,
        detailContainerVisible: true,
        selectedItemId: suggestion.value
    });
    
    this.loadPointHistory("USER", suggestion.value);
}

onPasswordDialogueClose(needReload){
    if (needReload) {
        const type = this.state.selectedTab == "0" ? "club" : "member";
        this.onSelect(type, this.state.id);
        if (this.state.pointChangeRequest.isAdd) {
            this.setState({
                ...this.state,
                points: (Number(this.state.points) + Number(this.state.pointChangeRequest.points))
            });
        } else {
            this.setState({
                ...this.state,
                points: (Number(this.state.points) - Number(this.state.pointChangeRequest.points))
            });
        }
        this.loadClubList();
        this.loadMemberList();
        const typeFor = type === 0? "CLUB" : "USER";
        this.loadPointHistory(typeFor, this.state.selectedItemId);
    }
    this.setState({passwordDialogState: false});
    this.setState({ pointChangeRequest: {} });
}

getItemDetails(identifier, id) {
    const dataArray = identifier === "club" ? this.state.clubList : this.state.memberList;
    let details = null;
    dataArray.forEach((item) => {
        if (item.id == id) {
            details = item;
        }
    });

    return details;
}

onManagePointClick() {
    this.setState({pointComVisible: !this.state.pointComVisible});
}

onSelect(identifier, selectedValue) {
    this.clearAll();
    const selectedItemDetails = this.getItemDetails(identifier, selectedValue);
    if (identifier === "club") {
        this.setState({
            ...this.state,
            avatar: selectedItemDetails.avatar ? Util.getFullImageUrl(selectedItemDetails.avatar) : null,
            name: selectedItemDetails.name,
            id: selectedItemDetails.id,
            primarySubTitle: "",
            secondarySubTitle: "",
            points: selectedItemDetails.points,
            detailContainerVisible: true,
            selectedItemId: selectedValue
        });
        this.loadPointHistory("CLUB", selectedValue);
    } else {
        this.setState({
            ...this.state,
            avatar: selectedItemDetails.avatar ? Util.getFullImageUrl(selectedItemDetails.avatar) : null,
            name: selectedItemDetails.name,
            id: selectedItemDetails.id,
            primarySubTitle: selectedItemDetails.email,
            secondarySubTitle: selectedItemDetails.club,
            points: selectedItemDetails.points,
            detailContainerVisible: true
        });
    }
}

clearAll() {
    this.setState({
        ...this.state,
        pointComVisible: false,
        detailContainerVisible: false,
        avatar: null,
        id: "",
        name: "",
        primarySubTitle: "",
        secondarySubTitle: "",
        points: "",
        pointValue: 0,
        pointText: ""
    });
}

getPointRequest(clickFlag) {
    const request = {
        id:this.state.id,
        type:this.state.selectedTab == "0" ? "CLUB" : "USER",
        cred:"",
        points:Number(this.state.pointValue) || 0,
        isAdd:clickFlag === "add" ? true : false,
        reason:this.state.pointText
    };

    return request;
}

validatePointChange() {
    let isValid = true;
    let msg = "";

    if (!Number(this.state.pointValue)) {
        msg = "Please enter points";
    } else if (!this.state.pointText) {
        msg = "Please enter comments";
    }

    if (msg) {
        isValid = false;
        riverToast.show(msg);
    }
    return isValid;
}

onPointChangeClick(clickFlag) {
    if (this.validatePointChange()) {
        const pointRequest = this.getPointRequest(clickFlag);
        this.setState({pointChangeRequest: pointRequest});
        this.setState({passwordDialogState: true});
    }
}

loadClubList() {
    PointsService.getClubs()
        .then(data => {
        const selectClubList = [];
        data.forEach((club) => {
            selectClubList.push({
                title: club.name,
                value: club.id
            });
        }, this);
        this.setState({
            ...this.state,
            clubList: data,
            selectClubList: selectClubList
        });
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something sent wring while getting club list");
    });
}

loadMemberList() {
    PointsService.getUsers()
        .then(data => {
        const selectMemberList = [];
        data.forEach(member => {
            selectMemberList.push({
                title: member.name,
                value: member.id,
                avatar: member.avatar
            });
        });
        this.setState({
            ...this.state,
            memberList: data,
            selectMemberList: selectMemberList,
            filteredMemberList: [...selectMemberList]
        });
    })
        .catch(error => {
        riverToast.show(error.status_message || "Something sent wring while getting club list");
    });
}
}

export default connect(mapStateToProps, mapDispatchToProps)(Points);