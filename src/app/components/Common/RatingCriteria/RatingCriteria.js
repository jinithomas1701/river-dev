import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

// custom component
import {Util} from "../../../Util/util";
import {riverToast} from '../../Common/Toast/Toast';

// css
import "./RatingCriteria.scss";

const RATING_TYPE_STAR = "S";
const RATING_TYPE_CATEGORY = "C";

const getStarsTemplate = (rating, max, index) => {
    let starArray = [];

    for(let i = 0; i < max; ++i){
        const star = <Icon key={`${index}${i}`}>{(i <= index ) ? "star" : "star_border"}</Icon>;
        starArray.push(star);
    }

    return starArray
}

const RatingCriteria = (props) => {
    const ratings = props.ratingValues;
    const ratingType = props.ratingType;
    const max = ratings.length;

    return (
        <div className="rating-criteria-wrapper">
            <table className="rating-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Member</th>
                        <th>Club</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        ratings.map((rating, index) => {
                            return (
                                <React.Fragment key={rating.code}>
                                    {
                                        (ratingType === RATING_TYPE_STAR) && <tr>
                                                <th colSpan="3">{rating.label}</th>
                                            </tr>
                                    }
                                    <tr key={index}>
                                        {
                                            ratingType === RATING_TYPE_STAR && <td className="star-display">{ getStarsTemplate(rating, max, index) }</td>
                                        }
                                        {
                                            ratingType === RATING_TYPE_CATEGORY && <td>{rating.label}</td>
                                        }
                                        <td className="align-right">{rating.memberPoints} pts</td>
                                        <td className="align-right">{rating.clubPoints} pts</td>
                                    </tr>
                                </React.Fragment>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

RatingCriteria.defaultProps = {
    ratingType: RATING_TYPE_STAR,
    ratingValues: []
};

RatingCriteria.propTypes = {
    ratingType: PropTypes.oneOf([RATING_TYPE_STAR, RATING_TYPE_CATEGORY]),
    ratingValues: PropTypes.array
};

export default RatingCriteria;