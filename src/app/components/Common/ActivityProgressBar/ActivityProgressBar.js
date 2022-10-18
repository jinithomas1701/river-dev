import React, { Component } from 'react';
import PropTypes, { func } from 'prop-types';

// custom component
import { Util } from '../../../Util/util';

// css
import './ActivityProgressBar.scss';

function treeSearch(tree, statusCode, path, found) {
    if (tree.code === statusCode) {
        path.push({ code: tree.code, label: tree.label, type: tree.type });
        found = true;
    }
    else {
        if (tree.success && !found) {
            path.push({ code: tree.code, label: tree.label, type: tree.type });
            ({ path, found } = treeSearch(tree.success, statusCode, path, found));
        }
        if (tree.fail && !found) {
            path = path.slice(0, path.length - 1);
            ({ path, found } = treeSearch(tree.fail, statusCode, path, found));
        }
    }
    return { path: [...path], found };
}

const buildProgressTree = (status) => {
    const statusTree = Util.getStatusTree();
    let path = [];
    const { path: tree } = treeSearch(statusTree, status, path, false);
    const generatedTree = [...tree, ...Util.getActivityHappyTree().slice(tree.length)];
    return generatedTree;
}

const ActivityProgressBar = (props) => {
    const { status: currentStatus } = props;
    const tree = buildProgressTree(currentStatus);

    return (
        <ol className="activity-progressbar">
            {
                tree.map(branch => <li
                    key={branch.code}
                    className={`item ${branch.type}`}>
                    <span className="label">{branch.label}</span>
                </li>)
            }
        </ol>
    );
}

ActivityProgressBar.defaultProps = {
};

ActivityProgressBar.propTypes = {
    status: PropTypes.string.isRequired
}

export default ActivityProgressBar;