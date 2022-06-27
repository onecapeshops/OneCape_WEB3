/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Box, Typography, Button as PrimaryButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as colors from '../../uicontants';
import alterContractAbi from '../../contracts_abi/marketplaceContractAbi.json';

const useStyles = makeStyles(() => ({
  dropCardWrapper: {
    backgroundColor: colors.DARK_400,
    borderRadius: 6,
    marginBottom: 14,
  },
  detailsWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between'
  },
  dropAvatar: {
    width: '100%',
  },
}));

const DropCard = ({ cardData, image }) => {
  const classes = useStyles();
  const { name, supply, circulation } = cardData;
  const [dropImg, setDropImg] = useState();
  const { abi } = alterContractAbi;
  const {
    account,
    Moralis,
  } = useMoralis();

  useEffect(() => {
    if (image.length) {
      setDropImg(image[0].image);
    }
  }, [image]);

  const callCustomContract = async () => {
    if (account) {
      const web3 = await Moralis.enableWeb3();
        const ABI = abi;

        const writeOptions = {
          contractAddress: '0xCBc24fCEA1F780824378CfF806c543e5F07129B6',
          functionName: 'mint',
          abi: ABI,
          params: { mintAmount: 1 },
          // use only mint func
          msgValue: Moralis.Units.ETH("0.01"),
        };

        const transaction = await Moralis.executeFunction(writeOptions);
        // console.log(transaction.hash);

        await transaction.wait();
        // console.log('write func');
    }
  };

  return (
    <Box className={classes.dropCardWrapper}>
      <img src={dropImg} alt="Drop Images" className={classes.dropAvatar} />
      <Box className={classes.detailsWrapper}>
        <Box>
          <Typography variant="body1" style={{ color: colors.LIGHT_100, paddingBottom: 4 }}>
            {name}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          style={{
            color: colors.LIGHT_100,
            border: `0.5px solid ${colors.LIGHT_100}`,
            padding: '6px 18px',
            borderRadius: 5,
          }}
        >
          {`#${circulation}/${supply}`}
        </Typography>
      </Box>
      <PrimaryButton
        style={{
          backgroundColor: colors.PRIMARY,
          borderRadius: 6,
          color: colors.LIGHT_100,
          paddingRight: 20,
          margin: '0px 12px 10px',
          width: '93%',
        }}
        disableRipple
        onClick={callCustomContract}
      >
        <Typography
          variant="body1"
          style={{
            color: colors.LIGHT_100,
          }}
        >
          Buy NFT - 0.01
        </Typography>
      </PrimaryButton>
    </Box>
  );
};

export default DropCard;
