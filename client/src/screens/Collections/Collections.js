/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMoralis } from 'react-moralis';
import { Box, IconButton, Typography, Tabs, Tab } from '@material-ui/core';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import DropCard from '../../componentsv2/common/DropCard';
import MarketCard from '../../componentsv2/common/MarketCard';
import CollectionStyles from './CollectionStyles';
import * as colors from '../../uicontants';
import * as types from '../../constants/actionTypes';
import ApolloNFT from '../../apollo/apolloNft';
import * as api from '../../constants/api';
import alterContractAbi from '../../contracts_abi/marketplaceContractAbi.json';

const Collections = (props) => {
  const classes = CollectionStyles();
  const { abi } = alterContractAbi;
  const history = useHistory();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [nftDrops, setNftDrops] = useState([]);
  const [marketPlaceList, setMarketPlaceList] = useState([]);
  const [data, setData] = useState();
  const { user, account, Moralis } = useMoralis();

  const readJsonData = (url) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        setData(myJson);
      });
  };

  async function call() {
    const response = await ApolloNFT.query(api.TOKENS).toPromise();
    if (response.data.tokens?.length) {
      response.data.tokens.map((item) => readJsonData(item.tokenURI));
    }
    dispatch({
      type: types.NFT_DATA,
      nftData: response.data.tokens,
    });
  }

  useEffect(() => {
    call();
  }, []);

  useEffect(() => {
    if (data) {
      setMarketPlaceList([...marketPlaceList, data]);
      dispatch({
        type: types.NFT_DATA,
        nftData: [...marketPlaceList, data],
      });
    }
  }, [data]);

  const handleChange = (ev, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Call custom Read contract

    const callCustomContract = async () => {
      if (account) {
        const web3 = await Moralis.enableWeb3();
        const ABI = abi;

        const readName = {
          contractAddress: '0xCBc24fCEA1F780824378CfF806c543e5F07129B6',
          functionName: 'name',
          abi: ABI,
        };

        const nftName = await Moralis.executeFunction(readName);

        const readMaxSupply = {
          contractAddress: '0xCBc24fCEA1F780824378CfF806c543e5F07129B6',
          functionName: 'maxSupply',
          abi: ABI,
        };

        const nftSupply = await Moralis.executeFunction(readMaxSupply);

        const readNftCirculation = {
          contractAddress: '0xCBc24fCEA1F780824378CfF806c543e5F07129B6',
          functionName: 'nftsInCirculation',
          abi: ABI,
        };

        const nftCirculation = await Moralis.executeFunction(readNftCirculation);
        if (nftName) {
          setNftDrops([
            {
              name: nftName,
              supply: nftSupply,
              circulation: nftCirculation,
            },
          ]);
        }
      }
    };
    callCustomContract();
  }, [account, user]);

  return (
    <>
      {!(props?.wallet === true) ? (
        <Box className={classes.collectionWrapper}>
          <Box className={classes.headerWrapper}>
            <IconButton onClick={() => history.push('/')}>
              <KeyboardBackspaceOutlinedIcon style={{ color: colors.LIGHT_100 }} />
            </IconButton>
            <Typography className={classes.shopName}>Onecape Demo Dev</Typography>
          </Box>
          <Box>
            <Tabs centered value={value} onChange={handleChange} className={classes.tabs}>
              <Tab className={classes.tab} label="NFT Drops" />
              <Tab className={classes.tab} label="Marketplace" />
              <Tab className={classes.tab} label="For Rent" />
            </Tabs>
          </Box>
        </Box>
      ) : (
        <></>
      )}

      {props.wallet === true && marketPlaceList.length? (
        <Box className={classes.marketSection}>
          {marketPlaceList.map((item) => (
            <MarketCard history={history} cardData={item} />
          ))}
        </Box>
      ) : null}

      {!props?.wallet ? (
        <>
          {nftDrops.length && value === 0 ? (
            <Box className={classes.dropSection}>
              {nftDrops.map((list) => (
                <DropCard cardData={list} image={marketPlaceList} />
              ))}
            </Box>
          ) : null}
          {marketPlaceList.length && value === 1 ? (
            <Box className={classes.marketSection}>
              {marketPlaceList.map((item) => (
                <MarketCard history={history} cardData={item} />
              ))}
            </Box>
          ) : null}
          {value === 2 ? <Box className={classes.rentSection}>No Data Found</Box> : null}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Collections;
