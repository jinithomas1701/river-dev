import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';

import "./VoiceTile.scss";

const VoiceTile = (props) => {
    const {department} = props;
    const path = `/admin/voice/details/${department.code}`;
    
    return (
        <Link className="voicetile-link" to={path}>
            <Paper className="voicetile-item" component="article" elevation={4}>
                <h1 className="title">{department.name}</h1>
                <dl className="footer">
                    <dt className="term">Code#:</dt>
                    <dd className="definition">{department.code}</dd>
                </dl>
            </Paper>
        </Link>
    );
};

VoiceTile.proppTypes = {
    voice: PropTypes.object.isRequired
};

export default VoiceTile;