import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography, Avatar, Box } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import EuroIcon from '@material-ui/icons/Euro';
import WalletStyles from './WalletStyles';
import * as colors from '../../uicontants';
import MobilePlaceholder from '../../componentsv2/MobilePlaceholder';

const walletStylesComponent = makeStyles(WalletStyles);
const PLACEHOLDER = require('../../assets/images/placeholder.png');

const Wallet = props => {
  const classes = walletStylesComponent();
  const dispatch = useDispatch();
  const reducer = useSelector(state => state);
  const [mobileLog, setMobileLog] = useState(undefined);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const match = window.matchMedia('(max-width: 1024px)');
    setMobileLog(match.matches);
    match.addEventListener('change', e => setMobileLog(e.matches));
  }, []);

  // eslint-disable-next-line no-nested-ternary
  return mobileLog ? (
    <Box className={classes.container}>
      <Box>
        <Box className={classes.containerWrapper}>
          <Avatar
            src={PLACEHOLDER}
            variant="rounded"
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              border: `2px solid ${colors.SUCCESS_400}`,
            }}
          />
          <Typography variant="h3" className={classes.avatarName}>
            Onecape Wallet
          </Typography>
        </Box>
        <Box className={classes.bodyWrapper}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box
              style={{
                borderBottom: activeTab === 0 ? `2px solid ${colors.PRIMARY}` : `1px solid white`,
                background: `linear-gradient(${colors.LIGHT_100}, ${colors.LIGHT_500})`,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              onClick={() => setActiveTab(0)}
            >
              <Typography>NFT</Typography>
            </Box>
            <Box
              style={{
                borderBottom: activeTab === 1 ? `2px solid ${colors.PRIMARY}` : `1px solid white`,
                background: `linear-gradient(${colors.LIGHT_100}, ${colors.LIGHT_500})`,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              onClick={() => setActiveTab(1)}
            >
              <Typography>Coins</Typography>
            </Box>
            <Box
              style={{
                borderBottom: activeTab === 2 ? `2px solid ${colors.PRIMARY}` : `1px solid white`,
                background: `linear-gradient(${colors.LIGHT_100}, ${colors.LIGHT_500})`,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              onClick={() => setActiveTab(2)}
            >
              <Typography>Activity</Typography>
            </Box>
          </Box>
          <SwipeableViews
            onChangeIndex={e => {
              setActiveTab(e);
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {activeTab === 0 && [...Array(5)].map(() => <h1>data</h1>)}
              {activeTab === 1 &&
                [...Array(5)].map(() => (
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 4px',
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${colors.DARK_100}`,
                      margin: '0 10px',
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar style={{ color: colors.DARK_500, backgroundColor: 'transparent' }}>
                        <EuroIcon />
                      </Avatar>
                      <Typography variant="body1" style={{ paddingLeft: 10 }}>
                        Matic
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        background: colors.LIGHT_300,
                        borderRadius: 5,
                        padding: '8px 20px',
                      }}
                    >
                      43.012
                    </Box>
                  </Box>
                ))}
            </Box>
          </SwipeableViews>
        </Box>
      </Box>
    </Box>
  ) : mobileLog === false ? (
    <MobilePlaceholder />
  ) : (
    <Fragment />
  );
};

export default Wallet;
