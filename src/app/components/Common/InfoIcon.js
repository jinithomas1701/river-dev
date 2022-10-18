

import React from 'react';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Icon from 'material-ui/Icon';

const msgs = {
    "act_mst_slf_assgn": "Whether activity created from this master is self-assignable or not",
    "act_mst_rwrd": "Whether activity created is a Reward, so that activity will go for council approval directly",
    "act_mst_cncl_appr": "Whether council approval is needed, if so select a council",
    "act_isfeed":"Whether the activity should be posted in feed when points id credited",
    "act_isdone": "Whether the activity is already done by the assignee",
    "act_need_president" : "Club president approval will be needed. President can track this voice",
    "crt_srvy_incld_othr": "Include additional Other option and users can suggest more opinions",
    "crt_srvy_pblsh_rslt": "Result will be published publically after finishing",
    "crt_srvy_vsble_all": "Survey will be visible to all users, else selected members"
}


const styles = theme => ({
    icon: {
        color: "#aaa" ,
        position:"absolute",
        top:10+'px',
        right:0
    }
});

function InfoIcon(props) {
    const { classes } = props;
    return (
        <Tooltip id="tooltip-icon" title={msgs[props.tooltip]} className={classes.icon} placement="bottom">
            <i >
                <Icon >info_outline</Icon>
            </i>
        </Tooltip>
    );
}


export default withStyles(styles)(InfoIcon);
