/* eslint-disable react-hooks/exhaustive-deps */
import React,{ createContext, useEffect, useState, useMemo } from "react";
import { useChain, useMoralis } from "react-moralis";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import { networkConfigs } from "../helpers/network";
import marketplaceContractAbi from "../contracts_abi/marketplaceContractAbi.json";
import marketplaceContract from "../contract_address/marketplaceContract.json"
import governanceContractAbi from "../contracts_abi/governance_abi.json";
import governanceeContract from "../contract_address/governanceContract.json"
import biconomyApiKey from "../helpers/biconomy";

export const BiconomyContext = createContext({});

const BiconomyContextProvider = (props) => {
  const { children } = props;
  const {
    isWeb3Enabled,
    web3,
    user,
    isAuthenticated,
    account,
    isWeb3EnableLoading,
    enableWeb3,
    Moralis,
  } = useMoralis();

  const { chainId } = useChain();
  const [isBiconomyInitialized, setIsBiconomyInitialized] = useState(false);
  const [biconomyProvider, setBiconomyProvider] = useState({});
  const [governanceContract, setGovernanceContract] = useState({})
  const [governanceProvider, setGovernanceProvider] = useState()
  const [contract, setContract] = useState({});
  const { abi } = marketplaceContractAbi;
  const governance_abi = governanceContractAbi.abi
  const contractAddress = useMemo(() => marketplaceContract["0x13881"], [chainId]);
  const governancecontractAddress = useMemo(() => governanceeContract["0x13881"], [chainId]);

  useEffect(() => {
    if ((isAuthenticated || account || user?.get('ethAddress')) && !isWeb3Enabled && !isWeb3EnableLoading && chainId) {
      enableWeb3();
    }
  }, [isAuthenticated, isWeb3Enabled, chainId, account]);


  useEffect(() => {
    const initializeBiconomy = async () => {
      if (isBiconomyInitialized) {
        // Resetting when reinitializing
        setIsBiconomyInitialized(false);
      }

      // let walletWeb;
      // if(
      //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      //     navigator.userAgent,
      //   )
      // ){
      //   walletWeb3 = await Moralis.enableWeb3({
      //     provider: 'walletconnect',
      //     chainId: 56});
      // }else{
        let walletWeb3 = await Moralis.enableWeb3();
      // }
      const networkProvider = new Web3.providers.HttpProvider(
        networkConfigs["0x13881"]?.rpcUrl
      );

      // if(chainId === '0x13881'){
        
        const biconomy = new Biconomy(networkProvider, {
          walletProvider: walletWeb3.currentProvider,
          apiKey: biconomyApiKey["0x13881"],
        });

        const governanceBico = new Biconomy(networkProvider, {
          walletProvider: walletWeb3.currentProvider,
          apiKey: biconomyApiKey["0x13881"],
        });
        
        setBiconomyProvider(biconomy);
        setGovernanceProvider(governanceBico)
        // This web3 instance is used to read normally and write to contract via meta transactions.
        web3.setProvider(biconomy);
        
        biconomy
        .onEvent(biconomy.READY, () => {
          // console.log("biconomy ready to rock")
          setIsBiconomyInitialized(true);
          const contractInst = new web3.eth.Contract(abi, contractAddress);
          setContract(contractInst);
        })
        .onEvent(biconomy.ERROR, (ex) => {
          // console.log("biconomy error",ex)
          // Handle error while initializing mexa
          // notification.error({
            //   message: "Biconomy Initialization Fail",
            //   description:
            //     "Biconomy has failed to initialized. Please try again later.",
            // });
          });

          governanceBico
        .onEvent(biconomy.READY, () => {
          // console.log("biconomy ready to rock")
          const contractInst = new web3.eth.Contract(governance_abi, governancecontractAddress);
          setGovernanceContract(contractInst);
        })
        .onEvent(biconomy.ERROR, (ex) => {
          // console.log("biconomy error",ex)
          // Handle error while initializing mexa
          // notification.error({
            //   message: "Biconomy Initialization Fail",
            //   description:
            //     "Biconomy has failed to initialized. Please try again later.",
            // });
          });

        // }
    };

    if ((isAuthenticated || account || user?.get('ethAddress')) && chainId !== "0x1") {
      // console.log("Biconomy")
      initializeBiconomy();
    }
  }, [
    isAuthenticated,
    isWeb3Enabled,
    chainId,
    web3,
    abi,
    contractAddress,
    Moralis,
    account
  ]);
// console.log("inside biconmy file",contract,"isBiconomyInitialized",isBiconomyInitialized, governanceProvider)
// console.log('governance', governanceContract, governanceProvider)
  return (
    <BiconomyContext.Provider
      value={{ isBiconomyInitialized, biconomyProvider, governanceProvider, governanceContract, contract }}
    >
      {children}
    </BiconomyContext.Provider>
  );
};

export default BiconomyContextProvider;
