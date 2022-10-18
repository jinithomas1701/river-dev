import React from "react";
import {connect} from "react-redux";
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import moment from 'moment';
import { FormGroup, FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

// custom component
import { LitUpService } from "../LitUp.service";
import {Util} from "../../../Util/util";
import './LitUpVoteDialog.scss';
import IconButton from "material-ui/IconButton/IconButton";
import Tabs, { Tab } from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

const PRIVILEGE_ILITUP_ADMIN = "ILITUP_ADMIN";
const PRIVILEGE_ILITUP_VOTER = "ILITUP_VOTER";

export default class LitUpWorkshopDialogDialog extends React.Component {

    state = {
        value: 0,
        myVote:{},
        allVotes:{}
    };

    
    

    componentDidUpdate(prevProps, prevState) {

        if (!prevProps.open && this.props.open) {
            this.setState({myVote:{},allVotes:{}});           
            this.setState({myVote:this.props.myVote,allVotes:this.props.allVotes});            
        }

    }

    render() {
        return ( 
			<Dialog maxWidth="md" fullWidth={true} open={this.props.open} onRequestClose={this.handleRequestClose.bind(this)} className="litup-suggest-vote-dialog-container">
               
                <DialogContent >               
                    < div >
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    >
                    <Tab label="MY VOTE" />
                    <Tab label="ALL VOTES" />
                    <Tab label="VOTE AVERAGE" />
                </Tabs>

                {this.state.value==0 && <MyVotes    myVote={this.state.myVote} 
                                                    onCastVote={this.handleCastVote.bind(this)}
                                                    onChange={this.handleValueChange.bind(this)}/>}
                {this.state.value==1 && <AllVotes allVotes={this.state.allVotes}/>}
                {this.state.value==2 && <AllVotesAverage allVotes={this.state.allVotes}/>}
                </div>

                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleRequestClose.bind(this)}>
                        CLOSE
                    </Button>                    
                </DialogActions>
            </Dialog>
        );
    }

    handleRequestClose() {
        this.props.onRequestClose();
    }

    handleChange = (event, value) => {
        this.setState({ value });
      };

    handleValueChange=(value,field,indx)=>{
        let fields=this.state.myVote;
        fields.ratings[indx].value=value;
        this.setState({myVote:fields});
    };

    handleCastVote(type){        

       let checkField = this.state.myVote.ratings.filter(rating => {
            if(!rating.value && rating.isText){
                riverToast.show(rating.label+' is Mandatory');
                return true;
            }
            return false;
        });

        if(!confirm("Confirm Vote?")){
            return;
        }

        if(checkField.length==0){
            this.props.onVoteCast(type,this.state.myVote,this.props.suggestion.id);    
        }
    }
    

}

const MyVotes = (props) => {
    if(props &&  props.myVote  && props.myVote.ratings){
    let dpRender=props.myVote.ratings.map((rating,indx)=>{
        let optRender="";
        if(!rating.isText){
                let optRender=rating.option.map((opt=>{
                    return (<MenuItem value={opt.code}>{opt.label}</MenuItem>);
                }));
            return (<div className="dp-box">
                <div className="dp-box-title">{rating.label}</div>
                <div className="dp-box-value">
                        <Select
                            value={rating.value||""}
                            onChange={(event)=>{props.onChange(event.target.value,rating.code,indx)}}
                        >
                            {optRender}
                        </Select>
                </div>
            </div>
            );
        } else {
            let tValue=rating.value;
           return( <div className="dp-box">
            <div className="dp-box-title-opn">{rating.label}</div>
            <div className="dp-box-value-opn">
            
            <textarea rows="5" value={tValue}
                onChange={(event)=>{props.onChange(event.target.value,rating.code,indx)}}/>                 
            </div>    
            </div>);
        }
       

    }) ;

    let vType=props.myVote.voteType;
    return (<div className="idealitup-myvote">      
            {dpRender}
            
            <div className="dp-btns">
                <div className="dp-btns-btn">
                    <Button className={(vType=='upVote')?'green':'grey'} onClick={(event)=>{props.onCastVote('upVote')}}>
                        <Icon className="icon">thumb_up</Icon>
                    </Button>
                </div>
                <div className="dp-btns-btn">
                    <Button className={(vType=='downVote')?'red':'grey'} onClick={(event)=>{props.onCastVote('downVote')}}>
                        <Icon className="icon">thumb_down</Icon>
                    </Button>
                </div>
            </div>

            </div>);
    } else {
        return (<div className="no-data-label">No Data Available</div>)
    }
}

const AllVotes = (props) => {
    
    if(props && props.allVotes && props.allVotes.votes && props.allVotes.votes.length>0){

        let opinionRender=props.allVotes.votes.map((vote)=>{

            let ratingsRender=vote.ratings.map((rating)=>{
                return (
                    <div className="rating">
                        <div className="rating-key">{rating.label}</div>
                        <div className="rating-value">{rating.optionLabel}</div>
                    </div>
                );
            });

            return (<div className="opinion">
                        <div className="opinion-title">{vote.user.name || vote.user.email}

                        {(vote.voteType=='upVote')? 
                        
                        (<Icon className="green">thumb_up</Icon>)
                        
                        :
                        
                        (<Icon className="red">thumb_down</Icon>)
                        
                        }
                            
                        </div>
                        <div className="opinion-ratings">{ratingsRender}</div>        
                    </div>);


        });


        return (<div className="idealitup-allvotes">
                    <div className="opinions">{opinionRender}</div> 
                </div>);
    } else {
        return (<div className="no-data-label">No Data Available</div>);
    }
}

const AllVotesAverage = (props) => {
    if(props && props.allVotes && props.allVotes.votes && props.allVotes.votes.length>0){

        let ratingRender=props.allVotes.totalRatings.map((rating)=>{


            if(rating.isText){return;}

            let optnRender=rating.option.map((optin)=>{
                const ratingStyle=(optin.isTop)?"rating top":"rating";
                return (
                    <div className={ratingStyle}>
                        <div className="rating-key">{optin.label}</div>
                        <div className="rating-value">{optin.totalCount}</div>
                    </div>
                );
            });

            return (<div className="opinion">
                        <div className="opinion-title">{rating.label}</div>
                        <div className="opinion-ratings">{optnRender}</div>        
                    </div>);


        });


        return (<div className="idealitup-allvotes">                        
                    <div className="opinions">{ratingRender}</div> 
                </div>);
    } else {
        return (<div className="no-data-label">No Data Available</div>);
    }
}
