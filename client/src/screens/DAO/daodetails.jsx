import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { Box, Typography, TextField, Button, Input, IconButton } from '@material-ui/core';
import {
  DARK_300,
  DARK_100,
  DANGER_100,
  PRIMARY,
  LIGHT_100,
  LIGHT_500,
  LIGHT_300,
} from '../../uicontants';
import onecapeContractAbi from '../../contracts_abi/governance_abi.json';
import useBiconomyContext from '../../hooks/useBiconomyContext';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import contractAddress from '../../contract_address/governanceContract.json';
import Loader from '../../components/Loader';

const DaoDetails = () => {
  const { abi } = onecapeContractAbi;
  const [details, setDetails] = useState();
  const history = useHistory();
  const [proposal, setProposal] = useState();
  const [balance, setBalance] = useState();
  const [ratio, setRatio] = useState();
  const { isBiconomyInitialized } = useBiconomyContext();

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

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [account, user, isAuthenticated, isInitialized, isWeb3Enabled]);

  useEffect(() => {
    // Call custom READ with params in contract
    const callCustomContract = async () => {
      if (account) {
        const web3 = await Moralis.enableWeb3();
        const ABI = abi;

        const readOptions = {
          contractAddress: contractAddress['0x13881'],
          functionName: 'proposalVotes',
          abi: ABI,
          params: {
            proposalId:
              '33289279896092614107777504333854173355465234391212982656060795743444584601784',
          },
        };

        const details = await Moralis.executeFunction(readOptions);
        setDetails({
          againstVotes: details['againstVotes'],
          forVotes: details['forVotes'],
        });
        setRatio(details['againstVotes'] / 1e18 + details['forVotes'] / 1e18)
      }
    };
    callCustomContract();
  }, [account, user]);

  useEffect(() => {
    // Call all erc 20 token in wallet
    const allERC20Tokens = async () => {
      // console.log('>>>>>>>>>>>>>>', account);
      if (account) {
        const options = {
          chain: 'mumbai',
          address: account,
        };
        const balances = await Moralis.Web3API.account.getTokenBalances(options);
        let filtered = balances.filter(
          (balance) => balance.token_address === '0xbe6531e4be6121f0618a76483e966cbde4a57e30',
        );
        // console.log('filtered', filtered);
        if (filtered?.length === 0) {
          setBalance({ balance: 0 });
        } else {
          setBalance(filtered[0]);
        }
      }
    };
    allERC20Tokens();
  }, []);

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
        if (details?.length) {
          setProposal({
            description: details['description'],
            isCompleted: details['isCompleted'],
            proposalId: details['proposalId'],
            proposalTime: details['proposalTime'],
            proposer: details['proposer'],
          });
        }
        // console.log('custommmmmmm22222', details);
      }
    };
    callCustomContract();
  }, [account, user]);

  const voteContract = async (vote) => {
    if (account && isBiconomyInitialized) {
      
      const web3 = await Moralis.enableWeb3();
      const ABI = abi;

      const writeOptions = {
        contractAddress: contractAddress['0x13881'],
        functionName: 'castVote',
        abi: ABI,
        params: { proposalId: '33289279896092614107777504333854173355465234391212982656060795743444584601784', support: vote },
        // use only mint func
        // msgValue: Moralis.Units.ETH("0.01"),
      };

      const transaction = await Moralis.executeFunction(writeOptions);
      // console.log(transaction.hash);

      await transaction.wait();
      // console.log('write func', details);

      // console.log('contract', 'isBiconomyInitialized', isBiconomyInitialized);
      // let tx = governanceContract.methods.castVote(1, vote).send({
      //   from: account || user?.get('ethAddress'),
      //   signatureType: governanceProvider['EIP712_SIGN'],
      // });
      // tx.on('transactionHash', function () {})
      //   .once('confirmation', function (transactionHash) {
      //     window.location.reload();
      //     console.log('==>', transactionHash);
      //   })
      //   .on('error', function (e) {
      //     console.log('error', e);
      //   });
      // // setOneTime(true);
    }
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          padding: 10,
          borderBottom: '1px solid gray',
        }}
      >
        <IconButton style={{}} onClick={() => history.push('/dao')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography>Dao Details</Typography>
      </Box>
      {proposal &&
      Object.keys(proposal)?.length > 0 &&
      details &&
      Object.keys(details)?.length > 0 ? (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 15,
            margin: 4,
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              style={{
                fontWeight: 'bold',
              }}
            >
              {`Proposal #1`}
            </Typography>
            <Typography
              style={{
                fontSize: 12,
                padding: 5,
                background: DANGER_100,
                color: PRIMARY,
                borderRadius: 50,
              }}
            >
              {proposal.isCompleted ? 'Closed' : 'Active'}
            </Typography>
          </Box>
          <p style={{ marginTop: 20 }}>Description</p>
          <Typography style={{ color: DARK_300, marginBottom: 10 }}>
            {proposal.description}
          </Typography>
          <Box style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 10,
            alignItems: "center",
            justifyContent: "flex-start"
          }}>
            <Typography style={{
              width: '60%',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: DARK_300, fontSize: 12,
              overflow: 'hidden',
            }}>by {proposal.proposer}</Typography>
            <Typography style={{ color: DARK_300, fontSize: 12, marginLeft: 10 }}>
              {moment.unix(proposal.proposalTime).format('MMM Do YY')}
            </Typography>
          </Box>

          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginTop: 20,
              width: '100%',
            }}
          >
            <Typography style={{ fontWeight: 'bold' }} variant="h4">
              Your Vote
            </Typography>
            <Button
              style={{ width: '100%', border: '1px solid gray', marginTop: 6 }}
              onClick={() => voteContract(1)}
            >
              Yes
            </Button>
            <Button
              style={{ width: '100%', border: '1px solid gray', marginTop: 6 }}
              onClick={() => voteContract(0)}
            >
              No
            </Button>
            <Button
              variant="contained"
              color={
                balance && Object.keys(balance)?.length && balance.balance / 1e18 >= 100
                  ? 'secondary'
                  : ''
              }
              style={{ marginTop: 10, width: '100%' }}
              disabled={balance && Object.keys(balance)?.length && balance.balance / 1e18 < 100}
            >
              Vote
            </Button>
          </Box>

          <Box
            style={{
              padding: 20,
              width: '100%',
              border: '1px solid gray',
              borderRadius: 10,
              marginTop: 30,
            }}
          >
            <Typography style={{ fontWeight: 'bold' }} variant="h4">
              Current Results
            </Typography>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <p>Yes - {details.forVotes / 1e18} Votes</p>
              <Box
                style={{
                  width: "100%",
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  borderRadius: 10,
                  background: LIGHT_500,
                }}
              >
                <Box
                  style={{
                    width: `${(details.forVotes / 1e18) / 100}%`,
                    height: 4,
                    background: PRIMARY,
                    borderRadius: 10,
                  }}
                />
              </Box>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <p>No - {details.againstVotes / 1e18} Votes</p>
              <Box
                style={{
                  width: '100%',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  borderRadius: 10,
                  background: LIGHT_500,
                }}
              >
                <Box
                  style={{
                    width: `${(details.againstVotes / 1e18) / 100}%`,
                    height: 4,
                    background: PRIMARY,
                    borderRadius: 10,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DaoDetails;
