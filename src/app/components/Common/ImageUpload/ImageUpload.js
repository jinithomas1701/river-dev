import React from 'react';
import './ImageUpload.scss';

import { Util } from "../../../Util/util";

class ImageUpload extends React.Component {
    constructor(props){
        super();
    }
    
    onImageChange = (event) => {
        //console.log(event);
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            //@TODO: Validate image
            this.props.onChange(file);
        }
        
        reader.readAsDataURL(file);
    }

    render(){
        return (
            <div className="image-upload-wrapper">
                <label>
                    <input accept="jpg,jpeg,JPG,JPEG" onChange={this.onImageChange} type="file" />
                    <img ref="user-image" src={this.props.preview} className="u_c-dp-img" />
                    <span className="u_c-dp-change">Change</span>
                </label>
            </div>
        );
    }
}

export default ImageUpload;