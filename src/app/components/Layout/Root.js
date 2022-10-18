import React from "react";
import { CircularProgress, LinearProgress } from 'material-ui/Progress';

import Header from "./Header";
import { Sidebar } from "./Sidemenu";


import { Toast, riverToast } from "../Common/Toast/Toast";
import menuList from "../../Util/Constants/completeMenuList.json";

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import grey from 'material-ui/colors/grey';
import teal from 'material-ui/colors/teal';

let theme = createMuiTheme({
    palette: {
      primary: teal,
      secondary: grey,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          'Montserrat',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 10,
        htmlFontSize: 8
      },
    appBar:{
        height:10
    }
  });

export class Root extends React.Component {
    render() {
        return (
        <MuiThemeProvider theme={theme}>
            <div className="full-width">
                <Toast />
                <div className="full-width header-container">
                    <Header/>
                </div>
                <div className="row main-wrapper">
                    {
                        this.props.role !== 'guest' &&
                            <Sidebar list={menuList} role={this.props.role}/>
                    }
                    <div className="content-wrapper body-container">
                        {this.props.children}
                    </div>
                </div>
            </div>
            </MuiThemeProvider>

        );
    }
} 