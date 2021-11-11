import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { Web3ReactProvider } from "./contexts/Web3ReactContext";

import './index.scss';
import { HistoryTokenProvider } from './contexts/HistoryTokenContext';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider>
      <HistoryTokenProvider>
        <App />
      </HistoryTokenProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
