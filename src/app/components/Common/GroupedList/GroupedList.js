
import React, {Component} from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';

// custom component
import {Util} from "../../../Util/util";
import { LoaderOverlay } from '../../Common/MinorComponents/MinorComponents';

// css
import "./GroupedList.scss";

const GROUPBY_STATUS = 'ST';
const GROUPBY_KPI = 'LI';

class GroupedList extends Component{
    constructor(props){
        super(props);
        this.onSelectHandler = this.onSelectHandler.bind(this);
    }

    render(){
        let props = this.props;

        return (
            <div className="categorylist-wrapper">
                { this.getMainTemplate(this.props.categoryItems, this.props.groupBy)}
                <LoaderOverlay show={props.loading} />
            </div>
        );
    }

    onSelectHandler(activity){
        this.props.onSelect({...activity});
    }

    getMainTemplate(activities, groupBy){
        const template = activities.length > 0 ? this.getListTemplate(activities, groupBy) : this.getEmptyListTemplate();
        return template;
    }

    getEmptyListTemplate(){
        return (
            <div className="categorylist-empty">Sorry! You currently have no activities</div>
        );
    }

    getListTemplate(activities, groupBy){
        let groupPropertyExtractor, lastGroupValue, comparingFunction;
        const list = activities.map(activity => {
            ({groupPropertyExtractor, comparingFunction} = this.getComparingRule(groupBy));
            const element = comparingFunction(activity, lastGroupValue)? this.getGroupTitleTemplate(activity, groupBy, groupPropertyExtractor) : this.getItemTemplate(activity);
            lastGroupValue = groupPropertyExtractor(activity);
            return element;
        });
        return list;
    }

    getGroupTitleTemplate(activity, groupBy, groupPropertyExtractor){
        let value = groupPropertyExtractor(activity);
        const title = this.getGroupTitleText(activity, groupBy, value);
        return (
            <React.Fragment key={`frag-${activity.id}`}>
                <strong key={title} className="group-title">
                    <span className="title">{title}</span>
                </strong>
                {this.getItemTemplate(activity)}
            </React.Fragment>);
    }

    getGroupTitleText(activity, groupBy, value){
        let text = '';
        switch(groupBy) {
            case GROUPBY_STATUS:
                text = Util.getStatusFullText(value);
                break;
            case GROUPBY_KPI:
                text = `${activity.kpi.title}`;
                break;
            default:
                break;
        }
        return text;
    }

    getItemTemplate(activity){
        const selectedClass = this.props.selectedId === activity.id? "selected" : "";

        return (
            <article key={activity.id} className={`category-item ${selectedClass}`} onClick={this.onSelectHandler.bind(this, activity)}>
                <h1 className="title">{activity.title}</h1>
                <p className="title-sub">{activity.kpi.title}</p>
                <div className="sub-details">
                    <dl className="label-term-group">
                        <dt>RefCode</dt>
                        <dd>{activity.id}</dd>
                    </dl>
                    <div className="cell">{this.getStatusTemplate(activity.status)}</div>
                    <dl className="label-term-group">
                        <dt>Modified Date</dt>
                        <dd>{Util.beautifyDate(activity.lastUpdatedOn)}</dd>
                    </dl>
                    <dl className="label-term-group assignees-list">
                        <dt>Assignees ({activity.assignees.length})</dt>
                        <dd>{activity.assignees.join(', ')}</dd>
                    </dl>
                </div>
            </article>
        );
    }

    getComparingRule(groupByLabel){
        let groupPropertyExtractor, comparingFunction;
        switch(groupByLabel) {
            case GROUPBY_STATUS:
                groupPropertyExtractor = (a) => a.status;
                comparingFunction = this.compareByStatus;
                break;
            case GROUPBY_KPI:
                groupPropertyExtractor = a => a.kpi.id;
                comparingFunction = this.compareByKPI;
                break;
            default:
                break;
        }
        return {groupPropertyExtractor, comparingFunction};
    }

    compareByStatus(activity, lastValue){
        let isNewGroup = lastValue !== activity.status;
        return isNewGroup;
    }

    compareByKPI(activity, lastValue){
        let isNewGroup = lastValue !== activity.kpi.id;
        return isNewGroup;
    }

    getStatusTemplate(status){
        const text = Util.getStatusFullText(status).toUpperCase();
        const color = Util.getStatusColorCode(status);
        const template = (<div className="status-text">
                <span className="color-dot" style={{backgroundColor: color}}></span>
                <span className="status">{text}</span>
            </div>);
        return template;
    }
}

GroupedList.propTypes = {
    categoryItems: PropTypes.array.isRequired,
    selectedId: PropTypes.string,
    groupBy: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default GroupedList;