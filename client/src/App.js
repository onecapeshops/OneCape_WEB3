/* eslint-disable import/order */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client";
import Home from './screens/Home/Home';
import Collections from './screens/Collections/Collections';
import Assets from './screens/Assets/Assets';
import Posters from './screens/Posters/Posters';
import Comments from './screens/Posters/Comments';
import Dao from "./screens/DAO"
import Wallet from "./screens/Wallet"
import daoDetails from "./screens/DAO/daodetails"
import MobilePlaceholder from './componentsv2/MobilePlaceholder';
import ApolloWeb3 from './apollo/apolloWeb3';

const App = () => {
  const [mobileLog, setMobileLog] = useState(undefined);

  useEffect(() => {
    const match = window.matchMedia('(max-width: 1024px)');
    setMobileLog(match.matches);
    match.addEventListener('change', e => setMobileLog(e.matches));
  }, []);

  return mobileLog ? (
    <ApolloProvider client={ApolloWeb3}>
    <div style={{ touchAction: 'manipulation' }}>
      <Router key="routerswitch">
        <Route exact path="/" component={Home} />
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/assets/:token_id" component={Assets} />
        <Route exact path="/happenings" component={Posters} />
        <Route exact path="/happenings/comments" component={Comments} />
        <Route exact path="/dao" component={Dao} />
        <Route exact path="/daodetails" component={daoDetails} />
        <Route exact path="/wallet" component={Wallet} />
      </Router>
    </div>
    </ApolloProvider>
  ) : mobileLog === false ? (
    <MobilePlaceholder />
  ) : (
    <Fragment />
  );
};

export default App;
