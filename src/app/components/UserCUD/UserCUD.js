import React, { Component } from 'react';
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import moment from 'moment';

// root component
import { Root } from "../Layout/Root";

// custom component
import { Util } from "../../Util/util";
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { riverToast } from '../Common/Toast/Toast';
import {SelectBox} from '../Common/SelectBox/SelectBox';
import UserCUDAddDialog from './UserCUDAddDialog/UserCUDAddDialog';

// css
import "./UserCUD.scss";

// actions
import { loadUserCuds,
         pushUserCuds } from './UserCUD.actions';
import { UserCUDService } from './UserCUD.service';

const mapStateToProps = (state, ownProps) => {
    return {
        userCud: state.UserCUDReducer
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadUserCuds: (list) => {
            dispatch(loadUserCuds(list))
        },
        pushUserCuds: (list) => {
            dispatch(pushUserCuds(list))
        }
    }
}

class UserCUD extends Component {
    state ={
        addCudDialog: false,
        pageNo: 0,
        loadMoreEnabled: true,
        loadingMore: false,
        currentCud: ""
    }

    componentDidMount() {
        this.loadAllCuds();
    }
    
    render() {
        const userCudTableRows = (this.props.userCud.userCudList) ? this.props.userCud.userCudList.map((item, index) => {
           
            return <div key={index} className="cud-item">
                <div className="title">{item.title} { item.councilActionStatus == 'INPROGRESS' && <span onClick={this.onCudEditClick.bind(this, (item.councilActionStatus == 'INPROGRESS') ? item : "")}>Edit</span>}</div>
                <div className="description">{item.description}</div>
                <div className="info">
                    <div className="item">
                        <div className="label">Date</div>
                        <div className="value">{moment.unix(item.achievementDate / 1000).format("DD MMM YYYY")}</div>
                    </div>

                    <div className="item">
                        <div className="label">Raised on</div>
                        <div className="value">{moment.unix(item.createdDate / 1000).format("DD MMM YYYY")}</div>
                    </div>

                    <div className="item">
                        <div className="label">Panel</div>
                        <div className="value">{item.council.name}</div>
                    </div>

                    <div className="item">
                        <div className="label">Status</div>
                        <div className="value">{item.councilActionStatus.toUpperCase()}</div>
                    </div>

                    <div className="item">
                        <div className="label">Bucket</div>
                        <div className="value">{(item.bucket_type) ? item.bucket_type.title : (item.councilActionStatus == 'rejected' ? "--Rejected--" : "--")}</div>
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
           
           
           
            // return <TableRow key={index} className="usercud-table-row">
            //             <TableCell
            //                 className = {("no-ellipsis ") + (item.councilActionStatus == 'INPROGRESS') ? "clickable" : ""}
            //                 onClick={this.onCudEditClick.bind(this, (item.councilActionStatus == 'INPROGRESS') ? item : "")}
            //             >
            //                 {item.title}
            //             </TableCell>
            //             <TableCell className="no-ellipsis">{item.description}</TableCell>
            //             <TableCell className="no-ellipsis">{moment.unix(item.achievementDate / 1000).format("DD MMM YYYY")}</TableCell>
            //             <TableCell className="no-ellipsis">{moment.unix(item.createdDate / 1000).format("DD MMM YYYY")}</TableCell>
            //             <TableCell className="no-ellipsis">{item.council.name}</TableCell>
            //             <TableCell className="no-ellipsis">{item.councilActionStatus.toUpperCase()}</TableCell>
            //             <TableCell className="no-ellipsis">{(item.bucket_type) ? item.bucket_type.title : (item.councilActionStatus == 'rejected' ? "--Rejected--" : "")}</TableCell>
            //             <TableCell className="no-ellipsis">{item.memberPoint}</TableCell>
            //             <TableCell className="no-ellipsis">{item.clubPoint}</TableCell>                        
            //         </TableRow>
        })
        : false;

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="CUD" />
                    <div className="usercud-contents-container">
                        <div className="usercud-table-title-head">                            
                            <div className="usercud-table-btn-container">
                                <Button
                                    className="usercud-table-btn"
                                    color="primary"
                                    raised
                                    onClick={this.toggleAddCudDialog.bind(this)}
                                >
                                    NEW CUD
                                </Button>
                            </div>
                        </div>
                        <div className="usercud-table-content">
                            {userCudTableRows}
                            {/* <Table className="usercud-table">
                                <TableHead className="usercud-table-head">
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>CUD raised date</TableCell>
                                        <TableCell>Council</TableCell>                                                        
                                        <TableCell>Status</TableCell>                                                        
                                        <TableCell>Bucket</TableCell>                                                        
                                        <TableCell>User Points</TableCell>                                                        
                                        <TableCell>Club Points</TableCell>                                        
                                    </TableRow>
                                </TableHead>
                                <TableBody className="usercud-table-body">
                                    {userCudTableRows}
                                </TableBody>
                            </Table> */}
                        </div>
                        {
                            (this.state.loadMoreEnabled && !this.state.loadingMore) &&
                                <div
                                    className="usercud-table-loadmore-btn"
                                    onClick={this.loadAllCuds.bind(this)}
                                >
                                    Load More
                                </div>
                        }
                        {
                            (this.state.loadingMore) &&
                                <div
                                    className="usercud-table-loadmore-btn"
                                >
                                    Loading More
                                </div>
                        }
                    </div>
                    <UserCUDAddDialog 
                        open={this.state.addCudDialog}
                        onRequestClose={this.toggleAddCudDialog.bind(this)}
                        cud = {this.state.currentCud}
                    />
                </MainContainer>
            </Root>
        );
    }

    toggleAddCudDialog(afterCreate, clearCud = false) {
        const flag = !this.state.addCudDialog;

        if(clearCud) {
            this.setState({ 
                ...this.state,
                currentCud: "",
                addCudDialog: flag
            });
        } else {
            this.setState({ addCudDialog: flag });
        }
        
        if(afterCreate) {
            this.loadAllCuds(true);
        }
    }

    onCudEditClick(cud) {
        if(cud) {
            
            this.setState({ 
                ...this.state,
                currentCud: cud,
                addCudDialog: true    
            })
        }
    }

    loadAllCuds(submitSuccess = false) {
        const pageNo = (submitSuccess) ? 0 : this.state.pageNo;
        this.setState({ loadingMore: true });

        UserCUDService.loadAllCuds(pageNo)
        .then((data) => {
            if(pageNo == 0) {
                this.props.loadUserCuds(data);
            } else {
                this.props.pushUserCuds(data);
            }
            if(data.length == 0) {
                this.setState({ loadMoreEnabled: false });
            } else {
                this.setState({ pageNo: pageNo + 1 });
            }
            this.setState({ loadingMore: false });            
        })
        .catch((error) => {
            this.setState({ loadingMore: false });
            riverToast.show(error.status_message || "Something went wrong while fetching CUDs")
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCUD);