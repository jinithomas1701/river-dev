import React, { Component } from 'react';
import { connect } from "react-redux";
import TextField from 'material-ui/TextField';
import { Button, IconButton } from 'material-ui';
import { Icon } from 'material-ui';
import Tabs, { Tab } from 'material-ui/Tabs';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';

import { riverToast } from "../../../Common/Toast/Toast";
import LoadedButton from '../../../Common/LoadedButton/LoadedButton';

import FinanceAdminSummary from "../Widgets/FinanceAdminSummary/FinanceAdminSummary";
import FinAdminClubCard from "./FinAdminClubCard/FinAdminClubCard";

import { FinanceAdminService } from "../FinanceAdmin.service";
import {
    setLocationList, setSelectedLocation, setConfigYears, setSelectedFinancialYear,
    setLocationClubList, setSelectedClub
} from "../FinanceAdmin.actions";
import "./FinanceAdminOverView.scss";
import DialogEditAllowanceDetails from '../Widgets/DialogEditAllowanceDetails/DialogEditAllowanceDetails';

const mapStateToProps = (state) => {
    return {
        admin: state.FinanceAdminReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLocationList: (locationList) => {
            dispatch(setLocationList(locationList))
        },
        setSelectedLocation: (location) => {
            dispatch(setSelectedLocation(location))
        },
        setSelectedClub: (club) => {
            dispatch(setSelectedClub(club))
        },
        setConfigYears: (years) => {
            dispatch(setConfigYears(years))
        },
        setSelectedFinancialYear: (year) => {
            dispatch(setSelectedFinancialYear(year))
        },
        setLocationClubList: (clubList) => {
            dispatch(setLocationClubList(clubList))
        }
    };
};

class FinanceAdminOverView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabValue: "",
            isEditLocationAllowanceDialogOpen: false,
            isEditLocationAllowanceDialogLoading: false,
            isCreateLocationAllowanceDialogOpen: false,
            isCreateLocationAllowanceDialogLoading: false,
            isEditClubAllowanceDialogOpen: false,
            isEditClubAllowanceDialogLoading: false,
            isCreateNewFinancialYearDialogOpen: false,
            isCreateNewFinancialYearDialogLoading: false,
            showClubDetailTeaser: false,
        };
    }

    componentDidMount() {
        this.init();
    }

    render() {
        const state = this.state;
        const props = this.props;
        const admin = props.admin;

        return (
            <div className="financeadmin-overview-wrapper">
                <div className="row">
                    <div className="col-md-10">
                        {/* <FinanceAdminSummary
                            title="Summary"
                            subTitle="Allocated for all Clubs"
                            totalBudget={2000}
                        /> */}
                    </div>
                    <div className="col-md-2">
                        <SelectBox
                            label="Financial Year"
                            classes="financial-year-input-box"
                            selectedValue={admin.selectedFinancialYear}
                            selectArray={admin.configYearList}
                            onSelect={this.selectFinancialYearHandler}
                        />
                    </div>
                </div>
                <hr />
                <div className="finance-details">
                    <div className="row">
                        <div className="col-md-10">
                            <Tabs
                                className="main-tab"
                                value={admin.selectedLocation ? admin.selectedLocation.location.name : ""}
                                onChange={this.tabChangeHandler}
                                indicatorColor="primary"
                                textColor="primary"
                                scrollable
                                scrollButtons="auto"
                            >
                                {
                                    admin.locationList.map(loc => <Tab key={loc.location.name} label={loc.location.name} value={loc.location.name} />)
                                }
                            </Tabs>
                        </div>
                        {
                            props.privileges.canUpdateConfig &&
                            <div className="col-md-2">
                                <LoadedButton color="default" className="btn btn-primary" title="Create" onClick={this.createLocationAllowanceDetailsDialogOpenHandler}><Icon>add</Icon></LoadedButton>
                                <LoadedButton color="default" className="btn btn-default btn-edit" title="Edit" onClick={this.editLocationAllowanceDetailsDialogOpenHandler}><Icon>edit</Icon></LoadedButton>
                            </div>
                        }
                    </div>
                    {
                        admin.selectedLocation &&
                        <div className="row">
                            <div className="col-md-12">
                                <FinanceAdminSummary
                                    editable={false}
                                    financialYear={`${admin.selectedFinancialYear} - ${admin.selectedFinancialYear + 1}`}
                                    location={admin.selectedLocation.location}
                                    title={`${admin.selectedLocation.location.name} Area`}
                                    totalBudget={admin.selectedLocation.allocatedAmount}
                                    spent={admin.selectedLocation.spentAmount}
                                    balance={admin.selectedLocation.balanceAmount}
                                    currency={admin.selectedLocation.location.amountType}
                                />
                            </div>

                            <DialogEditAllowanceDetails
                                title={"Edit Details"}
                                isDialogOpen={state.isEditLocationAllowanceDialogOpen}
                                isLoading={state.isEditLocationAllowanceDialogLoading}
                                handleClose={this.editLocationAllowanceDetailsDialogCloseHandler}
                                handleSubmit={this.editLocationAllowanceDetailsDialogSubmitHandler}
                                locationDetails={admin.selectedLocation}
                            >
                                <p>Financial Year : {admin.selectedFinancialYear} - {admin.selectedFinancialYear + 1}</p>
                                <span>Please enter the respective allowances *<strong>for each club</strong> in {admin.selectedLocation.location.name} area.</span>
                                <p>*<strong>N.B.</strong> :- All amounts are in {admin.selectedLocation.location.amountType} denominations.</p>
                            </DialogEditAllowanceDetails>

                            <DialogEditAllowanceDetails
                                title={`Create New Financial Year ${Math.max(...props.admin.configYearList.map(year => year.value)) + 1}`}
                                isDialogOpen={state.isCreateLocationAllowanceDialogOpen}
                                isLoading={state.isCreateLocationAllowanceDialogLoading}
                                handleClose={this.createLocationAllowanceDetailsDialogCloseHandler}
                                handleSubmit={this.createLocationAllowanceDetailsDialogSubmitHandler}
                                locationDetails={admin.selectedLocation}
                            >
                                <p>Financial Year : {Math.max(...props.admin.configYearList.map(year => year.value)) + 1} - {Math.max(...props.admin.configYearList.map(year => year.value)) + 2}</p>
                                <span>Please enter the new allowances *<strong>for each club</strong> in {admin.selectedLocation.location.name} area.</span>
                                <p>*<strong>N.B.</strong> :- All amounts are in {admin.selectedLocation.location.amountType} denominations.</p>
                            </DialogEditAllowanceDetails>

                        </div>
                    }
                    {
                        props.privileges.canUpdateConfig && admin.selectedClub &&
                        <DialogEditAllowanceDetails
                            title={"Edit Details"}
                            isDialogOpen={state.isEditClubAllowanceDialogOpen}
                            isLoading={state.isEditClubAllowanceDialogLoading}
                            handleClose={this.editClubAllowanceDetailsDialogCloseHandler}
                            handleSubmit={this.editClubAllowanceDetailsDialogSubmitHandler}
                            clubDetails={admin.selectedClub}
                        >
                            <p>Financial Year : {admin.selectedFinancialYear} - {admin.selectedFinancialYear + 1}</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Current Meeting Allowance:</td>
                                        <td>{admin.selectedClub.meetingAllowance.limit}</td>
                                    </tr>
                                    <tr>
                                        <td><p>Current Event Allowance:</p></td>
                                        <td><p>{admin.selectedClub.eventAllowance.limit}</p></td>
                                    </tr>
                                </tbody>
                            </table>
                            <span>Please enter the new allowances of <strong>{admin.selectedClub.club.name} Club</strong></span>
                            <p>*<strong>N.B.</strong> :- All amounts are in {admin.selectedLocation.location.amountType} denominations.</p>
                        </DialogEditAllowanceDetails>
                    }
                    {
                        admin.selectedLocation &&
                        <div className="row">
                            <div className="col-md-10">
                                <FieldHeader title={`List of Clubs in ${admin.selectedLocation.location.name}`} backgroundColor="#fff" />
                            </div>
                            <div className="col-md-2">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            onChange={this.showClubDetailTeaserHandler}
                                            value={`${state.showClubDetailTeaser}`}
                                            color="primary"
                                        />
                                    }
                                    label="Show details?"
                                />
                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <div className="clublist-wrapper">
                                {
                                    admin.clubList &&
                                    admin.clubList.map(clubDetails => <FinAdminClubCard key={clubDetails.club.id} details={clubDetails} showTeaser={state.showClubDetailTeaser} onClick={this.clubSelectHandler} />)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    init = () => {
        this.loadConfigYears().then(() => { this.loadLocationsList(); })
    }

    tabChangeHandler = (event, value) => {
        this.setState({ tabValue: value });
        const selectedLocation = this.props.admin.locationList.filter(loc => loc.location.name === value)[0]
        this.props.setSelectedLocation(selectedLocation);
        this.loadLocationClubList(selectedLocation.location.id);
    }

    loadLocationsList = (year = new Date().getMonth() <= 2 ? new Date().getFullYear() - 1 : new Date().getFullYear()) => {
        FinanceAdminService.getLocationsList(year)
            .then(locationList => {
                const selectedLocation = locationList.length ? locationList[0] : null;
                this.props.setSelectedLocation(selectedLocation);
                this.props.setLocationList(locationList);
                this.loadLocationClubList(selectedLocation.location.id);
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while loading club locations.');
            });
    }

    loadConfigYears = () => {
        return FinanceAdminService.getFinanceConfigYears()
            .then(years => {
                years.sort();
                const configYearList = [];
                years.map(year => {
                    configYearList.push({ "title": `${year} - ${year + 1}`, "value": year });
                });
                this.props.setConfigYears(configYearList);
                return true;
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while loading configuration years.');
            });
    }

    loadLocationClubList = (locationId, year = this.props.admin.selectedFinancialYear) => {
        FinanceAdminService.getLocationClubList(locationId, year)
            .then(clubList => {
                this.props.setLocationClubList(clubList);
            })
            .catch(error => {
                this.setState({ loading: false });
                riverToast.show(error.status_message || 'Something went wrong while loading club list.');
            });
    }

    selectFinancialYearHandler = (year = new Date().getMonth() <= 2 ? new Date().getFullYear() - 1 : new Date().getFullYear()) => {
        this.loadLocationsList(year);
        this.props.setSelectedFinancialYear(year);
    }

    editLocationAllowanceDetailsDialogOpenHandler = () => {
        this.setState({ isEditLocationAllowanceDialogOpen: true });
    }

    editLocationAllowanceDetailsDialogCloseHandler = () => {
        this.setState({ isEditLocationAllowanceDialogOpen: false });
    }

    editLocationAllowanceDetailsDialogSubmitHandler = (request) => {
        let location = this.props.admin.selectedLocation.location.id;
        let year = this.props.admin.selectedFinancialYear;
        this.setState({ isEditLocationAllowanceDialogLoading: true });

        return FinanceAdminService.updateLocationAllowanceDetails(location, year, request)
            .then(responseJSON => {
                this.setState({ isEditLocationAllowanceDialogLoading: false });
                riverToast.show("Successfully updated allowance details of the location.");

                const selectedLocation = this.props.admin.selectedLocation;
                this.init();
                this.props.setSelectedLocation(selectedLocation);

                return true;
            }
            )
            .catch(error => {
                this.setState({ isEditLocationAllowanceDialogLoading: false });
                riverToast.show(error.status_message || "Unable to update allowance details of the location. Please try again.");
                throw "Unable to update allowance details of the location.";
            }
            );
    }

    editClubAllowanceDetailsDialogOpenHandler = (clubDetails) => {
        this.setState({ isEditClubAllowanceDialogOpen: true });
        this.props.setSelectedClub(clubDetails);
    }

    editClubAllowanceDetailsDialogCloseHandler = () => {
        this.setState({ isEditClubAllowanceDialogOpen: false });
    }

    editClubAllowanceDetailsDialogSubmitHandler = (request) => {
        let club = this.props.admin.selectedClub.club.id;
        let year = this.props.admin.selectedFinancialYear;
        this.setState({ isEditClubAllowanceDialogLoading: true });

        return FinanceAdminService.updateClubAllowanceDetails(club, year, request)
            .then(responseJSON => {
                this.setState({ isEditClubAllowanceDialogLoading: false });
                riverToast.show("Successfully updated allowance details of the club.");

                const selectedLocation = this.props.admin.selectedLocation;
                this.init();
                this.props.setSelectedLocation(selectedLocation);

                return true;
            }
            )
            .catch(error => {
                this.setState({ isEditClubAllowanceDialogLoading: false });
                riverToast.show(error.status_message || "Unable to update allowance details of the club. Please try again.");
                throw "Unable to update allowance details of the club.";
            }
            );
    }

    showClubDetailTeaserHandler = () => {
        this.setState({ showClubDetailTeaser: !this.state.showClubDetailTeaser })
    }

    clubSelectHandler = (clubDetails) => {
        this.editClubAllowanceDetailsDialogOpenHandler(clubDetails);
    }

    createNewFinancialYearDialogOpenHandler = () => {
        this.setState({ isCreateNewFinancialYearDialogOpen: true })
    }

    createNewFinancialYearDialogCloseHandler = () => {
        this.setState({ isCreateNewFinancialYearDialogOpen: false })
    }

    createNewFinancialYearDialogSubmitHandler = () => {
        riverToast.show("created new year");
    }

    createLocationAllowanceDetailsDialogOpenHandler = () => {
        this.setState({ isCreateLocationAllowanceDialogOpen: true });
    }

    createLocationAllowanceDetailsDialogCloseHandler = () => {
        this.setState({ isCreateLocationAllowanceDialogOpen: false });
    }

    createLocationAllowanceDetailsDialogSubmitHandler = (request) => {
        let location = this.props.admin.selectedLocation.location.id;
        let year = this.props.admin.configYearList.length !== 0 ? Math.max(...this.props.admin.configYearList.map(year => year.value)) + 1 :
            new Date().getMonth() <= 2 ? new Date().getFullYear() - 1 : new Date().getFullYear();
        this.setState({ isCreateLocationAllowanceDialogLoading: true });

        return FinanceAdminService.createLocationAllowanceDetails(location, year, request)
            .then(responseJSON => {
                this.setState({ isCreateLocationAllowanceDialogLoading: false });
                riverToast.show("Successfully created allowance details for new financial year");

                this.loadConfigYears();

                return true;
            }
            )
            .catch(error => {
                this.setState({ isCreateLocationAllowanceDialogLoading: false });
                riverToast.show(error.status_message || "Unable to create allowance details for new financial year. Please try again.");
                throw "Unable to create allowance details for new financial year";
            }
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinanceAdminOverView);