export const networkConfigs = {
    "0x13881": {
      chainId: 80001,
      chainName: "Mumbai",
      currencyName: "MATIC",
      currencySymbol: "MATIC",
      rpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_NODES_KEY}`,
      blockExplorerUrl: "https://mumbai.polygonscan.com/",
    },
    "0x89": {
      chainId: 137,
      chainName: "Polygon",
      currencyName: "MATIC",
      currencySymbol: "MATIC",
      rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_NODES_KEY}`,
      blockExplorerUrl: "https://polygonscan.com/",
    }
  };