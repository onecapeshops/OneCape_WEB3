import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { ReactSVG } from 'react-svg';
import * as colors from '../uicontants';

const PLACEHOLDER = require('../assets/svg/mobile_placeholder.svg');

const MobilePlaceholder = () => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <ReactSVG src={PLACEHOLDER} />
      <Typography
        variant="h4"
        style={{
          marginTop: 20,
          textAlign: 'center',
          color: colors.DARK_300,
          lineHeight: 2.0,
        }}
      >
        Open in mobile to get best <br /> experience from this application
      </Typography>
    </Box>
  );
};

export default MobilePlaceholder;
