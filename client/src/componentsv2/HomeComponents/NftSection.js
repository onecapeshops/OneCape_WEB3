import React, { useState } from 'react';
// import PropTypes, { array, object } from 'prop-types';
import { Box, Typography, makeStyles, Button as PrimaryButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import * as colors from '../../uicontants';
import NFT_BG from '../../images/nft_bg.png';
import NFT_TOKEN from '../../images/nftToken.png';

const useStyles = makeStyles(() => ({
    nftSection: {
        backgroundImage: `url(${NFT_BG})`,
        height: 175,
        imageRendering: 'pixelated',
        padding: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shopName: {
        fontSize: 20,
        fontWeight: 600,
        color: colors.LIGHT_100,
    },
    timerWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    countName: {
        fontSize: 10,
        fontWeight: 400,
        color: colors.LIGHT_100,
    },
    countdown: {
        fontSize: 24,
        fontWeight: 400,
        color: colors.LIGHT_100,
    },
    pointer: {
        fontSize: 24,
        fontWeight: 400,
        color: colors.LIGHT_100,
        padding: '0 4px',
        marginTop: 38,
    },
    dateTimeSection: {
        color: colors.LIGHT_100,
        marginTop: -22,
    },
}));

const NftSection = () => {
    const classes = useStyles();
    const history = useHistory();
    const [timeEnded, setTimeEnded] = useState(true);

    return (
        <Box className={classes.nftSection}>
            <Box>
                <Box>
                    <Typography variant="h6" style={{ color: colors.LIGHT_100 }}>
                        NFT Marketplace
                    </Typography>
                    <Typography className={classes.shopName}>Onecape Demo Dev</Typography>
                </Box>
                {timeEnded ? (
                    <PrimaryButton
                        style={{
                            backgroundColor: colors.PRIMARY,
                            borderRadius: 2,
                            paddingLeft: 20,
                            color: colors.LIGHT_100,
                            paddingRight: 20,
                            marginTop: 16
                        }}
                        disableRipple
                        onClick={() => history.push('/collections')}
                    >
                        <Typography style={{
                            fontSize: 10,
                            fontWeight: 500
                        }}>View All</Typography>
                    </PrimaryButton>
                ) : (
                    <>
                        <Box className={classes.timerWrapper}>
                            <Box>
                                <Typography className={classes.countName}>DAYS</Typography>
                                <Typography className={classes.countdown}>01</Typography>
                            </Box>
                            <p className={classes.pointer}>:</p>
                            <Box className={classes.countdown}>
                                <Typography className={classes.countName}>HOURS</Typography>
                                <Typography className={classes.countdown}>02</Typography>
                            </Box>
                            <p className={classes.pointer}>:</p>
                            <Box className={classes.countdown}>
                                <Typography className={classes.countName}>MINUTES</Typography>
                                <Typography className={classes.countdown}>02</Typography>
                            </Box>
                            <p className={classes.pointer}>:</p>
                            <Box className={classes.countdown}>
                                <Typography className={classes.countName}>SECOND</Typography>
                                <Typography className={classes.countdown}>43</Typography>
                            </Box>
                        </Box>
                        <Typography variant="body2" className={classes.dateTimeSection}>
                            May 24 Thu 09:30 PM
                        </Typography>
                    </>
                )}
            </Box>
            <Box>
                <img src={NFT_TOKEN} alt="NFT Token" />
            </Box>
        </Box>
    );
};

export default NftSection;
