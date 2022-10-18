import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import {connect} from "react-redux";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from "../../../Util/util";

// root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { UserCard } from '../../Common/UserCard/UserCard';

// page dependency
import { UsersService} from "./Users.service";
import { resetData, storeUserList, resetUserList, userListChange, storeClubList, storeEntityList, storeLocationList} from "./Users.actions";
import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {SelectBox} from '../../Common/SelectBox/SelectBox';

// CSS
import './Users.scss'

const mapStateToProps = (state) => {
    return{
        users: state.UsersReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetData: () => {
            dispatch(resetData());
        },
        storeUsersList: (userList) => {
            dispatch(storeUserList(userList));
        },
        resetUserList: () => {
            dispatch(resetUserList());
        },
        userListChange: (userList) => {
            dispatch(userListChange(userList));
        },
        storeClubList: (clubList) => {
            dispatch(storeClubList(clubList));
        },
        storeEntityList: (entityList) => {
            dispatch(storeEntityList(entityList));
        },
        storeLocationList: (locationList) => {
            dispatch(storeLocationList(locationList));
        }
    }
}

const PRIVILEGE_CREATE_USER = "CREATE_USER";
const PRIVILEGE_DELETE_USER = "DELETE_USER";
const USER_COUNT = 40;

const FILTER_ALL = "ALL";
const FILTER_ALLOCATED = "AL";
const FILTER_UNALLOCATED = "UA";
const FILTER_LEADERSHIP = "LS";
const FILTER_RETIRED = "RT";

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            pageNo: 0,
            showLoadMore: false,
            currentFilterType: FILTER_ALL,
            currentFilterClubId: "-1",
            currentFilterEntityId: "-1",
            currentFilterLocationId: "-1"
        };

        this.filterTypeList = this.getFilterTypeList();

        this.handleFilterType = this.handleFilterType.bind(this);
        this.handleSelectClub = this.handleSelectClub.bind(this);
        this.handleSelectEntity = this.handleSelectEntity.bind(this);
        this.handleSelectLocation = this.handleSelectLocation.bind(this);
    }

    componentDidMount(){
        this.props.resetData();
        this.loadUserslist();
        this.loadClubList();
    }

    render() {
        const userListElements = this.props.users.userList.map((user, index) => {
            const userMeta = this.getUserMeta(user);
            const hasDelete = Util.hasPrivilage(PRIVILEGE_DELETE_USER);
            return <UserCard key={`${user.userId}-${user.status}`} hasDelete={hasDelete} side="front" deleteCallback={this.onDeleteUser.bind(this)} onUserClick={this.onUserClick.bind(this, userMeta)} user={userMeta} showDelete={user.status !== "inactive"} />
        });
        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="Users" />
                    <div className="users-page-wrapper">
                        <div className="row">
                            <div className="col-md-12 listing-extras">
                                {Util.hasPrivilage(PRIVILEGE_CREATE_USER) &&
                                    <AddNewBtn callback={this.onAddnewClick.bind(this)} iconOnly={true} icon="person_add" title="Add New User" />
                                }
                                <SearchWidget withButton={true} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                            </div>
                        </div>
                        <div className="row filter-wrapper">
                            <div className="col-md-3">
                                <SelectBox 
                                    label="Status"
                                    selectedValue = {this.state.currentFilterType}
                                    selectArray={this.filterTypeList}
                                    onSelect={this.handleFilterType}
                                    />
                            </div>
                            {
                                (this.state.currentFilterType === FILTER_ALLOCATED) && <div className="col-md-3">
                                        <SelectBox 
                                            label="Club"
                                            selectedValue = {this.state.currentFilterClubId}
                                            selectArray={this.props.users.clubList}
                                            onSelect={this.handleSelectClub}
                                            />
                                    </div>
                            }
                            {
                                (this.state.currentFilterType === FILTER_UNALLOCATED) && <div className="col-md-3">
                                        <SelectBox 
                                            label="Entities"
                                            selectedValue = {this.state.currentFilterEntityId}
                                            selectArray={this.props.users.entityList}
                                            onSelect={this.handleSelectEntity}
                                            />
                                    </div>
                            }
                            {
                                (this.state.currentFilterType === FILTER_UNALLOCATED) && <div className="col-md-3">
                                        <SelectBox 
                                            label="Location"
                                            selectedValue = {this.state.currentFilterLocationId}
                                            selectArray={this.props.users.locationList}
                                            onSelect={this.handleSelectLocation}
                                            />
                                    </div>
                            }
                        </div>
                        <div className="row">
                            <div className="col-md-12 flex-container list-wrapper">
                                {userListElements.length <= 0 && 
                                    <div className="empty-content-container">No users found</div>
                                }
                                {userListElements}
                            </div>
                        </div>
                        <div className="loadmore">
                            {this.state.showLoadMore && <Button className="btn-loadmore" onClick={this.onLoadMore.bind(this)}>Load More</Button>}
                        </div>
                    </div>
                </MainContainer>
            </Root>
        );
    }

    getFilterTypeList(){
        const list = [
            {title: "ALL", value: "ALL"},
            {title: "Allocated", value: "AL"},
            {title: "Unallocated", value: "UA"},
            {title: "Leadership", value: "LS"},
            {title: "Retired", value: "RT"},
            {title: "Retail Academy", value: "RA"}
        ];
        return list;
    }

    handleFilterType(filterType){
        this.setState({currentFilterType: filterType, currentFilterClubId: "-1", currentFilterEntityId: "-1", currentFilterLocationId: "-1", pageNo: 0});
        const size = (this.state.pageNo + 1) * USER_COUNT;
        this.props.resetUserList();
        this.loadUserslist({size, filter: filterType, clubId: "-1", entity: "-1", location: "-1", page: 0, size: USER_COUNT});

        if(filterType === FILTER_UNALLOCATED){
            this.loadEntityList();
            this.loadLocationList();
        }
    }

    handleSelectClub(clubId){
        this.setState({currentFilterClubId: clubId, pageNo: 0});
        const size = (this.state.pageNo + 1) * USER_COUNT;
        this.props.resetUserList();
        this.loadUserslist({size, clubId, page: 0, size: USER_COUNT});
    }

    handleSelectEntity(entity){
        this.setState({currentFilterEntityId: entity, currentFilterLocationId: "-1", pageNo: 0});
        this.props.resetUserList();
        this.loadUserslist({entity, location: "-1", page: 0, size: USER_COUNT});
        this.loadLocationList(entity);
    }

    handleSelectLocation(location){
        this.setState({currentFilterLocationId: location});
        this.props.resetUserList();
        this.loadUserslist({location: location});
    }

    onLoadMore(){
        //const size = (this.state.pageNo + 1) * USER_COUNT;
        const size = USER_COUNT;
        const pageNo = this.state.pageNo + 1;
        this.setState({pageNo});
        this.loadUserslist({size, page: pageNo});
    }

    onAddnewClick() {
        this.props.history.push("/admin/users/add");
    };

    onSearch(searchKey) {
        this.setState({
            pageNo: 0,
            searchKey
        });
        this.props.resetUserList();
        this.loadUserslist({search: searchKey, page: 0});
    }

    onClearSearch() {
        this.setState({
            pageNo: 0,
            searchKey: ""
        });
        this.props.resetUserList();
        this.loadUserslist({search: "", page: 0});
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.firstName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
    }

    getUserMeta(user){
        return {
            name: user.name,
            avatar: (user.avatar ? Util.getFullImageUrl(user.avatar) : "../../../../../resources/images/img/user-avatar.png") ,
            userId: user.userId,
            memberPoints: user.totalPoints ? user.totalPoints : 0,
            email: user.email,
            clubName: user.clubName || "",
            status: user.status || "",
        };
    }

    loadUserslist(config){
        const options = {
            search: this.state.searchKey,
            page: this.state.pageNo,
            size: USER_COUNT,
            filter: this.state.currentFilterType,
            clubId: this.state.currentFilterClubId,
            entity: this.state.currentFilterEntityId,
            location: this.state.currentFilterLocationId
        };

        const request = {...options, ...config};

        UsersService.fetchUsers(request.search, request.page, request.size, (request.filter === "-1" ? "" : request.filter) , (request.clubId === "-1" ? "" : request.clubId), (request.entity === "-1"? "" : request.entity), (request.location === "-1" ? "" : request.location))
            .then((data) => {
            if (data) {
                const page = (request.size/USER_COUNT) - 1;
                const showLoadMore = (request.size <= data.length);
                this.setState({
                    showLoadMore,
                    page});
                this.processUserlistResponse(data);

            }
        })
        .catch((error) => {
            riverToast.show(error.message);
        })
    }

    processUserlistResponse(userList) {
        this.props.storeUsersList(userList);
    }

    onDeleteUser(user){
        if (confirm("This user will be inactivated and all privileges and roles will be revoked.\nDo you want to delete this ?")) {
            UsersService.deleteUser(user.userId)
                .then((data) => {
                //this.processDeleteUser(user);
                this.props.resetUserList();
                this.loadUserslist();
            })
                .catch((error) => {
                if (error.network_error) {
                    riverToast.show(error.message);
                } else {
                    riverToast.show("Something went wrong");
                }
            });
        }
    }

    processDeleteUser(user) {
        const userList = this.props.users.userList;
        let deletedIndex = -1;
        this.props.users.userList.forEach((userObj, index) => {
            if (userObj.id === user.userId) {
                deletedIndex = index;
            }
        }, this);
        userList.splice(deletedIndex, 1, user);
        this.props.userListChange(userList);
        riverToast.show("User deleted successfully");
    }

    onUserClick(user) {
        this.props.history.push("/admin/users/detail/" + user.userId);
    }

    loadClubList(){
        UsersService.getClubList()
            .then(data => {
            let clubList = data.map(club => {
                return {
                    title: club.clubName,
                    value: club.id
                }
            });
            clubList = [{title: "ALL", value: "-1"}, ...clubList];
            this.props.storeClubList(clubList);
        })
            .catch(error => {
            riverToast.show(error.message || "Something went wrong while loading club list from Manage Users.")
        });
    }

    loadEntityList(){
        UsersService.getEntityList()
            .then(data => {
            let entityList = data.map(entity => ({title: entity.name, value: entity.code}));
            entityList = [{title: "ALL", value: "-1"}, ...entityList];
            this.props.storeEntityList(entityList);
        })
            .catch(error => {
            riverToast.show(error.message || "Something went wrong while loading entity list in Users.")
        });
    }

    loadLocationList(entity){
        UsersService.getLocationList((entity === -1 ? "" : entity))
            .then(data => {
            let locationList = data.map(location => ({title: location.name, value: location.code}));
            locationList = [{title: "ALL", value: "-1"}, ...locationList];
            this.props.storeLocationList(locationList);
        })
            .catch(error => {
            riverToast.show(error.message || "Something went wrong while loading location list in Users.")
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);