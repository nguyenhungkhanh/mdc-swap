// @ts-nocheck
import abiDecoder from "abi-decoder"
import abiERC20 from "../abis/erc20.json"
import abiPancakeFactory from "../abis/pancake_factory.json"
import abiPancakeRouter from "../abis/pancake_router.json"
import abiMDCSwap from "../abis/mdc_swap.json"
import abiERC20TransferEvent from "../abis/erc20_transfer_event.json"
import { WBNB, PANCAKE_ROUTER, PANCAKE_FACTORY, MDC_SWAP, DEAD } from "../configs"
import { decodeAddress, toFixedNumber } from "./index";

export const getBalance = async function (web3: any, tokenAddress: any, account: any) {
  const abi = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];
  
  const contract = new web3.eth.Contract(abi, tokenAddress);
  const balance = await contract.methods.balanceOf(account).call();
  return balance
}

export const getTokenInfo = async function(web3: any, tokenAddress: any) {
  try {
    const contract = await new web3.eth.Contract(abiERC20, tokenAddress)
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const decimals = await contract.methods.decimals().call();
    const totalSupply = await contract.methods.totalSupply().call();

    return { name, symbol, decimals, address: tokenAddress, totalSupply  }
  } catch(error) {
    return null
  }
}

export const getPair = async function(web3: any, tokenAddress: any) {
  try {
    const pancakeFactoryContract = await new web3.eth.Contract(abiPancakeFactory, PANCAKE_FACTORY)
    return pancakeFactoryContract.methods.getPair(tokenAddress, WBNB).call();
  } catch (error) {
    console.error(error)
  }
}

export const getTokenPrice = async function(web3: any, _token: any) {
  function getPrice (decimals: any, getReserves: any, is_reverse: any, is_price_in_peg = false) {
    let ETHER = Math.pow(10, 18);

    let price = 0, peg_reserve = 0, token_reserve = 0, reserve0 = getReserves[0], reserve1 = getReserves[1];

    if (is_reverse) {
      peg_reserve = reserve0;
      token_reserve = reserve1;
    } else {
      peg_reserve = reserve1;
      token_reserve = reserve0;
    }

    if (token_reserve && peg_reserve) {
      if (is_price_in_peg) {
        price = (Number(token_reserve) / Math.pow(10, decimals)) / (Number(peg_reserve) / Number(ETHER));
      } else {
        price = (Number(peg_reserve) / Number(ETHER)) / (Number(token_reserve) / Math.pow(10, decimals));
      }
    }

    return price;
  };

  try {
    const pair = await getPair(web3, _token.address)
    const pairContract = await new web3.eth.Contract(abiPancakeFactory, pair);

    const isReversed = (await pairContract.methods.token0().call()) === WBNB;
    const getReserves = await pairContract.methods.getReserves().call();

    return {
      price: getPrice(_token.decimals, getReserves, isReversed),
      lp: isReversed ? (parseFloat(getReserves._reserve0) / Math.pow(10, 18)) : (parseFloat(getReserves._reserve1) / Math.pow(10, 18)),
      pair: pair.toLowerCase()
    }
  } catch (error) {
    console.log(error)
    return 0
  }
}

export const getAmountsOut = async function(web3: any, value: any, tokenAddress: any, tokenDecimal: any, isReversed: false) {
  try {
    const contract = await new web3.eth.Contract(abiPancakeRouter, PANCAKE_ROUTER)
    
    const amountIn = toFixedNumber(value * Math.pow(10, tokenDecimal)).toString()
    const pair = isReversed ? [tokenAddress, WBNB] : [WBNB, tokenAddress]

    const amountsOut = await contract.methods.getAmountsOut(amountIn, pair).call();
  
    return amountsOut
  } catch (error) {
    console.error(error)
    return 0
  }
}

export const mdcSwap = async function(web3: any, value: any, tokenAddress: any, account: any) {
  try {
    const contract = await new web3.eth.Contract(abiMDCSwap, MDC_SWAP);

    const data = contract.methods.mdcSwap(web3.utils.stringToHex(decodeAddress(tokenAddress)));
    
    const amount = value * Math.pow(10, 18);
    const amountToBuyWith = web3.utils.toHex(amount)
      
    const transactionParameters = {
      to: MDC_SWAP, // Required except during contract publications.
      from: account, // must match user's active address.
      value: web3.utils.toHex(amountToBuyWith), // Only required to send ether to the recipient from the initiating external account.
      data: data.encodeABI(), // Optional, but used for defining smart contract creation and interaction.
    };
  
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await web3.currentProvider.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    
    return txHash
  } catch (error) {
    console.error(error)
    return null
  }
}

export const pancakeSwap = async function(web3: any, value: any, tokenAddress: any, account: any) {
  try {
    const contract = await new web3.eth.Contract(abiPancakeRouter, PANCAKE_ROUTER);

    const data = contract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
      0,
      [WBNB, tokenAddress],
      account,
      web3.utils.toHex(Math.round(Date.now()/1000)+60*20)
    );

    const amount = value * Math.pow(10, 18);
    const amountToBuyWith = web3.utils.toHex(amount)
      
    const transactionParameters = {
      to: PANCAKE_ROUTER, // Required except during contract publications.
      from: account, // must match user's active address.
      value: web3.utils.toHex(amountToBuyWith), // Only required to send ether to the recipient from the initiating external account.
      data: data.encodeABI(), // Optional, but used for defining smart contract creation and interaction.
    };
  
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await web3.currentProvider.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    
    return txHash
  } catch (error) {
    console.error(error)
    return null
  }
}

export const decodeReceiptTransaction = async function (web3: any, pairAddress: any, tokenInfo: any, txHash: any) {  
  abiDecoder.addABI(abiERC20TransferEvent)
  
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  const decodedLogs = abiDecoder.decodeLogs(receipt.logs);

  const tokenAddress = tokenInfo.address.toLowerCase();
  const receiptFrom = receipt.from.toLowerCase()
  const pancakeRouter = PANCAKE_ROUTER.toLowerCase()
  const WBNBAddress = WBNB.toLowerCase()

  const isEventSell = (event, logAddress) => {
    const from = event[0].value.toLowerCase();
    const to = event[1].value.toLowerCase();

    return logAddress === tokenAddress && [receiptFrom, tokenAddress].includes(from) && to !== tokenAddress;
  }

  const isEventGain = (event, logAddress) => {
    const from = event[0].value.toLowerCase();

    return (from === pairAddress) && logAddress === WBNBAddress
  }

  const isEventBuy = (event, logAddress, prevLog) => {
    const from = event[0].value.toLowerCase();
    const to = event[1].value.toLowerCase();

    const isValid = (from === pancakeRouter && to === pairAddress) ||
      (prevLog && (prevLog.events[0].value.toLowerCase() === receiptFrom) && (prevLog.events[1].value.toLowerCase() === from) && (to === pairAddress))

    return (logAddress === WBNBAddress) && isValid
  }

  const isEventGet = (event, logAddress) => {
    const from = event[0].value.toLowerCase();
    const to = event[1].value.toLowerCase();

    const isValid = (from === pairAddress && [tokenAddress, receiptFrom].includes(to)) ||
      (from === pairAddress && to === DEAD)

    return logAddress === tokenAddress && isValid
  }

  let blocks = [];
  let currentType;

  function handleBreak(event, logAddress, prevLog) {
    if (isEventSell(event, logAddress)) currentType = "SELL"
    if (isEventBuy(event, logAddress, prevLog)) currentType = "BUY"

    if (currentType) {
      blocks.push({
        blockNumber: receipt.blockNumber,
        type: currentType,
        value: Number(event[2].value),
        receiveValue: 0,
      })
    }
  }

  for (let index = 0; index < decodedLogs.length; index++) {
    const log = decodedLogs[index]
    const event = log.events;
    const logAddress = log.address.toLowerCase()
    const prevLog = decodedLogs[index - 1]

    if (!currentType) {
      handleBreak(event, logAddress, prevLog)
    } else {
      const currentBlock = blocks[blocks.length - 1]

      if (currentType === "SELL") {
        if (isEventGain(event, logAddress)) {
          currentBlock.receiveValue += Number(event[2].value)
        } else if (isEventSell(event, logAddress)) {
          currentBlock.value += Number(event[2].value)
        } else {
          currentType = ""
          handleBreak(event, logAddress, prevLog)
        }
      } else {
        if (isEventGet(event, logAddress)) {
          currentBlock.receiveValue += Number(event[2].value)
        } else {
          currentType = ""
          handleBreak(event, logAddress, prevLog)
        }
      }
    }
  }

  return blocks.reverse();
}