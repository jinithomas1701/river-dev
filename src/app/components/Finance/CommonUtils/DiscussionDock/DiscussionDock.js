import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton/IconButton';
import Dock from 'react-dock';

// custom component
import { LoaderOverlay} from '../../../Common/MinorComponents/MinorComponents';
import DiscussionMaster from '../../CommonUtils/DiscussionMaster/DiscussionMaster';

// css
import './DiscussionDock.scss';

const VOICE_TYPE_COMPLAINT = "C";

const DiscussionDock = (props) => {

    return (
        <Dock
            size={0.39}
            zIndex={201}
            position="right"
            isVisible={props.open}
            dimMode="opaque"
            defaultSize={.49}
            onVisibleChange={props.onClose}
            >
            <div className="discussiondock-wrapper">
                <header className="header">
                    <h2 className="title">Discussions</h2>
                    <IconButton className="btn" onClick={props.onClose}><Icon>close</Icon></IconButton>
                </header>
                <LoaderOverlay show={props.isLoading} />
                <DiscussionMaster
                    discussion={props.discussion}
                    onSubmit={props.onSubmit}
                    />
            </div>
        </Dock>
    );
};

DiscussionDock.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export default DiscussionDock;