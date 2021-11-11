// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import useWeb3 from "../../hooks/useWeb3";
import { getAmountsOut, getBalance, getTokenPrice, mdcSwap, pancakeSwap } from "../../utils/web3";
import { ExchangeIcon, LoadingIcon } from "../icons";
import SelectTokenModal from "../SelectTokenModal";
import { formatPrice } from "../../utils";
import { WBNB } from "../../configs";

import styles from "./index.module.scss";
import useApprove from "../../hooks/useApprove";

let intervalPrice: any;
let intervalValue: any;

export default function TokenSwap({ tokenInfo }: { tokenInfo: any }) {
  const { web3, account, sending, setSending, success, setSuccess } = useWeb3()
  const [typeChangeToken, setTypeChangeToken] = useState("");
  const [contract, setContract] = useState("pancakeSwap");
  const [visibleSelectTokenModal, setVisibleSelectTokenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [typeFixed, setTypeFixed] = useState("fromToken");
  const [txHash, setTxHash] = useState("")
  const [isReverse, setIsReverse] = useState(false)

  const [fromToken, setFromToken] = useState({
    address: WBNB,
    decimals: 18,
    symbol: "BNB",
    value: "",
    balance: 0,
  });

  const [toToken, setToToken] = useState({
    address: "",
    decimals: 18,
    symbol: "",
    value: "",
    balance: 0,
  });

  const [pairInfo, setPairInfo] = useState({
    minimumReceived: 0,
    maximumSold: 0,
    price: 0,
    lp: 0,
    slippage: 0,
  })

  const { isApproved, handleApprove } = useApprove(web3, fromToken.address, account, Number(fromToken.value || 0), fromToken.decimals)

  useEffect(() => {
    if (tokenInfo && !toToken.address) {
      setToToken({
        ...toToken,
        ...tokenInfo
      })
    }
  }, [toToken, toToken.address, tokenInfo])

  const handleChangeFromToken = (dataUpdate: any) => {
    setFromToken({
      ...fromToken,
      ...dataUpdate,
    });
  };

  const handleChangeToToken = (dataUpdate: any) => {
    setToToken({
      ...toToken,
      ...dataUpdate,
    });
  };

  const onOpenSelectTokenModal = (type: string) => {
    setTypeChangeToken(type)
    setVisibleSelectTokenModal(true)
  }

  const onCloseSelectTokenModal = () => {
    setTypeChangeToken("");
    setVisibleSelectTokenModal(false)
  }

  const handleSetMax = () => {
    setTypeFixed("fromToken")
    setFromToken({
      ...fromToken,
      value: fromToken.balance.toString()
    })
  }

  const onChangeToken = (token: any) => {
    if (typeChangeToken === "toToken") {
      setToToken({
        ...toToken,
        ...token,
        value: "",
      })
    } else if (typeChangeToken === "fromToken") {
      setFromToken({
        ...fromToken,
        ...token,
        value: "",
      })
    }
  }

  useEffect(() => {
    async function handleSuccess() {
      if (intervalValue) clearInterval(intervalValue)
      if (intervalPrice) clearInterval(intervalPrice)
      
      const fromTokenNewBalance = await web3.eth.getBalance(account);
      const toTokenNewBalance =  await getBalance(web3, toToken.address, account)

      setFromToken({
        ...fromToken,
        balance: fromTokenNewBalance / Math.pow(10, fromToken.decimals),
        value: ""
      })

      setToToken({
        ...toToken,
        balance: toTokenNewBalance / Math.pow(10, toToken.decimals),
        value: ""
      })

      setSuccess(success.filter((s: any) => s !== txHash))
    }
    if (txHash && success.includes(txHash)) {
      handleSuccess()
    }
  }, [success, setSuccess, txHash, web3, account, toToken, fromToken])

  const handleExchange = () => {
    const _fromToken = { ...toToken }
    const _toToken = { ...fromToken };

    setToToken(_toToken)
    setFromToken(_fromToken)
    setIsReverse(!isReverse)
  }

  const handleSwap = async () => {
    try {
      let _txHash;
      if (contract === "mdcSwap") {
        _txHash = await mdcSwap(web3, fromToken.value, toToken.address, account)
      } else {
        _txHash = await pancakeSwap(web3, fromToken.value, toToken.address, account)
      }
      setTxHash(_txHash)
      setSending({
        ...sending,
        [_txHash]: true
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function getFromTokenBalance() {
      if (!fromToken.address || !account) return
      try {
        let balance: any = 0;

        if (fromToken.address === WBNB) {
          balance = await web3.eth.getBalance(account);
        } else {
          balance = await getBalance(web3, fromToken.address, account)
        }
        
        setFromToken(_fromToken => ({
          ..._fromToken,
          balance: balance / Math.pow(10, _fromToken.decimals)
        }))
      } catch (error) {
        console.error(error)
      }
    }
    getFromTokenBalance()
  }, [fromToken.address, account, web3])

  useEffect(() => {
    async function getFromTokenBalance() {
      if (!toToken.address || !account) return
      try {
        let balance: any = 0;

        if (toToken.address === WBNB) {
          balance = await web3.eth.getBalance(account);
        } else {
          balance = await getBalance(web3, toToken.address, account)
        }
        
        setToToken(_toToken => ({
          ..._toToken,
          balance: balance / Math.pow(10, _toToken.decimals)
        }))
      } catch (error) {
        console.error(error)
      }
    }
    getFromTokenBalance()
  }, [toToken.address, account, web3])

  const typeSwap = useMemo(() => {
    if (fromToken.address === WBNB) {
      return "BUY"
    } else if (toToken.address === WBNB) {
      return "SELL"
    } else return "SWAP"
  }, [fromToken.address, toToken.address]);

  useEffect(() => {
    if (Number(fromToken.value) > Number(fromToken.balance)) {
      setErrorMessage(`Insufficient ${fromToken.symbol} balance`)
    } else {
      setErrorMessage("")
    }
  }, [fromToken]);

  const handleGetTokenPrice = useCallback(async (token) => {
    try {
      const response: any = await getTokenPrice(web3, token)

      setPairInfo(_pairInfo => ({
        ..._pairInfo,
        price: isReverse ? 1/response.price : response.price,
        lp: response.lp,
      }))
    } catch (error) {
      console.error(error)
    }
  }, [isReverse, web3])

  const getRealValue = useCallback(async (toAddress, fromValue, decimals, _isReverse) => {
    try {
      if (true || typeSwap === "BUY") {
        const amountsOutArray = await getAmountsOut(web3, Number(fromValue), toAddress, decimals, _isReverse)
        const amountsOut = amountsOutArray[1] / Math.pow(10, toToken.decimals)
        setPairInfo((_pairInfo) => ({
          ..._pairInfo,
          minimumReceived: amountsOut
        }))
      } else {
        // get amountsIn
      }
    } catch (error) {
      console.error(error)
    }
  }, [toToken.decimals, typeSwap, web3])

  useEffect(() => {
    if (intervalValue) clearInterval(intervalValue)
    const tokenAdress = isReverse ? fromToken : toToken;
    if (fromToken.value && toToken.value) {
      getRealValue(tokenAdress.address, fromToken.value, fromToken.decimals, isReverse)
      intervalValue = setInterval(() => {
        getRealValue(tokenAdress.address, fromToken.value, fromToken.decimals, isReverse)
      }, 1000)
    }
    return () => {
      if (intervalValue) clearInterval(intervalValue)
    }
  }, [isReverse, fromToken, toToken, getRealValue])

  useEffect(() => {
    if (intervalPrice) clearInterval(intervalPrice)
    const tokenToGetPrice = isReverse ? fromToken : toToken
    if (tokenToGetPrice.address && tokenToGetPrice.decimals) {
      handleGetTokenPrice({ address: tokenToGetPrice.address, decimals: tokenToGetPrice.decimals })
      intervalPrice = setInterval(() => {
        handleGetTokenPrice({ address: tokenToGetPrice.address, decimals: tokenToGetPrice.decimals })
      }, 1000)
    }
    return () => {
      if (intervalPrice) clearInterval(intervalPrice)
    }
  }, [fromToken, toToken, isReverse, handleGetTokenPrice])

  useEffect(() => {
    if (!fromToken.address || !toToken.address) return

    if (typeFixed === "fromToken") {
      let value = 0;
  
      if (fromToken.value) {
        value = Number(fromToken.value) / pairInfo.price
      }
  
      setToToken(_toToken => ({
        ..._toToken,
        value: value ? value.toString() : ""
      }))
    } else {
      let value = 0;
  
      if (toToken.value) {
        value = Number(toToken.value) * pairInfo.price
      }
  
      setFromToken(_fromToken => ({
        ..._fromToken,
        value: value ? value.toString() : ""
      }))
    }
  }, [typeFixed, fromToken.value, toToken.value, toToken.address, fromToken.address, pairInfo.price])

  return (
    <div className={styles.wrapper}>
      <div className="choose-contract">
        <div className="list-contract">
          <span
            className={
              "contract-item" + (contract === "mdcswap" ? " is-active" : "")
            }
            onClick={() => setContract("mdcswap")}
          >
            MDC Swap
          </span>
          <span> | </span>
          <span
            className={
              "contract-item" + (contract === "pancakeSwap" ? " is-active" : "")
            }
            onClick={() => setContract("pancakeSwap")}
          >
            Pc v2
          </span>
        </div>
      </div>
      <div className="split" />
      {
        contract === "mdcswap"
          ? <div className="text-require-swap">Hold minimum 10$ MetaDogeCat to using MC swap contract to hidden bot checking</div>
          : null
      }
      <div className="wrapper-token mt-1">
        <div className="mb label flex align-items-center justify-content-space-between">
          <span>From</span>
          <span>Balance: { formatPrice(fromToken.balance) }</span>
        </div>
        <div className="wrapper-input flex align-items-center">
          <input
            onFocus={() => setTypeFixed("fromToken")}
            value={fromToken.value}
            placeholder="0.0"
            type="number"
            onChange={(event) =>
              handleChangeFromToken({
                value: event.target.value ? Number(event.target.value) : "",
              })
            }
          />
          <div className="flex">
            <button onClick={handleSetMax} className="text-success mr-1 max-btn">Max</button>
            <span 
              className={classNames("token-symbol", { "pointer": contract !== "mdcswap" })}
              onClick={() => {
                if (isReverse) {
                  onOpenSelectTokenModal("fromToken")
                }
              }}
            >
              { fromToken.symbol }
            </span>
          </div>
        </div>
      </div>

      <div className="wrapper-exchange-icon" onClick={handleExchange}>
        <ExchangeIcon />
      </div>

      <div className="wrapper-token">
        <div className="mb label flex align-items-center justify-content-space-between">
          <span>To (estimate)</span>
          { toToken.address ? <span>Balance: { formatPrice(toToken.balance) }</span> : null }
        </div>
        <div className="wrapper-input flex align-items-center">
          <input 
            onFocus={() => setTypeFixed("toToken")}
            placeholder="0.0" 
            type="number" 
            value={toToken.value}
            onChange={(event) =>
              handleChangeToToken({
                value: event.target.value ? Number(event.target.value) : "",
              })
            }
          />
          <span className="token-symbol pointer" onClick={() => {
            if (!isReverse) {
              onOpenSelectTokenModal("toToken")
            }
          }}>
            { toToken.symbol || "Select a token" }
          </span>
        </div>
      </div>
      
      {
        fromToken.value && toToken.address
        ? <>
            <div className="swap-info mt-1">
              <p><span className="text-muted">Slippage:</span> <span className="text-success">Auto</span></p>
              <p><span className="text-muted">Minimum Received:</span> { formatPrice(pairInfo.minimumReceived) } { toToken.symbol }</p>
              <p><span className="text-muted">Price:</span> { formatPrice(pairInfo.price) } { isReverse ? fromToken.symbol : "BNB" }/{ isReverse ? "BNB" : toToken.symbol }</p>
            </div>
            <div className="swap-route text-muted mt-1">
              {
                isReverse
                ? <span>{ fromToken.symbol } &gt; WBNB</span>
                : <span>WBNB &gt; { toToken.symbol }</span>
              }
            </div>
            {
              errorMessage
              ? <div className="text-danger error-message mt-1">
                  { errorMessage }
                </div>
              : null
            }
          </>
        : null
      }

      <div className="wrapper-action mt-1">
        {
          !isApproved
          ? <button 
              className="btn-action"
              disabled={ true || toToken.address === fromToken.address || sending[txHash] }
              onClick={handleApprove}
            >
              {/* <span>Approve</span> */}
              <span>Comming soon</span>
              { sending[txHash] ? <span className="loading-icon ml"><LoadingIcon /></span> : null }
            </button>
          : <button 
              className="btn-action"
              disabled={ true || !toToken.value || !fromToken.value || toToken.address === fromToken.address || sending[txHash] }
              onClick={handleSwap}
            >
              {/* <span>Swap</span> */}
              <span>Comming soon</span>
              { sending[txHash] ? <span className="loading-icon ml"><LoadingIcon /></span> : null }
            </button>
        }
      </div>


      <SelectTokenModal
        visible={visibleSelectTokenModal}
        onClose={onCloseSelectTokenModal}
        onChange={onChangeToken}
      />
    </div>
  );
}
