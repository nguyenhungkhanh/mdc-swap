// @ts-nocheck
import { useState, createContext, useEffect, useCallback, useMemo } from "react";

const HistoryTokenContext = createContext<any>(null);

const defaultHistoryTokens = JSON.stringify({
  "0x5566af9836828e9f4d6616b5dffa366ed0d65fe6": {
    address: "0x5566af9836828e9f4d6616b5dffa366ed0d65fe6",
    decimals: "9",
    is_favourite: true,
    name: "Meta Doge Cat",
    symbol: "MetaDogeCat",
    totalSupply: "24200000000000000000000000000"
  }
})

const HistoryTokenProvider = ({ children }: { children: any }) => {
  const [historyTokens, setHistoryTokens] = useState<any>({})

  useEffect(() => { 
    let _historyTokens: any = {}

    try {
      _historyTokens = JSON.parse(localStorage.getItem("history_tokens") || defaultHistoryTokens)
    } catch (error) {}

    setHistoryTokens(_historyTokens)
  }, [])

  const handleAddHistoryTokens = useCallback((_token) => {
    setHistoryTokens((_historyTokens) => {
      return {
        [_token.address]: {
          ..._token, is_favourite: false
        },
        ..._historyTokens
      }
    })
  }, [])

  const handleSetFavourite = useCallback((_token) => {
    setHistoryTokens((_historyTokens) => {
      const _isFavourite = _historyTokens[_token.address]?.is_favourite || false
      return {
        ..._historyTokens,
        [_token.address]: {
          ..._token,
          is_favourite: !_isFavourite
        },
      }
    })
  }, [])

  useEffect(() => {
    localStorage.setItem("history_tokens", JSON.stringify(historyTokens))
  }, [historyTokens])

  const isExists = useCallback((tokenAddress) => {
    return historyTokens[tokenAddress]
  }, [historyTokens])

  const isFavourite = useCallback((tokenAddress) => {
    return historyTokens[tokenAddress] && historyTokens[tokenAddress].is_favourite 
  }, [historyTokens])

  const historyTokensMemo = useMemo(() => {
    let _historyTokensMemo = []

    for (const address in historyTokens) {
      _historyTokensMemo.push(historyTokens[address])
    }

    return _historyTokensMemo
  }, [historyTokens])

  const value = { historyTokens: historyTokensMemo, isExists, isFavourite, handleAddHistoryTokens, handleSetFavourite }

  return (
    <HistoryTokenContext.Provider value={value}>
      { children }
    </HistoryTokenContext.Provider>
  )
}

export { HistoryTokenContext, HistoryTokenProvider }
