import React, { Component } from 'react';
import { Button, Chip } from 'material-ui';
import Icon from "material-ui/Icon";
//css
import './AnnouncementProblemTile.scss';

class AnnouncementProblemTile extends Component {
    constructor(props) {
        super(props);

    }
    onClick = () => {
        this.props.onSelect(this.props.values);
    }
    render() {
        const props = this.props;
        const problem = props.values;
        return (
            <article
                className="announcement-problem-item-wrapper"
                title={problem.title}
                onClick={this.onClick}
            >
                <div className="content-clip-path-wrap">
                    <div className="slide-path"></div>
                </div>
                <Icon className="arrow-icon">arrow_forward</Icon>
                <h1 className="title">{problem.title}</h1>
                <div className="button-tags-wrapper">
                    {problem.tags &&
                        problem.tags.length > 0 &&
                        <div className="tags-wrap">

                            {problem.tags.map((item, index) =>
                                index <= 1 &&
                                <Chip
                                    key={index}
                                    label={item.name}
                                    className="chip-item"
                                    color="primary"
                                />
                            )}
                            {problem.tags.length > 2 &&
                                <Chip label={`+${problem.tags.length - 2}`} />
                            }
                        </div>
                    }
                    <div className="create-task-button-tile">
                        {props.actionButtons}
                    </div>
                </div>
                <Icon className="question-mark-icon">live_help</Icon>

            </article>
        )
    }
    handleCreateTaskTileClick = (event) => {
        event.stopPropagation();
        this.props.onCreateAnnouncementClick(this.props.values);
    }
}
export default AnnouncementProblemTile;