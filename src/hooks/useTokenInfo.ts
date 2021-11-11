import { useCallback, useEffect, useState } from "react";
import useWeb3 from "./useWeb3";
import { getTokenInfo } from "../utils/web3";

export default function useTokenInfo(tokenAddress: string) {
  const { web3 } = useWeb3();

  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const _getTokenInfo = useCallback(async (address) => {
    setLoading(true)
    try {
      const _tokenInfo: any = await getTokenInfo(web3, address);
      
      if (_tokenInfo) {
        setTokenInfo({
          ..._tokenInfo,
          totalSupply: _tokenInfo.totalSupply / Math.pow(10, _tokenInfo.decimals)
        })
      }
    } catch(error) {
      console.error(error)
    }
    setLoading(false)
  }, [web3])

  useEffect(() => {
    if (!tokenInfo && !loading) {
      _getTokenInfo(tokenAddress)
    }
  }, [_getTokenInfo, loading, tokenInfo, tokenAddress])

  return tokenInfo;
}