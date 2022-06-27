import React, { useState } from 'react';
import PropTypes, { array } from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import { ReactSVG } from 'react-svg';
import { autoPlay } from 'react-swipeable-views-utils';
import * as colors from '../../uicontants';

const OFFERS = require('../../assets/svg/Offers.svg');

const useStyles = makeStyles(() => ({
  shopOfferWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.LIGHT_100,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  offerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerInnerWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    border: `1px solid ${colors.LIGHT_500}`,
    borderRadius: 10,
    padding: 6,
    paddingLeft: 12,
    paddingTop: 12,
  },
  offerStyles: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },
}));

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ShopOffers = ({ offers }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box className={classes.shopOfferWrapper}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        style={{ width: '100%' }}
        onChangeIndex={step => setActiveStep(step)}
      >
        {offers.map((step, index) => (
          <div key={step.id} className={classes.offerWrapper}>
            {Math.abs(activeStep - index) < offers.length ? (
              <Box className={classes.offerInnerWrapper}>
                <ReactSVG src={OFFERS} />
                <Box className={classes.offerStyles}>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '95%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography variant="h6">
                      {step.validity} {step.validityType} Left
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    style={{ color: colors.DARK_300 }}
                    className={classes.overflowSingle}
                  >
                    {step.body}
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  );
};

export default ShopOffers;

ShopOffers.propTypes = {
  offers: PropTypes.shape(array).isRequired,
};
