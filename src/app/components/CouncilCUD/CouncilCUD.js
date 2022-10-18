import React, {Component} from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Tabs, {Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import moment from 'moment';

// root component
import {Root} from "../Layout/Root";

// custom component
import {Util} from "../../Util/util";
import {MainContainer} from "../Common/MainContainer/MainContainer";
import {PageTitle} from '../Common/PageTitle/PageTitle';
import {riverToast} from '../Common/Toast/Toast';
import {SelectBox} from '../Common/SelectBox/SelectBox';
import CudActionDialog from './CudActionDialog/CudActionDialog';

// css
import "./CouncilCUD.scss";

// actions
import {loadBucketTypes, loadCouncilCuds, pushCouncilCuds} from './CouncilCUD.actions';
import {CouncilCUDService} from './CouncilCUD.service';

const mapStateToProps = (state, ownProps) => {
    return {councilCUD: state.CouncilCUDReducer}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadCouncilCuds: (list, status) => {
            dispatch(loadCouncilCuds(list, status))
        },
        pushCouncilCuds: (list, status) => {
            dispatch(pushCouncilCuds(list, status))
        },
        loadBucketTypes: (list) => {
            dispatch(loadBucketTypes(list))
        }
    }
}
class CouncilCUD extends Component {
    state = {
        inProgressPageNo: 0,
        completePageNo: 0,
        currentCud: "",
        loadMoreInProgressEnabled: true,
        loadMoreCompletedEnabled: true,
        loadingMoreCompleted: false,
        loadingMoreInProgress: false,
        actionDialog: false
    }

    componentDidMount() {
        this.loadAllCuds();
        this.getBucketTypes();
    }

    render() {

        const inprogressCudTableRows = (this.props.councilCUD.councilCud.INPROGRESS)
            ? this
                .props
                .councilCUD
                .councilCud
                .INPROGRESS
                .map((item, index) => {

                    return <div key={index} className="cud-item">
                        <div className="title">{item.title}
                            <span
                                onClick={this
                                .onActionClick
                                .bind(this, item)}>Take Action</span>
                        </div>
                        <div className="description">{item.description}</div>
                        <div className="info">
                            <div className="item">
                                <div className="label">Date</div>
                                <div className="value">{moment
                                        .unix(item.achievementDate / 1000)
                                        .format("DD MMM YYYY")}</div>
                            </div>

                            <div className="item">
                                <div className="label">Raised on</div>
                                <div className="value">{moment
                                        .unix(item.createdDate / 1000)
                                        .format("DD MMM YYYY")}</div>
                            </div>

                            <div className="item">
                                <div className="label">Panel</div>
                                <div className="value">{item.council.name}</div>
                            </div>

                            <div className="item">
                                <div className="label">Status</div>
                                <div className="value">{item
                                        .councilActionStatus
                                        .toUpperCase()}</div>
                            </div>

                            {/* <div className="item">
                        <div className="label">Bucket</div>
                        <div className="value">{(item.bucket_type) ? item.bucket_type.title : (item.councilActionStatus == 'rejected' ? "--Rejected--" : "--")}</div>
                    </div> */}

                            {/* <div className="item">
                        <div className="label">Member Point</div>
                        <div className="value">{item.memberPoint}</div>
                    </div>

                    <div className="item">
                        <div className="label">Club Point</div>
                        <div className="value">{item.clubPoint}</div>
                    </div> */}
                        </div>

                    </div>

                    // return <TableRow key={index} className="inprogress-cuds-table-row">
                    //   <TableCell className="no-ellipsis">{item.title}</TableCell>
                    // <TableCell className="no-ellipsis">{item.description}</TableCell>
                    // <TableCell className="no-ellipsis">{moment.unix(item.achievementDate /
                    // 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>             <TableCell
                    // className="no-ellipsis">{moment.unix(item.createdDate / 1000).format("DD MMM
                    // YYYY, hh:mm A")}</TableCell>             <TableCell
                    // className="no-ellipsis">{(item.council) ? item.council.name : ""}</TableCell>
                    //             <TableCell
                    // className="no-ellipsis">{item.councilActionStatus}</TableCell>
                    // <TableCell onClick={this.onActionClick.bind(this, item)}
                    // className="no-ellipsis action-link">                 Take Action
                    // </TableCell>             <TableCell
                    // className="no-ellipsis">{item.memberPoint}</TableCell>             <TableCell
                    // className="no-ellipsis">{item.clubPoint}</TableCell>         </TableRow>
                })
            : false;

        const completedCudTableRows = (this.props.councilCUD.councilCud.COMPLETED)
            ? this
                .props
                .councilCUD
                .councilCud
                .COMPLETED
                .map((item, index) => {
                    // return <TableRow key={index} className="completed-cuds-table-row">
                    //  <TableCell className="no-ellipsis">{item.title}</TableCell>
                    // <TableCell className="no-ellipsis">{item.description}</TableCell>
                    // <TableCell className="no-ellipsis">{moment.unix(item.achievementDate /
                    // 1000).format("DD MMM YYYY, hh:mm A")}</TableCell>             <TableCell
                    // className="no-ellipsis">{moment.unix(item.createdDate / 1000).format("DD MMM
                    // YYYY, hh:mm A")}</TableCell>             <TableCell
                    // className="no-ellipsis">{(item.council) ? item.council.name : ""}</TableCell>
                    //             <TableCell
                    // className="no-ellipsis">{item.councilActionStatus.toUpperCase()}</TableCell>
                    //            <TableCell className="no-ellipsis">{(item.bucket_type) ?
                    // item.bucket_type.title : (item.councilActionStatus == 'rejected' ?
                    // "--Rejected--" : "")}</TableCell>             <TableCell
                    // className="no-ellipsis">{item.memberPoint}</TableCell>             <TableCell
                    // className="no-ellipsis">{item.clubPoint}</TableCell>         </TableRow>

                    return <div key={index} className="cud-item">
                        <div className="title">{item.title}
                        </div>
                        <div className="description">{item.description}</div>
                        <div className="info">
                            <div className="item">
                                <div className="label">Date</div>
                                <div className="value">{moment
                                        .unix(item.achievementDate / 1000)
                                        .format("DD MMM YYYY")}</div>
                            </div>

                            <div className="item">
                                <div className="label">Raised on</div>
                                <div className="value">{moment
                                        .unix(item.createdDate / 1000)
                                        .format("DD MMM YYYY")}</div>
                            </div>

                            <div className="item">
                                <div className="label">Panel</div>
                                <div className="value">{item.council.name}</div>
                            </div>

                            <div className="item">
                                <div className="label">Status</div>
                                <div className="value">{item
                                        .councilActionStatus
                                        .toUpperCase()}</div>
                            </div>

                            <div className="item">
                                <div className="label">Bucket</div>
                                <div className="value">{(item.bucket_type)
                                        ? item.bucket_type.title
                                        : (item.councilActionStatus == 'rejected'
                                            ? "--Rejected--"
                                            : "--")}</div>
                            </div>

                            <div className="item">
                                <div className="label">Member Point</div>
                                <div className="value">{item.memberPoint}</div>
                            </div>

                            <div className="item">
                                <div className="label">Club Point</div>
                                <div className="value">{item.clubPoint}</div>
                            </div>
                        </div>

                    </div>
                })
            : false;

        return (
            <Root role="admin">
                <MainContainer>
                    <PageTitle title="COUNCIL CUD"/>
                    <div className="council-cud-container">
                        <div className="cuds-table-container inprogress">
                            <div className="cuds-table-title">
                                In Progress
                            </div>
                            <div className="cuds-table-content">
                            {inprogressCudTableRows}
                                {/* <Table className="cuds-table">
                                    <TableHead className="cuds-table-head">
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Achieved Date</TableCell>
                                            <TableCell>Raised Date</TableCell>
                                            <TableCell>Council</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Bucket</TableCell>
                                            <TableCell>User Points</TableCell>
                                            <TableCell>Club Points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="cuds-table-body">
                                        {inprogressCudTableRows}
                                    </TableBody>
                                </Table> */}
                            </div>
                            {(this.state.loadMoreInProgressEnabled && !this.state.loadingMoreInProgress) && <div
                                className="cuds-table-loadmore-btn"
                                onClick={this
                                .loadCuds
                                .bind(this, 'INPROGRESS', null)}>
                                Load More
                            </div>
}
                            {(this.state.loadingMoreInProgress) && <div className="cuds-table-loadmore-btn">
                                Loading More
                            </div>
}
                        </div>
                        <div className="cuds-table-container completed">
                            <div className="cuds-table-title">
                                Completed
                            </div>
                            <div className="cuds-table-content">
                            {completedCudTableRows}
                                {/* <Table className="cuds-table">
                                    <TableHead className="cuds-table-head">
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Raised Date</TableCell>
                                            <TableCell>Council</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Bucket</TableCell>
                                            <TableCell>User Points</TableCell>
                                            <TableCell>Club Points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="cuds-table-body">
                                        {completedCudTableRows}
                                    </TableBody>
                                </Table> */}
                            </div>
                            {(this.state.loadMoreCompletedEnabled && !this.state.loadingMoreCompleted) && <div
                                className="cuds-table-loadmore-btn"
                                onClick={this
                                .loadCuds
                                .bind(this, 'COMPLETED', null)}>
                                Load More
                            </div>
}
                            {(this.state.loadingMoreCompleted) && <div className="cuds-table-loadmore-btn">
                                Loading More
                            </div>
}
                        </div>
                    </div>
                </MainContainer>
                <CudActionDialog
                    open={this.state.actionDialog}
                    onRequestClose={this
                    .onActionDialogClose
                    .bind(this)}
                    cud={this.state.currentCud}/>
            </Root>
        );
    }

    onActionClick(cud) {
        this.setState({
            ...this.state,
            currentCud: cud,
            actionDialog: true
        });
    }

    loadAllCuds(pageNo) {
        this.loadCuds('INPROGRESS', pageNo);
        this.loadCuds('COMPLETED', pageNo);
    }

    onActionDialogClose(success) {
        if (success) {
            this.loadAllCuds(0);
        }
        this.toggleCudActionDialog();
    }

    toggleCudActionDialog() {
        let flag = !this.state.actionDialog;
        this.setState({actionDialog: flag})
    }

    getBucketTypesList(list) {
        return list.map((item) => {
            return {title: item.title, value: item.id}
        })
    }

    getBucketTypes() {
        CouncilCUDService
            .getBucketTypes()
            .then((data) => {
                const list = this.getBucketTypesList(data);
                this
                    .props
                    .loadBucketTypes(list);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while getting buckets list");
            })
    }

    toggleLoadMore(status) {
        switch (status) {
            case 'INPROGRESS':
                let flag = !this.state.loadingMoreInProgress;
                this.setState({loadingMoreInProgress: flag});
                break;
            case 'COMPLETED':
                flag = !this.state.loadingMoreCompleted;
                this.setState({loadingMoreCompleted: flag});
                break;
        }
    }

    loadCuds(status, setPageNo) {
        const pageNo = (setPageNo || setPageNo == 0)
            ? setPageNo
            : ((status == 'INPROGRESS')
                ? this.state.inProgressPageNo
                : this.state.completePageNo);
        this.toggleLoadMore(status);

        const query = `?status=${status}&page=${pageNo}&size=20`;
        CouncilCUDService
            .loadAllCuds(query)
            .then((data) => {
                if (pageNo == 0) {
                    this
                        .props
                        .loadCouncilCuds(data, status);
                } else {
                    this
                        .props
                        .pushCouncilCuds(data, status);
                }
                if (data.length != 0) {
                    if (status == 'INPROGRESS') {
                        this.setState({
                            inProgressPageNo: pageNo + 1
                        });
                    } else {
                        this.setState({
                            completePageNo: pageNo + 1
                        });
                    }
                } else {
                    if (status == 'INPROGRESS') {
                        this.setState({loadMoreInProgressEnabled: false});
                    } else {
                        this.setState({loadMoreCompletedEnabled: false});
                    }
                }

                this.toggleLoadMore(status);
            })
            .catch((error) => {
                this.toggleLoadMore(status);
                riverToast.show(error.status_message || "Something went wrong while fetching CUDs")
            })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CouncilCUD)