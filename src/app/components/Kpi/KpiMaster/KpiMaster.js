import React, {Component} from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

// custom component
import {Util} from "../../../Util/util";
import {riverToast} from '../../Common/Toast/Toast';
import KpiList from '../KpiList/KpiList';
import KpiDetailsDialog from '../KpiDetailsDialog/KpiDetailsDialog';
import SearchBar from '../../Common/SearchBar/SearchBar';

import KpiService from './KpiMaster.service';

//redux actions
import {KpiLsitChange, selectedKpiChange, selectedKpiReset} from './KpiMaster.actions';

const mapStateToProps = (state) => {
    return {
        kpi: state.KpiMasterReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        KpiLsitChange : (kpiList) => {
            dispatch(KpiLsitChange(kpiList))
        },
        selectedKpiChange : (selectedKpi) => {
            dispatch(selectedKpiChange(selectedKpi))
        },
        selectedKpiReset : (selectedKpi) => {
            dispatch(selectedKpiReset(selectedKpi))
        }
    };
};

// css
import "./KpiMaster.scss";


class KpiMaster extends Component{

    constructor(props){
        super(props);
        this.state = {
            searchTerm: "",
            kpiDetailDialogOpen: false,
            page: 0,
            count: 100
        };
        this.handleKpiSelect = this.handleKpiSelect.bind(this);
        this.handleKpiDialogClose = this.handleKpiDialogClose.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.handleSearchTermSubmit = this.handleSearchTermSubmit.bind(this);
    }

    componentDidMount(){
        this.init();
    }

    render(){
        const kpi = this.props.kpi;

        return (
            <div className="kpimasterpage-wrapper">
                <div className="row">
                    <div className="col-md-6">
                        <SearchBar
                            value={this.state.searchTerm}
                            theme="dark"
                            placeholder="Search Line Items"
                            onChange={this.handleSearchTermChange}
                            onSubmit={this.handleSearchTermSubmit}
                            />
                    </div>
                </div>
                <KpiList
                    kpiList={kpi.kpiList}
                    onSelect={this.handleKpiSelect}
                    />
                <KpiDetailsDialog
                    open={this.state.kpiDetailDialogOpen}
                    kpi={kpi.selectedKpiDetails}
                    onClose={this.handleKpiDialogClose}
                    />
            </div>
        );
    }

    init(){
        this.getKpiList();
    }

    handleKpiSelect(activity){
        this.setState({kpiDetailDialogOpen: true});
        this.getKpiDetails(activity.id);

    }

    handleKpiDialogClose(){
        this.setState({kpiDetailDialogOpen: false});
        this.props.selectedKpiReset();
    }

    handleSearchTermChange(searchTerm){
        this.setState({searchTerm});
    }

    handleSearchTermSubmit(searchTerm){
        this.setState({searchTerm});
        this.getKpiList(searchTerm);
    }

    getKpiList(searchObject){
        const config = {
            searchTerm: this.state.searchTerm,
            page: this.state.page,
            count: this.state.count
        };
        const requestObj = {...config, ...searchObject};

        KpiService.loadKpiList(requestObj.searchTerm, requestObj.page, requestObj.count)
            .then(kpiDetails => {
            this.props.KpiLsitChange(kpiDetails.data);
        })
            .catch(error => {
            riverToast.show(error.status_message || 'Something went wrong while loading LineItem list.');
        });
    }

    getKpiDetails(activityId){
        KpiService.loadKpiDeatails(activityId)
            .then(kpiDetail => {
            this.setState({kpiDetailDialogOpen: true});
            this.props.selectedKpiChange(kpiDetail);
        })
            .catch(error => {
            riverToast.show(error.status_message || 'Something went wrong while loading LineItem details.');
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KpiMaster);