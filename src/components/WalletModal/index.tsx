import React, { useEffect, useState } from 'react'
import useWeb3 from '../../hooks/useWeb3';
import { CloseIcon, CopyIcon } from "../icons";
import metamaskImage from "../../assets/images/metamask.svg";

import styles from './index.module.scss'

export default function WalletModal({ visible, onClose }: { visible: boolean, onClose: any }) {
  const [errorMessage, setErrorMessage] = useState("");
  const { web3, account } = useWeb3()

  useEffect(() => {
    if (!visible) {
      setErrorMessage("")
    }
  }, [visible])

  if (!visible) return null

  const connectWallet = async () => {
    try {
      setErrorMessage("")
      await web3.currentProvider.request({ method: 'eth_requestAccounts' })
    } catch (error: any) {
      console.error(error)
      if (error?.message) {
        setErrorMessage(error?.message)
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className="modal">
        <div className="modal-header flex justify-content-space-between">
          <span className="modal-header__title">
            { account ? "Your wallet" : "Select a wallet" }
          </span>
          <div onClick={onClose}><CloseIcon /></div>
        </div>
        <div className="modal-body">
          {
            !account
            ? <div className="wallets">
                <div className="wallet-item" onClick={connectWallet}>
                  <img className="wallet-item__logo mr" src={metamaskImage} alt="metamask logo" /> 
                  <span className="wallet-item__name">Metamask</span>
                </div>
                {
                  errorMessage 
                  ? <div className="error-message mt-1">
                      { errorMessage }
                    </div>
                  : null
                }
                
              </div>
            : <div className="wallet-info">
                <div className="wallet-info__address flex justify-content-space-between align-items-center">
                  <span className="account-address">{ account }</span>
                  <CopyIcon />
                </div>
              </div>
          }
        </div>
        {/* {
          account
          ? <div className="modal-footer">
              <div className="wrapper-disconnect flex align-items-center" onClick={disconnectWallet}>
                <LogoutIcon /> <span className="ml">Disconnect</span>
              </div>
            </div>
          : null
        } */}
      </div>
    </div>
  )
}