import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FieldHeader from '../../../Common/FieldHeader/FieldHeader';
import './StackedList.scss';

class StackedList extends Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    render = () => {
        const props = this.props;
        const classList = `stackedlist-wrapper ${props.className}`;
        const Comp = props.itemTemplate;

        return (
            <div className={`${classList}`}>
                { (props.listData.length > 0) ? this.getListTemplate(props) : props.emptyTemplate }
            </div>
        );
    }

    getListTemplate(props){
        let lastItem, uiTemplate;
        let template = props.listData.map((currItem, index) => {
            const compareRule = props.comparator(lastItem, currItem);
            let itemTemplate;
            lastItem = currItem;
            uiTemplate = React.cloneElement(props.itemTemplate, {key: index, ...currItem, ...props.itemProps});
            if(compareRule.isNewGroup){
                itemTemplate = (
                    <React.Fragment key={index}>
                        <FieldHeader
                            title={compareRule.heading || `Group ${index}`}
                            backgroundColor={props.headerBgColor}
                            />
                        {uiTemplate}
                    </React.Fragment>
                );
            }
            else{
                itemTemplate = uiTemplate;
            }

            return itemTemplate;
        });

        return template;
    }
}

StackedList.defaultProps = {
    listData: [],
    itemTemplate: (<div />),
    headerBgColor: "#f9f9f9",
    emptyTemplate: null,
    itemProps: {},
};

StackedList.propTypes = {
    listData: PropTypes.array,
    itemTemplate: PropTypes.element,
    headerBgColor: PropTypes.string,
    emptyTemplate: PropTypes.element,
    itemProps: PropTypes.object,
    comparator: PropTypes.func,
}

export default StackedList;