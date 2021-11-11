import { useEffect, useState } from "react";

let subscription: any;

export default function useTransactions(web3: any, address: any) {
  const [txHash, setTxHash] = useState<any>({});

  useEffect(() => {
    async function getPastLogs() {
      const blockNumber = await web3.eth.getBlockNumber();
      const pastLogs = await web3.eth.getPastLogs({
        address,
        fromBlock: blockNumber - 2000,
        toBlock: "latest",
      });

      let _txHash: any = {};

      for (const log of pastLogs.reverse().slice(0, 100)) {
        if (!_txHash[log.transactionHash] && log.data !== "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
          _txHash[log.transactionHash] = log.transactionHash;
        }
      }

      setTxHash(_txHash);

      subscription = web3.eth
        .subscribe("logs", { address })
        .on("data", (log: any) => {
          setTxHash((_txHash: any) => {
            if (!_txHash[log.transactionHash] && log.data !== "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
              return { 
                [log.transactionHash]: log.transactionHash, 
                ..._txHash 
              };
            }
            return _txHash;
          });
        });
    }
    getPastLogs();

    return () => {
      if (subscription) subscription.unsubscribe();
    }
  }, [address, web3.eth, web3.utils]);

  return Object.keys(txHash);
}
