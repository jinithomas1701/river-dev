import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../../Common/SearchBar/SearchBar';
import { SelectBox } from '../../Common/SelectBox/SelectBox';
//css
import './Filters.scss';
class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            filterStatus: this.props.selectedStatus,
            filterClubBy: this.props.selectedClubBy
        };
        this.filterStatusList = this.props.filterStatusList;
    }

    componentDidMount() {
        this.state = {
            searchText: "",
            filterStatus: this.props.selectedStatus,
            filterClubBy: this.props.selectedClubBy
        };
    }

    handleSearchTextChange = (searchText) => {
        this.setState({ searchText: searchText });
    }

    handleSearchTextSubmit = () => {
        this.callApiService();
    }


    handleFilterStatusChange = (filterStatus) => {
        this.setState(() => {
            return ({ filterStatus: filterStatus });
        }, this.callApiService);
    }

    handleFilterClubByChange = (filterClubBy) => {
        this.setState(() => {
            return ({ filterClubBy: filterClubBy });
        }, this.callApiService);
    }

    callApiService = () => {
        const config = {
            search: this.state.searchText,

            status: this.state.filterStatus,
            clubBy: this.state.filterClubBy
        };
        this.props.onFilterChange(config);
    }

    render() {
        return (
            <div className="row filter-wrapper">
                <div className="col-md-4">
                    <SearchBar
                        value={this.state.searchText}
                        onChange={this.handleSearchTextChange}
                        onSubmit={this.handleSearchTextSubmit}
                        placeholder="Search"
                        showClearButton={false}
                        theme="dark"
                    />
                </div>

                {
                    this.filterStatusList.length > 0 &&
                    <div className="col-md-4">
                        <SelectBox
                            label="Status"
                            classes="input-select"
                            selectedValue={this.state.filterStatus}
                            selectArray={this.filterStatusList}
                            onSelect={this.handleFilterStatusChange}
                        />
                    </div>
                }

                {
                    this.props.filterClubByList.length > 0 &&
                    <div className="col-md-4">
                        <SelectBox
                            label={this.props.input}
                            classes="input-select"
                            selectedValue={this.state.filterClubBy}
                            selectArray={this.props.filterClubByList}
                            onSelect={this.handleFilterClubByChange}
                        />
                    </div>
                }

            </div>
        );
    }
}

Filters.defaultProps = {
    filterStatusList: [{ title: "SELECT", value: "SEL" }],
    filterClubByList: [{ title: "SELECT", value: "SEL" }],
    selectedStatus: "",
    selectedClubBy: "",
};

Filters.propTypes = {
    filterStatusList: PropTypes.array,
    filterClubByList: PropTypes.array,
    selectedType: PropTypes.string,
    selectedStatus: PropTypes.string,
    selectedClubBy: PropTypes.string,
    onFilterChange: PropTypes.func
};

export default Filters;
