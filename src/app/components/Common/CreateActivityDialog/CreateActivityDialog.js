import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import moment from 'moment';

// custom component
import { Util } from "../../../Util/util";
import { riverToast } from '../../Common/Toast/Toast';
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import { SelectBox } from '../../Common/SelectBox/SelectBox';
import KpiList from '../../Kpi/KpiList/KpiList';
import StarRate from '../../Common/StarRate/StarRate';
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';
import ClaimPeriodInput from '../../Common/ClaimPeriodInput/ClaimPeriodInput';
import AttachmentInput from '../../Common/AttachmentInput/AttachmentInput';
import LoadedButton from '../../Common/LoadedButton/LoadedButton';
import AutoComplete from '../../Common/AutoComplete/AutoComplete';
import AvatarChips from '../../Common/AvatarChips/AvatarChips';
import KpiDetailsDialog from '../../Kpi/KpiDetailsDialog/KpiDetailsDialog';
import SearchBar from '../../Common/SearchBar/SearchBar';

// css
import "./CreateActivityDialog.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";
const ACTIVITY_STATUS_ACTIVE = "A";

const classes = Util.overrideCommonDialogClasses();

class CreateActivityDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            currentRating: "",
            multiplier: 1,
            claimPeriod: new Date().getTime(),
            selectedMemberList: [],
            kpiDetailsDialogOpen: false,
            searchKpiText: ""
        };

        this.handleCreateActivity = this.handleCreateActivity.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleKpiSelect = this.handleKpiSelect.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleStarRateSelect = this.handleStarRateSelect.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleClaimPeriodChange = this.handleClaimPeriodChange.bind(this);
        this.handleAssigneeSelect = this.handleAssigneeSelect.bind(this);
        this.handleAssigneeSearch = this.handleAssigneeSearch.bind(this);
        this.handleAssigneeRemove = this.handleAssigneeRemove.bind(this);
        this.handleKpiDetailsOpen = this.handleKpiDetailsOpen.bind(this);
        this.handleKpiDetailsClose = this.handleKpiDetailsClose.bind(this);
        this.handleSearchKpiTextChange = this.handleSearchKpiTextChange.bind(this);
        this.handleSearchTextSubmit = this.handleSearchTextSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        const prevKpi = prevProps.kpiDetails;
        const currentKpi = this.props.kpiDetails;
        if (!prevKpi && currentKpi) {
            if (currentKpi.categories.length === 1) {
                this.setState({ currentRating: currentKpi.categories[0].code });
            }
        }
    }

    render() {
        const props = this.props;
        const state = this.state;
        const showCreateButton = props.kpiDetails !== null;

        return (
            <Dialog
                open={this.props.open}
                classes={classes}
                maxWidth="md"
                className="create-activity-dialog-wrapper"
            >
                <DialogTitle className="header">Create Activity</DialogTitle>
                <DialogContent className="content">
                    <section className="dialog-body-wrapper">
                        {(props.kpiDetails !== null) ? this.getCreateFormTemplate(props) : this.getKpiListTemplate(props)}
                        <LoaderOverlay show={props.loading} />
                    </section>
                </DialogContent>
                <DialogActions className="submit-wrapper">
                    <LoadedButton loading={props.loading} className="btn-default btn-cancel" onClick={this.handleCancel}>Cancel</LoadedButton>
                    {showCreateButton && <LoadedButton loading={props.loading} className="btn-primary btn-cancel" onClick={this.handleCreateActivity}>Create</LoadedButton>}
                    <KpiDetailsDialog open={state.kpiDetailsDialogOpen} onClose={this.handleKpiDetailsClose} kpi={props.kpiDetails} />
                </DialogActions>
            </Dialog>
        );
    }

    resetForm() {
        this.setState({
            title: "",
            description: "",
            currentRating: "",
            multiplier: 1,
            claimPeriod: new Date().getTime(),
            selectedMemberList: [],
            searchKpiText: ""
        });
    }

    validateForm(formData) {
        let isValid = true;

        if (!formData.title) {
            isValid = false;
            riverToast.show("Please fill in the 'Title' for the activity.");
        }
        else if (!formData.description) {
            isValid = false;
            riverToast.show("Please fill in the 'Description' for the activity.");
        }
        else if (!formData.category) {
            isValid = false;
            const ratingText = (this.props.kpiDetails.ratingType === RATING_TYPE_STAR) ? "'Rating'" : "'Category'";
            riverToast.show(`Please fill in the ${ratingText} for the activity.`);
        }
        else if (formData.assignees.length === 0) {
            isValid = false;
            riverToast.show("Please add atleast one assignee for the activity.");
        }

        return isValid;
    }

    getCreateFormTemplate(props) {
        const kpiDetails = props.kpiDetails;
        const state = this.state;
        const displayStarRating = (kpiDetails.ratingType === RATING_TYPE_STAR);
        const displayCategory = (kpiDetails.ratingType === RATING_TYPE_CATEGORY);
        const categoryList = kpiDetails.categories.map(category => ({ value: category.code, title: category.label }));

        return (
            <div className="create-activity-form">
                <h1 className="title">{kpiDetails.title} <IconButton className="btn-kpi" size="small" title="Line Item Details" color="primary" onClick={this.handleKpiDetailsOpen}>toc</IconButton></h1>
                <div className="row">
                    <div className="col-md-12">
                        <TextField
                            label="Title*"
                            name="title"
                            className="input-text"
                            value={this.state.title}
                            onChange={this.handleTextChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TextField
                            multiline
                            rowsMax={4}
                            label="Description*"
                            name="description"
                            className="input-text"
                            value={this.state.description}
                            onChange={this.handleTextChange}
                        />
                    </div>
                </div>
                {
                    displayCategory && <div className="row">
                        <div className="col-md-12">
                            <SelectBox
                                placeholder="Select Category"
                                label={kpiDetails.starRatingLabel}
                                selectedValue={this.state.currentRating}
                                selectArray={categoryList}
                                onSelect={this.handleCategoryChange}
                            />
                        </div>
                    </div>
                }
                <div className="row">
                    {
                        displayStarRating && <div className="col-md-6">
                            <span className="label">{kpiDetails.starRatingLabel || "\u00A0"}</span>
                            <StarRate
                                editable={true}
                                value={this.state.currentRating}
                                categories={kpiDetails.categories}
                                onSelect={this.handleStarRateSelect}
                            />
                        </div>
                    }
                    <div className="col-md-6">
                        <ClaimPeriodInput
                            onChange={this.handleClaimPeriodChange}
                            value={this.state.claimPeriod}
                        />
                    </div>
                    {
                        (kpiDetails.hasMultiplier && displayCategory) && <div className="col-md-6">
                            <TextField
                                min={0}
                                type={"number"}
                                label="Multiplier*"
                                name="multiplier"
                                className="input-text"
                                value={this.state.multiplier}
                                onChange={this.handleTextChange}
                            />
                        </div>
                    }
                </div>

                {
                    (kpiDetails.hasMultiplier && displayStarRating) && <div className="row">
                        <div className="col-md-6">
                            <TextField
                                min={0}
                                type={"number"}
                                label="Multiplier*"
                                name="multiplier"
                                className="input-text"
                                value={this.state.multiplier}
                                onChange={this.handleTextChange}
                            />
                        </div>
                    </div>
                }
                <FieldHeader title="Assignees" />
                <div className="row">
                    <div className="col-md-12">
                        <AutoComplete
                            options={props.memberList}
                            placeholder="Select Assignees"
                            onChange={this.handleAssigneeSelect}
                            onInputChange={this.handleAssigneeSearch}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <AvatarChips
                            list={[...props.defaultMemberList, ...state.selectedMemberList]}
                            deletable={true}
                            onDelete={this.handleAssigneeRemove}
                        />
                    </div>
                </div>
            </div>
        );
    }

    getKpiListTemplate(props) {
        return (
            <div className="kpilist-search-wrapper">
                <div className="row">
                    <div className="col-md-8">
                        <SearchBar
                            theme="dark"
                            placeholder="Search Line-items"
                            value={this.state.searchKpiText}
                            onChange={this.handleSearchKpiTextChange}
                            onSubmit={this.handleSearchTextSubmit}
                        />
                    </div>
                </div>
                <KpiList
                    disableUnAccessible={props.disableUnAccessible}
                    kpiList={props.kpiList}
                    onSelect={this.handleKpiSelect}
                />
            </div>
        );
    }


    handleSearchKpiTextChange(searchKpiText) {
        this.setState({ searchKpiText });
    }

    handleSearchTextSubmit() {
        this.props.onSearchKpi(this.state.searchKpiText);
    }

    handleTextChange(event) {
        let value = event.target.value;
        const name = event.target.name;
        if (name === "multiplier") {
            value = value < 1 ? 1 : value;
        }
        this.setState({ [name]: value });
    }

    handleStarRateSelect(rating) {
        this.setState({ currentRating: rating.code });
    }

    handleCategoryChange(categoryId) {
        this.setState({ currentRating: categoryId });
    }

    handleClaimPeriodChange(claimDate) {
        const claimPeriod = Math.round((new Date(claimDate)).getTime());
        this.setState({ claimPeriod });
    }

    handleAssigneeSelect(assignee) {
        let selectedMemberList = [...this.state.selectedMemberList];
        const index = selectedMemberList.findIndex(member => member.id === assignee.id);
        if (index < 0) {
            selectedMemberList.push({ ...assignee });
            this.setState({ selectedMemberList });
        }
    }

    handleAssigneeRemove(assigneeId) {
        let selectedMemberList = [...this.state.selectedMemberList];
        const index = selectedMemberList.findIndex(member => member.id === assigneeId);
        if (index > -1) {
            selectedMemberList.splice(index, 1);
            this.setState({ selectedMemberList });
        }
    }

    handleAssigneeSearch(text) {
    }


    handleKpiSelect(kpi) {
        const props = this.props;
        if (!kpi.selfAssignable && !props.canSelfSelect) {
            riverToast.show("You cannot assign this activity by yourself. Please ask your President to assign.");
            return;
        }
        this.props.onSelectKpi(kpi.id);
    }

    handleCreateActivity() {
        const state = this.state;
        const props = this.props;

        let assignees = props.defaultMemberList.map(assignee => assignee.id);
        assignees = [...assignees, ...state.selectedMemberList.map(assignee => assignee.id)];
        const requestObj = {
            title: state.title,
            description: state.description,
            category: state.currentRating,
            assignees: assignees,
            claimPeriod: state.claimPeriod,
            multiplier: state.multiplier
        };
        const isValid = this.validateForm(requestObj);
        if (isValid) {
            const kpiId = props.kpiDetails.id;
            props.onCreate(kpiId, requestObj)
                .then(response => {
                    this.handleCancel();
                    this.resetForm();
                })
                .catch(error => { });
        }
    }

    handleCancel() {
        this.resetForm();
        this.props.onCancel();
    }

    handleKpiDetailsOpen() {
        this.setState({ kpiDetailsDialogOpen: true });
    }

    handleKpiDetailsClose() {
        this.setState({ kpiDetailsDialogOpen: false })
    }
}

CreateActivityDialog.defaultProps = {
    loading: false,
    memberList: [],
    disableUnAccessible: false,
    defaultMemberList: [],
    kpiList: [],
    kpiDetails: null,
    canSelfSelect: true //@DESC: can user select is self Assignable is false
};

CreateActivityDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    disableUnAccessible: PropTypes.bool,
    canSelfSelect: PropTypes.bool,
    kpiList: PropTypes.array.isRequired,
    memberList: PropTypes.array.isRequired,
    defaultMemberList: PropTypes.array,
    kpiDetails: PropTypes.object,
    onSearchKpi: PropTypes.func,
    onSelectKpi: PropTypes.func,
    onCreate: PropTypes.func,
    onCancel: PropTypes.func
};

export default CreateActivityDialog;