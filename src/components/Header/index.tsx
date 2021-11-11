import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import useWeb3 from '../../hooks/useWeb3';
import { SearchIcon, LoadingIcon, WalletIcon } from "../icons";
import { HistoryTokenContext } from '../../contexts/HistoryTokenContext';
import { getTokenInfo } from '../../utils/web3';
import logoImage from "../../assets/images/logo.png";

import styles from './index.module.scss';

let timeout: any;

function Header({ onOpenWalletModal }: { onOpenWalletModal: any }) {
  const history = useHistory()
  const params: any = useParams()
  const { web3, account } = useWeb3()
  const { isExists, historyTokens, handleAddHistoryTokens } = useContext(HistoryTokenContext)

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null)

  const handleOnChange = (event: any) => {
    setSearch(event?.target?.value)
  }

  const handleGetTokenInfo = useCallback(async (_tokenAddress) => {
    let _result;
    setLoading(true)
    try {
      _result = await getTokenInfo(web3, _tokenAddress)
    } catch (error) {
      console.error(error)
    }
    setResult(_result)
    setLoading(false)
  }, [web3])

  useEffect(() => {
    if (timeout) clearTimeout(timeout)
    if (!search) {
      setResult(null)
    } else {
      timeout = setTimeout(() => {
        handleGetTokenInfo(search)
      }, 800)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [handleGetTokenInfo, search])

  useEffect(() => {
    if (params?.tokenAddress) {
      setSearch(params.tokenAddress)
      handleGetTokenInfo(params.tokenAddress)
    } else {
      setSearch("")
    }
  }, [handleGetTokenInfo, params.tokenAddress])

  const goToDetail = (token: any) => {
    if (!isExists[token.address]) {
      handleAddHistoryTokens(token)
    }
    console.log(`/token/${token.address}`)
    window.location.href = `/token/${token.address}`
  }
  
  const formattedAccount = (_account: string) => {
    return account?.slice(0, 2) + "..." + account?.slice(-4)
  }

  return (
    <div className={styles.wrapper}>
      <div className="container mx-auto">
        <div 
          className="wrapper-logo pointer flex align-items-center" 
          onClick={() => {
            setSearch("")
            history.push("/")
          }}
        >
          <img className="logo-image mr" src={logoImage} alt="logo"  />
          <span className="logo-text">MDC Swap</span>
        </div>
        <div className="wrapper-input-search">
          <div className="wrapper-content">
            <input autoComplete="nope" value={search}  placeholder="Enter a token address" onChange={handleOnChange} />
            <div className="wrapper-icon">
              {
                loading 
                ? <LoadingIcon className="loading-icon" width={22} height={22} />
                : <SearchIcon className="search-icon" width={22} height={22} />
              }
            </div>
            <div className="search-results">
              {
                result
                ? <div className="result-item" onClick={() => goToDetail(result)}>
                    <span className="result-item__name">{ result.name } ({ result.symbol })</span> <br />
                    <small>{ result.address }</small>
                  </div>
                : null
              }
              {
                historyTokens
                  .filter((token: any) => token.address !== search)
                  .map((token: any) => (
                    <div key={token.address} className="result-item" onClick={() => goToDetail(token)}>
                      <span className="result-item__name">{ token.name } ({ token.symbol })</span> <br />
                      <small>{ token.address }</small>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
        <div className="connect-wallet-btn" onClick={onOpenWalletModal}>
          <div className="wrapper-wallet-address">
            { account ? formattedAccount(account) : "Connect wallet" }
            <div className="livenow" />
          </div>
          <div className="wrapper-wallet-icon">
            <WalletIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;