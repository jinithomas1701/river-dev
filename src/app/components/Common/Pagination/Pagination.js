import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { Util } from '../../../Util/util';

import './Pagination.scss';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render = () => {
        const props = this.props;
        const classList = `pagination-wrapper ${props.className}`;
        const textFieldDisabled = typeof props.onPaginationTextChange !== "function" || typeof props.onTextSearch !== "function";
        const showStart = typeof props.onPageStart === "function";
        const moveForwardDisabled = !props.forwardEnabled || (props.totalPages && props.totalPages === props.page - 1);

        return (
            <form className={`${classList}`} onSubmit={this.handleTextSubmit}>
                {
                    showStart && <Button
                        className="btn-pagination"
                        disabled={props.page === 0}
                        onClick={this.onPageStart}
                    ><Icon>first_page</Icon>
                    </Button>
                }
                <Button
                    className="btn-pagination"
                    disabled={(props.page <= 0)}
                    onClick={this.handlePageBackward}
                >
                    <Icon>chevron_left</Icon>
                </Button>
                <TextField
                    type="number"
                    min={0}
                    step={1}
                    disabled={textFieldDisabled}
                    placeholder="page"
                    margin="normal"
                    className="input-page"
                    value={props.page + 1}
                    onChange={this.handlePaginationTextChange}
                />
                <Button
                    className="btn-pagination"
                    disabled={moveForwardDisabled}
                    onClick={this.handlePageForward}
                >
                    <Icon>chevron_right</Icon>
                </Button>
                {
                    props.totalPages && <Button
                        className="btn-pagination"
                        disabled={moveForwardDisabled}
                        onClick={this.onPageEnd}
                    ><Icon>last_page</Icon>
                    </Button>
                }
                <button type="submit" hidden>Go</button>
            </form>
        );
    }

    handlePageBackward = () => {
        const props = this.props;
        if (props.page > 0) {
            const page = props.page - 1;
            const count = props.countFromZero ? (page + 1) * props.pageSize : props.pageSize;
            const pageData = {
                page,
                pageSize: props.pageSize,
                count
            };
            this.props.onPageBackward(pageData);
        }
    }

    handlePageForward = () => {
        const props = this.props;
        if (props.totalPages && props.totalPages === props.page - 1) {
            return;
        }
        const page = props.page + 1;
        const count = props.countFromZero ? (page + 1) * props.pageSize : props.pageSize;
        const pageData = {
            page,
            pageSize: props.pageSize,
            count
        };
        this.props.onPageForward(pageData);
    }

    onPageStart = () => {
        const props = this.props;
        if (props.page === 0) {
            return;
        }
        const page = 0;
        const count = props.countFromZero ? (page + 1) * props.pageSize : props.pageSize;
        const pageData = {
            page: page,
            pageSize: props.pageSize,
            count
        };
        props.onPageStart(pageData);
    }

    onPageEnd = () => {
        const props = this.props;
        if (props.totalPages && props.totalPages === props.page - 1) {
            return;
        }
        const page = props.totalPages - 1;
        const count = props.countFromZero ? (page + 1) * props.pageSize : props.pageSize;
        const pageData = {
            page: page,
            pageSize: props.pageSize,
            count
        };
        props.onPageStart(pageData);
    }

    handlePaginationTextChange = (event) => {
        const props = this.props;
        let page = Number(event.target.value);
        page = (isNaN(page) || page < 0) ? 0 : page;
        if (props.onPaginationTextChange) {
            const count = props.countFromZero ? (page + 1) * props.pageSize : props.pageSize;
            const pageData = {
                page: page === 0 ? page : page - 1,
                pageSize: props.pageSize,
                count
            };
            props.onPaginationTextChange(pageData);
        }
    }

    handleTextSubmit = (event) => {
        event.preventDefault();
        const { page, pageSize, countFromZero, onTextSearch } = this.props;
        if (typeof onTextSearch === "function") {
            const count = countFromZero ? (page + 1) * pageSize : pageSize;
            const pageData = { page, pageSize, count };
            this.props.onTextSearch(pageData);
        }
    };
}

Pagination.defaultProps = {
    countFromZero: false,
    page: 0,
    pageSize: 10,
    forwardEnabled: false,
    totalPages: undefined,
    className: "",
};

Pagination.propTypes = {
    countFromZero: PropTypes.bool,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    forwardEnabled: PropTypes.bool,
    totalPages: PropTypes.number,
    className: PropTypes.string,
    onPageStart: PropTypes.func,
    onPageForward: PropTypes.func.isRequired,
    onPageBackward: PropTypes.func.isRequired,
    onPageEnd: PropTypes.func,
    onPaginationTextChange: PropTypes.func,
    onTextSearch: PropTypes.func,
    toggleForwardButton: PropTypes.func,
}

export default Pagination;