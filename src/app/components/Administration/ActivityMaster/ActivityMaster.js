import React from "react";
import {connect} from "react-redux";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { AddNewBtn } from '../../Common/AddNewBtn/AddNewBtn';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';

import { ActivityMasterCard } from './ActivityMasterCard/ActivityMasterCard';
import ActivityMasterDetailDialog from "./ActivityMasterDetailDialog/ActivityMasterDetailDialog";
import ActivityMasterStatisticsDialog from "./ActivityMasterStatisticsDialog/ActivityMasterStatisticsDialog";
import { Toast, riverToast } from '../../Common/Toast/Toast';
import {Util} from "../../../Util/util";

import {setDetailDialogVisibility, loadActivityMasterList } from "./ActivityMaster.actions";
import { ActivityMasterService } from "./ActivityMaster.service";
import './ActivityMaster.scss';

const mapStateToProps = (state) => {
    return {
        activityMaster: state.ActivityMasterReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        detailDialogOpen: (visible) => {
            dispatch(setDetailDialogVisibility(visible));
        },
        loadActivityMasterList: (list) => {
            dispatch(loadActivityMasterList(list));
        }
    }
};

const PRIVILEGE_CREATE_MASTER = "CREATE_MASTER_ACTIVITY";

class ActivityMaster extends React.Component {

    constructor(props){
        super(props);
        this.loadActivityMasterList();
    }

    state = {
        currentActivityMaster: "",
        viewStats: false
    }

    activityMasterList = [];

    render() {

        const activityMasterList = this.props.activityMaster.activityMasterList.map((master, index) => {
            return <ActivityMasterCard
                        key={index}
                        master={master}
                        deleteCallBack={this.onDelete.bind(this)}
                        updateCallBack={this.onUpdate.bind(this)}
                        viewStatCallback={this.viewStat.bind(this)}
                        onSwitchChange={this.onSwitchChange.bind(this)}
                    />
        });

        return (
			<Root role="admin">
				<MainContainer>
                    <PageTitle title="Master Activity" />
                    <div className="row">
                        <div className="col-md-12 listing-extras">
                            {Util.hasPrivilage(PRIVILEGE_CREATE_MASTER) &&
                                <AddNewBtn callback={this.onAddnewClick.bind(this)}/>
                            }
                            <SearchWidget withButton={true} onSearch={this.onSearch.bind(this)} onClear={this.onClearSearch.bind(this)}/>
                        </div>
                    </div>
                    <div className="row activity-container">
                        <div className="col-md-12 flex-container">
                            {activityMasterList}
                        </div>
                    </div>
                </MainContainer>
                <ActivityMasterDetailDialog
                    open={this.props.activityMaster.detailDialogOpen}
                    onRequestClose={this.handleDetailDialogVisibility.bind(this)}
                    onSuccess={this.loadActivityMasterList.bind(this)}
                    activityMaster = {this.state.currentActivityMaster}
                />
                <ActivityMasterStatisticsDialog
                    open={this.state.viewStats}
                    onRequestClose={this.handleStatsDialogVisibility.bind(this)}
                    activityMaster = {this.state.currentActivityMaster}
                />
			</Root>
        );
    }

    handleDetailDialogVisibility() {
        this.props.detailDialogOpen(false);
        this.setState({ currentActivityMaster: "" });
    }

    handleStatsDialogVisibility() {
        this.setState({ viewStats: false, currentActivityMaster: "" });
    }

    onAddnewClick() {
        this.props.detailDialogOpen(true);
    };

    onSearch(searchKey) {
        const filteredMasters = this.filterItems(searchKey, this.activityMasterList);
        this.props.loadActivityMasterList(filteredMasters);
    }

    filterItems(query, array) {
        return array.filter((el) => {
            return el.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        })
    }

    onClearSearch() {
        this.props.loadActivityMasterList(this.activityMasterList);
    }

    onSwitchChange(activityMaster, changedValue) {
        if (activityMaster && confirm("Do you want to change status ?")) {
            const request = {
                "enable": changedValue
            };
            ActivityMasterService.changeMasterStatus(activityMaster.id, request)
                .then(data => {
                    riverToast.show("Activity master status has been changed successfully");
                })
                .catch(error => {
                    riverToast.show(error.status_message || "Something went wrong while changing status");
                })
        }
    }

    onDelete(activityMaster) {
        if (confirm("Are you sure?")) {
            ActivityMasterService.deleteActivityMaster(activityMaster.id)
            .then((data) => {
                riverToast.show("Deleted successfully");
                this.loadActivityMasterList();
            })
            .catch ((error) => {
                riverToast.show("Something went wrong");
            })
        }
    }

    onUpdate(activityMaster) {
        this.setState({ currentActivityMaster: activityMaster });
        this.props.detailDialogOpen(true);        
    }

    viewStat(activityMaster) {
        this.setState({ currentActivityMaster: activityMaster });
        this.setState({ viewStats: true });
    }

    loadActivityMasterList() {
        ActivityMasterService.getActivityMasters()
        .then((data) => {
            this.activityMasterList = data;
            this.props.loadActivityMasterList(data);
        })
        .catch((error) => {
            riverToast.show("Something went wrong while fetching activity masters.");
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMaster);