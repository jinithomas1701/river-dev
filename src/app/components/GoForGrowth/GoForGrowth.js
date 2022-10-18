import React, { Component } from 'react';
import { connect } from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import TextField from 'material-ui/TextField';
import { SelectBox } from '../Common/SelectBox/SelectBox';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Datetime from 'react-datetime';
import moment from "moment";

import Select from 'react-select';

//root component
import { Root } from "../Layout/Root";

// custom component
import { MainContainer } from "../Common/MainContainer/MainContainer";
import { PageTitle } from '../Common/PageTitle/PageTitle';
import { Util } from '../../Util/util';
import { Toast, riverToast } from '../Common/Toast/Toast';

import GoForGrowthItem from './GoForGrowthItem/GoForGrowthItem';
import AddGFGDialog from './AddGFGDialog/AddGFGDialog';

import Autosuggest from 'react-autosuggest';

// actions
import {
    loadGfgList,
    addGfgItemToList,
    changeGfgOnIndex,
    pushGfgList,
    deleteGfgAt
} from './GoForGrowth.actions';

// service
import { GoForGrowthService } from './GoForGrowth.service';

import Dock from 'react-dock';

// css
import './GoForGrowth.scss';

const mapStateToProps = (state, ownProps) => {
    return {
        gfgStore: state.GoForGrowthReducer
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadGfgList: (list) => {
            dispatch(loadGfgList(list))
        },
        pushGfgList: (list) => {
            dispatch(pushGfgList(list))
        },
        addGfgItemToList: (gfg) => {
            dispatch(addGfgItemToList(gfg));
        },
        changeGfgOnIndex: (gfg, index) => {
            dispatch(changeGfgOnIndex(gfg, index))
        },
        deleteGfgAt: (index) => {
            dispatch(deleteGfgAt(index))
        }
    }
}

const GFG_ADMINISTRATIONS = "GFG_ADMINISTRATIONS";
const GFG_CHANGE_STATUS = "GFG_CHANGE_STATUS";
const GFG_MANAGE_PANEL = "GFG_MANAGE_PANEL";


class GoForGrowth extends Component {
    state = {
        addGFGDialog: false,
        currentGfg: '',
        pageNo: 0,
        isReachedBottom: false,
        gfgIndex: '',
        menuOpen: false,
        selectedItems: [],
        fromDateFilter: '',
        toDateFilter: '',
        isVisible: false,
        clickedItem: null,
        comment: null,
        comments: [],
        isLoading: false,
        clickedSettings: null,
        isSettingsVisible: false,
        settingsAccounts: [],
        selectedOption: [],
        settingsPanel: [],
        addPanelsuggestions: [],
        textValue: '',
        addTextObject: null,
        isLoadmoreEnabled: true

    }
    componentDidMount() {
        this.getGfgItems();
        window.onscroll = (ev) => {
            if (window.location.hash === "#/goforgrowth") {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    if (!this.state.isReachedBottom && this.props.gfgStore.gfgList.length > 0) {
                        this.getGfgItems(this.state.pageNo, this.state.filterMode);
                    }
                }
            }
        };

        this.getAccounts();
        this.getStatus();
    }

    render() {

        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#dff0d8",
            color: "#3c763d"
        };


        let statusFilter = this.state.statusFilter;
        let accountFilter = this.state.accountFilter;

        const commentValue = this.state.comment;

        const commentsList = this.state.comments.map((cmnt) => {
            return <div className="comments">
                {(cmnt.type == 'GO_FOR_GROWTH_ACTION') ?
                    <div className="item-action">
                        <div className="value">{cmnt.value} <span> on {moment.unix(cmnt.postedOn / 1000).format("DD MMM YYYY hh:mm a")}</span></div>
                    </div>
                    :
                    <div className="item">
                        <div className="by">{cmnt.postedBy.name}</div>
                        <div className="on">{moment.unix(cmnt.postedOn / 1000).format("DD MMM YYYY hh:mm a")}</div>
                        <div className="value">{cmnt.value}</div>
                    </div>

                }




            </div>
        });

        const gfgTilesList = this.props.gfgStore.gfgList.map((item, index) => {
            return <GoForGrowthItem
                key={index}
                gfgItem={item}
                onUpdateClick={this.onGfgUpdate.bind(this)}
                onDeleteGfg={this.onDeleteGfg.bind(this)}
                selectedItems={this.state.selectedItems}
                handleCheckBoxChange={this.handleCheckBoxChange.bind(this)}
                onTitleClick={this.onTitleClick.bind(this)}
                index={index}
            />
        });

        const settingsDock = this.state.settingsPanel.map((item, index) => {

            return <div key={index} className="member">
                <div className="name"><span>{item.fullname}</span>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                        <Checkbox checked={item.isAdmin} onChange={(event, value) => {
                            this.switchAdminPanelMember(item.userId, value);
                        }} /> Is G4G Admin? </span>

                    <Button title="Remove this Member" onClick={this.deletePanelMember.bind(this, item.userId)}><Icon className="delete_icon">close</Icon></Button> </div>
                <div className="accounts">
                    <label className="ac-label">Restricted to accounts</label>
                    <div>
                        <Select
                            className="acs"
                            name="form-field-name"
                            value={item.accounts}
                            onChange={(el) => { this.handleMultiChange(item, el) }}
                            isMulti
                            options={this.state.accountsList}
                            getOptionLabel={(item) => item.title}
                        />
                    </div>
                </div>
            </div>

        });

        const inputProps = {
            placeholder: 'Enter atleast 3 letters',
            value: this.state.textValue,
            onChange: this.onChange
        };

        return (
            <Root role="user">
                <MainContainer>
                    <PageTitle title="Go For Growth" />
                    <div className="row gfg-page">
                        <div className="col-md-12 gfg-page-container">
                            {
                                Util.hasPrivilage(GFG_ADMINISTRATIONS) &&
                                <div className="gfg-filters">
                                    <div className="gfg-extras">
                                        {/* <div className="link">
                                            <div className="add-new link" onClick={this.onAddGfg.bind(this)}>Add New Entry</div>                                        
                                        </div> */}

                                        <div className="controls">
                                            {this.props.gfgStore.gfgList.length > 0 &&
                                                <div className="export-to-excel-link link" onClick={this.onExportResult.bind(this)}>Export As Excel</div>}

                                            {Util.hasPrivilage(GFG_MANAGE_PANEL) &&
                                                <div className="export-to-excel-link link" onClick={this.onSettingsClick.bind(this)}>Settings</div>}
                                        </div>

                                    </div>
                                    <div className="gfg-filters-container">
                                        <div className="gfg-filter-item filter account">
                                            <SelectBox
                                                classes="gfg-filter-edit-field select"
                                                id="account"
                                                label="Account"
                                                selectedValue={accountFilter}
                                                selectArray={this.state.accountsList || []}
                                                onSelect={this.handleSelect('accountFilter')} />
                                        </div>
                                        <div className="gfg-filter-item filter reference-profile">
                                            <TextField
                                                id="ref_search_text"
                                                label="Reference Profile"
                                                margin="normal"
                                                value={this.state.refSearchText}
                                                onChange={this.handleChange('refSearchText')}
                                                className="gfg-filter-edit-field"
                                            />
                                        </div>
                                        <div className="gfg-filter-item filter status">
                                            <SelectBox
                                                classes="gfg-filter-edit-field select"
                                                id="status"
                                                label="Status"
                                                selectedValue={statusFilter}
                                                selectArray={this.state.statusList || []}
                                                onSelect={this.handleSelect('statusFilter')} />
                                        </div>
                                        <div className="gfg-filter-item date-field">
                                            <div className="datetime-picker-wrapper">
                                                {
                                                    this.state.fromDateFilter &&
                                                    <label
                                                        className="datetime-picker-label"
                                                        htmlFor="from_filter_date"
                                                    >
                                                        From Date
                                                        </label>
                                                }
                                                <Datetime
                                                    inputProps={
                                                        {
                                                            placeholder: 'From Date',
                                                            id: "from_filter_date",
                                                            className: "datetime-input"
                                                        }
                                                    }
                                                    timeFormat={false}
                                                    className="datetime-picker"
                                                    onChange={(value) => {
                                                        this.setState({ fromDateFilter: Math.round((new Date(value)).getTime()) });
                                                    }}
                                                    value={this.state.fromDateFilter ? new Date(this.state.fromDateFilter) : ''}
                                                    open={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="gfg-filter-item date-field">
                                            <div className="datetime-picker-wrapper">
                                                {
                                                    this.state.toDateFilter &&
                                                    <label
                                                        className="datetime-picker-label"
                                                        htmlFor="to_filter_date"
                                                    >
                                                        To Date
                                                        </label>
                                                }
                                                <Datetime
                                                    inputProps={
                                                        {
                                                            placeholder: 'To Date',
                                                            id: "to_filter_date",
                                                            className: "datetime-input"
                                                        }
                                                    }
                                                    timeFormat={false}
                                                    className="datetime-picker"
                                                    onChange={(value) => {
                                                        this.setState({ toDateFilter: Math.round((new Date(value)).getTime()) });
                                                    }}
                                                    open={false}
                                                    value={this.state.toDateFilter ? new Date(this.state.toDateFilter) : ''}
                                                />
                                            </div>
                                        </div>
                                        <div className="gfg-filter-item button">
                                            <Button
                                                raised
                                                color="primary"
                                                onClick={this.onFilter.bind(this)}
                                                className="filter-btn"
                                            >
                                                <Icon>filter_list</Icon>
                                                Search
                                            </Button>
                                            <Button
                                                raised
                                                color="primary"
                                                onClick={this.onClearFilter.bind(this)}
                                                className="filter-btn"
                                            >
                                                <Icon>clear_all</Icon>
                                                Clear Filter
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="gfg-tiles-container">
                                <div className="gfg-tile add-new" title="Enter Identified Opportunity" onClick={this.onAddGfg.bind(this, '')}>
                                    <Icon>library_add</Icon> ADD IDENTIFIED OPPORTUNITY
                                </div>
                                {gfgTilesList}
                            </div>
                            <div className="loadmore-wrapper">
                                {this.state.isLoadmoreEnabled && <Button className="btn-loadmore" onClick={this.loadMoreGrowth}>Load More</Button>}
                            </div>
                        </div>
                    </div>
                </MainContainer>
                {/* <AddGFGDialog
                    open={this.state.addGFGDialog}
                    onRequestClose ={this.toggleAddDialog.bind(this, null)}
                    gfg= {this.state.currentGfg}
                    index={this.state.gfgIndex}
                    onSuccess={this.onGfgSuccess.bind(this)}
                /> */}
                {
                    (this.state.selectedItems.length > 0) &&
                    <div className="gfg-status-btns-container">
                        <Tooltip title="SHORTLIST">
                            <Button fab onClick={this.onGfgStatusChange.bind(this, "SHRT")} className="gfg-status-btn shortlisted">
                                <Icon>favorite</Icon>
                            </Button>
                        </Tooltip>
                        <Tooltip title="ACCEPTED">
                            <Button fab onClick={this.onGfgStatusChange.bind(this, "ACC")} className="gfg-status-btn accepted">
                                <Icon>thumb_up</Icon>
                            </Button>
                        </Tooltip>
                        <Tooltip title="REJECTED">
                            <Button fab onClick={this.onGfgStatusChange.bind(this, "RJT")} className="gfg-status-btn rejected">
                                <Icon>thumb_down</Icon>
                            </Button>
                        </Tooltip>
                    </div>
                }


                {this.state.clickedItem && <Dock zIndex={200} position='right' isVisible={this.state.isVisible} dimMode="none" defaultSize={.6}>

                    <div className="dock-cntr">
                        <div className="back-btn" onClick={() => this.setState({ isVisible: !this.state.isVisible })}> <Icon>close</Icon> CLOSE</div>
                        <div className="content">
                            <div className="title">
                                {Util.hasPrivilage(GFG_CHANGE_STATUS) &&
                                    <div className="selector"><Tooltip title="Select this entry">

                                        <Checkbox
                                            checked={this.state.selectedItems.includes(this.state.clickedItem.id)}
                                            onChange={this.handleCheckBoxChange.bind(this, this.state.clickedItem.id)}
                                            value="checkedB"
                                            color="accent"
                                            className="checkbox"
                                        />
                                    </Tooltip>
                                    </div>
                                }

                                {this.state.clickedItem.opportunity}
                            </div>
                            <div className="created">
                                Created by {this.state.clickedItem.createdBy.fullname} on {moment.unix(this.state.clickedItem.createdOn / 1000).format("DD MMM YYYY hh:mm a")}
                                {
                                    (this.state.clickedItem.status && this.state.clickedItem.status.code != "CRTD") &&
                                    <div className={"status " + this.state.clickedItem.status.code.toLowerCase()}>
                                        {
                                            this.state.clickedItem.status.code == "SHRT" &&
                                            <Icon className="status-icon">favorite</Icon>
                                        }
                                        {
                                            this.state.clickedItem.status.code == "ACC" &&
                                            <Icon className="status-icon">thumb_up</Icon>
                                        }
                                        {
                                            this.state.clickedItem.status.code == "RJT" &&
                                            <Icon className="status-icon">thumb_down</Icon>
                                        }
                                        {this.state.clickedItem.status ? this.state.clickedItem.status.status : ''}
                                    </div>
                                }
                            </div>
                            <div className="desc">
                                <div className="label">Job description</div>
                                <div className="value">{this.state.clickedItem.jobDescription || '--'}</div>
                            </div>

                            <div className="info">
                                <div className="item">
                                    <div className="label">Reference Id</div>
                                    <div className="value">{this.state.clickedItem.referenceId}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Account</div>
                                    <div className="value">{this.state.clickedItem.account ? this.state.clickedItem.account.name : "--"}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Primary Technology</div>
                                    <div className="value">{this.state.clickedItem.primaryTechnology || '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Secondary Technology</div>
                                    <div className="value">{this.state.clickedItem.secondaryTechnology || '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Experience Level</div>
                                    <div className="value">{this.state.clickedItem.experienceLevel || '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Success Factors</div>
                                    <div className="value">{this.state.clickedItem.successFactors || '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Reference Profile</div>
                                    <div className="value">{this.state.clickedItem.referenceProfile || '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Date Open</div>
                                    <div className="value">{this.state.clickedItem.dateFlashes ? moment.unix(this.state.clickedItem.dateFlashes / 1000).format("DD MMM YYYY") : '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Closure Date</div>
                                    <div className="value">{this.state.clickedItem.closureDate ? moment.unix(this.state.clickedItem.closureDate / 1000).format("DD MMM YYYY") : '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Priority</div>
                                    <div className="value">{this.state.clickedItem.priority ? this.state.clickedItem.priority.priority : '--'}</div>
                                </div>
                                <div className="item">
                                    <div className="label">Flash To Other vendors</div>
                                    <div className="value">{this.state.clickedItem.flashedToOtherVendors ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                            <hr />
                            <h5 className="head-label"><Icon>mode_comment</Icon>Comments</h5>
                            <div className="add-comment">
                                <TextField multiline={true} className="text" placeholder="Add Comment" rows="2" onChange={this.enterComment.bind(this)} value={commentValue}></TextField>
                                <Button className="btn" onClick={this.postComment.bind(this)}>Post</Button>
                            </div>

                            {(this.state.comments && this.state.comments.length > 0) ?
                                commentsList : this.state.isLoading ? <i>Loading comments..</i> : <i> No Comments</i>}

                        </div>
                    </div>
                </Dock>}

                <Dock zIndex={200} position='left' isVisible={this.state.isSettingsVisible} dimMode="none" defaultSize={.6}>
                    <div className="dock-cntr">
                        <div className="back-btn" onClick={() => this.setState({ isSettingsVisible: !this.state.isSettingsVisible })}> <Icon>close</Icon> CLOSE</div>
                        <hr />

                        <div className="settings-dock">
                            <div className="title" >Panel Members</div>
                            <div className="info"> Panel Member without any account mapping can view all accounts data</div>

                            <div className="add_user">

                                <Autosuggest className="add_input_box"
                                    suggestions={this.state.addPanelsuggestions}
                                    onSuggestionsFetchRequested={this.addPanelFetchRequested.bind(this)}
                                    onSuggestionsClearRequested={this.addPanelClearRequested.bind(this)}
                                    getSuggestionValue={this.getSuggestionValue.bind(this)}
                                    renderSuggestion={this.renderSuggestion.bind(this)}
                                    inputProps={inputProps}
                                />

                                <Button color={'primary'} onClick={this.addPanelMemberClicked.bind(this)}> ADD MEMBER</Button>
                            </div>
                            {settingsDock}
                        </div>

                    </div>

                </Dock>

            </Root>
        );
    }

    loadMoreGrowth = () => {
        const pageNo = this.state.pageNo;
        this.getGfgItems(pageNo);
    };

    addPanelFetchRequested(value) {
        console.log('addPanelFetchRequested ', value);
        this.loadPanelUserSuggestions(value);

    }

    addPanelClearRequested() {
        console.log('addPanelClearRequested ');
        this.setState({
            addPanelsuggestions: []
        });
    }

    getSuggestionValue(value) {
        console.log('getSuggestionValue ', value);
        this.setState({ addTextObject: value });
        return value.fullname;
    }

    renderSuggestion(value) {
        console.log('renderSuggestion ', value);
        return <div className="add-user-suggestions" key={value.id}>
            {value.fullname} ({value.username})
            </div>

    }


    onChange = (event, { newValue }) => {
        console.log('onChange ', newValue);
        this.setState({
            textValue: newValue
        });
    };


    loadPanelUserSuggestions(sug) {
        if (sug.value.length < 3) {
            return;
        }
        GoForGrowthService.getPanelUsersSuggestion(sug.value).then((data) => {
            this.setState({
                addPanelsuggestions: data
            });
        }).catch((err) => {
            console.log(err);
            riverToast.show("Error fetching user suggestion");
        })
    }

    addPanelMemberClicked() {

        if (confirm('Are you sure, add ' + this.state.addTextObject.fullname + '?')) {

            GoForGrowthService.updatePanel(this.state.addTextObject.id, []).then((data) => {

                this.onSettingsClick();
                riverToast.show("Success : User added");
            }).catch((err) => {
                console.log(err);
                riverToast.show("Error adding panel member");
            })

        }

    }

    deletePanelMember(userId) {

        if (confirm('Are you sure, delete this member?')) {
            GoForGrowthService.deletePanelMember(userId).then((data) => {
                this.onSettingsClick();
                riverToast.show("Success : Panel Member is removed");
            }).catch((err) => {
                console.log(err);
                riverToast.show("Error deleting panel member");
            })
        }
    }

    switchAdminPanelMember(userId, isAdmin) {
        if (confirm('Are you sure, switch admin privilege?')) {
            GoForGrowthService.switchAdminPanelMember(userId, isAdmin).then((data) => {
                this.onSettingsClick();
                riverToast.show("Success : Panel Member updated");
            }).catch((err) => {
                console.log(err);
                riverToast.show("Error updating panel member");
            })
        }
    }


    handleMultiChange = (user, selectedOption) => {
        //this.setState({ selectedOption });
        // selectedOption can be null when the `x` (close) button is clicked

        const selectedIds = selectedOption.map((item, index) => {
            return item.value;
        });

        GoForGrowthService.updatePanel(user.userId, selectedIds).then((data) => {
            this.onSettingsClick();
            riverToast.show("Success : Panel updated");

        }).catch((err) => {
            console.log(err);
            riverToast.show("Error updating panel");
        })

        // if (selectedOption) {
        //   console.log(selectedOption,itemId,selectedIds);
        // }
    }



    enterComment(event) {
        this.setState({ comment: event.target.value });
    }

    postComment() {
        if (!this.state.comment) {
            alert("Enter some comment");
            return;
        }
        GoForGrowthService.postComment(this.state.clickedItem.id, this.state.comment).then((data) => {
            this.setState({ comment: "" });
            this.loadComments();
        }).catch((error) => {
            riverToast.show("Error posting comment");
        })
    }

    loadComments() {
        GoForGrowthService.loadComments(this.state.clickedItem.id).then((data) => {
            this.setState({ comments: data, comment: "", isLoading: false });
        }).catch((error) => {
            riverToast.show("Error loading comments");
        });
    }

    handleCheckBoxChange(itemId) {
        let selectedItems = this.state.selectedItems;
        if (selectedItems.includes(itemId)) {
            selectedItems.splice(selectedItems.indexOf(itemId), 1);
        } else {
            selectedItems.push(itemId);
        }

        this.setState({ selectedItems: selectedItems });
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleSelect = name => value => {
        this.setState({ [name]: value });
    }

    onGfgUpdate(gfgId) {
        this.props.history.push("/goforgrowth/add/" + gfgId);
    }

    onAddGfg() {
        this.props.history.push("/goforgrowth/add");
    }

    onTitleClick(item) {
        this.setState({ comments: [], clickedItem: item, isVisible: true, isLoading: true });
        setTimeout(() => { this.loadComments() }, 1000);
    }

    onSettingsClick() {

        GoForGrowthService.loadPanel().then((data) => {
            this.setState({ isSettingsVisible: true, settingsPanel: data, textValue: '', addTextObject: {}, addPanelsuggestions: [] });
        })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching panel details");
            })



    }

    // toggleAddDialog(gfg, index) {
    //     const flag = !this.state.addGFGDialog;

    //     if(gfg){
    //         this.setState({
    //             ...this.state,
    //             addGFGDialog: flag,
    //             currentGfg: gfg,
    //             gfgIndex: index
    //         });
    //     } else {
    //         this.setState({
    //             ...this.state,
    //             addGFGDialog: flag,
    //             currentGfg: ''
    //         });
    //     }
    // }

    // onGfgSuccess(gfg, reload, index) {
    //     if(gfg && reload) {
    //         this.props.changeGfgOnIndex(gfg, index)
    //     } else if(gfg) {
    //         this.props.addGfgItemToList(gfg);
    //     }
    //     this.toggleAddDialog();

    // }

    onFilter() {
        this.setState({ filterMode: true })
        this.getGfgItems(0, true);
    }

    onGfgStatusChange(status) {
        const statusObj = {
            status: status,
            ids: this.state.selectedItems
        }
        GoForGrowthService.changeStatus(statusObj)
            .then((data) => {
                this.setState({ selectedItems: [] });
                this.getGfgItems(0);
                if (this.state.isVisible) {
                    this.loadComments();
                }

                riverToast.show("Status Changed Successfully");
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while changing status");
            })
    }

    getAccounts() {
        GoForGrowthService.getAccounts()
            .then((data) => {
                data.unshift({ title: "None", value: null });
                this.setState({ accountsList: data });
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching accounts");
            })
    }

    getSelectMenuMeta(list) {
        return list.map((item) => {
            return { title: item.status, value: item.code }
        });
    }

    getStatus() {
        GoForGrowthService.getStatusList()
            .then((data) => {
                const statusSelectList = this.getSelectMenuMeta(data);
                statusSelectList.unshift({ title: "None", value: null })
                this.setState({ statusList: statusSelectList });
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching accounts");
            })
    }

    onClearFilter() {
        this.setState({
            ...this.state,
            accountFilter: '',
            refSearchText: '',
            statusFilter: '',
            fromDateFilter: '',
            toDateFilter: '',
            filterMode: false
        });
        this.getGfgItems(0, false);
    }

    onDeleteGfg(gfgId, index) {
        GoForGrowthService.deleteGfg(gfgId)
            .then((data) => {
                this.props.deleteGfgAt(index);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while fetching Go For Growth items");
            });
    }

    onExportResult() {
        let urlParam = '';
        if (this.state.filterMode) {
            urlParam = urlParam + ('?') + (this.state.accountFilter ? '&account=' + this.state.accountFilter : '') + (this.state.refSearchText ? '&referenceProfile=' + this.state.refSearchText : '') + (this.state.statusFilter ? '&status=' + this.state.statusFilter : '') + (this.state.fromDateFilter ? '&dateFrom=' + this.state.fromDateFilter : '') + (this.state.toDateFilter ? '&dateTo=' + this.state.toDateFilter : '');
        }

        GoForGrowthService.exportResult(urlParam)
            .then((data) => {
                if (data) {
                    Util.downloadFile(data, "result", "xls");
                } else {
                    riverToast.show("Something went wrong while generating result");
                }
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while exporting result.");
            });
    }

    getGfgItems(pageNo, filterMode = false) {
        let loadPageNo = (pageNo != null || pageNo != undefined) ? parseInt(pageNo) : this.state.pageNo;
        let urlParam = '?page=' + (loadPageNo);
        if (filterMode) {
            urlParam = urlParam + (this.state.accountFilter ? '&account=' + this.state.accountFilter : '') + (this.state.refSearchText ? '&referenceProfile=' + this.state.refSearchText : '') + (this.state.statusFilter ? '&status=' + this.state.statusFilter : '') + (this.state.fromDateFilter ? '&dateFrom=' + this.state.fromDateFilter : '') + (this.state.toDateFilter ? '&dateTo=' + this.state.toDateFilter : '');
        }

        GoForGrowthService.getGfgItems(urlParam)
            .then((data) => {
                if (loadPageNo == 0) {
                    this.props.loadGfgList(data);
                } else {
                    this.props.pushGfgList(data);
                }
                this.setState({ isLoadmoreEnabled: (data.length === 10) });

                if (data.length > 0) {
                    this.setState({ pageNo: loadPageNo + 1 });
                } else {
                    this.setState({ isReachedBottom: true });
                }
            })
            .catch((error) => {
                this.setState({ isLoadmoreEnabled: true });
                riverToast.show(error.status_message || "Something went wrong while fetching Go For Growth items");
            });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoForGrowth);