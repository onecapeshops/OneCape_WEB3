import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import {useHistory} from "react-router-dom"
import moment from 'moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { DARK_300, DARK_100, DANGER_100, PRIMARY, LIGHT_100, LIGHT_500 } from '../../uicontants';
import onecapeContractAbi from '../../contracts_abi/governance_abi.json';
import contractAddress from "../../contract_address/governanceContract.json"
import Loader from '../../components/Loader';

const ProposalCards = ({details}) => {
    const history = useHistory()
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 15,
        margin: 4,
        borderRadius: 10,
        border: `1px solid ${DARK_100}`,
      }}
      onClick={() => {
        history.push('/daodetails')
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography style={{ fontWeight: 'bold', width: '80%', textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>Propsal #1</Typography>
        <Typography
          style={{
            fontSize: 12,
            padding: 5,
            background: DANGER_100,
            color: PRIMARY,
            borderRadius: 50,
          }}
        >
          {details.isCompleted ? "Closed" : "Active"}
        </Typography>
      </Box>
      <Typography style={{ color: DARK_300, marginTop: 10, marginBottom: 10 }}>
        {details.description}
      </Typography>
      <Typography style={{ color: DARK_300, fontSize: 12 }}>{moment.unix(details.proposalTime).format("MMM Do YY")}</Typography>
    </Box>
  );
};

const Dao = () => {
  const { abi } = onecapeContractAbi;
  const [activeTab, setActiveTab] = useState(0);
  const [balance, setBalance] = useState([]);
  const [proposal, setProposal] = useState([])
  const history = useHistory()
  const [] = useState();
  const dispatch = useDispatch();
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

  // async function call(){
  //     const data = await ApolloWeb3.query(api.MARKETPLACE, {id: 2}).toPromise()
  //     console.log(data)
  // }

  useEffect(() => {
    // Call custom READ with params in contract

    const callCustomContract = async () => {
      if (account) {
        const web3 = await Moralis.enableWeb3();
        const ABI = abi;

        const readOptions = {
          contractAddress: contractAddress['0x13881'],
          functionName: 'getProposalDetails',
          abi: ABI,
          params: { id: 1 },
        };

        const details = await Moralis.executeFunction(readOptions);
        if(details?.length){
            setProposal([{
                description: details['description'],
                isCompleted: details['isCompleted'],
                proposalId: details['proposalId'],
                proposalTime: details['proposalTime'],
                proposer: details['proposer']
            }])
        }
      }
    };
    callCustomContract();
  }, [account, user]);

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [account, user, isAuthenticated, isInitialized, isWeb3Enabled]);

  useEffect(() => {
    // Call all erc 20 token in wallet
    const allERC20Tokens = async () => {
      if (account) {
        const options = {
          chain: 'mumbai',
          address: account,
        };
        const balances = await Moralis.Web3API.account.getTokenBalances(options);
        let filtered = balances.filter(
          (balance) => balance.token_address === '0xbe6531e4be6121f0618a76483e966cbde4a57e30',
        );
        // console.log(filtered);
        if (filtered?.length === 0) {
          setBalance({ balance: 0 });
        } else {
          setBalance(filtered[0]);
        }
      }
    };
    allERC20Tokens();
  }, [account, user]);

  return Object.keys(balance)?.length > 0 ? (
    <>
    <div style={{
      height: '100vh',
      
    }}>
    <IconButton style={{position: "absolute", top: 4, left: 4}} onClick={() => history.push('/')}>
          <ArrowBackIcon />
        </IconButton>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            width: '100%'
        }}>

        <img src={require("../../images/banner.png")} height={100} width="100%" />
        <img src={require("../../images/cape.png")} height={100} style={{marginTop: -40}} />
        <Typography variant="h2" style={{ fontWeight: 'bold', marginTop: 10 }}>
              Onecape DAO
            </Typography>
        </div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: "100%",
          marginTop: 20
        }}
      >
        <Box
          style={{
            borderBottom: activeTab === 0 ? `2px solid ${PRIMARY}` : `1px solid white`,
            background: `linear-gradient(${LIGHT_100}, ${LIGHT_500})`,
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
          onClick={() => setActiveTab(0)}
        >
          <Typography>Proposals</Typography>
        </Box>
        <Box
          style={{
            borderBottom: activeTab === 1 ? `2px solid ${PRIMARY}` : `1px solid white`,
            background: `linear-gradient(${LIGHT_100}, ${LIGHT_500})`,
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
          onClick={() => setActiveTab(1)}
        >
          <Typography>New Proposal</Typography>
        </Box>
      </Box>
      <SwipeableViews
        onChangeIndex={(e) => {
          setActiveTab(e);
        }}
        style={{ height: '100vh'}}
      >
        {activeTab === 0 ? <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: "100%"
          }}
        >
          {proposal.map((prop) => (
            <ProposalCards details={prop} />
          ))}
        </Box>
        : <Box
          style={{
            position: 'relative',
            height: "80vh"
          }}
        >
          <Box
            style={{
              position: 'absolute',
              background: 'rgba(0,0,0,0.8)',
              width: '100%',
              zIndex: 100,
              height: '100vh',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
              }}
            >
              <Typography variant="h2" style={{ fontWeight: 'bold', color: 'white' }}>
                Unlock Proposal Access
              </Typography>
              <Typography
                variant="h4"
                style={{ color: 'white', textAlign: 'center', width: '80%', marginTop: 10 }}
              >
                Your need to own atleaset 100 Cape coins to submit your new proposal
              </Typography>
            </div>
          </Box>
          <Box
            style={{
              display: 'flex',
              padding: 20,
              flexDirection: 'column',
            }}
          >
            <Typography variant="h2" style={{ fontWeight: 'bold' }}>
              Create new Proposal
            </Typography>

            <TextField style={{ marginTop: 10 }} placeholder="Title" />
            <TextField
              type="textarea"
              multiline
              rows={4}
              name="description"
              style={{ marginTop: 20 }}
              placeholder="Description"
            />
            <Button variant="contained" color="secondary" size="small" style={{ marginTop: 10 }}>
              Submit
            </Button>
          </Box>
        </Box>}
      </SwipeableViews>
    </div>
    </>
  ) : (
    <Loader />
  );
};

export default Dao;
