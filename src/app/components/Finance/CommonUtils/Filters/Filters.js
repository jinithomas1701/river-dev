import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../../../Common/SearchBar/SearchBar';
import { SelectBox } from '../../../Common/SelectBox/SelectBox';
import './Filters.scss';


class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            filterType: this.props.selectedType,
            filterStatus: this.props.selectedStatus,
            filterGroupBy: this.props.selectedGroupBy
        };

        this.filterTypeList = this.props.filterTypeList;
        this.filterStatusList = this.props.filterStatusList;
        this.filterGroupByList = this.props.filterGroupByList;

    }

    componentDidMount() {
        this.state = {
            searchText: "",
            filterType: this.props.selectedType,
            filterStatus: this.props.selectedStatus,
            filterGroupBy: this.props.selectedGroupBy
        };
    }

    handleSearchTextChange = (searchText) => {
        this.setState({ searchText: searchText });
    }

    handleSearchTextSubmit = () => {
        this.callApiService();
    }

    handleFilterTypeChange = (filterType) => {
        this.setState(() => {
            return ({ filterType: filterType });
        }, this.callApiService);
    }

    handleFilterStatusChange = (filterStatus) => {
        this.setState(() => {
            return ({ filterStatus: filterStatus });
        }, this.callApiService);
    }

    handleFilterGroupByChange = (filterGroupBy) => {
        this.setState(() => {
            return ({ filterGroupBy: filterGroupBy });
        }, this.callApiService);
    }

    callApiService = () => {
        const config = {
            search: this.state.searchText,
            type: this.state.filterType,
            status: this.state.filterStatus,
            groupBy: this.state.filterGroupBy
        };

        this.props.onFilterChange(config);
    }

    render() {
        return (
            <div className="row filter-wrapper">
                <div className="col-md-3">
                    <SearchBar
                        value={this.state.searchText}
                        onChange={this.handleSearchTextChange}
                        onSubmit={this.handleSearchTextSubmit}
                        placeholder="Search"
                        showClearButton={false}
                        theme={this.props.theme}
                    />
                </div>

                {
                    this.filterTypeList.length > 0 &&
                    <div className="col-md-3">
                        <SelectBox
                            label="Type"
                            classes="input-select"
                            selectedValue={this.state.filterType}
                            isDisabled={this.filterTypeList.length === 1 ? true : false}
                            selectArray={this.filterTypeList}
                            onSelect={this.handleFilterTypeChange}
                        />
                    </div>
                }
                {
                    this.filterStatusList.length > 0 &&
                    <div className="col-md-3">
                        <SelectBox
                            label="Status"
                            classes="input-select"
                            selectedValue={this.state.filterStatus}
                            isDisabled={this.filterStatusList.length === 1 ? true : false}
                            selectArray={this.filterStatusList}
                            onSelect={this.handleFilterStatusChange}
                        />
                    </div>
                }
                {
                    this.filterGroupByList.length > 0 &&
                    <div className="col-md-3">
                        <SelectBox
                            label="GroupBy"
                            classes="input-select"
                            selectedValue={this.state.filterGroupBy}
                            isDisabled={this.filterGroupByList.length === 1 ? true : false}
                            selectArray={this.filterGroupByList}
                            onSelect={this.handleFilterGroupByChange}
                        />
                    </div>
                }

            </div>
        );
    }
}

Filters.defaultProps = {
    filterTypeList: [{ title: "SELECT", value: "SEL" }],
    filterStatusList: [{ title: "SELECT", value: "SEL" }],
    filterGroupByList: [{ title: "SELECT", value: "SEL" }],
    selectedType: "",
    selectedStatus: "",
    selectedGroupBy: "",
    theme: "dark",
    onFilterChange: () => { console.log("Please add 'onFilterChange()' method on Filters") }
};

Filters.propTypes = {
    filterTypeList: PropTypes.array,
    filterStatusList: PropTypes.array,
    filterGroupByList: PropTypes.array,
    selectedType: PropTypes.string,
    selectedStatus: PropTypes.string,
    selectedGroupBy: PropTypes.string,
    theme: PropTypes.oneOf(["light", "minimal", "dark"]),
    onFilterChange: PropTypes.func
};

export default Filters;