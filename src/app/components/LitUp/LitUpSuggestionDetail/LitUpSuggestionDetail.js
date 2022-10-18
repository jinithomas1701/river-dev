import React, { Component } from 'react';
import {connect} from "react-redux";
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Tooltip from 'material-ui/Tooltip';
import { SearchWidget } from '../../Common/SearchWidget/SearchWidget';
import { Chart } from 'react-google-charts';
// import { HorizontalTimeline } from "react-horizontal-timeline";

//root component
import { Root } from "../../Layout/Root";

// custom component
import { MainContainer } from "../../Common/MainContainer/MainContainer";
import { PageTitle } from '../../Common/PageTitle/PageTitle';
import { Util } from '../../../Util/util';
import { Toast, riverToast } from '../../Common/Toast/Toast';
import {SelectBox} from "../../Common/SelectBox/SelectBox";

//service
import { LitUpSuggestionDetailService } from "./LitUpSuggestionDetail.service";

//css
import './LitUpSuggestionDetail.scss';
import IconButton from 'material-ui/IconButton/IconButton';
import { TextField } from 'material-ui';

const PRIVILEGE_LITUP_ADMIN = 'ILITUP_ADMIN';
const PRIVILEGE_ILITUP_VOTER = "ILITUP_VOTER";
const PRIVILEGE_ILITUP_BUCKETIZE_IDEA = "ILITUP_BUCKETIZE_IDEA";
const PRIVILEGE_ILITUP_IDEA_BUCKETIZE_CHART = "ILITUP_IDEA_BUCKETIZE_CHART";

export default class LitUpSuggestionDetail extends Component {
    state = {
        selectedLitupLevel: null,
        selectedSuggestion: null,
        roiStatement: '',
        bucketList: [],
        opinionList: [],
        selectedOpnionType: null,
        litupLevels: [],
        originalLevelList: [],
        suggestionComment: '',
        value: '',
        timeline: null,
        chartData: [],
        isROIEnabled: false,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getBucketTypes();
        this.getSuggestionLevels();
    }
    
    render() {
        let opinions;
        if (this.state.selectedSuggestion && this.state.selectedSuggestion.opinions) {
            opinions = this.state.selectedSuggestion.opinions.map((opinon, index) => {
                return <div className="comment-item" key={index}>
                    <div className="item-head">
                        <div className="author-details">
                            <div className="user-name">{opinon.createdBy.name}</div>
                            <div className="user-email">{opinon.createdBy.username}</div>
                            <div className="posted-time">Posted on {Util.getDateStringFromTimestamp(opinon.createdOn, 'DD-MM-YYYY hh:mm A')}</div>
                        </div>
                        <div className="comment-type">
                            <div className="type-tag" style={{'background':opinon.bucketType.color}}>{opinon.bucketType.label}</div>
                        </div>
                    </div>
                    <div className="item-body">
                        {opinon.opinion}
                    </div>
                </div>
            });
        }
        
        return (
            <Root role="user">
				<MainContainer>
                    <img src="../../../resources/images/ideaLitup.png" style={{height:4+'rem'}}/>
                    {this.state.selectedSuggestion &&
                        <div className="row litup-detail-page">
                            <div className="col-md-12 litup-detail-view-container">
                                <div className="header-action">
                                    <Button raised onClick={this.onBackClick.bind(this)}>
                                        <Icon>keyboard_backspace</Icon>BACK
                                    </Button>
                                </div>
                                <div className="litup-title">
                                    {this.state.selectedSuggestion.topic}
                                </div>
                                {this.state.timeline && this.state.selectedSuggestion.viewChartFlag &&
                                    <div className="litup-screen-block litup-timeline-container">
                                        <div className="timeline-title">Idea Workflow Timeline</div>
                                        <div className="timeline-wrapper">
                                            {this.state.timeline}
                                        </div>
                                    </div>
                                }
                                {Util.hasPrivilage(PRIVILEGE_LITUP_ADMIN) &&
                                    <div className="litup-stage-selector-container">
                                        <div className="roi-container">
                                            {(!this.state.selectedSuggestion.level || !this.state.selectedSuggestion.level.statement || Util.hasPrivilage(PRIVILEGE_LITUP_ADMIN)) && this.state.isROIEnabled &&
                                                <TextField 
                                                    multiline
                                                    id="roi"
                                                    label="ROI"
                                                    className="text-field"
                                                    value={this.state.roiStatement}
                                                    margin="normal"
                                                    onChange={(e) => {
                                                        this.setState({roiStatement: e.target.value});
                                                    }}
                                                />
                                            }
                                            
                                        </div>
                                        <div className="stage-action-container">
                                            <div className="selector-wrapper">
                                                <SelectBox 
                                                    id="litup-stage-select" 
                                                    label="Workflow Level" 
                                                    selectedValue={this.state.selectedLitupLevel}
                                                    selectArray={this.state.litupLevels}
                                                    onSelect={this.onSelectSuggestionLevel.bind(this)}/>
                                            </div>
                                            <Button raised color="primary" onClick={this.onForwardSuggestion.bind(this)}>CHANGE</Button>
                                        </div>
                                    </div>
                                }
                                {this.state.selectedSuggestion.level && this.state.selectedSuggestion.level.statement && !Util.hasPrivilage(PRIVILEGE_LITUP_ADMIN) &&
                                    <div className="litup-screen-block roi-text-container">
                                        <div className="title">ROI</div>
                                        <div className="content">{this.state.selectedSuggestion.level.statement[0].value || ''}</div>
                                    </div>
                                }
                                <div className="litup-screen-block litup-chart-container">
                                    <div className="suggestion-detail">
                                        <div className="suggestion-title">{this.state.selectedSuggestion.title}</div>
                                        <div className="suggestion-content">{this.state.selectedSuggestion.description}</div>
                                        {this.state.selectedSuggestion.attachedDoc && this.state.selectedSuggestion.attachedDoc.filename &&
                                            <div className="attachment-container">
                                                <span>Attachment</span><Icon className="download-attachment" onClick={this.onDownloadClick.bind(this, this.state.selectedSuggestion)}>get_app</Icon>
                                            </div>
                                        }
                                        
                                    </div>
                                    <div className="chart-container">
                                        <div className="user-detail">
                                            {this.state.selectedSuggestion.createdBy &&
                                                <div className="avatar">
                                                    {this.getAvatar(this.state.selectedSuggestion.createdBy)}
                                                </div>
                                            }
                                            <div className="user-content">
                                                <div className="name">{this.state.selectedSuggestion.createdBy.name}</div>
                                                <div className="email">{this.state.selectedSuggestion.createdBy.username}</div>
                                                <div className="posted-on">Posted on {Util.getDateStringFromTimestamp(this.state.selectedSuggestion.createdOn, 'DD-MM-YYYY hh:mm A')}</div>
                                            </div>

                                        </div>
                                        {this.state.chartData && this.state.chartData.length > 0 
                                            && this.state.selectedSuggestion.viewChartFlag &&
                                            <Chart
                                                chartType="ColumnChart"
                                                data={this.state.chartData}
                                                options={{
                                                    title: 'Classification Chart',
                                                    hAxis: {
                                                        title: 'Classifications'
                                                    },
                                                    legend: {position: 'none'}
                                                }}
                                                loader="Rendering..."
                                                graph_id="PointsChart"
                                                width="100%"
                                                height="200px"
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="litup-screen-block litup-comments-container">
                                    {this.state.selectedSuggestion.postOpinionFlag &&
                                        <div className="discussion-input-container">
                                            <div className="text-input-wrapper">
                                                <textarea placeholder="Enter your opinion here"
                                                    value={this.state.suggestionComment}
                                                    onChange={(e) => {
                                                        this.setState({suggestionComment: e.target.value});
                                                    }}></textarea>
                                            </div>
                                            <div className="selector-wrapper">
                                                <SelectBox 
                                                    id="litup-stage-select" 
                                                    label="my opinion denotes the" 
                                                    selectedValue={this.state.selectedOpnionType}
                                                    selectArray={this.state.opinionList}
                                                    onSelect={this.onSelectOpinionType.bind(this)}/>
                                            </div>
                                            <div className="action-wrapper">
                                                <Button raised color="primary" onClick={this.onOpinionSubmit.bind(this)}>
                                                    SUBMIT
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    {this.state.selectedSuggestion.viewOpinionFlag &&
                                        <div className="comments-wrapper">
                                            {this.state.selectedSuggestion.opinions && this.state.selectedSuggestion.opinions.length > 0 ? (
                                                <div className="comments-container">
                                                    {opinions}
                                                </div>
                                            ) : (
                                                <div className="comments-container">
                                                    <div className="emtpy-holder">
                                                        No opinions so far
                                                    </div>
                                                </div>
                                            )}    
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    
                </MainContainer>
			</Root>
        );
    }

    onBackClick() {
        this.props.history.push("/litup/"+this.state.selectedSuggestion.topicId);
    }

    onDownloadClick(suggestion) {
        LitUpSuggestionDetailService.downloadAttachment(suggestion.id)
            .then(fileData => {
                console.log(fileData);
                this.onDownloadFile(fileData);
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wring while downloading attachment');
            })
    }

    onDownloadFile(attachedDoc) {

        if(attachedDoc.filename){
            
            let extn=attachedDoc.filename.split(".");
            let extNm=extn[extn.length-1];
            switch(extNm){
                case "pdf":
                    attachedDoc.mimeType="application/pdf";
                    break;
                case "docx":
                    attachedDoc.mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                case "doc":
                    attachedDoc.mimeType="application/msword";
                    break;
                default:
                    break;
            }


        }

        if(!attachedDoc.mimeType){
            attachedDoc.mimeType=attachedDoc.mimeType?attachedDoc.mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        if(!attachedDoc.filename){
            switch(attachedDoc.mimeType){
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    attachedDoc.fileName="attachment.docx";
                    break;
                case "application/pdf":
                    attachedDoc.filename="attachment.pdf";
                    break;
                case "image/jpeg":
                    attachedDoc.filename="attachment.jpg";
                    break;
                case "image/png":
                    attachedDoc.filename="attachment.png";
                    break;
                default:
                    attachedDoc.filename="attachment"
            }
        }
        
        Util.downloadMimeTypeFile(attachedDoc.fileContents, attachedDoc.filename, attachedDoc.mimeType);
    }

    getAvatar(user) {
        let avatarElement;
        if (user.avatar) {
            avatarElement = <img src={Util.getFullImageUrl(user.avatar)} alt="dp" className="profile-avatar"/>;
        } else {
            avatarElement = <Avatar>U</Avatar>;
            if(user.name){
                avatarElement = <Avatar>{user.name.toUpperCase().charAt(0)}</Avatar>;
            }
        }

        return avatarElement;
    }

    onSelectSuggestionLevel(level) {
        let isROIEnabled = false;
        this.state.originalLevelList.forEach((levelObj, index) => {
            if (levelObj.code === level) {
                isROIEnabled = levelObj.needStatement;
            }
        });
        this.setState({isROIEnabled: isROIEnabled});
        this.setState({selectedLitupLevel: level});
    }

    onSelectOpinionType(type) {
        this.setState({selectedOpnionType: type});
    }

    changeSuggestionLevel(request) {
        LitUpSuggestionDetailService.changeLitUpSuggestionLevel(request)
            .then(data => {
                console.log(data);
                riverToast.show('Workflow status updated successfully');
                this.loadSuggestionDetail(this.props.match.params.suggestionId);
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while forwarding idea');
            });
    }

    onForwardSuggestion() {
        if (this.state.selectedLitupLevel) {
            let isROIEnabled = false;
            this.state.originalLevelList.forEach((level, index) => {
                if (level.code === this.state.selectedLitupLevel) {
                    isROIEnabled = level.needStatement;
                }
            });
            const request = {
                "ideaId":this.state.selectedSuggestion.id,
                "levelCode": this.state.selectedLitupLevel,
                "statement":this.state.roiStatement,
            };
            if (isROIEnabled) {
                if (!this.state.roiStatement) {
                    if (confirm('Do you want to forward idea without giving ROI ?')) {
                        this.changeSuggestionLevel(request);
                    }
                } else {
                    this.changeSuggestionLevel(request);
                }
            } else {
                this.changeSuggestionLevel(request);
            }
        } else {
            riverToast.show('Please select a level');
        }
        
    }

    getBucketTypes() {
        LitUpSuggestionDetailService.getBucketTypes()
            .then(data => {
                this.setState({bucketList: data});
                const parsedList = [];
                data.forEach(bucket => {
                    parsedList.push({
                        title: bucket.label,
                        value: bucket.bucketType
                    });
                });
                this.setState({opinionList: parsedList});
                this.setState({selectedOpnionType: parsedList[0].value});
            })
            .catch(error => {
                riverToast.show(error.status_message || 'Something went wrong while getting bucket types');
            });
    }

    setChartData(chartDataArray) {
        const parsedChartData = [["Buckets","Values", { role: 'style' }]];
        chartDataArray.forEach(chart => {
            parsedChartData.push([chart.label, chart.value, chart.color]);
        });
        this.setState({chartData: parsedChartData});
    }

    processTimeline(level) {
        let isLevelSelected = false;
        let selectedLevelIndex = -1;
        const timelineLevels = this.state.originalLevelList.map((levelObj, index) => {
            let mileStoneClassName = 'milestone ';
            let textClassName = 'text ';
            let lineClassName = 'line ';
            if (levelObj.code === level.levelCode) {
                isLevelSelected = true;
                selectedLevelIndex = index;
            }
            if (!isLevelSelected) {
                mileStoneClassName+='passed';
                textClassName+='passed';
                lineClassName+='passed';
            } else if(isLevelSelected && selectedLevelIndex == index) {
                mileStoneClassName+='current';
                textClassName+='passed';
                lineClassName ='line';
            } else if (isLevelSelected && selectedLevelIndex != index) {
                mileStoneClassName ='milestone';
                textClassName ='text';
                lineClassName ='line';
            }
            
            return <div className="node-container" key={index}>
                <div className={mileStoneClassName}>
                    <div className={textClassName}>{levelObj.label}</div>
                </div>
                {(this.state.originalLevelList.length - 1) != index &&
                    <div className={lineClassName}></div>
                }
            </div>
        });
        this.setState({timeline: timelineLevels});
    }

    getSuggestionLevels() {
        LitUpSuggestionDetailService.getLitUpSuggestionLevels()
            .then(data => {
                const parsedLevelList = [];
                data.forEach(function (element) {
                    parsedLevelList.push({
                        title: element.label,
                        value: element.code,
                        roi: element.needStatement
                    });
                }, this);
                this.setState({originalLevelList: data});
                this.setState({litupLevels: parsedLevelList});
                this.loadSuggestionDetail(this.props.match.params.suggestionId);
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while getting suggestion detail');
            });
    }


    loadSuggestionDetail(suggestionId) {
        LitUpSuggestionDetailService.getLitUpSuggestionDetail(suggestionId)
            .then(data => {
                this.setState({selectedSuggestion: data});
                if (data && data.level && data.level.levelCode) {
                    this.setState({selectedLitupLevel: data.level.levelCode});
                    let isROIEnabled = false;
                    this.state.originalLevelList.forEach((levelObj, index) => {
                        if (levelObj.code === data.level.levelCode) {
                            isROIEnabled = levelObj.needStatement;
                        }
                    });
                    this.setState({isROIEnabled: isROIEnabled});
                    if (data.level.statement && data.level.statement[0].value) {
                        this.setState({roiStatement: data.level.statement[0].value});
                    }
                    {data.level && 
                        this.processTimeline(data.level);
                    }
                }
                if (data && data.chart) {
                    this.setChartData(data.chart);
                }
            })
            .catch(error => {
                console.log(error);
                riverToast.show(error.status_message || 'Something went wrong while getting suggestion detail');
            });
    }

    onOpinionSubmit() {
        if (this.state.suggestionComment) {
            const request = {
                "comment" : this.state.suggestionComment,
                "bucketTypeCode" : this.state.selectedOpnionType
            };
            LitUpSuggestionDetailService.submitOpinion(this.props.match.params.suggestionId, request)
                .then(data => {
                    this.setState({suggestionComment: ""});
                    this.loadSuggestionDetail(this.props.match.params.suggestionId);
                })
                .catch(error => {
                    riverToast.show(error.status_message || 'Something went wrong while submitting suggestion');
                });
        } else {
            riverToast.show('Please enter your opinion');
        }
    }
}