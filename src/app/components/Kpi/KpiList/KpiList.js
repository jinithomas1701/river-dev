import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import List, { ListItem } from 'material-ui/List';
import moment from 'moment';

// custom component
import { Util } from "../../../Util/util";

// css
import "./KpiList.scss";

class KpiList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { kpiList, disableUnAccessible } = this.props;
        return (
            <List className="kpilist-wrapper">
                {this.getListItemTemplate(kpiList, disableUnAccessible)}
            </List>
        );
    }

    handleKpiSelect(kpi) {
        this.props.onSelect(kpi);
    }

    getListItemTemplate(kpiList, disableUnAccessible) {
        let template = <ListItem className="kpi-item-empty">No List Items found.</ListItem>;

        if (kpiList.length) {
            template = kpiList.map(kpi => {
                const isDisabled = disableUnAccessible ? !kpi.selfAssignable : false;
                const disabledClass = isDisabled ? "disabled" : "";

                return (<ListItem
                    className={`kpi-item ${disabledClass}`}
                    key={kpi.id}
                    onClick={this.handleKpiSelect.bind(this, kpi, isDisabled)}
                >
                    <h1 className="title">{kpi.title}</h1>
                    <p className="title-sub">{kpi.pointDesc}</p>
                    <div className="sub-details">
                        <dl className="label-term-group">
                            <dt>Self Assignable</dt>
                            <dd>{kpi.selfAssignable ? "Yes" : "No"}</dd>
                        </dl>
                        <dl className="label-term-group">
                            <dt>Mandatory</dt>
                            <dd>{kpi.mandatory ? "Yes" : "No"}</dd>
                        </dl>
                        <dl className="label-term-group">
                            <dt>Inter-club</dt>
                            <dd>{kpi.loanable ? "Yes" : "No"}</dd>
                        </dl>
                    </div>
                </ListItem>);
            });
        }

        return template;
    }
}

KpiList.defaultProps = {
    disableUnAccessible: false
};

KpiList.propType = {
    disableUnAccessible: PropTypes.bool,
    kpiList: PropTypes.array.isRequired,
    onSelect: PropTypes.fun
};

export default KpiList;