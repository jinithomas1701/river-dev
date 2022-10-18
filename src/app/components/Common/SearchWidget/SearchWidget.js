import React from "react";
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

// css
import './SearchWidget.scss';

export class SearchWidget extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchKey: this.props.searchKey || "",
            clearbtn: false
        }
        this.searchBtn = {
            verticalAlign: "bottom",
            padding: "12px 0",
            background: "#22BCAC",
            color: "#ffffff"
        };
    }


    componentWillReceiveProps(nextProps){
        if (this.state.searchKey === "" && nextProps.searchKey !== this.state.searchKey) {
            this.setState({ searchKey: nextProps.searchKey || "" });
        }
    }

    render() {
        const SearchWidgetStyle = {
            width: "100%"
        };

        const SearchInputStyle = {
            width: "100%",
            padding: "12px 35px 12px 43px"
        };

        if (this.props.withButton) {
            SearchWidgetStyle.width = "84%";
            SearchInputStyle.width = "84%";
            SearchInputStyle.padding = "12px 35px 12px 12px";
        }

        return (
            <div className={"search-widget "+(this.props.className || '')} style={SearchWidgetStyle}>
                <div className="search-input-wrapper">
                    {!this.props.withButton &&
                        <Icon className="input-icon">search</Icon>
                    }
                    <input 
                        style={SearchInputStyle}
                        type="text"
                        className="search-input"
                        placeholder="Search"
                        value={this.state.searchKey}
                        onChange={(e) => {
                            if (this.props.onChange) {
                                this.props.onChange(e.target.value);
                            }
                            const clearbtn = e.target.value ? true : false;
                            this.setState({searchKey: e.target.value,
                                           clearbtn
                                          })
                        }}
                        onKeyPress={
                            this.handleKeyPress.bind(this)
                        }/>
                    {
                        (this.state.searchKey || this.state.clearbtn) &&
                            <Icon onClick={this.clearSearch} className="clear-btn">clear</Icon>
                    }
                </div>
                {this.props.withButton &&
                    <Button style={this.searchBtn} onClick={this.onSearchClick.bind(this)}>
                        <Icon>search</Icon>
                    </Button>
                }
            </div>
        )
    }

    handleKeyPress(event) {
        if(event.key == 'Enter'){
            this.props.onSearch(this.state.searchKey);
        }
    }

    onSearchClick() {
        this.props.onSearch(this.state.searchKey);
    }

    clearSearch = (e) => {
        this.setState({
            searchKey : '',
            clearbtn: false
        });

        this.props.onClear();
    }
}