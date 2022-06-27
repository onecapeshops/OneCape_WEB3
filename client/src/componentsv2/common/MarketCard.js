/* eslint-disable camelcase */
import React, { useState } from 'react';
import { Box, Typography, Button as PrimaryButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as colors from '../../uicontants';
import Popup from './Popup';
import MARKETPLACE from '../../images/marketplace.png';

const useStyles = makeStyles(() => ({
  dropCardWrapper: {
    backgroundColor: colors.DARK_400,
    borderRadius: 6,
    marginBottom: 14,
    marginRight: 10,
    width: '47%',
  },
  detailsWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
  },
  dropAvatar: {
    width: '100%',
  },
  showBtn: {
    margin: '0px 22px 10px',
    width: '70%',
    backgroundColor: colors.PRIMARY,
    borderRadius: 6,
    color: colors.LIGHT_100,
  },
}));

const MarketCard = ({ type, history, cardData }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const { name, description, image, token_id } = cardData;

  const handleOnClick = ev => {
    ev.preventDefault();
    if (type === 'rent') {
      setIsOpen(true);
    } else {
      history.push(`/assets/${token_id}`)
    }
  };

  return (
    <Box className={classes.dropCardWrapper}>
      <img src={image} alt="Markey Images" className={classes.dropAvatar} />
      <Box className={classes.detailsWrapper}>
        <Box>
          <Typography variant="body1" style={{ color: colors.LIGHT_100, paddingBottom: 4 }}>
            {name}
          </Typography>
          <Typography
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: colors.LIGHT_100,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
      <PrimaryButton className={classes.showBtn} disableRipple onClick={handleOnClick}>
        <Typography
          variant="body1"
          style={{
            color: colors.LIGHT_100,
          }}
        >
          Show
        </Typography>
      </PrimaryButton>
      {isOpen && (
        <Popup open={isOpen} title="Buy Moonbird" onClose={() => setIsOpen(false)}>
          <Box>
            <img src={MARKETPLACE} alt="Markey Images" className={classes.dropAvatar} />
            <Typography
              variant="h4"
              style={{
                color: colors.LIGHT_100,
                paddingTop: 4,
                textAlign: 'center',
              }}
            >
              Project Name
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: colors.LIGHT_100,
                textAlign: 'center',
                padding: '14px 0',
              }}
            >
              0.04 CAPE
            </Typography>
            <PrimaryButton
              style={{
                width: '100%',
                backgroundColor: colors.PRIMARY,
                borderRadius: 6,
                color: colors.LIGHT_100,
              }}
              disableRipple
              onClick={() => setIsOpen(false)}
            >
              <Typography
                variant="body1"
                style={{
                  color: colors.LIGHT_100,
                }}
              >
                0.04 CAPE
              </Typography>
            </PrimaryButton>
          </Box>
        </Popup>
      )}
    </Box>
  );
};

export default MarketCard;
