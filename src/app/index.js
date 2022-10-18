import '@babel/polyfill';
import Promise from 'promise-polyfill';
import React from  "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { browserHistory } from 'react-router';


import { RiverRoutes } from "./Util/routes";
import Store from "./Util/store";

class App extends React.Component {
  render() {
    return (
        <RiverRoutes />
    )
  }
}

render(
  <Provider store={Store}>
    <App/>
  </Provider>, window.document.getElementById("app"));