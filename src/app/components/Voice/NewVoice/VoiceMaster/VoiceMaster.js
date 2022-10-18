import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton/IconButton';
import moment from 'moment';
import Dock from 'react-dock';

// custom component
import { Util } from '../../../../Util/util';
import { riverToast } from '../../../Common/Toast/Toast';
import { CommonService } from '../../../Layout/Common.service';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import Pagination from "../../../Common/Pagination/Pagination";
import StackedList from "../../../Common/StackedList/StackedList";
import SearchBar from "../../../Common/SearchBar/SearchBar";

import VoiceListItem from '../VoiceListItem/VoiceListItem';
import VoiceDetails from '../VoiceDetails/VoiceDetails';
import CreateVoiceDialog from '../CreateVoiceDialog/CreateVoiceDialog';

// css
import './VoiceMaster.scss';

import VoiceMasterService from "./VoiceMaster.service";
import { storeVoiceList, clearVoiceList, storeVoiceDetails, clearVoiceDetails, storeDepartments, storeVoiceTypes, storeDiscussion, clearDiscussion } from './VoiceMaster.actions';

const MIN_SEARCH_TEXT_LENGTH = 3;

const mapStateToProps = (state) => {
    return { voice: state.VoiceMasterReducer };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeVoiceList: (voiceList) => {
            dispatch(storeVoiceList(voiceList))
        },
        clearVoiceList: () => {
            dispatch(clearVoiceList())
        },
        storeVoiceDetails: (selectedVoice) => {
            dispatch(storeVoiceDetails(selectedVoice));
        },
        clearVoiceDetails: () => {
            dispatch(clearVoiceDetails());
        },
        storeDepartments: (departmentList) => {
            dispatch(storeDepartments(departmentList));
        },
        storeVoiceTypes: (voiceTypeList) => {
            dispatch(storeVoiceTypes(voiceTypeList));
        },
        storeDiscussion: (comments) => {
            dispatch(storeDiscussion(comments));
        },
        clearDiscussion: () => {
            dispatch(clearDiscussion());
        }
    };
}

const ROLE_USER = "US";
const ROLE_PANEL = "PA";

const GROUPBY_STATUS = 'ST';
const GROUPBY_DEPARTMENT = 'FN';

const FILTERBY_ALL = 'ALL';

const PAGE_COUNT = 20;

class VoiceMaster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            page: 0,
            pageForwardEnabled: true,
            groupBy: GROUPBY_STATUS,
            filterBy: FILTERBY_ALL,
            voiceCreateOpen: false,
            voiceDetailDockOpen: false,
            isLoading: false,
            departmentList: []
        };

        this.filterList = [];
        this.groupList = this.getGroupList();

        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.handleVoiceSearch = this.handleVoiceSearch.bind(this);

        this.handleVoiceCreateOpen = this.handleVoiceCreateOpen.bind(this);
        this.handleVoiceCreate = this.handleVoiceCreate.bind(this);
        this.handleCreateClose = this.handleCreateClose.bind(this);

        this.handleVoiceApprove = this.handleVoiceApprove.bind(this);
        this.handleVoiceResolve = this.handleVoiceResolve.bind(this);
        this.handleVoiceReject = this.handleVoiceReject.bind(this);
        this.handleVoiceReply = this.handleVoiceReply.bind(this);
        this.handleVoiceForward = this.handleVoiceForward.bind(this);
        this.handleVoiceDeescalate = this.handleVoiceDeescalate.bind(this);
        this.handleVoiceEdit = this.handleVoiceEdit.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);

        this.handleDiscussionSubmit = this.handleDiscussionSubmit.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        this.props.clearVoiceList();
        this.props.clearVoiceDetails();
        this.props.clearDiscussion();
    }

    render() {
        const props = this.props;
        const voice = props.voice;
        const state = this.state;
        const showCreateBtn = props.mode === ROLE_USER;

        return (
            <div className="voicemaster-wrapper">
                <div className="voice-tools">
                    <div className="row">
                        <div className="col-md-6 tool-section1">
                            {
                                showCreateBtn && <Button className="btn-primary btn-addvoice" color="primary" onClick={this.handleVoiceCreateOpen} raised>
                                    <Icon>record_voice_over</Icon> Create
                                    </Button>
                            }
                            <SearchBar
                                placeholder="Search Voices"
                                value={state.search}
                                theme="minimal"
                                onChange={this.handleSearchTextChange}
                                onSubmit={this.handleSearchTextSubmit}
                            />
                        </div>
                        <div className="col-md-3">
                            <SelectBox
                                label="Filter"
                                classes="input-select"
                                selectedValue={state.filterBy}
                                selectArray={this.filterList}
                                onSelect={this.handleFilterChange}
                            />
                        </div>
                        {/* <div className="col-md-3">
                            <SelectBox
                                label="GroupBy"
                                classes="input-select"
                                selectedValue={state.groupBy}
                                selectArray={this.groupList}
                                onSelect={this.handleGroupChange}
                            />
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Pagination
                                countFromZero={false}
                                page={state.page}
                                pageSize={PAGE_COUNT}
                                forwardEnabled={state.pageForwardEnabled}
                                onPageStart={this.handlePagination}
                                onPageForward={this.handlePagination}
                                onPageBackward={this.handlePagination}
                            />
                        </div>
                        <div className="col-md-6">
                        </div>
                    </div>
                </div>
                <div className="voice-list">
                    <StackedList
                        listData={voice.voiceList}
                        itemTemplate={<VoiceListItem />}
                        emptyTemplate={<p className="empty-voices">No Voices found.</p>}
                        itemProps={{ onSelect: this.handleVoiceSelect.bind(this) }}
                        comparator={this.comparator}
                    />
                </div>
                <a style={{ "display": "none" }} id="download-anchor" ></a>
                <Dock
                    size={0.5}
                    zIndex={200}
                    position="right"
                    isVisible={state.voiceDetailDockOpen}
                    dimMode="none"
                    defaultSize={.5}
                >
                    <VoiceDetails
                        voice={voice.selectedVoice}
                        discussion={voice.discussion}
                        mode={props.mode}
                        loading={this.state.isLoading}
                        departmentList={voice.departmentList}
                        onApprove={this.handleVoiceApprove}
                        onResolve={this.handleVoiceResolve}
                        onReject={this.handleVoiceReject}
                        onReply={this.handleVoiceReply}
                        onForward={this.handleVoiceForward}
                        onDeescalate={this.handleVoiceDeescalate}
                        onEdit={this.handleVoiceEdit}
                        onDiscussionSubmit={this.handleDiscussionSubmit}
                        onClose={this.handleDetailsClose}
                        onAttachmentSelect={this.handleAttachmentSelect}
                    />
                </Dock>
                <CreateVoiceDialog
                    open={this.state.voiceCreateOpen}
                    departmentList={voice.departmentList}
                    voiceTypeList={voice.voiceTypeList}
                    onCreate={this.handleVoiceCreate}
                    onClose={this.handleCreateClose}
                />
            </div>
        );
    }

    init() {
        this.loadVoiceFilterList(this.props.mode);
        this.loadVoiceList();
        this.loadDepartmentList();
        this.loadVoiceTypeList();
    }

    comparator = (prevItem, currItem) => {
        const groupBy = this.state.groupBy;
        const { groupPropertyExtractor, comparingFunction } = this.getComparingRule(groupBy);
        const prevValue = prevItem ? groupPropertyExtractor(prevItem) : undefined;
        const comparisonResult = comparingFunction(currItem, prevValue);
        return comparisonResult;
    }

    getComparingRule = (groupByLabel) => {
        let groupPropertyExtractor, comparingFunction;
        switch (groupByLabel) {
            case GROUPBY_STATUS:
                groupPropertyExtractor = (a) => a.status;
                comparingFunction = this.compareByStatus;
                break;
            default:
                break;
        }
        return { groupPropertyExtractor, comparingFunction };
    }

    compareByStatus = (activity, lastValue) => {
        let isNewGroup = lastValue !== activity.status;
        return {
            isNewGroup,
            heading: Util.getVoiceStatusText(activity.status)
        };
    }

    getGroupList = () => {
        return [
            { title: "STATUS", value: GROUPBY_STATUS },
            { title: "DEPARTMENT", value: GROUPBY_DEPARTMENT }
        ];
    }

    handleFilterChange = (filterBy) => {
        this.setState({ filterBy });
        this.loadVoiceList({ filterBy });
    }

    handleGroupChange = (groupBy) => {
        this.setState({ groupBy });
        this.loadVoiceList({ groupBy });
    }

    handlePagination = (pageData) => {
        const { page, count } = pageData;
        this.loadVoiceList({ page, count });
    }

    handleVoiceSelect(voiceId) {
        this.loadVoiceDetails(voiceId);
    }

    handleSearchTextChange(search) {
        this.setState({ search });
    }

    handleSearchTextSubmit = (search) => {
        this.setState({ search });
        this.loadVoiceList({ search: search });
    }

    handleVoiceSearch(arg) {
        let search;
        if (typeof arg === "string") {
            search = arg;
        }
        else {
            arg.preventDefault();
            search = this.state.search;
        }
        this.setState({ voiceDetailDockOpen: false });
        this.loadVoiceList(search);
    }

    handleVoiceCreateOpen() {
        this.setState({ voiceCreateOpen: true });
    }

    handleCreateClose() {
        this.setState({ voiceCreateOpen: false });
    }

    handleVoiceCreate(request) {
        return VoiceMasterService.createVoice(request)
            .then(voice => {
                this.handleCreateClose();
                riverToast.show("Voice created successfully.");
                //this.loadVoiceList(this.state.search);
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
                return true;
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while creating voice.");
                throw "Voice Create Error"
            });
    }

    handleVoiceApprove(voiceId, approveObj) {
        this.setState({ isLoading: true });

        VoiceMasterService.approveVoice(voiceId, approveObj)
            .then(voice => {
                riverToast.show("The Voice was approved successfully.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while approving voice.");
            });
    }

    handleVoiceResolve(voiceId, resolveObj) {
        this.setState({ isLoading: true });

        VoiceMasterService.resolveVoice(voiceId, resolveObj)
            .then(voice => {
                riverToast.show("The Voice was resolved successfully.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
                return true;
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while resolving voice.");
            });
    }

    handleVoiceReject(voiceId, rejectObj) {
        this.setState({ isLoading: true });

        VoiceMasterService.rejectVoice(voiceId, rejectObj)
            .then(voice => {
                riverToast.show("The Voice was rejectd successfully.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while rejecting voice.");
            });
    }

    handleVoiceReply(voiceId, replyObj) {
        this.setState({ isLoading: true });

        VoiceMasterService.replyVoice(voiceId, replyObj)
            .then(voice => {
                riverToast.show("Replying to the Voice was successfull.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while replying voice.");
            });
    }

    handleVoiceForward(voiceId, forwardObj) {
        this.setState({ isLoading: true });

        return VoiceMasterService.forwardVoice(voiceId, forwardObj)
            .then(voice => {
                riverToast.show("Forwarding to the Voice was successfull.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
                return true;
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while forwarding voice.");
                throw { message: "Forward Voice error" };
            });
    }

    handleVoiceDeescalate(voiceId, deescalateObj) {
        this.setState({ isLoading: true });

        VoiceMasterService.deescalateVoice(voiceId, deescalateObj)
            .then(voice => {
                riverToast.show("Voice de-escalating successfully.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while deescalating voice.");
            });
    }

    handleVoiceEdit(voiceId, editedObj) {
        this.setState({ isLoading: true });

        return VoiceMasterService.editVoice(voiceId, editedObj)
            .then(voice => {
                riverToast.show("Voice edited successfully.");
                this.loadVoiceList();
                this.loadVoiceDetails(voice.id);
                return true;
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                riverToast.show(error.status_message || "Something went wrong while editing voice.");
                throw { message: "Voice Edit error" };
            });
    }

    handleDetailsClose() {
        this.setState({ voiceDetailDockOpen: false });
        this.props.clearVoiceDetails();
    }

    handleAttachmentSelect(file) {
        CommonService.downloadFromUrl(file.path, 'voice/attachment/')
            .then(blob => {
                const dlnk = document.getElementById('download-anchor');
                const objectUrl = window.URL.createObjectURL(blob);
                dlnk.href = objectUrl;
                dlnk.target = '_blank';
                dlnk.download = file.name;
                dlnk.click();
                window.URL.revokeObjectURL(objectUrl);
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while downloading file.');
            });
    }

    handleDiscussionSubmit(discussionObj) {
        return VoiceMasterService.submitDiscussion(discussionObj)
            .then(voice => {
                this.loadDiscussion(this.props.voice.selectedVoice.discussionId);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while submitting your comment.");
            });
    }

    loadVoiceList(args) {
        const config = {
            search: this.state.search,
            groupBy: this.state.groupBy,
            filterBy: this.state.filterBy,
            page: 0,
            count: PAGE_COUNT
        };
        const { search, groupBy, filterBy } = this.state;
        const request = { ...config, ...{ search, groupBy, filterBy }, ...args };

        VoiceMasterService.getVoiceList(this.props.mode, request.search, request.groupBy, request.filterBy, request.page, request.count)
            .then(voiceList => {
                const page = request.page;
                const pageForwardEnabled = voiceList.length === PAGE_COUNT;
                this.setState({ page, pageForwardEnabled });
                this.props.storeVoiceList(voiceList);
            })
            .catch((error) => {
                riverToast.show(error.status_message || "Something went wrong while loading voice list");
            });
    }

    loadVoiceDetails(voiceId) {
        this.setState({ isLoading: true });
        this.props.clearDiscussion();
        VoiceMasterService.getVoiceDetails(voiceId)
            .then(selectedVoice => {
                this.setState({ voiceDetailDockOpen: true, isLoading: false });
                this.props.storeVoiceDetails(selectedVoice);
                this.loadDiscussion(selectedVoice.discussionId);
            })
            .catch((error) => {
                this.props.clearVoiceDetails();
                riverToast.show(error.status_message || "Something went wrong while loading voice details");
            });
    }

    loadDepartmentList() {
        VoiceMasterService.getDepartmentList()
            .then(response => {
                const departmentList = response.map(dept => {
                    return { title: dept.name, value: dept.code };
                });
                this.props.storeDepartments(departmentList);
            })
            .catch((error) => {
                this.props.clearVoiceDetails();
                riverToast.show(error.status_message || "Something went wrong while loading functions.");
            });
    }

    loadVoiceTypeList() {
        VoiceMasterService.getVoiceTypeList()
            .then(response => {
                const voiceTypeList = response.map(voice => {
                    return { title: voice.name, value: voice.code };
                });
                this.props.storeVoiceTypes(voiceTypeList);
            })
            .catch((error) => {
                this.props.clearVoiceDetails();
                riverToast.show(error.status_message || "Something went wrong while loading types.");
            });
    }

    loadDiscussion(commentId) {
        VoiceMasterService.getDiscussion(commentId)
            .then(discussion => {
                this.props.storeDiscussion(discussion);
            })
            .catch((error) => {
                this.props.clearDiscussion();
                riverToast.show(error.status_message || "Something went wrong while loading voice comments.");
            });
    }

    loadVoiceFilterList = (roleId) => {
        VoiceMasterService.getVoiceFilterList(roleId)
            .then(filterList => {
                this.filterList = filterList.map(item => ({ title: item.name.toUpperCase(), value: item.code }));
            })
            .catch((error) => {
                //this.props.clearDiscussion();
                riverToast.show(error.status_message || "Something went wrong while loading voice filters.");
            });
    };
}

VoiceMaster.propTypes = {
    mode: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoiceMaster);