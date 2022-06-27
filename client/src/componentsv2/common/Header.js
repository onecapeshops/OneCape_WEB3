/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { AppBar, Typography, Box, makeStyles, Avatar, Button, IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ReactGA from 'react-ga';
import { actions } from '../../actions/index';
import * as colors from '../../uicontants';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '90%',
    marginLeft: '6%',
    marginTop: '2.5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerWrapper: {
    display: 'flex',
    width: '100%',
    // height: '100%',
    marginTop: '-2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.DARK_400,
  },
  overflowSingle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textAlign: 'left',
  },
  button: {
    borderRadius: 10,
    // padding: '10px 20px 10px 20px',
    backgroundColor: colors.PRIMARY,
    color: colors.LIGHT_500,
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const [location, setLocation] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem('location'));
    setLocation(res || {});
    const accessToken = localStorage.getItem('access-token');
    if (
      res &&
      (!Object.keys(res) || !Object.keys(res).length) &&
      accessToken &&
      accessToken !== undefined
    ) {
      dispatch(
        actions.getCustomerAddress(callback => {
          if (callback) {
            localStorage.setItem('location', JSON.stringify(callback));
            setLocation(callback);
          }
        }),
      );
    } else {
      history.push('/');
    }
  }, []);
  const changeLocation = () => {
    const shopName = localStorage.getItem('subdomain');
    const mobileNumber = localStorage.getItem('mobileNumber');
    ReactGA.event({
      category: 'Home',
      action: 'map',
      label: shopName,
      value: mobileNumber,
    });
    const customerName = localStorage.getItem('customerName');
    if (customerName) {
      history.push('/searchlocation');
    }
  };

  const login = () => {
    const shopName = localStorage.getItem('subdomain');
    ReactGA.event({
      category: 'Login/Create',
      action: 'login',
      label: shopName,
    });
    history.push('/login');
  };

  const wallet = () => {
    history.push('/wallet')
  }

  const goToMyProfile = () => {
    const shopName = localStorage.getItem('subdomain');
    const mobileNumber = localStorage.getItem('mobileNumber');
    ReactGA.event({
      category: 'Home',
      action: 'profile',
      label: shopName,
      value: mobileNumber,
    });
    history.push('/profile');
  };

  return (
    <AppBar
      style={{
        width: '100%',
        height: 66,
        background: colors.LIGHT_100,
        borderBottom: `1px solid ${colors.LIGHT_400}`,
      }}
    >
      <Box className={classes.root}>
        <Box className={classes.headerWrapper}>
          <Box className={classes.innerWrapper} onClick={changeLocation}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="body1">
                {location && Object.keys(location) && Object.keys(location).length
                  ? location.tag.charAt(0).toUpperCase() + location.tag.slice(1)
                  : localStorage.getItem('customerName')
                  ? 'Locate Me!'
                  : localStorage.getItem('shopName')}
              </Typography>
              {localStorage.getItem('customerName') && (
                <ExpandMoreOutlinedIcon
                  style={{
                    marginLeft: 2,
                    color: colors.SECONDARY,
                  }}
                />
              )}
            </Box>
            <Typography
              variant="h6"
              className={classes.overflowSingle}
              style={{ color: colors.DARK_300 }}
            >
              {location && Object.keys(location) && Object.keys(location).length
                ? location.address
                : localStorage.getItem('customerName')
                ? 'Help us to deliver tasty food'
                : 'Login to grab instant discounts'}
            </Typography>
          </Box>
          {localStorage.getItem('customerName') ? (
            <IconButton onClick={goToMyProfile}>
              <Avatar
                onClick={() => goToMyProfile()}
                style={{
                  fontSize: 14,
                  textTransform: 'uppercase',
                  backgroundColor: '#FF897D',
                }}
              >
                {localStorage.getItem('customerName').slice(0, 2)}
              </Avatar>
              {/* <AccountCircleOutlinedIcon style={{ color: colors.DARK_400 }} /> */}
            </IconButton>
          ) : (
            <Button className={classes.button} onClick={wallet}>
              Connect
            </Button>
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
