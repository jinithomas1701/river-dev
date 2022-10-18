import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';

// custom component
import FieldHeader from '../../Common/FieldHeader/FieldHeader';
import { Util } from '../../../Util/util';

// css
import './ApproversList.scss';

class ApproversList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { approverList } = this.props;

        return (
            <div className="approverslist">
                <FieldHeader title="Approvers" />
                <div className="list-container">
                    {this.getApproverTemplate(approverList)}
                </div>
            </div>
        );
    }

    getApproverTemplate = (approverList) => {
        let template = <div className="empty-item">No Approvers found</div>;
        if (approverList.length) {
            template = approverList.map(approver => {
                const status = this.getStatusIcon(approver);
                return <div
                    className={status.className}
                    key={approver.id}
                >
                    {approver.name} <Icon>{status.icon}</Icon>
                </div>
            });
        }

        return template;
    }

    getStatusIcon = (status) => {
        // let icon = "help_outline";
        let icon = "";
        let className = "approver-item";
        if (status.rejected) {
            icon = "cancel";
            className += " rejected";
        }
        else if (status.approved) {
            className += " approved";
            icon = "check_circle";
        }

        return { icon, className };
    }
}

ApproversList.defaultProps = {
    approverList: []
};

ApproversList.propTypes = {
    approverList: PropTypes.array
}

export default ApproversList;