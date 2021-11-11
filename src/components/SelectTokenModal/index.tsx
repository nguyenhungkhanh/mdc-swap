import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames';
import useWeb3 from '../../hooks/useWeb3';
import { CloseIcon, LoadingIcon } from "../icons";
import { getTokenInfo } from "../../utils/web3";
import { defaultTokens } from "../../contants";

import styles from './index.module.scss'

let timeout: any;

export default function SelectTokenModal({ visible, onClose, onChange }: { visible: boolean, onClose: any, onChange: Function }) {
  const [result, setResult] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false);

  const { web3 } = useWeb3()

  useEffect(() => {
    if (!visible) {
      setResult(null)
      setSearch("")
      setLoading(false)
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [visible])

  const handleSearch = useCallback(async() => {
    if (!search) {
      setResult(null)
      return
    }

    setLoading(true)

    const token = await getTokenInfo(web3, search)

    setTimeout(() => {
      setResult(token)
      setLoading(false)
    }, 500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  if (!visible) return null

  const handleChangeSearch = (event: any) => {
    if (timeout) clearTimeout(timeout)
    if (!event.target.value || event.target.value.length !== 42) {
      setSearch("")
      return
    }
    timeout = setTimeout(() => {
      setSearch(event.target.value)
    }, 1000)
  }

  const handleOnChange = (_token: any) => {
    const t = { ..._token }
    delete t.logo

    onChange(t)
    onClose()
  }

  return (
    <div className={styles.wrapper}>
      <div className="modal">
        <div className="modal-header flex justify-content-space-between">
          <span className="modal-header__title">
            Select a token
          </span>
          <div onClick={onClose}><CloseIcon /></div>
        </div>
        <div className="modal-body">
          <div className="wrapper-select-token-input">
            <input 
              placeholder="Enter a token address" 
              autoComplete="none" 
              className="w-100" 
              onChange={handleChangeSearch} 
            />
            {
              loading
              ? <div className="wrapper-loading-icon">
                  <LoadingIcon />
                </div>
              : null
            }
            <div className={classNames("list-results", { "is-show": result || search})}>
              {
                result
                ? <div className="result-item" onClick={() => handleOnChange(result)}>
                    <span className="result-name">{ result.name } ({ result.symbol })</span><br />
                    <small className="result-address">{ result.address }</small>
                  </div>
                : (
                  search && !loading
                    ? <div className="result-item">
                        <span>No option</span>
                      </div> 
                    : null
                  )
              }
            </div>
          </div>
          <div className="list-tokens mt-1">
            <div className="list-tokens__header">Token</div>
            {
              defaultTokens.map((t: any) => (
                <div key={t.address} className="token-item" onClick={() => handleOnChange(t)}>
                  <img className="token-item__logo mr" src={t.logo} alt="" />
                  <span className="token-item__name">{ t.symbol }</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}