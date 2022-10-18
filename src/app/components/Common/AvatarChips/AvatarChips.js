import React, {Component} from 'react';
import PropTypes from 'prop-types';

// custom component
import {Util} from '../../../Util/util';
import AvatarInfo from '../../Common/AvatarInfo/AvatarInfo';

// css
import './AvatarChips.scss';

class AvatarChips extends Component{
    constructor(props){
        super(props);

        this.onDelete = this.onDelete.bind(this);
    }

    render(){
        const props = this.props;

        return (
            <div className="avatarchip-wrapper">
                {
                    props.list.map(item => {
                        return (<AvatarInfo
                                    key={item.id}
                                    {...item}
                                    deletable={props.deletable || item.deletable}
                                    onDelete={this.onDelete}
                                    />)
                    })
                }
            </div>
        );
    }

    onDelete(itemId){
        if(this.props.deletable){
            this.props.onDelete(itemId);
        }
    }
}

AvatarChips.defaultProps = {
    list: [],
    deletable: false
};

AvatarChips.propTypes = {
    list: PropTypes.array,
    deletable: PropTypes.bool,
    onDelete: PropTypes.func
}

export default AvatarChips;