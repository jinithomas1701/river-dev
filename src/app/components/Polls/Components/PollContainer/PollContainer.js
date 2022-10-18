import React from "react";
import PollCard from "./PollCard/PollCard";

// css
import "./PollContainer.scss"

class PollContainer extends React.Component {
    render() {
        const pollCardsList = this.props.polls.map((poll, index) => {
            return <PollCard poll={poll} key={index} actionCallback={this.doAction.bind(this)} type={this.props.type} />
        });

        return (
            <div className={ this.props.type + " user-polls-listing-category"}>
                {/* <div className="title">{this.props.title}</div> */}
                <div className="polls-container">
                    {pollCardsList.length <= 0 && 
                        <div className="empty-content-container">No polls found</div>
                    }
                    {pollCardsList}
                </div>
            </div>
        );
    }

    onWheel(selector, e){
        const container = document.querySelector(".user-polls-listing-category." + selector);
        container.scrollTo( container.scrollLeft + e.deltaY, 0);
        e.preventDefault();
    }
    
    doAction(poll){
        this.props.doActionCallback(poll);
    }
}

export default PollContainer;