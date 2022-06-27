/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useMoralis } from 'react-moralis';
import { useSelector } from 'react-redux';
import { Box, IconButton, Typography, Button } from '@material-ui/core';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import AssetStyles from './AssetStyles';
import COINS from '../../images/Coins.png';
import * as colors from '../../uicontants';
import Loader from '../../components/Loader';
import ApolloNFT from '../../apollo/apolloNft';
import * as api from '../../constants/api';
import onecapeContractAbi from '../../contracts_abi/marketplaceContractAbi.json';
import marketplaceContract from "../../contract_address/marketplaceContract.json"

import tokenContract from "../../contract_address/tokenContract.json"
import token_abi from "../../contracts_abi/token_abi.json"
import staking from '../../contract_address/staking.json';
import stacking_abi from '../../contracts_abi/staking_abi.json';

const Assets = () => {
  const classes = AssetStyles();
  const { abi } = onecapeContractAbi;
  const history = useHistory();
  const { token_id } = useParams();
  const nftData = useSelector(state => state.DashboardReducer.nftData);
  const [assetData, setAssetData] = useState();
  const [otherData, setOtherData] = useState();
  const [balance, setBalance] = useState([]);
  const [loader, setLoader] = useState(true);
  const { account, Moralis } = useMoralis();

  async function call() {
    const response = await ApolloNFT.query(api.MARKETPLACE, { id: token_id }).toPromise();
    if (response.data?.marketplace) {
      setAssetData(response.data.marketplace);
      const filteredData = nftData.filter(item => item.token_id == response.data.marketplace.id);
      if (filteredData.length) {
        setTimeout(() => {
          if (filteredData[0]?.image) {
            setLoader(false);
          }
        }, 3000);
        setOtherData(filteredData[0]);
      } else {
        setLoader(false);
        history.push('/collections')
      }
    }
  }

  useEffect(() => {
    call();
    const allERC20Tokens = async () => {
      if (account) {
        const options = {
          chain: 'mumbai',
          address: account,
        };
        const balances = await Moralis.Web3API.account.getTokenBalances(options);
        const filterBalance = balances.filter(item => item.symbol === 'CTEST');
        setBalance(filterBalance);
      }
    };
    allERC20Tokens();
  }, []);

  const callCustomContract = async () => {
    // ******* token approval before stacking ********
    // if (account) {
    //   const web3 = await Moralis.enableWeb3();
    //   const ABI = token_abi.abi;

    //   const writeOptions = {
    //     contractAddress: tokenContract['0x13881'],
    //     functionName: 'approve',
    //     abi: ABI,
    //     params: { spender: marketplaceContract['0x13881'], amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935' },
    //     // use only mint func
    //     // msgValue: Moralis.Units.ETH("0.01"),
    //   };

    //   const transaction = await Moralis.executeFunction(writeOptions);
    //   console.log(transaction.hash);

    //   await transaction.wait();
    // }
    if (account) {
      const web3 = await Moralis.enableWeb3();
      const ABI = abi;

      const writeOptions = {
        contractAddress: '0xCBc24fCEA1F780824378CfF806c543e5F07129B6',
        functionName: 'purchaseItem',
        abi: ABI,
        params: { _listingId: assetData.offeringId },
        // use only mint func
        // msgValue: Moralis.Units.ETH("0.01"),
      };

      const transaction = await Moralis.executeFunction(writeOptions);
      // console.log(transaction.hash);

      await transaction?.wait();
    }
  };

  return (
    <Box className={classes.assetWrapper}>
      <Box className={classes.imageWrapper}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceOutlinedIcon style={{ color: colors.LIGHT_100 }} />
        </IconButton>
      </Box>
      {loader ? (
        <Loader />
      ) : (
        <Box className={classes.bodyWrapper}>
          <Box className={classes.imageContent}>
            <img src={otherData?.image} alt="Drop Images" className={classes.dropAvatar} />
            <Typography className={classes.nftName}>{otherData?.name}</Typography>
            <Typography variant="h6" style={{ color: colors.LIGHT_100 }}>
              {assetData?.owner}
            </Typography>
            <Typography className={classes.nftDesc} variant="body2">
              {otherData?.description}
            </Typography>
            <img src={COINS} alt="Drop Images" />
            <Typography className={classes.nftRate}>{`${assetData?.amount} CAPE`}</Typography>
            <Typography variant="h6" style={{ color: colors.LIGHT_100 }}>
              Current Price
            </Typography>
            <Button
              className={classes.actionBtn}
              disabled={balance.length === 0}
              disableRipple
              onClick={callCustomContract}
            >
              <Typography
                variant="body1"
                style={{
                  color: colors.LIGHT_100,
                }}
              >
                Buy NFT
              </Typography>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Assets;
