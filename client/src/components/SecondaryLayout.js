/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Avatar,
  AppBar,
  LinearProgress,
  Button,
  Toolbar,
  Divider,
  IconButton,
} from '@material-ui/core';
import ReactGA from 'react-ga';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#F2F2F5',
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  appBar: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  avatarWithName: {
    display: 'flex',
    alignItems: 'center',
    color: '#FF7264',
    '& .MuiAvatar-colorDefault': {
      marginRight: 14,
      backgroundColor: '#FFC9B1',
      color: '#FF5A49',
    },
  },
}));

const SecondaryLayout = props => {
  const classes = useStyles();
  const [progress, setProgress] = useState(false);
  const { children, title, route, fromProfile } = props;

  return (
    <Box height="100vh" mx="auto" className={classes.root}>
      <AppBar
        position="fixed"
        className={classes.appBar}
        style={{ borderBottom: '1px solid #E3E4EB' }}
        elevation={0}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h4" className={classes.avatarWithName}>
            <IconButton
              style={{ marginLeft: -5 }}
              onClick={() => {
                setProgress(true);
                if (title === 'Track Order') {
                  route.history.push('/');
                } else {
                  localStorage.removeItem('precheck');
                  route.history.goBack();
                }
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
            {title}
          </Typography>
          {localStorage.getItem('customerName') && !fromProfile ? (
            <IconButton>
              <Box className={classes.btnGroup}>
                <Avatar
                  onClick={() => {
                    const shopName = localStorage.getItem('subdomain');
                    const mobileNumber = localStorage.getItem('mobileNumber');
                    ReactGA.event({
                      category: 'Product Listing',
                      action: 'profile',
                      label: shopName,
                      value: mobileNumber,
                    });
                    // console.log("profile",{
                    //   category: 'Product Listing',
                    //   action: "profile",
                    //   label:shopName,
                    //   value:mobileNumber
                    // })
                    setProgress(true);
                    route.history.push('/profile');
                  }}
                  style={{ fontSize: 14, textTransform: 'uppercase', backgroundColor: '#FF897D' }}
                >
                  {localStorage.getItem('customerName').slice(0, 2)}
                </Avatar>
              </Box>
            </IconButton>
          ) : !fromProfile ? (
            <Box className={classes.btnGroup}>
              <Button
                color="secondary"
                className={classes.primaryBtn}
                variant="contained"
                // eslint-disable-next-line react/prop-types
                onClick={() => {
                  const shopName = localStorage.getItem('subdomain');
                  ReactGA.event({
                    category: 'Product Listing',
                    action: 'login',
                    label: shopName,
                  });
                  // console.log("product Listing",{
                  //   category: 'Product Listing',
                  //   action: "login",
                  //   label:shopName
                  // })
                  setProgress(true);
                  route.history.push('/login');
                }}
              >
                Login
              </Button>
            </Box>
          ) : (
            <Fragment />
          )}
        </Toolbar>
      </AppBar>
      <Divider />
      {progress && <LinearProgress color="secondary" style={{ height: 2 }} />}
      <Box style={{ marginTop: 56, marginBottom: 20 }}>{children}</Box>
    </Box>
  );
};
SecondaryLayout.propTypes = {
  children: PropTypes.isRequired,
};
export default SecondaryLayout;
