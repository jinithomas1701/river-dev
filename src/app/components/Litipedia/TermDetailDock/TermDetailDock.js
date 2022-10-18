import React, { Component } from 'react';
import { Icon } from 'material-ui';
import Linkify from 'react-linkify';

// css
import './TermDetailDock.scss';

import { LitipediaServices } from '../Litipedia.services';

import { riverToast } from '../../Common/Toast/Toast';
import { Util } from '../../../Util/util';

const LPEDIA_ADMIN = "LPEDIA_ADMIN";

class TermDetailDock extends Component {

    state = {
        term: ''
    }

    componentDidMount() {
        this.props.termId ? this.getThisTerm(this.props.termId) : this.onCloseDock()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.termId !== this.props.termId) {
            this.props.termId && this.getThisTerm(this.props.termId) 
        }
    }

    componentWillUnmount() {
        this.setState({
            term: ''
        })
    }

    render() {
        return (
            <div className="term-detail-dock-container">
                <div className="dock-actions close" onClick={this.onCloseDock.bind(this)}><Icon>close</Icon> Close</div>
                {
                    Util.hasPrivilage(LPEDIA_ADMIN) &&
                        <div className="dock-actions-admin">
                            <div className="edit" onClick={this.onEditTerm.bind(this)}><Icon>delete</Icon> Edit</div>
                            <div className="delete" onClick={this.onDeleteTerm.bind(this)}><Icon>delete</Icon> Delete</div>                
                        </div>
                }
                <div className="term-title">
                    {this.state.term.keyword}*
                </div>
                <table className="term-det-table">
                    <tbody>
                        <tr className="term-det-row">
                            <td className="term-det-title cell">Definition</td>
                            <td className="term-det-value cell">
                                <Linkify properties={ { target: '_blank' } }>{this.state.term.definition}</Linkify>
                            </td>
                        </tr>
                        <tr className="term-det-row">
                            <td className="term-det-title cell">Application</td>
                            <td className="term-det-value cell">
                                <Linkify properties={ { target: '_blank' } }>
                                    {this.state.term.application}
                                </Linkify>
                            </td>
                        </tr>
                        <tr className="term-det-row">
                            <td className="term-det-title cell">Example</td>
                            <td className="term-det-value cell">
                                <Linkify properties={ { target: '_blank' } }>
                                    {this.state.term.example}
                                </Linkify>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <img src="../../../resources/images/l7_weird.png" className="corner-logo" alt="."/> */}
                {/* <div className="definition section">
                    <div className="title">Definition</div>
                    <div className="value">
                        <Linkify properties={ { target: '_blank' } }>{this.state.term.definition}</Linkify>
                    </div>
                </div>
                <div className="application section">
                    <div className="title">Application</div>
                    <div className="value">
                        <Linkify properties={ { target: '_blank' } }>                
                            {this.state.term.application}
                        </Linkify>
                    </div>
                </div> */}
            </div>
        );
    }

    onDeleteTerm() {
        if(confirm('Are you sure about deleting the term?')) {
            LitipediaServices.deleteTerm(this.props.termId)
            .then((data) => {
                this.props.onDeleteSuccess();
            })
            .catch((error) => {
                riverToast.show("Something went wrong while deleting term");
            })
        }
    }

    onEditTerm() {
        this.onCloseDock();
        this.props.onEditTerm(this.state.term);
    }

    getThisTerm(termId) {
        LitipediaServices.getTerm(termId)
        .then((resp) => {
            this.setState({ term: resp })
        })
        .catch((error) => {
            riverToast.show("Something went wrong while getting term");
        })
    }

    onCloseDock() {
        this.props.closeDock();
    }
}

export default TermDetailDock;