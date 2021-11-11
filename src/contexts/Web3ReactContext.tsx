import { useState, createContext, useEffect } from "react";
import Web3 from "web3";

const WEB3_PROVIDER = process?.env?.REACT_APP_WEB3_PROVIDER || "wss://bsc-ws-node.nariox.org:443"

const Web3ReactContext = createContext<any>(null);

const Web3ReactProvider = ({ children }: { children: any }) => {
  const [web3, setWeb3] = useState<any>(null)
  const [account, setAccount] = useState("");
  const [sending, setSending] = useState<any>({})
  const [success, setSuccess] = useState([]);

  useEffect(() => { 
    let web3Instance;

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: any) => {
        if (accounts[0]) {
          setAccount(accounts[0])
        } else {
          setAccount("")
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', () => window.location.reload())
      window.ethereum.on('disconnect', () => setAccount(""))
  
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((error: any) => console.log(error))

      web3Instance = new Web3(window.ethereum);
    } else if (window.web3) {
      web3Instance = new Web3(window.web3.currentProvider);
    } else {
      web3Instance = new Web3(new Web3.providers.WebsocketProvider(WEB3_PROVIDER))
    }
    if (web3Instance) {
      setWeb3(web3Instance)
    }
  }, [])


  const value = { web3, account, sending, setSending, success, setSuccess }

  return (
    <Web3ReactContext.Provider value={value}>
      { children }
    </Web3ReactContext.Provider>
  )
}

export { Web3ReactContext, Web3ReactProvider }
