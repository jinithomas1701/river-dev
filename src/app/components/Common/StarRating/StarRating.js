import React from "react";
import { render } from 'react-dom';
import Icon from 'material-ui/Icon';
import './StarRating.scss';

export class StarRating extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const starRating = Number(this.props.rating);
        let divStyle = {
            color: this.props.color,
            "font-size": this.props.size
        };
        const classNameText = `rating-icon ${this.props.className} ${this.props.isEditable? "clickable" : ""}`;
        let assignFullStar = starRating? true : false;
        let valueList = [];
        if(this.props.categoriesList){
            valueList = this.props.categoriesList;
        }
        else{
            for(let i = 0; i < 5; i++){
                valueList.push({
                    code: i+1
                });
            }
        }
        const starTemplate = valueList.map((category, index) => {

            let labelText = (this.props.categoriesList && this.props.categoriesList.length)? this.props.categoriesList[index].label : "";
            let iconElement;
            if(starRating == 0){
                iconElement = "star_border";
            }
            else{
                iconElement = assignFullStar ? "star" : "star_border"
                if(Number(category.code) === starRating){
                    assignFullStar = false;
                }
            }

            return (
                <Icon title={labelText}
                    style={divStyle}
                    key={index}
                    className={classNameText}
                    onClick={this.onStarClick.bind(this, Number(category.code))}>
                    {iconElement}
                </Icon>
            );
        });

        return (
            <div className="star-rating-component">
                {starTemplate}          
            </div>
        )
    }

    onStarClick(value) {
        if (this.props.isEditable) {
            this.props.onChange(value);
        }
    }
}