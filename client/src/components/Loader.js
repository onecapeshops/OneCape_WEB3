import React from 'react';
import { Box } from '@material-ui/core';
import Lottie from 'lottie-react';

const Animate = require('../assets/json/loader.json');

const Loader = () => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        height: 'auto',
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Lottie width={20} height={20} animationData={Animate} loop autoPlay />
    </Box>
  );
};

export default Loader;
