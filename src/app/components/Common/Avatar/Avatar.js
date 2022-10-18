import React, { Component } from 'react';
import Icon from 'material-ui/Icon';

// css
import './Avatar.scss';

class Avatar extends Component {
    badgeIcon = {
        "UBC": "../../../../../resources/images/council_badge.png",
        "UBCP": "../../../../../resources/images/cp_badge sm.png",
        "UBCS": "../../../../../resources/images/cp_badge sm.png",
        "UBCT": "../../../../../resources/images/cp_badge sm.png",
        "UBVC": "",
        "UBEC": "",
        "CBEC": "",
        "CBVC": "toys",
    }

    state = {
        expandList: false
    }

    render() {
        const badgeList = (this.props.badges) ? this.props.badges.map((badge, index) => {
            return <img className="avatar-badge-icon" key={index} title={badge.name} src={this.badgeIcon[badge.code]}/>
        }) : false;

        // const badgeList = () => {
        //         const map = (this.props.badges) || {};
        //         const result = [];
        //         for (var i in map){
        //             result.push(<Icon className="avatar-badge-icon" key={i} title={map[i]}>{this.badgeIcon[i]}</Icon>)
        //         }
        //         return result;
        // }

        return (
            <div className={`avatar-comp ${this.props.className}`}>
                <img className="avatar-img" src={(this.props.imgUrl && !this.props.imgUrl.endsWith("/null")) ? this.props.imgUrl : "../../../../../resources/images/img/user-avatar.png"} alt="Avatar" />
                {
                    (this.props.badges) &&
                        (this.props.badges.length == 1) &&
                            <div className="avatar-badge">
                                <div className="badge-container">
                                    {badgeList}
                                </div>
                            </div>
                }
                {
                    (this.props.badges) &&
                        (this.props.badges.length > 1) &&
                            <div className="avatar-badges" >
                                <div className={("badges-list-container") + ((this.state.expandList) ? " expanded" : "")} onClick={this.toggleBadgesExpand.bind(this)}>
                                    <span className="grouped-badge-icon">{badgeList.length}</span>
                                    <div className="badges-list">
                                        {badgeList}
                                    </div>
                                </div>
                            </div>
                }
            </div>
        );
    }

    toggleBadgesExpand() {
        this.setState({ expandList: !this.state.expandList })
    }
}

export default Avatar;