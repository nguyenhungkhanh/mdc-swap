import { useContext } from "react";
import { Web3ReactContext } from "../contexts/Web3ReactContext";

export default function useWeb3() {
  const web3 = useContext(Web3ReactContext)

  return web3;
}