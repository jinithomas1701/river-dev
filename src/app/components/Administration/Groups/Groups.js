import React from "react";
import {connect} from "react-redux";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { GroupCard } from './GroupCard/GroupCard';
import {searchKeyChange, groupListChange} from "./Groups.actions";

import {GroupsService} from "./Groups.service";

const mapStateToProps = (state) => {
    return {
        groups: state.GroupsReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        searchKeyChange: (key) => {
            dispatch(searchKeyChange(key));
        },
        groupListChange: (list) => {
            dispatch(groupListChange(list));
        }
    }
};

class Groups extends React.Component {

    groupList = [];
    constructor(props) {
        super(props);
        // props.groupListChange(this.groupList);
        this.loadGroups();
    }

    render() {
        const groupCards = this.props.groups.groupList.map((group, index) => {
            return <GroupCard key={index} group={group} deleteCallback={this.onDeleteGroup.bind(this)} onGroupClick={this.onGroupClick.bind(this, group)}/>;
        });
        return ( 
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Panel" />
                    <div className="row">
                        <div className="col-md-12 listing-extras">
                            <AddNewBtn callback={this.onAddnewClick.bind(this)}/>
                            <SearchWidget withButton={true} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 flex-container">
                            {groupCards.length <= 0 && 
                                <div className="empty-content-container">No groups found</div>
                            }
                            {groupCards}
                        </div>
                    </div>
                </MainContainer>
			</Root>
        );
    }

    onSearch(searchKey) {
        const filteredGroups = this.filterItems(searchKey, this.groupList);
        this.props.groupListChange(filteredGroups);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.groupName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
      }
          

    onClearSearch() {
        this.props.groupListChange(this.groupList);
    }

    onAddnewClick() {
        this.props.history.push("/admin/councils/detail");
    }

    processDeleteGroup(group) {
        const groupList = this.props.groups.groupList;
        let deletedIndex = -1;
        this.props.groups.groupList.forEach((groupObj, index) => {
            if (groupObj.id === group.id) {
                deletedIndex = index;
            }
        }, this);
        groupList.splice(deletedIndex, 1);
        this.props.groupListChange(groupList);
        riverToast.show("Group deleted successfully");
    }

    onDeleteGroup(group) {
        if (confirm("Do you want to delete this ?")) {
            GroupsService.deleteGroupTask(group.id, group.username)
                .then((data) => {
                    this.processDeleteGroup(group);
                })
                .catch((error) => {
                    if (error.network_error) {
                        riverToast.show(error.message);
                    }
                    riverToast.show(error.status_message || "Something went wrong while deleting group")
                });
        }
    }

    onGroupClick(group) {
        this.props.history.push("/admin/councils/detail/"+group.id+"/"+group.username);
    }

    loadGroups() {
        GroupsService.getGroupsTask()
            .then((data) => {
                if (data && data.length > 0) {
                    this.groupList = data;
                    this.props.groupListChange(data);
                } else {
                    this.props.groupListChange([]);
                }
                
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching groups")
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);