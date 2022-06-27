import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { MoralisProvider } from "react-moralis";
import configureStore from './store/configureStore';
import history from './store/history';
import App from './App';
import customTheme from './theme.json';
import BiconomyContextProvider from './context/BiconomyProviderMarketplace';
/* importing custom theme  */
const theme = createMuiTheme(customTheme);

const initialState = {};
const store = configureStore(initialState, history);
const Root = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MoralisProvider serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL} appId={process.env.REACT_APP_MORALIS_APPLICATION_ID}>
        <BiconomyContextProvider>
        <App />
        </BiconomyContextProvider>
        </MoralisProvider>
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);
