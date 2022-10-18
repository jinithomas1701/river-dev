import React, {Component} from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip'

// custom component
import {Util} from "../../../Util/util";

// css
import "./StarRate.scss";

class StarRate extends Component{
    constructor(props){
        super(props);
        this.state = {
            hoverValue: ""
        };
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    render(){

        return (
            <div className="starrate-wrapper">
                <div className="star-box" data-for="starrate-tip" data-tip>
                    {this.getStarRateTemplate(this.props.categories)}
                </div>
                <ReactTooltip id='starrate-tip' className="starrate-tip" effect='solid'>
                    {this.getTooltipStarTemplate(this.props.categories)}
                </ReactTooltip>
            </div>
        );
    }

    getStarRateTemplate(categories){
        const props = this.props;
        const editClass = props.editable? "editable" : "locked";
        let ratingFound = (props.value)? false : true;
        const testValue = (this.state.hoverValue !== "" && props.editable) ? this.state.hoverValue : props.value;

        const template = categories.map((category, index) => {
            const starType =  ratingFound ? "star_border" : "star";
            const starIcon = (<Icon
                                  key={index}
                                  className={`starrate-item ${editClass}`}
                                  onMouseOver={this.handleMouseOver.bind(this, category.code)}
                                  onMouseOut={this.handleMouseOut}
                                  onClick={this.handleClick.bind(this, category)}
                                  >
                    {starType}
                </Icon>);
            if(category.code === testValue){
                ratingFound = true;
            }
            return starIcon;
        });
        return template;
    }

    getTooltipStarTemplate(categories){
        let template = [];
        for(let i = 0; i < categories.length; ++i){
            let found = false;
            const starRow = categories.map((category) => {
                const starType = found? "star_border" : "star";
                if(category.code === categories[i].code){
                    found = true;
                }
                return <Icon className="star-icon" key={category.code}>{starType}</Icon>;
            });
            template.push(<tr className="star-row" key={categories[i].code}>
                    <th className="star-column">{starRow}</th>
                    <td className="star-points">{categories[i].code}</td>
                    <td className="star-lable">{categories[i].label}</td>
                </tr>);
        }
        return (<table className="star-table"><tbody>{template}</tbody></table>);
    }

    handleMouseOver(hoverValue){
        if(!this.props.editable){
            return;
        }
        this.setState({hoverValue})
    }

    handleMouseOut(){
        if(!this.props.editable){
            return;
        }
        this.setState({hoverValue: ""});
    }

    handleClick(category){
        if(!this.props.editable){
            return;
        }
        this.setState({hoverValue: ""});
        this.props.onSelect(category);
    }
}

StarRate.defaultProps = {
    editable: false,
};

StarRate.propTypes = {
    categories: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onSelect: PropTypes.func
};

export default StarRate;