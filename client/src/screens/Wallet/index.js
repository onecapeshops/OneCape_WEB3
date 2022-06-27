/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { Button, IconButton, Typography, Avatar, Box, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles } from '@material-ui/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { useHistory } from 'react-router-dom';
import staking from '../../contract_address/staking.json';
import stacking_abi from '../../contracts_abi/staking_abi.json';
import * as colors from '../../uicontants';
import WalletStyles from './WalletStyles';
import { PRIMARY } from '../../uicontants';
import Loader from '../../components/Loader';
import Collections from '../Collections/Collections';

const walletStylesComponent = makeStyles(WalletStyles);

const Wallet = () => {
  const [copied, setCopied] = useState(false);
  const classes = walletStylesComponent();
  const [activeTab, setActiveTab] = useState(0);
  const history = useHistory();
  const [balance, setBalance] = useState([]);
  const [coins, setCoins] = useState([]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const { abi } = stacking_abi;

  const {
    authenticate,
    isWeb3Enabled,
    isWeb3EnableLoading,
    isAuthenticated,
    user,
    isInitialized,
    account,
    enableWeb3,
    web3,
    logout,
    Moralis,
  } = useMoralis();

  //   useEffect(() => {
  //     if (!isWeb3Enabled) {
  //       enableWeb3();
  //     }
  //   }, [account, user, isAuthenticated, isInitialized, isWeb3Enabled]);

  const cliboard = (acc) => {
    navigator.clipboard.writeText(acc).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 4000);
    });
  };

  useEffect(() => {
    // Call all erc 20 token in wallet
    const allERC20Tokens = async () => {
      if (account) {
        const options = {
          chain: 'mumbai',
          address: account,
        };
        const balances = await Moralis.Web3API.account.getTokenBalances(options);
        const filtered = balances.filter(
          (balance) => balance.token_address === '0xbe6531e4be6121f0618a76483e966cbde4a57e30',
        );
        if (filtered?.length === 0) {
          setBalance({ balance: 0 });
        } else {
          setBalance(filtered[0]);
        }
      }
    };
    allERC20Tokens();
  }, [account, user]);

  const callCustomContract = async () => {
    // ******* token approval before stacking ********
    // if (account) {
    //   const web3 = await Moralis.enableWeb3();
    //   const ABI = token_abi.abi;

    //   const writeOptions = {
    //     contractAddress: tokenContract['0x13881'],
    //     functionName: 'approve',
    //     abi: ABI,
    //     params: { spender: staking['0x13881'], amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935' },
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
        contractAddress: staking['0x13881'],
        functionName: 'depositTokens',
        abi: ABI,
        params: { amount },
        // use only mint func
        // msgValue: Moralis.Units.ETH("0.01"),
      };

      const transaction = await Moralis.executeFunction(writeOptions);
      // console.log(transaction.hash);

      await transaction.wait();
    }
  };

    

  useEffect(() => {
    // Call my Native balances
    const getNativeTokenbalance = async () => {
      if (account) {
        const options = {
          chain: 'mumbai',
          address: account,
        };
        const balances = await Moralis.Web3API.account.getNativeBalance(options);
        // console.log('..........', balances);
        setCoins(balances);
        // console.log('native balances', balances);
      }
    };
    getNativeTokenbalance();
  }, [account, user]);

  if (!(isAuthenticated || account)) {
    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
          justifyContent: 'space-around',
        }}
      >
        <Typography variant="h2" color="primary" style={{ fontWeight: 'bold' }}>
          Onecape Wallet
        </Typography>
        <Button
          style={{
            border: '1px solid gray',
            borderRadius: 10,
            marginTop: 10,
            padding: '10px 30px 10px 30px',
          }}
          onClick={() => {
            enableWeb3();
          }}
        >
          Connect with Metamask
        </Button>
        {/* <Box style={{
                  display: "flex",
                  width: "80%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
              }}> */}
        {/* <Box onClick={() => history.push('/policy')}>Terms & services</Box> */}
        <Box onClick={() => history.push('/policy')}>Privacy Policy</Box>
        {/* </Box> */}
      </Box>
    );
  }

  return balance && Object.keys(balance)?.length && coins && Object.keys(coins)?.length ? (
    <>
      {open && (
        <Box
          style={{
            position: 'absolute',
            background: 'rgba(0,0,0,0.8)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            height: '100vh',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              width: '90%',
            }}
          >
            <Typography variant="h1" style={{ fontWeight: 'bold', fontSize: 48 }}>
              ${balance.balance / 1e18}
            </Typography>
            <Typography>$CAPE</Typography>
            <TextField
              variant="filled"
              onChange={(e) => setAmount(e.target.value)}
              style={{ marginTop: 10, width: '100%' }}
              placeholder="Coins"
            />
            <Button
              variant="contained"
              color="secondary"
              style={{
                // border: "1px solid gray",
                width: '100%',
                marginTop: 10,
                borderRadius: 10,
                padding: '10px 20px 10px 20px',
              }}
              disabled={amount === 0}
              onClick={() => {
                callCustomContract();
              }}
            >
              Stake Coins
            </Button>
            <Button
              style={{
                border: '1px solid gray',
                width: '100%',
                marginTop: 10,
                borderRadius: 10,
                padding: '10px 20px 10px 20px',
              }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '40vh',
          background: PRIMARY,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            color: 'white',
            padding: 20,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h3" style={{ fontWeight: 'bold' }}>
            Onecape Wallet
          </Typography>
          <IconButton
            onClick={() => {
              logout();
              history.push('/profile');
            }}
          >
            <ExitToAppIcon style={{ color: 'white' }} />
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            marginTop: 20,
            justifyContent: 'center',
          }}
        >
          <Typography variant="h1" style={{ fontWeight: 'bold', fontSize: 48 }}>
            ${balance && Object.keys(balance)?.length ? Number(balance.balance) / 1e18 : ''}
          </Typography>
          <Typography>Balance</Typography>
        </div>
        <Button
          style={{
            background: 'white',
            marginTop: 20,
            borderRadius: 10,
            marginBottom: 10,
            padding: '10px 30px 10px 30px',
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <MonetizationOnIcon />
          Stake $Cape
        </Button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            color: 'white',
            justifyContent: 'center',
            padding: 10,
            margin: 10,
            background: 'rgba(0,0,0,0.1)',
          }}
          onClick={() => {
            cliboard(account);
          }}
        >
          <Typography variant="h6">{account}</Typography>

          {copied ? (
            <CheckCircleIcon style={{ marginLeft: 10 }} />
          ) : (
            <FileCopyIcon style={{ marginLeft: 10 }} />
          )}
        </div>
      </div>
      <Box className={classes.container}>
        <Box className={classes.bodyWrapper}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box
              style={{
                borderBottom: activeTab === 0 ? `2px solid ${colors.PRIMARY}` : `1px solid white`,
                background: `linear-gradient(${colors.LIGHT_100}, ${colors.LIGHT_500})`,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              onClick={() => setActiveTab(0)}
            >
              <Typography>NFT</Typography>
            </Box>
            <Box
              style={{
                borderBottom: activeTab === 1 ? `2px solid ${colors.PRIMARY}` : `1px solid white`,
                background: `linear-gradient(${colors.LIGHT_100}, ${colors.LIGHT_500})`,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              onClick={() => setActiveTab(1)}
            >
              <Typography>Coins</Typography>
            </Box>
            <Box
              style={{
                borderBottom: activeTab === 2 ? `2px solid ${colors.PRIMARY}` : `1px solid white`,
                background: `linear-gradient(${colors.LIGHT_100}, ${colors.LIGHT_500})`,
                padding: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              onClick={() => setActiveTab(2)}
            >
              <Typography>Activity</Typography>
            </Box>
          </Box>
          <SwipeableViews
            onChangeIndex={(e) => {
              setActiveTab(e);
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {activeTab === 0 ? <>
              <Collections wallet={true} />
              </> : <></>}
              {
                activeTab === 1 && (
                  // coins.map(() => (
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 4px',
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${colors.DARK_100}`,
                      margin: '0 10px',
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar style={{ color: colors.DARK_500, backgroundColor: 'transparent' }}>
                        <img
                          src={require('../../images/matic.png')}
                          style={{ width: 24, height: 20 }}
                        />
                      </Avatar>
                      <Typography variant="body1" style={{ paddingLeft: 10 }}>
                        Matic
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        background: colors.LIGHT_300,
                        borderRadius: 5,
                        padding: '8px 20px',
                      }}
                    >
                      {coins.balance / 1e18}
                    </Box>
                  </Box>
                )
                // ))
              }
            </Box>
          </SwipeableViews>
        </Box>
      </Box>
    </>
  ) : (
    <Loader />
  );
};

export default Wallet;
