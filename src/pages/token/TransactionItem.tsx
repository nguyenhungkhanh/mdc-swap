// @ts-nocheck
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import useWeb3 from "../../hooks/useWeb3";
import { formatPrice } from "../../utils";
import { decodeReceiptTransaction } from "../../utils/web3"

let interval: any;

export default function TransactionItem({ txHash, tokenInfo, pairAddress, setRateBuySell, bnbValue } : { txHash: any, tokenInfo: any, pairAddress: any, setRateBuySell: any, bnbValue: number }) {
  const { web3, sending, setSending, success, setSuccess } = useWeb3();
  const [transactions, setTransactions] = useState<any>(null);
  const [timestamp, setTimestamp] = useState<any>(null)

  const getDetail = useCallback(async () => {
    try {
      const _transactions = await decodeReceiptTransaction(web3, pairAddress, tokenInfo, txHash)
      setTransactions(_transactions)
    } catch (error) {
      console.error(error);
    }
  }, [pairAddress, tokenInfo, txHash, web3])

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    async function getTimestamp() {
      try {
        const _timestamp = (await web3.eth.getBlock(transactions[0].blockNumber)).timestamp
        setTimestamp(_timestamp)
      } catch (error) {
        console.error(error)
      }
    }
    if (transactions && transactions[0]) {
      getTimestamp()
    }
  }, [transactions, web3.eth])

  useEffect(() => {
    if (!transactions) {
      if (interval) clearInterval(interval)
      interval = setInterval(() => {
        getDetail();
      }, 2000)
    } else {
      clearInterval(interval)
    }
  }, [getDetail, transactions])

  useEffect(() => {
    if (transactions) {
      const totalBuy = transactions.filter(t => t.type === "BUY").length
      const totalSell = transactions.filter(t => t.type === "SELL").length
      setRateBuySell({ [txHash]: { totalBuy, totalSell }})
    }
  }, [transactions, setRateBuySell, txHash])

  useEffect(() => {
    if (sending[txHash]) {
      setSending({
        ...sending,
        [txHash]: false,
      });
      setSuccess([...success, txHash]);
    }
  }, [sending, setSending, setSuccess, success, txHash]);

  return (transactions || []).map((transaction: any, index: any) => {
    const traded = transaction.type === "BUY"
      ? transaction.receiveValue / Math.pow(10, tokenInfo.decimals)
      : transaction.value / Math.pow(10, tokenInfo.decimals)

    const price = transaction.type === "BUY"
      ? transaction.value / Math.pow(10, 18)
      : transaction.receiveValue / Math.pow(10, 18)
      
    return (
      <tr
        key={`${txHash}_${index}`}
        className={
          classNames({ 
            "is-sell": transaction.type === "SELL", 
            "is-buy": transaction.type === "BUY" 
          })
        }
      >
        <td style={{ width: '15%' }}>
          { timestamp ? new Date(timestamp * 1000).toLocaleTimeString() : "loading" }
        </td>
        <td className="traded" style={{ width: '25%' }}>
          <span>{formatPrice(Math.round(traded))}</span><br />
          <small>{ tokenInfo.symbol }</small>
        </td>
        <td style={{ width: '25%' }}>
          <span>${ formatPrice(price * bnbValue, 2) }</span>
          <br />
          <small>
            { formatPrice(price, 4)} BNB
          </small>
        </td>
        <td className="price-token" style={{ width: '25%' }}>
          <span>${ formatPrice((price/traded)* bnbValue)}</span><br />
          <small>Pc v2</small>
        </td>
        <td style={{ width: '10%' }}>
          <a
            href={`https://bscscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash.slice(0, 6)}
          </a>
        </td>
      </tr>
    )
  })
}
