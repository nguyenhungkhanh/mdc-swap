import { useCallback, useEffect, useState } from "react"
import abiERC20 from "../abis/erc20.json"
import { WBNB } from "../configs"
import { toFixedNumber } from "../utils"

export default function useApprove(web3: any, tokenAddress: any, account: any, amount: number, tokenDecimal: any) {
  const [isApproved, setIsApproved] = useState(true)

  useEffect(() => {
    async function getIsApproved() {
      if (tokenAddress.toLowerCase() === WBNB.toLowerCase()) {
        setIsApproved(true)
        return
      }

      let _isApproved = false

      try {
        const contract = new web3.eth.Contract(abiERC20, tokenAddress);
        const amountApprove = toFixedNumber((amount * Math.pow(10, tokenDecimal))).toString()
        _isApproved = await contract.methods.approve(account, amountApprove).call()
      } catch (error) {}

      setIsApproved(_isApproved)
    }
    if (amount) {
      getIsApproved()
    }
  }, [account, amount, tokenAddress, tokenDecimal, web3.eth.Contract])

  const handleApprove = useCallback(async () => {
    try {
      const contract = new web3.eth.Contract(abiERC20, tokenAddress);
      const amountApprove = toFixedNumber((amount * Math.pow(10, tokenDecimal))).toString()
      await contract.methods.approve(account, amountApprove).send({ from: account })
    } catch (error) {
      console.error(error)
    }
  }, [account, amount, tokenAddress, tokenDecimal, web3.eth.Contract])

  return { isApproved, handleApprove}
}