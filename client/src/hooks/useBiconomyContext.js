import { useContext } from "react";
import { BiconomyContext } from "../context/BiconomyProviderMarketplace";

const useBiconomyContext = () => {
  const biconomyContext = useContext(BiconomyContext);
  return biconomyContext;
};

export default useBiconomyContext;