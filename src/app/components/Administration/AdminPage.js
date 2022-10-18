import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { Link, withRouter } from 'react-router-dom';
import Icon from 'material-ui/Icon';

import { Util } from "../../Util/util";
import { riverToast } from '../Common/Toast/Toast';

import menuList from "../../Util/Constants/completeMenuList.json";


const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        width: 300,
        height: 120,
        marginLeft: 10,
        marginTop: theme.spacing.unit * 3,
        float: "left",
        position: "relative"
    }),
    link: {
        color: "black",
        cursor: 'pointer'
    },
    linkP: {
        "text-align": "right",
        position: "absolute",
        bottom: 0 + 'px',
        right: 5 + 'px',

    },
    desc: {
        height: 30,
        width: 240 + 'px',
        zIndex: 10,
        position: "relative",
        color: '#666',
        display: 'block',
        height: 60 + 'px',
        overflow: 'hidden'

    }
});

function AdminPage(props) {
    const { classes } = props;

    const navigateToPage = (path) => (event) => {
        if (path === '/admin/points') {
            event.preventDefault();
            riverToast.show("This functionality is disabled for the moment.");
            return;
        }
        props.history.push(path);
    };

    return (
        <div>
            <h2>Navigate to</h2>
            {menuList.find((data) => { return data.text == "Administration" }).children.map((itm, index) => {
                const isdisabled = itm.path === '/admin/points';

                return (
                    <div key={index}>
                        {Util.hasPrivilage(itm.privilage) &&
                            <div className={classes.link} onClick={navigateToPage(itm.path)}>
                                <Paper className={classes.root} elevation={4}>

                                    <Typography type="headline" component="h3" style={{ color: !isdisabled ? "#333" : "#ddd" }}>
                                        <Icon color="primary" style={{ fontSize: 100, position: "absolute", color: "#f2f2f2" }}>
                                            {itm.icon}
                                        </Icon>
                                        <span style={{ zIndex: 10, position: "relative" }}> {itm.text} </span>
                                    </Typography>
                                    <Typography component="p" >
                                        <span className={classes.desc}> {itm.desc}</span>
                                    </Typography>
                                    <Typography component="p" className={classes.linkP}>
                                        <Icon color="primary" style={{ fontSize: 30 }}>
                                            call_made
                                        </Icon>
                                    </Typography>

                                </Paper>
                            </div>}
                    </div>
                );
            })}
        </div>
    );
}

AdminPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(AdminPage));