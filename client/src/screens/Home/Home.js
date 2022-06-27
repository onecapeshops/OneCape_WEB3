/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, ButtonBase, Avatar, Drawer } from '@material-ui/core';
import PullToRefresh from 'react-simple-pull-to-refresh';
import HomeStyles from './HomeStyles';
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import {
  DashboardSkeleton,
  OutletListingSkeleton,
} from '../../componentsv2/HomeComponents/HomeSkeletons';
import { actions } from '../../actions/index';
import * as colors from '../../uicontants';
import OrderStatus from '../../components/OrderStatus/OrderStatus';
import MobilePlaceholder from '../../componentsv2/MobilePlaceholder';
import Header from '../../componentsv2/common/Header';
import ShopDashboard from '../../componentsv2/HomeComponents/ShopDashboard';
import ShopOffers from '../../componentsv2/HomeComponents/ShopOffers';
import CategorySection from '../../componentsv2/HomeComponents/CategorySection';
import NftSection from '../../componentsv2/HomeComponents/NftSection';
import { getAddress, signText } from "../../helpers/ethers-service"
import { generateChallenge } from '../../helpers/generate-challenge'
import { authenticate } from '../../helpers/authenticate'

const SECURITY = require('../../assets/svg/security.svg');
const COMMUNITY = require('../../assets/svg/community.svg');
const BESTDEALS = require('../../assets/svg/deals.svg');
const PLACEHOLDER = require('../../assets/images/categoryplaceholder.png');

const Home = props => {
  const dispatch = useDispatch();
  const reducer = useSelector(state => state);
  const [outlets, setOutlets] = useState([]);
  const classes = HomeStyles();
  // const [location, setLocation] = useState({});
  const [currentOutlet, setCurrentOutlet] = useState();
  const [outletShow, setOutletShow] = useState(false);
  const [categories, setCategories] = useState();
  const [mobileLog, setMobileLog] = useState(undefined);
  const [offers, setOffers] = useState();

  const {
    account,
    Moralis
  } = useMoralis();

  useEffect(() => {
    const match = window.matchMedia('(max-width: 1024px)');
    setMobileLog(match.matches);
    match.addEventListener('change', e => setMobileLog(e.matches));
  }, []);

  useEffect(() => {
    if (
      reducer &&
      reducer.DashboardReducer.allShopOutlets &&
      !reducer.DashboardReducer.allShopOutlets.length
    ) {
      const ownerNumber = localStorage.getItem('ownerNumber');
      if (ownerNumber) {
        dispatch(actions.getShopOffers(ownerNumber));
      }
      dispatch(actions.getAllShopOutlets());
      if (localStorage.getItem('access-token') && localStorage.getItem('refresh-token')) {
        dispatch(actions.getCustomer());
      }
    }
  }, []);

  useEffect(() => {
    setOutlets(reducer.DashboardReducer.allShopOutlets);
    const off = reducer?.DashboardReducer?.shopOffers;
    if (off.length) {
      const arr = off.filter(sh => sh?.oneCapeShopId === currentOutlet?.oneCapeShopId);
      setOffers(arr);
    }
    if (!currentOutlet && localStorage.getItem('currentoutlet')) {
      const myoutlet = JSON.parse(localStorage.getItem('currentoutlet'));
      setCurrentOutlet(myoutlet);
      dispatch(
        actions.getShopProductsCategory(myoutlet.oneCapeShopId, (response, data) => {
          if (response === 200) {
            if (data && data.length > 0) setCategories(data.slice(0, 8));
            else setCategories('nodata');
            // console.log(data)
          }
        }),
      );
    }
  }, [reducer, categories]);

  useEffect(() => {
    const myOutlet = JSON.parse(localStorage.getItem('currentoutlet'));
    const currentShop =
      outlets && outlets.length
        ? outlets.filter(curOutlet => curOutlet.oneCapeShopId === myOutlet?.oneCapeShopId)
        : [];
    if (currentShop && currentShop.length) {
      localStorage.setItem('currentoutlet', JSON.stringify(currentShop[0]));
      setCurrentOutlet(currentShop[0]);
    }
  }, [outlets]);

  const changeOutlet = shop => {
    setCurrentOutlet(shop);
    localStorage.setItem('currentoutlet', JSON.stringify(shop));
    dispatch(
      actions.getShopProductsCategory(shop.oneCapeShopId, (response, data) => {
        if (response === 200) {
          if (data.length > 0) setCategories(data.slice(0, 8));
          else setCategories('nodata');
          // console.log(data)
        }
      }),
    );
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const lensAuth = async() => {

    try {
      const address = await getAddress();
      const challengeResponse = await generateChallenge(address);
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
  
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(challengeResponse?.data?.challenge?.text);
      const accessTokens = await authenticate(address, signature); 
      localStorage.setItem("accessTokenLens",accessTokens?.data?.authenticate?.accessToken)
            localStorage.setItem("refreshTokenLens",accessTokens?.data?.authenticate?.refreshToken)
    } catch (err) {
      console.log("errr",err)
    }

  }

  // console.log(outlets, 'outlets');
  return mobileLog ? (
    localStorage.getItem('currentoutlet') ? (
      <Box
        height="100vh"
        style={
          outlets?.length && categories?.length ? { overflowY: 'visible' } : { overflowY: 'hidden' }
        }
      >
        <Header />
        <Box display="flex" flex={1}>
          <PullToRefresh onRefresh={handleRefresh} className={classes.pullFrame}>
            <Box display="flex" flexDirection="column">
              {/* page body */}
              <Box marginTop={2} display="flex" flexDirection="column">
                {currentOutlet && Object.keys(currentOutlet).length ? (
                  <ShopDashboard
                    currentOutlet={currentOutlet}
                    setOutletShow={setOutletShow}
                    outletShow={outletShow}
                  />
                ) : (
                  <DashboardSkeleton />
                )}

                {/* offers */}
                {offers && offers?.length ? <ShopOffers offers={offers} /> : <Fragment />}
                <Box className={classes.bannerWrapper}>
                  <img src={BESTDEALS} alt="deals" style={{ padding: 5 }} />
                  <img src={SECURITY} alt="security" />
                </Box>
                <Box style={{
                  display: "flex",
                  flexDirection: "row", 
                  alignItems: "center",
                  marginTop: 10,
                  justifyContent: "space-around"
                }}>
                  <Typography style={{
                    padding: 20,
                    margin: 2,
                    textAlign:"center",
                    backgroundColor: "white",
                    color: colors.PRIMARY,
                    width: "100%"
                  }} onClick={() => props.history.push('/happenings')}>Happenings</Typography>
                  {/* <Typography style={{
                    padding: 20,
                    margin: 2,
                    textAlign:"center",
                    backgroundColor: "white",
                    color: colors.PRIMARY,
                    width: "100%"
                  }} onClick={() => lensAuth()}>Auth Lens</Typography> */}
                  <Typography style={{
                    padding: 20,
                    margin: 2,
                    textAlign:"center",
                    backgroundColor: "white",
                    color: colors.PRIMARY,
                    width: "100%"
                  }} onClick={() => props.history.push('/dao')}>DAO</Typography>
                </Box>
                {/* NFT Marketplace */}
                <Box className={classes.nftWrapper}>
                  <NftSection />
                </Box>
                {/* categories */}
                <CategorySection categories={categories} currentOutlet={currentOutlet} />
                {/* <Box className={classes.bannerWrapper}>
                  <img src={COMMUNITY} alt="community" />
                </Box> */}
              </Box>
              <Box width="100%" height={250} />
            </Box>

            <Drawer
              open={outletShow}
              anchor="bottom"
              style={{ padding: 20 }}
              PaperProps={{
                style: {
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  padding: 10,
                },
              }}
              BackdropProps={{ style: { backdropFilter: 'blur(10px)' } }}
              onBackdropClick={() => setOutletShow(!outletShow)}
            >
              <Typography
                variant="h6"
                style={{
                  textTransform: 'uppercase',
                  padding: 10,
                  fontWeight: 700,
                  color: colors.SECONDARY,
                }}
              >
                Choose Outlet
              </Typography>
              {outlets?.length ? (
                outlets.map(shop => (
                  <ButtonBase
                    style={
                      currentOutlet.oneCapeShopId === shop.oneCapeShopId
                        ? {
                            borderRadius: 15,
                            display: 'flex',
                            width: '100%',
                            border: `2px solid ${colors.DANGER_200}`,
                            filter: shop?.shopOnline ? 'grayscale(0%)' : 'grayscale(100%)',
                            boxShadow: `0px 0px 20px ${colors.DANGER_100}`,
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                          }
                        : {
                            borderRadius: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            filter: shop?.shopOnline ? 'grayscale(0%)' : 'grayscale(100%)',
                            alignItems: 'flex-start',
                            width: '100%',
                            justifyContent: 'flex-start',
                          }
                    }
                    onClick={() => {
                      changeOutlet(shop);
                      setOutletShow(!outletShow);
                    }}
                  >
                    <Box
                      style={{
                        display: 'flex',
                        backgroundColor: colors.LIGHT_100,
                        flexDirection: 'row',
                        width: '100%',
                        borderRadius: 15,
                        alignItems: 'center',
                        borderBottom: `1px solid ${colors.LIGHT_400}`,
                        justifyContent: 'flex-start',
                        padding: 15,
                      }}
                    >
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Avatar
                          src={shop.shopImages?.length ? shop.shopImages[0] : PLACEHOLDER}
                          variant="rounded"
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 10,
                            border: shop?.shopOnline ? `2px solid ${colors.SUCCESS_400}` : 'none',
                          }}
                        />
                        {reducer?.DashboardReducer?.shopOffers?.filter(
                          sh => sh.oneCapeShopId === shop.oneCapeShopId,
                        )?.length ? (
                          <Box
                            style={{
                              backgroundColor: colors.SECONDARY,
                              paddingLeft: 10,
                              paddingRight: 10,
                              borderRadius: 50,
                              marginBottom: -10,
                              color: colors.LIGHT_100,
                            }}
                          >
                            Offer
                          </Box>
                        ) : (
                          <Box />
                        )}
                      </Box>
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          marginLeft: 15,
                        }}
                      >
                        <Typography variant="body1" style={{ textAlign: 'left' }}>
                          {shop.branch}
                        </Typography>
                        <Typography
                          variant="h6"
                          className={classes.overflow}
                          style={{ color: colors.DARK_300 }}
                        >
                          {shop.location.address}
                        </Typography>
                      </Box>
                    </Box>
                  </ButtonBase>
                ))
              ) : (
                <OutletListingSkeleton />
              )}
            </Drawer>
            <OrderStatus {...props} />
          </PullToRefresh>
        </Box>
      </Box>
    ) : (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <Typography
          variant="h6"
          style={{
            textTransform: 'uppercase',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 10,
            borderRadius: 20,
            backgroundColor: colors.DANGER_100,
            fontWeight: 700,
            color: colors.SECONDARY,
          }}
        >
          Choose Outlet
        </Typography>
        {outlets?.length ? (
          outlets.map(shop => (
            <ButtonBase
              style={{
                borderRadius: 15,
                borderBottom: `1px solid ${colors.LIGHT_500}`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
              }}
              onClick={() => {
                changeOutlet(shop);
                setOutletShow(!outletShow);
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: 15,
                }}
              >
                <Avatar
                  src={shop.shopImages?.length ? shop.shopImages[0] : PLACEHOLDER}
                  variant="rounded"
                  style={{ width: 48, height: 48 }}
                />
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginLeft: 15,
                  }}
                >
                  <Typography variant="body1">{shop.branch}</Typography>
                  <Typography
                    variant="h6"
                    className={classes.overflow}
                    style={{ color: colors.DARK_300 }}
                  >
                    {shop.location.address}
                  </Typography>
                </Box>
              </Box>
            </ButtonBase>
          ))
        ) : (
          <OutletListingSkeleton />
        )}
        <OrderStatus {...props} />
      </Box>
    )
  ) : mobileLog === false ? (
    <MobilePlaceholder />
  ) : (
    <Fragment />
  );
};

export default Home;
