import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import PropTypes, { object } from 'prop-types';
import * as colors from '../../uicontants';

const useStyles = makeStyles(() => ({
  shopWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: colors.LIGHT_100,
  },
  shopInnerWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopStatusAlign: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopStatusBar: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #E3E4EB',
    borderBottom: '1px solid #E3E4EB',
    paddingTop: 15,
    paddingBottom: 15,
  },
  tags: {
    marginTop: 5,
    paddingLeft: 15,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 15,
    color: colors.LIGHT_100,
    borderRadius: 50,
  },
  chipButton: {
    backgroundColor: colors.DANGER_100,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    color: colors.PRIMARY,
    borderRadius: 50,
  },
  overflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    textAlign: 'left',
  },
}));

const ShopDashboard = ({ currentOutlet, setOutletShow, outletShow }) => {
  const classes = useStyles();
  return (
    <Box className={classes.shopWrapper}>
      <Box className={classes.shopInnerWrapper}>
        <Box className={classes.innerWrapper}>
          <Typography variant="body1">{currentOutlet.branch}</Typography>
          <Typography variant="h6" className={classes.overflow} style={{ color: colors.DARK_300 }}>
            {currentOutlet.location.address}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          color={colors.SECONDARY}
          className={classes.chipButton}
          // padding={20}
          onClick={() => setOutletShow(!outletShow)}
        >
          <Typography variant="h6">Change</Typography>
          <ExpandMoreOutlinedIcon style={{ color: colors.SECONDARY }} />
        </Box>
      </Box>

      <Box className={classes.shopStatusBar}>
        <Box className={classes.shopStatusAlign}>
          <Typography variant="h6" style={{ textTransform: 'uppercase' }}>
            Business Type
          </Typography>
          <Typography variant="h6" style={{ marginTop: 5, color: colors.DARK_300 }}>
            {currentOutlet?.businessType}
          </Typography>
        </Box>
        <Box border={`.5px solid ${colors.LIGHT_500}`} height="5vh" />
        <Box className={classes.shopStatusAlign}>
          <Typography variant="h6" style={{ textTransform: 'uppercase' }}>
            Shop Status
          </Typography>
          <Typography
            variant="h6"
            className={classes.tags}
            style={{
              backgroundColor: currentOutlet.shopOnline ? colors.SUCCESS_500 : colors.DANGER_400,
            }}
          >
            {currentOutlet.shopOnline ? 'Open' : 'Close'}
          </Typography>
        </Box>
        <Box border={`.5px solid ${colors.LIGHT_500}`} height="5vh" />
        <Box className={classes.shopStatusAlign}>
          <Typography variant="h6" style={{ textTransform: 'uppercase' }}>
            Services
          </Typography>
          <Typography variant="h6" style={{ marginTop: 6, color: colors.DARK_300 }}>
            {currentOutlet?.pickUpOnly ? 'Pickup' : `Pickup & Delivery`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ShopDashboard;

ShopDashboard.propTypes = {
  currentOutlet: PropTypes.shape(object).isRequired,
  setOutletShow: PropTypes.func.isRequired,
  outletShow: PropTypes.bool.isRequired,
};
